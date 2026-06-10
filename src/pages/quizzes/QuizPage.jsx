import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  FastForward, 
  Timer, 
  Award, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Heart, 
  RotateCcw, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  Plus,
  Scale,
  RefreshCw,
  Trophy,
  SlidersHorizontal,
  Microscope,
  ArrowRight,
  Zap,
  Waves,
  Compass
} from 'lucide-react';
import { Quiz3D } from '../../components/quizzes/Quiz3D';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const QuizPage = () => {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('retroalimentacion'); // 'retroalimentacion' | 'resumen' | 'curiosidades'
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved1, setIsSaved1] = useState(false);
  const [isSaved2, setIsSaved2] = useState(false);
  const [isLoadingCuriosity, setIsLoadingCuriosity] = useState(false);

  // Triggering alternate curiosities loaded simulation
  const handleLoadAnotherCuriosity = () => {
    setIsLoadingCuriosity(true);
    setTimeout(() => {
      setIsLoadingCuriosity(false);
      alert("¡Nuevas curiosidades moleculares cargadas con éxito!");
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] relative pb-24 select-none">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex-grow max-w-[1400px] mx-auto w-full pt-4"
          >
            <Quiz3D />
          </motion.div>
        ) : (
          <motion.div
            key="quiz-completion"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 15 }}
            className="flex-grow max-w-[1400px] mx-auto w-full space-y-8 pb-10 relative overflow-hidden"
          >
            
            {/* Horizontal Tabs Header */}
            <div className="flex justify-center border-b border-gray-100/80 mb-8 relative z-10">
              <div className="flex items-center gap-12 h-14">
                <button
                  onClick={() => setActiveTab('retroalimentacion')}
                  className={`relative pb-3 text-sm font-black tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'retroalimentacion' ? 'text-[#0D2140]' : 'text-gray-400 hover:text-[#0D2140]/70'
                  }`}
                >
                  Retroalimentación
                  {activeTab === 'retroalimentacion' && (
                    <motion.div 
                      layoutId="activeTabLine" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004B76]" 
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('resumen')}
                  className={`relative pb-3 text-sm font-black tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'resumen' ? 'text-[#0D2140]' : 'text-gray-400 hover:text-[#0D2140]/70'
                  }`}
                >
                  Resumen
                  {activeTab === 'resumen' && (
                    <motion.div 
                      layoutId="activeTabLine" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004B76]" 
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('curiosidades')}
                  className={`relative pb-3 text-sm font-black tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'curiosidades' ? 'text-[#0D2140]' : 'text-gray-400 hover:text-[#0D2140]/70'
                  }`}
                >
                  Curiosidades Químicas
                  {activeTab === 'curiosidades' && (
                    <motion.div 
                      layoutId="activeTabLine" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004B76]" 
                    />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              
              {/* Tab 1: Retroalimentación */}
              {activeTab === 'retroalimentacion' ? (
                <motion.div
                  key="tab-retroalimentacion"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {/* Hero Card: ¡RESPUESTA CORRECTA! */}
                  <Card animate={false} className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
                    <div className="absolute -bottom-6 -left-6 pointer-events-none opacity-[0.02] text-[#004B76]">
                      <svg className="w-56 h-56" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h12v2H6V4zm12 14H6V8h12v10z"/>
                      </svg>
                    </div>

                    <div className="space-y-4 md:max-w-[70%]">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EAFBF3] rounded-full border border-emerald-100/50">
                        <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                        <span className="text-[#059669] text-[10px] font-black uppercase tracking-wider">
                          ¡RESPUESTA CORRECTA!
                        </span>
                      </div>
                      
                      <h2 className="text-3xl font-black text-[#0D2140] tracking-tight leading-tight">
                        Has dominado el Principio de Le Chatelier
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                        Excelente análisis. Has identificado correctamente cómo el sistema compensa el aumento de presión desplazando el equilibrio hacia el lado con menos moles de gas.
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center gap-1.5 px-4.5 py-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100 text-xs font-black">
                          <Award size={14} className="fill-purple-100 text-purple-600" />
                          <span>+50 XP</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 text-xs font-black">
                          <Sparkles size={14} className="text-blue-600" />
                          <span>Dominio: 85%</span>
                        </div>
                      </div>
                    </div>

                    {/* Microscope Icon badge */}
                    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/5 to-[#EAFBF3] rounded-full blur-md" />
                      <div className="w-28 h-28 bg-white border border-emerald-100/80 rounded-full shadow-premium flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-22 h-22 rounded-full bg-[#EAFBF3] flex items-center justify-center">
                          <Microscope size={42} className="text-[#059669] stroke-[1.8]" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* 2 Columns: Explanation & Improve */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left Column: Explicación Educativa (lg:col-span-8) */}
                    <Card animate={false} className="lg:col-span-8 p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white space-y-6 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004B76] flex items-center justify-center">
                            <BookOpen size={20} />
                          </div>
                          <h3 className="text-lg font-black text-[#0D2140] tracking-tight">
                            Explicación Educativa
                          </h3>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                          El <strong>Principio de Le Chatelier</strong> establece que si un sistema en equilibrio es sometido a un cambio en las condiciones (concentración, temperatura o presión), el sistema se ajustará para contrarrestar dicho cambio.
                        </p>

                        <div className="bg-gray-50 border border-gray-100/80 rounded-3xl p-6 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004B76]" />
                          <p className="text-xs sm:text-sm italic text-[#0D2140] font-bold leading-relaxed pl-3">
                            "Cuando la presión aumenta, el equilibrio se desplaza hacia el miembro de la reacción que ocupa un volumen menor (donde hay menos moles de sustancias gaseosas)."
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">
                          Ejemplo aplicado
                        </h4>
                        <div className="bg-emerald-50/10 border border-emerald-100/30 rounded-2xl p-4.5">
                          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-black text-[#0D2140]">
                            <span className="text-[#059669] font-bold">N₂</span>
                            <sub className="-mt-1 text-[10px]">(g)</sub>
                            <span className="text-gray-400 font-medium">+</span>
                            <span className="text-[#059669] font-bold">3 H₂</span>
                            <sub className="-mt-1 text-[10px]">(g)</sub>
                            <span className="text-primary text-lg">⇌</span>
                            <span className="text-[#059669] font-bold">2 NH₃</span>
                            <sub className="-mt-1 text-[10px]">(g)</sub>
                          </div>
                          <p className="text-[11px] text-gray-500 font-bold tracking-tight mt-2 flex flex-wrap items-center gap-2">
                            <span>Izquierda: 4 moles</span>
                            <span className="text-gray-300">•</span>
                            <span>Derecha: 2 moles</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[#059669]">El aumento de presión favorece la formación de amoníaco.</span>
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Right Column: Ruta de Mejora (lg:col-span-4) */}
                    <Card animate={false} className="lg:col-span-4 p-8 border border-purple-100 shadow-sm rounded-[2.5rem] bg-gradient-to-br from-fuchsia-50/80 to-purple-50/80 flex flex-col justify-between min-h-[350px]">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                            <Sparkles size={20} className="fill-purple-200" />
                          </div>
                          <h3 className="text-lg font-black text-[#0D2140] tracking-tight">
                            Ruta de Mejora
                          </h3>
                        </div>

                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                          Has acertado el concepto teórico, pero tus tiempos de respuesta sugieren que podrías beneficiarte de un repaso visual.
                        </p>

                        <div className="bg-white/90 backdrop-blur-md border border-purple-100/60 p-4.5 rounded-2xl space-y-1.5 shadow-sm">
                          <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest block">
                            RECOMENDADO AHORA:
                          </span>
                          <span className="text-xs font-black text-[#0D2140] block leading-snug">
                            Lección: Representación Gráfica de Equilibrios
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-8">
                        <button 
                          onClick={() => alert("Abriendo lección multimedia: Representación Gráfica de Equilibrios...")}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3.5 rounded-2xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-600/10"
                        >
                          <Compass size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
                          <span>Repasar ahora</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setActiveTab('resumen');
                            alert("¡Avanzando al resumen completo del módulo!");
                          }}
                          className="w-full bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-6 py-3.5 rounded-2xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-950/10"
                        >
                          <span>Siguiente Ejercicio</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </Card>

                  </div>

                  {/* 3 Columns: Related Concepts & Progress / Challenge */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Conceptos Relacionados (lg:col-span-8) */}
                    <Card animate={false} className="lg:col-span-8 p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white space-y-6 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Plus size={20} className="stroke-[2.5]" />
                          </div>
                          <h3 className="text-lg font-black text-[#0D2140] tracking-tight">
                            Conceptos Relacionados
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          <div className="p-5 border border-gray-100 rounded-3xl hover:border-blue-100 hover:bg-blue-50/10 transition-all cursor-pointer group flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                              <Waves size={18} />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-[#0D2140] group-hover:text-blue-600 transition-colors">
                                Constante Kc
                              </h4>
                              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                                Cómo la temperatura es el único factor que altera el valor real de K.
                              </p>
                            </div>
                          </div>

                          <div className="p-5 border border-gray-100 rounded-3xl hover:border-amber-100 hover:bg-amber-50/10 transition-all cursor-pointer group flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                              <Zap size={18} />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-[#0D2140] group-hover:text-amber-600 transition-colors">
                                Catalizadores
                              </h4>
                              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                                Efecto en la velocidad de reacción sin alterar la posición del equilibrio.
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </Card>

                    {/* Progress & Next Challenge Card (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
                      
                      {/* Tu Progreso */}
                      <Card animate={false} className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white space-y-4">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">
                          Tu Progreso
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-black">
                              <span className="text-gray-500">Química General</span>
                              <span className="text-[#004B76]">78%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#004B76] rounded-full" style={{ width: '78%' }} />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-black">
                              <span className="text-gray-500">Equilibrio Químico</span>
                              <span className="text-[#059669]">92%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#059669] rounded-full" style={{ width: '92%' }} />
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Siguiente Desafío */}
                      <div 
                        onClick={() => alert("Cargando el siguiente gran desafío...")}
                        className="relative h-40 rounded-3xl overflow-hidden shadow-premium group cursor-pointer"
                      >
                        <img 
                          src="/assets/next_challenge_lab.png" 
                          alt="Siguiente Desafío"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/95 via-cyan-950/45 to-transparent" />
                        
                        <div className="absolute bottom-4 left-5 right-5 space-y-0.5 text-white">
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#6EE7B7]">
                            SIGUIENTE DESAFÍO
                          </span>
                          <h4 className="text-sm font-black tracking-tight leading-snug">
                            Cinética y Mecanismos
                          </h4>
                        </div>
                      </div>

                    </div>

                  </div>

                </motion.div>
              ) : activeTab === 'resumen' ? (
                <motion.div
                  key="tab-resumen"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-12 relative min-h-[500px]"
                >
                  {/* Giant Background Star Watermark */}
                  <div className="absolute top-[-100px] left-[50%] translate-x-[-50%] pointer-events-none opacity-[0.03] text-slate-900 z-0">
                    <svg className="w-[600px] h-[600px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
                    </svg>
                  </div>

                  {/* High-tech Syringe Watermark */}
                  <div className="absolute bottom-[-60px] right-[-40px] pointer-events-none opacity-[0.05] text-[#004B76] z-0">
                    <svg className="w-96 h-96" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="opacity-10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 6 L18 10 M5 15 L9 19 M7 13 L17 3 M11 17 L21 7" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20 L2 22 M3 21 L5 19" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 5 L22 2 M18 6 L19 5" />
                      <path d="M9 11 L10 10 M11 13 L12 12 M13 15 L14 14" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* 1. Header completed micro-lesson */}
                  <div className="space-y-4 text-center relative z-10">
                    <h1 className="text-5xl font-black text-[#0D2140] tracking-tight leading-tight">
                      ¡Excelente trabajo!
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 font-semibold max-w-2xl mx-auto leading-relaxed">
                      Aquí tienes lo más importante de esta lección. Has consolidado conceptos fundamentales de la cinética química.
                    </p>
                  </div>

                  {/* 2. Three Concept Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    
                    {/* Concept Card 1: Principio de Le Châtelier */}
                    <Card animate={false} className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col justify-between min-h-[320px] hover:shadow-md transition-shadow">
                      <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                          <Scale size={26} />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-black text-[#0D2140] tracking-tight">
                            Principio de Le Châtelier
                          </h3>
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                            Establece que si un sistema en equilibrio es perturbado, el sistema se desplazará en la dirección que tienda a contrarrestar dicha perturbación.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert("Navegando a la simulación 3D avanzada...")}
                        className="text-blue-500 hover:text-blue-700 text-xs font-black uppercase tracking-wider flex items-center gap-1 mt-6 text-left cursor-pointer"
                      >
                        <span>Explorar simulación</span>
                        <ChevronRight size={14} />
                      </button>
                    </Card>

                    {/* Concept Card 2: Equilibrio Químico Dinámico */}
                    <Card animate={false} className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col justify-between min-h-[320px] hover:shadow-md transition-shadow">
                      <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                          <RefreshCw size={26} />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-black text-[#0D2140] tracking-tight">
                            Equilibrio Químico Dinámico
                          </h3>
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                            Se alcanza cuando las velocidades de las reacciones directa e inversa son iguales, manteniendo constantes las concentraciones.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert("Abriendo gráfico cinético dinámico en tiempo real...")}
                        className="text-emerald-500 hover:text-emerald-700 text-xs font-black uppercase tracking-wider flex items-center gap-1 mt-6 text-left cursor-pointer"
                      >
                        <span>Ver gráfico dinámico</span>
                        <ChevronRight size={14} />
                      </button>
                    </Card>

                    {/* Concept Card 3: Presión y Moles Gaseosos */}
                    <Card animate={false} className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col justify-between min-h-[320px] hover:shadow-md transition-shadow">
                      <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                          <SlidersHorizontal size={26} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-black text-[#0D2140] tracking-tight">
                            Presión y Moles Gaseosos
                          </h3>
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                            Al aumentar la presión (o disminuir el volumen), el equilibrio se desplaza hacia el lado con menor número de moles de gas.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert("Cargando formulario y fórmulas matemáticas cinéticas...")}
                        className="text-purple-500 hover:text-purple-700 text-xs font-black uppercase tracking-wider flex items-center gap-1 mt-6 text-left cursor-pointer"
                      >
                        <span>Abrir fórmulas</span>
                        <ChevronRight size={14} />
                      </button>
                    </Card>

                  </div>

                  {/* 3. Achievements & Stats row */}
                  <Card animate={false} className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-amber-400 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Trophy size={24} strokeWidth={2.5} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-[#0D2140]">
                          Logro Desbloqueado
                        </h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                          Maestro del Equilibrio <span className="text-[#059669]">· +100 XP Extra</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="bg-gray-50 border border-gray-100 p-4.5 rounded-2xl flex flex-col items-center justify-center min-w-[120px] flex-grow md:flex-grow-0">
                        <span className="text-2xl font-black text-[#004B76]">95%</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">PRECISIÓN</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 p-4.5 rounded-2xl flex flex-col items-center justify-center min-w-[120px] flex-grow md:flex-grow-0">
                        <span className="text-2xl font-black text-[#004B76]">04:12</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">TIEMPO</span>
                      </div>
                    </div>
                  </Card>

                </motion.div>
              ) : (
                <motion.div
                  key="tab-curiosidades"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {/* 1. Header completed micro-lesson */}
                  <div className="space-y-4">
                    <p className="text-[#059669] text-xs font-black uppercase tracking-widest">
                      MICRO-LECCIÓN COMPLETADA
                    </p>
                    <h1 className="text-4xl font-black text-[#0D2140] tracking-tight flex items-center gap-2">
                      Curiosidades Químicas ✨
                    </h1>
                    <p className="text-sm text-gray-500 font-semibold max-w-3xl leading-relaxed">
                      ¡Gran trabajo! La química no solo está en los libros, está en cada rincón de tu vida. Descubre cómo estas reacciones transforman tu mundo cotidiano.
                    </p>
                  </div>

                  {/* 2. Grid Cards Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Card 1: Cocina - Bicarbonato de Sodio (lg:col-span-7) */}
                    <Card animate={false} className="lg:col-span-7 p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col justify-between min-h-[360px] relative overflow-hidden group">
                      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                        
                        {/* Left Column Text */}
                        <div className="space-y-4 md:max-w-[55%]">
                          <span className="bg-[#EAFBF3] text-[#059669] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            COCINA
                          </span>
                          <h2 className="text-xl font-black text-[#0D2140] leading-snug tracking-tight">
                            ¿Sabías que el bicarbonato libera dióxido de carbono al hornear?
                          </h2>
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                            Al mezclarse con ingredientes ácidos como el yogur o limón, el bicarbonato de sodio crea una reacción que libera miles de micro-burbujas de CO₂. Es lo que hace que tus pasteles sean esponjosos y ligeros.
                          </p>
                        </div>

                        {/* Right Column: Premium Interactive Cake Illustration */}
                        <div className="relative w-full md:w-[40%] aspect-square flex items-center justify-center bg-gray-50/50 rounded-[2rem] border border-gray-100/40 p-4 shrink-0 overflow-hidden">
                          
                          {/* Floating CO₂ bubble particles */}
                          <div className="absolute inset-0 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ 
                                  y: [40, -100], 
                                  x: [0, (i - 3) * 12],
                                  opacity: [0, 0.7, 0] 
                                }}
                                transition={{ 
                                  duration: 2.5 + Math.random() * 1.5, 
                                  repeat: Infinity, 
                                  delay: i * 0.4 
                                }}
                                className="absolute bottom-6 left-[48%] w-1.5 h-1.5 rounded-full bg-slate-300/40 border border-slate-300/10 blur-[0.2px]"
                              />
                            ))}
                          </div>

                          {/* Cake Slice Vector Illustration */}
                          <svg className="w-28 h-28 drop-shadow-xl" viewBox="0 0 100 100" fill="none">
                            <ellipse cx="50" cy="80" rx="35" ry="10" fill="#E2E8F0" />
                            <ellipse cx="50" cy="79" rx="31" ry="8" fill="#F8FAFC" />
                            <path d="M22 62 L50 82 L78 62 L50 42 Z" fill="#4A2810" />
                            <path d="M22 62 L50 82 L50 48 L22 30 Z" fill="#3D200C" />
                            <path d="M50 82 L78 62 L78 28 L50 48 Z" fill="#543015" />
                            <path d="M22 30 L50 48 L78 28 L50 12 Z" fill="#F8FAFC" />
                            <path d="M22 45 L50 63 L78 45" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M22 53 L50 71 L78 53" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" className="opacity-40" />
                            <circle cx="50" cy="18" r="4.5" fill="#EF4444" />
                            <path d="M50 14 Q53 6 56 10" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>

                        </div>

                      </div>

                      {/* Footer Buttons card */}
                      <div className="flex items-center gap-3 pt-6 border-t border-gray-50 mt-6 w-full">
                        <button 
                          onClick={() => setIsSaved1(!isSaved1)}
                          className={`border font-black px-4.5 py-2.5 rounded-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSaved1 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <Bookmark size={14} className={isSaved1 ? 'fill-emerald-500' : ''} />
                          <span>{isSaved1 ? 'Guardado' : 'Guardar'}</span>
                        </button>
                        
                        <button 
                          onClick={() => alert("Enlace copiado al portapapeles. ¡Compártelo con tus compañeros de clase!")}
                          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-4.5 py-2.5 rounded-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Share2 size={14} />
                          <span>Compartir</span>
                        </button>
                      </div>

                    </Card>

                    {/* Card 2: Naturaleza - Manzana Oxidada (lg:col-span-5) */}
                    <Card animate={false} className="lg:col-span-5 p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col justify-between min-h-[360px] relative overflow-hidden group">
                      
                      <div className="relative w-full aspect-video flex items-center justify-center bg-gray-50/50 rounded-3xl border border-gray-100/40 p-4 shrink-0 overflow-hidden">
                        <div className="absolute top-3.5 right-3.5 z-10">
                          <span className="bg-[#FAF5FF] text-[#9333EA] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            NATURALEZA
                          </span>
                        </div>

                        <svg className="w-24 h-24 drop-shadow-lg" viewBox="0 0 100 100" fill="none">
                          <path d="M50 28 C48 16 58 10 62 14" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                          <path d="M52 24 C58 20 64 22 66 26 C62 30 56 28 52 24 Z" fill="#10B981" />
                          <path d="M30 46 C20 54 24 78 45 80 C50 81 50 78 55 80 C76 78 80 54 70 46 C60 38 64 42 50 42 C36 42 40 38 30 46 Z" fill="url(#appleGrad)" />
                          <ellipse cx="40" cy="56" rx="6" ry="4" fill="#B45309" className="opacity-30" />
                          <ellipse cx="62" cy="64" rx="8" ry="5" fill="#78350F" className="opacity-25" />
                          <circle cx="50" cy="70" r="4" fill="#92400E" className="opacity-20" />
                          <defs>
                            <linearGradient id="appleGrad" x1="20" y1="30" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                              <stop offset="0%" stopColor="#EF4444" />
                              <stop offset="45%" stopColor="#FBBF24" />
                              <stop offset="70%" stopColor="#D97706" />
                              <stop offset="100%" stopColor="#92400E" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      <div className="space-y-2 pt-4">
                        <h2 className="text-xl font-black text-[#0D2140] tracking-tight">
                          El cambio de color de la manzana
                        </h2>
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                          La oxidación ocurre cuando la manzana se corta y sus enzimas reaccionan con el oxígeno del aire. ¡Es química pura en tu frutero!
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-6 w-full">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setIsLiked(!isLiked)}
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                              isLiked 
                                ? 'bg-rose-50 border-rose-200 text-rose-500'
                                : 'bg-white border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200'
                            }`}
                          >
                            <Heart size={14} className={isLiked ? 'fill-rose-500' : ''} />
                          </button>
                          
                          <button 
                            onClick={() => alert("Enlace copiado al portapapeles. ¡Envíalo a tus compañeros de biología o química!")}
                            className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-primary/20 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                          >
                            <Share2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100/30">
                          <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                          <span className="text-[#059669] text-[9px] font-black uppercase tracking-wider">
                            Oxidación
                          </span>
                        </div>
                      </div>

                    </Card>

                    {/* Card 3: Banner Completo - Agua Oxigenada (lg:col-span-12) */}
                    <Card animate={false} className="lg:col-span-12 p-8 bg-[#004B76] text-white rounded-[2.5rem] border-none shadow-premium flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                      <div className="flex flex-col sm:flex-row items-center gap-6 md:max-w-[70%]">
                        <div className="w-16 h-16 rounded-[1.8rem] bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0">
                          <svg className="w-8 h-8 text-cyan-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            <line x1="12" y1="11" x2="12" y2="17" />
                            <line x1="9" y1="14" x2="15" y2="14" />
                          </svg>
                        </div>

                        <div className="space-y-2 text-center sm:text-left">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                            <span className="bg-white/10 text-cyan-300 text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              HOGAR Y SALUD
                            </span>
                            <span className="text-white/40 text-[8px] font-black uppercase tracking-wider">
                              • Reacción de Descomposición
                            </span>
                          </div>
                          <h2 className="text-2xl font-black tracking-tight leading-snug">
                            El secreto efervescente del agua oxigenada
                          </h2>
                          <p className="text-xs text-white/70 font-semibold leading-relaxed">
                            El peróxido de hidrógeno (H₂O₂) se descompone rápidamente en agua y oxígeno puro al entrar en contacto con una enzima en nuestra sangre llamada catalasa. Esas burbujas que ves son oxígeno atrapando bacterias.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 select-none">
                        <button 
                          onClick={() => setIsSaved2(!isSaved2)}
                          className={`font-black px-6 py-3.5 rounded-2xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                            isSaved2 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-[#6EE7B7] text-[#064E3B] hover:bg-[#5cd4a7]'
                          }`}
                        >
                          <Plus size={16} strokeWidth={2.5} />
                          <span>{isSaved2 ? 'Guardado en Cuaderno' : 'Guardar en Cuaderno'}</span>
                        </button>

                        <button 
                          onClick={() => alert("¡Reacción química compartida en tus redes académicas con éxito!")}
                          className="bg-transparent border border-white/20 hover:bg-white/5 text-white font-black px-6 py-3.5 rounded-2xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Share2 size={14} />
                          <span>Enviar a un amigo</span>
                        </button>
                      </div>

                    </Card>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. Bottom Action Buttons flow */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-gray-100 relative z-10">
              
              {activeTab === 'curiosidades' && (
                <button 
                  onClick={handleLoadAnotherCuriosity}
                  disabled={isLoadingCuriosity}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black px-6 py-3.5 rounded-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto min-w-[180px] disabled:opacity-50"
                >
                  <RotateCcw size={14} className={isLoadingCuriosity ? "animate-spin" : ""} />
                  <span>{isLoadingCuriosity ? "Cargando..." : "Ver otra curiosidad"}</span>
                </button>
              )}

              <button 
                onClick={() => navigate('/modules')}
                className="bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-7 py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto min-w-[220px]"
              >
                <span>Continuar al siguiente módulo</span>
                <ChevronRight size={14} className="stroke-[2.5]" />
              </button>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Action Bar (Only shows when quiz is NOT completed) */}
      {!isCompleted && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-[280px] right-0 h-24 bg-white/80 backdrop-blur-md border-t border-gray-100 px-12 flex items-center justify-between z-40"
        >
          <div className="flex items-center gap-8">
            <Button variant="outline" className="gap-2 border-gray-200 text-text-secondary hover:text-primary group">
              <Lightbulb size={18} className="group-hover:text-primary" />
              Pista
            </Button>
            <button 
              onClick={() => {
                setIsCompleted(true);
                setActiveTab('retroalimentacion');
              }}
              className="flex items-center gap-2 text-text-secondary font-bold hover:text-primary transition-colors"
            >
              Saltar <FastForward size={18} />
            </button>
          </div>

          <div className="flex items-center gap-12">
            <div className="text-center">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">Tiempo</p>
              <div className="flex items-center gap-2 text-xl font-black text-text-main">
                <Timer size={18} className="text-primary" />
                02 : 45
              </div>
            </div>

            <div className="h-10 w-px bg-gray-200" />

            <div className="text-center">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">Multiplicador</p>
              <div className="flex items-center gap-2 text-xl font-black text-green-500">
                <Award size={18} />
                x1.5
              </div>
            </div>

            <Button 
              onClick={() => {
                setIsCompleted(true);
                setActiveTab('retroalimentacion');
              }}
              size="lg" 
              className="px-12 h-14 bg-primary-dark text-white rounded-2xl shadow-2xl shadow-primary/30 gap-3 group"
            >
              Confirmar Respuesta
              <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuizPage;
