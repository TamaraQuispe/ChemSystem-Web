const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Enrollment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    classroom_id: { type: DataTypes.UUID, allowNull: false },
    student_id: { type: DataTypes.UUID, allowNull: false },
  }, {
    tableName: 'enrollments',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  });
};
