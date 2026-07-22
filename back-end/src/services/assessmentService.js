const { Assessment, QuestionBank, AssessmentAttempt, CourseProgress } = require('../models');

async function submitAssessment(userId, assessmentId, data) {
  const assessment = await Assessment.findByPk(assessmentId, {
    include: [{ model: QuestionBank, as: 'questions' }],
  });
  if (!assessment) throw new Error('Evaluación no encontrada');

  const questions = assessment.questions || [];
  const answers = data.answers || [];
  const timeSpent = data.timeSpentSeconds || 0;

  // Count attempts
  const attemptCount = await AssessmentAttempt.count({
    where: { user_id: userId, assessment_id: assessmentId },
  });
  const attemptNumber = attemptCount + 1;

  if (attemptNumber > (assessment.max_attempts || 1)) {
    throw new Error('Has alcanzado el número máximo de intentos');
  }

  // Grade
  let correctCount = 0;
  const gradedAnswers = questions.map((q) => {
    const userAnswer = answers.find(a => a.questionId === q.id);
    const selectedId = userAnswer?.selectedOptionId;
    const correctOption = q.options.find(o => o.is_correct);
    const isCorrect = selectedId === correctOption?.id;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      selectedOptionId: selectedId,
      correctOptionId: correctOption?.id,
      isCorrect,
      explanation: q.explanation,
      feedbackCorrect: q.feedback_correct,
      feedbackIncorrect: q.feedback_incorrect,
    };
  });

  const maxScore = questions.length * 10;
  const score = correctCount * 10;
  const passed = score / maxScore >= (assessment.passing_score / 100);

  // If practice, update UserModule progress
  if (assessment.type === 'graded_practice' && assessment.module_id && passed) {
    const { UserModule } = require('../models');
    await UserModule.upsert({
      user_id: userId,
      module_id: assessment.module_id,
      progress_percent: 100,
      status: 'completed',
      completed_at: new Date(),
      started_at: new Date(),
    });
  }

  // If final exam passed, mark it in CourseProgress
  if (assessment.type === 'final_exam' && assessment.course_id && passed) {
    await CourseProgress.update(
      { final_exam_passed: true, final_exam_attempted: true },
      { where: { user_id: userId, course_id: assessment.course_id } }
    );
  }

  const attempt = await AssessmentAttempt.create({
    user_id: userId,
    assessment_id: assessmentId,
    attempt_number: attemptNumber,
    answers: gradedAnswers,
    score,
    max_score: maxScore,
    passed,
    time_spent_seconds: timeSpent,
    completed_at: new Date(),
  });

  return {
    attempt,
    gradedAnswers,
    score,
    maxScore,
    passed,
    correctCount,
    totalQuestions: questions.length,
    percentage: Math.round((correctCount / questions.length) * 100),
  };
}

async function getAttemptsHistory(userId, assessmentId) {
  return AssessmentAttempt.findAll({
    where: { user_id: userId, assessment_id: assessmentId },
    order: [['attempt_number', 'DESC']],
  });
}

module.exports = { submitAssessment, getAttemptsHistory };
