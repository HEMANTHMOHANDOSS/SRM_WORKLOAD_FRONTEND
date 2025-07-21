const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('first_name').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('last_name').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('employee_id').trim().isLength({ min: 1 }).withMessage('Employee ID is required'),
  body('role').isIn(['main_admin', 'department_admin', 'staff']).withMessage('Invalid role'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('email').optional().isEmail().normalizeEmail(),
  body('first_name').optional().trim().isLength({ min: 1 }),
  body('last_name').optional().trim().isLength({ min: 1 }),
  body('phone').optional().isMobilePhone(),
  handleValidationErrors
];

// Department validation rules
const validateDepartment = [
  body('name').trim().isLength({ min: 1 }).withMessage('Department name is required'),
  body('code').trim().isLength({ min: 2, max: 10 }).withMessage('Department code must be 2-10 characters'),
  body('description').optional().trim(),
  handleValidationErrors
];

// Subject validation rules
const validateSubject = [
  body('name').trim().isLength({ min: 1 }).withMessage('Subject name is required'),
  body('code').trim().isLength({ min: 1 }).withMessage('Subject code is required'),
  body('type').isIn(['core', 'elective', 'lab', 'tutorial']).withMessage('Invalid subject type'),
  body('credits').isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
  body('hours_per_week').isInt({ min: 1, max: 20 }).withMessage('Hours per week must be between 1 and 20'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('year').isInt({ min: 1, max: 4 }).withMessage('Year must be between 1 and 4'),
  handleValidationErrors
];

// Timetable validation rules
const validateTimetable = [
  body('name').trim().isLength({ min: 1 }).withMessage('Timetable name is required'),
  body('academic_year').trim().isLength({ min: 1 }).withMessage('Academic year is required'),
  body('semester').isIn(['fall', 'spring', 'summer']).withMessage('Invalid semester'),
  body('year_level').isInt({ min: 1, max: 4 }).withMessage('Year level must be between 1 and 4'),
  handleValidationErrors
];

// Choice form validation rules
const validateChoiceForm = [
  body('title').trim().isLength({ min: 1 }).withMessage('Form title is required'),
  body('form_type').isIn(['subject_selection', 'workload_preference', 'availability', 'feedback']).withMessage('Invalid form type'),
  body('fields').isArray().withMessage('Fields must be an array'),
  handleValidationErrors
];

// Room validation rules
const validateRoom = [
  body('name').trim().isLength({ min: 1 }).withMessage('Room name is required'),
  body('code').trim().isLength({ min: 1 }).withMessage('Room code is required'),
  body('type').isIn(['classroom', 'laboratory', 'auditorium', 'seminar_hall']).withMessage('Invalid room type'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  handleValidationErrors
];

// Parameter validation
const validateUUID = [
  param('id').isUUID().withMessage('Invalid ID format'),
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateDepartment,
  validateSubject,
  validateTimetable,
  validateChoiceForm,
  validateRoom,
  validateUUID,
  validatePagination
};