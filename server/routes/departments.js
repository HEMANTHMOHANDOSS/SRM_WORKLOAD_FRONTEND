const express = require('express');
const { Department, User } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateDepartment, validateUUID, validatePagination } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all departments
router.get('/', validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;

    const { count, rows: departments } = await Department.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'head',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        departments,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get departments error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments'
    });
  }
});

// Get department by ID
router.get('/:id', validateUUID, async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id, {
      include: [
        {
          model: User,
          as: 'head',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'status']
        }
      ]
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      data: { department }
    });
  } catch (error) {
    logger.error('Get department by ID error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department'
    });
  }
});

// Create department (main admin only)
router.post('/',
  authorizeRoles('main_admin'),
  validateDepartment,
  async (req, res) => {
    try {
      const department = await Department.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: { department }
      });
    } catch (error) {
      logger.error('Create department error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to create department'
      });
    }
  }
);

// Update department
router.put('/:id',
  authorizeRoles('main_admin'),
  validateUUID,
  validateDepartment,
  async (req, res) => {
    try {
      const { id } = req.params;

      const department = await Department.findByPk(id);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      await department.update(req.body);

      res.json({
        success: true,
        message: 'Department updated successfully',
        data: { department }
      });
    } catch (error) {
      logger.error('Update department error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to update department'
      });
    }
  }
);

// Delete department
router.delete('/:id',
  authorizeRoles('main_admin'),
  validateUUID,
  async (req, res) => {
    try {
      const { id } = req.params;

      const department = await Department.findByPk(id);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      await department.update({ status: 'inactive' });

      res.json({
        success: true,
        message: 'Department deleted successfully'
      });
    } catch (error) {
      logger.error('Delete department error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to delete department'
      });
    }
  }
);

module.exports = router;