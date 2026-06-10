import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Sparkles,
  BookOpen,
  Plus,
  HelpCircle,
  Bot,
  Calendar,
  SlidersHorizontal,
  FlaskConical,
  Award,
  CheckCircle2,
  ChevronDown,
  Trophy,
  Flame,
  CheckCircle,
  Shield,
  Layers,
  ChevronRight,
  Lock,
  Waves
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('perfil'); // 'perfil' | 'tareas'
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const tasks = [
    {
      id: 1,
      category: 'Química Orgánica',
      difficulty: 'Dificultad Alta',
      difficultyColor: 'bg-rose-50 text-rose-600 border border-rose-100',
      title: 'Mecanismos de Reacción SN2',
      date: 'Marcado el 12 de Octubre',
      description: 'No comprendo cómo el impedimento estérico afecta la velocidad en nucleófilos voluminosos comparado con SN1.',
      icon: FlaskConical,
      iconBg: 'bg-blue-50 text-blue-500'
    },
    {
      id: 2,
      category: 'Enlace Químico',
      difficulty: 'Dificultad Media',
      difficultyColor: 'bg-emerald-50 text-[#059669] border border-emerald-100',
      title: 'Configuración Electrónica',
      date: 'Marcado el 14 de Octubre',
      description: 'Excepciones en la regla de Moeller para los elementos de transición (Cromo y Cobre).',
      icon: BookOpen,
      iconBg: 'bg-emerald-50 text-emerald-500'
    },
    {
      id: 3,
      category: 'Enlace Químico',
      difficulty: 'Dificultad Baja',
      difficultyColor: 'bg-blue-50 text-blue-500 border border-blue-100',
      title: 'Puentes de Hidrógeno',
      date: 'Marcado el 15 de Octubre',
      description: '¿Por qué el HF tiene un punto de ebullición más alto que el HCl a pesar de ser más pequeño?',
      icon: HelpCircle,
      iconBg: 'bg-purple-50 text-purple-500'
    }
  ];

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'Todos') return true;
    return task.category === selectedFilter;
  });

  return (
    <div className="space-y-8 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-text-main tracking-tight">Rendimiento Académico</h2>
          <p className="text-text-secondary text-base font-semibold">Descubre tu progreso, racha semanal, logros y tareas pendientes en ChemSystem.</p>
        </div>
        <div className="flex gap-3">
          <div className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-[#EAFBF3] rounded-full border border-emerald-100/50 shadow-sm text-xs font-black text-[#059669]">
            <Flame size={16} className="fill-[#10B981] text-[#10B981] animate-pulse" />
            <span>24 Días Racha</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex justify-start border-b border-gray-100 mb-8 relative z-10">
        <div className="flex items-center gap-10 h-12">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`relative pb-3 text-sm font-black tracking-wider transition-colors cursor-pointer ${
              activeTab === 'perfil' ? 'text-[#0D2140]' : 'text-gray-400 hover:text-[#0D2140]/70'
            }`}
          >
            Perfil y Logros
            {activeTab === 'perfil' && (
              <motion.div 
                layoutId="analyticsTabLine" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004B76]" 
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('tareas')}
            className={`relative pb-3 text-sm font-black tracking-wider transition-colors cursor-pointer ${
              activeTab === 'tareas' ? 'text-[#0D2140]' : 'text-gray-400 hover:text-[#0D2140]/70'
            }`}
          >
            Tareas Pendientes
            {activeTab === 'tareas' && (
              <motion.div 
                layoutId="analyticsTabLine" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004B76]" 
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Tab 1: Perfil y Logros (Premium Profile) */}
        {activeTab === 'perfil' ? (
          <motion.div
            key="tab-perfil"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            
            {/* Upper Grid Layout: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Julian Info & Streak (col-span-8) */}
              <div className="lg:col-span-8 space-y-8 flex flex-col justify-between">
                
                {/* 1. Julián Schmidt Info Hero Card */}
                <Card animate={false} className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col sm:flex-row justify-start items-center gap-8 relative overflow-hidden group">
                  <div className="absolute -bottom-6 -left-6 pointer-events-none opacity-[0.01] text-primary">
                    <svg className="w-56 h-56" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h12v2H6V4zm12 14H6V8h12v10z"/>
                    </svg>
                  </div>

                  {/* Profile Picture with LVL 14 bottom badge */}
                  <div className="relative shrink-0 w-32 h-32 select-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-[3px] opacity-20" />
                    <img 
                      src="/assets/julian_profile.png" 
                      alt="Julián Schmidt" 
                      className="w-32 h-32 rounded-full border border-gray-100/80 shadow-premium object-cover relative z-10 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 bg-[#5B21B6] text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md z-20 whitespace-nowrap">
                      LVL 14
                    </div>
                  </div>

                  {/* Profile Texts */}
                  <div className="space-y-4 flex-grow text-center sm:text-left">
                    <div className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-3.5">
                        <h2 className="text-3xl font-black text-[#0D2140] tracking-tight">
                          Julián Schmidt
                        </h2>
                        <span className="bg-blue-50 text-[#005B8F] text-[8px] font-black px-3.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest self-center">
                          MIEMBRO PREMIUM
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                        Estudiante de 5to de Secundaria • Preparación Universitaria en Química
                      </p>
                    </div>

                    {/* Level progress bar */}
                    <div className="space-y-2 pt-2.5 max-w-md mx-auto sm:mx-0">
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-[#0D2140]/70">Progreso de Nivel</span>
                        <span className="text-primary-dark">1,250 / 2,000 XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full" style={{ width: '62.5%' }} />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 2. Racha Semanal Card */}
                <Card animate={false} className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col justify-between flex-grow min-h-[220px]">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-[#0D2140] tracking-tight">
                        Racha Semanal
                      </h3>
                      <p className="text-xs text-gray-400 font-semibold">
                        Actividad de estudio en los últimos 7 días
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-3.5 py-2 rounded-xl text-xs font-black text-[#0D2140]/80 cursor-pointer">
                      <span>Esta semana</span>
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  {/* Streak Bubbles Row */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center">
                    {[
                      { label: 'LUN', active: false },
                      { label: 'MAR', active: true, color: 'bg-primary text-white shadow-md shadow-primary/20' },
                      { label: 'MIE', active: false },
                      { label: 'JUE', active: true, color: 'bg-primary text-white shadow-md shadow-primary/20' },
                      { label: 'VIE', active: false },
                      { label: 'SAB', active: false },
                      { label: 'DOM', active: true, color: 'bg-secondary text-[#064E3B] shadow-md shadow-secondary/20' }
                    ].map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-all",
                          day.active 
                            ? day.color 
                            : "bg-gray-50 border border-gray-100 text-gray-300"
                        )}>
                          {day.active ? '✓' : idx + 1}
                        </div>
                        <span className={cn(
                          "text-[8px] sm:text-[9px] font-black tracking-wider",
                          day.active ? "text-[#0D2140]" : "text-gray-300"
                        )}>
                          {day.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>

              {/* Right Column: 4 Grid Stats & Daily Challenges (col-span-4) */}
              <div className="lg:col-span-4 space-y-8 flex flex-col justify-between">
                
                {/* 1. 2x2 Mini Stats Grid */}
                <div className="grid grid-cols-2 gap-4 shrink-0">
                  
                  {/* Stat 1: Global Rank */}
                  <Card animate={false} className="p-4 border border-gray-100 bg-gray-50 shadow-sm rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mb-2">
                      <Target size={18} />
                    </div>
                    <span className="text-base font-black text-[#0D2140]">#4</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">RANKING GLOBAL</span>
                  </Card>

                  {/* Stat 2: Completed Modules */}
                  <Card animate={false} className="p-4 border border-gray-100 bg-gray-50 shadow-sm rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mb-2">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-base font-black text-[#0D2140]">142</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">MÓDULOS OK</span>
                  </Card>

                  {/* Stat 3: Badges */}
                  <Card animate={false} className="p-4 border border-[#8B3DFF]/10 bg-[#8B3DFF] text-white shadow-sm rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mb-2">
                      <Award size={18} className="text-white" />
                    </div>
                    <span className="text-base font-black">28</span>
                    <span className="text-[8px] font-black text-purple-100 uppercase tracking-widest mt-0.5">INSIGNIAS</span>
                  </Card>

                  {/* Stat 4: Day Streak */}
                  <Card animate={false} className="p-4 border border-[#10B981]/10 bg-[#10B981] text-white shadow-sm rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mb-2">
                      <Flame size={18} className="text-white fill-white/10" />
                    </div>
                    <span className="text-base font-black">24</span>
                    <span className="text-[8px] font-black text-emerald-100 uppercase tracking-widest mt-0.5">RACHA DÍAS</span>
                  </Card>

                </div>

                {/* 2. Desafíos Diarios */}
                <Card animate={false} className="p-6.5 border border-gray-100 shadow-sm rounded-3xl bg-white flex flex-col justify-between flex-grow min-h-[260px]">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-[#0D2140] uppercase tracking-wider">
                      Desafíos Diarios
                    </h3>

                    {/* Challenges Checklist */}
                    <div className="space-y-3">
                      
                      <div className="flex items-center gap-3 p-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl">
                        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-[#0D2140]">Nombrar Alquenos</h4>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Completo · +50 XP</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                          <div className="w-4.5 h-4.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-[#0D2140]">Simular Enlace Covalente</h4>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">En curso · +75 XP</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl">
                        <div className="w-8 h-8 bg-gray-100 border border-dashed border-gray-300 text-gray-400 rounded-full flex items-center justify-center shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300 border-dashed" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-[#0D2140]">3 Quiz de Estequiometría</h4>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Pendiente · +120 XP</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <button 
                    onClick={() => alert("Mostrando todos los desafíos diarios de la semana...")}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 font-black py-3 rounded-xl transition-all active:scale-95 text-xs text-center cursor-pointer mt-4 select-none"
                  >
                    Ver todos
                  </button>
                </Card>

              </div>

            </div>

            {/* Bottom Row Layout: Badges & Timeline Achievements */}
            <div className="space-y-8 pt-4">
              
              {/* 1. Insignias Destacadas */}
              <Card animate={false} className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <h3 className="text-lg font-black text-[#0D2140] tracking-tight">
                    Insignias Destacadas
                  </h3>
                  <button 
                    onClick={() => alert("Abriendo colección completa de 28 insignias...")}
                    className="text-blue-500 hover:text-blue-700 text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver todas (28)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Badges Carousel/Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-center">
                  
                  {/* Badge 1 */}
                  <div className="flex flex-col items-center gap-3.5 group">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <Sparkles size={28} className="fill-purple-200" />
                    </div>
                    <span className="text-[9px] font-black text-[#0D2140] uppercase tracking-wider leading-snug">
                      MAESTRO DE ENLACES
                    </span>
                  </div>

                  {/* Badge 2 */}
                  <div className="flex flex-col items-center gap-3.5 group">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <CheckCircle size={28} className="fill-emerald-200" />
                    </div>
                    <span className="text-[9px] font-black text-[#0D2140] uppercase tracking-wider leading-snug">
                      QUÍMICO VELOZ
                    </span>
                  </div>

                  {/* Badge 3 */}
                  <div className="flex flex-col items-center gap-3.5 group">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <Shield size={28} className="fill-blue-200" />
                    </div>
                    <span className="text-[9px] font-black text-[#0D2140] uppercase tracking-wider leading-snug">
                      MENTE TEÓRICA
                    </span>
                  </div>

                  {/* Badge 4 (Locked) */}
                  <div className="flex flex-col items-center gap-3.5 opacity-40 group relative">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-gray-100 text-gray-400 flex items-center justify-center shadow-sm">
                      <FlaskConical size={28} />
                      <Lock size={12} className="absolute bottom-6 right-6 text-gray-500 fill-white" />
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-snug">
                      GENIO DE LAB
                    </span>
                  </div>

                  {/* Badge 5 (Locked) */}
                  <div className="flex flex-col items-center gap-3.5 opacity-40 group relative">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-gray-100 text-gray-400 flex items-center justify-center shadow-sm">
                      <Trophy size={28} />
                      <Lock size={12} className="absolute bottom-6 right-6 text-gray-500 fill-white" />
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-snug">
                      PERFECCIONISTA
                    </span>
                  </div>

                  {/* Badge 6 (Locked) */}
                  <div className="flex flex-col items-center gap-3.5 opacity-40 group relative">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-gray-100 text-gray-400 flex items-center justify-center shadow-sm">
                      <BookOpen size={28} />
                      <Lock size={12} className="absolute bottom-6 right-6 text-gray-500 fill-white" />
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-snug">
                      CRONISTA
                    </span>
                  </div>

                </div>
              </Card>

              {/* 2. Cronología de Logros */}
              <Card animate={false} className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white space-y-8">
                <h3 className="text-lg font-black text-[#0D2140] tracking-tight border-b border-gray-50 pb-4">
                  Cronología de Logros
                </h3>

                {/* Timeline container */}
                <div className="relative pl-8 border-l border-gray-100 space-y-8">
                  
                  {/* Timeline Item 1 */}
                  <div className="relative">
                    <div className="absolute left-[-38px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-[3.5px] border-white shadow-sm ring-4 ring-blue-50" />
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-[#0D2140]">Ascenso a Nivel 14</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ayer, 18:30</span>
                      </div>
                      <div className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-4.5 max-w-2xl">
                        <p className="text-xs italic text-blue-900 font-bold leading-relaxed">
                          "Has desbloqueado el módulo avanzado de Reactividad Orgánica."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative">
                    <div className="absolute left-[-38px] top-1.5 w-4 h-4 rounded-full bg-purple-500 border-[3.5px] border-white shadow-sm ring-4 ring-purple-50" />
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-[#0D2140]">Insignia "Químico Veloz" obtenida</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hace 3 días</span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-2xl">
                        Completaste 5 evaluaciones consecutivas en menos de 2 minutos cada una.
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="relative">
                    <div className="absolute left-[-38px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-[3.5px] border-white shadow-sm ring-4 ring-emerald-50" />
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-[#0D2140]">Módulo "Enlaces Atómicos" Completado</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hace 1 semana</span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-2xl">
                        Puntuación perfecta: 100/100 en el examen final del simulador 3D.
                      </p>
                    </div>
                  </div>

                </div>
              </Card>

            </div>

          </motion.div>
        ) : (
          
          /* Tab 2: Tareas Pendientes (The doubts interface) */
          <motion.div
            key="tab-tareas"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            
            {/* Left Area: Pending Doubts Grid (col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Revision Doubt Legend Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#EAFBF3] text-[#059669] text-[10px] font-black px-3.5 py-1.5 rounded-full border border-emerald-100/50 shadow-sm shrink-0">
                    8 TEMAS DE REVISIÓN
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Marcados con "Tengo dudas aquí"
                  </span>
                </div>
              </div>

              {/* Sub filters header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {['Todos', 'Química Orgánica', 'Enlace Químico'].map((filter, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedFilter(filter)}
                      className={cn(
                        "px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer select-none",
                        selectedFilter === filter 
                          ? "bg-white text-[#0D2140] shadow-sm border border-gray-100" 
                          : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pr-2 sm:pr-0 self-end sm:self-auto">
                  <button 
                    onClick={() => alert("Abriendo filtros de ordenamiento...")}
                    className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#0D2140] shadow-sm cursor-pointer transition-colors"
                  >
                    <SlidersHorizontal size={14} />
                  </button>
                  <button 
                    onClick={() => alert("Abriendo vista de calendario de entregas...")}
                    className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#0D2140] shadow-sm cursor-pointer transition-colors"
                  >
                    <Calendar size={14} />
                  </button>
                </div>
              </div>

              {/* Grid Tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {filteredTasks.map(task => (
                  <Card key={task.id} animate={false} className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col justify-between min-h-[360px] relative overflow-hidden group">
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", task.iconBg)}>
                          <task.icon size={22} />
                        </div>
                        <span className={cn("text-[9px] font-black uppercase px-3 py-1 rounded-full", task.difficultyColor)}>
                          {task.difficulty}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-base font-black text-[#0D2140] tracking-tight leading-snug group-hover:text-[#004B76] transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {task.date}
                        </p>
                      </div>

                      <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-gray-50 mt-6">
                      <button
                        onClick={() => alert(`Cargando lección multimedia para repasar: ${task.title}`)}
                        className="w-full bg-[#004B76] hover:bg-[#003B5C] text-white font-black py-3.5 rounded-2xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-950/10"
                      >
                        <span>Repasar ahora</span>
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => alert(`Solicitud de ayuda con tutor enviada para: ${task.title}`)}
                          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-[#0D2140] font-black py-2.5 rounded-xl transition-all active:scale-95 text-xs flex items-center justify-center cursor-pointer"
                        >
                          <span>Solicitar ayuda</span>
                        </button>
                        <button
                          onClick={() => alert(`¡Tema marcado como aprendido: ${task.title}! ¡Excelente trabajo!`)}
                          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-[#0D2140] font-black py-2.5 rounded-xl transition-all active:scale-95 text-xs flex items-center justify-center cursor-pointer"
                        >
                          <span>Entendido</span>
                        </button>
                      </div>
                    </div>

                  </Card>
                ))}

                {/* Manual Add Card */}
                {selectedFilter === 'Todos' && (
                  <button
                    onClick={() => alert("Mostrando modal de 'Agregar duda manualmente'...")}
                    className="border-2 border-dashed border-gray-200 hover:border-[#004B76] rounded-[2.5rem] p-8 flex flex-col items-center justify-center min-h-[360px] transition-all group bg-white cursor-pointer select-none"
                  >
                    <div className="w-12 h-12 rounded-full border border-gray-200 group-hover:border-[#004B76]/30 bg-gray-50 group-hover:bg-blue-50/50 flex items-center justify-center transition-all">
                      <Plus size={20} className="text-gray-400 group-hover:text-[#004B76] transition-colors" />
                    </div>
                    <span className="text-xs font-black text-gray-400 group-hover:text-[#004B76] tracking-tight mt-4 transition-colors">
                      Agregar nueva duda manualmente
                    </span>
                  </button>
                )}

              </div>

            </div>

            {/* Right Sidebar Area (col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Recomendación IA */}
              <Card animate={false} className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Sparkles size={18} className="fill-purple-100" />
                  </div>
                  <h4 className="text-sm font-black text-[#0D2140] tracking-tight">
                    Recomendación IA
                  </h4>
                </div>

                <p className="text-xs text-gray-500 font-semibold leading-relaxed italic">
                  "Basado en tus dudas recurrentes sobre termodinámica, te sugerimos repasar la Ley de Hess antes de tu próximo simulador."
                </p>

                <button 
                  onClick={() => alert("Abriendo Guía de Apoyo sobre la Ley de Hess...")}
                  className="w-full bg-[#78F0C4] hover:bg-[#5ce0b2] text-[#0A3D2A] font-black py-3 rounded-full transition-all active:scale-95 text-xs text-center cursor-pointer shadow-sm mt-2 block select-none"
                >
                  Explorar Guía de Apoyo
                </button>
              </Card>

              {/* Próxima Sesión */}
              <Card animate={false} className="p-5 border border-gray-100 shadow-sm rounded-3xl bg-gray-50/50 space-y-4">
                <h5 className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  PRÓXIMA SESIÓN
                </h5>

                <div className="flex items-center gap-4 bg-white border border-gray-100/50 p-3 rounded-2xl shadow-sm">
                  <div className="w-14 h-14 bg-purple-50 border border-purple-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-[8px] font-black text-purple-600 uppercase tracking-wider mb-0.5">OCT</span>
                    <span className="text-lg font-black text-[#0D2140] leading-none">18</span>
                  </div>
                  <div className="space-y-1">
                    <h6 className="text-xs font-black text-[#0D2140]">
                      Repaso Orgánica II
                    </h6>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                      16:30 PM • Con Prof. Aranda
                    </p>
                  </div>
                </div>
              </Card>

              {/* Iniciar Repaso Inteligente */}
              <div 
                onClick={() => alert("Iniciando repaso inteligente potenciado por algoritmos...")}
                className="p-6 bg-gradient-to-br from-[#004B76] to-[#002D4A] border border-cyan-950/20 text-white rounded-3xl shadow-premium hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] text-center select-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <Bot size={24} className="text-cyan-300" />
                </div>
                <h4 className="text-sm font-black tracking-tight mt-3.5">
                  Iniciar Repaso Inteligente
                </h4>
                <span className="text-[8px] font-black text-cyan-300 uppercase tracking-widest mt-1 block">
                  POTENCIADO POR ALGORITMOS
                </span>
              </div>

              {/* Motivational science beaker backdrop card */}
              <div className="relative h-48 rounded-3xl overflow-hidden shadow-premium select-none group">
                <img 
                  src="/assets/perseverance_beaker.png" 
                  alt="La perseverancia es el reactivo que acelera el éxito" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/90 via-cyan-950/30 to-transparent" />
                <p className="absolute bottom-5 left-5 right-5 text-xs font-black text-white leading-snug tracking-wide">
                  "La perseverancia es el reactivo que acelera el éxito."
                </p>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analytics;
