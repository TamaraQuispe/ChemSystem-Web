import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FlaskConical, 
  Beaker, 
  Atom, 
  ChevronRight, 
  Filter,
  LayoutGrid,
  Play,
  HelpCircle,
  Lock,
  Flame,
  Award
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

// Data for Mis Módulos
const microLessons = [
  {
    id: 1,
    title: 'Química Orgánica',
    category: 'INTERMEDIO',
    duration: '20 MIN',
    description: 'Hidrocarburos aromáticos y la estabilidad del anillo de benceno.',
    status: 'en-curso',
    imgUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop&q=80',
    students: [
      { name: 'Sofia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' },
      { name: 'Lucas', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas' }
    ],
    studentCount: 12
  },
  {
    id: 2,
    title: 'Estequiometría',
    category: 'BÁSICO',
    duration: '15 MIN',
    description: 'Cálculos de masa-masa y el concepto fundamental del mol.',
    status: 'completado',
    imgUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=80',
    progress: 100
  },
  {
    id: 3,
    title: 'Termodinámica',
    category: 'AVANZADO',
    duration: '25 MIN',
    description: 'Entalpía, Entropía y las Leyes que rigen el universo molecular.',
    status: 'en-curso',
    imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    students: [
      { name: 'Mateo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo' }
    ]
  },
  {
    id: 4,
    title: 'Enlaces Químicos',
    category: 'INTERMEDIO',
    duration: '18 MIN',
    description: 'Electronegatividad y la danza de electrones en el enlace covalente.',
    status: 'bloqueado',
    imgUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
    unlockReq: "Completa 'Ácidos y Bases' para desbloquear"
  },
  {
    id: 5,
    title: 'Ácidos y Bases',
    category: 'INTERMEDIO',
    duration: '22 MIN',
    description: 'Teoría de Brønsted-Lowry y la escala logarítmica del pH en soluciones.',
    status: 'en-curso',
    imgUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&auto=format&fit=crop&q=80',
    students: [
      { name: 'Elena', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' }
    ]
  }
];

const weeklyData = [
  { day: 'LUN', val: '25%', active: false },
  { day: 'MAR', val: '45%', active: false },
  { day: 'MIE', val: '20%', active: false },
  { day: 'JUE', val: '70%', active: false },
  { day: 'VIE', val: '90%', active: true },
  { day: 'SAB', val: '50%', active: false },
  { day: 'DOM', val: '15%', active: false },
];

const ModulesPage = () => {
  return (
    <div className="space-y-10 pb-16 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-text-main tracking-tight">Mis Módulos de Aprendizaje</h2>
          <p className="text-text-secondary text-sm font-semibold">
            Explora tus lecciones académicas regulares y sigue tu progreso de estudio.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-[#EAFBF3] rounded-full border border-emerald-100/50 shadow-sm text-xs font-black text-[#059669]">
            <Flame size={16} className="fill-[#10B981] text-[#10B981] animate-pulse" />
            <span>24 Días Racha</span>
          </div>
        </div>
      </div>

      {/* 1. Recommended Banner */}
      <div 
        className="relative overflow-hidden rounded-[2.5rem] p-12 min-h-[320px] flex flex-col justify-center text-white bg-cover bg-center shadow-lg border border-gray-100/10"
        style={{ backgroundImage: `url('/assets/organic_chemistry_banner.png')` }}
      >
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1829]/95 via-[#0d233a]/75 to-transparent" />
        
        <div className="relative z-10 space-y-5 max-w-2xl">
          <div>
            <span className="bg-[#EAFBF3]/90 text-[#0f766e] border border-transparent font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-widest inline-block shadow-sm">
              ✨ RECOMENDADO PARA TI
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Dominando la Química Orgánica
          </h2>
          
          <p className="text-base text-gray-200/90 font-medium leading-relaxed">
            Explora las cadenas de carbono y grupos funcionales a través de simulaciones interactivas de alta gama.
          </p>
          
          <div className="flex gap-4 pt-2">
            <Link to="/quizzes/molecular">
              <button className="bg-[#004B76] hover:bg-[#003B5C] text-white font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm cursor-pointer select-none">
                Continuar Módulo
              </button>
            </Link>
            <button 
              onClick={() => alert("Abriendo detalles del módulo de Química Orgánica...")}
              className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-black px-6 py-3 rounded-xl transition-all active:scale-95 text-sm cursor-pointer select-none"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>

      {/* 2. Micro-Lecciones Section Header */}
      <div className="flex justify-between items-center mt-12">
        <div>
          <h3 className="text-2xl font-black text-[#0D2140] tracking-tight">
            Micro-Lecciones
          </h3>
          <p className="text-gray-400 text-xs font-semibold mt-1">
            Contenido atómico para un aprendizaje exponencial.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => alert("Abriendo filtros de lecciones...")}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0D2140] hover:bg-gray-50 transition-colors cursor-pointer select-none"
          >
            <Filter size={18} />
          </button>
          <button 
            onClick={() => alert("Cambiando vista de cuadrícula...")}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0D2140] hover:bg-gray-50 transition-colors cursor-pointer select-none"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* 3. Micro-Lecciones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {microLessons.map((lesson) => (
          <div 
            key={lesson.id}
            className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full group"
          >
            {/* Card Header (Image with Badge or Lock overlay) */}
            <div className="relative h-44 w-full bg-gray-50 overflow-hidden">
              <img 
                src={lesson.imgUrl} 
                alt={lesson.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              
              {/* Badge for status */}
              {lesson.status === 'en-curso' && (
                <span className="absolute top-4 left-4 bg-blue-50 text-[#0066FF] text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-transparent shadow-sm">
                  • EN CURSO
                </span>
              )}
              {lesson.status === 'completado' && (
                <span className="absolute top-4 left-4 bg-[#EAFBF3] text-[#10B981] text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-transparent shadow-sm">
                  ✓ COMPLETADO
                </span>
              )}

              {/* Locked overlay */}
              {lesson.status === 'bloqueado' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-2">
                    <Lock size={18} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    BLOQUEADO
                  </span>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-6.5 flex-grow flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-black text-gray-400 tracking-wider">
                  {lesson.category} • {lesson.duration}
                </p>
                <h4 className="text-base font-black text-[#0D2140] tracking-tight mt-1.5 mb-2 group-hover:text-primary transition-colors">
                  {lesson.title}
                </h4>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed line-clamp-2">
                  {lesson.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="border-t border-gray-50 pt-4 mt-6 flex items-center justify-between">
                
                {/* Left side: profiles, progress, lock note */}
                <div className="flex-grow">
                  {lesson.status === 'en-curso' && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {lesson.students?.map((student, idx) => (
                          <img 
                            key={idx} 
                            src={student.avatar} 
                            alt={student.name}
                            className="w-6 h-6 rounded-full border border-white bg-gray-50"
                          />
                        ))}
                      </div>
                      {lesson.studentCount && (
                        <span className="text-[9px] text-gray-400 font-black">
                          +{lesson.studentCount}
                        </span>
                      )}
                    </div>
                  )}

                  {lesson.status === 'completado' && (
                    <div className="pr-4">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-[#10B981] rounded-full" />
                      </div>
                    </div>
                  )}

                  {lesson.status === 'bloqueado' && (
                    <p className="text-[8.5px] text-gray-400 font-bold leading-tight">
                      {lesson.unlockReq}
                    </p>
                  )}
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => alert(`Obteniendo ayuda para la lección: ${lesson.title}`)}
                    className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-[#0D2140] hover:bg-gray-50 transition-colors cursor-pointer select-none"
                  >
                    <HelpCircle size={15} />
                  </button>
                  
                  {lesson.status !== 'bloqueado' && (
                    <Link to="/quizzes/molecular">
                      <button className="w-8 h-8 rounded-full bg-[#004B76] text-white flex items-center justify-center shadow-md shadow-[#004B76]/10 hover:bg-[#003B5C] transition-all active:scale-90 cursor-pointer select-none">
                        <Play size={12} fill="currentColor" className="ml-0.5" />
                      </button>
                    </Link>
                  )}
                </div>

              </div>
            </div>

          </div>
        ))}
      </div>

      {/* 4. Bottom Row: Tu Semanal Atómico & Desafío del Día */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Tu Semanal Atómico */}
        <div className="lg:col-span-8">
          <Card 
            animate={false} 
            className="w-full bg-gray-50/50 border border-gray-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between min-h-[320px] h-full"
          >
            {/* Header with Circular Progress */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-[#0D2140] tracking-tight">
                  Tu Semanal Atómico
                </h3>
                <p className="text-gray-400 text-xs font-semibold mt-1">
                  Has completado 4 micro-lecciones más que la semana pasada.
                </p>
              </div>

              {/* Circular Progress (75%) */}
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="22" className="text-gray-200" strokeWidth="4.5" stroke="currentColor" fill="transparent" />
                  <circle cx="28" cy="28" r="22" className="text-[#10B981]" strokeWidth="4.5" strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - 0.75)} strokeLinecap="round" stroke="currentColor" fill="transparent" />
                </svg>
                <span className="absolute text-[11px] font-black text-[#0D2140]">
                  75%
                </span>
              </div>
            </div>

            {/* Custom Bar Chart representing mockup exactly */}
            <div className="flex justify-between items-end h-32 px-4 mt-8">
              {weeklyData.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 flex-1">
                  <div className="h-20 w-full flex items-end justify-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: d.val }}
                      transition={{ duration: 1, delay: idx * 0.08 }}
                      className={cn(
                        "w-5 rounded-full",
                        d.active ? "bg-[#004B76]" : "bg-gray-200"
                      )}
                    />
                  </div>
                  <span className="text-[9px] font-black text-gray-400">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>

          </Card>
        </div>

        {/* Desafío del Día */}
        <div className="lg:col-span-4">
          <Card 
            animate={false} 
            className="w-full bg-[#004B76] text-white p-8 rounded-[2.5rem] shadow-premium flex flex-col justify-between min-h-[320px] h-full relative overflow-hidden"
          >
            {/* Decorative flask beaker */}
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-10 pointer-events-none translate-x-6 translate-y-6">
              <FlaskConical className="w-full h-full text-white" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div>
                <p className="text-[9px] font-black text-teal-300 tracking-[0.2em] uppercase mb-4">
                  🚨 DESAFÍO DEL DÍA
                </p>
                <h4 className="text-xl font-black tracking-tight leading-tight">
                  Desafío del Día
                </h4>
                <p className="text-xs text-blue-100/80 leading-relaxed font-semibold mt-2">
                  Completa el simulador de Titulación Ácido-Base para ganar un emblema exclusivo.
                </p>
              </div>

              <div>
                <p className="text-xs font-black text-[#78F0C4] tracking-wider mb-4">
                  🏆 RECOMPENSA: +500 XP
                </p>
                <Link to="/quizzes/molecular">
                  <button className="w-full py-4 bg-[#78F0C4] hover:bg-[#5CE5B5] text-[#1E523A] rounded-2xl font-black text-xs transition-all active:scale-[0.98] shadow-md shadow-[#78F0C4]/10 cursor-pointer select-none">
                    Iniciar Desafío
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default ModulesPage;
