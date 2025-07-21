const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: `"SRM Timetable System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`, { messageId: result.messageId });
      return result;
    } catch (error) {
      logger.error('Failed to send email', { error: error.message, to, subject });
      throw error;
    }
  }

  async sendWelcomeEmail(user, temporaryPassword) {
    const subject = 'Welcome to SRM Timetable Management System';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E3A8A;">Welcome to SRM Timetable Management System</h2>
        <p>Dear ${user.first_name} ${user.last_name},</p>
        <p>Your account has been created successfully. Here are your login credentials:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Employee ID:</strong> ${user.employee_id}</p>
          <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
          <p><strong>Role:</strong> ${user.role.replace('_', ' ').toUpperCase()}</p>
        </div>
        <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
        <p>You can access the system at: <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>
        <p>If you have any questions, please contact your department administrator.</p>
        <p>Best regards,<br>SRM Timetable Management Team</p>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const subject = 'Password Reset Request';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E3A8A;">Password Reset Request</h2>
        <p>Dear ${user.first_name} ${user.last_name},</p>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1E3A8A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>SRM Timetable Management Team</p>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }

  async sendNotificationEmail(user, notification) {
    const subject = notification.title;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E3A8A;">${notification.title}</h2>
        <p>Dear ${user.first_name} ${user.last_name},</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>${notification.message}</p>
        </div>
        ${notification.action_url ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${notification.action_url}" style="background-color: #1E3A8A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Take Action</a>
          </div>
        ` : ''}
        <p>You can also view this notification in your dashboard.</p>
        <p>Best regards,<br>SRM Timetable Management Team</p>
      </div>
    `;
    
    return this.sendEmail(user.email, subject, html);
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }
}

module.exports = new EmailService();