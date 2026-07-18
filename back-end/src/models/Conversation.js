const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Conversation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    parent_id: { type: DataTypes.UUID, allowNull: false },
    teacher_id: { type: DataTypes.UUID, allowNull: false },
    student_id: { type: DataTypes.UUID, allowNull: true },
    subject: { type: DataTypes.STRING(200), defaultValue: 'Consulta General' },
  }, {
    tableName: 'conversations',
    timestamps: true,
    updatedAt: 'last_message_at',
    underscored: true,
  });
};
