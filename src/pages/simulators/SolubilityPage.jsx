import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Lightbulb, RotateCcw, Sparkles, Droplets } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const SOLUTES = [
  { name: 'NaCl', label: 'Cloruro de Sodio', color: 'text-blue-500' },
  { name: 'KNO₃', label: 'Nitrato de Potasio', color: 'text-purple-500' },
  { name: 'NaNO₃', label: 'Nitrato de Sodio', color: 'text-orange-500' },
  { name: 'KCl', label: 'Cloruro de Potasio', color: 'text-emerald-500' },
  { name: 'NH₄Cl', label: 'Cloruro de Amonio', color: 'text-red-500' },
];

const SolubilityAI = ({ solute, temp, conc, solubility }) => {
  const saturated = conc >= solubility;
  return (
    <div className="p-4 bg-gradient-to-br from-cyan-50 to-sky-50/50 rounded-2xl border border-cyan-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-cyan-500" /><span className="text-xs font-black text-cyan-700">Analista de Solubilidad</span></div>
      {solute && (
        <>
          <p className="text-[10px] font-semibold text-cyan-600/80">Soluto: <strong>{solute}</strong></p>
          <p className="text-[10px] font-semibold text-cyan-600/80">Solubilidad a {temp}°C: <strong>{solubility.toFixed(1)} g/100mL</strong></p>
          {saturated
            ? <p className="text-[10px] font-bold text-amber-500">⚠ La disolución está saturada. Se observará precipitación.</p>
            : <p className="text-[10px] font-bold text-emerald-500">✓ Disolución insaturada. Todo el soluto se disuelve.</p>}
        </>
      )}
    </div>
  );
};

const SolubilityPage = () => {
  const [step, setStep] = useState('intro');
  const [selectedSolute, setSelectedSolute] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const [concentration, setConcentration] = useState(20);

  const solute = SOLUTES[selectedSolute];
  const solubility = 10 + temperature * (selectedSolute + 1) * 0.3;
  const saturated = concentration >= solubility;

  const curveData = Array.from({ length: 11 }, (_, i) => ({
    temp: i * 10,
    solubility: 10 + i * 10 * (selectedSolute + 1) * 0.3,
  }));

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center mx-auto mb-6 shadow-xl"><Droplets size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Curvas de Solubilidad</h1>
            <p className="text-text-secondary font-semibold mb-2">Analiza cómo la temperatura afecta la solubilidad de diferentes sales en agua.</p>
            <div className="p-4 bg-cyan-50 rounded-2xl text-xs font-semibold text-cyan-600 mb-8 max-w-lg mx-auto">La solubilidad indica la máxima cantidad de soluto que se puede disolver en un solvente a una temperatura dada.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-2"><button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Curva de solubilidad</h2>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={curveData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="temp" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} label={{ value: 'Temperatura (°C)', position: 'insideBottom', offset: -5, style: { fontSize: 10 } }} />
                        <YAxis hide={true} />
                        <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                        <Line type="monotone" dataKey="solubility" stroke="#005B8F" strokeWidth={3} dot={{ r: 4, fill: '#005B8F' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span className="text-[9px] font-bold text-text-secondary">Curva de {solute.name}</span>
                    {saturated && (
                      <span className="ml-auto px-2 py-0.5 bg-amber-50 text-amber-500 rounded text-[8px] font-bold">
                        ● Precipitado detectado
                      </span>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Selecciona el soluto</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {SOLUTES.map((s, i) => (
                      <button key={i} onClick={() => { setSelectedSolute(i); setConcentration(20); }}
                        className={cn("p-4 rounded-2xl border-2 text-center transition-all", s.color,
                          selectedSolute === i ? 'border-current shadow-md' : 'border-gray-100'
                        )}>
                        <p className="text-sm font-black">{s.name}</p>
                        <p className="text-[8px] font-bold opacity-70">{s.label}</p>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Parámetros</h2>
                  <div className="space-y-5">
                    <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Temperatura</span><span className="text-xs font-black">{temperature}°C</span></div><input type="range" min="0" max="100" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full accent-primary" /></div>
                    <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Concentración</span><span className="text-xs font-black">{concentration} g/100mL</span></div><input type="range" min="0" max="150" value={concentration} onChange={e => setConcentration(Number(e.target.value))} className="w-full accent-primary" /></div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-text-main text-center">{solute.name}</p>
                    <div className="flex justify-between text-[9px] font-semibold"><span>Solubilidad:</span><span>{solubility.toFixed(1)} g/100mL</span></div>
                    <div className="flex justify-between text-[9px] font-semibold"><span>Concentración:</span><span>{concentration} g/100mL</span></div>
                    <div className={cn("text-[10px] font-bold text-center py-2 rounded-xl", saturated ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500')}>
                      {saturated ? 'Saturado' : 'Insaturado'}
                    </div>
                  </div>
                </Card>

                <SolubilityAI solute={solute.name} temp={temperature} conc={concentration} solubility={solubility} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolubilityPage;
