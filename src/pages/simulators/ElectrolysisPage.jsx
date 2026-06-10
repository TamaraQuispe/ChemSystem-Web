import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  ZoomIn, 
  LayoutGrid, 
  Download, 
  Trash2, 
  Plus, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Pause,
  Info,
  Check,
  Zap,
  Layers,
  Network,
  Headphones,
  Video,
  Flame,
  FlaskConical,
  BookOpen
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Slider } from '../../components/ui/Slider';
import { Progress } from '../../components/ui/Progress';
import { cn } from '../../utils/cn';

// Stock chemical products list
const STOCK_REACTIVES = [
  { id: 'h2so4', name: 'H₂SO₄', desc: 'Ácido Sulfúrico', conc: '98%', color: 'bg-blue-500 text-blue-500' },
  { id: 'kmno4', name: 'KMnO₄', desc: 'Permanganato de Potasio', conc: '0.1 M', color: 'bg-emerald-500 text-emerald-500' },
  { id: 'naoh', name: 'NaOH', desc: 'Hidróxido de Sodio', conc: '2.0 M', color: 'bg-purple-500 text-purple-500' }
];

// Timeline process stages
const TIMELINE_STAGES = [
  { id: 'mixture', label: 'MEZCLA', status: 'completed' },
  { id: 'activation', label: 'ACTIVACIÓN', status: 'completed' },
  { id: 'transition', label: 'TRANSICIÓN', status: 'active' },
  { id: 'product', label: 'PRODUCTO', status: 'locked' },
  { id: 'equilibrium', label: 'EQUILIBRIO', status: 'locked' }
];

