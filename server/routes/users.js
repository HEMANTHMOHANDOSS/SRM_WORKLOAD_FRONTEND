const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateUserRegistration, validateUserUpdate, validateUUID, validatePagination } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all users (admin only)
router.get('/', 
  authorizeRoles('main_admin', 'department_admin'),
  validatePagination,
  userController.getAllUsers
);

// Get user statistics
router.get('/stats',
  authorizeRoles('main_admin', 'department_admin'),
  userController.getUserStats
);

// Get user by ID
router.get('/:id',
  validateUUID,
  userController.getUserById
);

// Get user workload
router.get('/:id/workload',
  validateUUID,
  userController.getUserWorkload
);

// Create new user (admin only)
router.post('/',
  authorizeRoles('main_admin', 'department_admin'),
  validateUserRegistration,
  userController.createUser
);

// Update user
router.put('/:id',
  validateUUID,
  validateUserUpdate,
  userController.updateUser
);

// Delete user (admin only)
router.delete('/:id',
  authorizeRoles('main_admin', 'department_admin'),
  validateUUID,
  userController.deleteUser
);

// Approve user (admin only)
router.post('/:id/approve',
  authorizeRoles('main_admin', 'department_admin'),
  validateUUID,
  userController.approveUser
);

// Reject user (admin only)
router.post('/:id/reject',
  authorizeRoles('main_admin', 'department_admin'),
  validateUUID,
  userController.rejectUser
);

module.exports = router;