import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import {
  FlaskConical, Thermometer, Gauge, Beaker, Activity, Sparkles, ArrowRight,
  RotateCcw, Play, Pause, Clock, TrendingUp, AlertTriangle, Zap, Droplet
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Slider } from '../../components/ui/Slider';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

const STAGES = [
  { id: 'init', label: 'INICIO', status: 'completed' },
  { id: 'mixing', label: 'MEZCLA', status: 'completed' },
  { id: 'reaction', label: 'REACCIÓN', status: 'active' },
  { id: 'analysis', label: 'ANÁLISIS', status: 'locked' },
  { id: 'results', label: 'RESULTADOS', status: 'locked' },
];

const REACTANTS = [
  { id: 'h2o2', name: 'H₂O₂', label: 'Peróxido de Hidrógeno', conc: '3%', color: 'bg-blue-50 text-blue-500' },
  { id: 'ki', name: 'KI', label: 'Yoduro de Potasio', conc: '1.0 M', color: 'bg-purple-50 text-purple-500' },
  { id: 'mno2', name: 'MnO₂', label: 'Dióxido de Manganeso', conc: 'catalizador', color: 'bg-emerald-50 text-emerald-500' },
];

const ReactionRatesPage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [temperature, setTemperature] = useState(298);
  const [pressure, setPressure] = useState(1.2);
  const [concA, setConcA] = useState(0.5);
  const [concB, setConcB] = useState(0.2);
  const [reactants, setReactants] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const i = setInterval(() => setElapsed(t => t + 1), 1000);
    return () => clearInterval(i);
  }, [isRunning]);

  const rate = Math.max(0.1, Math.min(10, ((temperature / 298) ** 2) * (concA + concB) * (pressure / 1.2) * (1 + reactants.length * 0.3)));
  const conversion = Math.min(98, Math.round(rate * elapsed * 0.5));
  const activationEnergy = Math.round(45 - (temperature - 298) * 0.08);
  const kConstant = (rate * 0.01).toFixed(4);

  const chartData = Array.from({ length: 10 }, (_, i) => ({
    time: `${i * 10}s`,
    concentration: Math.min(100, (i + 1) * conversion / 10),
    rate: Math.min(100, rate * (i + 1) * 2),
  }));

  if (showIntro) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Activity size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-primary-dark mb-4">Velocidad de Reacción</h1>
          <p className="text-text-secondary font-semibold mb-4">Estudia cómo la temperatura, presión y concentración afectan la velocidad de las reacciones químicas.</p>
          <div className="p-4 bg-amber-50 rounded-2xl text-xs font-semibold text-amber-600 mb-8">La velocidad de reacción aumenta con la temperatura y la concentración de reactivos.</div>
          <Button onClick={() => setShowIntro(false)} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-primary-dark">Velocidad de Reacción</h1>
          <Badge variant="outline" className="bg-orange-50 text-orange-500 border-orange-200 text-[9px] font-bold">CINÉTICA QUÍMICA</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setReactants([]); setTemperature(298); setPressure(1.2); setConcA(0.5); setConcB(0.2); setElapsed(0); setIsRunning(false); }}
            className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all"><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Kinetic Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-primary-dark">Perfil Cinético</h2>
              <span className="text-xs font-bold text-primary">{formatTime(elapsed)}</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }} />
                  <YAxis hide={true} />
                  <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                  <Line type="monotone" dataKey="concentration" stroke="#005B8F" strokeWidth={3} dot={false} name="Conversión" />
                  <Line type="monotone" dataKey="rate" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Velocidad" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Velocidad (k)', value: kConstant, icon: TrendingUp, color: 'text-blue-500 bg-blue-50' },
              { label: 'Conversión', value: `${conversion}%`, icon: Zap, color: 'text-emerald-500 bg-emerald-50' },
              { label: 'E. Activación', value: `${activationEnergy} kJ/mol`, icon: Thermometer, color: 'text-orange-500 bg-orange-50' },
              { label: 'Tiempo', value: formatTime(elapsed), icon: Clock, color: 'text-violet-500 bg-violet-50' },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-2", m.color)}><m.icon size={16} /></div>
                <p className="text-lg font-black text-primary-dark">{m.value}</p>
                <p className="text-[9px] font-bold text-text-secondary">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Reactants */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-primary-dark">Reactivos</h2>
              <Button onClick={() => setShowAdd(!showAdd)} size="sm" className="bg-primary-dark text-white rounded-xl text-[10px] font-bold h-8 px-3"><Beaker size={14} /> Añadir</Button>
            </div>
            {reactants.length === 0 ? (
              <p className="text-xs font-semibold text-text-secondary text-center py-6">Añade reactivos para iniciar la simulación</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {reactants.map(r => (
                  <div key={r.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className={`w-2.5 h-2.5 rounded-full ${r.color.split(' ')[0]}`} />
                    <span className="text-[10px] font-bold">{r.name}</span>
                    <button onClick={() => setReactants(v => v.filter(x => x.id !== r.id))} className="p-0.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">✕</button>
                  </div>
                ))}
              </div>
            )}
            {showAdd && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                <div className="flex flex-wrap gap-2">
                  {REACTANTS.map(r => (
                    <button key={r.id} onClick={() => { setReactants(v => [...v, r]); setShowAdd(false); }}
                      className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-primary/30 text-xs font-bold transition-all">{r.name} — {r.label}</button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Controls Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-black text-primary-dark mb-4">Parámetros</h2>
            <div className="space-y-5">
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">Temperatura</span><span className="text-xs font-black text-primary-dark">{temperature} K</span></div><Slider min={273} max={500} value={temperature} onChange={setTemperature} /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">Presión</span><span className="text-xs font-black text-primary-dark">{pressure} atm</span></div><Slider min={0.5} max={3} step={0.1} value={pressure} onChange={setPressure} /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">[Reactivo A]</span><span className="text-xs font-black text-primary-dark">{concA} M</span></div><Slider min={0.1} max={2} step={0.1} value={concA} onChange={setConcA} /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-[10px] font-bold text-text-secondary">[Reactivo B]</span><span className="text-xs font-black text-primary-dark">{concB} M</span></div><Slider min={0.1} max={2} step={0.1} value={concB} onChange={setConcB} /></div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-black text-primary-dark mb-4">Control</h2>
            <Button onClick={() => setIsRunning(!isRunning)} className="w-full h-12 bg-primary-dark text-white rounded-2xl font-bold text-sm gap-2 mb-3">
              {isRunning ? <Pause size={18} /> : <Play size={18} />}{isRunning ? 'Pausar' : 'Iniciar'}
            </Button>
            <div className="space-y-2">
              {STAGES.map(s => (
                <div key={s.id} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-bold",
                  s.status === 'active' ? 'bg-primary/10 text-primary' : s.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'
                )}>
                  <div className={cn("w-2 h-2 rounded-full", s.status === 'active' ? 'bg-primary' : s.status === 'completed' ? 'bg-emerald-400' : 'bg-gray-300')} />
                  {s.label}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-transparent border-orange-100">
            <Sparkles size={20} className="text-orange-500 mb-2" />
            <p className="text-[10px] font-bold text-text-secondary leading-relaxed">La velocidad de reacción se duplica aproximadamente por cada 10°C de aumento de temperatura (Regla de Arrhenius).</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default ReactionRatesPage;
