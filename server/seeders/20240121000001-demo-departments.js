'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const departments = [
      {
        id: uuidv4(),
        name: 'Computer Science & Engineering',
        code: 'CSE',
        description: 'Department of Computer Science and Engineering',
        building: 'Block A',
        floor: '3rd Floor',
        contact_email: 'cse@srm.edu',
        contact_phone: '+91-44-27417000',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Electronics & Communication Engineering',
        code: 'ECE',
        description: 'Department of Electronics and Communication Engineering',
        building: 'Block B',
        floor: '2nd Floor',
        contact_email: 'ece@srm.edu',
        contact_phone: '+91-44-27417001',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mechanical Engineering',
        code: 'MECH',
        description: 'Department of Mechanical Engineering',
        building: 'Block C',
        floor: '1st Floor',
        contact_email: 'mech@srm.edu',
        contact_phone: '+91-44-27417002',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Civil Engineering',
        code: 'CIVIL',
        description: 'Department of Civil Engineering',
        building: 'Block D',
        floor: 'Ground Floor',
        contact_email: 'civil@srm.edu',
        contact_phone: '+91-44-27417003',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('Department', departments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Department', null, {});
  }
};