const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Module', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    course_id: { type: DataTypes.UUID },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: DataTypes.TEXT,
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    difficulty: { type: DataTypes.STRING(20), defaultValue: 'intermediate' },
    category: { type: DataTypes.STRING(100) },
    duration_minutes: { type: DataTypes.INTEGER, defaultValue: 30 },
    order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: true },
    xp_reward: { type: DataTypes.INTEGER, defaultValue: 100 },
    thumbnail_url: DataTypes.STRING(500),
    content: { type: DataTypes.JSONB, defaultValue: [] },
    final_exam: { type: DataTypes.JSONB, defaultValue: [] },
    summary: { type: DataTypes.JSONB, defaultValue: {} },
    curiosities: { type: DataTypes.JSONB, defaultValue: [] },
  }, {
    tableName: 'modules',
    timestamps: true,
    underscored: true,
  });
};
