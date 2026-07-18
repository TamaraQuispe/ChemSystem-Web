import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ArrowRight, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const SALTS = [
  { id: 'nacl', name: 'Cloruro de Sodio', formula: 'NaCl', color: 'from-yellow-300 to-orange-400', desc: 'Amarillo intenso — sodio', element: 'Na' },
  { id: 'kcl', name: 'Cloruro de Potasio', formula: 'KCl', color: 'from-violet-300 to-pink-400', desc: 'Violeta característico — potasio', element: 'K' },
  { id: 'cucl2', name: 'Cloruro de Cobre (II)', formula: 'CuCl₂', color: 'from-green-300 to-emerald-500', desc: 'Verde esmeralda — cobre', element: 'Cu' },
  { id: 'srcl2', name: 'Cloruro de Estroncio', formula: 'SrCl₂', color: 'from-red-400 to-rose-600', desc: 'Rojo carmín — estroncio', element: 'Sr' },
  { id: 'bacl2', name: 'Cloruro de Bario', formula: 'BaCl₂', color: 'from-yellow-200 to-lime-300', desc: 'Amarillo verdoso — bario', element: 'Ba' },
  { id: 'cacl2', name: 'Cloruro de Calcio', formula: 'CaCl₂', color: 'from-orange-300 to-red-400', desc: 'Naranja ladrillo — calcio', element: 'Ca' },
];

const FlameTestAI = ({ selected, hint, onHint }) => {
  if (!selected) return (
    <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50/50 rounded-2xl border border-orange-100">
      <div className="flex items-center gap-2 mb-2"><Lightbulb size={16} className="text-amber-500" /><span className="text-xs font-black text-orange-700">Espectroscopista IA</span></div>
      <p className="text-[10px] font-semibold text-orange-600/80">Selecciona una sal para observar su color de llama característico. Cada metal produce un color único.</p>
    </div>
  );
  return (
    <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50/50 rounded-2xl border border-orange-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-amber-500" /><span className="text-xs font-black text-orange-700">Espectroscopista IA</span></div>
      <p className="text-[10px] font-semibold text-orange-600/80">La sal <strong>{selected.name}</strong> produce un color <strong>{selected.desc}</strong>. Esto se debe a que los electrones del {selected.element} saltan a niveles superiores y al volver emiten luz de esa longitud de onda.</p>
      <button onClick={onHint} className="px-3 py-1.5 bg-white rounded-xl border border-orange-200 text-[9px] font-bold text-orange-600 hover:bg-orange-50 text-left">
        {hint ? 'Los electrones excitados emiten fotones al volver a su estado basal. La energía del fotón determina el color.' : '¿Por qué se produce el color?'}
      </button>
    </div>
  );
};

const FlameTestPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);
  const [activeSalt, setActiveSalt] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizTarget, setQuizTarget] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    const targets = [...SALTS].sort(() => Math.random() - 0.5).slice(0, 3);
    setQuizTarget(targets);
    setQuizMode(true);
    setQuizAnswer(null);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Sparkles size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Prueba de Llama</h1>
            <p className="text-text-secondary font-semibold mb-2">Identifica metales por el color característico que emiten al calentarse en una llama.</p>
            <div className="p-4 bg-orange-50 rounded-2xl text-xs font-semibold text-orange-600 mb-8 max-w-lg mx-auto">Cada elemento químico produce un color de llama único, como una huella digital.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>
              <span className="text-xs font-bold text-primary-dark ml-auto">Puntuación: {score}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Salt selection */}
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Sales disponibles</h2>
                <div className="grid grid-cols-2 gap-3">
                  {SALTS.map(salt => (
                    <button key={salt.id} onClick={() => { setActiveSalt(salt); setShowHint(false); }}
                      className={cn("p-4 rounded-2xl border-2 text-center transition-all hover:scale-[1.02]",
                        activeSalt?.id === salt.id ? 'border-primary shadow-md' : 'border-gray-100'
                      )}>
                      <div className={cn("h-12 rounded-xl mb-2 bg-gradient-to-b", salt.color)} />
                      <p className="text-[10px] font-black text-primary-dark">{salt.name}</p>
                      <p className="text-[8px] font-semibold text-text-secondary">{salt.formula}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Flame viewer */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black text-primary-dark">Espectro de llama</h2>
                  <button onClick={() => { if (!quizMode) startQuiz(); else { setQuizMode(false); setQuizTarget(null); } }}
                    className="px-4 py-1.5 rounded-xl text-[9px] font-bold bg-primary text-white">
                    {quizMode ? 'Salir del quiz' : 'Modo Quiz'}
                  </button>
                </div>

                {quizMode ? (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-text-secondary">¿Qué sal produce este color?</p>
                    {quizTarget?.map((target, i) => (
                      <div key={i} className="space-y-2">
                        {quizAnswer === null && (
                          <div className={cn("h-16 rounded-xl bg-gradient-to-b", target.color)} />
                        )}
                        {quizAnswer === null && (
                          <div className="grid grid-cols-2 gap-2">
                            {SALTS.sort(() => Math.random() - 0.5).slice(0, 4).map(opt => (
                              <button key={opt.id} onClick={() => {
                                const correct = opt.id === target.id;
                                if (correct) setScore(s => s + 1);
                                setQuizAnswer(opt.id);
                                setTimeout(() => { setQuizAnswer(null); }, 1500);
                              }} className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-[9px] font-bold hover:border-primary transition-all">
                                {opt.name}
                              </button>
                            ))}
                          </div>
                        )}
                        {quizAnswer && (
                          <div className={cn("p-3 rounded-xl text-[9px] font-bold text-center",
                            target.id === quizAnswer ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                          )}>
                            {target.id === quizAnswer ? '✓ Correcto!' : `✗ Era ${target.name}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {activeSalt ? (
                      <div className="text-center">
                        <div className={cn("h-32 rounded-2xl mb-4 bg-gradient-to-b", activeSalt.color)} />
                        <p className="text-sm font-black text-primary-dark">{activeSalt.name}</p>
                        <p className="text-[10px] font-bold text-text-secondary">{activeSalt.formula}</p>
                      </div>
                    ) : (
                      <div className="h-40 flex items-center justify-center">
                        <p className="text-xs font-bold text-text-secondary">Selecciona una sal para ver su llama</p>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </div>

            <FlameTestAI selected={activeSalt} hint={showHint} onHint={() => setShowHint(!showHint)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlameTestPage;
