module.exports = (sequelize, DataTypes) => {
  const Timetable = sequelize.define('Timetable', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
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
    academic_year: {
      type: DataTypes.STRING,
      allowNull: false
    },
    semester: {
      type: DataTypes.ENUM('fall', 'spring', 'summer'),
      allowNull: false
    },
    year_level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    section: {
      type: DataTypes.STRING,
      defaultValue: 'A'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    generated_by: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    generation_method: {
      type: DataTypes.ENUM('manual', 'ai_generated'),
      defaultValue: 'manual'
    },
    constraints_used: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    conflicts_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    published_at: {
      type: DataTypes.DATE
    },
    effective_from: {
      type: DataTypes.DATE
    },
    effective_to: {
      type: DataTypes.DATE
    }
  });

  Timetable.associate = (models) => {
    Timetable.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });
    
    Timetable.belongsTo(models.User, {
      foreignKey: 'generated_by',
      as: 'generator'
    });
    
    Timetable.hasMany(models.TimetableSlot, {
      foreignKey: 'timetable_id',
      as: 'slots'
    });
  };

  return Timetable;
};