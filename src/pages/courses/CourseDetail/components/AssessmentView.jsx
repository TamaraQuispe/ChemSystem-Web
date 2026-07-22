import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Clock, Award, RotateCcw, AlertTriangle,
  Trophy, CheckCircle2, X, ArrowLeft, ArrowRight, Bookmark,
  Timer, CheckCircle, TrendingUp, Target, Zap, Sparkles, FileText,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../utils/cn';
import api from '../../../../services/api';
import { LessonRecommendations } from './LessonRecommendations';

const TOPICS = ['Química General', 'Química Orgánica', 'Termodinámica', 'Estequiometría', 'Enlaces', 'Ácido-Base'];

const ExamIntro = ({ assessment, courseTitle, onStart }) => {
  if (!assessment) return null;
  const totalQ = assessment.questions?.length || 0;
  const timeLimit = assessment.time_limit_minutes || 60;
  const passingScore = assessment.passing_score || 70;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4">
          Requisito de Certificación
        </span>
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight max-w-3xl leading-tight">
          Evaluación Final{courseTitle ? `: ${courseTitle}` : ''}
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          {/* Dean's Letter */}
          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-sm border border-outline-variant/15">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <GraduationCap size={32} />
              </div>
              <div className="space-y-4">
                <p className="text-on-surface-variant leading-relaxed text-lg italic">
                  "Estimado estudiante, este examen valida tu comprensión de los principios fundamentales
                  y tu capacidad para aplicarlos en situaciones complejas. Confío en la formación que has
                  recibido. Procede con precisión y confianza."
                </p>
                <div>
                  <p className="font-headline font-bold text-on-surface">Comité Académico</p>
                  <p className="text-sm text-on-surface-variant">ChemSystem Education</p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10">
            <h3 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
              <Award size={20} className="text-primary" />
              Protocolo de Evaluación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl">
                <CheckCircle size={20} className="text-secondary" />
                <span className="text-sm font-medium">Módulos completos</span>
              </div>
              <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl">
                <CheckCircle size={20} className="text-secondary" />
                <span className="text-sm font-medium">Laboratorios aprobados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Metrics Card */}
          <div className="bg-gradient-to-br from-primary to-primary-container text-on-primary p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-widest font-bold opacity-80 mb-1">Duración Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-headline font-extrabold">{timeLimit}</span>
                  <span className="text-xl font-medium opacity-90">minutos</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-on-primary/20 pb-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap size={20} />
                    <span className="font-medium">{totalQ} Preguntas</span>
                  </div>
                  <div className="text-right text-xs opacity-80">
                    Opción múltiple
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Award size={20} />
                    <span className="font-medium">Score Mínimo</span>
                  </div>
                  <span className="bg-on-primary text-primary font-bold px-3 py-1 rounded-lg">{passingScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="bg-surface-container-highest/50 p-6 rounded-2xl flex flex-col gap-4">
            <button onClick={onStart}
              className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-headline font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.97]">
              Comenzar Examen Final
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionGrid = ({ total, current, answers, marked, onNavigate }) => (
  <div className="grid grid-cols-5 gap-2">
    {Array.from({ length: total }, (_, i) => {
      const num = i + 1;
      const isAnswered = answers[i] !== undefined;
      const isMarked = marked.includes(i);
      const isCurrent = i === current;
      return (
        <button key={i} onClick={() => onNavigate(i)}
          className={cn(
            'w-full aspect-square rounded-lg text-sm font-bold flex items-center justify-center transition-all',
            isCurrent ? 'bg-primary text-white shadow-sm border-2 border-primary' :
            isAnswered && isMarked ? 'bg-tertiary-container text-white relative' :
            isAnswered ? 'bg-primary text-white' :
            isMarked ? 'bg-tertiary-container/30 text-tertiary border border-tertiary/30 relative' :
            'bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          )}>
          {num}
          {isMarked && !isCurrent && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-tertiary-container" />
          )}
        </button>
      );
    })}
  </div>
);

const ExamInProgress = ({ assessment, onSubmit, onBack }) => {
  const questions = assessment?.questions || [];
  const totalQ = questions.length;
  const timeLimit = (assessment?.time_limit_minutes || 60) * 60;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const answeredCount = Object.keys(answers).length;
  const progress = totalQ > 0 ? (answeredCount / totalQ) * 100 : 0;

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/assessments/${assessment.id}/submit`, {
        answers: Object.entries(answers).map(([qId, optId]) => ({ questionId: qId, selectedOptionId: optId })),
        timeSpentSeconds: timeLimit - timeLeft,
      });
      setResult(res.data);
      onSubmit?.(res.data);
    } catch (err) { alert(err.message); }
    setSubmitting(false);
  }, [assessment, answers, timeLimit, timeLeft, submitting, onSubmit]);

  const currentQ = questions[currentIdx];

  if (result) return null; // parent will render results

  return (
    <div className="flex h-[calc(100vh-100px)] -mx-8 lg:-mx-12 -mt-8">
      {/* Left: Question Area */}
      <div className="flex-grow overflow-y-auto p-8 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header bar */}
          <div className="flex items-center justify-between">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Pregunta {currentIdx + 1} de {totalQ}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-primary">
                <Timer size={20} />
                <span className="font-headline font-bold text-xl tabular-nums">
                  {minutes}:{seconds < 10 ? '0' : ''}{seconds}
                </span>
              </div>
              <button onClick={() => setMarked(p => p.includes(currentIdx) ? p.filter(i => i !== currentIdx) : [...p, currentIdx])}
                className={cn("flex items-center gap-1.5 text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg",
                  marked.includes(currentIdx) ? 'bg-tertiary-container/20 text-tertiary' : 'text-on-surface-variant hover:text-tertiary'
                )}>
                <Bookmark size={16} className={marked.includes(currentIdx) ? 'fill-tertiary' : ''} />
                Marcar
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant">{answeredCount}/{totalQ}</span>
          </div>

          {/* Question */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-surface-container">
            <h2 className="text-xl font-headline font-semibold text-on-surface leading-tight mb-6">
              {currentQ?.text}
            </h2>
            <div className="space-y-3">
              {currentQ?.options?.map(opt => {
                const isSelected = answers[currentQ.id] === opt.id;
                return (
                  <label key={opt.id}
                    className={cn(
                      'flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.99]',
                      isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-surface-container-high hover:bg-surface-container-low'
                    )}>
                    <input type="radio" name={`q-${currentQ.id}`} checked={isSelected}
                      onChange={() => setAnswers(a => ({ ...a, [currentQ.id]: opt.id }))}
                      className="w-5 h-5 text-primary border-outline focus:ring-primary" />
                    <span className={cn('ml-4 font-medium', isSelected ? 'text-primary font-bold' : 'text-on-surface-variant')}>
                      {opt.text}
                    </span>
                    {isSelected && <CheckCircle size={18} className="ml-auto text-primary" />}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4">
            <button onClick={() => currentIdx > 0 && setCurrentIdx(i => i - 1)}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 text-on-surface-variant font-bold px-6 py-3 rounded-lg hover:bg-surface-container-high transition-all disabled:opacity-30">
              <ArrowLeft size={18} /> Anterior
            </button>
            <div className="flex items-center gap-4">
              {currentIdx < totalQ - 1 ? (
                <button onClick={() => setCurrentIdx(i => i + 1)}
                  className="flex items-center gap-2 bg-primary text-on-primary font-bold px-8 py-3 rounded-lg hover:shadow-md transition-all active:scale-95">
                  Siguiente <ArrowRight size={18} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex items-center gap-2 bg-secondary text-on-secondary font-bold px-8 py-3 rounded-lg hover:shadow-md transition-all active:scale-95">
                  {submitting ? 'Enviando...' : 'Finalizar Examen'} <Award size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Question Grid */}
      <aside className="w-80 border-l border-outline-variant/10 p-6 bg-surface-container-low/30 overflow-y-auto hidden lg:block">
        <h3 className="font-headline font-bold text-sm text-on-surface-variant uppercase tracking-widest mb-6">Mapa del Examen</h3>
        <QuestionGrid total={totalQ} current={currentIdx} answers={answers} marked={marked} onNavigate={setCurrentIdx} />
        <div className="space-y-3 mt-8 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
          <div className="flex items-center gap-3"><span className="w-3 h-3 bg-primary rounded-sm" /><span>Respondida</span></div>
          <div className="flex items-center gap-3"><span className="w-3 h-3 bg-white border border-primary rounded-sm" /><span>Actual</span></div>
          <div className="flex items-center gap-3"><span className="w-3 h-3 bg-tertiary-container rounded-sm" /><span>Marcada</span></div>
          <div className="flex items-center gap-3"><span className="w-3 h-3 bg-white border border-outline-variant rounded-sm" /><span>Pendiente</span></div>
        </div>
        <div className="mt-8">
          <button onClick={handleSubmit} disabled={submitting}
            className="w-full bg-primary py-4 rounded-xl text-on-primary font-headline font-bold text-lg hover:shadow-lg transition-all active:scale-95">
            Finalizar Examen
          </button>
        </div>
      </aside>
    </div>
  );
};

const ExamResults = ({ result, questions, courseId, onBack }) => {
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);

  if (!result) return null;
  const totalQ = questions?.length || 0;
  const correct = result.correctCount || 0;
  const percentage = result.percentage || 0;
  const passed = result.passed;
  const graded = result.gradedAnswers || [];

  const topicScores = useMemo(() => {
    const map = {};
    (questions || []).forEach((q, i) => {
      const topic = (q.tags?.[0]) || TOPICS[i % TOPICS.length];
      if (!map[topic]) map[topic] = { correct: 0, total: 0 };
      map[topic].total++;
      if (graded[i]?.isCorrect) map[topic].correct++;
    });
    return Object.entries(map).map(([name, data]) => ({
      name, percent: Math.round((data.correct / data.total) * 100), ...data,
    }));
  }, [questions, graded]);

  const displayed = showAll ? questions : questions?.slice(0, 5);

  const circleRadius = 84;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Summary Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
          <div className="relative shrink-0">
            <div className="w-48 h-48 rounded-full border-[12px] border-surface-container-low flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" fill="transparent" r={circleRadius}
                  stroke={passed ? '#006c4d' : '#ba1a1a'} strokeWidth="12"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  className="transition-all duration-1000" />
              </svg>
              <div className="text-center">
                <span className="text-5xl font-headline font-black text-on-surface">{percentage}</span>
                <span className="text-on-surface-variant font-bold block">/100</span>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className={cn("inline-flex items-center gap-2 px-4 py-1 rounded-full font-bold text-xs tracking-wider uppercase",
              passed ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
            )}>
              {passed ? <CheckCircle size={16} /> : <X size={16} />}
              {passed ? 'Aprobado' : 'No Aprobado'}
            </div>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface leading-tight">Resultado del Examen</h3>
            <div className="flex flex-wrap gap-6 text-on-surface-variant text-sm font-medium">
              <div className="flex items-center gap-2"><Clock size={16} className="text-primary" /> Tiempo: {Math.floor((result.attempt?.time_spent_seconds || 0) / 60)} min</div>
              <div className="flex items-center gap-2"><GraduationCap size={16} className="text-primary" /> Preguntas: {correct}/{totalQ}</div>
              <div className="flex items-center gap-2"><TrendingUp size={16} className="text-primary" /> Score: {percentage}%</div>
            </div>
          </div>
        </div>

        <div className={cn("lg:col-span-4 rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden",
          passed ? 'bg-gradient-to-br from-primary to-primary-container' : 'bg-gradient-to-br from-error to-error-container'
        )}>
          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">
              {passed ? 'Certificación' : 'Resultado'}
            </p>
            <h4 className="text-2xl font-headline font-bold leading-tight mb-4">
              {passed ? '¡Felicidades por tu logro!' : 'Sigue practicando'}
            </h4>
            <p className="opacity-90 text-sm leading-relaxed">
              {passed ? 'Tu dominio ha sido validado. Puedes generar tu certificado.' : 'Revisa las áreas de mejora y vuelve a intentarlo.'}
            </p>
          </div>
          {passed && (
            <Button onClick={async () => {
              try {
                await api.post(`/certificates/courses/${courseId}/generate`);
                alert('¡Certificado generado!');
              } catch { alert('Completa todos los módulos primero.'); }
            }} className="mt-4 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-primary-fixed-dim transition-colors relative z-10">
              <Award size={18} /> Generar Certificado
            </Button>
          )}
        </div>
      </div>

      {/* Topic Breakdown */}
      <h3 className="text-xl font-headline font-bold mb-6 text-on-surface">Análisis por Área Temática</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {topicScores.map((topic, i) => (
          <div key={i} className="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container-high transition-all">
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-surface-container-lowest rounded-2xl">
                <Target size={20} className="text-primary" />
              </div>
              <span className={cn("text-2xl font-headline font-black", topic.percent >= 80 ? 'text-secondary' : topic.percent >= 60 ? 'text-amber-500' : 'text-error')}>
                {topic.percent}%
              </span>
            </div>
            <h5 className="font-bold text-on-surface mb-2">{topic.name}</h5>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", topic.percent >= 80 ? 'bg-secondary' : topic.percent >= 60 ? 'bg-amber-500' : 'bg-error')}
                style={{ width: `${topic.percent}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Question Review */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-headline font-bold text-on-surface">Revisión Detallada</h3>
            <p className="text-on-surface-variant text-sm mt-1">Analiza tus respuestas</p>
          </div>
        </div>

        <div className="space-y-6">
          {displayed?.map((q, qi) => {
            const ga = graded[qi];
            const isCorrect = ga?.isCorrect;
            const isExpanded = expanded === qi;
            return (
              <div key={q.id} className="border-b border-surface-container-high pb-6 last:border-none">
                <div className="flex items-start gap-4">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                    isCorrect ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                  )}>{qi + 1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h6 className="font-bold text-on-surface">{q.text}</h6>
                      {isCorrect
                        ? <CheckCircle size={20} className="text-secondary shrink-0" />
                        : <X size={20} className="text-error shrink-0" />
                      }
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
                      <p className="text-on-surface-variant text-sm italic">
                        Tu respuesta: <span className={isCorrect ? 'text-secondary font-semibold' : 'text-error font-semibold'}>
                          {q.options?.find(o => o.id === ga?.selectedOptionId)?.text || '—'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-on-surface-variant mt-2">
                          Correcta: <span className="text-secondary font-semibold">
                            {q.options?.find(o => o.is_correct)?.text || '—'}
                          </span>
                        </p>
                      )}
                    </div>
                    <button onClick={() => setExpanded(isExpanded ? null : qi)}
                      className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                      VER EXPLICACIÓN TÉCNICA
                    </button>
                    {isExpanded && (
                      <div className="mt-3 p-4 bg-surface-container-low rounded-xl">
                        <p className="text-sm text-on-surface-variant leading-relaxed">{ga?.explanation || q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {questions?.length > 5 && !showAll && (
          <div className="mt-10 flex justify-center">
            <button onClick={() => setShowAll(true)}
              className="px-8 py-4 bg-surface-container-low text-primary font-bold rounded-2xl hover:bg-surface-container-high transition-all active:scale-95">
              Cargar {questions.length - 5} preguntas más
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center pt-8 flex-wrap">
        {!passed && (
          <Button onClick={onBack}
            className="px-8 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm">
            Reintentar
          </Button>
        )}
        <Button onClick={onBack}
          className="px-8 py-3 bg-surface-container-high text-on-surface rounded-2xl font-bold text-sm">
          Volver al curso
        </Button>
      </div>
    </div>
  );
};

const AssessmentView = ({ assessment, onBack, courseId, courseTitle, isFinalExam, moduleId, lessons, onNavigateToLesson }) => {
  const [screen, setScreen] = useState('intro');
  const [result, setResult] = useState(null);

  if (!assessment) return (
    <div className="text-center py-12">
      <p className="text-sm font-bold text-on-surface-variant">No hay evaluación disponible.</p>
      <button onClick={onBack} className="mt-4 text-sm font-bold text-primary">← Volver</button>
    </div>
  );

  const handleSubmit = (res) => {
    setResult(res);
    setScreen('results');
  };

  if (screen === 'intro') {
    return <ExamIntro assessment={assessment} courseTitle={courseTitle} onStart={() => setScreen('exam')} />;
  }

  if (screen === 'exam') {
    return <ExamInProgress assessment={assessment} onSubmit={handleSubmit} onBack={() => setScreen('intro')} />;
  }

  if (screen === 'results') {
    return <ExamResults result={result} questions={assessment.questions} courseId={courseId} onBack={() => setScreen('intro')} />;
  }

  return null;
};

export { AssessmentView };
