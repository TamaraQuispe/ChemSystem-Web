import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Battery, Zap, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const METALS = [
  { sym: 'Cu', name: 'Cobre', e0: 0.34, color: 'text-amber-500 bg-amber-50' },
  { sym: 'Zn', name: 'Zinc', e0: -0.76, color: 'text-blue-500 bg-blue-50' },
  { sym: 'Fe', name: 'Hierro', e0: -0.44, color: 'text-gray-500 bg-gray-50' },
  { sym: 'Ag', name: 'Plata', e0: 0.80, color: 'text-slate-400 bg-slate-50' },
  { sym: 'Mg', name: 'Magnesio', e0: -2.37, color: 'text-green-500 bg-green-50' },
  { sym: 'Al', name: 'Aluminio', e0: -1.66, color: 'text-sky-500 bg-sky-50' },
];

const ElectrochemistryAI = ({ anode, cathode, voltage }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50/50 rounded-2xl border border-yellow-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-amber-500" /><span className="text-xs font-black text-amber-700">Electroquímico IA</span></div>
      {!anode && !cathode && <p className="text-[10px] font-semibold text-amber-600/80">Selecciona dos metales para construir una celda galvánica. El de mayor potencial se reduce (cátodo).</p>}
      {anode && cathode && (
        <>
          <p className="text-[10px] font-semibold text-amber-600/80">Cátodo (+): <strong>{cathode.name}</strong> (E° = {cathode.e0} V) — se reduce</p>
          <p className="text-[10px] font-semibold text-amber-600/80">Ánodo (-): <strong>{anode.name}</strong> (E° = {anode.e0} V) — se oxida</p>
          <p className="text-[10px] font-bold text-primary-dark">Potencial de celda: E° = E°cátodo − E°ánodo = <strong>{voltage.toFixed(2)} V</strong></p>
          {voltage > 0
            ? <p className="text-[10px] font-bold text-emerald-500">✓ Reacción espontánea (celda galvánica)</p>
            : <p className="text-[10px] font-bold text-amber-500">⚠ No es espontánea. Se requiere energía externa (celda electrolítica).</p>
          }
        </>
      )}
    </div>
  );
};

const ElectrochemistryPage = () => {
  const [step, setStep] = useState('intro');
  const [anode, setAnode] = useState(null);
  const [cathode, setCathode] = useState(null);

  const voltage = anode && cathode ? (cathode.e0 - anode.e0) : 0;
  const electronFlow = voltage > 0;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Battery size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Celdas Electroquímicas</h1>
            <p className="text-text-secondary font-semibold mb-2">Construye celdas galvánicas seleccionando electrodos. Calcula el potencial de celda.</p>
            <div className="p-4 bg-yellow-50 rounded-2xl text-xs font-semibold text-yellow-600 mb-8 max-w-lg mx-auto">El potencial de celda determina si una reacción redox es espontánea o requiere energía.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <Card className="p-6">
              <h2 className="text-sm font-black text-primary-dark mb-4">Selecciona los electrodos</h2>
              <div className="grid grid-cols-3 gap-4">
                {METALS.map(m => (
                  <button key={m.sym} onClick={() => {
                    if (!anode && !cathode) { setCathode(m); return; }
                    if (cathode && !anode) { setAnode(m); return; }
                    setAnode(null); setCathode(m);
                  }} className={cn("p-4 rounded-2xl border-2 text-center transition-all", m.color,
                    cathode?.sym === m.sym ? 'border-emerald-400 ring-2 ring-emerald-200' :
                    anode?.sym === m.sym ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-100'
                  )}>
                    <p className="text-xl font-black">{m.sym}</p>
                    <p className="text-[9px] font-bold">{m.name}</p>
                    <p className="text-[8px] opacity-70">E° = {m.e0} V</p>
                  </button>
                ))}
              </div>

              {cathode && (
                <div className="flex items-center justify-center gap-4 mt-6 p-4 bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <p className="text-[8px] font-bold text-text-secondary">Ánodo (-)</p>
                    <p className="text-sm font-black text-red-500">{anode?.sym || '?'}</p>
                    <p className="text-[8px] text-text-secondary">{anode?.name || 'Seleccionar'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={20} className={voltage > 0 ? 'text-emerald-400' : 'text-gray-300'} />
                    <p className="text-lg font-black">{voltage.toFixed(2)} V</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-bold text-text-secondary">Cátodo (+)</p>
                    <p className="text-sm font-black text-emerald-500">{cathode.sym}</p>
                    <p className="text-[8px] text-text-secondary">{cathode.name}</p>
                  </div>
                </div>
              )}

              <ElectrochemistryAI anode={anode} cathode={cathode} voltage={voltage} />

              <Button onClick={() => { setAnode(null); setCathode(null); }}
                variant="outline" className="mt-4 w-full rounded-2xl font-bold text-xs"><RotateCcw size={14} /> Reiniciar</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElectrochemistryPage;
