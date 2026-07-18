const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Classroom', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    teacher_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(200), allowNull: false },
    subject: { type: DataTypes.STRING(200), allowNull: false },
    code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    section: { type: DataTypes.STRING(50), defaultValue: 'A' },
    academic_period: { type: DataTypes.STRING(50), defaultValue: '2026-1' },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'classrooms',
    timestamps: true,
    underscored: true,
  });
};
