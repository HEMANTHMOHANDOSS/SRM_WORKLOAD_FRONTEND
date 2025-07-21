const bcrypt = require('bcryptjs');
const { User, Department, Subject, FormSubmission } = require('../models');
const emailService = require('../utils/emailService');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class UserController {
  async getAllUsers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        status,
        department_id,
        search
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      // Apply filters
      if (role) where.role = role;
      if (status) where.status = status;
      if (department_id) where.department_id = department_id;
      
      if (search) {
        where[Op.or] = [
          { first_name: { [Op.iLike]: `%${search}%` } },
          { last_name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { employee_id: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows: users } = await User.findAndCountAll({
        where,
        include: [{
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }],
        attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get all users error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name', 'code']
          },
          {
            model: Subject,
            as: 'subjects',
            attributes: ['id', 'name', 'code', 'type', 'credits', 'hours_per_week']
          }
        ],
        attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      logger.error('Get user by ID error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }
  }

  async createUser(req, res) {
    try {
      const {
        email,
        first_name,
        last_name,
        employee_id,
        role,
        department_id,
        phone,
        designation,
        qualification,
        specialization,
        experience_years,
        max_hours_per_week
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { employee_id }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or employee ID already exists'
        });
      }

      // Generate temporary password
      const temporaryPassword = this.generateTemporaryPassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

      const user = await User.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        employee_id,
        role,
        department_id,
        phone,
        designation,
        qualification,
        specialization,
        experience_years: experience_years || 0,
        max_hours_per_week: max_hours_per_week || 20,
        status: 'pending'
      });

      // Send welcome email with credentials
      try {
        await emailService.sendWelcomeEmail(user, temporaryPassword);
      } catch (emailError) {
        logger.error('Failed to send welcome email', { error: emailError.message });
      }

      const createdUser = await User.findByPk(user.id, {
        include: [{
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }],
        attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] }
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user: createdUser }
      });
    } catch (error) {
      logger.error('Create user error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove sensitive fields
      delete updateData.password;
      delete updateData.reset_token;
      delete updateData.reset_token_expires;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.update(updateData);

      const updatedUser = await User.findByPk(id, {
        include: [{
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }],
        attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] }
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      logger.error('Update user error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Soft delete by updating status
      await user.update({ status: 'inactive' });

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logger.error('Delete user error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }

  async approveUser(req, res) {
    try {
      const { id } = req.params;
      const { comments } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.update({ status: 'active' });

      // Create notification
      // This would be handled by the notification service

      res.json({
        success: true,
        message: 'User approved successfully',
        data: { user }
      });
    } catch (error) {
      logger.error('Approve user error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to approve user'
      });
    }
  }

  async rejectUser(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.update({ status: 'suspended' });

      res.json({
        success: true,
        message: 'User rejected successfully'
      });
    } catch (error) {
      logger.error('Reject user error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to reject user'
      });
    }
  }

  async getUserStats(req, res) {
    try {
      const { department_id } = req.query;
      const where = {};
      
      if (department_id) {
        where.department_id = department_id;
      }

      const stats = await User.findAll({
        where,
        attributes: [
          'status',
          'role',
          [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
        ],
        group: ['status', 'role'],
        raw: true
      });

      const formattedStats = {
        total: 0,
        by_status: {},
        by_role: {}
      };

      stats.forEach(stat => {
        const count = parseInt(stat.count);
        formattedStats.total += count;
        formattedStats.by_status[stat.status] = (formattedStats.by_status[stat.status] || 0) + count;
        formattedStats.by_role[stat.role] = (formattedStats.by_role[stat.role] || 0) + count;
      });

      res.json({
        success: true,
        data: { stats: formattedStats }
      });
    } catch (error) {
      logger.error('Get user stats error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user statistics'
      });
    }
  }

  async getUserWorkload(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        include: [{
          model: Subject,
          as: 'subjects',
          attributes: ['id', 'name', 'code', 'type', 'hours_per_week']
        }]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const totalHours = user.subjects.reduce((sum, subject) => sum + subject.hours_per_week, 0);
      const workloadPercentage = (totalHours / user.max_hours_per_week) * 100;

      let workloadStatus = 'optimal';
      if (workloadPercentage < 75) workloadStatus = 'under-loaded';
      if (workloadPercentage > 100) workloadStatus = 'over-loaded';

      res.json({
        success: true,
        data: {
          workload: {
            current_hours: totalHours,
            max_hours: user.max_hours_per_week,
            percentage: workloadPercentage,
            status: workloadStatus,
            subjects: user.subjects
          }
        }
      });
    } catch (error) {
      logger.error('Get user workload error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user workload'
      });
    }
  }

  generateTemporaryPassword() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

module.exports = new UserController();