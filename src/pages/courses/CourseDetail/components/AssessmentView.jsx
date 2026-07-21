import React, { useState } from 'react';
import {
  GraduationCap, Clock, Award, RotateCcw, AlertTriangle,
  Trophy, CheckCircle2
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../utils/cn';
import api from '../../../../services/api';
import { LessonRecommendations } from './LessonRecommendations';

const AssessmentDetails = ({ assessment }) => (
  <div className="lg:col-span-5 sticky top-8">
    <div className="backdrop-blur-md bg-white/70 rounded-3xl border border-white/50 p-8 shadow-lg relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#004b71]/10 rounded-full blur-2xl" />
      <h3 className="text-xl font-headline font-extrabold text-[#1a1c1d] mb-8">Detalles de Evaluación</h3>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-[#f3f3f4] flex flex-col gap-2">
          <GraduationCap size={20} className="text-[#004b71]" />
          <span className="text-xs font-bold text-[#40484f] uppercase tracking-tighter">Preguntas</span>
          <span className="text-2xl font-headline font-bold">{assessment.questions?.length || 0}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#f3f3f4] flex flex-col gap-2">
          <Clock size={20} className="text-[#004b71]" />
          <span className="text-xs font-bold text-[#40484f] uppercase tracking-tighter">Tiempo Límite</span>
          <span className="text-2xl font-headline font-bold">{assessment.time_limit_minutes || '—'} Min</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#f3f3f4] flex flex-col gap-2">
          <Award size={20} className="text-[#004b71]" />
          <span className="text-xs font-bold text-[#40484f] uppercase tracking-tighter">Puntaje Mínimo</span>
          <span className="text-2xl font-headline font-bold">{assessment.passing_score || 70}%</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#f3f3f4] flex flex-col gap-2">
          <RotateCcw size={20} className="text-[#004b71]" />
          <span className="text-xs font-bold text-[#40484f] uppercase tracking-tighter">Intentos</span>
          <span className="text-2xl font-headline font-bold">{assessment.max_attempts || 1}</span>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-[#40484f]">
          <AlertTriangle size={16} className="text-[#ba1a1a]" />
          <span>El intento no puede pausarse una vez iniciado.</span>
        </div>
      </div>
    </div>
  </div>
);

const QuestionList = ({ questions, answers, onAnswer }) => (
  <>
    {questions?.map((q, qi) => (
      <div key={q.id} className="mb-8 last:mb-0 pb-8 last:pb-0 border-b last:border-b-0 border-outline-variant/20">
        <p className="text-sm font-bold text-[#1a1c1d] mb-4">{qi + 1}. {q.text}</p>
        <div className="space-y-2">
          {q.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => onAnswer(q.id, opt.id)}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium',
                answers[q.id] === opt.id
                  ? 'border-[#004b71] bg-[#004b71]/5 text-[#004b71]'
                  : 'border-outline-variant/30 hover:border-[#004b71]/30 text-[#40484f]'
              )}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    ))}
  </>
);

const AssessmentResultView = ({ result, questions, wrongIndices, lessons, onNavigateToLesson, onRetry, onBack, courseId }) => (
  <div className="max-w-3xl mx-auto space-y-6">
    <div className={cn(
      'p-8 rounded-2xl text-center',
      result.passed
        ? 'bg-[#86f8c8]/20 border-2 border-[#86f8c8]'
        : 'bg-[#ffdad6]/30 border-2 border-[#ffdad6]'
    )}>
      <Trophy size={48} className={cn('mx-auto mb-4', result.passed ? 'text-[#006c4d]' : 'text-[#ba1a1a]')} />
      <h3 className="text-2xl font-headline font-bold mb-2">
        {result.passed ? '¡Práctica Aprobada!' : 'Sigue practicando'}
      </h3>
      <p className="text-lg font-bold">
        {result.correctCount}/{result.totalQuestions} correctas · {result.percentage}%
      </p>
    </div>

    {questions?.map((q, qi) => {
      const ga = result.gradedAnswers?.[qi];
      return (
        <div key={q.id} className={cn(
          'p-6 rounded-2xl border-2',
          ga?.isCorrect
            ? 'border-[#86f8c8]/50 bg-[#86f8c8]/10'
            : 'border-[#ffdad6]/50 bg-[#ffdad6]/10'
        )}>
          <div className="flex items-start gap-3">
            {ga?.isCorrect
              ? <CheckCircle2 size={20} className="text-[#006c4d] shrink-0 mt-0.5" />
              : <AlertTriangle size={20} className="text-[#ba1a1a] shrink-0 mt-0.5" />
            }
            <div>
              <p className="text-sm font-bold text-[#1a1c1d] mb-2">{qi + 1}. {q.text}</p>
              <p className="text-xs font-medium text-[#40484f]">
                {ga?.explanation || q.explanation}
              </p>
            </div>
          </div>
        </div>
      );
    })}

    {wrongIndices.length > 0 && lessons.length > 0 && (
      <LessonRecommendations
        lessons={lessons}
        onNavigateToLesson={onNavigateToLesson}
      />
    )}

    <div className="flex gap-4 justify-center pt-4 flex-wrap">
      {!result.passed && (
        <Button onClick={onRetry}
          className="px-8 py-3 bg-[#004b71] text-white rounded-2xl font-bold text-sm">
          Reintentar
        </Button>
      )}
      <Button onClick={onBack}
        className="px-8 py-3 bg-[#e8e8e9] text-[#40484f] rounded-2xl font-bold text-sm">
        Volver al curso
      </Button>
      {result.passed && (
        <Button onClick={async () => {
          try {
            await api.post(`/certificates/courses/${courseId}/generate`);
            alert('¡Certificado generado!');
          } catch { alert('Completa el examen final primero.'); }
        }}
          className="px-8 py-3 bg-gradient-to-r from-[#004b71] to-[#006494] text-white rounded-2xl font-bold text-sm">
          Generar Certificado
        </Button>
      )}
    </div>
  </div>
);

export const AssessmentView = ({ assessment, onBack, courseId, moduleId, lessons, onNavigateToLesson }) => {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);

  if (!assessment) return (
    <div className="text-center py-12">
      <p className="text-sm font-bold text-[#40484f]">No hay práctica disponible para este módulo.</p>
      <button onClick={onBack} className="mt-4 text-sm font-bold text-[#004b71]">← Volver</button>
    </div>
  );

  const wrongQuestionIndices = result?.gradedAnswers
    ?.map((ga, i) => ga?.isCorrect ? -1 : i)
    .filter(i => i >= 0) || [];

  const allAnswered = Object.keys(answers).length >= (assessment.questions?.length || 0);

  const handleSubmit = async () => {
    if (!assessment || !allAnswered) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/assessments/${assessment.id}/submit`, {
        answers: Object.entries(answers).map(([qId, optId]) => ({
          questionId: qId,
          selectedOptionId: optId,
        })),
        timeSpentSeconds: 0,
      });
      setResult(res.data);
    } catch (err) { alert(err.message); }
    setSubmitting(false);
  };

  const handleAnswer = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-lg font-headline font-bold text-[#1a1c1d] mb-6 flex items-center gap-2">
                <GraduationCap size={20} className="text-[#004b71]" />
                {assessment.title}
              </h3>
              <QuestionList
                questions={assessment.questions}
                answers={answers}
                onAnswer={handleAnswer}
              />
              <Button onClick={handleSubmit} isLoading={submitting}
                disabled={!allAnswered}
                className="w-full h-12 bg-gradient-to-r from-[#004b71] to-[#006494] text-white rounded-2xl font-bold text-sm shadow-lg mt-6">
                Enviar respuestas
              </Button>
            </section>
          </div>
          <AssessmentDetails assessment={assessment} />
        </div>
      ) : (
        <AssessmentResultView
          result={result}
          questions={assessment.questions}
          wrongIndices={wrongQuestionIndices}
          lessons={lessons}
          onNavigateToLesson={onNavigateToLesson}
          onRetry={() => { setResult(null); setAnswers({}); }}
          onBack={onBack}
          courseId={courseId}
        />
      )}
    </div>
  );
};
