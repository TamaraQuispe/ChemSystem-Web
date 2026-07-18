import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Droplets } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const SUBSTANCES = [
  { name: 'Jugo de Limón', pH: 2.2, category: 'ácido', color: 'text-yellow-600 bg-yellow-50' },
  { name: 'Vinagre', pH: 2.9, category: 'ácido', color: 'text-amber-600 bg-amber-50' },
  { name: 'Café', pH: 5.0, category: 'ácido', color: 'text-brown-600 bg-orange-50' },
  { name: 'Agua Destilada', pH: 7.0, category: 'neutro', color: 'text-blue-500 bg-blue-50' },
  { name: 'Leche', pH: 6.5, category: 'ácido', color: 'text-gray-500 bg-gray-50' },
  { name: 'Jabón Líquido', pH: 9.5, category: 'base', color: 'text-green-500 bg-green-50' },
  { name: 'Amoniaco', pH: 11.5, category: 'base', color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Lejía', pH: 12.5, category: 'base', color: 'text-cyan-600 bg-cyan-50' },
];

const pHMeterAI = ({ substance }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-2xl border border-green-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-green-500" /><span className="text-xs font-black text-green-700">Químico Analista</span></div>
      {substance && (
        <>
          <p className="text-[10px] font-semibold text-green-600/80">{substance.name}: pH = {substance.pH}</p>
          <p className="text-[10px] font-semibold text-green-600/80">
            {substance.category === 'ácido' ? 'Sustancia ácida. [H⁺] &gt; [OH⁻].' :
             substance.category === 'base' ? 'Sustancia básica. [OH⁻] &gt; [H⁺].' :
             'pH neutro. [H⁺] = [OH⁻] = 10⁻⁷ M.'}
          </p>
          <p className="text-[10px] font-bold text-green-600">
            [H⁺] = {10 ** -substance.pH < 0.0001 ? (10 ** -substance.pH).toExponential(2) : (10 ** -substance.pH).toFixed(6)} M
          </p>
        </>
      )}
    </div>
  );
};

const pHMeterPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);

  const getPHColor = (pH) => {
    if (pH < 3) return '#DC2626';
    if (pH < 5) return '#EA580C';
    if (pH < 6.5) return '#F59E0B';
    if (pH < 7.5) return '#059669';
    if (pH < 10) return '#2563EB';
    return '#7C3AED';
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Droplets size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Medidor de pH</h1>
            <p className="text-text-secondary font-semibold mb-2">Mide la acidez de sustancias cotidianas usando un pH-metro digital virtual.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Sustancias</h2>
                <div className="grid grid-cols-2 gap-3">
                  {SUBSTANCES.map(s => (
                    <button key={s.name} onClick={() => setSelected(s)}
                      className={cn("p-4 rounded-2xl border-2 text-center transition-all", s.color,
                        selected?.name === s.name ? 'border-current shadow-md' : 'border-gray-100'
                      )}>
                      <p className="text-xs font-black">{s.name}</p>
                      <p className="text-[8px] font-bold opacity-70">{s.category}</p>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">pH-metro Digital</h2>
                {selected ? (
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center border-4 shadow-lg"
                      style={{ borderColor: getPHColor(selected.pH), backgroundColor: `${getPHColor(selected.pH)}22` }}>
                      <div>
                        <p className="text-4xl font-black" style={{ color: getPHColor(selected.pH) }}>{selected.pH}</p>
                        <p className="text-[9px] font-bold text-text-secondary">pH</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-primary-dark">{selected.name}</p>
                    <p className="text-[9px] font-bold text-text-secondary mt-1">{selected.category === 'ácido' ? 'Ácido' : selected.category === 'base' ? 'Base' : 'Neutro'}</p>

                    <div className="mt-6 h-4 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-500 rounded-full relative">
                      <div className="absolute -top-1 w-6 h-6 bg-white rounded-full border-2 border-gray-300 shadow-md"
                        style={{ left: `${(selected.pH / 14) * 100}%`, transform: 'translateX(-50%)' }} />
                    </div>
                    <div className="flex justify-between text-[7px] font-bold text-text-secondary mt-1">
                      <span>0</span><span>7</span><span>14</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-xs font-bold text-text-secondary">Selecciona una sustancia para medir su pH</p>
                  </div>
                )}

                <pHMeterAI substance={selected} />
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default pHMeterPage;
