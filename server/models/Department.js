module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    head_of_department: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    building: {
      type: DataTypes.STRING
    },
    floor: {
      type: DataTypes.STRING
    },
    contact_email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    contact_phone: {
      type: DataTypes.STRING
    }
  });

  Department.associate = (models) => {
    Department.hasMany(models.User, {
      foreignKey: 'department_id',
      as: 'staff'
    });
    
    Department.belongsTo(models.User, {
      foreignKey: 'head_of_department',
      as: 'head'
    });
    
    Department.hasMany(models.Subject, {
      foreignKey: 'department_id',
      as: 'subjects'
    });
    
    Department.hasMany(models.Room, {
      foreignKey: 'department_id',
      as: 'rooms'
    });
    
    Department.hasMany(models.Timetable, {
      foreignKey: 'department_id',
      as: 'timetables'
    });
  };

  return Department;
};