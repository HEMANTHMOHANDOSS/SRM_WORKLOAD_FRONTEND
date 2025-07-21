module.exports = (sequelize, DataTypes) => {
  const ChoiceForm = sequelize.define('ChoiceForm', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    form_type: {
      type: DataTypes.ENUM('subject_selection', 'workload_preference', 'availability', 'feedback'),
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
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    target_roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['staff']
    },
    fields: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    constraints: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'closed', 'archived'),
      defaultValue: 'draft'
    },
    opens_at: {
      type: DataTypes.DATE
    },
    closes_at: {
      type: DataTypes.DATE
    },
    published_at: {
      type: DataTypes.DATE
    },
    max_submissions: {
      type: DataTypes.INTEGER
    },
    allow_multiple_submissions: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    require_approval: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  ChoiceForm.associate = (models) => {
    ChoiceForm.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department'
    });
    
    ChoiceForm.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    
    ChoiceForm.hasMany(models.FormSubmission, {
      foreignKey: 'form_id',
      as: 'submissions'
    });
  };

  return ChoiceForm;
};