import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  CheckCircle2, 
  Award, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  User, 
  Calendar, 
  Clock, 
  Check, 
  BookOpen, 
  ChevronRight, 
  GraduationCap,
  Lightbulb,
  FileText
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';

// Weekly Study Data (Martes, Jueves, Domingo active)
const WEEK_DATA = [
  { name: 'LUN', hours: 1.0, active: false },
  { name: 'MAR', hours: 3.5, active: true },
  { name: 'MIE', hours: 1.5, active: false },
  { name: 'JUE', hours: 4.0, active: true },
  { name: 'VIE', hours: 1.2, active: false },
  { name: 'SAB', hours: 0.8, active: false },
  { name: 'DOM', hours: 5.2, active: true }
];

// Achievements Timeline list
const ACHIEVEMENTS = [
  {
    id: 1,
    title: 'Ascenso a Nivel 14',
    time: 'Ayer, 18:30',
    type: 'level',
    iconColor: 'bg-blue-500 text-white',
    description: '"Has desbloqueado el módulo avanzado de Reactividad Orgánica."',
    bubble: true
  },
  {
    id: 2,
    title: 'Insignia "Químico Veloz" obtenida',
    time: 'Hace 3 días',
    type: 'badge',
    iconColor: 'bg-purple-500 text-white',
    description: 'Completaste 5 evaluaciones consecutivas en menos de 2 minutos cada una.',
    bubble: false
  },
  {
    id: 3,
    title: 'Módulo "Enlaces Atómicos" Completado',
    time: 'Hace 1 semana',
    type: 'module',
    iconColor: 'bg-emerald-500 text-white',
    description: 'Puntuación perfecta: 100/100 en el examen final del simulador 3D.',
    bubble: false
  }
];

// Badges list
const BADGES = [
  { id: 'enlaces', label: 'MAESTRO DE ENLACES', color: 'bg-purple-100 text-purple-600', icon: Sparkles, active: true },
  { id: 'veloz', label: 'QUÍMICO VELOZ', color: 'bg-emerald-100 text-emerald-600', icon: ZapIcon, active: true },
  { id: 'teorico', label: 'MENTE TEÓRICA', color: 'bg-blue-100 text-blue-600', icon: GraduationCap, active: true },
  { id: 'lab', label: 'GENIO DE LAB', color: 'bg-gray-50 text-gray-400', icon: Lightbulb, active: false },
  { id: 'perfeccionista', label: 'PERFECCIONISTA', color: 'bg-gray-50 text-gray-400', icon: Trophy, active: false },
  { id: 'cronista', label: 'CRONISTA', color: 'bg-gray-50 text-gray-400', icon: FileText, active: false }
];

// Daily Challenges
const CHALLENGES = [
  { id: 1, title: 'Nombrar Alquenos', desc: 'Completo · +50 XP', status: 'completed' },
  { id: 2, title: 'Simular Enlace Covalente', desc: 'En curso · +75 XP', status: 'active' },
  { id: 3, title: '3 Quiz de Estequiometría', desc: 'Pendiente · +120 XP', status: 'pending' }
];

