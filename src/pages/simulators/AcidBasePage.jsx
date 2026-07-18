import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Beaker, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const ACIDS = [
  { name: 'HCl', label: 'Ácido Clorhídrico', strength: 'fuerte', pka: -6.3 },
  { name: 'H₂SO₄', label: 'Ácido Sulfúrico', strength: 'fuerte', pka: -3 },
  { name: 'CH₃COOH', label: 'Ácido Acético', strength: 'débil', pka: 4.76 },
  { name: 'H₃PO₄', label: 'Ácido Fosfórico', strength: 'débil', pka: 2.12 },
];

const BASES = [
  { name: 'NaOH', label: 'Hidróxido de Sodio', strength: 'fuerte', pkb: 0 },
  { name: 'KOH', label: 'Hidróxido de Potasio', strength: 'fuerte', pkb: 0 },
  { name: 'NH₃', label: 'Amoniaco', strength: 'débil', pkb: 4.75 },
  { name: 'Ca(OH)₂', label: 'Hidróxido de Calcio', strength: 'fuerte', pkb: 0 },
];

const AcidBaseAI = ({ acid, base, targetPh, currentPh }) => {
  const diff = Math.abs(currentPh - targetPh);
  return (
    <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50/50 rounded-2xl border border-amber-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-amber-500" /><span className="text-xs font-black text-amber-700">Neutralizador IA</span></div>
      {!acid && !base && <p className="text-[10px] font-semibold text-amber-600/80">Selecciona un ácido y una base. Ajusta los volúmenes hasta alcanzar pH 7.</p>}
      {acid && base && (
        <>
          <p className="text-[10px] font-semibold text-amber-600/80">{acid.name} ({acid.strength}) + {base.name} ({base.strength})</p>
          {diff < 0.3
            ? <p className="text-[10px] font-bold text-emerald-500">✓ Neutralización casi perfecta. pH ≈ {currentPh.toFixed(1)}</p>
            : <p className="text-[10px] font-bold text-amber-500">pH actual: {currentPh.toFixed(1)}. Ajusta los volúmenes para acercarte a 7.</p>
          }
        </>
      )}
    </div>
  );
};

const AcidBasePage = () => {
  const [step, setStep] = useState('intro');
  const [selectedAcid, setSelectedAcid] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [volAcid, setVolAcid] = useState(10);
  const [volBase, setVolBase] = useState(10);

  const currentPh = selectedAcid && selectedBase
    ? Math.max(0, Math.min(14, 7 + (volBase - volAcid) * 0.3 + (selectedBase.strength === 'fuerte' ? 0.5 : -0.5)))
    : 7;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Beaker size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Titulación Ácido-Base</h1>
            <p className="text-text-secondary font-semibold mb-2">Combina ácidos y bases para lograr la neutralización. Ajusta volúmenes hasta alcanzar pH 7.</p>
            <div className="p-4 bg-amber-50 rounded-2xl text-xs font-semibold text-amber-600 mb-8 max-w-lg mx-auto">Meta: lograr pH 7 combinando el ácido y la base adecuados en las proporciones correctas.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Selecciona Ácido</h2>
                <div className="grid grid-cols-2 gap-2">
                  {ACIDS.map(a => (
                    <button key={a.name} onClick={() => setSelectedAcid(a)}
                      className={cn("p-3 rounded-xl text-xs font-bold border-2 transition-all",
                        selectedAcid?.name === a.name ? 'border-red-400 bg-red-50' : 'border-gray-100 hover:border-red-200'
                      )}>
                      <p className="text-sm font-black">{a.name}</p>
                      <p className="text-[8px] text-text-secondary">{a.label}</p>
                      <p className="text-[8px] mt-1">{a.strength}</p>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Selecciona Base</h2>
                <div className="grid grid-cols-2 gap-2">
                  {BASES.map(b => (
                    <button key={b.name} onClick={() => setSelectedBase(b)}
                      className={cn("p-3 rounded-xl text-xs font-bold border-2 transition-all",
                        selectedBase?.name === b.name ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                      )}>
                      <p className="text-sm font-black">{b.name}</p>
                      <p className="text-[8px] text-text-secondary">{b.label}</p>
                      <p className="text-[8px] mt-1">{b.strength}</p>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {selectedAcid && selectedBase && (
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Ajuste de Volúmenes</h2>
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Ácido ({selectedAcid.name})</span><span className="text-xs font-black">{volAcid} mL</span></div>
                    <input type="range" min="0" max="50" value={volAcid} onChange={e => setVolAcid(Number(e.target.value))} className="w-full accent-red-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Base ({selectedBase.name})</span><span className="text-xs font-black">{volBase} mL</span></div>
                    <input type="range" min="0" max="50" value={volBase} onChange={e => setVolBase(Number(e.target.value))} className="w-full accent-blue-500" />
                  </div>
                </div>

                <div className={cn("p-8 text-center rounded-3xl", currentPh < 3 ? 'bg-red-100' : currentPh < 6 ? 'bg-orange-100' : Math.abs(currentPh - 7) < 0.5 ? 'bg-emerald-100' : currentPh < 10 ? 'bg-blue-100' : 'bg-purple-100')}>
                  <p className="text-5xl font-black" style={{ color: currentPh < 3 ? '#DC2626' : currentPh < 6 ? '#EA580C' : Math.abs(currentPh - 7) < 0.5 ? '#059669' : currentPh < 10 ? '#2563EB' : '#9333EA' }}>
                    {currentPh.toFixed(1)}
                  </p>
                  <p className="text-xs font-bold mt-2">
                    {currentPh < 3 ? 'Ácido fuerte' : currentPh < 6 ? 'Ácido débil' : Math.abs(currentPh - 7) < 0.5 ? '⚖ Neutralizado' : currentPh < 10 ? 'Base débil' : 'Base fuerte'}
                  </p>
                </div>

                <AcidBaseAI acid={selectedAcid} base={selectedBase} currentPh={currentPh} targetPh={7} />
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcidBasePage;
