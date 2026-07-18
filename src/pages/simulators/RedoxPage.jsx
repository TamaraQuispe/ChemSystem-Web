import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ArrowRight, RotateCcw, CheckCircle2, Zap } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const REACTIONS = [
  { id: 1, left: 'Zn + Cu²⁺', right: 'Zn²⁺ + Cu', oxidation: 'Zn → Zn²⁺ + 2e⁻', reduction: 'Cu²⁺ + 2e⁻ → Cu', oxidizer: 'Cu²⁺', reducer: 'Zn' },
  { id: 2, left: 'Fe + O₂', right: 'Fe₂O₃', oxidation: 'Fe → Fe³⁺ + 3e⁻', reduction: 'O₂ + 4e⁻ → 2O²⁻', oxidizer: 'O₂', reducer: 'Fe' },
  { id: 3, left: 'Na + Cl₂', right: 'NaCl', oxidation: 'Na → Na⁺ + e⁻', reduction: 'Cl₂ + 2e⁻ → 2Cl⁻', oxidizer: 'Cl₂', reducer: 'Na' },
];

const RedoxAI = ({ reaction, step }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50/50 rounded-2xl border border-violet-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-violet-500" /><span className="text-xs font-black text-violet-700">Analista Redox</span></div>
      {step === 'id' && <p className="text-[10px] font-semibold text-violet-600/80">Identifica qué elemento se oxida (pierde electrones) y cuál se reduce (gana electrones).</p>}
      {step === 'half' && <p className="text-[10px] font-semibold text-violet-600/80">Escribe las semirreacciones. La oxidación: pérdida de e⁻. La reducción: ganancia de e⁻.</p>}
      {step === 'done' && <p className="text-[10px] font-semibold text-violet-600/80">Agente oxidante: <strong>{reaction.oxidizer}</strong> (se reduce). Agente reductor: <strong>{reaction.reducer}</strong> (se oxida).</p>}
    </div>
  );
};

const RedoxPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(0);
  const [labPhase, setLabPhase] = useState('id');
  const [showHalf, setShowHalf] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const reaction = REACTIONS[selected];

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl"><Zap size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Reacciones Redox</h1>
            <p className="text-text-secondary font-semibold mb-2">Identifica oxidación, reducción, agente oxidante y reductor.</p>
            <div className="p-4 bg-violet-50 rounded-2xl text-xs font-semibold text-violet-600 mb-8 max-w-lg mx-auto">Oxidación: pérdida de electrones. Reducción: ganancia de electrones.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="flex gap-2">
              {REACTIONS.map((r, i) => (
                <button key={r.id} onClick={() => { setSelected(i); setLabPhase('id'); setShowHalf(false); setShowAnswer(false); }}
                  className={cn("px-4 py-2 rounded-xl text-[9px] font-bold transition-all",
                    selected === i ? 'bg-primary text-white' : 'bg-gray-50 text-text-secondary'
                  )}>{r.left} → {r.right}</button>
              ))}
            </div>

            <Card className="p-8">
              <div className="text-center mb-8">
                <p className="text-2xl font-black text-primary-dark">{reaction.left} → {reaction.right}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[9px] font-black text-blue-500 uppercase mb-2">Oxidación</p>
                  {showHalf ? (
                    <p className="text-sm font-bold text-blue-700">{reaction.oxidation}</p>
                  ) : (
                    <button onClick={() => setShowHalf(true)} className="text-[10px] font-bold text-blue-400 hover:text-blue-500">Mostrar semirreacción</button>
                  )}
                </div>
                <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-[9px] font-black text-red-500 uppercase mb-2">Reducción</p>
                  {showHalf ? (
                    <p className="text-sm font-bold text-red-700">{reaction.reduction}</p>
                  ) : (
                    <button onClick={() => setShowHalf(true)} className="text-[10px] font-bold text-red-400 hover:text-red-500">Mostrar semirreacción</button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={cn("p-4 rounded-2xl text-center border-2 transition-all cursor-pointer",
                  showAnswer ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:border-primary')}
                  onClick={() => setShowAnswer(true)}>
                  <p className="text-[9px] font-bold text-text-secondary mb-1">Agente Oxidante</p>
                  <p className="text-lg font-black text-primary-dark">{showAnswer ? reaction.oxidizer : '?'}</p>
                </div>
                <div className={cn("p-4 rounded-2xl text-center border-2 transition-all cursor-pointer",
                  showAnswer ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:border-primary')}
                  onClick={() => setShowAnswer(true)}>
                  <p className="text-[9px] font-bold text-text-secondary mb-1">Agente Reductor</p>
                  <p className="text-lg font-black text-primary-dark">{showAnswer ? reaction.reducer : '?'}</p>
                </div>
              </div>

              <RedoxAI reaction={reaction} step={showAnswer ? 'done' : showHalf ? 'half' : 'id'} />

              <Button onClick={() => { setShowHalf(false); setShowAnswer(false); }}
                variant="outline" className="mt-4 w-full rounded-2xl font-bold text-xs"><RotateCcw size={14} /> Reiniciar</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RedoxPage;
