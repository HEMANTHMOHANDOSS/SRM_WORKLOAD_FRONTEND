const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Department } = require('../models');
const emailService = require('../utils/emailService');
const logger = require('../utils/logger');

class AuthController {
  async register(req, res) {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        employee_id,
        role,
        department_id,
        phone,
        designation,
        qualification,
        specialization,
        experience_years
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          $or: [{ email }, { employee_id }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or employee ID already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
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
        status: role === 'main_admin' ? 'active' : 'pending'
      });

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user, password);
      } catch (emailError) {
        logger.error('Failed to send welcome email', { error: emailError.message });
      }

      // Generate token for immediate login (if approved)
      let token = null;
      if (user.status === 'active') {
        token = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            employee_id: user.employee_id,
            role: user.role,
            status: user.status
          },
          token
        }
      });
    } catch (error) {
      logger.error('Registration error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user with department info
      const user = await User.findOne({
        where: { email },
        include: [{
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }]
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Account is not active. Please contact administrator.'
        });
      }

      // Update last login
      await user.update({ last_login: new Date() });

      // Generate token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            employee_id: user.employee_id,
            role: user.role,
            department: user.department,
            designation: user.designation
          },
          token
        }
      });
    } catch (error) {
      logger.error('Login error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async logout(req, res) {
    try {
      // In a more sophisticated setup, you might want to blacklist the token
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

      await user.update({
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires
      });

      // Send reset email
      await emailService.sendPasswordResetEmail(user, resetToken);

      res.json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      logger.error('Forgot password error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request'
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      const user = await User.findOne({
        where: {
          reset_token: token,
          reset_token_expires: {
            $gt: new Date()
          }
        }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      await user.update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      });

      res.json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      logger.error('Reset password error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Password reset failed'
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      await user.update({ password: hashedNewPassword });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Password change failed'
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }],
        attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] }
      });

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      logger.error('Get profile error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updateData.password;
      delete updateData.role;
      delete updateData.status;
      delete updateData.employee_id;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.update(updateData);

      const updatedUser = await User.findByPk(userId, {
        include: [{
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }],
        attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] }
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      logger.error('Update profile error', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Profile update failed'
      });
    }
  }
}

module.exports = new AuthController();