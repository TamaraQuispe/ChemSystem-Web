import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Layers, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const ELEMENTS = [
  { z: 1, sym: 'H', name: 'Hidrógeno', mass: 1.008, group: 1, period: 1, type: 'gas', color: 'bg-blue-100' },
  { z: 6, sym: 'C', name: 'Carbono', mass: 12.011, group: 14, period: 2, type: 'gas', color: 'bg-gray-200' },
  { z: 7, sym: 'N', name: 'Nitrógeno', mass: 14.007, group: 15, period: 2, type: 'gas', color: 'bg-blue-200' },
  { z: 8, sym: 'O', name: 'Oxígeno', mass: 15.999, group: 16, period: 2, type: 'gas', color: 'bg-red-200' },
  { z: 11, sym: 'Na', name: 'Sodio', mass: 22.990, group: 1, period: 3, type: 'metal', color: 'bg-purple-200' },
  { z: 12, sym: 'Mg', name: 'Magnesio', mass: 24.305, group: 2, period: 3, type: 'metal', color: 'bg-emerald-200' },
  { z: 13, sym: 'Al', name: 'Aluminio', mass: 26.982, group: 13, period: 3, type: 'metal', color: 'bg-sky-200' },
  { z: 17, sym: 'Cl', name: 'Cloro', mass: 35.45, group: 17, period: 3, type: 'gas', color: 'bg-green-200' },
  { z: 26, sym: 'Fe', name: 'Hierro', mass: 55.845, group: 8, period: 4, type: 'metal', color: 'bg-orange-200' },
  { z: 29, sym: 'Cu', name: 'Cobre', mass: 63.546, group: 11, period: 4, type: 'metal', color: 'bg-amber-200' },
  { z: 47, sym: 'Ag', name: 'Plata', mass: 107.868, group: 11, period: 5, type: 'metal', color: 'bg-gray-100' },
  { z: 79, sym: 'Au', name: 'Oro', mass: 196.967, group: 11, period: 6, type: 'metal', color: 'bg-yellow-200' },
];

const PeriodicTableAI = ({ el }) => (
  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 space-y-2">
    <div className="flex items-center gap-2"><Lightbulb size={16} className="text-blue-500" /><span className="text-xs font-black text-blue-700">Tabla Periódica IA</span></div>
    {el && (<><p className="text-[10px] font-semibold text-blue-600/80">{el.name} ({el.sym}) · Z={el.z} · M={el.mass}</p><p className="text-[10px] font-semibold text-blue-600/80">Grupo {el.group} · Período {el.period} · {el.type === 'metal' ? 'Metal' : 'No metal'}</p></>)}
  </div>
);

const PeriodicTablePage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizTarget, setQuizTarget] = useState(null);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    const targets = [...ELEMENTS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuizTarget(targets);
    setQuizMode(true);
    setSelected(null);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Layers size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Tabla Periódica Interactiva</h1>
            <p className="text-text-secondary font-semibold mb-2">Explora elementos químicos. Modo quiz para poner a prueba tus conocimientos.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}
        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold">Score: {score}</span>
                <button onClick={() => { if (!quizMode) startQuiz(); else { setQuizMode(false); setQuizTarget(null); } }}
                  className="px-4 py-1.5 bg-primary text-white rounded-xl text-[9px] font-bold">{quizMode ? 'Explorar' : 'Modo Quiz'}</button>
              </div>
            </div>

            {quizMode && quizTarget ? (
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Identifica el elemento</h2>
                {quizTarget.map((target, i) => (
                  <div key={i} className="mb-4">
                    <p className="text-xs font-bold mb-2">Masa atómica ≈ {target.mass} · Grupo {target.group} · {target.type}</p>
                    <div className="flex gap-2">
                      {ELEMENTS.sort(() => Math.random() - 0.5).slice(0, 4).map(opt => (
                        <button key={opt.sym} onClick={() => {
                          if (opt.z === target.z) setScore(s => s + 1);
                        }} className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold hover:border-primary transition-all">{opt.sym}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            ) : (
              <Card className="p-6">
                <div className="grid grid-cols-6 gap-2">
                  {ELEMENTS.map(el => (
                    <button key={el.sym} onClick={() => setSelected(el)}
                      className={cn("p-2 rounded-xl text-center border-2 transition-all hover:scale-105", el.color,
                        selected?.z === el.z ? 'border-primary shadow-lg scale-110' : 'border-transparent')}>
                      <span className="text-[8px] font-bold opacity-60 block">{el.z}</span>
                      <span className="text-sm font-black block">{el.sym}</span>
                      <span className="text-[6px] font-semibold opacity-70 block">{el.mass}</span>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {selected && !quizMode && <PeriodicTableAI el={selected} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PeriodicTablePage;
