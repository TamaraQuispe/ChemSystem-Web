import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Layers, Play } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const MONOMERS = [
  { name: 'Etileno', formula: 'CH₂=CH₂', type: 'adición', color: '#005B8F', polymer: 'Polietileno (PE)', use: 'Bolsas, envases' },
  { name: 'Estireno', formula: 'C₆H₅CH=CH₂', type: 'adición', color: '#8B3DFF', polymer: 'Poliestireno (PS)', use: 'Vasos, aislante' },
  { name: 'Cloruro de Vinilo', formula: 'CH₂=CHCl', type: 'adición', color: '#059669', polymer: 'PVC', use: 'Tuberías, perfiles' },
  { name: 'Ácido Láctico', formula: 'C₃H₆O₃', type: 'condensación', color: '#F59E0B', polymer: 'Ácido Poliláctico (PLA)', use: 'Filamento 3D' },
];

const PolymerAI = ({ monomer, chainLength }) => (
  <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50/50 rounded-2xl border border-pink-100 space-y-2">
    <div className="flex items-center gap-2"><Lightbulb size={16} className="text-pink-500" /><span className="text-xs font-black text-pink-700">Polímeros IA</span></div>
    {monomer && (<><p className="text-[10px] font-semibold text-pink-600/80">{monomer.name} → {monomer.polymer}</p><p className="text-[10px] font-semibold text-pink-600/80">Polimerización por {monomer.type} · Cadena: {chainLength} unidades</p><p className="text-[10px] font-semibold text-pink-600/80">Uso: {monomer.use}</p></>)}
  </div>
);

const PolymerPage = () => {
  const [step, setStep] = useState('intro');
  const [monomer, setMonomer] = useState(null);
  const [chainLength, setChainLength] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const i = setInterval(() => setChainLength(c => c < 20 ? c + 1 : (clearInterval(i), setIsRunning(false), c)), 400);
    return () => clearInterval(i);
  }, [isRunning]);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Layers size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Polímeros</h1>
            <p className="text-text-secondary font-semibold mb-2">Simula reacciones de polimerización. Selecciona un monómero y observa la cadena crecer.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}
        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Monómeros</h2>
                <div className="grid grid-cols-2 gap-3">
                  {MONOMERS.map(m => (
                    <button key={m.name} onClick={() => { setMonomer(m); setChainLength(0); setIsRunning(false); }}
                      className={cn("p-4 rounded-2xl border-2 text-center transition-all", monomer?.name === m.name ? 'border-current shadow-md' : 'border-gray-100')}>
                      <p className="text-xs font-black">{m.name}</p>
                      <p className="text-[8px] text-text-secondary">{m.formula}</p>
                    </button>
                  ))}
                </div>
                {monomer && (
                  <div className="mt-6">
                    <Button onClick={() => setIsRunning(true)} disabled={isRunning} className="w-full h-11 bg-primary-dark text-white rounded-2xl font-bold text-sm gap-2" isLoading={isRunning}>
                      {isRunning ? 'Polimerizando...' : <><Play size={16} /> Iniciar</>}
                    </Button>
                  </div>
                )}
              </Card>
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Cadena Polimérica</h2>
                  <div className="min-h-[160px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 p-4 flex items-center flex-wrap gap-1">
                    {Array.from({ length: chainLength }).map((_, i) => (
                      <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[6px] font-black text-white shadow-sm"
                        style={{ backgroundColor: monomer?.color || '#005B8F' }}>
                        {monomer?.formula?.substring(0, 3) || 'M'}
                      </motion.div>
                    ))}
                    {chainLength === 0 && <p className="text-xs font-bold text-text-secondary w-full text-center">Inicia la polimerización</p>}
                  </div>
                  <div className="mt-4 flex justify-between text-[9px] font-bold">
                    <span>Unidades: {chainLength}</span>
                    <span>Masa molecular: ~{chainLength * 28} g/mol</span>
                  </div>
                </Card>
                <PolymerAI monomer={monomer} chainLength={chainLength} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PolymerPage;
