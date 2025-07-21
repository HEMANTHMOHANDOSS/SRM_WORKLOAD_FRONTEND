const express = require('express');
const { Notification, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { validateUUID, validatePagination } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user notifications
router.get('/', validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, read, type } = req.query;
    const offset = (page - 1) * limit;
    const where = { user_id: req.user.id };

    if (read !== undefined) where.read = read === 'true';
    if (type) where.type = type;

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'first_name', 'last_name']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get notifications error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Mark notification as read
router.put('/:id/read', validateUUID, async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.update({
      read: true,
      read_at: new Date()
    });

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Mark notification as read error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', async (req, res) => {
  try {
    await Notification.update(
      {
        read: true,
        read_at: new Date()
      },
      {
        where: {
          user_id: req.user.id,
          read: false
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Mark all notifications as read error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

// Delete notification
router.delete('/:id', validateUUID, async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Delete notification error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

module.exports = router;