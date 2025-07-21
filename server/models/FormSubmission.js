module.exports = (sequelize, DataTypes) => {
  const FormSubmission = sequelize.define('FormSubmission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    form_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ChoiceForm',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
    responses: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    selected_subjects: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected'),
      defaultValue: 'draft'
    },
    submitted_at: {
      type: DataTypes.DATE
    },
    reviewed_by: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    reviewed_at: {
      type: DataTypes.DATE
    },
    review_comments: {
      type: DataTypes.TEXT
    },
    completion_time_minutes: {
      type: DataTypes.INTEGER
    }
  });

  FormSubmission.associate = (models) => {
    FormSubmission.belongsTo(models.ChoiceForm, {
      foreignKey: 'form_id',
      as: 'form'
    });
    
    FormSubmission.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    FormSubmission.belongsTo(models.Subject, {
      foreignKey: 'subject_id',
      as: 'subject'
    });
    
    FormSubmission.belongsTo(models.User, {
      foreignKey: 'reviewed_by',
      as: 'reviewer'
    });
  };

  return FormSubmission;
};