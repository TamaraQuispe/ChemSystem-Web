import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FlaskConical, Thermometer, Beaker, Activity, Sparkles, ArrowRight,
  RotateCcw, Play, Pause, TrendingUp, AlertTriangle, Scale, Droplet
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Slider } from '../../components/ui/Slider';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

const EquilibriumPage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [temperature, setTemperature] = useState(298);
  const [concA, setConcA] = useState(1.0);
  const [concB, setConcB] = useState(1.0);
  const [concC, setConcC] = useState(0.5);
  const [isRunning, setIsRunning] = useState(false);

  const Keq = Math.exp(-(12000 / 8.314) * (1 / temperature - 1 / 298));
  const Q = (concC) / (concA * concB);
  const shiftDirection = Q < Keq ? '→ Productos' : Q > Keq ? '← Reactivos' : '⚖ Equilibrio';
  const shiftColor = Q < Keq ? 'text-emerald-500' : Q > Keq ? 'text-amber-500' : 'text-blue-500';

  const bars = [
    { name: 'A', value: concA, fill: '#005B8F' },
    { name: 'B', value: concB, fill: '#78F0C4' },
    { name: 'C', value: concC, fill: '#F59E0B' },
  ];

  if (showIntro) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Scale size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-primary-dark mb-4">Equilibrio Químico</h1>
          <p className="text-text-secondary font-semibold mb-4">Explora el Principio de Le Chatelier modificando concentraciones y temperatura.</p>
          <div className="p-4 bg-teal-50 rounded-2xl text-xs font-semibold text-teal-600 mb-8">Al cambiar las condiciones, el sistema se desplaza para contrarrestar la perturbación.</div>
          <Button onClick={() => setShowIntro(false)} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-primary-dark">Equilibrio Químico</h1>
          <Badge variant="outline" className="bg-teal-50 text-teal-500 border-teal-200 text-[9px] font-bold">LE CHATELIER</Badge>
        </div>
        <button onClick={() => { setTemperature(298); setConcA(1); setConcB(1); setConcC(0.5); setIsRunning(false); }}
          className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all"><RotateCcw size={18} /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Equilibrium visualization */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-primary-dark">A + B ⇌ C</h2>
              <div className={cn("text-xs font-black px-3 py-1.5 rounded-xl", shiftColor)}>{shiftDirection}</div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bars} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 14, fontWeight: 700 }} />
                  <YAxis hide={true} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={48}>
                    {bars.map((e, i) => <rect key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* K vs Q */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'K (constante)', value: Keq.toFixed(4), icon: Scale, color: 'text-blue-500 bg-blue-50' },
              { label: 'Q (cociente)', value: Q.toFixed(4), icon: Activity, color: 'text-violet-500 bg-violet-50' },
              { label: 'Desplazamiento', value: shiftDirection, icon: ArrowRight, color: shiftColor.replace('text-', 'bg-').split(' ')[0] || 'bg-gray-50', iconColor: shiftColor },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", m.color)}><m.icon size={20} className={m.iconColor || m.color.split(' ')[0]} /></div>
                <p className={cn("text-lg font-black", m.iconColor || 'text-primary-dark')}>{m.value}</p>
                <p className="text-[10px] font-bold text-text-secondary">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-black text-primary-dark mb-4">Parámetros</h2>
            <div className="space-y-5">
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">Temperatura</span><span className="text-xs font-black text-primary-dark">{temperature} K</span></div><Slider min={273} max={500} value={temperature} onChange={setTemperature} /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">[A]</span><span className="text-xs font-black text-primary-dark">{concA.toFixed(1)} M</span></div><Slider min={0.1} max={3} step={0.1} value={concA} onChange={setConcA} /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">[B]</span><span className="text-xs font-black text-primary-dark">{concB.toFixed(1)} M</span></div><Slider min={0.1} max={3} step={0.1} value={concB} onChange={setConcB} /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">[C]</span><span className="text-xs font-black text-primary-dark">{concC.toFixed(1)} M</span></div><Slider min={0.1} max={3} step={0.1} value={concC} onChange={setConcC} /></div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-black text-primary-dark mb-4">Indicadores</h2>
            <div className="space-y-3">
              {[
                { label: 'K > 1', desc: 'Productos favorecidos', active: Keq > 1 },
                { label: 'K < 1', desc: 'Reactivos favorecidos', active: Keq < 1 },
                { label: 'ΔH > 0', desc: 'Endotérmico (T ↑ → K ↑)', active: temperature > 350 },
                { label: 'ΔH < 0', desc: 'Exotérmico (T ↑ → K ↓)', active: temperature < 298 },
              ].map((item, i) => (
                <div key={i} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all",
                  item.active ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-gray-50 text-gray-400'
                )}>
                  <div className={cn("w-2 h-2 rounded-full", item.active ? 'bg-emerald-400' : 'bg-gray-300')} />
                  <div><p className="font-black">{item.label}</p><p className="font-semibold text-[9px]">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-teal-50 to-transparent border-teal-100">
            <Sparkles size={20} className="text-teal-500 mb-2" />
            <p className="text-[10px] font-bold text-text-secondary leading-relaxed">Principio de Le Chatelier: un cambio en temperatura, presión o concentración desplaza el equilibrio para contrarrestar el cambio.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EquilibriumPage;
