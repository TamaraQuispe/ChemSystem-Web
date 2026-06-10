import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FlaskConical, 
  Beaker, 
  Atom, 
  ChevronRight, 
  ChevronDown,
  Award, 
  Flame, 
  FileText,
  CalendarDays
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAuthStore } from '../../store/authStore';

const weeklyData = [
  { day: 'L', xp: 55 },
  { day: 'M', xp: 85 },
  { day: 'X', xp: 35 },
  { day: 'J', xp: 75 },
  { day: 'V', xp: 50 },
  { day: 'S', xp: 15 },
  { day: 'D', xp: 5 },
];

const Home = () => {
  const { user } = useAuthStore();
  const userName = user?.name || 'Usuario';
  const userLevel = user?.level ?? 1;
  const userXp = user?.xp ?? 0;

  return (
    <div className="space-y-10 pb-16">
      
      <div className="space-y-1.5">
        <h1 className="text-4xl font-extrabold text-[#0D2140] tracking-tight">
          Bienvenido, {userName}
        </h1>
        <p className="text-base text-gray-500 font-medium">
          Tu camino hacia la excelencia química continúa hoy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8">
          <Card 
            animate={true} 
            className="w-full relative overflow-hidden bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between min-h-[220px] h-full"
          >
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-44 h-44 flex items-center justify-center opacity-100 pointer-events-none overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-36 h-36 text-gray-100/50 fill-gray-50/20 stroke-gray-200/30 stroke-[1.5]">
                <polygon points="50,2 91.6,26 91.6,74 50,98 8.4,74 8.4,26" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div>
                <p className="text-xs font-black text-[#0066FF] uppercase tracking-[0.2em] mb-2.5">
                  MÓDULO ACTUAL
                </p>
                <h2 className="text-3xl font-extrabold text-[#0D2140] tracking-tight">
                  Cinética Química y Equilibrio
                </h2>
              </div>

              <div className="flex items-center gap-8 pr-40">
                <div className="flex-grow">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200/20">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '68%' }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-[#004B76] rounded-full" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <span className="text-4xl font-extrabold text-[#004B76] tracking-tighter">68%</span>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
          
          <Card 
            animate={true} 
            delay={0.1}
            className="flex items-center gap-5 bg-gray-50 border border-gray-100 p-6 rounded-3xl shadow-sm flex-1"
          >
            <div className="w-14 h-14 bg-[#004B76] text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-[#004B76]/10">
              <Award size={26} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">
                XP Acumulado
              </p>
              <p className="text-2xl font-black text-[#0D2140]">
                {userXp.toLocaleString()} XP
              </p>
            </div>
          </Card>

          <Card 
            animate={true} 
            delay={0.2}
            className="flex items-center gap-5 bg-[#90F8C7] border border-transparent p-6 rounded-3xl shadow-sm flex-1"
          >
            <div className="w-14 h-14 bg-white/40 text-[#15462D] rounded-2xl flex items-center justify-center shrink-0">
              <Flame size={26} className="fill-current stroke-[2]" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-[#1E523A] uppercase tracking-widest mb-0.5">
                Nivel Actual
              </p>
              <p className="text-2xl font-black text-[#15462D]">
                Nivel {userLevel}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-extrabold text-[#0D2140] tracking-tight">
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          <Link to="/lessons" className="group block h-full">
            <Card 
              animate={true} 
              delay={0.1}
              className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all text-center h-full group-hover:scale-[1.02] duration-200"
            >
              <div className="w-14 h-14 bg-[#E8F1FF] text-[#0066FF] rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <BookOpen size={24} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[#0D2140] text-sm md:text-base tracking-tight">
                Micro-lecciones
              </span>
            </Card>
          </Link>

          <Link to="/simulators/catalysis" className="group block h-full">
            <Card 
              animate={true} 
              delay={0.15}
              className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all text-center h-full group-hover:scale-[1.02] duration-200"
            >
              <div className="w-14 h-14 bg-[#EAFBF3] text-[#10B981] rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <FlaskConical size={24} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[#0D2140] text-sm md:text-base tracking-tight">
                Laboratorio Virtual
              </span>
            </Card>
          </Link>

          <Link to="/molecular/builder" className="group block h-full">
            <Card 
              animate={true} 
              delay={0.2}
              className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all text-center h-full group-hover:scale-[1.02] duration-200"
            >
              <div className="w-14 h-14 bg-[#F5ECFF] text-[#8B5CF6] rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Beaker size={24} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[#0D2140] text-sm md:text-base tracking-tight">
                Sandbox Privado
              </span>
            </Card>
          </Link>

          <Link to="/simulators" className="group block h-full">
            <Card 
              animate={true} 
              delay={0.25}
              className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all text-center h-full group-hover:scale-[1.02] duration-200"
            >
              <div className="w-14 h-14 bg-[#F3F4F6] text-[#6B7280] rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Atom size={24} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[#0D2140] text-sm md:text-base tracking-tight">
                Simuladores
              </span>
            </Card>
          </Link>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8">
          <Card 
            animate={true} 
            className="w-full bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between min-h-[350px] h-full"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-[#0D2140] tracking-tight">
                Progreso Semanal
              </h3>
              
              <div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                  Últimos 7 días
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="flex-grow h-60 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#004B76" />
                      <stop offset="100%" stopColor="#005B8F" />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }}
                  />
                  <YAxis hide={true} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar 
                    dataKey="xp" 
                    fill="url(#blueGradient)" 
                    radius={[10, 10, 10, 10]} 
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
          
          <div className="space-y-4">
            <h4 className="text-xl font-extrabold text-[#0D2140] tracking-tight">
              Próximas Tareas
            </h4>
            
            <div className="space-y-3">
              <Link to="/lessons" className="block group">
                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow transition-all group-hover:scale-[1.01]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E8F1FF] text-[#0066FF] rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen size={20} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-[#0D2140] tracking-tight">
                        Micro-lección: Estructura del Átomo
                      </h5>
                      <p className="text-xs text-gray-400 font-medium">
                        Continúa donde lo dejaste
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link to="/simulators/catalysis" className="block group">
                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow transition-all group-hover:scale-[1.01]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#EAFBF3] text-[#10B981] rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={20} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-[#0D2140] tracking-tight">
                        Informe de Lab
                      </h5>
                      <p className="text-xs text-gray-400 font-medium">
                        Sábado, 23:59 PM
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>

          <Card 
            animate={true} 
            delay={0.3}
            className="bg-gradient-to-r from-[#905DF6] to-[#7B3FE4] text-white p-5 rounded-[2rem] shadow-sm flex flex-col justify-between"
          >
            <p className="text-[10px] font-black text-purple-200 tracking-[0.2em] uppercase mb-4">
              ÚLTIMA INSIGNIA
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#7B3FE4] shrink-0 shadow-md">
                <Award size={28} className="stroke-[2.5]" />
              </div>
              <div>
                <h5 className="text-base font-extrabold leading-tight">
                  Maestro de Enlaces
                </h5>
                <p className="text-xs text-purple-200 font-medium">
                  Obtenida recientemente
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-400">
        <div>
          © 2024 ChemSystem Platform · Editorial Científico High-End
        </div>
        <div className="flex gap-6">
          <a href="#privacidad" className="hover:text-gray-600 transition-colors">Privacidad</a>
          <a href="#terminos" className="hover:text-gray-600 transition-colors">Términos</a>
          <a href="#soporte" className="hover:text-gray-600 transition-colors">Soporte Académico</a>
        </div>
      </div>

    </div>
  );
};

export default Home;
