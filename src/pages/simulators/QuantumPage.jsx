import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Atom, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const ORBITALS = [
  { n: 1, l: 0, m: 0, label: '1s', shape: 'Esférico', nodes: 0, color: '#005B8F' },
  { n: 2, l: 0, m: 0, label: '2s', shape: 'Esférico', nodes: 1, color: '#06B6D4' },
  { n: 2, l: 1, m: -1, label: '2pₓ', shape: 'Lóbulo x', nodes: 1, color: '#F59E0B' },
  { n: 2, l: 1, m: 0, label: '2pᵧ', shape: 'Lóbulo y', nodes: 1, color: '#8B3DFF' },
  { n: 2, l: 1, m: 1, label: '2p₂', shape: 'Lóbulo z', nodes: 1, color: '#EF4444' },
  { n: 3, l: 0, m: 0, label: '3s', shape: 'Esférico', nodes: 2, color: '#059669' },
  { n: 3, l: 1, m: 0, label: '3p', shape: 'Lóbulo', nodes: 2, color: '#D97706' },
  { n: 3, l: 2, m: 0, label: '3d₂²', shape: 'Doble lóbulo + anillo', nodes: 2, color: '#7C3AED' },
];

const QuantumAI = ({ orbital }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50/50 rounded-2xl border border-violet-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-violet-500" /><span className="text-xs font-black text-violet-700">Mecánica Cuántica IA</span></div>
      {orbital && (
        <>
          <p className="text-[10px] font-semibold text-violet-600/80">Orbital {orbital.label}</p>
          <p className="text-[10px] font-semibold text-violet-600/80">n={orbital.n} · l={orbital.l} · m={orbital.m}</p>
          <p className="text-[10px] font-semibold text-violet-600/80">Forma: {orbital.shape} · Nodos: {orbital.nodes}</p>
          <p className="text-[10px] font-bold text-violet-600">La probabilidad de encontrar el electrón es máxima en la región del orbital.</p>
        </>
      )}
    </div>
  );
};

const QuantumPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Atom size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Números Cuánticos</h1>
            <p className="text-text-secondary font-semibold mb-2">Explora orbitales atómicos seleccionando los números cuánticos n, l y m.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Orbitales atómicos</h2>
                <div className="grid grid-cols-4 gap-2">
                  {ORBITALS.map(o => (
                    <button key={o.label} onClick={() => setSelected(o)}
                      className={cn("p-3 rounded-xl border-2 text-center transition-all",
                        selected?.label === o.label ? 'border-primary shadow-md bg-primary/5' : 'border-gray-100'
                      )}>
                      <p className="text-sm font-black">{o.label}</p>
                      <p className="text-[7px] text-text-secondary">n={o.n} l={o.l}</p>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Visualización</h2>
                {selected ? (
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto relative flex items-center justify-center">
                      <motion.div key={selected.label} initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className={cn("w-40 h-40 rounded-full flex items-center justify-center",
                          selected.l === 0 ? 'opacity-40' : selected.l === 1 ? 'opacity-50' : 'opacity-60'
                        )}
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${selected.color}88 0%, ${selected.color}44 40%, transparent 70%)`,
                          border: `2px solid ${selected.color}`,
                          transform: selected.l === 1 ? `rotate(${selected.m * 30}deg)` : 'none',
                        }}>
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                          className="w-3 h-3 rounded-full" style={{ backgroundColor: selected.color, filter: 'blur(1px)' }} />
                      </motion.div>
                    </div>
                    <QuantumAI orbital={selected} />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-xs font-bold text-text-secondary">Selecciona un orbital para visualizarlo</p>
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuantumPage;
