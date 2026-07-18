import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const ELEMENTS = [
  { atomic: 1, sym: 'H', name: 'Hidrógeno', mass: 1.008, category: 'gas', color: 'bg-blue-100 text-blue-700' },
  { atomic: 6, sym: 'C', name: 'Carbono', mass: 12.011, category: 'gas', color: 'bg-gray-200 text-gray-700' },
  { atomic: 7, sym: 'N', name: 'Nitrógeno', mass: 14.007, category: 'gas', color: 'bg-blue-200 text-blue-700' },
  { atomic: 8, sym: 'O', name: 'Oxígeno', mass: 15.999, category: 'gas', color: 'bg-red-200 text-red-700' },
  { atomic: 11, sym: 'Na', name: 'Sodio', mass: 22.990, category: 'metal', color: 'bg-purple-200 text-purple-700' },
  { atomic: 17, sym: 'Cl', name: 'Cloro', mass: 35.45, category: 'gas', color: 'bg-green-200 text-green-700' },
  { atomic: 26, sym: 'Fe', name: 'Hierro', mass: 55.845, category: 'metal', color: 'bg-orange-200 text-orange-700' },
  { atomic: 29, sym: 'Cu', name: 'Cobre', mass: 63.546, category: 'metal', color: 'bg-amber-200 text-amber-700' },
  { atomic: 47, sym: 'Ag', name: 'Plata', mass: 107.868, category: 'metal', color: 'bg-gray-100 text-gray-600' },
  { atomic: 79, sym: 'Au', name: 'Oro', mass: 196.967, category: 'metal', color: 'bg-yellow-200 text-yellow-700' },
];

const PeriodicTableMode = ({ simulator }) => {
  const [selected, setSelected] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const randomEl = () => ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];

  const handleQuiz = (guess) => {
    if (!quizAnswer) return;
    if (guess.sym === quizAnswer.sym) setScore(s => s + 1);
    setQuizAnswer(null);
    setTimeout(() => setQuizAnswer(randomEl()), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-primary-dark">Tabla Periódica Interactiva</h2>
        <button onClick={() => { setQuizMode(!quizMode); if (!quizMode) { const r = randomEl(); setQuizAnswer(r); } }}
          className="px-4 py-2 bg-primary-dark text-white rounded-xl text-xs font-bold">
          {quizMode ? 'Explorar' : 'Modo Quiz'}
        </button>
      </div>

      {quizMode && quizAnswer && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
          <p className="text-xs font-bold text-amber-600 mb-2">Puntuación: {score}</p>
          <p className="text-sm font-black text-amber-800 mb-4">¿Qué elemento tiene masa atómica ≈ {quizAnswer.mass}?</p>
          <div className="flex justify-center gap-3">
            {[0, 1, 2].map(i => {
              const opt = i === 0 ? quizAnswer : ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
              return (
                <button key={i} onClick={() => handleQuiz(opt)}
                  className="px-6 py-3 bg-white rounded-2xl border border-gray-200 hover:border-primary font-bold text-sm transition-all">
                  {opt.sym} ({opt.name})
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-2">
        {ELEMENTS.map(el => (
          <button key={el.atomic} onClick={() => { setSelected(el); setQuizMode(false); }}
            className={cn("p-3 rounded-2xl text-center transition-all hover:scale-105", el.color,
              selected?.atomic === el.atomic && 'ring-2 ring-primary scale-105')}>
            <span className="text-[8px] font-bold opacity-60 block">{el.atomic}</span>
            <span className="text-lg font-black block">{el.sym}</span>
            <span className="text-[7px] font-semibold opacity-70 block">{el.mass}</span>
          </button>
        ))}
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10">
          <div className="flex items-center gap-4">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black", selected.color)}>
              {selected.sym}
            </div>
            <div>
              <p className="text-lg font-black text-primary-dark">{selected.name}</p>
              <p className="text-xs font-bold text-text-secondary">Símbolo: {selected.sym} · N° Atómico: {selected.atomic} · Masa: {selected.mass} u</p>
              <p className="text-[10px] font-semibold text-text-secondary mt-1">Categoría: {selected.category === 'gas' ? 'No metal / Gas' : selected.category === 'metal' ? 'Metal' : selected.category}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PeriodicTableMode;
