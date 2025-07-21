module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM('core', 'elective', 'lab', 'tutorial'),
      allowNull: false
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    hours_per_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Department',
        key: 'id'
      }
    },
    instructor_id: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    max_students: {
      type: DataTypes.INTEGER,
      defaultValue: 60
    },
    description: {
      type: DataTypes.TEXT
    },
    prerequisites: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    lab_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dual_instructor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      defaultValue: 'active'
    }
  });

  Subject.associate = (models) => {
    Subject.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });
    
    Subject.belongsTo(models.User, {
      foreignKey: 'instructor_id',
      as: 'instructor'
    });
    
    Subject.hasMany(models.TimetableSlot, {
      foreignKey: 'subject_id',
      as: 'timetable_slots'
    });
    
    Subject.hasMany(models.FormSubmission, {
      foreignKey: 'subject_id',
      as: 'form_submissions'
    });
  };

  return Subject;
};