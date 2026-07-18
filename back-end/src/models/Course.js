const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Course', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: DataTypes.TEXT,
    category: DataTypes.STRING(100),
    difficulty: { type: DataTypes.STRING(20), defaultValue: 'intermediate' },
    duration_hours: { type: DataTypes.INTEGER, defaultValue: 10 },
    thumbnail_url: DataTypes.STRING(500),
    is_published: { type: DataTypes.BOOLEAN, defaultValue: true },
    order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    objectives: { type: DataTypes.JSONB, defaultValue: [] },
    competencies: { type: DataTypes.JSONB, defaultValue: [] },
    prerequisites_text: DataTypes.TEXT,
  }, {
    tableName: 'courses',
    timestamps: true,
    underscored: true,
  });
};
