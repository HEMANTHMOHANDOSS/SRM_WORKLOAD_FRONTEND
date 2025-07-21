module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        'system', 'schedule_change', 'form_deadline', 'approval_request',
        'approval_response', 'timetable_update', 'general'
      ),
      defaultValue: 'general'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    read_at: {
      type: DataTypes.DATE
    },
    action_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    action_url: {
      type: DataTypes.STRING
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    sender_id: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    expires_at: {
      type: DataTypes.DATE
    }
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    Notification.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender'
    });
  };

  return Notification;
};