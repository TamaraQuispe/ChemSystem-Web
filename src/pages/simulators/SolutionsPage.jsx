import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, FlaskConical, Play } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const SolutionsAI = ({ C1, V1, C2, V2 }) => {
  const calculatedV2 = V1 > 0 ? (C1 * V1) / C2 : 0;
  const diff = Math.abs(V2 - calculatedV2);
  return (
    <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-2xl border border-teal-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-teal-500" /><span className="text-xs font-black text-teal-700">Preparador de Soluciones</span></div>
      <p className="text-[10px] font-semibold text-teal-600/80">C₁V₁ = C₂V₂</p>
      <p className="text-[10px] font-semibold text-teal-600/80">{C1} × {V1} = {C2} × V₂ → V₂ = <strong>{calculatedV2.toFixed(1)} mL</strong></p>
      {diff < 1 ? (
        <p className="text-[10px] font-bold text-emerald-500">✓ Volumen correcto. La dilución está bien calculada.</p>
      ) : V2 > 0 ? (
        <p className="text-[10px] font-bold text-amber-500">El volumen de la solución diluida debería ser {calculatedV2.toFixed(1)} mL.</p>
      ) : null}
    </div>
  );
};

const SolutionsPage = () => {
  const [step, setStep] = useState('intro');
  const [C1, setC1] = useState(2);
  const [V1, setV1] = useState(10);
  const [C2, setC2] = useState(0.5);
  const [V2, setV2] = useState(0);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><FlaskConical size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Preparación de Soluciones</h1>
            <p className="text-text-secondary font-semibold mb-2">Calcula diluciones usando la fórmula C₁V₁ = C₂V₂. Simula la preparación en el laboratorio.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Solución Madre</h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Concentración (C₁)</span><span className="text-xs font-black">{C1} M</span></div>
                    <input type="range" min="0.1" max="5" step="0.1" value={C1} onChange={e => setC1(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Volumen (V₁)</span><span className="text-xs font-black">{V1} mL</span></div>
                    <input type="range" min="1" max="50" value={V1} onChange={e => setV1(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-2xl text-center">
                  <p className="text-[8px] font-bold text-text-secondary">Moles de soluto</p>
                  <p className="text-lg font-black text-blue-500">{(C1 * V1 / 1000).toFixed(4)} mol</p>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Solución Diluida</h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Concentración deseada (C₂)</span><span className="text-xs font-black">{C2} M</span></div>
                    <input type="range" min="0.05" max="2.5" step="0.05" value={C2} onChange={e => setC2(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Volumen final (V₂)</span><span className="text-xs font-black">{V2} mL</span></div>
                    <input type="range" min="0" max="200" value={V2} onChange={e => setV2(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                </div>
              </Card>
            </div>

            <SolutionsAI C1={C1} V1={V1} C2={C2} V2={V2} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionsPage;
