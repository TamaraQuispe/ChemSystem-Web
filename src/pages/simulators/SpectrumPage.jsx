import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, ScanLine } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const ELEMENTS = [
  { sym: 'H', name: 'Hidrógeno', lines: [410, 434, 486, 656], colors: ['#8B3DFF', '#4361EE', '#06B6D4', '#EF4444'], desc: 'Espectro de Balmer. 4 líneas visibles características.' },
  { sym: 'He', name: 'Helio', lines: [447, 492, 501, 587, 667, 706], colors: ['#8B3DFF', '#3B82F6', '#06B6D4', '#F59E0B', '#EF4444', '#DC2626'], desc: 'Espectro rico en líneas. Gas noble con 6 líneas visibles.' },
  { sym: 'Na', name: 'Sodio', lines: [589, 589.6], colors: ['#F59E0B', '#F59E0B'], desc: 'Doblete D del sodio. Dos líneas amarillas muy cercanas a 589 nm.' },
  { sym: 'Hg', name: 'Mercurio', lines: [404, 435, 546, 578], colors: ['#8B3DFF', '#4361EE', '#06B6D4', '#F59E0B'], desc: 'Lámpara de mercurio. Líneas características de vapor de Hg.' },
];

const SpectrumAI = ({ element }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50/50 rounded-2xl border border-indigo-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-indigo-500" /><span className="text-xs font-black text-indigo-700">Espectroscopista IA</span></div>
      {element && (
        <>
          <p className="text-[10px] font-semibold text-indigo-600/80">{element.name} ({element.sym})</p>
          <p className="text-[10px] font-semibold text-indigo-600/80">{element.desc}</p>
          <p className="text-[10px] font-semibold text-indigo-600/80">Cada elemento tiene un espectro de emisión único, como una huella digital atómica.</p>
        </>
      )}
    </div>
  );
};

const SpectrumPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><ScanLine size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Espectroscopía Atómica</h1>
            <p className="text-text-secondary font-semibold mb-2">Observa las líneas de emisión características de cada elemento químico.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Elementos</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {ELEMENTS.map(el => (
                      <button key={el.sym} onClick={() => setSelected(el)}
                        className={cn("p-4 rounded-2xl border-2 text-center transition-all",
                          selected?.sym === el.sym ? 'border-primary shadow-md bg-primary/5' : 'border-gray-100'
                        )}>
                          <p className="text-lg font-black">{el.sym}</p>
                          <p className="text-[9px] font-bold text-text-secondary">{el.name}</p>
                      </button>
                    ))}
                  </div>
                </Card>

                {selected && (
                  <Card className="p-6">
                    <h2 className="text-sm font-black text-primary-dark mb-4">Espectro de Emisión</h2>
                    <p className="text-[9px] font-bold text-text-secondary mb-3">{selected.sym} · {selected.name}</p>
                    <div className="relative h-16 bg-gray-900 rounded-2xl overflow-hidden flex items-center px-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-900 via-blue-800 via-cyan-700 via-green-500 via-yellow-400 to-red-500 opacity-30" />
                      <div className="relative flex gap-2 w-full justify-center">
                        {selected.lines.map((wl, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className="w-3 h-10 rounded-full shadow-lg" style={{ backgroundColor: selected.colors[i], boxShadow: `0 0 12px ${selected.colors[i]}` }} />
                            <span className="text-[6px] font-bold text-gray-400 mt-1">{wl}nm</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              <SpectrumAI element={selected} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpectrumPage;
