import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, ZoomIn, LayoutGrid, Download, Trash2, Plus, HelpCircle, Sparkles, ArrowRight, Play, Pause,
  Info, Check, Zap, Layers, Network, Headphones, Video, Flame, FlaskConical, BookOpen, AlertTriangle
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Slider } from '../../components/ui/Slider';
import { Progress } from '../../components/ui/Progress';
import api from '../../services/api';

const STOCK_REACTIVES = [
  { id: 'h2so4', name: 'H₂SO₄', desc: 'Ácido Sulfúrico', conc: '98%', color: 'bg-blue-500 text-blue-500' },
  { id: 'kmno4', name: 'KMnO₄', desc: 'Permanganato de Potasio', conc: '0.1 M', color: 'bg-emerald-500 text-emerald-500' },
  { id: 'naoh', name: 'NaOH', desc: 'Hidróxido de Sodio', conc: '2.0 M', color: 'bg-purple-500 text-purple-500' },
];

const TIMELINE_STAGES = [
  { id: 'mixture', label: 'MEZCLA', status: 'completed' },
  { id: 'activation', label: 'ACTIVACIÓN', status: 'completed' },
  { id: 'transition', label: 'TRANSICIÓN', status: 'active' },
  { id: 'product', label: 'PRODUCTO', status: 'locked' },
  { id: 'equilibrium', label: 'EQUILIBRIO', status: 'locked' },
];

const ElectrolysisPage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [temperature, setTemperature] = useState(298);
  const [pressure, setPressure] = useState(1.2);
  const [concA, setConcA] = useState(0.5);
  const [concB, setConcB] = useState(0.2);
  const [reactives, setReactives] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showAddReactive, setShowAddReactive] = useState(false);
  const [experimentId, setExperimentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!showIntro) {
      api.get('/experiments/active/current').then(r => {
        const exp = r.data?.experiment || r.data;
        if (exp?.id) {
          setExperimentId(exp.id);
          if (exp.temperature) setTemperature(Number(exp.temperature));
          if (exp.pressure) setPressure(Number(exp.pressure));
          if (exp.conc_a) setConcA(Number(exp.conc_a));
          if (exp.conc_b) setConcB(Number(exp.conc_b));
        }
      }).catch(() => {});
    }
  }, [showIntro]);

  const saveExperiment = async () => {
    if (!experimentId) return;
    setSaving(true);
    try {
      await api.put(`/experiments/${experimentId}`, { temperature, pressure, conc_a: concA, conc_b: concB });
    } catch { /* ignore */ }
    setSaving(false);
  };

  const addReactive = (reactive) => {
    setReactives(r => [...r, reactive]);
    setShowAddReactive(false);
  };

  const removeReactive = (id) => {
    setReactives(r => r.filter(x => x.id !== id));
  };

  if (showIntro) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Zap size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-primary-dark mb-4">Electrólisis Virtual</h1>
          <p className="text-text-secondary font-semibold mb-8">Simula reacciones electroquímicas en un entorno seguro e interactivo. Ajusta parámetros y observa resultados en tiempo real.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setShowIntro(false)} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
            <Button variant="outline" className="px-10 py-4 rounded-2xl font-bold text-base border-2">Ver tutorial</Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      {apiError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-xs font-bold text-amber-600 flex items-center gap-2">
          <AlertTriangle size={14} /> {apiError}
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-primary-dark">Electrólisis</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-200 text-[9px] font-bold">LABORATORIO VIRTUAL</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={saveExperiment} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all"><Download size={18} /></button>
          <button onClick={() => { setReactives([]); setTemperature(298); setPressure(1.2); setConcA(0.5); setConcB(0.2); }} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all"><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Simulation Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6">
            <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 border-dashed">
              <div className="text-center">
                <FlaskConical size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-sm font-bold text-text-secondary">Área de Reacción</p>
                <p className="text-[10px] font-semibold text-gray-400 mt-1">Añade reactivos para comenzar</p>
              </div>
            </div>
          </Card>

          {/* Reactives */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-primary-dark">Reactivos</h2>
              <Button onClick={() => setShowAddReactive(true)} size="sm" className="bg-primary-dark text-white rounded-xl text-[10px] font-bold h-8 px-3">
                <Plus size={14} /> Añadir
              </Button>
            </div>
            {reactives.length === 0 ? (
              <p className="text-xs font-semibold text-text-secondary text-center py-6">No hay reactivos añadidos</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {reactives.map(r => (
                  <div key={r.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                    <span className="text-[10px] font-bold">{r.name}</span>
                    <span className="text-[8px] font-semibold text-text-secondary">{r.conc}</span>
                    <button onClick={() => removeReactive(r.id)} className="p-0.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            )}

            {showAddReactive && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                <div className="flex flex-wrap gap-2">
                  {STOCK_REACTIVES.map(r => (
                    <button key={r.id} onClick={() => addReactive(r)}
                      className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-primary/30 text-xs font-bold transition-all">
                      {r.name} - {r.desc}
                    </button>
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
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-text-secondary">Temperatura</span>
                  <span className="text-xs font-black text-primary-dark">{temperature} K</span>
                </div>
                <Slider min={273} max={500} value={temperature} onChange={setTemperature} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-text-secondary">Presión</span>
                  <span className="text-xs font-black text-primary-dark">{pressure} atm</span>
                </div>
                <Slider min={0.5} max={3} step={0.1} value={pressure} onChange={setPressure} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-text-secondary">[Reactivo A]</span>
                  <span className="text-xs font-black text-primary-dark">{concA} M</span>
                </div>
                <Slider min={0.1} max={2} step={0.1} value={concA} onChange={setConcA} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-text-secondary">[Reactivo B]</span>
                  <span className="text-xs font-black text-primary-dark">{concB} M</span>
                </div>
                <Slider min={0.1} max={2} step={0.1} value={concB} onChange={setConcB} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-black text-primary-dark mb-4">Control</h2>
            <div className="space-y-3">
              <Button onClick={() => setIsRunning(!isRunning)} className="w-full h-12 bg-primary-dark text-white rounded-2xl font-bold text-sm gap-2">
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                {isRunning ? 'Pausar' : 'Iniciar Reacción'}
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-2xl font-bold text-xs border-2 gap-2">
                <LayoutGrid size={16} /> Vista Molecular
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ElectrolysisPage;
