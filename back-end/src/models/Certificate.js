const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Certificate', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    course_id: { type: DataTypes.UUID, allowNull: false },
    issued_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    certificate_code: { type: DataTypes.STRING(50), unique: true },
    metadata: { type: DataTypes.JSONB, defaultValue: {} },
  }, {
    tableName: 'certificates',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  });
};
