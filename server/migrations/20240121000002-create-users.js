'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      employee_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM('main_admin', 'department_admin', 'staff'),
        allowNull: false,
        defaultValue: 'staff'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'pending', 'suspended'),
        defaultValue: 'pending'
      },
      department_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Department',
          key: 'id'
        }
      },
      designation: {
        type: Sequelize.STRING
      },
      qualification: {
        type: Sequelize.STRING
      },
      specialization: {
        type: Sequelize.STRING
      },
      experience_years: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      max_hours_per_week: {
        type: Sequelize.INTEGER,
        defaultValue: 20
      },
      profile_image: {
        type: Sequelize.STRING
      },
      last_login: {
        type: Sequelize.DATE
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      reset_token: {
        type: Sequelize.STRING
      },
      reset_token_expires: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('User', {
      fields: ['department_id'],
      type: 'foreign key',
      name: 'user_department_fkey',
      references: {
        table: 'Department',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};