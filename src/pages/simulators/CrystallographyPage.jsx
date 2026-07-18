import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Hexagon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const SYSTEMS = [
  { name: 'Cúbico', params: 'a=b=c, α=β=γ=90°', color: '#005B8F', faces: 6, vertices: 8, example: 'NaCl, Diamante' },
  { name: 'Tetragonal', params: 'a=b≠c, α=β=γ=90°', color: '#06B6D4', faces: 6, vertices: 8, example: 'TiO₂ (Rutilo)' },
  { name: 'Ortorrómbico', params: 'a≠b≠c, α=β=γ=90°', color: '#F59E0B', faces: 6, vertices: 8, example: 'Azufre' },
  { name: 'Hexagonal', params: 'a=b≠c, α=β=90°, γ=120°', color: '#8B3DFF', faces: 8, vertices: 12, example: 'Grafito' },
  { name: 'Monoclínico', params: 'a≠b≠c, α=γ=90°, β≠90°', color: '#EF4444', faces: 6, vertices: 8, example: 'Yeso' },
  { name: 'Triclínico', params: 'a≠b≠c, α≠β≠γ≠90°', color: '#059669', faces: 6, vertices: 8, example: 'K₂Cr₂O₇' },
];

const CrystallographyAI = ({ system }) => (
  <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50/50 rounded-2xl border border-indigo-100 space-y-2">
    <div className="flex items-center gap-2"><Lightbulb size={16} className="text-indigo-500" /><span className="text-xs font-black text-indigo-700">Cristalógrafo IA</span></div>
    {system && <><p className="text-[10px] font-semibold text-indigo-600/80">Sistema {system.name}</p><p className="text-[10px] font-semibold text-indigo-600/80">{system.params}</p><p className="text-[10px] font-semibold text-indigo-600/80">Ej: {system.example}</p><p className="text-[10px] font-bold text-indigo-600">Caras: {system.faces} · Vértices: {system.vertices}</p></>}
  </div>
);

const CrystallographyPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);
  const [rotation, setRotation] = useState(0);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Hexagon size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Cristalografía</h1>
            <p className="text-text-secondary font-semibold mb-2">Explora los 6 sistemas cristalinos y sus parámetros de red.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}
        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Sistemas Cristalinos</h2>
                <div className="grid grid-cols-2 gap-3">
                  {SYSTEMS.map(s => (
                    <button key={s.name} onClick={() => setSelected(s)}
                      className={cn("p-4 rounded-2xl border-2 text-center transition-all", selected?.name === s.name ? 'border-current shadow-md' : 'border-gray-100')}>
                      <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}22` }}>
                        <div className="w-6 h-6 border-2" style={{ borderColor: s.color, transform: `rotate(${selected?.name === s.name ? rotation : 0}deg)` }} />
                      </div>
                      <p className="text-xs font-black">{s.name}</p>
                      <p className="text-[7px] text-text-secondary">{s.params.substring(0, 18)}...</p>
                    </button>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Celda Unitaria</h2>
                {selected ? (
                  <div className="text-center">
                    <div className="h-48 flex items-center justify-center" onClick={() => setRotation(r => r + 15)}>
                      <motion.div animate={{ rotate: rotation }} transition={{ duration: 0.5 }}
                        className="w-36 h-36 relative" style={{ perspective: '500px' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke={selected.color} strokeWidth="2" />
                          <path d="M30,10 L90,10 L90,70 L30,70 Z" fill={`${selected.color}11`} stroke={selected.color} strokeWidth="1.5" strokeDasharray="3" />
                          <line x1="20" y1="20" x2="30" y2="10" stroke={selected.color} strokeWidth="1.5" />
                          <line x1="80" y1="20" x2="90" y2="10" stroke={selected.color} strokeWidth="1.5" />
                          <line x1="80" y1="80" x2="90" y2="70" stroke={selected.color} strokeWidth="1.5" />
                          <line x1="20" y1="80" x2="30" y2="70" stroke={selected.color} strokeWidth="1.5" />
                        </svg>
                      </motion.div>
                    </div>
                    <p className="text-[9px] font-bold text-text-secondary mt-2">Click para rotar</p>
                    <CrystallographyAI system={selected} />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center"><p className="text-xs font-bold text-text-secondary">Selecciona un sistema</p></div>
                )}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrystallographyPage;
