import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Lightbulb, RotateCcw, Thermometer, FlaskConical } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const CalorimetryAI = ({ m1, T1, m2, T2, Teq }) => {
  const c = 4.184;
  const q1 = m1 * c * (Teq - T1);
  const q2 = m2 * c * (Teq - T2);
  const diff = Math.abs(q1 + q2);
  return (
    <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50/50 rounded-2xl border border-red-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-red-500" /><span className="text-xs font-black text-red-700">Calorímetro IA</span></div>
      <p className="text-[10px] font-semibold text-red-600/80">Calor ganado: {q1.toFixed(1)} J · Calor perdido: {Math.abs(q2).toFixed(1)} J</p>
      {diff < 50 ? (
        <p className="text-[10px] font-bold text-emerald-500">✓ Conservación de la energía. Q₁ + Q₂ ≈ 0</p>
      ) : (
        <p className="text-[10px] font-bold text-amber-500">Hay una diferencia de {diff.toFixed(1)} J. Revisa los valores.</p>
      )}
    </div>
  );
};

const CalorimetryPage = () => {
  const [step, setStep] = useState('intro');
  const [m1, setM1] = useState(100);
  const [T1, setT1] = useState(80);
  const [m2, setM2] = useState(100);
  const [T2, setT2] = useState(20);
  const [mixed, setMixed] = useState(false);

  const Teq = (m1 * T1 + m2 * T2) / (m1 + m2);

  const tempData = Array.from({ length: 11 }, (_, i) => ({
    time: `${i * 6}s`,
    T1: T1 - (T1 - Teq) * (i / 10),
    T2: T2 + (Teq - T2) * (i / 10),
    Teq: Teq,
  }));

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Thermometer size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Calorimetría Virtual</h1>
            <p className="text-text-secondary font-semibold mb-2">Mezcla agua a diferentes temperaturas y calcula el calor transferido.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Muestra 1 (Agua caliente)</h2>
                  <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Masa</span><span className="text-xs font-black">{m1}g</span></div><input type="range" min="20" max="200" value={m1} onChange={e => setM1(Number(e.target.value))} className="w-full accent-red-500" /></div>
                  <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Temperatura</span><span className="text-xs font-black">{T1}°C</span></div><input type="range" min="30" max="100" value={T1} onChange={e => setT1(Number(e.target.value))} className="w-full accent-red-500" /></div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Muestra 2 (Agua fría)</h2>
                  <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Masa</span><span className="text-xs font-black">{m2}g</span></div><input type="range" min="20" max="200" value={m2} onChange={e => setM2(Number(e.target.value))} className="w-full accent-blue-500" /></div>
                  <div><div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Temperatura</span><span className="text-xs font-black">{T2}°C</span></div><input type="range" min="0" max="40" value={T2} onChange={e => setT2(Number(e.target.value))} className="w-full accent-blue-500" /></div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Calorímetro</h2>
                  <div className={cn("h-40 rounded-3xl border-2 flex items-center justify-center transition-all", mixed ? 'border-emerald-300 bg-gradient-to-b from-orange-50 to-blue-50' : 'border-gray-200 bg-gray-50')}>
                    <div className="text-center">
                      {mixed ? (
                        <>
                          <p className="text-4xl font-black text-primary-dark">{Teq.toFixed(1)}°C</p>
                          <p className="text-[9px] font-bold text-text-secondary">Temperatura de equilibrio</p>
                        </>
                      ) : (
                        <p className="text-xs font-bold text-text-secondary">Haz clic en "Mezclar"</p>
                      )}
                    </div>
                  </div>
                  <Button onClick={() => setMixed(true)} className="mt-4 w-full h-11 bg-primary-dark text-white rounded-2xl font-bold text-sm">
                    <FlaskConical size={16} /> Mezclar
                  </Button>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Evolución Térmica</h2>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tempData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 8, fontWeight: 700 }} />
                        <YAxis hide={true} />
                        <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                        <Line type="monotone" dataKey="T1" stroke="#EF4444" strokeWidth={2} dot={false} name="Agua caliente" />
                        <Line type="monotone" dataKey="T2" stroke="#3B82F6" strokeWidth={2} dot={false} name="Agua fría" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {mixed && <CalorimetryAI m1={m1} T1={T1} m2={m2} T2={T2} Teq={Teq} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalorimetryPage;
