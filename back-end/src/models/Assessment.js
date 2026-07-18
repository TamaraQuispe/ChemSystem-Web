const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Assessment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    course_id: { type: DataTypes.UUID },
    module_id: { type: DataTypes.UUID },
    lesson_id: { type: DataTypes.UUID },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.STRING(30), allowNull: false,
      validate: { isIn: [['quick_check', 'graded_practice', 'partial_exam', 'final_exam', 'diagnostic']] },
    },
    passing_score: { type: DataTypes.INTEGER, defaultValue: 70 },
    max_attempts: { type: DataTypes.INTEGER, defaultValue: 1 },
    time_limit_minutes: DataTypes.INTEGER,
    question_count: DataTypes.INTEGER,
    random_order: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'assessments',
    timestamps: true,
    underscored: true,
  });
};
