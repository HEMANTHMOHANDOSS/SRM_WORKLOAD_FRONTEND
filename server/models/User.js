module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM('main_admin', 'department_admin', 'staff'),
      allowNull: false,
      defaultValue: 'staff'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending', 'suspended'),
      defaultValue: 'pending'
    },
    department_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Department',
        key: 'id'
      }
    },
    designation: {
      type: DataTypes.STRING
    },
    qualification: {
      type: DataTypes.STRING
    },
    specialization: {
      type: DataTypes.STRING
    },
    experience_years: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    max_hours_per_week: {
      type: DataTypes.INTEGER,
      defaultValue: 20
    },
    profile_image: {
      type: DataTypes.STRING
    },
    last_login: {
      type: DataTypes.DATE
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reset_token: {
      type: DataTypes.STRING
    },
    reset_token_expires: {
      type: DataTypes.DATE
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });
    
    User.hasMany(models.Subject, {
      foreignKey: 'instructor_id',
      as: 'subjects'
    });
    
    User.hasMany(models.FormSubmission, {
      foreignKey: 'user_id',
      as: 'form_submissions'
    });
    
    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications'
    });
    
    User.hasMany(models.TimetableSlot, {
      foreignKey: 'instructor_id',
      as: 'timetable_slots'
    });
  };

  return User;
};