const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = dbConfig.url
  ? new Sequelize(dbConfig.url, dbConfig)
  : new Sequelize(dbConfig);

const User = require('./User')(sequelize);
const Compound = require('./Compound')(sequelize);
const Module = require('./Module')(sequelize);
const UserModule = require('./UserModule')(sequelize);
const Experiment = require('./Experiment')(sequelize);
const ExperimentCompound = require('./ExperimentCompound')(sequelize);
const Prediction = require('./Prediction')(sequelize);
const KineticSnapshot = require('./KineticSnapshot')(sequelize);
const AiRecommendation = require('./AiRecommendation')(sequelize);
const Notification = require('./Notification')(sequelize);
const UserAnalytics = require('./UserAnalytics')(sequelize);
const CommunityPost = require('./CommunityPost')(sequelize);
const FamilyRelationship = require('./FamilyRelationship')(sequelize);
const Conversation = require('./Conversation')(sequelize);
const Message = require('./Message')(sequelize);
const Classroom = require('./Classroom')(sequelize);
const Enrollment = require('./Enrollment')(sequelize);
const Grade = require('./Grade')(sequelize);
const Assignment = require('./Assignment')(sequelize);
const QuizResult = require('./QuizResult')(sequelize);
const Achievement = require('./Achievement')(sequelize);
const Course = require('./Course')(sequelize);
const Lesson = require('./Lesson')(sequelize);
const Assessment = require('./Assessment')(sequelize);
const QuestionBank = require('./QuestionBank')(sequelize);
const AssessmentAttempt = require('./AssessmentAttempt')(sequelize);
const CourseProgress = require('./CourseProgress')(sequelize);
const Certificate = require('./Certificate')(sequelize);

// Associations
User.hasMany(Experiment, { foreignKey: 'user_id', as: 'experiments' });
Experiment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Prediction, { foreignKey: 'user_id', as: 'predictions' });
Prediction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Prediction.belongsTo(Experiment, { foreignKey: 'experiment_id', as: 'experiment' });
Experiment.hasMany(Prediction, { foreignKey: 'experiment_id', as: 'predictions' });

Experiment.belongsToMany(Compound, {
  through: ExperimentCompound,
  foreignKey: 'experiment_id',
  otherKey: 'compound_id',
  as: 'compounds',
});
Compound.belongsToMany(Experiment, {
  through: ExperimentCompound,
  foreignKey: 'compound_id',
  otherKey: 'experiment_id',
  as: 'experiments',
});

Experiment.hasMany(KineticSnapshot, { foreignKey: 'experiment_id', as: 'kineticSnapshots' });
KineticSnapshot.belongsTo(Experiment, { foreignKey: 'experiment_id', as: 'experiment' });

User.belongsToMany(Module, {
  through: UserModule,
  foreignKey: 'user_id',
  otherKey: 'module_id',
  as: 'modules',
});
Module.belongsToMany(User, {
  through: UserModule,
  foreignKey: 'module_id',
  otherKey: 'user_id',
  as: 'users',
});
UserModule.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(UserAnalytics, { foreignKey: 'user_id', as: 'analytics' });
UserAnalytics.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(CommunityPost, { foreignKey: 'user_id', as: 'posts' });
CommunityPost.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Family Relationship associations
User.hasMany(FamilyRelationship, { foreignKey: 'parent_id', as: 'parentRelationships' });
User.hasMany(FamilyRelationship, { foreignKey: 'student_id', as: 'studentRelationships' });
FamilyRelationship.belongsTo(User, { foreignKey: 'parent_id', as: 'parent' });
FamilyRelationship.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Conversation & Message associations
Conversation.belongsTo(User, { foreignKey: 'parent_id', as: 'parent' });
Conversation.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });
Conversation.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
Conversation.hasMany(Message, { foreignKey: 'conversation_id', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'conversation' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Teacher model associations
User.hasMany(Classroom, { foreignKey: 'teacher_id', as: 'classrooms' });
Classroom.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

Classroom.hasMany(Enrollment, { foreignKey: 'classroom_id', as: 'enrollments' });
Enrollment.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
User.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });

Enrollment.hasMany(Grade, { foreignKey: 'enrollment_id', as: 'grades' });
Grade.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });

Classroom.hasMany(Assignment, { foreignKey: 'classroom_id', as: 'assignments' });
Assignment.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });

User.hasMany(QuizResult, { foreignKey: 'user_id', as: 'quizResults' });
QuizResult.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Achievement, { foreignKey: 'user_id', as: 'achievements' });
Achievement.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Course → Module → Lesson
Course.hasMany(Module, { foreignKey: 'course_id', as: 'modules' });
Module.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Module.hasMany(Lesson, { foreignKey: 'module_id', as: 'lessons' });
Lesson.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });

// Assessments (polymorphic-like: can belong to course, module, or lesson)
Assessment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Assessment.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });
Assessment.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

Course.hasMany(Assessment, { foreignKey: 'course_id', as: 'assessments' });
Module.hasMany(Assessment, { foreignKey: 'module_id', as: 'assessments' });
Lesson.hasMany(Assessment, { foreignKey: 'lesson_id', as: 'assessments' });

// QuestionBank ← Assessment
QuestionBank.belongsTo(Assessment, { foreignKey: 'assessment_id', as: 'assessment' });
Assessment.hasMany(QuestionBank, { foreignKey: 'assessment_id', as: 'questions' });

// AssessmentAttempt ← User + Assessment
AssessmentAttempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
AssessmentAttempt.belongsTo(Assessment, { foreignKey: 'assessment_id', as: 'assessment' });
User.hasMany(AssessmentAttempt, { foreignKey: 'user_id', as: 'assessmentAttempts' });
Assessment.hasMany(AssessmentAttempt, { foreignKey: 'assessment_id', as: 'attempts' });

// CourseProgress ← User + Course
CourseProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
CourseProgress.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
User.hasOne(CourseProgress, { foreignKey: 'user_id', as: 'courseProgress' });

// Certificate
Certificate.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Certificate.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
User.hasMany(Certificate, { foreignKey: 'user_id', as: 'certificates' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Compound,
  Module,
  UserModule,
  Experiment,
  ExperimentCompound,
  Prediction,
  KineticSnapshot,
  AiRecommendation,
  Notification,
  UserAnalytics,
  CommunityPost,
  FamilyRelationship,
  Conversation,
  Message,
  Classroom,
  Enrollment,
  Grade,
  Assignment,
  QuizResult,
  Achievement,
  Course,
  Lesson,
  Assessment,
  QuestionBank,
  AssessmentAttempt,
  CourseProgress,
  Certificate,
};
