const express = require('express');
const { Subject, User, Department } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateSubject, validateUUID, validatePagination } = require('../middleware/validation');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all subjects
router.get('/', validatePagination, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      department_id, 
      type, 
      semester, 
      year, 
      search 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const where = {};

    if (department_id) where.department_id = department_id;
    if (type) where.type = type;
    if (semester) where.semester = semester;
    if (year) where.year = year;
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: subjects } = await Subject.findAndCountAll({
      where,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        subjects,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get subjects error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects'
    });
  }
});

// Get subject by ID
router.get('/:id', validateUUID, async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      data: { subject }
    });
  } catch (error) {
    logger.error('Get subject by ID error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subject'
    });
  }
});

// Create subject (admin only)
router.post('/',
  authorizeRoles('main_admin', 'department_admin'),
  validateSubject,
  async (req, res) => {
    try {
      const subject = await Subject.create(req.body);

      const createdSubject = await Subject.findByPk(subject.id, {
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name', 'code']
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        data: { subject: createdSubject }
      });
    } catch (error) {
      logger.error('Create subject error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to create subject'
      });
    }
  }
);

// Update subject
router.put('/:id',
  authorizeRoles('main_admin', 'department_admin'),
  validateUUID,
  validateSubject,
  async (req, res) => {
    try {
      const { id } = req.params;

      const subject = await Subject.findByPk(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      await subject.update(req.body);

      const updatedSubject = await Subject.findByPk(id, {
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name', 'code']
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Subject updated successfully',
        data: { subject: updatedSubject }
      });
    } catch (error) {
      logger.error('Update subject error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to update subject'
      });
    }
  }
);

// Delete subject
router.delete('/:id',
  authorizeRoles('main_admin', 'department_admin'),
  validateUUID,
  async (req, res) => {
    try {
      const { id } = req.params;

      const subject = await Subject.findByPk(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      await subject.update({ status: 'archived' });

      res.json({
        success: true,
        message: 'Subject deleted successfully'
      });
    } catch (error) {
      logger.error('Delete subject error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to delete subject'
      });
    }
  }
);

module.exports = router;