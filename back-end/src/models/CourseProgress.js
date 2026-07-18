const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('CourseProgress', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    course_id: { type: DataTypes.UUID, allowNull: false },
    current_module_id: DataTypes.UUID,
    current_lesson_id: DataTypes.UUID,
    modules_completed: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_modules: { type: DataTypes.INTEGER, defaultValue: 0 },
    assessments_passed: { type: DataTypes.INTEGER, defaultValue: 0 },
    assessments_pending: { type: DataTypes.INTEGER, defaultValue: 0 },
    final_exam_unlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
    final_exam_attempted: { type: DataTypes.BOOLEAN, defaultValue: false },
    final_exam_passed: { type: DataTypes.BOOLEAN, defaultValue: false },
    certificate_generated: { type: DataTypes.BOOLEAN, defaultValue: false },
    certificate_generated_at: DataTypes.DATE,
    started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    completed_at: DataTypes.DATE,
    total_time_spent_seconds: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'course_progress',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [{ unique: true, fields: ['user_id', 'course_id'] }],
  });
};
