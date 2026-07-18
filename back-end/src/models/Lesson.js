const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Lesson', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    module_id: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(100), allowNull: false },
    order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    content_blocks: { type: DataTypes.JSONB, defaultValue: [] },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'lessons',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['module_id', 'slug'] }],
  });
};
