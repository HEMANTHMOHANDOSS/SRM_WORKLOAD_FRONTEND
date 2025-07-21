module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
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
      type: DataTypes.ENUM('classroom', 'laboratory', 'auditorium', 'seminar_hall'),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    department_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Department',
        key: 'id'
      }
    },
    building: {
      type: DataTypes.STRING
    },
    floor: {
      type: DataTypes.STRING
    },
    equipment: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('available', 'maintenance', 'occupied'),
      defaultValue: 'available'
    },
    is_lab: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    has_projector: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    has_ac: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Room.associate = (models) => {
    Room.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });
    
    Room.hasMany(models.TimetableSlot, {
      foreignKey: 'room_id',
      as: 'timetable_slots'
    });
  };

  return Room;
};