module.exports = (sequelize, DataTypes) => {
  const Constraint = sequelize.define('Constraint', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('global', 'department', 'user', 'subject', 'room'),
      allowNull: false
    },
    department_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Department',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    subject_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Subject',
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
    constraint_data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    is_hard_constraint: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  });

  Constraint.associate = (models) => {
    Constraint.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });
    
    Constraint.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    Constraint.belongsTo(models.Subject, {
      foreignKey: 'subject_id',
      as: 'subject'
    });
    
    Constraint.belongsTo(models.Room, {
      foreignKey: 'room_id',
      as: 'room'
    });
    
    Constraint.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  };

  return Constraint;
};