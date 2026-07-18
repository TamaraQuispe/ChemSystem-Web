import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Lightbulb, RotateCcw, FlaskConical, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const StoichiometryAI = ({ data }) => {
  const { mass, molarMass, moles, theoretical, actual, limiting } = data;
  const yieldPct = theoretical > 0 ? Math.round((actual / theoretical) * 100) : 0;
  return (
    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-emerald-500" /><span className="text-xs font-black text-emerald-700">Calculadora Estequiométrica</span></div>
      {molarMass > 0 && (
        <>
          <p className="text-[10px] font-semibold text-emerald-600/80">{mass}g / {molarMass} g/mol = <strong>{moles.toFixed(2)} moles</strong></p>
          <p className="text-[10px] font-semibold text-emerald-600/80">Rendimiento teórico: <strong>{theoretical.toFixed(2)}g</strong></p>
          {actual > 0 && <p className="text-[10px] font-semibold text-emerald-600/80">Rendimiento real: <strong>{actual.toFixed(2)}g</strong> ({yieldPct}%)</p>}
          {yieldPct < 90 && actual > 0 && <p className="text-[10px] font-bold text-amber-500">El rendimiento está por debajo del 90%. Posibles pérdidas en la transferencia o reacciones secundarias.</p>}
          {limiting && <p className="text-[10px] font-bold text-blue-500">Reactivo limitante detectado: {limiting}</p>}
        </>
      )}
    </div>
  );
};

const StoichiometryPage = () => {
  const [step, setStep] = useState('intro');
  const [mass, setMass] = useState(10);
  const [molarMass, setMolarMass] = useState(100);
  const [actualYield, setActualYield] = useState(0);
  const [reactionType, setReactionType] = useState('combustion');

  const moles = mass / molarMass;
  const theoretical = moles * molarMass * 0.85;
  const data = { mass, molarMass, moles, theoretical: Math.round(theoretical * 100) / 100, actual: actualYield, limiting: theoretical > 0 ? 'Reactivo A' : null };

  const chartData = [
    { name: 'Teórico', value: Math.round(theoretical) },
    { name: 'Real', value: actualYield },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl"><FlaskConical size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Estequiometría Interactiva</h1>
            <p className="text-text-secondary font-semibold mb-2">Calcula moles, masas y rendimientos de reacciones químicas.</p>
            <div className="p-4 bg-emerald-50 rounded-2xl text-xs font-semibold text-emerald-600 mb-8 max-w-lg mx-auto">La estequiometría relaciona las cantidades de reactivos y productos en una reacción química.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-2"><button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Datos del experimento</h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">Masa del reactivo (g)</span><span className="text-xs font-black text-primary-dark">{mass}g</span></div>
                    <input type="range" min="1" max="100" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">Masa molar (g/mol)</span><span className="text-xs font-black text-primary-dark">{molarMass} g/mol</span></div>
                    <input type="range" min="18" max="300" value={molarMass} onChange={e => setMolarMass(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">Rendimiento real (g)</span><span className="text-xs font-black text-primary-dark">{actualYield}g</span></div>
                    <input type="range" min="0" max={Math.round(theoretical) + 10} value={actualYield} onChange={e => setActualYield(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Resultados</h2>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }} />
                      <YAxis hide={true} />
                      <Tooltip cursor={{ fill: 'transparent' }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48}>
                        <rect key="a" fill="#005B8F" />
                        <rect key="b" fill="#78F0C4" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-xl"><p className="text-lg font-black text-blue-500">{moles.toFixed(2)}</p><p className="text-[8px] font-bold text-text-secondary">Moles</p></div>
                  <div className="text-center p-3 bg-emerald-50 rounded-xl"><p className="text-lg font-black text-emerald-500">{Math.round(theoretical)}g</p><p className="text-[8px] font-bold text-text-secondary">Teórico</p></div>
                  <div className="text-center p-3 bg-amber-50 rounded-xl"><p className="text-lg font-black text-amber-500">{actualYield > 0 ? Math.round((actualYield / theoretical) * 100) : 0}%</p><p className="text-[8px] font-bold text-text-secondary">Rendimiento</p></div>
                </div>
              </Card>
            </div>

            <StoichiometryAI data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoichiometryPage;
