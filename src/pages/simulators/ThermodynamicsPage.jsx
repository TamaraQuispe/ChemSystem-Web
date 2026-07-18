import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import {
  FlaskConical, Thermometer, Gauge, Activity, Sparkles, ArrowRight,
  RotateCcw, Play, Pause, TrendingUp, Zap, Flame, Wind, Droplet
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Slider } from '../../components/ui/Slider';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

const ThermodynamicsPage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [temperature, setTemperature] = useState(298);
  const [pressure, setPressure] = useState(1.0);
  const [entropyBase, setEntropyBase] = useState(150);
  const [isRunning, setIsRunning] = useState(false);

  const deltaH = -285 + (temperature - 298) * 0.05;
  const deltaS = entropyBase + Math.log(pressure) * 10;
  const deltaG = deltaH - temperature * (deltaS / 1000);
  const spontaneity = deltaG < 0 ? 'Espontáneo' : deltaG > 0 ? 'No Espontáneo' : 'En Equilibrio';
  const spontColor = deltaG < 0 ? 'text-emerald-500' : deltaG > 0 ? 'text-red-500' : 'text-amber-500';

  const energyData = [
    { name: 'Reactivos', energía: 0 },
    { name: 'E. Activación', energía: 45 - (temperature - 298) * 0.05 },
    { name: 'Productos', energía: deltaH },
  ];

  const chartData = Array.from({ length: 7 }, (_, i) => ({
    temp: 250 + i * 50,
    deltaG: (-285 - (250 + i * 50 - 298) * 0.05) - (250 + i * 50) * (entropyBase / 1000),
  }));

  if (showIntro) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Flame size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-primary-dark mb-4">Termodinámica</h1>
          <p className="text-text-secondary font-semibold mb-4">Analiza la energía involucrada en las reacciones químicas: entalpía, entropía y energía libre de Gibbs.</p>
          <div className="p-4 bg-red-50 rounded-2xl text-xs font-semibold text-red-600 mb-8">ΔG = ΔH − TΔS — Una reacción es espontánea cuando ΔG &lt; 0.</div>
          <Button onClick={() => setShowIntro(false)} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-primary-dark">Termodinámica</h1>
          <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200 text-[9px] font-bold">GIBBS · ENTALPÍA · ENTROPÍA</Badge>
        </div>
        <button onClick={() => { setTemperature(298); setPressure(1.0); setEntropyBase(150); setIsRunning(false); }}
          className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all"><RotateCcw size={18} /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Energy Profile */}
          <Card className="p-6">
            <h2 className="text-sm font-black text-primary-dark mb-4">Perfil Energético</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }} />
                  <YAxis hide={true} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="energía" radius={[10, 10, 0, 0]} barSize={40}>
                    {energyData.map((e, i) => (
                      <rect key={i} fill={e.energía <= 0 ? '#005B8F' : '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* ΔG vs Temperature */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-primary-dark">ΔG vs Temperatura</h2>
              <span className={cn("text-xs font-black", spontColor)}>{spontaneity}</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="temp" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }} />
                  <YAxis hide={true} />
                  <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                  <Line type="monotone" dataKey="deltaG" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'ΔH (Entalpía)', value: `${deltaH.toFixed(1)} kJ/mol`, icon: Flame, color: 'text-red-500 bg-red-50' },
              { label: 'ΔS (Entropía)', value: `${deltaS.toFixed(1)} J/K·mol`, icon: Wind, color: 'text-blue-500 bg-blue-50' },
              { label: 'ΔG (Gibbs)', value: `${deltaG.toFixed(1)} kJ/mol`, icon: Zap, color: spontColor.replace('text-', 'bg-') + ' ' + spontColor },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", m.color.split(' ').slice(0, 2).join(' '))}><m.icon size={20} className={m.color.split(' ').slice(-1)[0] || 'text-primary-dark'} /></div>
                <p className={cn("text-lg font-black", spontColor)}>{m.value}</p>
                <p className="text-[10px] font-bold text-text-secondary">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-black text-primary-dark mb-4">Parámetros</h2>
            <div className="space-y-5">
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">Temperatura</span><span className="text-xs font-black text-primary-dark">{temperature} K</span></div><Slider min={250} max={500} value={temperature} onChange={setTemperature} /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">Presión</span><span className="text-xs font-black text-primary-dark">{pressure.toFixed(1)} atm</span></div><Slider min={0.5} max={3} step={0.1} value={pressure} onChange={setPressure} /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">Entropía base</span><span className="text-xs font-black text-primary-dark">{entropyBase} J/K·mol</span></div><Slider min={50} max={300} value={entropyBase} onChange={setEntropyBase} /></div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-black text-primary-dark mb-4">Predicción</h2>
            <div className={cn("p-4 rounded-2xl text-xs font-bold text-center", spontColor.replace('text-', 'bg-').split(' ')[0] + '/10 ' + spontColor)}>
              {spontaneity}
            </div>
            <div className="mt-4 space-y-2">
              {[
                { label: 'ΔH < 0, ΔS > 0', desc: 'Espontáneo a toda T', active: deltaH < 0 && deltaS > 0 },
                { label: 'ΔH > 0, ΔS < 0', desc: 'No espontáneo a toda T', active: deltaH > 0 && deltaS < 0 },
                { label: 'ΔH < 0, ΔS < 0', desc: 'Espontáneo a baja T', active: deltaH < 0 && deltaS < 0 },
                { label: 'ΔH > 0, ΔS > 0', desc: 'Espontáneo a alta T', active: deltaH > 0 && deltaS > 0 },
              ].map((item, i) => (
                <div key={i} className={cn("flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-bold transition-all",
                  item.active ? 'bg-primary/5 text-primary border border-primary/10' : 'bg-gray-50 text-gray-400'
                )}>
                  <div className={cn("w-2 h-2 rounded-full", item.active ? 'bg-primary' : 'bg-gray-300')} />
                  <span>{item.label} — {item.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThermodynamicsPage;
