import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Lightbulb, RotateCcw, Wind, Play, Pause, Gauge, Thermometer } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const GasLawsAI = ({ P, V, T, n }) => {
  const pv = (P * V).toFixed(2);
  const nrt = (n * 0.0821 * T).toFixed(2);
  const diff = Math.abs(parseFloat(pv) - parseFloat(nrt));
  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-2xl border border-sky-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-sky-500" /><span className="text-xs font-black text-sky-700">Ley de los Gases Ideales</span></div>
      <p className="text-[10px] font-semibold text-sky-600/80">PV = nRT</p>
      <p className="text-[10px] font-semibold text-sky-600/80">PV = {pv} · nRT = {nrt}</p>
      {diff < 1 ? (
        <p className="text-[10px] font-bold text-emerald-500">✓ La ley se cumple. PV ≈ nRT</p>
      ) : (
        <p className="text-[10px] font-bold text-amber-500">PV y nRT difieren en {diff.toFixed(2)}. Revisa los valores.</p>
      )}
    </div>
  );
};

const GasLawsPage = () => {
  const [step, setStep] = useState('intro');
  const [P, setP] = useState(1.0);
  const [V, setV] = useState(24.5);
  const [T, setT] = useState(298);
  const [n, setN] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const chartData = Array.from({ length: 11 }, (_, i) => ({
    V: (10 + i * 4).toFixed(0),
    P: (n * 0.0821 * T) / (10 + i * 4),
  }));

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setT(t => Math.min(500, t + 5)), 500);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Wind size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Leyes de los Gases</h1>
            <p className="text-text-secondary font-semibold mb-2">Relaciona presión, volumen, temperatura y cantidad de gas con la ecuación PV=nRT.</p>
            <div className="p-4 bg-sky-50 rounded-2xl text-xs font-semibold text-sky-600 mb-8 max-w-lg mx-auto">PV = nRT — La ecuación de estado del gas ideal relaciona las cuatro variables fundamentales.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-2"><button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Relación P-V (Ley de Boyle)</h2>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="V" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} label={{ value: 'Volumen (L)', position: 'insideBottom', offset: -5, style: { fontSize: 10 } }} />
                        <YAxis hide={true} />
                        <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                        <Line type="hyperbola" dataKey="P" stroke="#005B8F" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Variables del gas</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Presión (atm)</span><span className="text-xs font-black">{P.toFixed(1)}</span></div><input type="range" min="0.5" max="3" step="0.1" value={P} onChange={e => setP(Number(e.target.value))} className="w-full accent-primary" /></div>
                    <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Volumen (L)</span><span className="text-xs font-black">{V.toFixed(1)}</span></div><input type="range" min="5" max="50" step="0.5" value={V} onChange={e => setV(Number(e.target.value))} className="w-full accent-primary" /></div>
                    <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Temperatura (K)</span><span className="text-xs font-black">{T}</span></div><input type="range" min="200" max="500" value={T} onChange={e => setT(Number(e.target.value))} className="w-full accent-primary" /></div>
                    <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Cantidad (mol)</span><span className="text-xs font-black">{n}</span></div><input type="range" min="0.1" max="3" step="0.1" value={n} onChange={e => setN(Number(e.target.value))} className="w-full accent-primary" /></div>
                  </div>
                  <Button onClick={() => setIsRunning(!isRunning)} className="mt-4 w-full h-10 bg-primary-dark text-white rounded-2xl font-bold text-xs gap-2">
                    {isRunning ? <Pause size={14} /> : <Play size={14} />}{isRunning ? 'Pausar calentamiento' : 'Calentar gas'}
                  </Button>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Estado actual</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Presión', value: `${P.toFixed(1)} atm`, icon: Gauge, color: 'text-red-500 bg-red-50' },
                      { label: 'Volumen', value: `${V.toFixed(1)} L`, icon: Wind, color: 'text-blue-500 bg-blue-50' },
                      { label: 'Temperatura', value: `${T} K`, icon: Thermometer, color: 'text-orange-500 bg-orange-50' },
                    ].map((m, i) => (
                      <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl", m.color)}>
                        <m.icon size={18} />
                        <div><p className="text-xs font-black">{m.value}</p><p className="text-[8px] font-bold opacity-70">{m.label}</p></div>
                      </div>
                    ))}
                  </div>
                </Card>

                <GasLawsAI P={P} V={V} T={T} n={n} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GasLawsPage;
