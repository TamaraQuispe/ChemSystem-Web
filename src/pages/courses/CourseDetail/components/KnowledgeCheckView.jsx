import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit, CheckCircle2, AlertTriangle,
  RefreshCw, ArrowRight
} from 'lucide-react';
import { cn } from '../../../../utils/cn';

const KnowledgeCheckQuestions = ({ questions, answers, onAnswer }) => (
  <div className="bg-white rounded-3xl border border-outline-variant/10 p-8 shadow-sm">
    <div className="space-y-6">
      {questions?.map((q, qi) => (
        <div key={q.id} className="pb-6 border-b border-outline-variant/10 last:border-0 last:pb-0">
          <p className="text-sm font-bold text-[#1a1c1d] mb-3">{qi + 1}. {q.text}</p>
          <div className="space-y-2">
            {q.options.map(opt => (
              <button
                key={opt.id}
                onClick={() => onAnswer(q.id, opt.id)}
                className={cn(
                  'w-full text-left p-3 rounded-xl border-2 transition-all text-sm font-medium',
                  answers[q.id] === opt.id
                    ? 'border-[#6c228c] bg-[#6c228c]/5 text-[#6c228c]'
                    : 'border-outline-variant/30 hover:border-[#6c228c]/30 text-[#40484f]'
                )}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const KnowledgeCheckResult = ({ result, questions, onRetry, onContinue }) => (
  <div className="space-y-6">
    <div className={cn(
      'p-6 rounded-2xl text-center border-2',
      result.passed ? 'bg-[#86f8c8]/20 border-[#86f8c8]' : 'bg-[#ffdad6]/30 border-[#ffdad6]'
    )}>
      <BrainCircuit size={36} className={cn('mx-auto mb-3', result.passed ? 'text-[#006c4d]' : 'text-[#ba1a1a]')} />
      <h3 className="text-xl font-headline font-bold mb-1">
        {result.passed ? '¡Bien hecho!' : 'Sigue practicando'}
      </h3>
      <p className="text-sm font-bold text-[#40484f]">
        {result.correctCount}/{result.totalQuestions} correctas · {result.percentage}%
      </p>
    </div>

    {questions?.map((q, qi) => {
      const ga = result.gradedAnswers?.[qi];
      return (
        <div key={q.id} className={cn(
          'p-4 rounded-xl border',
          ga?.isCorrect ? 'border-[#86f8c8]/50 bg-[#86f8c8]/5' : 'border-[#ffdad6]/50 bg-[#ffdad6]/10'
        )}>
          <div className="flex items-start gap-2">
            {ga?.isCorrect
              ? <CheckCircle2 size={16} className="text-[#006c4d] shrink-0 mt-0.5" />
              : <AlertTriangle size={16} className="text-[#ba1a1a] shrink-0 mt-0.5" />
            }
            <div>
              <p className="text-sm font-bold text-[#1a1c1d] mb-1">{q.text}</p>
              <p className="text-xs text-[#40484f]">{ga?.explanation || q.explanation}</p>
            </div>
          </div>
        </div>
      );
    })}

    <div className="flex gap-3 justify-center pt-2">
      {!result.passed && (
        <button onClick={onRetry}
          className="px-6 py-3 rounded-2xl bg-[#e8e8e9] text-[#40484f] font-bold text-sm flex items-center gap-2 hover:bg-[#e2e2e3] transition-all">
          <RefreshCw size={16} /> Reintentar
        </button>
      )}
      <button onClick={onContinue}
        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#004b71] to-[#006494] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
        Continuar <ArrowRight size={16} />
      </button>
    </div>
  </div>
);

export const KnowledgeCheckView = ({ assessment, result, onSubmit, onContinue, onRetry }) => {
  const [answers, setAnswers] = useState({});

  if (!assessment) return null;

  const allAnswered = assessment?.questions?.every(q => answers[q.id]) || false;

  const handleAnswer = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <BrainCircuit size={24} className="text-[#6c228c]" />
          <div>
            <h2 className="text-lg font-headline font-bold text-[#1a1c1d]">Verificación de Conocimiento</h2>
            <p className="text-xs text-[#40484f]/70">Responde estas preguntas antes de continuar</p>
          </div>
        </div>

        {!result ? (
          <>
            <KnowledgeCheckQuestions
              questions={assessment.questions}
              answers={answers}
              onAnswer={handleAnswer}
            />
            <button
              onClick={() => onSubmit(answers)}
              disabled={!allAnswered}
              className={cn(
                'w-full h-12 rounded-2xl font-bold text-sm transition-all',
                allAnswered
                  ? 'bg-gradient-to-r from-[#6c228c] to-[#8b3fad] text-white shadow-md hover:shadow-lg'
                  : 'bg-[#e2e2e3] text-[#40484f]/50 cursor-not-allowed'
              )}
            >
              Verificar respuestas
            </button>
          </>
        ) : (
          <KnowledgeCheckResult
            result={result}
            questions={assessment.questions}
            onRetry={onRetry}
            onContinue={onContinue}
          />
        )}
      </motion.div>
    </div>
  );
};
