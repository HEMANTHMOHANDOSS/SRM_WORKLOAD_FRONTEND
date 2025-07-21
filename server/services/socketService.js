const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId, {
          attributes: { exclude: ['password'] }
        });

        if (!user || user.status !== 'active') {
          return next(new Error('Authentication error'));
        }

        socket.userId = user.id;
        socket.userRole = user.role;
        socket.departmentId = user.department_id;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });

    logger.info('Socket.IO service initialized');
  }

  handleConnection(socket) {
    logger.info(`User connected: ${socket.userId}`);
    
    // Store user connection
    this.connectedUsers.set(socket.userId, {
      socketId: socket.id,
      role: socket.userRole,
      departmentId: socket.departmentId,
      connectedAt: new Date()
    });

    // Join user to their department room
    if (socket.departmentId) {
      socket.join(`department_${socket.departmentId}`);
    }

    // Join user to their role room
    socket.join(`role_${socket.userRole}`);

    // Handle real-time events
    this.setupEventHandlers(socket);

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
      this.connectedUsers.delete(socket.userId);
    });
  }

  setupEventHandlers(socket) {
    // Timetable updates
    socket.on('timetable_update', (data) => {
      this.broadcastTimetableUpdate(socket, data);
    });

    // Form submissions
    socket.on('form_submission', (data) => {
      this.broadcastFormSubmission(socket, data);
    });

    // Staff approval updates
    socket.on('staff_approval', (data) => {
      this.broadcastStaffApproval(socket, data);
    });

    // Real-time notifications
    socket.on('join_notifications', () => {
      socket.join(`notifications_${socket.userId}`);
    });

    // Typing indicators for forms
    socket.on('form_typing', (data) => {
      socket.to(`department_${socket.departmentId}`).emit('user_typing', {
        userId: socket.userId,
        formId: data.formId,
        isTyping: data.isTyping
      });
    });
  }

  broadcastTimetableUpdate(socket, data) {
    // Broadcast to department admins and affected staff
    this.io.to(`department_${socket.departmentId}`).emit('timetable_updated', {
      timetableId: data.timetableId,
      changes: data.changes,
      updatedBy: socket.userId,
      timestamp: new Date()
    });

    logger.info('Timetable update broadcasted', { 
      timetableId: data.timetableId,
      departmentId: socket.departmentId 
    });
  }

  broadcastFormSubmission(socket, data) {
    // Notify department admins about new form submissions
    this.io.to(`role_department_admin`).emit('new_form_submission', {
      formId: data.formId,
      userId: socket.userId,
      submissionId: data.submissionId,
      timestamp: new Date()
    });

    logger.info('Form submission broadcasted', { 
      formId: data.formId,
      userId: socket.userId 
    });
  }

  broadcastStaffApproval(socket, data) {
    // Notify the specific user about approval/rejection
    const targetUser = this.connectedUsers.get(data.userId);
    if (targetUser) {
      this.io.to(targetUser.socketId).emit('approval_update', {
        status: data.status,
        comments: data.comments,
        approvedBy: socket.userId,
        timestamp: new Date()
      });
    }

    // Also broadcast to department admins
    this.io.to(`role_department_admin`).emit('staff_approval_processed', {
      userId: data.userId,
      status: data.status,
      processedBy: socket.userId,
      timestamp: new Date()
    });

    logger.info('Staff approval broadcasted', { 
      userId: data.userId,
      status: data.status 
    });
  }

  // Public methods for sending notifications
  sendNotificationToUser(userId, notification) {
    const user = this.connectedUsers.get(userId);
    if (user) {
      this.io.to(user.socketId).emit('new_notification', notification);
    }
  }

  sendNotificationToDepartment(departmentId, notification) {
    this.io.to(`department_${departmentId}`).emit('new_notification', notification);
  }

  sendNotificationToRole(role, notification) {
    this.io.to(`role_${role}`).emit('new_notification', notification);
  }

  broadcastSystemAnnouncement(announcement) {
    this.io.emit('system_announcement', announcement);
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.entries()).map(([userId, data]) => ({
      userId,
      ...data
    }));
  }

  getUserConnectionStatus(userId) {
    return this.connectedUsers.has(userId);
  }
}

module.exports = new SocketService();