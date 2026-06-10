import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw, BookOpen, ChevronLeft } from 'lucide-react';
import LESSONS from '../../data/lessons';
import { useLessonStore } from '../../store/lessonStore';
import { useAchievementStore, XP_PER_ACTIVITY } from '../../store/achievementStore';

const LessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const { getProgress, saveProgress, markCompleted } = useLessonStore();
  const addXp = useAchievementStore((s) => s.addXp);

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
    } else {
      const next = currentStep + 1;
      setCurrentStep(next);
      setSelectedOption(null);
      setShowResult(false);
      saveProgress(lessonId, next, lesson.steps.length);
    }
  }, [currentStep, isLastStep, lesson, lessonId, selectedOption, isInteractive, saveProgress, markCompleted, addXp]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  }, [currentStep]);

  const handleOptionClick = (idx) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
  };

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-xl font-bold text-gray-400">Lección no encontrada</p>
        <Link to="/lessons" className="text-primary font-bold hover:underline">Volver a lecciones</Link>
      </div>
    );
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8"
      >
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-[#0D2140]">¡Lección completada!</h2>
          <p className="text-gray-500 font-semibold">Has terminado "{lesson.title}"</p>
          <p className="text-sm text-emerald-600 font-bold">+{XP_PER_ACTIVITY.lesson} XP ganados</p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/lessons"
            className="bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-8 py-3.5 rounded-xl transition-all text-sm"
          >
            Volver a lecciones
          </Link>
          <button
            onClick={() => {
              setCurrentStep(0);
              setCompleted(false);
              setSelectedOption(null);
              setShowResult(false);
              saveProgress(lessonId, 0, lesson.steps.length);
            }}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-6 py-3.5 rounded-xl transition-all text-sm"
          >
            <RotateCcw size={16} /> Repetir
          </button>
        </div>
      </motion.div>
    );
  }

  const percentage = Math.round(((currentStep + 1) / lesson.steps.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/lessons')}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
        >
          <ChevronLeft size={16} />
          Todas las lecciones
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-400">{currentStep + 1}/{lesson.steps.length} pasos</span>
          <span className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              className="h-full bg-primary rounded-full"
            />
          </span>
          <span className="text-[10px] font-black text-primary">{percentage}%</span>
        </div>
      </div>

      {/* Progress bar below top */}
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
        />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 shadow-sm"
        >
          {/* Step badge & title */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider">
              <span className={cn(
                "px-3 py-1 rounded-full border",
                step.type === 'text' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                step.type === 'diagram' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                step.type === 'example' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                'bg-emerald-50 text-emerald-600 border-emerald-100'
              )}>
                {step.type === 'text' ? '📖 Teoría' :
                 step.type === 'diagram' ? '📐 Diagrama' :
                 step.type === 'example' ? '💡 Ejemplo' : '✏️ Actividad'}
              </span>
              <span>{lesson.title}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0D2140] tracking-tight">
              {step.title}
            </h2>

            {/* Text content */}
            {(step.type === 'text' || step.type === 'example') && (
              <div className="space-y-4">
                <p className="text-base text-gray-600 font-medium leading-relaxed">
                  {step.content}
                </p>
                {step.highlight && (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                    <p className="text-sm font-bold text-blue-800">{step.highlight}</p>
                  </div>
                )}
              </div>
            )}

            {/* Diagram */}
            {step.type === 'diagram' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: step.svg }} />
                <p className="text-xs text-center text-gray-400 font-medium italic">{step.caption}</p>
              </div>
            )}

            {/* Interactive activity */}
            {step.type === 'interactive' && (
              <div className="space-y-6">
                <p className="text-base text-gray-600 font-semibold">{step.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {step.options.map((opt, idx) => {
                    const isCorrect = idx === step.correctIndex;
                    const isSelected = selectedOption === idx;
                    let cardStyle = 'border-gray-100 bg-white hover:bg-gray-50';
                    if (showResult && isSelected) {
                      cardStyle = isCorrect
                        ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200'
                        : 'border-red-400 bg-red-50 ring-2 ring-red-200';
                    } else if (showResult && isCorrect) {
                      cardStyle = 'border-emerald-300 bg-emerald-50/50';
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        className={`p-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all active:scale-[0.98] ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                          {showResult && isSelected && (
                            isCorrect
                              ? <CheckCircle2 size={18} className="text-emerald-500 ml-auto shrink-0" />
                              : <XCircle size={18} className="text-red-500 ml-auto shrink-0" />
                          )}
                          {showResult && !isSelected && isCorrect && (
                            <CheckCircle2 size={18} className="text-emerald-400 ml-auto shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl ${selectedOption === step.correctIndex ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}
                  >
                    <p className={`text-sm font-bold ${selectedOption === step.correctIndex ? 'text-emerald-800' : 'text-red-800'}`}>
                      {selectedOption === step.correctIndex ? '✅ ¡Correcto!' : '❌ Incorrecto'}
                    </p>
                    <p className="text-xs font-medium mt-1 text-gray-600">{step.explanation}</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-black text-xs hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} /> Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={isInteractive && selectedOption === null}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#004B76] hover:bg-[#003B5C] text-white font-black text-xs shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isLastStep ? 'Finalizar' : 'Siguiente'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default LessonViewer;
