const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Achievement', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT },
    icon: { type: DataTypes.STRING(50), defaultValue: 'trophy' },
    rarity: { type: DataTypes.STRING(20), defaultValue: 'common' },
    xp_awarded: { type: DataTypes.INTEGER, defaultValue: 50 },
  }, {
    tableName: 'achievements',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  });
};
