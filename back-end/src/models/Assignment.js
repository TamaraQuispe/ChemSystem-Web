const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Assignment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    classroom_id: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT },
    type: { type: DataTypes.STRING(20), defaultValue: 'task' },
    due_date: { type: DataTypes.DATEONLY },
    max_score: { type: DataTypes.DECIMAL(5,2), defaultValue: 100 },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'assignments',
    timestamps: true,
    underscored: true,
  });
};
