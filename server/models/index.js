const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Department = require('./Department');
const Subject = require('./Subject');
const Timetable = require('./Timetable');
const TimetableSlot = require('./TimetableSlot');
const ChoiceForm = require('./ChoiceForm');
const FormSubmission = require('./FormSubmission');
const Notification = require('./Notification');
const Constraint = require('./Constraint');
const Room = require('./Room');

// Initialize models
const models = {
  User: User(sequelize, Sequelize.DataTypes),
  Department: Department(sequelize, Sequelize.DataTypes),
  Subject: Subject(sequelize, Sequelize.DataTypes),
  Timetable: Timetable(sequelize, Sequelize.DataTypes),
  TimetableSlot: TimetableSlot(sequelize, Sequelize.DataTypes),
  ChoiceForm: ChoiceForm(sequelize, Sequelize.DataTypes),
  FormSubmission: FormSubmission(sequelize, Sequelize.DataTypes),
  Notification: Notification(sequelize, Sequelize.DataTypes),
  Constraint: Constraint(sequelize, Sequelize.DataTypes),
  Room: Room(sequelize, Sequelize.DataTypes)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;