const ElectrolysisPage = () => {
  // Intro Splash State
  const [hasStarted, setHasStarted] = useState(false);

  // 1. Interactive States
  const [temperature, setTemperature] = useState(298); // 273K - 373K
  const [pressure, setPressure] = useState(1.2);      // 0.0atm - 5.0atm
  const [concA, setConcA] = useState(0.5);            // 0.0M - 1.0M Reactivo A
  const [concB, setConcB] = useState(0.2);            // 0.0M - 1.0M Reactivo B
  const [activeStage, setActiveStage] = useState('transition');
  const [workspaceReactives, setWorkspaceReactives] = useState([]);
  const [isSimulating, setIsSimulating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gridActive, setGridActive] = useState(false);

  // 2. Real-time Science Calculations based on Sliders
  const atomsCount = Math.floor(1428 + (temperature - 298) * 1.8 + (pressure - 1.2) * 45);
  const energyLevel = (-4.2 - (temperature - 298) * 0.008 + (pressure - 1.2) * 0.12).toFixed(1);
  const stabilityPercentage = Math.max(40, Math.min(99, Math.round(94 - Math.abs(temperature - 310) * 0.15 - Math.abs(pressure - 1.5) * 8)));

  // Efficiency gauge calculation
  const efficiency = Math.max(45, Math.min(98, Math.round(75 + (temperature - 298) * 0.12 - Math.abs(pressure - 1.2) * 5 + (concA + concB) * 10)));
  const relativeRendement = (efficiency - 62.6).toFixed(1);

  // Thermodynamical dynamic factors
  const deltaH = Math.round(-285 - (temperature - 298) * 0.15);
  const deltaS = Math.round(130 + (pressure - 1.2) * 4);

  // 3. Handlers
  const handleAddReactive = (reactive) => {
    if (workspaceReactives.find(r => r.id === reactive.id)) {
      alert(`${reactive.name} ya está en el espacio de trabajo.`);
      return;
    }
    const newReactive = {
      ...reactive,
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      progress: 0
    };
    setWorkspaceReactives([...workspaceReactives, newReactive]);

    // Animate progress loading bar of added reactive
    setTimeout(() => {
      setWorkspaceReactives(prev => prev.map(r => r.id === reactive.id ? { ...r, progress: 100 } : r));
    }, 100);
  };

  const handleRemoveReactive = (id) => {
    setWorkspaceReactives(workspaceReactives.filter(r => r.id !== id));
  };

  const handleClearLab = () => {
    setWorkspaceReactives([]);
    setIsSimulating(false);
  };

  const handleStartSimulation = () => {
    if (workspaceReactives.length === 0) {
      alert("Por favor, añade al menos un reactivo de stock al Espacio de Trabajo antes de simular.");
      return;
    }
    setIsSimulating(true);
  };

  // Reset or re-simulate
  const handleResetSimulation = () => {
    setTemperature(298);
    setPressure(1.2);
    setConcA(0.5);
    setConcB(0.2);
    setIsSimulating(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 select-none">
      
      <AnimatePresence mode="wait">
        
        {/* Intro Splash State (First Image) */}
        {!hasStarted ? (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="rounded-[2.5rem] bg-[#070D19] border border-white/5 shadow-2xl p-12 min-h-[720px] flex flex-col justify-between relative overflow-hidden text-center items-center"
          >
            {/* Immersive background glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[90px] pointer-events-none" />

            {/* Glowing technology orbit vector overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-[450px] h-[450px] rounded-full border border-dashed border-cyan-500/30 animate-[spin_40s_linear_infinite]" />
              <div className="absolute w-[350px] h-[350px] rounded-full border border-cyan-500/10" />
            </div>

            {/* Top Header Badge */}
            <div className="relative z-10 pt-4">
              <span className="inline-flex items-center gap-2 px-4.5 py-1.5 bg-emerald-500/10 text-[#10B981] border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                MÓDULO INTRODUCTORIO
              </span>
            </div>

            {/* Middle Main Info (Title & Buttons) */}
            <div className="relative z-10 max-w-3xl space-y-8 py-10 flex flex-col items-center">
              
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-none">
                  El Misterio de los <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.25)]">
                    Enlaces Químicos
                  </span>
                </h1>
                
                <p className="text-sm sm:text-base text-gray-400 font-semibold leading-relaxed max-w-2xl mx-auto pt-2">
                  ¿Cómo se mantienen unidos los átomos? Entender los enlaces es entender la fuerza que mantiene unido todo lo que ves.
                </p>
              </div>

              {/* Prep Timer Ring and Play Button Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-4">
                
                {/* Countdown / Preparation Timer circle */}
                <div className="flex items-center gap-4">
                  <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="36" cy="36" r="32" className="text-gray-800" strokeWidth="4.5" stroke="currentColor" fill="transparent" />
                      <circle cx="36" cy="36" r="32" className="text-emerald-400" strokeWidth="4.5" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={0} strokeLinecap="round" stroke="currentColor" fill="transparent" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center leading-none">
                      <span className="text-[11px] font-black text-white">15:00</span>
                      <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest mt-0.5">LISTO</span>
                    </div>
                  </div>
                </div>

                {/* CTA Action button & audio options */}
                <div className="space-y-3.5">
                  <button 
                    onClick={() => setHasStarted(true)}
                    className="bg-gradient-to-r from-[#10B981] to-[#0D9488] hover:from-[#059669] hover:to-[#0F766E] text-white font-black px-9 py-4.5 rounded-2xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 cursor-pointer select-none"
                  >
                    <span>Iniciar Experimento</span>
                    <Play size={16} fill="currentColor" />
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer select-none">
                      <Headphones size={13} />
                      Banda sonora ON
                    </span>
                    <span className="w-px h-3 bg-white/10" />
                    <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer select-none">
                      <Video size={13} />
                      Intro 4K
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom 3 Cards Row */}
            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
              
              {/* Card 1: Estructura Iónica */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-white/10 rounded-3xl p-6.5 text-left space-y-3 hover:translate-y-[-2px] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Network size={20} className="stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                    Estructura Iónica
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    Transferencia de electrones y redes cristalinas de alta energía.
                  </p>
                </div>
              </div>

              {/* Card 2: Enlace Covalente */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-white/10 rounded-3xl p-6.5 text-left space-y-3 hover:translate-y-[-2px] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#10B981] flex items-center justify-center shrink-0">
                  <Layers size={20} className="stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                    Enlace Covalente
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    Compartición electrónica: la base de la química orgánica y la vida.
                  </p>
                </div>
              </div>

              {/* Card 3: Fuerzas Metálicas */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-white/10 rounded-3xl p-6.5 text-left space-y-3 hover:translate-y-[-2px] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Zap size={20} className="stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors">
                    Fuerzas Metálicas
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    Nubes de electrones libres y conductividad extrema.
                  </p>
                </div>
              </div>

            </div>

          </motion.div>
        ) : (
          
          /* Interactive Lab Simulator Workspace (Second Image) */
          <motion.div
            key="interactive-simulator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Header with BACK Button to Splash and BETA Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3.5">
                <button 
                  onClick={() => setHasStarted(false)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-4.5 py-2.5 rounded-xl transition-all active:scale-95 text-xs cursor-pointer select-none flex items-center gap-1.5"
                >
                  ← Volver a Intro
                </button>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-[#0D2140] tracking-tight">
                    Simulador de Catálisis
                  </h1>
                  <span className="bg-[#EAFBF3] text-[#059669] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    BETA LAB
                  </span>
                </div>
              </div>
            </div>

            {/* Main Grid: Left content, Right sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column (lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* A. 3D Active Reaction Visualizer Card */}
                <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 aspect-video shadow-2xl border border-white/5 flex flex-col justify-between p-6">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  
                  {/* Top Bar inside Visualizer */}
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-white text-[9px] font-black tracking-widest uppercase">
                      <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shrink-0" />
                      RENDERIZANDO REACCIÓN ACTIVA
                    </div>
                    
                    <button 
                      onClick={() => alert("Principio de Catálisis: El catalizador de Platino (Pt) disminuye la energía de activación, acelerando la reacción química sin consumirse.")}
                      className="bg-white/10 hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-1.5 text-white text-[9px] font-black tracking-widest uppercase cursor-pointer"
                    >
                      <HelpCircle size={12} className="text-white" />
                      TENGO DUDAS AQUÍ
                    </button>
                  </div>

                  {/* Glowing 3D Molecule Center Core */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      {/* Outer breathing aura */}
                      <motion.div 
                        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="absolute w-52 h-52 rounded-full bg-cyan-500/20 blur-2xl"
                      />
                      
                      {/* Inner core glow */}
                      <motion.div 
                        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute w-32 h-32 rounded-full bg-blue-500/30 blur-xl"
                      />

                      {/* Bond connections SVG */}
                      <svg className="absolute w-full h-full text-white/20 z-0" viewBox="0 0 100 100">
                        <line x1="50" y1="50" x2="30" y2="30" stroke="currentColor" strokeWidth="2" strokeDasharray="3" />
                        <line x1="50" y1="50" x2="72" y2="65" stroke="currentColor" strokeWidth="2" strokeDasharray="3" />
                        <line x1="50" y1="50" x2="38" y2="72" stroke="currentColor" strokeWidth="2" strokeDasharray="3" />
                      </svg>

                      {/* Simulated Atoms (Orbits and Bonds) */}
                      <div className="absolute inset-0 flex items-center justify-center scale-[zoomLevel]">
                        {/* Central Atom: Platinum Catalyst */}
                        <motion.div 
                          animate={{ y: [-3, 3, -3] }}
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                          className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl shadow-cyan-500/40 flex flex-col items-center justify-center text-white z-20"
                        >
                          <span className="text-[11px] font-black tracking-wide">Pt</span>
                          <span className="text-[6px] font-black opacity-80 uppercase tracking-widest mt-0.5">CAT</span>
                        </motion.div>
                        
                        {/* Atom O */}
                        <motion.div 
                          animate={{ 
                            x: [-45, -50, -45], 
                            y: [-40, -35, -40] 
                          }}
                          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                          className="absolute w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 shadow-md z-20 flex items-center justify-center text-white text-[8px] font-bold"
                        >
                          O
                        </motion.div>
                        
                        {/* Atom H1 */}
                        <motion.div 
                          animate={{ 
                            x: [52, 47, 52], 
                            y: [32, 38, 32] 
                          }}
                          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                          className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-md z-20 flex items-center justify-center text-white text-[8px] font-bold"
                        >
                          H
                        </motion.div>

                        {/* Atom H2 */}
                        <motion.div 
                          animate={{ 
                            x: [-24, -18, -24], 
                            y: [52, 46, 52] 
                          }}
                          transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
                          className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-600 shadow-md z-20 flex items-center justify-center text-white text-[8px] font-bold"
                        >
                          H
                        </motion.div>
                        
                        {/* Interactive Floating Gas/Electrons particles */}
                        {isSimulating && Array.from({ length: 18 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ 
                              x: Math.random() * 260 - 130, 
                              y: Math.random() * 160 - 80, 
                              scale: Math.random() * 0.4 + 0.4,
                              opacity: 0 
                            }}
                            animate={{ 
                              x: [Math.random() * 260 - 130, Math.random() * 260 - 130],
                              y: [Math.random() * 160 - 80, Math.random() * 160 - 80],
                              opacity: [0, 0.8, 0.8, 0],
                              scale: [0.3, 1, 1, 0.3]
                            }}
                            transition={{ 
                              duration: Math.random() * 4 + 2, 
                              repeat: Infinity,
                              delay: Math.random() * 2.5
                            }}
                            className="absolute w-2 h-2 rounded-full bg-cyan-400 blur-[0.6px] shadow-sm shadow-cyan-300"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Grid Overlay Line system */}
                  {gridActive && (
                    <div className="absolute inset-0 border border-white/5 grid grid-cols-6 grid-rows-6 pointer-events-none">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-white/5" />
                      ))}
                    </div>
                  )}

                  {/* Bottom Bar overlay details */}
                  <div className="flex items-end justify-between w-full relative z-10">
                    
                    {/* Science Metrics panel (bottom-left overlay) */}
                    <div className="bg-slate-900/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-6 text-[10px] text-[#94A3B8] font-black tracking-wider shadow-lg">
                      <div className="space-y-1">
                        <p className="opacity-60 uppercase text-[8px]">ÁTOMOS</p>
                        <p className="text-white text-xs">{atomsCount.toLocaleString()}</p>
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="space-y-1">
                        <p className="opacity-60 uppercase text-[8px]">ENERGÍA</p>
                        <p className="text-white text-xs">{energyLevel} eV</p>
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="space-y-1">
                        <p className="opacity-60 uppercase text-[8px]">ESTABILIDAD</p>
                        <p className="text-cyan-400 text-xs font-black">{stabilityPercentage}%</p>
                      </div>
                    </div>

                    {/* Control visualizer buttons (bottom-right overlay) */}
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setZoomLevel(prev => prev === 1 ? 1.3 : 1)}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md border border-white/10 flex items-center justify-center text-white cursor-pointer shadow-md"
                        title="Ampliar visualización"
                      >
                        <ZoomIn size={16} />
                      </button>
                      <button 
                        onClick={handleResetSimulation}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md border border-white/10 flex items-center justify-center text-white cursor-pointer shadow-md"
                        title="Reiniciar variables"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button 
                        onClick={() => setGridActive(!gridActive)}
                        className={`w-10 h-10 rounded-xl active:scale-95 transition-all backdrop-blur-md border flex items-center justify-center cursor-pointer shadow-md ${
                          gridActive 
                            ? 'bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/20' 
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                        }`}
                        title="Alternar retícula de calibración"
                      >
                        <LayoutGrid size={16} />
                      </button>
                    </div>

                  </div>
                </div>

                {/* B. Reaction Timeline Tracker Component */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-[#0D2140] tracking-tight">
                        Línea de Tiempo de Reacción
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-semibold">
                        Seguimiento cinético en tiempo real
                      </p>
                    </div>
                    <button 
                      onClick={() => alert("Datos cinéticos exportados exitosamente en formato CSV.")}
                      className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-5 py-3 rounded-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none"
                    >
                      <Download size={14} />
                      <span>EXPORTAR DATOS</span>
                    </button>
                  </div>

                  {/* Horizontal Timeline steps */}
                  <div className="relative pt-4 pb-2">
                    {/* Progress Connector bar */}
                    <div className="absolute top-1/2 left-[5%] right-[5%] -translate-y-1/2 h-1 bg-gray-100 rounded-full z-0" />
                    
                    {/* Active Connector Progress bar */}
                    <div 
                      className="absolute top-1/2 left-[5%] -translate-y-1/2 h-1 bg-[#004B76] rounded-full z-0 transition-all duration-500"
                      style={{
                        width: activeStage === 'mixture' ? '0%' :
                               activeStage === 'activation' ? '22.5%' :
                               activeStage === 'transition' ? '45%' :
                               activeStage === 'product' ? '67.5%' : '90%'
                      }}
                    />

                    <div className="relative z-10 flex justify-between items-center w-full">
                      {TIMELINE_STAGES.map((stage, index) => {
                        const isCompleted = index <= TIMELINE_STAGES.findIndex(s => s.id === activeStage);
                        const isActive = stage.id === activeStage;

                        return (
                          <div 
                            key={stage.id} 
                            onClick={() => setActiveStage(stage.id)}
                            className="flex flex-col items-center gap-3 cursor-pointer group"
                          >
                            {/* Interactive Point dot */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isActive 
                                ? 'bg-[#004B76] text-white border-[6px] border-[#004B76]/20 shadow-md scale-110' 
                                : isCompleted
                                ? 'bg-[#004B76] text-white shadow-sm'
                                : 'bg-white border-2 border-gray-200 text-gray-300 group-hover:border-gray-400 group-hover:text-gray-400'
                            }`}>
                              {isCompleted && !isActive ? (
                                <Check size={12} className="stroke-[3]" />
                              ) : (
                                <div className={`w-2 h-2 rounded-full ${
                                  isActive ? 'bg-white' : 'bg-transparent'
                                }`} />
                              )}
                            </div>

                            {/* Phase text label */}
                            <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded transition-colors ${
                              isActive 
                                ? 'bg-[#004B76]/10 text-[#004B76]' 
                                : isCompleted 
                                ? 'text-[#0D2140]' 
                                : 'text-gray-400'
                            }`}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* C. Stock Reactives and WorkSpace Layout Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Reactives in stock list (md:col-span-4) */}
                  <div className="md:col-span-4 bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                        Reactivos en stock
                      </h4>
                      
                      <div className="space-y-4">
                        {STOCK_REACTIVES.map((reactive) => (
                          <div 
                            key={reactive.id}
                            className="flex items-center justify-between p-3.5 bg-gray-50/70 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-xs font-black shadow-sm text-gray-800 border border-gray-100">
                                {reactive.name}
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-[#0D2140] tracking-tight">{reactive.name}</p>
                                <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5">{reactive.conc}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleAddReactive(reactive)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 flex items-center justify-center transition-all active:scale-90 cursor-pointer hover:shadow-sm"
                            >
                              <Plus size={14} className="stroke-[2.5]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Espacio de Trabajo (md:col-span-8) */}
                  <div className="md:col-span-8 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between min-h-[300px]">
                    
                    {/* Dynamic Workspace Workspace */}
                    <div className="flex-grow flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {workspaceReactives.length === 0 ? (
                          /* EMPTY PLACEHOLDER STATE */
                          <motion.div 
                            key="empty"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="text-center py-6 flex flex-col items-center justify-center"
                          >
                            <div className="relative w-16 h-16 mb-4 flex items-center justify-center text-primary bg-[#F8FAFC] rounded-full border border-gray-100 shadow-inner">
                              <span className="text-2xl">☺</span>
                              <div className="absolute inset-0 border border-dashed border-gray-300 rounded-full animate-[spin_10s_linear_infinite]" />
                            </div>
                            
                            <h4 className="text-sm font-black text-[#0D2140] mb-2 tracking-tight">
                              Espacio de Trabajo para Simulaciones
                            </h4>
                            <p className="text-xs text-gray-500 max-w-sm font-semibold leading-relaxed px-4">
                              Arrastra y suelta reactivos aquí para iniciar una nueva secuencia de reacción molecular en el visualizador 3D.
                            </p>
                          </motion.div>
                        ) : (
                          /* DYNAMIC ACTIVE STATE WITH ADDED ITEMS */
                          <motion.div 
                            key="active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 w-full py-2"
                          >
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                              REACTIVOS EN EL ESPACIO DE TRABAJO
                            </h4>
                            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                              {workspaceReactives.map((reactive) => (
                                <div 
                                  key={reactive.id}
                                  className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 text-xs font-black text-primary flex items-center justify-center shadow-sm">
                                      {reactive.name}
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-black text-[#0D2140] tracking-tight">
                                        {reactive.name} - {reactive.desc}
                                      </h5>
                                      <p className="text-[8px] text-gray-400 font-extrabold uppercase mt-0.5">
                                        Añadido a las {reactive.addedAt}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Added Progress Bar representation */}
                                  <div className="flex items-center gap-4">
                                    <div className="w-24 hidden sm:block">
                                      <div className="h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${reactive.progress}%` }}
                                          transition={{ duration: 0.8, ease: "easeOut" }}
                                          className="h-full bg-emerald-500"
                                        />
                                      </div>
                                    </div>
                                    <button 
                                      onClick={() => handleRemoveReactive(reactive.id)}
                                      className="p-2 rounded-xl bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-100 hover:border-red-100 transition-colors shadow-sm cursor-pointer select-none"
                                      title="Quitar reactivo del laboratorio"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Controls Footer */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 w-full mt-4">
                      <button 
                        onClick={handleClearLab}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-6 py-3.5 rounded-xl transition-all active:scale-95 text-xs shadow-sm cursor-pointer select-none"
                      >
                        Limpiar Lab
                      </button>
                      
                      <button 
                        onClick={handleStartSimulation}
                        className="bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-7 py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center gap-2 cursor-pointer select-none"
                      >
                        <span>Siguiente Paso</span>
                        <ArrowRight size={14} className="stroke-[2.5]" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Column / Sidebar (lg:col-span-4) */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* A. Dynamic Slide variables panels */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                  
                  {/* 1. Temperatura Control Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-gray-800 tracking-tight">Temperatura</span>
                      <span className="text-lg font-black text-[#004B76] font-mono tracking-tight">{temperature} K</span>
                    </div>
                    <Slider 
                      value={temperature}
                      onChange={setTemperature}
                      min={273}
                      max={373}
                      step={1}
                    />
                    <div className="flex justify-between text-[8px] font-black text-gray-400 tracking-widest">
                      <span>273 K</span>
                      <span>373 K</span>
                    </div>
                  </div>

                  {/* 2. Presión Control Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-gray-800 tracking-tight">Presión</span>
                      <span className="text-lg font-black text-purple-600 font-mono tracking-tight">{pressure.toFixed(1)} atm</span>
                    </div>
                    <Slider 
                      value={pressure}
                      onChange={setPressure}
                      min={0}
                      max={5}
                      step={0.1}
                    />
                    <div className="flex justify-between text-[8px] font-black text-gray-400 tracking-widest">
                      <span>0 ATM</span>
                      <span>5 ATM</span>
                    </div>
                  </div>

                  {/* 3. Concentración Molar controls */}
                  <div className="space-y-5 pt-2">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                      Concentración Molar
                    </h4>
                    
                    {/* Reactivo A */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-[#0D2140]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span>Reactivo A (H₂O)</span>
                        </div>
                        <span className="font-mono text-xs">{concA.toFixed(1)} M</span>
                      </div>
                      <Slider 
                        value={concA}
                        onChange={setConcA}
                        min={0.0}
                        max={1.0}
                        step={0.1}
                      />
                    </div>

                    {/* Reactivo B */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-[#0D2140]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <span>Reactivo B (O₂)</span>
                        </div>
                        <span className="font-mono text-xs">{concB.toFixed(1)} M</span>
                      </div>
                      <Slider 
                        value={concB}
                        onChange={setConcB}
                        min={0.0}
                        max={1.0}
                        step={0.1}
                      />
                    </div>

                  </div>

                </div>

                {/* B. Eficiencia del Catalizador Ring gauge */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6 relative overflow-hidden">
                  <h3 className="text-sm font-black text-gray-800 tracking-tight">
                    Eficiencia del Catalizador
                  </h3>

                  {/* Circular Gauge and relative metrics */}
                  <div className="flex items-center gap-6 pt-2">
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Outer Background ring */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          stroke="#F1F5F9" 
                          strokeWidth="9" 
                          fill="transparent" 
                        />
                        {/* Dynamic Ring */}
                        <motion.circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          stroke="#0D9488" 
                          strokeWidth="9" 
                          fill="transparent" 
                          strokeDasharray="251.2" 
                          animate={{ strokeDashoffset: 251.2 - (251.2 * efficiency) / 100 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      {/* Text centered */}
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-[#0D2140] tracking-tight">{efficiency}%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Rendimiento Actual
                      </p>
                      <p className="text-2xl font-black text-[#059669] tracking-tight">
                        +{relativeRendement}%
                      </p>
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-wider">
                        VS. CONTROL BASE
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Physical Chemistry parameters */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {/* Entalpía */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-gray-500">Entalpía (ΔH)</span>
                      <span className="font-black text-red-600 bg-red-50/70 border border-red-100/30 px-3 py-1 rounded-xl">
                        {deltaH} kJ/mol
                      </span>
                    </div>
                    {/* Entropía */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-gray-500">Entropía (ΔS)</span>
                      <span className="font-black text-[#004B76] bg-blue-50/70 border border-blue-100/30 px-3 py-1 rounded-xl">
                        {deltaS} J/mol•K
                      </span>
                    </div>
                  </div>

                  {/* Floating microscope action button */}
                  <button 
                    onClick={() => alert("Mostrando vista microscópica avanzada del enrejado metálico del catalizador Pt.")}
                    className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-[#004B76] hover:bg-[#003B5C] active:scale-95 transition-all text-white flex items-center justify-center shadow-lg shadow-[#004B76]/20 cursor-pointer"
                    title="Ver enrejado cristalino"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
                    </svg>
                  </button>

                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElectrolysisPage;
