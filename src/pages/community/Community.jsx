import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smile, 
  Send, 
  Paperclip, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles,
  Search
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const Community = () => {
  return (
    <div className="space-y-8 select-none">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#0D2140] tracking-tight">Comunidad de Colaboración</h2>
          <p className="text-gray-500 text-base font-semibold">
            Coordina apoyos académicos en tiempo real con docentes, alumnos y tutores.
          </p>
        </div>
      </div>

      {/* 2. Page Navigation Tabs (Matched perfectly with Analytics tabs style) */}
      <div className="flex justify-start border-b border-gray-100 mb-8 relative z-10">
        <div className="flex items-center gap-8 sm:gap-10 h-12">
          {['Ruta', 'Dashboard', 'Portal', 'Colaboración'].map((tab) => (
            <button
              key={tab}
              className={cn(
                "relative pb-3 text-sm font-black tracking-wider transition-colors cursor-pointer",
                tab === 'Colaboración' ? "text-[#0D2140]" : "text-gray-400 hover:text-[#0D2140]/70"
              )}
            >
              {tab}
              {tab === 'Colaboración' && (
                <motion.div 
                  layoutId="communityActiveTabLine" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#004B76]" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contexto del Alumno (lg:col-span-3) */}
        <aside className="lg:col-span-3 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contexto del Alumno</h3>
            <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-white space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#8B5CF6] shrink-0">
                  <Smile size={24} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-[#0D2140] tracking-tight">Santiago Méndez</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Estudiante de Química II</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100/50 space-y-2">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Estado de Frustración</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-red-700">Elevado (82%)</span>
                  <TrendingUp size={16} className="text-red-500" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/50 space-y-2">
                <p className="text-[10px] font-black text-[#059669] uppercase tracking-widest">Último Hito</p>
                <p className="text-xs font-black text-[#0D2140]">Dominio de Enlaces Covalentes</p>
              </div>

            </Card>
          </div>

          {/* Progress Wall images */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Muro de Avances</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              
              <div className="relative group rounded-3xl overflow-hidden aspect-video cursor-pointer border border-gray-100">
                <img src="https://images.unsplash.com/photo-1532187875302-1df92fa1f417?q=80&w=2070&auto=format&fit=crop" alt="Cristalización" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex items-end">
                  <p className="text-[9px] font-black uppercase text-white tracking-wider">Cristalización de Sulfato</p>
                </div>
              </div>
              
              <div className="relative group rounded-3xl overflow-hidden aspect-video cursor-pointer border border-gray-100">
                <img src="https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=2072&auto=format&fit=crop" alt="Mapas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex items-end">
                  <p className="text-[9px] font-black uppercase text-white tracking-wider">Mapas de Hibridación</p>
                </div>
              </div>

            </div>
          </div>

        </aside>

        {/* Center Column: Chat canal (lg:col-span-6) */}
        <main className="lg:col-span-6 space-y-6">
          <Card className="flex flex-col h-[600px] sm:h-[720px] border border-gray-100 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            
            {/* Chat Header */}
            <header className="p-6 border-b border-gray-50 flex items-center justify-between gap-4 shrink-0 bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3 hidden sm:flex">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="Member" />
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-[#0D2140] tracking-tight">Canal de Colaboración: Santiago</h2>
                  <p className="text-[9px] text-[#059669] font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> 3 Miembros Activos
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => alert("Notificación de Intervención Urgente enviada a los tutores.")}
                className="bg-red-600 hover:bg-red-700 text-white font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                Intervención Urgente
              </button>
            </header>

            {/* Chat Messages scroll area */}
            <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8 bg-gray-50/10">
              
              <div className="flex justify-center">
                <div className="flex items-center gap-2 px-4.5 py-2 rounded-full bg-red-50 border border-red-100/50 text-red-600 text-[9px] font-black uppercase tracking-widest text-center">
                  <AlertTriangle size={13} />
                  Alerta de frustración detectada en Santiago (Unidad 4)
                </div>
              </div>

              {/* Message: Teacher */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" alt="Teacher" />
                  </div>
                  <p className="text-[9px] font-black text-[#004B76] uppercase tracking-widest">
                    Docente: Dra. Elena <span className="text-gray-400 ml-2 font-bold normal-case">10:24 AM</span>
                  </p>
                </div>
                <div className="ml-10 p-5 bg-white border border-gray-100 rounded-3xl rounded-tl-none shadow-sm max-w-2xl text-xs sm:text-sm text-[#0D2140] leading-relaxed">
                  Hola a todos. El sistema ha detectado que Santiago ha intentado el balanceo de ecuaciones redox cinco veces sin éxito. Creo que necesitamos reforzar la base de estados de oxidación antes de continuar.
                </div>
              </div>

              {/* Message: Parent */}
              <div className="space-y-2 flex flex-col items-end">
                <div className="flex items-center gap-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <span className="mr-2 font-bold normal-case">10:38 AM</span> Padre: Sr. Méndez
                  </p>
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mendez" alt="Parent" />
                  </div>
                </div>
                <div className="mr-10 p-5 bg-emerald-50/20 border border-emerald-100/30 rounded-3xl rounded-tr-none shadow-sm max-w-2xl text-xs sm:text-sm text-[#0D2140] leading-relaxed">
                  Gracias por avisar, Dra. Elena. He notado a Santiago un poco desanimado ayer por la tarde mientras estudiaba. ¿Hay algún material adicional que podamos revisar en casa hoy?
                </div>
              </div>

              {/* Message: Santiago */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Santiago" alt="Santiago" />
                  </div>
                  <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">
                    Santiago <span className="text-gray-400 ml-2 font-bold normal-case">10:45 AM</span>
                  </p>
                </div>
                <div className="ml-10 p-5 bg-purple-50/10 border border-purple-100/20 rounded-3xl rounded-tl-none shadow-sm max-w-2xl text-xs sm:text-sm text-[#0D2140] leading-relaxed">
                  Me confundo mucho cuando los electrones se mueven en medios ácidos. Siento que me pierdo en el tercer paso. ¡Me encantaría ver un ejemplo más visual!
                </div>
              </div>

            </div>

            {/* Chat Input Footer */}
            <footer className="p-4 sm:p-6 bg-white border-t border-gray-50 shrink-0">
              <div className="relative flex items-center gap-4">
                <div className="flex-grow relative">
                  <input 
                    type="text" 
                    placeholder="Escribe un mensaje de apoyo o coordinación..."
                    className="w-full h-12 pl-5 pr-12 bg-gray-50 border-none rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                  <button 
                    onClick={() => alert("Adjuntar archivo multimedia o informe cinético...")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Paperclip size={18} />
                  </button>
                </div>
                <Button 
                  onClick={() => alert("Enviando mensaje al canal de colaboración...")}
                  className="w-12 h-12 rounded-xl bg-[#004B76] text-white p-0 flex items-center justify-center shadow-md shadow-[#004B76]/10 shrink-0"
                >
                  <Send size={18} />
                </Button>
              </div>
            </footer>

          </Card>
        </main>

        {/* Right Column: Eventos Críticos (lg:col-span-3) */}
        <aside className="lg:col-span-3 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Eventos Críticos</h3>
            
            <div className="space-y-8 relative pl-6 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              
              <div className="relative space-y-1">
                <div className="absolute -left-[27px] top-1 w-1.5 h-10 bg-red-500 rounded-full" />
                <h4 className="text-sm font-black text-[#0D2140] tracking-tight">Abandono de sesión</h4>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">Santiago cerró el simulador de Laboratorio tras 3 errores consecutivos.</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Hace 15 min</p>
              </div>
              
              <div className="relative space-y-1">
                <div className="absolute -left-[27px] top-1 w-1.5 h-10 bg-emerald-500 rounded-full" />
                <h4 className="text-sm font-black text-[#0D2140] tracking-tight">Hito Alcanzado</h4>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">Se completó el módulo de Estequiometría con 95% de precisión.</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Hace 2 horas</p>
              </div>

            </div>
          </div>

          {/* Sugerencia IA widget */}
          <div className="pt-12">
            <Card className="p-6 bg-purple-50/50 border border-purple-100/50 rounded-3xl space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles size={16} className="fill-purple-100" />
                <span className="text-[9px] font-black uppercase tracking-widest">Sugerencia IA</span>
              </div>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Se recomienda una sesión de tutoría 1-a-1 de 15 min centrada en Reducción-Oxidación.
              </p>
              {/* Decorative Blur Background */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-200/20 rounded-full blur-xl pointer-events-none" />
            </Card>
          </div>

        </aside>

      </div>

    </div>
  );
};

export default Community;
