import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Clock,
  Thermometer,
  Gauge,
  Beaker,
  Atom,
  Zap,
  HelpCircle,
  RotateCcw,
  Play,
  Pause,
  Info,
  Award,
  Sparkles,
  Activity,
  Droplets,
  FlaskConical,
  Layers,
  Microscope,
  Leaf,
  TrendingUp,
  Battery,
  Shuffle,
  Sun,
  Dna,
  FlaskRound,
  Hexagon,
  Pipette,
  Rabbit,
  Radio,
  ScanLine,
  Sigma,
  TestTube,
  TreePine,
  Waves,
  Weight,
  Wind,
  Wine,
} from 'lucide-react';
import SIMULATORS from '../../data/simulators';
import { cn } from '../../utils/cn';

const ElectrolysisPage = lazy(() => import('./ElectrolysisPage'));
const CatalysisPage = lazy(() => import('./CatalysisPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="w-12 h-12 border-4 border-[#004B76] border-t-transparent rounded-full animate-spin" />
  </div>
);

const categoryVisualHints = {
  'Básico': {
    gradient: 'from-green-50 via-emerald-50/30 to-white',
    accent: 'text-[#10B981]',
    border: 'border-[#10B981]/20',
    label: 'bg-green-100 text-green-700',
  },
  'Intermedio': {
    gradient: 'from-blue-50 via-indigo-50/30 to-white',
    accent: 'text-[#0066FF]',
    border: 'border-[#0066FF]/20',
    label: 'bg-yellow-100 text-yellow-700',
  },
  'Avanzado': {
    gradient: 'from-purple-50 via-violet-50/30 to-white',
    accent: 'text-[#8B5CF6]',
    border: 'border-[#8B5CF6]/20',
    label: 'bg-red-100 text-red-700',
  },
};

const SimulatorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const sim = SIMULATORS.find((s) => s.id === id);

  // Dedicated pages
  if (id === 'electrolysis') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ElectrolysisPage />
      </Suspense>
    );
  }

  if (id === 'catalysis') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <CatalysisPage />
      </Suspense>
    );
  }

  if (!sim) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <HelpCircle size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-black text-[#0D2140]">Simulador no encontrado</h2>
        <p className="text-gray-400 font-semibold">El simulador &quot;{id}&quot; no existe en el catálogo.</p>
        <button
          onClick={() => navigate('/simulators')}
          className="bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-6 py-3 rounded-xl transition-all shadow-md text-sm"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const Icon = sim.icon;
  const visual = categoryVisualHints[sim.difficultyKey] || categoryVisualHints['Básico'];

  // Interactive state
  const [temperature, setTemperature] = useState(298);
  const [pressure, setPressure] = useState(1.2);
  const [concA, setConcA] = useState(0.5);
  const [concB, setConcB] = useState(0.2);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Real-time science calcs
  const atomsCount = Math.floor(1428 + (temperature - 298) * 1.8 + (pressure - 1.2) * 45);
  const energyLevel = (-4.2 - (temperature - 298) * 0.008 + (pressure - 1.2) * 0.12).toFixed(1);
  const stability = Math.max(40, Math.min(99, Math.round(94 - Math.abs(temperature - 310) * 0.15 - Math.abs(pressure - 1.5) * 8)));
  const efficiency = Math.max(45, Math.min(98, Math.round(75 + (temperature - 298) * 0.12 - Math.abs(pressure - 1.2) * 5 + (concA + concB) * 10)));
  const deltaH = Math.round(-285 - (temperature - 298) * 0.15);
  const deltaS = Math.round(130 + (pressure - 1.2) * 4);

  // Sim timer
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-16"
    >
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/simulators')}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#004B76] transition-colors"
        >
          <ChevronLeft size={16} />
          Catálogo
        </button>
        <span className="text-gray-300 text-xs">/</span>
        <span className="text-xs font-bold text-[#004B76]">{sim.title}</span>
      </div>

      {/* Header Card */}
      <div className={cn("bg-white border rounded-[2.5rem] p-8 shadow-sm", visual.border)}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", sim.bg)}>
              <Icon size={32} className={sim.color} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-md", visual.label)}>
                  {sim.difficulty}
                </span>
                <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-md bg-[#E8F1FF] text-[#0066FF]">
                  +{sim.xp} XP
                </span>
                <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                  <Clock size={12} />
                  {sim.time}
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#0D2140] tracking-tight">
                {sim.title}
              </h2>
              <p className="text-sm text-gray-400 font-semibold max-w-2xl">
                {sim.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 transition-all"
            >
              <Info size={18} />
            </button>
            <button
              onClick={() => {
                setTemperature(298);
                setPressure(1.2);
                setConcA(0.5);
                setConcB(0.2);
                setIsSimulating(false);
                setElapsedTime(0);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 font-black text-xs transition-all"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all shadow-md",
                isSimulating
                  ? "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100"
                  : "bg-[#004B76] hover:bg-[#003B5C] text-white"
              )}
            >
              {isSimulating ? <Pause size={14} /> : <Play size={14} />}
              {isSimulating ? 'Pausar' : 'Iniciar'} simulación
            </button>
          </div>
        </div>

        {/* Info panel */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden mt-6"
          >
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-black text-[#0D2140] tracking-tight">Acerca de este simulador</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {sim.description} Los parámetros de temperatura, presión y concentración afectan
                las variables termodinámicas en tiempo real. Ajusta los controles para explorar
                diferentes condiciones experimentales.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main workspace grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Controls */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-6">
            <h4 className="text-xs font-black text-[#0D2140] tracking-tight">Parámetros de control</h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>Temperatura</span>
                  <span className="text-[#004B76]">{temperature} K</span>
                </div>
                <input
                  type="range"
                  min="273"
                  max="373"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#004B76]"
                />
                <div className="flex justify-between text-[8px] text-gray-400 font-semibold">
                  <span>273 K</span>
                  <span>373 K</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>Presión</span>
                  <span className="text-[#004B76]">{pressure.toFixed(1)} atm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={Math.round(pressure * 10)}
                  onChange={(e) => setPressure(Number(e.target.value) / 10)}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#004B76]"
                />
                <div className="flex justify-between text-[8px] text-gray-400 font-semibold">
                  <span>0.0 atm</span>
                  <span>5.0 atm</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>[Reactivo A]</span>
                  <span className="text-[#004B76]">{concA.toFixed(1)} M</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={Math.round(concA * 10)}
                  onChange={(e) => setConcA(Number(e.target.value) / 10)}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#004B76]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>[Reactivo B]</span>
                  <span className="text-[#004B76]">{concB.toFixed(1)} M</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={Math.round(concB * 10)}
                  onChange={(e) => setConcB(Number(e.target.value) / 10)}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#004B76]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-[#0D2140] tracking-tight">Datos en tiempo real</h4>
            <div className="space-y-3">
              <div className="bg-[#F8FAFC] rounded-xl p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500">Átomos</span>
                <span className="text-xs font-black text-[#0D2140]">{atomsCount.toLocaleString()}</span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500">Energía</span>
                <span className="text-xs font-black text-[#0D2140]">{energyLevel} eV</span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500">Estabilidad</span>
                <span className="text-xs font-black text-[#0D2140]">{stability}%</span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500">Rendimiento</span>
                <span className="text-xs font-black text-[#0D2140]">{efficiency}%</span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500">ΔH</span>
                <span className={cn("text-xs font-black", deltaH < 0 ? 'text-green-600' : 'text-red-600')}>
                  {deltaH} kJ/mol
                </span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500">ΔS</span>
                <span className="text-xs font-black text-[#0D2140]">+{deltaS} J/mol·K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Workspace */}
        <div className="lg:col-span-6">
          <div className={cn("bg-white border rounded-[2rem] shadow-sm overflow-hidden", visual.border)}>
            {/* Workspace top bar */}
            <div className={cn("px-6 py-3 border-b flex items-center justify-between", visual.border)}>
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", sim.bg)}>
                  <Icon size={18} className={sim.color} />
                </div>
                <span className="text-xs font-black text-[#0D2140]">Espacio de trabajo</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                <div className={cn("w-2 h-2 rounded-full", isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-300')} />
                {isSimulating ? 'Simulando' : 'En pausa'}
                <span className="ml-2 font-mono">{formatTime(elapsedTime)}</span>
              </div>
            </div>

            {/* Visual workspace */}
            <div className={cn("relative h-[500px] flex items-center justify-center overflow-hidden", visual.gradient)}>
              {/* Background grid */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#004B76" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Molecule visualization */}
              <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Central molecule cluster */}
                <svg viewBox="0 0 300 200" className="w-72 h-48">
                  {/* Bonds */}
                  <line x1="100" y1="60" x2="150" y2="100" stroke="#004B76" strokeWidth={2 + Math.round(pressure * 0.3)} opacity="0.6" />
                  <line x1="200" y1="60" x2="150" y2="100" stroke="#004B76" strokeWidth={2 + Math.round(pressure * 0.3)} opacity="0.6" />
                  <line x1="100" y1="140" x2="150" y2="100" stroke="#004B76" strokeWidth={2 + Math.round(pressure * 0.3)} opacity="0.6" />
                  <line x1="200" y1="140" x2="150" y2="100" stroke="#004B76" strokeWidth={2 + Math.round(pressure * 0.3)} opacity="0.6" />
                  <line x1="150" y1="100" x2="150" y2="40" stroke="#004B76" strokeWidth={2} opacity="0.4" />

                  {/* Atoms */}
                  <circle cx="150" cy="100" r={18 + Math.round(temperature * 0.02)} fill="#0066FF" opacity="0.4" className={isSimulating ? 'animate-pulse' : ''} />
                  <circle cx="150" cy="100" r="10" fill="#004B76" opacity="0.8" />
                  <circle cx="100" cy="60" r="8" fill="#10B981" opacity="0.7" />
                  <circle cx="200" cy="60" r="8" fill="#10B981" opacity="0.7" />
                  <circle cx="100" cy="140" r="8" fill="#8B5CF6" opacity="0.7" />
                  <circle cx="200" cy="140" r="8" fill="#8B5CF6" opacity="0.7" />
                  <circle cx="150" cy="40" r="5" fill="#F59E0B" opacity="0.7" />

                  {/* Labels */}
                  <text x="150" y="105" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">C</text>
                  <text x="100" y="63" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">O</text>
                  <text x="200" y="63" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">O</text>
                  <text x="100" y="143" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">H</text>
                  <text x="200" y="143" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">H</text>
                </svg>

                {/* Status indicators */}
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
                    <Thermometer size={14} className="text-red-500" />
                    <span className="text-[10px] font-bold text-gray-600">{temperature}K</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
                    <Gauge size={14} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-gray-600">{pressure.toFixed(1)} atm</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
                    <Beaker size={14} className="text-purple-500" />
                    <span className="text-[10px] font-bold text-gray-600">{concA.toFixed(1)}M / {concB.toFixed(1)}M</span>
                  </div>
                </div>

                {/* Animating particles */}
                {isSimulating && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-[#004B76]/20"
                        initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0 }}
                        animate={{
                          x: [null, Math.random() * 100 + '%'],
                          y: [null, Math.random() * 100 + '%'],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 3,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Workspace footer */}
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-semibold">
                {sim.difficultyKey === 'Avanzado' ? 'Condiciones avanzadas — precisión requerida' :
                 sim.difficultyKey === 'Intermedio' ? 'Monitoreo constante de variables' :
                 'Guías visuales activas — modo aprendizaje'}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                <Award size={12} className="text-amber-400" />
                <span>{sim.xp} XP al completar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick actions + info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-[#0D2140] tracking-tight">Acciones rápidas</h4>
            <div className="space-y-3">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="w-full flex items-center justify-center gap-2 bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-4 py-3 rounded-xl transition-all shadow-md text-xs"
              >
                {isSimulating ? <Pause size={14} /> : <Play size={14} />}
                {isSimulating ? 'Pausar experimento' : 'Iniciar experimento'}
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-4 py-3 rounded-xl transition-all text-xs">
                <Activity size={14} />
                Exportar datos
              </button>
              <button
                onClick={() => {
                  setTemperature(298);
                  setPressure(1.2);
                  setConcA(0.5);
                  setConcB(0.2);
                  setIsSimulating(false);
                  setElapsedTime(0);
                }}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-4 py-3 rounded-xl transition-all text-xs"
              >
                <RotateCcw size={14} />
                Restablecer
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-[#0D2140] tracking-tight">Termodinámica</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                  <span>Conversión</span>
                  <span>{efficiency}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#004B76] rounded-full transition-all" style={{ width: `${efficiency}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                  <span>Estabilidad</span>
                  <span>{stability}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${stability}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className={cn("bg-gradient-to-br rounded-[2rem] p-6 shadow-sm border", visual.gradient, visual.border)}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className={visual.accent} />
              <h4 className="text-xs font-black text-[#0D2140] tracking-tight">Recomendación</h4>
            </div>
            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
              {sim.difficultyKey === 'Básico' && 'Ajusta la temperatura y observa cómo cambian las propiedades del sistema. Ideal para empezar.'}
              {sim.difficultyKey === 'Intermedio' && 'Monitorea la estabilidad y el rendimiento mientras modificas múltiples variables simultáneamente.'}
              {sim.difficultyKey === 'Avanzado' && 'Condiciones de alta precisión. Pequeños cambios en los parámetros pueden generar grandes variaciones en los resultados.'}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default SimulatorPage;
