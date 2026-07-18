import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw, BookOpen, ChevronLeft, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import LESSONS from '../../data/lessons';
import { useLessonStore } from '../../store/lessonStore';
import { useAchievementStore, XP_PER_ACTIVITY } from '../../store/achievementStore';
import api from '../../services/api';

const LessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = LESSONS.find(l => l.id === lessonId);
  const { getProgress, saveProgress, markCompleted } = useLessonStore();
  const addXp = useAchievementStore(s => s.addXp);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  const savedProgress = getProgress(lessonId);
  const [currentStep, setCurrentStep] = useState(savedProgress.lastStep || 0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (lesson && !savedProgress.lastStep && currentStep === 0) {
      saveProgress(lessonId, 0, lesson.steps.length);
    }
  }, []);

  const step = lesson?.steps[currentStep];
  const isLastStep = currentStep === (lesson?.steps.length || 0) - 1;
  const isInteractive = step?.type === 'interactive';

  const handleNext = useCallback(() => {
    if (isInteractive && selectedOption === null) return;
    if (!lesson) return;

    if (isLastStep) {
      markCompleted(lessonId, lesson.steps.length);
      addXp(XP_PER_ACTIVITY.lesson, 'lesson');
      setCompleted(true);
      setSaving(true);
      api.post(`/student/lessons/${lessonId}/complete`).catch(() => {}).finally(() => setSaving(false));
    } else {
      saveProgress(lessonId, currentStep + 1, lesson.steps.length);
      setCurrentStep(c => c + 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  }, [currentStep, isInteractive, selectedOption, isLastStep, lesson, lessonId, addXp, markCompleted, saveProgress]);

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <AlertTriangle size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-lg font-bold text-text-secondary">Lección no encontrada</p>
        <Link to="/lessons" className="text-sm font-bold text-primary mt-4 inline-block">Volver a lecciones</Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-primary-dark mb-2">¡Lección completada!</h2>
          <p className="text-text-secondary font-semibold mb-8">Has dominado {lesson.title}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/lessons')} className="px-6 py-3 bg-primary-dark text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all">
              Volver a lecciones
            </button>
            <button onClick={() => { setCompleted(false); setCurrentStep(0); setSelectedOption(null); setShowResult(false); }}
              className="px-6 py-3 bg-gray-50 text-text-main rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all">
              Repetir
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const stepNumber = currentStep + 1;
  const totalSteps = lesson.steps.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/lessons')} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-text-secondary">{lesson.title}</span>
            <span className="text-[10px] font-bold text-text-secondary">Paso {stepNumber}/{totalSteps}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              className="h-full bg-primary rounded-full" />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-premium">

          {(step?.type === 'text' || step?.type === 'content' || step?.type === 'example') && (
            <div className="max-w-none">
              <h2 className="text-xl font-black text-primary-dark mb-4">{step.title}</h2>
              <div className="text-sm font-semibold text-text-secondary leading-relaxed space-y-4 whitespace-pre-line">
                {step.content}
              </div>
              {step.highlight && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs font-bold text-amber-700">
                  💡 {step.highlight}
                </div>
              )}
            </div>
          )}

          {step?.type === 'diagram' && (
            <div className="text-center">
              <h2 className="text-xl font-black text-primary-dark mb-4">{step.title}</h2>
              <div className="flex justify-center mb-4" dangerouslySetInnerHTML={{ __html: step.svg || '' }} />
              {step.caption && <p className="text-xs font-semibold text-text-secondary">{step.caption}</p>}
            </div>
          )}

          {step?.type === 'interactive' && (
            <div>
              <h2 className="text-xl font-black text-primary-dark mb-4">{step.question}</h2>
              <div className="space-y-3">
                {(step.options || []).map((opt, idx) => {
                  const correctAnswer = step.answer !== undefined ? step.answer : step.options?.[step.correctIndex];
                  const isCorrect = showResult && opt === correctAnswer;
                  const isWrong = showResult && selectedOption === opt && opt !== correctAnswer;
                  return (
                    <button key={idx} onClick={() => !showResult && setSelectedOption(opt)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border-2 transition-all font-semibold text-sm",
                        showResult && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-700",
                        showResult && isWrong && "border-red-400 bg-red-50 text-red-700",
                        !showResult && selectedOption === opt && "border-primary bg-primary/5 text-primary-dark",
                        !showResult && selectedOption !== opt && "border-gray-100 hover:border-gray-200 text-text-main",
                        showResult && !isCorrect && !isWrong && "border-gray-100 opacity-60"
                      )}>
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                        {showResult && isCorrect && <CheckCircle2 size={18} className="ml-auto text-emerald-500 shrink-0" />}
                        {showResult && isWrong && <XCircle size={18} className="ml-auto text-red-500 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <div className="mt-4 space-y-2">
                  <div className={cn("p-4 rounded-2xl text-xs font-bold",
                    selectedOption === (step.answer || step.options?.[step.correctIndex])
                      ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
                  )}>
                    {selectedOption === (step.answer || step.options?.[step.correctIndex])
                      ? '¡Correcto!'
                      : `Incorrecto. La respuesta correcta era: ${step.answer || step.options?.[step.correctIndex]}`}
                  </div>
                  {step.explanation && (
                    <div className="p-3 bg-blue-50 rounded-xl text-xs font-semibold text-blue-600">
                      {step.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!step?.type && (
            <div className="text-center py-8">
              <p className="text-sm font-semibold text-text-secondary">{step?.content || 'Contenido no disponible'}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div />
        <div className="flex gap-3">
          {isInteractive && !showResult && selectedOption && (
            <button onClick={() => setShowResult(true)}
              className="px-6 py-3 bg-gray-50 border border-gray-100 text-text-main rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all">
                Verificar
            </button>
          )}
          {(!isInteractive || showResult) && (
            <button onClick={handleNext}
              className="px-8 py-3 bg-primary-dark text-white rounded-2xl font-bold text-xs hover:bg-primary transition-all flex items-center gap-2">
              {isLastStep ? 'Finalizar' : 'Siguiente'} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
