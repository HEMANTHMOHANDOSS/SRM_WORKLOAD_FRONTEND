module.exports = (sequelize, DataTypes) => {
  const TimetableSlot = sequelize.define('TimetableSlot', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    timetable_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Timetable',
        key: 'id'
      }
    },
    subject_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Subject',
        key: 'id'
      }
    },
    instructor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    room_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Room',
        key: 'id'
      }
    },
    day_of_week: {
      type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'),
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slot_type: {
      type: DataTypes.ENUM('lecture', 'lab', 'tutorial', 'break'),
      defaultValue: 'lecture'
    },
    is_break: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    break_type: {
      type: DataTypes.ENUM('short_break', 'lunch_break'),
      allowNull: true
    },
    secondary_instructor_id: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#3B82F6'
    }
  });

  TimetableSlot.associate = (models) => {
    TimetableSlot.belongsTo(models.Timetable, {
      foreignKey: 'timetable_id',
      as: 'timetable'
    });
    
    TimetableSlot.belongsTo(models.Subject, {
      foreignKey: 'subject_id',
      as: 'subject'
    });
    
    TimetableSlot.belongsTo(models.User, {
      foreignKey: 'instructor_id',
      as: 'instructor'
    });
    
    TimetableSlot.belongsTo(models.User, {
      foreignKey: 'secondary_instructor_id',
      as: 'secondary_instructor'
    });
    
    TimetableSlot.belongsTo(models.Room, {
      foreignKey: 'room_id',
      as: 'room'
    });
  };

  return TimetableSlot;
};