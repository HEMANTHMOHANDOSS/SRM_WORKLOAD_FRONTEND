const express = require('express');
const { ChoiceForm, FormSubmission, User, Department, Subject } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateChoiceForm, validateUUID, validatePagination } = require('../middleware/validation');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all choice forms
router.get('/', validatePagination, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      department_id, 
      form_type, 
      status 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const where = {};

    if (department_id) where.department_id = department_id;
    if (form_type) where.form_type = form_type;
    if (status) where.status = status;

    // Filter by user's department if not main admin
    if (req.user.role !== 'main_admin' && req.user.department_id) {
      where.department_id = req.user.department_id;
    }

    const { count, rows: forms } = await ChoiceForm.findAndCountAll({
      where,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        forms,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get choice forms error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch choice forms'
    });
  }
});

// Get active forms for current user
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const where = {
      status: 'published',
      opens_at: { [Op.lte]: now },
      closes_at: { [Op.gte]: now }
    };

    // Filter by user's department
    if (req.user.department_id) {
      where.department_id = req.user.department_id;
    }

    // Filter by user's role
    where.target_roles = { [Op.contains]: [req.user.role] };

    const forms = await ChoiceForm.findAll({
      where,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [['closes_at', 'ASC']]
    });

    res.json({
      success: true,
      data: { forms }
    });
  } catch (error) {
    logger.error('Get active forms error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active forms'
    });
  }
});

// Get form by ID
router.get('/:id', validateUUID, async (req, res) => {
  try {
    const { id } = req.params;

    const form = await ChoiceForm.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Choice form not found'
      });
    }

    res.json({
      success: true,
      data: { form }
    });
  } catch (error) {
    logger.error('Get choice form by ID error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch choice form'
    });
  }
});

// Create choice form (admin only)
router.post('/',
  authorizeRoles('main_admin', 'department_admin'),
  validateChoiceForm,
  async (req, res) => {
    try {
      const formData = {
        ...req.body,
        created_by: req.user.id,
        department_id: req.body.department_id || req.user.department_id
      };

      const form = await ChoiceForm.create(formData);

      const createdForm = await ChoiceForm.findByPk(form.id, {
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Choice form created successfully',
        data: { form: createdForm }
      });
    } catch (error) {
      logger.error('Create choice form error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to create choice form'
      });
    }
  }
);

// Submit form response
router.post('/:id/submit', validateUUID, async (req, res) => {
  try {
    const { id } = req.params;
    const { responses, selected_subjects, preferences } = req.body;

    const form = await ChoiceForm.findByPk(id);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Choice form not found'
      });
    }

    // Check if form is open
    const now = new Date();
    if (form.status !== 'published' || now < form.opens_at || now > form.closes_at) {
      return res.status(400).json({
        success: false,
        message: 'Form is not currently accepting submissions'
      });
    }

    // Check if user already submitted (if multiple submissions not allowed)
    if (!form.allow_multiple_submissions) {
      const existingSubmission = await FormSubmission.findOne({
        where: {
          form_id: id,
          user_id: req.user.id,
          status: { [Op.in]: ['submitted', 'approved'] }
        }
      });

      if (existingSubmission) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted this form'
        });
      }
    }

    const submission = await FormSubmission.create({
      form_id: id,
      user_id: req.user.id,
      responses,
      selected_subjects,
      preferences,
      status: 'submitted',
      submitted_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: { submission }
    });
  } catch (error) {
    logger.error('Submit form error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to submit form'
    });
  }
});

// Get form submissions (admin only)
router.get('/:id/submissions',
  authorizeRoles('main_admin', 'department_admin'),
  validateUUID,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;
      const where = { form_id: id };

      if (status) where.status = status;

      const { count, rows: submissions } = await FormSubmission.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email', 'employee_id']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['submitted_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          submissions,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get form submissions error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch form submissions'
      });
    }
  }
);

module.exports = router;