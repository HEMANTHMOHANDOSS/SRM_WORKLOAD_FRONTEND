const { Timetable, TimetableSlot, Subject, User, Room, Department } = require('../models');
const timetableGenerator = require('../utils/timetableGenerator');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class TimetableController {
  async getAllTimetables(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        department_id,
        academic_year,
        semester,
        status
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (department_id) where.department_id = department_id;
      if (academic_year) where.academic_year = academic_year;
      if (semester) where.semester = semester;
      if (status) where.status = status;

      const { count, rows: timetables } = await Timetable.findAndCountAll({
        where,
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name', 'code']
          },
          {
            model: User,
            as: 'generator',
            attributes: ['id', 'first_name', 'last_name']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          timetables,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get all timetables error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch timetables'
      });
    }
  }

  async getTimetableById(req, res) {
    try {
      const { id } = req.params;

      const timetable = await Timetable.findByPk(id, {
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name', 'code']
          },
          {
            model: User,
            as: 'generator',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: TimetableSlot,
            as: 'slots',
            include: [
              {
                model: Subject,
                as: 'subject',
                attributes: ['id', 'name', 'code', 'type']
              },
              {
                model: User,
                as: 'instructor',
                attributes: ['id', 'first_name', 'last_name']
              },
              {
                model: Room,
                as: 'room',
                attributes: ['id', 'name', 'code', 'type']
              }
            ]
          }
        ]
      });

      if (!timetable) {
        return res.status(404).json({
          success: false,
          message: 'Timetable not found'
        });
      }

      res.json({
        success: true,
        data: { timetable }
      });
    } catch (error) {
      logger.error('Get timetable by ID error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch timetable'
      });
    }
  }

  async createTimetable(req, res) {
    try {
      const {
        name,
        department_id,
        academic_year,
        semester,
        year_level,
        section,
        effective_from,
        effective_to
      } = req.body;

      const timetable = await Timetable.create({
        name,
        department_id,
        academic_year,
        semester,
        year_level,
        section,
        generated_by: req.user.id,
        effective_from,
        effective_to,
        status: 'draft'
      });

      const createdTimetable = await Timetable.findByPk(timetable.id, {
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Timetable created successfully',
        data: { timetable: createdTimetable }
      });
    } catch (error) {
      logger.error('Create timetable error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to create timetable'
      });
    }
  }

  async generateTimetable(req, res) {
    try {
      const { id } = req.params;
      const { constraints } = req.body;

      const timetable = await Timetable.findByPk(id);
      if (!timetable) {
        return res.status(404).json({
          success: false,
          message: 'Timetable not found'
        });
      }

      // Get subjects for this timetable
      const subjects = await Subject.findAll({
        where: {
          department_id: timetable.department_id,
          semester: timetable.year_level,
          status: 'active'
        },
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'max_hours_per_week']
        }]
      });

      // Get available rooms
      const rooms = await Room.findAll({
        where: {
          department_id: timetable.department_id,
          status: 'available'
        }
      });

      // Get instructors
      const instructors = await User.findAll({
        where: {
          department_id: timetable.department_id,
          role: 'staff',
          status: 'active'
        }
      });

      // Generate timetable using AI algorithm
      const generationResult = await timetableGenerator.generateTimetable(
        subjects,
        constraints,
        rooms,
        instructors
      );

      // Clear existing slots
      await TimetableSlot.destroy({
        where: { timetable_id: id }
      });

      // Create new slots
      const slotsToCreate = generationResult.schedule.map(slot => ({
        ...slot,
        timetable_id: id
      }));

      await TimetableSlot.bulkCreate(slotsToCreate);

      // Update timetable
      await timetable.update({
        constraints_used: constraints,
        conflicts_count: generationResult.conflicts.length,
        generation_method: 'ai_generated',
        status: 'draft'
      });

      res.json({
        success: true,
        message: 'Timetable generated successfully',
        data: {
          timetable_id: id,
          conflicts: generationResult.conflicts,
          statistics: generationResult.statistics
        }
      });
    } catch (error) {
      logger.error('Generate timetable error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to generate timetable'
      });
    }
  }

  async updateTimetableSlot(req, res) {
    try {
      const { id, slotId } = req.params;
      const updateData = req.body;

      const slot = await TimetableSlot.findOne({
        where: {
          id: slotId,
          timetable_id: id
        }
      });

      if (!slot) {
        return res.status(404).json({
          success: false,
          message: 'Timetable slot not found'
        });
      }

      await slot.update(updateData);

      const updatedSlot = await TimetableSlot.findByPk(slotId, {
        include: [
          {
            model: Subject,
            as: 'subject',
            attributes: ['id', 'name', 'code', 'type']
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Room,
            as: 'room',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Timetable slot updated successfully',
        data: { slot: updatedSlot }
      });
    } catch (error) {
      logger.error('Update timetable slot error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to update timetable slot'
      });
    }
  }

  async publishTimetable(req, res) {
    try {
      const { id } = req.params;

      const timetable = await Timetable.findByPk(id);
      if (!timetable) {
        return res.status(404).json({
          success: false,
          message: 'Timetable not found'
        });
      }

      await timetable.update({
        status: 'published',
        published_at: new Date()
      });

      res.json({
        success: true,
        message: 'Timetable published successfully'
      });
    } catch (error) {
      logger.error('Publish timetable error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to publish timetable'
      });
    }
  }

  async getTimetableConflicts(req, res) {
    try {
      const { id } = req.params;

      const slots = await TimetableSlot.findAll({
        where: { timetable_id: id },
        include: [
          {
            model: Subject,
            as: 'subject',
            attributes: ['name', 'code']
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['first_name', 'last_name']
          },
          {
            model: Room,
            as: 'room',
            attributes: ['name', 'code']
          }
        ]
      });

      const conflicts = this.detectConflicts(slots);

      res.json({
        success: true,
        data: { conflicts }
      });
    } catch (error) {
      logger.error('Get timetable conflicts error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch conflicts'
      });
    }
  }

  async getStaffTimetable(req, res) {
    try {
      const { staffId } = req.params;
      const { week, academic_year, semester } = req.query;

      const where = {
        instructor_id: staffId
      };

      if (academic_year && semester) {
        // Add timetable filtering
        where['$timetable.academic_year$'] = academic_year;
        where['$timetable.semester$'] = semester;
      }

      const slots = await TimetableSlot.findAll({
        where,
        include: [
          {
            model: Timetable,
            as: 'timetable',
            attributes: ['id', 'name', 'academic_year', 'semester']
          },
          {
            model: Subject,
            as: 'subject',
            attributes: ['id', 'name', 'code', 'type']
          },
          {
            model: Room,
            as: 'room',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
      });

      // Group by day of week
      const groupedSlots = slots.reduce((acc, slot) => {
        if (!acc[slot.day_of_week]) {
          acc[slot.day_of_week] = [];
        }
        acc[slot.day_of_week].push(slot);
        return acc;
      }, {});

      res.json({
        success: true,
        data: { timetable: groupedSlots }
      });
    } catch (error) {
      logger.error('Get staff timetable error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch staff timetable'
      });
    }
  }

  detectConflicts(slots) {
    const conflicts = [];
    
    // Check for instructor conflicts
    const instructorSlots = {};
    slots.forEach(slot => {
      const key = `${slot.instructor_id}-${slot.day_of_week}-${slot.start_time}`;
      if (instructorSlots[key]) {
        conflicts.push({
          type: 'instructor_conflict',
          message: 'Instructor has overlapping classes',
          slots: [instructorSlots[key], slot]
        });
      } else {
        instructorSlots[key] = slot;
      }
    });

    // Check for room conflicts
    const roomSlots = {};
    slots.forEach(slot => {
      if (slot.room_id) {
        const key = `${slot.room_id}-${slot.day_of_week}-${slot.start_time}`;
        if (roomSlots[key]) {
          conflicts.push({
            type: 'room_conflict',
            message: 'Room is double-booked',
            slots: [roomSlots[key], slot]
          });
        } else {
          roomSlots[key] = slot;
        }
      }
    });

    return conflicts;
  }
}

module.exports = new TimetableController();