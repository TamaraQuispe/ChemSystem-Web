import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Lightbulb, RotateCcw, Radio, Zap } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const ISOTOPES = [
  { name: 'Uranio-238', sym: '²³⁸U', halfLife: 4.5e9, unit: 'años', type: 'α', initial: 1000 },
  { name: 'Carbono-14', sym: '¹⁴C', halfLife: 5730, unit: 'años', type: 'β', initial: 1000 },
  { name: 'Tecnecio-99m', sym: '⁹⁹ᵐTc', halfLife: 6, unit: 'horas', type: 'γ', initial: 1000 },
  { name: 'Yodo-131', sym: '¹³¹I', halfLife: 8, unit: 'días', type: 'β', initial: 1000 },
  { name: 'Polonio-210', sym: '²¹⁰Po', halfLife: 138, unit: 'días', type: 'α', initial: 1000 },
];

const NuclearAI = ({ isotope, remaining, halfLives }) => {
  const activity = remaining;
  return (
    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-2xl border border-orange-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-orange-500" /><span className="text-xs font-black text-orange-700">Físico Nuclear IA</span></div>
      {isotope && (
        <>
          <p className="text-[10px] font-semibold text-orange-600/80">{isotope.name} ({isotope.sym})</p>
          <p className="text-[10px] font-semibold text-orange-600/80">Decaimiento {isotope.type} · Vida media: {isotope.halfLife} {isotope.unit}</p>
          <p className="text-[10px] font-semibold text-orange-600/80">Restante: {remaining.toFixed(1)} · {halfLives.toFixed(1)} vidas medias transcurridas</p>
        </>
      )}
    </div>
  );
};

const NuclearPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || !selected) return;
    const interval = setInterval(() => setElapsed(e => e + 1), 200);
    return () => clearInterval(interval);
  }, [isRunning, selected]);

  const halfLives = selected ? elapsed / selected.halfLife : 0;
  const remaining = selected ? selected.initial * Math.pow(0.5, halfLives) : 0;
  const decayed = selected ? selected.initial - remaining : 0;

  const decayData = Array.from({ length: 20 }, (_, i) => ({
    t: (i / 20) * (selected?.halfLife || 1) * 5,
    N: selected ? selected.initial * Math.pow(0.5, (i / 20) * 5) : 0,
  }));

  const particles = Array.from({ length: Math.min(20, Math.floor(decayed / 50)) }, (_, i) => ({
    id: i, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10,
  }));

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Radio size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Química Nuclear</h1>
            <p className="text-text-secondary font-semibold mb-2">Simula decaimientos radiactivos y calcula la actividad restante.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Isótopos</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {ISOTOPES.map(iso => (
                      <button key={iso.name} onClick={() => { setSelected(iso); setElapsed(0); setIsRunning(false); }}
                        className={cn("p-3 rounded-2xl border-2 text-center transition-all",
                          selected?.name === iso.name ? 'border-primary shadow-md' : 'border-gray-100'
                        )}>
                        <p className="text-xs font-black">{iso.sym}</p>
                        <p className="text-[7px] text-text-secondary">{iso.halfLife} {iso.unit}</p>
                        <p className="text-[7px] font-bold">{iso.type}</p>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Decaimiento</h2>
                  <div className="relative h-40 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                    {particles.map(p => (
                      <motion.div key={p.id} initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 0, scale: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-2 h-2 rounded-full bg-yellow-400"
                        style={{ left: `${p.x}%`, top: `${p.y}%` }} />
                    ))}
                    <div className="absolute bottom-2 left-2 text-[8px] font-bold text-gray-400">
                      {isRunning ? 'Decaimiendo...' : 'Detenido'} · {particles.length} eventos
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => setIsRunning(!isRunning)} className="flex-1 bg-primary-dark text-white rounded-2xl font-bold text-xs h-10">
                      {isRunning ? 'Detener' : <><Zap size={14} /> Iniciar</>}
                    </Button>
                    <Button onClick={() => { setElapsed(0); setIsRunning(false); }} variant="outline" className="rounded-2xl font-bold text-xs h-10">
                      <RotateCcw size={14} />
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Curva de Decaimiento</h2>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={decayData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 8, fontWeight: 700 }} />
                        <YAxis hide={true} />
                        <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                        <Line type="monotone" dataKey="N" stroke="#F59E0B" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <NuclearAI isotope={selected} remaining={remaining} halfLives={halfLives} />

                {selected && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-[8px] font-bold text-text-secondary">Inicial</p>
                      <p className="text-sm font-black">{selected.initial}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-[8px] font-bold text-text-secondary">Restante</p>
                      <p className="text-sm font-black">{Math.round(remaining)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NuclearPage;
