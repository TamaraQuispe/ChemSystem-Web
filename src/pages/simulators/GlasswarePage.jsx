import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, TestTube, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const CHALLENGES = [
  { title: 'Filtración', items: ['Matraz Erlenmeyer', 'Embudo', 'Papel de filtro', 'Vaso de precipitados'], correct: ['Embudo', 'Papel de filtro', 'Matraz Erlenmeyer'] },
  { title: 'Titulación', items: ['Bureta', 'Pipeta', 'Matraz aforado', 'Vaso de precipitados', 'Agitador'], correct: ['Bureta', 'Matraz aforado', 'Agitador'] },
  { title: 'Destilación', items: ['Matraz de destilación', 'Condensador', 'Termómetro', 'Probeta', 'Embudo'], correct: ['Matraz de destilación', 'Condensador', 'Termómetro'] },
];

const GlasswareAI = ({ challenge, selected }) => {
  const correctCount = selected.filter(s => challenge?.correct.includes(s)).length;
  const totalCorrect = challenge?.correct.length || 0;
  return (
    <div className="p-4 bg-gradient-to-br from-lime-50 to-green-50/50 rounded-2xl border border-lime-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-lime-500" /><span className="text-xs font-black text-lime-700">Asistente de Laboratorio</span></div>
      {challenge && (
        <p className="text-[10px] font-semibold text-lime-600/80">{correctCount}/{totalCorrect} instrumentos correctos. {correctCount === totalCorrect ? '✓ Montaje válido.' : 'Revisa los instrumentos seleccionados.'}</p>
      )}
    </div>
  );
};

const GlasswarePage = () => {
  const [step, setStep] = useState('intro');
  const [challenge, setChallenge] = useState(null);
  const [selected, setSelected] = useState([]);

  const correctCount = challenge ? selected.filter(s => challenge.correct.includes(s)).length : 0;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><TestTube size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Reconocimiento de Material</h1>
            <p className="text-text-secondary font-semibold mb-2">Selecciona los instrumentos correctos para cada montaje de laboratorio.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}
        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>
            <Card className="p-6">
              <h2 className="text-sm font-black text-primary-dark mb-4">Desafíos</h2>
              <div className="flex gap-2 mb-6">
                {CHALLENGES.map(c => (
                  <button key={c.title} onClick={() => { setChallenge(c); setSelected([]); }}
                    className={cn("px-4 py-2 rounded-xl text-[9px] font-bold", challenge?.title === c.title ? 'bg-primary text-white' : 'bg-gray-50')}>{c.title}</button>
                ))}
              </div>
              {challenge && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-bold text-text-secondary mb-2">Instrumentos disponibles</p>
                    <div className="space-y-2">
                      {challenge.items.map(item => (
                        <button key={item} onClick={() => setSelected(s => s.includes(item) ? s.filter(x => x !== item) : [...s, item])}
                          className={cn("w-full p-3 rounded-xl border-2 text-left text-xs font-bold transition-all",
                            selected.includes(item) ? 'border-primary bg-primary/5' : 'border-gray-100'
                          )}>
                          {selected.includes(item) && <CheckCircle2 size={14} className="inline mr-2 text-primary" />}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <p className="text-[9px] font-bold text-text-secondary mb-2">Montaje: {challenge.title}</p>
                    <div className="flex items-center gap-3 justify-center mt-4">
                      {selected.slice(0, 4).map((item, i) => (
                        <div key={i} className="w-16 h-16 rounded-xl bg-white border-2 border-primary/20 flex items-center justify-center text-[7px] font-bold text-center p-1 shadow-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className={cn("mt-4 p-3 rounded-xl text-center text-[10px] font-bold",
                      correctCount === challenge.correct.length ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500')}>
                      {correctCount === challenge.correct.length ? '✓ Montaje correcto' : `${correctCount}/${challenge.correct.length} correctos`}
                    </div>
                  </div>
                </div>
              )}
              <GlasswareAI challenge={challenge} selected={selected} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default GlasswarePage;
