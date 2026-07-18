const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('FamilyRelationship', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    parent_id: { type: DataTypes.UUID, allowNull: false },
    student_id: { type: DataTypes.UUID, allowNull: false },
    relationship: { type: DataTypes.STRING(30), defaultValue: 'parent' },
  }, {
    tableName: 'family_relationships',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  });
};
