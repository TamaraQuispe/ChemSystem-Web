import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  User, 
  TrendingDown, 
  ShieldAlert, 
  MessageSquare, 
  Paperclip, 
  Send,
  MoreVertical,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

const TeacherCommunity = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-160px)]">
      {/* Left Sidebar: Contexto del Alumno */}
      <div className="lg:w-1/4 space-y-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Contexto del Alumno</h3>
          <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-white space-y-8">
             <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center text-purple-500 relative">
                   <User size={40} />
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <Sparkles size={14} className="text-purple-500" />
                   </div>
                </div>
                <div>
                   <h4 className="text-xl font-black text-primary-dark">Santiago Méndez</h4>
                   <p className="text-xs font-bold text-text-secondary">Estudiante de Química II</p>
                </div>
             </div>

             <div className="p-5 rounded-3xl bg-red-50 space-y-2">
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Estado de Frustración</p>
                <div className="flex justify-between items-center">
                   <span className="text-lg font-black text-red-600">Elevado (82%)</span>
                   <TrendingDown size={18} className="text-red-500" />
                </div>
             </div>

             <div className="p-5 rounded-3xl bg-green-50 space-y-2">
                <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">Último Hito</p>
                <p className="text-sm font-black text-green-700 leading-tight">Dominio de Enlaces Covalentes</p>
             </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Muro de Avances</h3>
          <div className="grid grid-cols-1 gap-4">
             <div className="rounded-[2rem] overflow-hidden relative group h-40 shadow-premium">
                <img src="https://images.unsplash.com/photo-1532187875302-1df92fa1f417?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Cristalización" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-end p-6">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Cristalización de Sulfato</p>
                </div>
             </div>
             <div className="rounded-[2rem] overflow-hidden relative group h-40 shadow-premium">
                <img src="https://images.unsplash.com/photo-1614935151651-0bea6508db6b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Hibridación" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-end p-6">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Mapas de Hibridación</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="lg:flex-grow flex flex-col gap-6">
        <Card className="flex-grow border-none shadow-premium rounded-[3rem] bg-white overflow-hidden flex flex-col">
           {/* Chat Header */}
           <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="Member" />
                      </div>
                    ))}
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-primary-dark">Canal de Colaboración: Santiago</h3>
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-green-500" /> 3 Miembros Activos
                    </p>
                 </div>
              </div>
              <Button className="rounded-2xl h-12 px-6 font-black bg-primary-dark text-xs uppercase tracking-widest">
                 Intervención Urgente
              </Button>
           </div>

           {/* Chat Content */}
           <div className="flex-grow p-10 overflow-y-auto space-y-8 bg-gray-50/30">
              {/* Alert Bubble */}
              <div className="flex justify-center">
                 <div className="px-6 py-2 rounded-full bg-red-50 border border-red-100 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Alerta de frustración detectada en Santiago (Unidad 4)</span>
                 </div>
              </div>

              {/* Teacher Message */}
              <div className="flex gap-4 max-w-2xl">
                 <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border-2 border-primary/20">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" alt="Dra Elena" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">Docente: Dra. Elena</span>
                       <span className="text-[10px] font-bold text-text-secondary uppercase">10:24 AM</span>
                    </div>
                    <div className="p-6 rounded-[2rem] rounded-tl-none bg-white shadow-sm border border-gray-50">
                       <p className="text-sm font-medium text-text-main leading-relaxed">
                          Hola a todos. El sistema ha detectado que Santiago ha intentado el balanceo de ecuaciones redox cinco veces sin éxito. Creo que necesitamos reforzar la base de estados de oxidación antes de continuar.
                       </p>
                    </div>
                 </div>
              </div>

              {/* Parent Message (Right) */}
              <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
                 <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border-2 border-blue-200">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Parent" alt="Parent" />
                 </div>
                 <div className="space-y-2 text-right">
                    <div className="flex items-center gap-3 justify-end">
                       <span className="text-[10px] font-bold text-text-secondary uppercase">10:30 AM</span>
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Padre: Sr. Mendez</span>
                    </div>
                    <div className="p-6 rounded-[2rem] rounded-tr-none bg-green-50 shadow-sm border border-green-100">
                       <p className="text-sm font-medium text-text-main leading-relaxed">
                          Gracias por avisar, Dra. Elena. He notado a Santiago un poco desanimado ayer por la tarde mientras estudiaba. ¿Hay algún material adicional que podamos revisar en casa hoy?
                       </p>
                    </div>
                 </div>
              </div>

              {/* Santiago Message */}
              <div className="flex gap-4 max-w-2xl">
                 <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border-2 border-purple-200">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Santiago" alt="Santiago" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Santiago</span>
                       <span className="text-[10px] font-bold text-text-secondary uppercase">10:45 AM</span>
                    </div>
                    <div className="p-6 rounded-[2rem] rounded-tl-none bg-purple-50 shadow-sm border border-purple-100">
                       <p className="text-sm font-medium text-text-main leading-relaxed">
                          Me confundo mucho cuando los electrones se mueven en medios ácidos. Siento que me pierdo en el tercer paso. ¡Me encantaría ver un ejemplo más visual!
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Chat Input */}
           <div className="p-8 bg-white border-t border-gray-50">
              <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Escribe un mensaje de apoyo o coordinación..." 
                   className="w-full h-16 pl-8 pr-32 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <button className="p-2 text-text-secondary hover:text-primary transition-colors"><Paperclip size={20} /></button>
                    <button className="w-12 h-12 rounded-2xl bg-primary-dark text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                       <Send size={20} />
                    </button>
                 </div>
              </div>
           </div>
        </Card>
      </div>

      {/* Right Sidebar: Eventos Críticos & Sugerencia IA */}
      <div className="lg:w-1/4 space-y-8">
        <div className="space-y-6">
           <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Eventos Críticos</h3>
           <div className="space-y-8 relative pl-6">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-100" />
              
              <div className="relative">
                 <div className="absolute -left-[25px] top-1.5 w-2 h-8 bg-red-500 rounded-full" />
                 <h4 className="font-black text-primary-dark text-sm mb-1">Abandono de sesión</h4>
                 <p className="text-xs text-text-secondary font-medium leading-relaxed">Santiago cerró el simulador de Laboratorio tras 3 errores consecutivos.</p>
                 <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mt-2">Hace 15 min</span>
              </div>

              <div className="relative">
                 <div className="absolute -left-[25px] top-1.5 w-2 h-8 bg-green-400 rounded-full" />
                 <h4 className="font-black text-primary-dark text-sm mb-1">Hito Alcanzado</h4>
                 <p className="text-xs text-text-secondary font-medium leading-relaxed">Se completó el módulo de Estequiometría con 95% de precisión.</p>
                 <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mt-2">Hace 2 horas</span>
              </div>
           </div>
        </div>

        <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-blue-50/50 space-y-6">
           <div className="flex items-center gap-2">
              <Sparkles className="text-blue-500" size={16} />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Sugerencia IA</span>
           </div>
           <p className="text-sm font-bold text-text-main leading-relaxed italic">
              Se recomienda una sesión de tutoría 1-a-1 de 15 min centrada en Reducción-Oxidación.
           </p>
        </Card>
      </div>
    </div>
  );
};

export default TeacherCommunity;
