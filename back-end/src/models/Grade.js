const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Grade', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    enrollment_id: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.STRING(20), allowNull: false },
    score: { type: DataTypes.DECIMAL(5,2), allowNull: false },
    max_score: { type: DataTypes.DECIMAL(5,2), allowNull: false, defaultValue: 100 },
    weight: { type: DataTypes.DECIMAL(5,2), defaultValue: 1 },
    topic: { type: DataTypes.STRING(200) },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
    published_at: DataTypes.DATE,
  }, {
    tableName: 'grades',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  });
};
