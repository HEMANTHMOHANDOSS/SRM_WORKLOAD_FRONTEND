'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get department IDs
    const departments = await queryInterface.sequelize.query(
      'SELECT id, code FROM "Department"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const cseDept = departments.find(d => d.code === 'CSE');
    const eceDept = departments.find(d => d.code === 'ECE');

    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = [
      {
        id: uuidv4(),
        employee_id: 'ADMIN001',
        email: 'admin@srm.edu',
        password: hashedPassword,
        first_name: 'System',
        last_name: 'Administrator',
        phone: '+91-9876543210',
        role: 'main_admin',
        status: 'active',
        designation: 'System Administrator',
        qualification: 'M.Tech',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        employee_id: 'CSE001',
        email: 'cse.admin@srm.edu',
        password: hashedPassword,
        first_name: 'Dr. Rajesh',
        last_name: 'Kumar',
        phone: '+91-9876543211',
        role: 'department_admin',
        status: 'active',
        department_id: cseDept?.id,
        designation: 'Head of Department',
        qualification: 'Ph.D in Computer Science',
        specialization: 'Artificial Intelligence',
        experience_years: 15,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        employee_id: 'ECE001',
        email: 'ece.admin@srm.edu',
        password: hashedPassword,
        first_name: 'Dr. Priya',
        last_name: 'Sharma',
        phone: '+91-9876543212',
        role: 'department_admin',
        status: 'active',
        department_id: eceDept?.id,
        designation: 'Head of Department',
        qualification: 'Ph.D in Electronics',
        specialization: 'VLSI Design',
        experience_years: 12,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        employee_id: 'CSE101',
        email: 'sarah.johnson@srm.edu',
        password: hashedPassword,
        first_name: 'Dr. Sarah',
        last_name: 'Johnson',
        phone: '+91-9876543213',
        role: 'staff',
        status: 'active',
        department_id: cseDept?.id,
        designation: 'Assistant Professor',
        qualification: 'Ph.D in Computer Science',
        specialization: 'Machine Learning',
        experience_years: 8,
        max_hours_per_week: 20,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        employee_id: 'CSE102',
        email: 'michael.chen@srm.edu',
        password: hashedPassword,
        first_name: 'Prof. Michael',
        last_name: 'Chen',
        phone: '+91-9876543214',
        role: 'staff',
        status: 'active',
        department_id: cseDept?.id,
        designation: 'Associate Professor',
        qualification: 'M.Tech in Information Technology',
        specialization: 'Database Systems',
        experience_years: 10,
        max_hours_per_week: 18,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('User', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  }
};