const express = require('express');
const { Room, Department } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateRoom, validateUUID, validatePagination } = require('../middleware/validation');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all rooms
router.get('/', validatePagination, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      department_id, 
      type, 
      status, 
      search 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const where = {};

    if (department_id) where.department_id = department_id;
    if (type) where.type = type;
    if (status) where.status = status;
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: rooms } = await Room.findAndCountAll({
      where,
      include: [{
        model: Department,
        as: 'department',
        attributes: ['id', 'name', 'code']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        rooms,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get rooms error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});

// Create room (admin only)
router.post('/',
  authorizeRoles('main_admin', 'department_admin'),
  validateRoom,
  async (req, res) => {
    try {
      const room = await Room.create(req.body);

      const createdRoom = await Room.findByPk(room.id, {
        include: [{
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }]
      });

      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: { room: createdRoom }
      });
    } catch (error) {
      logger.error('Create room error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to create room'
      });
    }
  }
);

module.exports = router;