// Helper Zap/speed icon since Lucide Zap matches Químico Veloz
function ZapIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const AIPathPage = () => {
  return (
    <div className="max-w-[1400px] mx-auto pb-20 space-y-8 select-none">
      
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-[#0D2140] tracking-tight">
          Perfil Premium
        </h1>
        <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50/50 rounded-full px-4.5 py-1.5 text-[10px] font-black text-emerald-600 tracking-widest uppercase">
          <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
          24 Días Racha
        </div>
      </div>

      {/* Grid: Left Main Section, Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Julián Schmidt Profile Card */}
          <Card className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            
            {/* Left side: glowing avatar frame */}
            <div className="relative shrink-0 select-none">
              <div className="w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative">
                <div className="w-full h-full rounded-full bg-white p-1 flex items-center justify-center overflow-hidden">
                  
                  {/* High fidelity SVG illustrated profile portrait */}
                  <svg className="w-full h-full text-slate-300" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="45" r="22" fill="#E2E8F0" />
                    <path d="M50 12c-19.33 0-35 15.67-35 35a34.86 34.86 0 0 0 7.82 22.06c2.47-5.83 8.16-9.92 14.8-10.45A25 25 0 0 1 50 56a25 25 0 0 1 12.38 3.25c6.64.53 12.33 4.62 14.8 10.45A34.86 34.86 0 0 0 85 47c0-19.33-15.67-35-35-35Z" fill="#CBD5E1" />
                    {/* Chemistry student suit detailing */}
                    <path d="M40 70 L50 82 L60 70 Z" fill="#004B76" />
                    <circle cx="50" cy="42" r="18" fill="#F1F5F9" className="opacity-10" />
                  </svg>

                </div>
              </div>
              
              {/* Level Badge floating below avatar */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#5B21B6] text-white text-[9px] font-black px-3.5 py-1 rounded-full border-2 border-white shadow-md uppercase tracking-wider">
                LVL 14
              </div>
            </div>

            {/* Right side: details */}
            <div className="flex-grow space-y-4 text-center md:text-left w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-3">
                <h2 className="text-3xl font-black text-[#0D2140] tracking-tight">
                  Julián Schmidt
                </h2>
                <span className="bg-[#E2F1FF] text-[#0066CC] text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shrink-0 self-center">
                  MIEMBRO PREMIUM
                </span>
              </div>
              
              <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-xl">
                Investigador Senior de Estructuras Moleculares · Estudiante de Ingeniería Química
              </p>

              {/* Progress Bar level */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <span>Progreso de Nivel</span>
                  <span className="text-slate-800 font-bold">1,250 / 2,000 XP</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '62.5%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#004B76]"
                  />
                </div>
              </div>
            </div>

          </Card>

          {/* 2. Racha Semanal Card (Activity Hours) */}
          <Card className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#0D2140] tracking-tight">
                  Racha Semanal
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  Actividad de estudio en los últimos 7 días
                </p>
              </div>
              
              {/* Dropdown filter */}
              <div className="bg-white border border-gray-200 text-gray-600 font-black px-4 py-2.5 rounded-xl text-[10px] tracking-wider uppercase shadow-sm flex items-center gap-1 cursor-pointer">
                <span>Esta semana</span>
                <span className="text-gray-400 text-xs">▼</span>
              </div>
            </div>

            {/* Custom Recharts Bar chart representation matching mockup */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEK_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 10 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-lg border border-white/5 uppercase tracking-wider">
                            {payload[0].value} Horas
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="hours" radius={[10, 10, 10, 10]} barSize={28}>
                    {WEEK_DATA.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.active ? '#004B76' : '#E2E8F0'} 
                        className="transition-colors duration-300 hover:opacity-90 cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 3. Insignias Destacadas Grid */}
          <Card className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#0D2140] tracking-tight">
                Insignias Destacadas
              </h3>
              <button 
                onClick={() => alert("Mostrando las 28 insignias académicas en tu vitrina de logros.")}
                className="text-primary hover:text-primary-dark font-black text-[10px] tracking-widest uppercase flex items-center gap-1.5 cursor-pointer"
              >
                Ver todas (28) →
              </button>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 pt-2">
              {BADGES.map((badge) => (
                <div 
                  key={badge.id}
                  className={`flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                    badge.active ? 'hover:bg-gray-50/50' : 'opacity-40'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm relative ${
                    badge.active ? badge.color : 'bg-gray-100 text-gray-400'
                  }`}>
                    <badge.icon size={22} className="stroke-[2.2]" />
                    {badge.active && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary border-2 border-white rounded-full" />
                    )}
                  </div>
                  <span className={`text-[8px] font-black tracking-wider text-center leading-snug uppercase ${
                    badge.active ? 'text-[#0D2140]' : 'text-gray-400'
                  }`}>
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* 4. Cronología de Logros (Timeline) */}
          <Card className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white space-y-8">
            <h3 className="text-base font-black text-[#0D2140] tracking-tight">
              Cronología de Logros
            </h3>

            {/* Vertical timeline body */}
            <div className="relative pl-6 md:pl-8 space-y-8 pb-4">
              
              {/* Vertical timeline wire */}
              <div className="absolute top-2 bottom-2 left-[11px] md:left-[15px] w-0.5 bg-gray-100" />

              {ACHIEVEMENTS.map((item) => (
                <div key={item.id} className="relative space-y-3 group">
                  
                  {/* Circle timeline bullet */}
                  <div className={`absolute left-[-21px] md:left-[-25px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white shadow-sm transition-all duration-300 group-hover:scale-110 z-10 ${
                    item.type === 'level' ? 'bg-blue-500' :
                    item.type === 'badge' ? 'bg-purple-500' : 'bg-emerald-500'
                  }`} />

                  {/* Title and Date row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <h4 className="text-xs font-black text-[#0D2140] tracking-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase">
                      {item.time}
                    </span>
                  </div>

                  {/* Content or Speech bubble */}
                  {item.bubble ? (
                    <div className="bg-[#F4F9FF] border border-blue-100/40 rounded-2xl p-4.5 text-xs text-blue-700 font-bold italic shadow-sm relative max-w-lg">
                      {item.description}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold pr-4">
                      {item.description}
                    </p>
                  )}

                </div>
              ))}

            </div>
          </Card>

        </div>

        {/* Right Column / Sidebar (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* A. Mini Stats grid (2x2) */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Ranking Global */}
            <Card className="p-6 border border-gray-100 shadow-sm bg-white rounded-3xl space-y-3 flex flex-col justify-between hover:shadow-premium transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Trophy size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="text-3xl font-black text-slate-800 tracking-tight">#4</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">RANKING GLOBAL</p>
              </div>
            </Card>

            {/* Módulos OK */}
            <Card className="p-6 border border-gray-100 shadow-sm bg-white rounded-3xl space-y-3 flex flex-col justify-between hover:shadow-premium transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="text-3xl font-black text-slate-800 tracking-tight">142</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">MÓDULOS OK</p>
              </div>
            </Card>

            {/* Insignias (Purple card) */}
            <Card className="p-6 border-none shadow-premium bg-[#925DF6] text-white rounded-3xl space-y-3 flex flex-col justify-between hover:brightness-105 transition-all">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Award size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="text-3xl font-black tracking-tight">28</p>
                <p className="text-[8px] font-black text-white/70 uppercase tracking-widest">INSIGNIAS</p>
              </div>
            </Card>

            {/* Racha Días (Green card) */}
            <Card className="p-6 border-none shadow-premium bg-[#10B981] text-white rounded-3xl space-y-3 flex flex-col justify-between hover:brightness-105 transition-all">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Flame size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="text-3xl font-black tracking-tight">24</p>
                <p className="text-[8px] font-black text-white/70 uppercase tracking-widest">RACHA DÍAS</p>
              </div>
            </Card>

          </div>

          {/* B. Desafíos Diarios Card */}
          <Card className="p-8 border border-gray-100 shadow-sm rounded-[2.5rem] bg-white space-y-6">
            <h3 className="text-sm font-black text-gray-800 tracking-tight">
              Desafíos Diarios
            </h3>

            {/* Challenges list */}
            <div className="space-y-4">
              {CHALLENGES.map((challenge) => (
                <div 
                  key={challenge.id}
                  className="flex items-center justify-between p-3.5 bg-gray-50/70 border border-gray-100 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      challenge.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-white border border-gray-200 text-gray-400'
                    }`}>
                      {challenge.status === 'completed' ? (
                        <Check size={14} className="stroke-[3]" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-[#0D2140] tracking-tight">{challenge.title}</p>
                      <p className={`text-[8px] font-bold uppercase mt-0.5 ${
                        challenge.status === 'completed' ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        {challenge.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ver todos button */}
            <button 
              onClick={() => alert("Cargando catálogo completo de desafíos semanales y diarios.")}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-black py-3 rounded-xl transition-all active:scale-95 text-xs shadow-sm cursor-pointer text-center block"
            >
              Ver todos
            </button>

          </Card>

        </div>

      </div>

    </div>
  );
};

export default AIPathPage;
