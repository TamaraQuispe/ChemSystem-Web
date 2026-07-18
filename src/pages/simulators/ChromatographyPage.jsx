import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, ScanLine, Play } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const SAMPLES = [
  { name: 'Clorofila', colors: ['green', 'lightgreen', 'yellowgreen', 'olive'], rf: [0.25, 0.45, 0.65, 0.85] },
  { name: 'Tinta Roja', colors: ['red', 'darkred', 'pink'], rf: [0.3, 0.55, 0.8] },
  { name: 'Tinta Azul', colors: ['blue', 'skyblue', 'indigo'], rf: [0.2, 0.5, 0.75] },
  { name: 'Mezcla Verde', colors: ['green', 'blue', 'yellow'], rf: [0.35, 0.6, 0.88] },
];

const SOLVENTS = ['Agua', 'Etanol', 'Acetona', 'Hexano'];

const ChromatographyAI = ({ sample, rfValues }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-fuchsia-50 to-pink-50/50 rounded-2xl border border-fuchsia-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-fuchsia-500" /><span className="text-xs font-black text-fuchsia-700">Cromatógrafo IA</span></div>
      {sample && (
        <>
          <p className="text-[10px] font-semibold text-fuchsia-600/80">Muestra: <strong>{sample.name}</strong></p>
          <p className="text-[10px] font-semibold text-fuchsia-600/80">Componentes detectados: {sample.colors.length}</p>
          <div className="space-y-1 mt-2">
            {rfValues.map((rf, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: sample.colors[i] }} />
                <span className="text-[8px] font-semibold text-fuchsia-600">Rf = {rf.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ChromatographyPage = () => {
  const [step, setStep] = useState('intro');
  const [selectedSample, setSelectedSample] = useState(null);
  const [selectedSolvent, setSelectedSolvent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runExperiment = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setIsRunning(false); return 100; }
        return p + 2;
      });
    }, 100);
  };

  const rfValues = selectedSample
    ? selectedSample.rf.map(rf => rf * (progress / 100) * (1 + selectedSolvent * 0.05))
    : [];

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><ScanLine size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Cromatografía Simple</h1>
            <p className="text-text-secondary font-semibold mb-2">Separa los componentes de una mezcla usando cromatografía en papel. Calcula el factor Rf.</p>
            <div className="p-4 bg-fuchsia-50 rounded-2xl text-xs font-semibold text-fuchsia-600 mb-8 max-w-lg mx-auto">La cromatografía separa mezclas basándose en la diferente velocidad de migración de sus componentes.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Cromatograma</h2>
                  <div className="relative h-64 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {/* Paper background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100" />
                    {/* Solvent front */}
                    <motion.div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-200/40 to-transparent"
                      animate={{ height: `${progress}%` }} transition={{ duration: 0.3 }} />
                    {/* Sample spots */}
                    {selectedSample && rfValues.map((rf, i) => (
                      progress > 10 && (
                        <motion.div key={i} initial={{ y: 20 }} animate={{ y: `${(1 - rf) * 80 + 10}%` }}
                          className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: selectedSample.colors[i], top: `${(1 - Math.min(1, rf)) * 70 + 15}%`, opacity: progress > 20 ? 1 : 0 }}
                        />
                      )
                    ))}
                    {/* Origin line */}
                    <div className="absolute bottom-4 left-4 right-4 border-t border-dashed border-gray-300" />
                    <span className="absolute bottom-1 left-4 text-[7px] font-bold text-gray-400">Origen</span>
                    {progress >= 95 && <span className="absolute top-1 right-4 text-[7px] font-bold text-blue-400">Frente</span>}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Muestras</h2>
                  <div className="flex gap-2">
                    {SAMPLES.map(s => (
                      <button key={s.name} onClick={() => { setSelectedSample(s); setProgress(0); setIsRunning(false); }}
                        className={cn("px-4 py-2 rounded-xl text-[9px] font-bold transition-all border-2",
                          selectedSample?.name === s.name ? 'border-primary bg-primary/5' : 'border-gray-100'
                        )}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Solvente</h2>
                  <div className="space-y-2">
                    {SOLVENTS.map((s, i) => (
                      <button key={s} onClick={() => setSelectedSolvent(i)}
                        className={cn("w-full p-3 rounded-xl text-xs font-bold transition-all",
                          selectedSolvent === i ? 'bg-primary text-white' : 'bg-gray-50 text-text-secondary'
                        )}>{s}</button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <Button onClick={runExperiment} disabled={!selectedSample || isRunning}
                    className="w-full h-12 bg-primary-dark text-white rounded-2xl font-bold text-sm gap-2" isLoading={isRunning}>
                    {isRunning ? 'Corriendo...' : <><Play size={16} /> Iniciar</>}
                  </Button>
                  {progress > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-[9px] font-bold mb-1"><span>Progreso</span><span>{progress}%</span></div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </Card>

                <ChromatographyAI sample={selectedSample} rfValues={rfValues} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChromatographyPage;
