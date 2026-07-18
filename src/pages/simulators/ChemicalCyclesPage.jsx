import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Waves } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const ChemicalCyclesAI = ({ Th, Tc, efficiency }) => (
  <div className="p-4 bg-gradient-to-br from-cyan-50 to-sky-50/50 rounded-2xl border border-cyan-100 space-y-2">
    <div className="flex items-center gap-2"><Lightbulb size={16} className="text-cyan-500" /><span className="text-xs font-black text-cyan-700">Ciclo de Carnot IA</span></div>
    <p className="text-[10px] font-semibold text-cyan-600/80">T caliente: {Th}K · T fría: {Tc}K</p>
    <p className="text-[10px] font-semibold text-cyan-600/80">η = 1 − {Tc}/{Th} = <strong>{efficiency.toFixed(1)}%</strong></p>
    {efficiency > 50 ? <p className="text-[10px] font-bold text-emerald-500">✓ Alta eficiencia</p> : efficiency > 20 ? <p className="text-[10px] font-bold text-amber-500">Eficiencia moderada</p> : <p className="text-[10px] font-bold text-red-500">⚠ Baja eficiencia</p>}
  </div>
);

const ChemicalCyclesPage = () => {
  const [step, setStep] = useState('intro');
  const [Th, setTh] = useState(500);
  const [Tc, setTc] = useState(300);
  const efficiency = 100 * (1 - Tc / Th);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Waves size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Ciclo de Carnot</h1>
            <p className="text-text-secondary font-semibold mb-2">Analiza la eficiencia de un ciclo termodinámico variando las temperaturas.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}
        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Diagrama TS</h2>
                <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-4">
                  <svg viewBox="0 0 300 180" className="w-full h-full">
                    <rect x="50" y="20" width="200" height="120" fill="none" stroke="#005B8F" strokeWidth="2" rx="4" />
                    <rect x="80" y="40" width="140" height="80" fill="none" stroke="#005B8F" strokeWidth="1.5" strokeDasharray="4" rx="2" />
                    <text x="150" y="170" textAnchor="middle" fill="#9CA3AF" fontSize="10">Entropía (S)</text>
                    <text x="20" y="90" textAnchor="middle" fill="#9CA3AF" fontSize="10" transform="rotate(-90, 20, 90)">Temperatura</text>
                    <text x="260" y="35" fill="#EF4444" fontSize="9">T_h={Th}K</text>
                    <text x="260" y="135" fill="#3B82F6" fontSize="9">T_c={Tc}K</text>
                    <line x1="50" y1="40" x2="250" y2="40" stroke="#EF4444" strokeWidth="1" strokeDasharray="2" />
                    <line x1="50" y1="120" x2="250" y2="120" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2" />
                  </svg>
                </div>
              </Card>
              <Card className="p-6 space-y-5">
                <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Temperatura caliente (Th)</span><span className="text-xs font-black">{Th}K</span></div><input type="range" min="300" max="1000" value={Th} onChange={e => setTh(Number(e.target.value))} className="w-full accent-red-500" /></div>
                <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Temperatura fría (Tc)</span><span className="text-xs font-black">{Tc}K</span></div><input type="range" min="150" max="400" value={Tc} onChange={e => setTc(Number(e.target.value))} className="w-full accent-blue-500" /></div>
                <div className="p-4 bg-gradient-to-br from-cyan-400 to-sky-500 text-white rounded-2xl text-center">
                  <p className="text-[9px] font-bold opacity-80">EFICIENCIA DE CARNOT</p>
                  <p className="text-4xl font-black">{efficiency.toFixed(1)}%</p>
                </div>
                <ChemicalCyclesAI Th={Th} Tc={Tc} efficiency={efficiency} />
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChemicalCyclesPage;
