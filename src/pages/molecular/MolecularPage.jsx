import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  X, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  ChevronRight, 
  Star, 
  Award,
  Info,
  CheckCircle2,
  FileText,
  Bookmark,
  MessageCircle,
  ThumbsUp,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { useAchievementStore, XP_PER_ACTIVITY } from '../../store/achievementStore';

const MAX_ATTEMPTS = 3;

const motivationalMessages = [
  '¡Sigue intentando! Estás cada vez más cerca de la respuesta correcta.',
  '¡Buen esfuerzo! Cada intento te acerca más al dominio del tema.',
  '¡No te rindas! La práctica constante es la clave del éxito en química.',
  '¡Vas por buen camino! Sigue analizando la ecuación con atención.',
  '¡Casi lo tienes! Revisa los coeficientes estequiométricos.',
];

const questions = [
  {
    id: 1,
    tags: { type: 'INTERACTIVO', topic: 'Equilibrio Químico', exercise: 'Ejercicio 4.2' },
    question: '¿Hacia dónde se desplazará el equilibrio si aumentamos la presión en la síntesis de amoníaco?',
    equation: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + ΔH',
    keywords: ['derecha', 'productos', 'nh3', 'amoníaco', 'menos moles', '2nh3', 'disminuye'],
    hints: [
      { id: 1, title: 'PISTA 1', text: 'Cuenta el número de moles de gas en cada lado de la ecuación. Reactivos: 1 + 3 = 4 moles. Productos: 2 moles.', color: 'bg-[#EAFBF3] border-green-100/20 text-[#065F46]', badge: 'text-[#059669]' },
      { id: 2, title: 'PISTA 2', text: 'El principio de Le Châtelier dice que el sistema se opone al cambio. Si aumentas la presión, el equilibrio se desplaza hacia el lado con MENOS moles gaseosos.', color: 'bg-[#FEF3C7] border-amber-100/20 text-[#92400E]', badge: 'text-[#D97706]' },
      { id: 3, title: 'PISTA 3', text: 'El lado derecho (2NH₃) tiene solo 2 moles de gas, mientras que el izquierdo (N₂ + 3H₂) tiene 4 moles. Por lo tanto, el equilibrio se desplaza hacia los productos (derecha).', color: 'bg-[#FEE2E2] border-red-100/20 text-[#991B1B]', badge: 'text-[#DC2626]' },
    ],
    explanation: 'El equilibrio se desplaza hacia los productos (derecha) porque hay menos moles gaseosos.',
    successMessage: '¡Respuesta correcta! Excelente aplicación del principio de Le Châtelier.',
  },
  {
    id: 2,
    tags: { type: 'INTERACTIVO', topic: 'Equilibrio Químico', exercise: 'Ejercicio 4.3' },
    question: '¿Hacia dónde se desplazará el equilibrio si aumentamos la temperatura en la síntesis de amoníaco (reacción exotérmica)?',
    equation: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + ΔH   (ΔH < 0)',
    keywords: ['izquierda', 'reactivos', 'endotérmico', 'n2', 'h2', 'se desplaza izquierda', 'desplaza izquierda', 'hacia izquierda', 'opone'],
    hints: [
      { id: 1, title: 'PISTA 1', text: 'Recuerda que la reacción directa es exotérmica (libera calor). El calor aparece del lado de los productos en la ecuación.', color: 'bg-[#EAFBF3] border-green-100/20 text-[#065F46]', badge: 'text-[#059669]' },
      { id: 2, title: 'PISTA 2', text: 'El principio de Le Châtelier: si aumentas la temperatura, el sistema se desplaza en la dirección que ABSORBE calor (endotérmica).', color: 'bg-[#FEF3C7] border-amber-100/20 text-[#92400E]', badge: 'text-[#D97706]' },
      { id: 3, title: 'PISTA 3', text: 'Como la reacción directa libera calor, la inversa lo absorbe. Aumentar temperatura favorece la reacción ENDOTÉRMICA (hacia la izquierda, hacia reactivos).', color: 'bg-[#FEE2E2] border-red-100/20 text-[#991B1B]', badge: 'text-[#DC2626]' },
    ],
    explanation: 'Al aumentar la temperatura, el equilibrio se desplaza hacia la izquierda (reactivos) para absorber el exceso de calor.',
    successMessage: '¡Correcto! Al aumentar la temperatura, el equilibrio se desplaza hacia la reacción endotérmica (izquierda).',
  },
  {
    id: 3,
    tags: { type: 'INTERACTIVO', topic: 'Equilibrio Químico', exercise: 'Ejercicio 4.4' },
    question: 'Si Kc = 3.2 × 10³ para N₂(g) + 3H₂(g) ⇌ 2NH₃(g) a 25°C, ¿qué nos indica este valor sobre el equilibrio?',
    equation: 'Kc = [NH₃]² / ([N₂][H₂]³) = 3.2 × 10³',
    keywords: ['productos', 'derecha', 'favorece productos', 'grande', 'mayor que 1', 'alta concentración', 'concentración productos', 'hacia productos', 'favorecida'],
    hints: [
      { id: 1, title: 'PISTA 1', text: 'Una constante de equilibrio grande (>> 1) significa que en el equilibrio hay más productos que reactivos.', color: 'bg-[#EAFBF3] border-green-100/20 text-[#065F46]', badge: 'text-[#059669]' },
      { id: 2, title: 'PISTA 2', text: 'Kc = [productos]/[reactivos]. Si Kc > 1, hay más productos. Si Kc < 1, hay más reactivos.', color: 'bg-[#FEF3C7] border-amber-100/20 text-[#92400E]', badge: 'text-[#D97706]' },
      { id: 3, title: 'PISTA 3', text: 'Kc = 3.2 × 10³ es mucho mayor que 1. Esto indica que la reacción está fuertemente desplazada hacia los productos (derecha) en el equilibrio.', color: 'bg-[#FEE2E2] border-red-100/20 text-[#991B1B]', badge: 'text-[#DC2626]' },
    ],
    explanation: 'Kc >> 1 indica que la reacción está desplazada hacia los productos (derecha).',
    successMessage: '¡Correcto! Un Kc grande indica que el equilibrio favorece fuertemente a los productos.',
  },
  {
    id: 4,
    tags: { type: 'INTERACTIVO', topic: 'Equilibrio Químico', exercise: 'Ejercicio 4.5' },
    question: 'Si el cociente de reacción Q es menor que K (Q < K), ¿hacia dónde se desplazará la reacción para alcanzar el equilibrio?',
    equation: 'Q < K  →  ¿dirección neta?',
    keywords: ['derecha', 'productos', 'adelante', 'directa', 'hacia productos', 'avanzar', 'formar productos', 'favorece productos'],
    hints: [
      { id: 1, title: 'PISTA 1', text: 'Q compara las concentraciones actuales con las del equilibrio. Q = [NH₃]²/([N₂][H₂]³) en cualquier momento.', color: 'bg-[#EAFBF3] border-green-100/20 text-[#065F46]', badge: 'text-[#059669]' },
      { id: 2, title: 'PISTA 2', text: 'Si Q < K, significa que hay menos productos (o más reactivos) que en el equilibrio. El sistema necesita producir más productos.', color: 'bg-[#FEF3C7] border-amber-100/20 text-[#92400E]', badge: 'text-[#D97706]' },
      { id: 3, title: 'PISTA 3', text: 'Cuando Q < K, la reacción neta avanza hacia la DERECHA (productos) hasta que Q = K.', color: 'bg-[#FEE2E2] border-red-100/20 text-[#991B1B]', badge: 'text-[#DC2626]' },
    ],
    explanation: 'Si Q < K, la reacción se desplaza hacia los productos (derecha) hasta alcanzar el equilibrio.',
    successMessage: '¡Correcto! Cuando Q < K, la reacción avanza hacia los productos (derecha).',
  },
  {
    id: 5,
    tags: { type: 'INTERACTIVO', topic: 'Equilibrio Químico', exercise: 'Ejercicio 4.6' },
    question: '¿Qué efecto tiene agregar un gas inerte (como argón) a volumen constante en un sistema en equilibrio?',
    equation: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + Ar(g) (inerte)',
    keywords: ['no cambia', 'no afecta', 'permanece igual', 'sin cambio', 'no se desplaza', 'no altera', 'ningún efecto', 'ninguno'],
    hints: [
      { id: 1, title: 'PISTA 1', text: 'Un gas inerte no participa en la reacción. Solo aumenta la presión total del sistema.', color: 'bg-[#EAFBF3] border-green-100/20 text-[#065F46]', badge: 'text-[#059669]' },
      { id: 2, title: 'PISTA 2', text: 'El principio de Le Châtelier responde a cambios en concentración, presión o temperatura. El gas inerte no altera las concentraciones ni las presiones parciales de los reactivos/productos.', color: 'bg-[#FEF3C7] border-amber-100/20 text-[#92400E]', badge: 'text-[#D97706]' },
      { id: 3, title: 'PISTA 3', text: 'A volumen constante, agregar un gas inerte aumenta la presión total pero NO cambia las presiones parciales de los gases reactivos. Por lo tanto, el equilibrio NO se desplaza.', color: 'bg-[#FEE2E2] border-red-100/20 text-[#991B1B]', badge: 'text-[#DC2626]' },
    ],
    explanation: 'Agregar un gas inerte a volumen constante no afecta el equilibrio porque las presiones parciales no cambian.',
    successMessage: '¡Correcto! El gas inerte no afecta el equilibrio a volumen constante.',
  },
  {
    id: 6,
    tags: { type: 'INTERACTIVO', topic: 'Equilibrio Químico', exercise: 'Ejercicio 4.7' },
    question: '¿Qué efecto tiene un catalizador sobre la posición de equilibrio en una reacción química?',
    equation: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)  (con catalizador)',
    keywords: ['no cambia', 'no afecta', 'no desplaza', 'sin cambio', 'no altera', 'velocidad', 'no altera posición', 'no modifica posición', 'no modifica'],
    hints: [
      { id: 1, title: 'PISTA 1', text: 'Un catalizador acelera tanto la reacción directa como la inversa por igual.', color: 'bg-[#EAFBF3] border-green-100/20 text-[#065F46]', badge: 'text-[#059669]' },
      { id: 2, title: 'PISTA 2', text: 'El catalizador disminuye la energía de activación para ambas direcciones, pero no altera las concentraciones en el equilibrio.', color: 'bg-[#FEF3C7] border-amber-100/20 text-[#92400E]', badge: 'text-[#D97706]' },
      { id: 3, title: 'PISTA 3', text: 'Un catalizador solo acelera la velocidad a la que se alcanza el equilibrio, pero NO cambia la posición del equilibrio ni el valor de Kc.', color: 'bg-[#FEE2E2] border-red-100/20 text-[#991B1B]', badge: 'text-[#DC2626]' },
    ],
    explanation: 'Un catalizador acelera la reacción pero no afecta la posición del equilibrio ni Kc.',
    successMessage: '¡Correcto! El catalizador acelera el proceso pero no altera la posición del equilibrio.',
  },
];

