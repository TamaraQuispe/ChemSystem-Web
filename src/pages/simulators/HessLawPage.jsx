import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Sigma, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const EQUATIONS = [
  { eq: 'C + O₂ → CO₂', ΔH: -393.5, used: false },
  { eq: 'H₂ + ½O₂ → H₂O', ΔH: -285.8, used: false },
  { eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O', ΔH: -890, used: false },
  { eq: '2C + O₂ → 2CO', ΔH: -221, used: false },
  { eq: 'CO + ½O₂ → CO₂', ΔH: -283, used: false },
];

const HessLawAI = ({ selected, totalΔH, targetΔH }) => {
  const diff = Math.abs(totalΔH - targetΔH);
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-blue-500" /><span className="text-xs font-black text-blue-700">Termodinámico IA</span></div>
      {selected.length === 0 && <p className="text-[10px] font-semibold text-blue-600/80">Selecciona ecuaciones para calcular la entalpía total.</p>}
      {selected.length > 0 && (
        <>
          <p className="text-[10px] font-semibold text-blue-600/80">ΔH total = {totalΔH.toFixed(1)} kJ/mol</p>
          {targetΔH && diff < 10
            ? <p className="text-[10px] font-bold text-emerald-500">✓ Coincide con el valor esperado de {targetΔH} kJ/mol</p>
            : targetΔH && <p className="text-[10px] font-bold text-amber-500">Difiere en {diff.toFixed(1)} kJ/mol del valor esperado</p>}
        </>
      )}
    </div>
  );
};

const HessLawPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState([]);
  const [targetΔH, setTargetΔH] = useState(0);

  const totalΔH = selected.reduce((s, i) => s + EQUATIONS[i].ΔH, 0);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Sigma size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Ley de Hess</h1>
            <p className="text-text-secondary font-semibold mb-2">Combina ecuaciones termoquímicas para calcular la entalpía total de una reacción.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <Card className="p-6">
              <h2 className="text-sm font-black text-primary-dark mb-4">Ecuaciones disponibles</h2>
              <div className="space-y-3">
                {EQUATIONS.map((eq, i) => (
                  <button key={i} onClick={() => {
                    setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);
                  }} className={cn("w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                    selected.includes(i) ? 'border-primary bg-primary/5' : 'border-gray-100'
                  )}>
                    <div>
                      <p className="text-sm font-bold text-primary-dark">{eq.eq}</p>
                      <p className="text-[9px] font-bold text-text-secondary">ΔH = {eq.ΔH} kJ/mol</p>
                    </div>
                    {selected.includes(i) && <CheckCircle2 size={20} className="text-primary" />}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-center">
                <p className="text-[9px] font-bold text-text-secondary">ENTALPÍA TOTAL</p>
                <p className="text-4xl font-black text-primary-dark">{totalΔH.toFixed(1)} <span className="text-lg">kJ/mol</span></p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Valor esperado (opcional)</span><span className="text-xs font-black">{targetΔH} kJ/mol</span></div>
                <input type="range" min="-2000" max="0" step="10" value={targetΔH} onChange={e => setTargetΔH(Number(e.target.value))} className="w-full accent-primary" />
              </div>

              <HessLawAI selected={selected} totalΔH={totalΔH} targetΔH={targetΔH} />
              <Button onClick={() => setSelected([])} variant="outline" className="mt-4 w-full rounded-2xl font-bold text-xs"><RotateCcw size={14} /> Limpiar</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HessLawPage;
