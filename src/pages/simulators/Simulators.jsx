import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Check,
  Award,
  Sparkles,
  FlaskConical,
  Beaker,
  Layers,
  Atom,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import PeriodicTable from '../../components/simulators/PeriodicTable';
import SIMULATORS from '../../data/simulators';
import { cn } from '../../utils/cn';

const Simulators = () => {
  const [viewState, setViewState] = useState('difficulty'); // 'difficulty' | 'catalog'
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermedio'); // 'Básico' | 'Intermedio' | 'Avanzado'
  const [showHint, setShowHint] = useState(false);

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const startPractice = () => {
    setViewState('catalog');
  };

  // Filter simulators based on chosen difficulty
  const filteredSimulators = SIMULATORS.filter((sim) => sim.difficultyKey === selectedDifficulty);

  return (
    <AnimatePresence mode="wait">
      {viewState === 'difficulty' ? (
        <motion.div 
          key="difficulty"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="space-y-10 pb-16"
        >
          {/* Header Sandbox Tab-bar */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-8">
              <h2 className="text-3xl font-extrabold text-[#0D2140] tracking-tight">
                Modo Sandbox
              </h2>
              <div className="flex gap-6 text-sm font-black text-gray-400">
                <span className="text-[#004B76] border-b-2 border-[#004B76] pb-5 -mb-5 relative z-10 cursor-pointer">
                  Dificultad
                </span>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Entorno
                </span>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Reactivos
                </span>
              </div>
            </div>
            {/* Hint toggle */}
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-black text-amber-700 shadow-sm transition-all"
              >
                <Lightbulb size={15} />
                Solicitar pista
              </button>
            ) : (
              <div
                onClick={() => setShowHint(false)}
                className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs font-semibold text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors max-w-xs text-right"
              >
                Nivel <span className="font-black">Básico</span> para principiantes. <span className="font-black">Intermedio</span> requiere termodinámica. <span className="font-black">Avanzado</span> para expertos.
              </div>
            )}
          </div>

          {/* Recommendation Banner */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-sm">
            {/* Background vector microscope */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 opacity-10 pointer-events-none text-primary">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                <path d="M40 90h20M50 90V75M30 75h40M60 40a10 10 0 0 0-20 0M45 40h10M40 30h20M50 15v15" />
                <rect x="47" y="45" width="6" height="25" rx="3" />
                <circle cx="50" cy="57" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10 space-y-5 max-w-2xl">
              <div>
                <span className="bg-[#EAFBF3] text-[#059669] font-black px-3.5 py-1 rounded-full text-[9px] uppercase tracking-widest inline-block border border-transparent shadow-sm">
                  ✨ RECOMENDACIÓN INTELIGENTE
                </span>
              </div>

              <h3 className="text-3xl font-black text-[#0D2140] tracking-tight">
                ¿Listo para subir de nivel, Alex?
              </h3>

              <p className="text-sm text-gray-500 font-bold leading-relaxed">
                Basado en tu desempeño perfecto en el módulo de <span className="text-[#004B76] font-extrabold">Estequiometría II</span>, te sugerimos probar el nivel <span className="text-[#8B5CF6] font-extrabold">Intermedio</span> para desafiar tus habilidades analíticas.
              </p>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => {
                    setSelectedDifficulty('Intermedio');
                    startPractice();
                  }}
                  className="bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs"
                >
                  Comenzar práctica recomendada
                </button>
                <button 
                  onClick={startPractice}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-6 py-3 rounded-xl transition-all active:scale-95 text-xs"
                >
                  Explorar otros niveles
                </button>
              </div>
            </div>

            {/* Floating illustration beaker/scale SVG right */}
            <div className="hidden md:flex shrink-0 w-36 h-36 items-center justify-center opacity-85">
              <svg viewBox="0 0 100 100" fill="none" className="w-28 h-28 text-blue-100 fill-blue-50/10">
                <path d="M30,85 L70,85 C70,85 75,70 65,40 L65,15 L35,15 L35,40 C25,70 30,85 30,85 Z" stroke="#004B76" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="38" y1="25" x2="62" y2="25" stroke="#004B76" strokeWidth="2.5" />
                <path d="M36,65 C40,65 42,60 50,60 C58,60 60,65 64,65" stroke="#78F0C4" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="72" r="3" fill="#78F0C4" />
                <circle cx="42" cy="45" r="2" fill="#004B76" opacity="0.3" />
                <circle cx="58" cy="50" r="1.5" fill="#004B76" opacity="0.3" />
              </svg>
            </div>
          </div>

          {/* Cards Title */}
          <div className="space-y-1">
            <h4 className="text-2xl font-extrabold text-[#0D2140] tracking-tight">
              Selecciona tu nivel de desafío
            </h4>
            <p className="text-gray-400 text-sm font-semibold">
              Configura la complejidad de las reacciones y el entorno del laboratorio.
            </p>
          </div>

          {/* Difficulty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Básico */}
            <div 
              onClick={() => handleDifficultySelect('Básico')}
              className={cn(
                "relative bg-white border rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[440px] shadow-sm transition-all duration-300 cursor-pointer",
                selectedDifficulty === 'Básico' 
                  ? "border-[#10B981] ring-2 ring-[#10B981]/25 scale-[1.01]" 
                  : "border-gray-100 hover:border-gray-200"
              )}
            >
              <div className="space-y-6">
                {/* Icon Leaf */}
                <div className="w-12 h-12 bg-[#EAFBF3] text-[#10B981] rounded-2xl flex items-center justify-center">
                  <Leaf size={22} className="stroke-[2.5]" />
                </div>

                {/* Level Title */}
                <div>
                  <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-1">
                    NIVEL I
                  </p>
                  <h5 className="text-2xl font-black text-[#0D2140]">
                    Básico
                  </h5>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Ideal para familiarizarse con la interfaz. Las reacciones son estables y los reactivos están pre-etiquetados con guías visuales paso a paso.
                </p>
              </div>

              {/* Specs and selection button */}
              <div className="space-y-6 pt-6 border-t border-gray-50 mt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50 p-3 rounded-xl">
                    <span className="flex items-center gap-2"><Clock size={14} className="text-gray-400" /> Tiempo est.</span>
                    <span>15 - 20 min</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50 p-3 rounded-xl">
                    <span className="flex items-center gap-2"><Beaker size={14} className="text-gray-400" /> Ejercicios</span>
                    <span>8 Simulaciones</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50 p-3 rounded-xl">
                    <span className="flex items-center gap-2"><Layers size={14} className="text-gray-400" /> Complejidad</span>
                    <div className="flex gap-1">
                      <span className="w-4 h-1.5 bg-[#10B981] rounded-full" />
                      <span className="w-4 h-1.5 bg-gray-200 rounded-full" />
                      <span className="w-4 h-1.5 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>

                <button 
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-black text-xs border tracking-wider transition-all active:scale-[0.98]",
                    selectedDifficulty === 'Básico'
                      ? "bg-[#EAFBF3] border-[#10B981] text-[#10B981]"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {selectedDifficulty === 'Básico' ? 'Seleccionado ✓' : 'Seleccionar'}
                </button>
              </div>
            </div>

            {/* Card 2: Intermedio (Recommended) */}
            <div 
              onClick={() => handleDifficultySelect('Intermedio')}
              className={cn(
                "relative bg-white border rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[440px] shadow-md transition-all duration-300 cursor-pointer",
                selectedDifficulty === 'Intermedio' 
                  ? "border-[#004B76] ring-2 ring-[#004B76]/10 scale-[1.03]" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {/* Floating Recommended label */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-[#004B76] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md border border-transparent">
                  RECOMENDADO PARA TI
                </span>
              </div>

              <div className="space-y-6 pt-3">
                {/* Icon Tubes */}
                <div className="w-12 h-12 bg-[#E8F1FF] text-[#0066FF] rounded-2xl flex items-center justify-center">
                  <FlaskConical size={22} className="stroke-[2.5]" />
                </div>

                {/* Level Title */}
                <div>
                  <p className="text-[10px] font-black text-[#0066FF] uppercase tracking-[0.2em] mb-1">
                    NIVEL II
                  </p>
                  <h5 className="text-2xl font-black text-[#0D2140]">
                    Intermedio
                  </h5>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Enfoque en termodinámica y equilibrio químico. Requiere monitorización constante de temperatura y presión para evitar fallos críticos.
                </p>
              </div>

              {/* Specs and selection button */}
              <div className="space-y-6 pt-6 border-t border-gray-50 mt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50 p-3 rounded-xl">
                    <span className="flex items-center gap-2"><Clock size={14} className="text-gray-400" /> Tiempo est.</span>
                    <span>30 - 45 min</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50 p-3 rounded-xl">
                    <span className="flex items-center gap-2"><Beaker size={14} className="text-gray-400" /> Ejercicios</span>
                    <span>12 Simulaciones</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50 p-3 rounded-xl">
                    <span className="flex items-center gap-2"><Layers size={14} className="text-gray-400" /> Complejidad</span>
                    <div className="flex gap-1">
                      <span className="w-4 h-1.5 bg-[#0066FF] rounded-full" />
                      <span className="w-4 h-1.5 bg-[#0066FF] rounded-full" />
                      <span className="w-4 h-1.5 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>

                <button 
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-black text-xs tracking-wider transition-all active:scale-[0.98]",
                    selectedDifficulty === 'Intermedio'
                      ? "bg-[#004B76] text-white hover:bg-[#003B5C] shadow-md shadow-[#004B76]/10"
                      : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {selectedDifficulty === 'Intermedio' ? 'Seleccionado ✓' : 'Seleccionar'}
                </button>
              </div>
            </div>

            {/* Card 3: Avanzado */}
            <div 
              onClick={() => handleDifficultySelect('Avanzado')}
              className={cn(
                "relative bg-white border rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[440px] shadow-sm transition-all duration-300 cursor-pointer",
                selectedDifficulty === 'Avanzado' 
                  ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/25 scale-[1.01]" 
                  : "border-gray-100 hover:border-gray-200"
              )}
            >
              <div className="space-y-6">
                {/* Icon Atom */}
                <div className="w-12 h-12 bg-[#F5ECFF] text-[#8B5CF6] rounded-2xl flex items-center justify-center">
                  <Atom size={22} className="stroke-[2.5]" />
                </div>

                {/* Level Title */}
                <div>
                  <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.2em] mb-1">
                    NIVEL III
                  </p>
                  <h5 className="text-2xl font-black text-[#0D2140]">
                    Avanzado
                  </h5>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Laboratorio de alta fidelidad con cinéticas complejas. Sin guías visuales y con variables ambientales dinámicas. Precisión al 99% requerida.
                </p>
              </div>

              {/* Specs and selection button */}
              <div className="space-y-6 pt-6 border-t border-gray-50 mt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50 p-3 rounded-xl">
                    <span className="flex items-center gap-2"><Clock size={14} className="text-gray-400" /> Tiempo est.</span>
                    <span>60+ min</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50 p-3 rounded-xl">
                    <span className="flex items-center gap-2"><Beaker size={14} className="text-gray-400" /> Ejercicios</span>
                    <span>15 Simulaciones</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50 p-3 rounded-xl">
                    <span className="flex items-center gap-2"><Layers size={14} className="text-gray-400" /> Complejidad</span>
                    <div className="flex gap-1">
                      <span className="w-4 h-1.5 bg-[#8B5CF6] rounded-full" />
                      <span className="w-4 h-1.5 bg-[#8B5CF6] rounded-full" />
                      <span className="w-4 h-1.5 bg-[#8B5CF6] rounded-full" />
                    </div>
                  </div>
                </div>

                <button 
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-black text-xs border tracking-wider transition-all active:scale-[0.98]",
                    selectedDifficulty === 'Avanzado'
                      ? "bg-[#F5ECFF] border-[#8B5CF6] text-[#8B5CF6]"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {selectedDifficulty === 'Avanzado' ? 'Seleccionado ✓' : 'Seleccionar'}
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Navigation Bar */}
          <div className="border-t border-gray-100/80 pt-6 flex items-center justify-between mt-12">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
              Volver a Simuladores
            </button>

            <div className="flex items-center gap-6">
              <span className="text-xs font-black text-gray-400">
                Cambiar nivel
              </span>
              <button 
                onClick={startPractice}
                className="bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 text-xs cursor-pointer"
              >
                Comenzar práctica
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="catalog"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="space-y-10"
        >
          {/* Active Level Alert / Breadcrumb */}
          <div className="bg-[#004B76]/5 border border-[#004B76]/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#004B76]/10 text-[#004B76] flex items-center justify-center shrink-0">
                <FlaskConical size={20} />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-extrabold text-sm text-[#0D2140]">
                  Modo Sandbox Activo: Nivel {selectedDifficulty}
                </h4>
                <p className="text-xs text-gray-500 font-bold">
                  Laboratorios configurados para la dificultad seleccionada.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg text-[10px] font-black text-amber-700 transition-all"
                >
                  <Lightbulb size={13} />
                  Pista
                </button>
              ) : (
                <div
                  onClick={() => setShowHint(false)}
                  className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-[10px] font-semibold text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors max-w-[200px]"
                >
                  Nivel <span className="font-black">Básico</span> para principiantes. <span className="font-black">Intermedio</span> requiere termodinámica. <span className="font-black">Avanzado</span> para expertos.
                </div>
              )}
              <button 
                onClick={() => setViewState('difficulty')} 
                className="text-xs font-black text-[#004B76] hover:underline cursor-pointer border border-[#004B76]/20 px-3 py-1.5 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
              >
                Cambiar Dificultad
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0D2140] tracking-tight mb-2">
                Laboratorios Virtuales
              </h2>
              <p className="text-gray-400 text-base font-semibold">
                Experimenta sin límites en nuestros entornos simulados de alta fidelidad.
              </p>
            </div>
            
            <div className="flex gap-3">
              <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-500 outline-none focus:ring-2 focus:ring-primary/20">
                <option>Todas las categorías</option>
                <option>Química General</option>
                <option>Orgánica</option>
                <option>Inorgánica</option>
              </select>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-500 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Básico">Básico (Fácil)</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-6 bg-[#004B76] rounded-full" />
              <h2 className="text-2xl font-black text-[#0D2140] tracking-tight">
                Laboratorio Destacado
              </h2>
            </div>
            <PeriodicTable />
          </section>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#0D2140] tracking-tight">
              Catálogo de Simuladores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSimulators.map((sim, index) => (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col p-0 overflow-hidden group border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem]">
                    <div className={cn("h-40 flex items-center justify-center transition-transform duration-500 group-hover:scale-105", sim.bg)}>
                      <sim.icon size={64} className={sim.color} />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                          sim.difficultyKey === 'Básico' ? "bg-green-100 text-green-700" :
                          sim.difficultyKey === 'Intermedio' ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {sim.difficulty}
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          +{sim.xp} XP
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-black text-[#0D2140] tracking-tight mb-2 group-hover:text-primary transition-colors">
                        {sim.title}
                      </h3>
                      <p className="text-gray-400 text-xs font-semibold leading-relaxed mb-6 flex-grow">
                        {sim.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                          <Clock size={14} />
                          <span>{sim.time}</span>
                        </div>
                        
                        <Link to={`/simulators/${sim.id}`}>
                          <Button variant="primary" size="sm" className="rounded-xl px-4 py-2 bg-[#004B76] hover:bg-[#003B5C] font-extrabold text-xs">
                            Iniciar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Simulators;
