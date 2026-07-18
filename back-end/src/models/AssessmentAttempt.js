const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AssessmentAttempt', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    assessment_id: { type: DataTypes.UUID, allowNull: false },
    attempt_number: { type: DataTypes.INTEGER, defaultValue: 1 },
    started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    completed_at: DataTypes.DATE,
    answers: { type: DataTypes.JSONB, defaultValue: [] },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    max_score: { type: DataTypes.INTEGER, defaultValue: 100 },
    passed: { type: DataTypes.BOOLEAN, defaultValue: false },
    time_spent_seconds: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'assessment_attempts',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [{ unique: true, fields: ['user_id', 'assessment_id', 'attempt_number'] }],
  });
};
