const express = require('express');
const timetableController = require('../controllers/timetableController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateTimetable, validateUUID, validatePagination } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all timetables
router.get('/',
  validatePagination,
  timetableController.getAllTimetables
);

// Get timetable by ID
router.get('/:id',
  validateUUID,
  timetableController.getTimetableById
);

// Get timetable conflicts
router.get('/:id/conflicts',
  validateUUID,
  timetableController.getTimetableConflicts
);

// Get staff timetable
router.get('/staff/:staffId',
  validateUUID,
  timetableController.getStaffTimetable
);

// Create new timetable (admin only)
router.post('/',
  authorizeRoles('main_admin', 'department_admin'),
  validateTimetable,
  timetableController.createTimetable
);

// Generate timetable using AI (admin only)
router.post('/:id/generate',
  authorizeRoles('main_admin', 'department_admin'),
  validateUUID,
  timetableController.generateTimetable
);

// Update timetable slot (admin only)
router.put('/:id/slots/:slotId',
  authorizeRoles('main_admin', 'department_admin'),
  validateUUID,
  timetableController.updateTimetableSlot
);

// Publish timetable (admin only)
router.post('/:id/publish',
  authorizeRoles('main_admin', 'department_admin'),
  validateUUID,
  timetableController.publishTimetable
);

module.exports = router;