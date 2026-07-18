const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('QuizResult', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    module_id: { type: DataTypes.UUID },
    score: { type: DataTypes.INTEGER, allowNull: false },
    max_score: { type: DataTypes.INTEGER, defaultValue: 100 },
    xp_earned: { type: DataTypes.INTEGER, defaultValue: 0 },
    answers: { type: DataTypes.JSONB },
    time_spent_seconds: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'quiz_results',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  });
};
