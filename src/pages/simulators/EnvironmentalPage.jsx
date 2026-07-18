import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, TreePine } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const EnvironmentalAI = ({ co2, waste, water }) => {
  const footprint = co2 * 2.5 + waste * 0.3 + water * 1.2;
  return (
    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-2xl border border-green-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-green-500" /><span className="text-xs font-black text-green-700">Ambiental IA</span></div>
      <p className="text-[10px] font-semibold text-green-600/80">Huella de carbono estimada: <strong>{footprint.toFixed(1)} kg CO₂eq</strong></p>
      {footprint > 100 ? <p className="text-[10px] font-bold text-red-500">⚠ Impacto alto. Se requieren medidas de mitigación urgentes.</p> :
       footprint > 50 ? <p className="text-[10px] font-bold text-amber-500">Impacto moderado. Implementa prácticas sostenibles.</p> :
       <p className="text-[10px] font-bold text-emerald-500">✓ Impacto bajo. Buenas prácticas ambientales.</p>}
    </div>
  );
};

const EnvironmentalPage = () => {
  const [step, setStep] = useState('intro');
  const [co2, setCo2] = useState(20);
  const [waste, setWaste] = useState(10);
  const [water, setWater] = useState(15);
  const footprint = co2 * 2.5 + waste * 0.3 + water * 1.2;
  const treeEquivalent = Math.round(footprint / 22);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><TreePine size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Química Ambiental</h1>
            <p className="text-text-secondary font-semibold mb-2">Calcula tu huella de carbono basada en el consumo de recursos.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}
        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Parámetros de impacto</h2>
                <div className="space-y-5">
                  <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Emisiones CO₂ (kg/día)</span><span className="text-xs font-black">{co2}</span></div><input type="range" min="0" max="100" value={co2} onChange={e => setCo2(Number(e.target.value))} className="w-full accent-red-500" /></div>
                  <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Residuos (kg/día)</span><span className="text-xs font-black">{waste}</span></div><input type="range" min="0" max="50" value={waste} onChange={e => setWaste(Number(e.target.value))} className="w-full accent-amber-500" /></div>
                  <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Consumo agua (L/día)</span><span className="text-xs font-black">{water}</span></div><input type="range" min="0" max="100" value={water} onChange={e => setWater(Number(e.target.value))} className="w-full accent-blue-500" /></div>
                </div>
              </Card>
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Huella de Carbono</h2>
                  <div className={cn("p-8 rounded-3xl text-center", footprint > 80 ? 'bg-red-50' : footprint > 40 ? 'bg-amber-50' : 'bg-emerald-50')}>
                    <p className="text-5xl font-black">{footprint.toFixed(0)}</p>
                    <p className="text-xs font-bold mt-2">kg CO₂ equivalente</p>
                  </div>
                  <div className="flex items-center gap-3 mt-4 p-4 bg-gray-50 rounded-2xl">
                    <TreePine size={24} className="text-green-500 shrink-0" />
                    <p className="text-[9px] font-semibold text-text-secondary">Se necesitan <strong>{treeEquivalent}</strong> árboles para compensar esta huella durante un año.</p>
                  </div>
                </Card>
                <EnvironmentalAI co2={co2} waste={waste} water={water} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default EnvironmentalPage;
