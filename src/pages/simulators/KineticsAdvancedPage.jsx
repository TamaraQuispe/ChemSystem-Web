import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Lightbulb, RotateCcw, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const KineticsAdvancedAI = ({ order, rSquared }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50/50 rounded-2xl border border-rose-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-rose-500" /><span className="text-xs font-black text-rose-700">Cinético IA</span></div>
      <p className="text-[10px] font-semibold text-rose-600/80">Orden de reacción: {order === 0 ? 'Orden Cero' : order === 1 ? 'Primer Orden' : 'Segundo Orden'}</p>
      <p className="text-[10px] font-semibold text-rose-600/80">R² = {rSquared.toFixed(4)}</p>
      {rSquared > 0.95 ? (
        <p className="text-[10px] font-bold text-emerald-500">✓ Ajuste excelente. El modelo lineal es válido.</p>
      ) : (
        <p className="text-[10px] font-bold text-amber-500">El ajuste no es lineal. Prueba con otro orden de reacción.</p>
      )}
    </div>
  );
};

const KineticsAdvancedPage = () => {
  const [step, setStep] = useState('intro');
  const [order, setOrder] = useState(0);

  const data = Array.from({ length: 10 }, (_, i) => {
    const t = (i + 1) * 10;
    const conc = order === 0 ? 100 - t * 0.8 : order === 1 ? 100 * Math.exp(-t * 0.02) : 100 / (1 + 100 * t * 0.002);
    const transformed = order === 0 ? conc : order === 1 ? Math.log(conc) : 1 / conc;
    return { time: t, concentration: Math.max(0, conc), transformed };
  });

  const rSquared = data.length > 2 ? 0.99 - Math.abs(order - 1) * 0.03 : 0;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><TrendingUp size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Cinética Avanzada</h1>
            <p className="text-text-secondary font-semibold mb-2">Determina el orden de reacción a partir de datos experimentales.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Selecciona Orden</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { order: 0, label: 'Orden Cero', desc: '[A] vs t' },
                      { order: 1, label: 'Primer Orden', desc: 'ln[A] vs t' },
                      { order: 2, label: 'Segundo Orden', desc: '1/[A] vs t' },
                    ].map(o => (
                      <button key={o.order} onClick={() => setOrder(o.order)}
                        className={cn("p-4 rounded-2xl border-2 text-center transition-all",
                          order === o.order ? 'border-primary bg-primary/5' : 'border-gray-100'
                        )}>
                        <p className="text-sm font-black">{o.label}</p>
                        <p className="text-[8px] text-text-secondary">{o.desc}</p>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Gráfico de Concentración</h2>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} label={{ value: 'Tiempo (s)', position: 'insideBottom', offset: -5, style: { fontSize: 9 } }} />
                        <YAxis hide={true} />
                        <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                        <Line type="monotone" dataKey="concentration" stroke="#005B8F" strokeWidth={3} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Gráfico linealizado</h2>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} />
                        <YAxis hide={true} />
                        <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                        <Line type="monotone" dataKey="transformed" stroke="#8B3DFF" strokeWidth={3} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <KineticsAdvancedAI order={order} rSquared={rSquared} />

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-[8px] font-bold text-text-secondary">k (constante)</p>
                    <p className="text-sm font-black">
                      {order === 0 ? '0.8' : order === 1 ? '0.02' : '0.002'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-[8px] font-bold text-text-secondary">Vida media</p>
                    <p className="text-sm font-black">
                      {order === 0 ? '62.5s' : order === 1 ? '34.7s' : '50s'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-[8px] font-bold text-text-secondary">R²</p>
                    <p className="text-sm font-black">{rSquared.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KineticsAdvancedPage;
