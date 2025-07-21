const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const departmentRoutes = require('./departments');
const subjectRoutes = require('./subjects');
const timetableRoutes = require('./timetables');
const choiceFormRoutes = require('./choiceForms');
const notificationRoutes = require('./notifications');
const roomRoutes = require('./rooms');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SRM Timetable API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/departments', departmentRoutes);
router.use('/subjects', subjectRoutes);
router.use('/timetables', timetableRoutes);
router.use('/choice-forms', choiceFormRoutes);
router.use('/notifications', notificationRoutes);
router.use('/rooms', roomRoutes);

module.exports = router;