const checkAnswer = (text, keywords) => {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
};

const MolecularPage = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showProgressAlert, setShowProgressAlert] = useState(true);
  const [answerDraft, setAnswerDraft] = useState('');
  const [isAnswerSent, setIsAnswerSent] = useState(false);
  const [showAnotherPerspective, setShowAnotherPerspective] = useState(false);
  const [hintsUnlocked, setHintsUnlocked] = useState(0);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const addXp = useAchievementStore((s) => s.addXp);

  const question = questions[currentQIndex];
  const isLastQuestion = currentQIndex === questions.length - 1;
  const maxAttemptsReached = attempts >= MAX_ATTEMPTS;

  const resetQuestionState = useCallback(() => {
    setAnswerDraft('');
    setIsAnswerSent(false);
    setIsCorrect(null);
    setHintsUnlocked(0);
    setShowMotivation(false);
    setCurrentMotivation('');
    setAttempts(0);
    setShowAnotherPerspective(false);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (!isLastQuestion) {
      setCurrentQIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      setShowCompletion(true);
    }
  }, [isLastQuestion, resetQuestionState]);

  const handleFinishPractice = useCallback(() => {
    setShowCompletion(false);
    setCurrentQIndex(0);
    resetQuestionState();
    setShowProgressAlert(true);
    setCorrectCount(0);
  }, [resetQuestionState]);

  const handleSubmitAnswer = useCallback(() => {
    if (!answerDraft.trim()) return;
    const correct = checkAnswer(answerDraft, question.keywords);
    setIsCorrect(correct);
    setIsAnswerSent(true);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setCurrentMotivation(question.successMessage);
      setShowMotivation(true);
    } else {
      addXp(XP_PER_ACTIVITY.exercise, 'exercise');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setCurrentMotivation('Has agotado los intentos para esta pregunta. Revisa las pistas y continúa con la siguiente.');
      } else {
        const msg = motivationalMessages[Math.min(newAttempts - 1, motivationalMessages.length - 1)];
        setCurrentMotivation(msg);
      }
      setShowMotivation(true);
    }
  }, [answerDraft, attempts, addXp, question]);

  const handleRequestHelp = useCallback(() => {
    const next = hintsUnlocked + 1;
    setHintsUnlocked(Math.min(next, question.hints.length));
    const msg = motivationalMessages[Math.min(next - 1, motivationalMessages.length - 1)];
    setCurrentMotivation(msg);
    setShowMotivation(true);
    setIsAnswerSent(false);
  }, [hintsUnlocked, question.hints.length]);

  const handleUnlockHint = useCallback((hintId) => {
    if (hintId > hintsUnlocked) {
      setHintsUnlocked(hintId);
      const msg = motivationalMessages[Math.min(hintId - 1, motivationalMessages.length - 1)];
      setCurrentMotivation(msg);
      setShowMotivation(true);
    }
  }, [hintsUnlocked]);

  const handleRetry = useCallback(() => {
    setIsAnswerSent(false);
    setIsCorrect(null);
    setAnswerDraft('');
    setShowMotivation(false);
  }, []);

  const unitProgress = 68;
  const score = 450;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Unit Progress Top bar */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-grow w-full max-w-xl space-y-2">
          <div className="flex justify-between items-center text-xs font-black text-[#0D2140] tracking-tight">
            <span>PROGRESO DE LA UNIDAD</span>
            <span className="text-[#004B76]">{unitProgress}% COMPLETADO</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${unitProgress}%` }}
              className="h-full bg-teal-500 rounded-full" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="bg-[#E8F1FF] text-[#0066FF] border border-transparent font-black px-4 py-2 rounded-2xl text-xs tracking-wider flex items-center gap-2 shadow-sm">
            <span>⚡</span>
            <span>+{score} XP ACUMULADO HOY</span>
          </div>
        </div>
      </div>

      {showCompletion ? (
        /* Completion Screen */
        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 sm:p-16 shadow-sm text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center">
            <Trophy size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-[#0D2140]">¡Práctica Completada!</h2>
          <p className="text-gray-500 font-semibold text-sm leading-relaxed max-w-md mx-auto">
            Has respondido correctamente <span className="text-[#004B76] font-black">{correctCount}</span> de{' '}
            <span className="text-[#004B76] font-black">{questions.length}</span> ejercicios.{' '}
            ¡Sigue practicando para dominar los conceptos de equilibrio químico!
          </p>
          <button
            onClick={handleFinishPractice}
            className="bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-8 py-4 rounded-xl transition-all shadow-md active:scale-95 text-sm"
          >
            Comenzar de nuevo
          </button>
        </div>
      ) : (
        /* Main Practice Layout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Progress Alert */}
            <AnimatePresence>
              {showProgressAlert && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#EAFBF3] border border-green-100/50 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm text-[#065F46]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                        <Trophy size={18} fill="currentColor" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black tracking-tight leading-tight">
                          ¡Ya completaste el 60%!
                        </h4>
                        <p className="text-xs font-semibold text-[#0f766e] mt-0.5">
                          Vas por excelente camino. Solo te faltan 2 ejercicios para el hito diario.
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setShowProgressAlert(false)}
                      className="p-1 rounded-full hover:bg-black/5 text-[#065F46] shrink-0 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interactive Question Card */}
            <Card 
              animate={true} 
              className="bg-white border border-gray-100 rounded-[3rem] p-6 sm:p-10 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute right-0 bottom-0 w-32 h-32 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-primary">
                  <path d="M50 15 C50 15 80 50 80 70 C80 85 65 90 50 90 C35 90 20 85 20 70 C20 50 50 15 50 15 Z" fill="currentColor" />
                </svg>
              </div>

              <div className="space-y-8 relative z-10">
                {/* Question tags */}
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <span className="bg-[#EAFBF3] text-[#059669] px-3 py-1 rounded-full border border-transparent">
                    {question.tags.type}
                  </span>
                  <span>•</span>
                  <span>{question.tags.topic}</span>
                  <span>•</span>
                  <span>{question.tags.exercise}</span>
                </div>

                {/* Main Question */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#0D2140] tracking-tight leading-snug">
                  {question.question}
                </h3>

                {/* Chemical Equation Box */}
                <div className="bg-[#F8FAFC] border border-gray-50 rounded-2xl p-6 text-center shadow-inner">
                  <p className="text-[#004B76] font-black text-xl sm:text-2xl tracking-wide select-all">
                    {question.equation}
                  </p>
                </div>

                {/* Feedback / Result Box */}
                <AnimatePresence>
                  {isAnswerSent && isCorrect && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <ThumbsUp size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-green-800">¡Respuesta correcta!</p>
                        <p className="text-xs text-green-600 font-semibold mt-0.5">
                          {question.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show textarea when answer not submitted OR when incorrect */}
                {(!isAnswerSent || (isAnswerSent && !isCorrect && !maxAttemptsReached)) && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Tu justificación científica
                    </label>
                    <textarea 
                      value={answerDraft}
                      onChange={(e) => setAnswerDraft(e.target.value)}
                      placeholder="Explica tu razonamiento basándote en el principio de Le Châtelier..."
                      className="w-full h-40 bg-gray-50/70 border border-gray-100 rounded-2xl p-5 text-sm font-semibold text-[#0D2140] outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                    />
                  </div>
                )}

                {/* Submit Action Buttons — only when can submit */}
                {!isAnswerSent && !maxAttemptsReached && (
                  <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap w-full">
                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                      <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-black">
                        <CheckCircle2 size={16} />
                        <span>Modo Sandbox — sin penalización</span>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
                      <button 
                        onClick={() => alert('Borrador guardado')}
                        className="flex-1 md:flex-none bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-6 py-3.5 rounded-xl transition-all active:scale-95 text-xs shrink-0"
                      >
                        Guardar Borrador
                      </button>
                      <button 
                        onClick={handleSubmitAnswer}
                        className="flex-1 md:flex-none bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-xs shrink-0"
                      >
                        Enviar Respuesta
                      </button>
                    </div>
                  </div>
                )}

                {/* Retry + Next after incorrect */}
                {isAnswerSent && !isCorrect && (
                  <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
                      <HelpCircle size={16} />
                      <span>
                        {maxAttemptsReached
                          ? 'Has agotado los intentos para esta pregunta.'
                          : 'Respuesta incorrecta. Puedes solicitar ayuda o intentar de nuevo.'}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      {!maxAttemptsReached && (
                        <button
                          onClick={handleRequestHelp}
                          className="flex items-center gap-2 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-700 font-black px-5 py-3 rounded-xl transition-all active:scale-95 text-xs"
                        >
                          <MessageCircle size={16} />
                          Solicitar ayuda
                        </button>
                      )}
                      {!maxAttemptsReached && (
                        <button
                          onClick={handleRetry}
                          className="bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs"
                        >
                          Intentar de nuevo
                        </button>
                      )}
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-2 bg-white border border-[#004B76] text-[#004B76] font-black px-5 py-3 rounded-xl transition-all active:scale-95 text-xs hover:bg-[#F0F7FF]"
                      >
                        {isLastQuestion ? 'Finalizar práctica' : 'Siguiente pregunta'}
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Next question after correct */}
                {isAnswerSent && isCorrect && (
                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-sm"
                    >
                      {isLastQuestion ? 'Finalizar práctica' : 'Siguiente pregunta'}
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}

              </div>
            </Card>

            {/* Motivational Message */}
            <AnimatePresence>
              {showMotivation && currentMotivation && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`rounded-2xl p-5 flex items-center gap-4 shadow-sm border ${
                    isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {isCorrect ? <ThumbsUp size={20} /> : <Lightbulb size={20} />}
                  </div>
                  <p className={`text-sm font-bold leading-relaxed ${
                    isCorrect ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    {currentMotivation}
                  </p>
                  <button
                    onClick={() => setShowMotivation(false)}
                    className="ml-auto p-1 rounded-full hover:bg-black/5 shrink-0 transition-colors"
                  >
                    <X size={16} className={isCorrect ? 'text-green-600' : 'text-blue-600'} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-[2.5rem] p-8 space-y-6 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-[#004B76] shadow-sm shrink-0">
                    <Info size={20} className="stroke-[2.5]" />
                  </div>
                  <h4 className="text-lg font-black text-[#0D2140] tracking-tight">
                    Recordatorio Rápido
                  </h4>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    El Principio de Le Châtelier establece que si se aplica un cambio en un sistema en equilibrio, el sistema se desplazará para contrarrestar dicho cambio.
                  </p>
                </div>

                <a href="#" className="text-xs font-black text-[#004B76] hover:underline flex items-center gap-1.5 mt-2">
                  Ver glosario completo <ChevronRight size={14} className="stroke-[2.5]" />
                </a>
              </div>

              <div className="bg-[#FDF8FF] border border-[#F3E8FF] rounded-[2.5rem] p-8 space-y-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-28 h-28 opacity-10 pointer-events-none translate-x-4 translate-y-4 text-[#8B5CF6]">
                  <Award className="w-full h-full" />
                </div>

                <div className="space-y-4 relative z-10">
                  <h4 className="text-lg font-black text-[#0D2140] tracking-tight">
                    Logro Sandbox
                  </h4>
                  <p className="text-xs text-purple-600 font-bold leading-relaxed">
                    Has completado <span className="font-extrabold">5 ejercicios sin errores</span> esta semana. ¡Sigue así!
                  </p>
                </div>

                <div className="flex gap-1.5 pt-4 relative z-10">
                  <Star size={18} fill="#A855F7" className="text-[#A855F7]" />
                  <Star size={18} fill="#A855F7" className="text-[#A855F7]" />
                  <Star size={18} fill="#A855F7" className="text-[#A855F7]" />
                  <Star size={18} className="text-purple-200 fill-purple-100/50" />
                  <Star size={18} className="text-purple-200 fill-purple-100/50" />
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 1. Sesión Actual Card */}
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-[#0D2140] tracking-tight">
                  Sesión Actual
                </h4>
                <span className="bg-[#E8F1FF] text-[#0066FF] text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-transparent">
                  SANDBOX
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-50 rounded-2xl p-4 space-y-1 text-center shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    EJERCICIOS
                  </p>
                  <p className="text-2xl font-black text-[#0D2140]">
                    {currentQIndex + 1} <span className="text-xs font-semibold text-gray-400">/ {questions.length}</span>
                  </p>
                </div>

                <div className="bg-white border border-gray-50 rounded-2xl p-4 space-y-1 text-center shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    TIEMPO
                  </p>
                  <p className="text-2xl font-black text-[#0D2140]">
                    12:45
                  </p>
                </div>
              </div>

              {/* XP intact — Sandbox mode */}
              <div className="border-t border-gray-100/80 pt-6 space-y-3">
                <p className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.25em]">
                  🏁 MODO SANDBOX
                </p>
                <div className="flex justify-between items-center text-xs font-black text-[#0D2140] tracking-tight">
                  <span>Puntaje no afectado</span>
                  <span className="text-emerald-600">+{score} XP</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-[#004B76] rounded-full" />
                </div>
                <p className="text-[9px] text-gray-400 font-semibold text-center">
                  Las ayudas no afectan tu calificación en Sandbox
                </p>
              </div>
            </div>

            {/* 2. Progressive Hints Widget */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-[#0D2140] tracking-tight">
                  Sistema de Ayuda
                </h4>
                <span className="text-[9px] font-black text-gray-400">
                  {hintsUnlocked}/{question.hints.length} pistas
                </span>
              </div>

              {/* Hints list — click to unlock */}
              <div className="space-y-3">
                {question.hints.map((hint, idx) => {
                  const isUnlocked = idx < hintsUnlocked;
                  return (
                    <motion.div
                      key={hint.id}
                      initial={isUnlocked ? { opacity: 0, x: -20 } : false}
                      animate={isUnlocked ? { opacity: 1, x: 0 } : {}}
                      onClick={() => handleUnlockHint(hint.id)}
                      className={`rounded-2xl p-4 border cursor-pointer transition-all active:scale-[0.98] ${
                        isUnlocked
                          ? hint.color
                          : 'bg-gray-50 border-gray-100 hover:bg-amber-50 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h5 className={`font-black uppercase tracking-widest text-[9px] ${
                          isUnlocked ? hint.badge : 'text-gray-400'
                        }`}>
                          {isUnlocked ? hint.title : `PISTA ${hint.id} (clic para desbloquear)`}
                        </h5>
                        {isUnlocked ? (
                          <Lightbulb size={14} className="text-amber-400 fill-amber-400" />
                        ) : (
                          <span className="text-[10px] text-gray-400">🔒</span>
                        )}
                      </div>
                      {isUnlocked && (
                        <p className="font-semibold leading-relaxed text-xs">
                          {hint.text}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Help button — optional unlock method */}
              {hintsUnlocked < question.hints.length && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleUnlockHint(hintsUnlocked + 1)}
                  className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 text-amber-700">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Lightbulb size={16} className="stroke-[2.5] fill-amber-100" />
                    </div>
                    <span className="text-xs font-black">Desbloquear siguiente pista</span>
                  </div>
                  <ChevronRight size={16} className="text-amber-400 stroke-[2.5]" />
                </motion.button>
              )}

              {/* All hints shown */}
              {hintsUnlocked >= question.hints.length && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <p className="text-xs font-black text-green-700">
                    Todas las pistas desbloqueadas. ¡Intenta responder!
                  </p>
                </div>
              )}

              {/* Explícamelo diferente */}
              <button 
                onClick={() => setShowAnotherPerspective(!showAnotherPerspective)}
                className="w-full py-4 border-2 border-dashed border-[#F3E8FF] hover:border-purple-300 text-purple-600 font-black text-xs rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-white"
              >
                <span>✨</span>
                <span>Explícamelo diferente</span>
              </button>

              <AnimatePresence>
                {showAnotherPerspective && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden pt-2"
                  >
                    <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-5 space-y-4 text-left text-xs text-purple-950 font-bold leading-relaxed relative overflow-hidden shadow-sm">
                      <div className="flex items-center gap-2 text-purple-700">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-purple-600">
                          <Sparkles size={16} className="fill-purple-100" />
                        </div>
                        <span className="font-black text-sm">Otra perspectiva</span>
                      </div>

                      <p className="text-purple-900/80 font-medium leading-relaxed">
                        Imagina una balanza donde el sistema intenta ocupar el menor espacio posible ante un aumento de presión. Como si estuvieras en un autobús lleno: si entra más gente (más presión), todos buscan comprimirse para caber.
                      </p>

                      <div className="space-y-2">
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-purple-800/40 via-indigo-900/30 to-slate-900/60 shadow-inner flex items-center justify-center group">
                          <div className="w-10 h-10 rounded-full bg-white/35 border border-white/55 backdrop-blur-sm flex items-center justify-center text-white transition-all group-hover:scale-110">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5 text-white">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide">
                            0:45
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-purple-500 font-extrabold flex items-center gap-1">
                          👁 Mini-explicación visual (45s)
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Progreso guardado */}
            <div className="bg-[#EAFBF3] border border-green-100/30 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Trophy size={16} fill="currentColor" />
              </div>
              <div>
                <h5 className="text-xs font-black text-[#0D2140]">¡Progreso guardado!</h5>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Tu sesión de Sandbox está segura.</p>
              </div>
            </div>

            {/* Navigation History */}
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div>
                <p className="text-[10px] font-black text-blue-700 tracking-[0.2em] uppercase mb-1">
                  ¡SIGUE ASÍ!
                </p>
                <h5 className="text-sm font-black text-[#0D2140] tracking-tight">
                  Estás a 250 XP de subir al Nivel 15.
                </h5>
              </div>

              <div className="space-y-4">
                <div className="bg-white border border-gray-50 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h6 className="text-xs font-black text-[#0D2140]">
                        Cálculo de pH
                      </h6>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        AYER • +150 XP
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0 text-yellow-400">
                    <Star size={10} fill="currentColor" />
                    <Star size={10} fill="currentColor" />
                    <Star size={10} fill="currentColor" />
                  </div>
                </div>

                <div className="bg-white border border-gray-50 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
                      <Bookmark size={18} />
                    </div>
                    <div>
                      <h6 className="text-xs font-black text-[#0D2140]">
                        Leyes de los Gases
                      </h6>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        12 MAY • +200 XP
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0 text-yellow-400">
                    <Star size={10} fill="currentColor" />
                    <Star size={10} fill="currentColor" />
                    <Star size={10} className="text-gray-200" />
                  </div>
                </div>
              </div>

              <button className="w-full py-4 border border-gray-200 hover:bg-gray-50 text-gray-500 font-black text-xs rounded-2xl transition-all active:scale-[0.98] bg-white">
                VER TODO EL HISTORIAL
              </button>
            </div>

            {/* Applied Science Decorative Banner */}
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] flex flex-col justify-end p-8 text-white shadow-sm border border-gray-100/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#0A3D5C] to-[#062235]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
              
              <div className="relative z-10 space-y-1">
                <span className="text-[8px] font-black text-[#78F0C4] tracking-[0.25em] uppercase">
                  CIENCIA APLICADA
                </span>
                <h5 className="text-xl font-black tracking-tight leading-tight">
                  Entorno de Cristal 2.0
                </h5>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default MolecularPage;
