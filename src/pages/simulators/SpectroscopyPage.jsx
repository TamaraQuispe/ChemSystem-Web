import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, ScanLine } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const COMPOUNDS = [
  { name: 'Etanol', formula: 'CH₃CH₂OH', ir: 'OH (3400), CH (2900), CO (1050)', nmr: 'CH₃ (1.2 ppm), CH₂ (3.7 ppm), OH (2.5 ppm)', peaks: [3400, 2900, 1050], peakColors: ['#EF4444', '#3B82F6', '#06B6D4'] },
  { name: 'Ácido Acético', formula: 'CH₃COOH', ir: 'OH (3000), C=O (1710), CO (1200)', nmr: 'CH₃ (2.1 ppm), OH (11.4 ppm)', peaks: [3000, 1710, 1200], peakColors: ['#EF4444', '#F59E0B', '#06B6D4'] },
  { name: 'Benceno', formula: 'C₆H₆', ir: 'CH (3030), CC (1500)', nmr: 'H aromático (7.3 ppm)', peaks: [3030, 1500], peakColors: ['#3B82F6', '#8B3DFF'] },
  { name: 'Acetona', formula: 'CH₃COCH₃', ir: 'C=O (1715), CH (2920)', nmr: 'CH₃ (2.2 ppm)', peaks: [1715, 2920], peakColors: ['#F59E0B', '#3B82F6'] },
];

const SpectroscopyAI = ({ compound }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50/50 rounded-2xl border border-purple-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-purple-500" /><span className="text-xs font-black text-purple-700">Espectroscopista IA</span></div>
      {compound && (
        <>
          <p className="text-[10px] font-semibold text-purple-600/80">{compound.name} ({compound.formula})</p>
          <p className="text-[10px] font-semibold text-purple-600/80"><strong>IR:</strong> {compound.ir}</p>
          <p className="text-[10px] font-semibold text-purple-600/80"><strong>RMN:</strong> {compound.nmr}</p>
        </>
      )}
    </div>
  );
};

const SpectroscopyPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('ir');

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><ScanLine size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Espectroscopía IR y RMN</h1>
            <p className="text-text-secondary font-semibold mb-2">Interpreta espectros infrarrojos y de resonancia magnética nuclear.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Compuestos</h2>
                  <div className="flex gap-2 mb-4">
                    {COMPOUNDS.map(c => (
                      <button key={c.name} onClick={() => { setSelected(c); }}
                        className={cn("px-3 py-2 rounded-xl text-[9px] font-bold transition-all",
                          selected?.name === c.name ? 'bg-primary text-white' : 'bg-gray-50'
                        )}>{c.name}</button>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-4">
                    {['ir', 'nmr'].map(m => (
                      <button key={m} onClick={() => setMode(m)}
                        className={cn("px-4 py-2 rounded-xl text-[9px] font-bold transition-all",
                          mode === m ? 'bg-primary-dark text-white' : 'bg-gray-50'
                        )}>{m === 'ir' ? 'Espectro IR' : 'Espectro RMN'}</button>
                    ))}
                  </div>

                  {selected && (
                    <div className="relative h-40 bg-white rounded-2xl border border-gray-200 overflow-hidden p-4">
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
                      {mode === 'ir' ? (
                        <>
                          <div className="relative h-full">
                            <svg viewBox="0 0 400 100" className="w-full h-full">
                              <path d="M0,80 Q50,80 60,30 Q70,20 80,70 Q90,75 100,70 Q110,10 120,65 Q130,70 140,60 Q150,20 160,65 Q170,70 180,60 Q190,40 200,65 Q210,68 220,60 Q230,30 240,65 Q250,70 280,65 Q300,60 320,65 Q340,70 360,60 Q380,65 400,70" fill="none" stroke="#005B8F" strokeWidth="2" />
                            </svg>
                            <div className="flex justify-between text-[6px] font-bold text-gray-400 mt-1"><span>4000</span><span>3000</span><span>2000</span><span>1000</span><span>400 cm⁻¹</span></div>
                          </div>
                          <div className="absolute bottom-8 left-0 right-0 flex gap-1 justify-center">
                            {selected.peaks.map((p, i) => (
                              <div key={i} className="w-1 h-20 rounded-full" style={{ backgroundColor: selected.peakColors[i], opacity: 0.7, marginLeft: `${(p - 400) / 36}%` }} />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="relative h-full flex items-center">
                          <div className="w-full">
                            <svg viewBox="0 0 400 80" className="w-full h-full">
                              {selected.peaks.map((p, i) => (
                                <line key={i} x1={50 + i * 80} y1={70} x2={50 + i * 80} y2={10 + Math.random() * 10} stroke="#005B8F" strokeWidth="3" />
                              ))}
                              <line x1="0" y1="70" x2="400" y2="70" stroke="#DDD" strokeWidth="1" />
                            </svg>
                            <div className="flex justify-between text-[6px] font-bold text-gray-400"><span>10</span><span>8</span><span>6</span><span>4</span><span>2</span><span>0 ppm</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>

              <SpectroscopyAI compound={selected} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpectroscopyPage;
