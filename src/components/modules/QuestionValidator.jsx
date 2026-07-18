import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const QuestionValidator = ({ question, onComplete }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  if (!question) return null;

  const correctAnswer = question.options?.[question.correctIndex];
  const isCorrect = selected === correctAnswer;

  const handleSelect = (opt) => {
    if (answered) return;
    setSelected(opt);
  };

  const handleConfirm = () => {
    if (!selected || answered) return;
    setAnswered(true);
    if (onComplete) onComplete(isCorrect);
  };

  const handleNext = () => {
    setSelected(null);
    setAnswered(false);
    if (onComplete) onComplete(isCorrect, true);
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">?</span>
        <span className="text-xs font-bold text-text-secondary">Verifica tu comprensión</span>
        {answered && (
          <span className={cn("ml-auto text-[10px] font-bold px-2 py-0.5 rounded-lg", isCorrect ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500')}>
            {isCorrect ? '+10 XP' : 'Intenta de nuevo'}
          </span>
        )}
      </div>

      <p className="text-sm font-bold text-primary-dark mb-4">{question.text}</p>

      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          const isSelected = selected === opt;
          const showCorrect = answered && opt === correctAnswer;
          const showWrong = answered && isSelected && !isCorrect;
          return (
            <button key={idx} onClick={() => handleSelect(opt)}
              disabled={answered}
              className={cn(
                "w-full text-left p-4 rounded-2xl border-2 transition-all text-sm font-semibold",
                showCorrect && "border-emerald-400 bg-emerald-50 text-emerald-700",
                showWrong && "border-red-400 bg-red-50 text-red-700",
                !answered && isSelected && "border-primary bg-primary/5 text-primary-dark",
                !answered && !isSelected && "border-gray-100 hover:border-gray-200 text-text-main",
                answered && !showCorrect && !showWrong && "border-gray-100 opacity-60"
              )}>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-grow">{opt}</span>
                {showCorrect && <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />}
                {showWrong && <XCircle size={20} className="text-red-500 shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {answered && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <div className={cn("p-4 rounded-2xl text-xs font-bold", isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
            {isCorrect ? question.feedbackCorrect : question.feedbackIncorrect}
          </div>
          {!isCorrect && question.feedbackCorrect && (
            <div className="mt-2 p-3 bg-blue-50 rounded-xl text-xs font-semibold text-blue-600">
              Respuesta correcta: {correctAnswer}
            </div>
          )}
        </motion.div>
      )}

      <div className="flex gap-2 mt-4">
        {!answered && selected && (
          <button onClick={handleConfirm}
            className="px-6 py-2.5 bg-primary-dark text-white rounded-2xl font-bold text-xs hover:bg-primary transition-all">
            Confirmar
          </button>
        )}
        {answered && (
          <button onClick={handleNext}
            className="px-6 py-2.5 bg-primary-dark text-white rounded-2xl font-bold text-xs hover:bg-primary transition-all">
            Continuar
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionValidator;
