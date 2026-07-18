const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('QuestionBank', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    assessment_id: { type: DataTypes.UUID },
    text: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.STRING(30), defaultValue: 'multiple_choice',
      validate: { isIn: [['multiple_choice', 'true_false', 'multiple_select', 'fill_blank', 'matching']] },
    },
    options: { type: DataTypes.JSONB, allowNull: false },
    explanation: DataTypes.TEXT,
    feedback_correct: DataTypes.TEXT,
    feedback_incorrect: DataTypes.TEXT,
    difficulty: { type: DataTypes.STRING(10), defaultValue: 'medium' },
    tags: { type: DataTypes.JSONB, defaultValue: [] },
    xp_reward: { type: DataTypes.INTEGER, defaultValue: 10 },
    order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'question_bank',
    timestamps: true,
    underscored: true,
  });
};
