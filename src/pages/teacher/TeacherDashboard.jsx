import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  BrainCircuit, 
  MessageSquare, 
  Settings,
  Plus,
  BookOpen,
  FlaskConical,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const TeacherDashboard = () => {
  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary-dark mb-2">Panel de Control Docente</h1>
          <p className="text-text-secondary font-medium max-w-2xl">
            Gestiona tus aulas virtuales, supervisa el progreso de tus estudiantes y organiza recursos científicos con precisión editorial.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl px-8 h-14 font-black border-2">
            Ver Reportes
          </Button>
          <Button className="rounded-2xl px-8 h-14 font-black bg-primary-dark">
            Configurar Aula
          </Button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-white group cursor-pointer hover:translate-y-[-4px] transition-all">
          <div className="p-4 rounded-2xl bg-primary/5 text-primary w-fit mb-6">
            <Plus size={28} />
          </div>
          <h3 className="text-2xl font-black text-primary-dark mb-2">Asignar Tareas</h3>
          <p className="text-sm text-text-secondary font-medium mb-6">
            Distribuye guías de laboratorio y ejercicios teóricos a tus grupos.
          </p>
          <button className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest group-hover:gap-3 transition-all">
            Comenzar ahora <ChevronRight size={18} />
          </button>
        </Card>

        <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-secondary/30 group cursor-pointer hover:translate-y-[-4px] transition-all relative overflow-hidden">
          <div className="p-4 rounded-2xl bg-white/50 text-primary w-fit mb-6">
            <FlaskConical size={28} />
          </div>
          <h3 className="text-2xl font-black text-primary-dark mb-2">Nuevas Actividades</h3>
          <p className="text-sm text-text-secondary font-medium">
            Explora 12 nuevos simuladores de estequiometría.
          </p>
        </Card>

        <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-purple-50 group cursor-pointer hover:translate-y-[-4px] transition-all relative overflow-hidden">
          <div className="p-4 rounded-2xl bg-white/50 text-primary w-fit mb-6">
            <MessageSquare size={28} />
          </div>
          <h3 className="text-2xl font-black text-primary-dark mb-2">Recursos Compartidos</h3>
          <p className="text-sm text-text-secondary font-medium">
            Accede a la biblioteca global de la comunidad.
          </p>
        </Card>
      </div>

      {/* Classroom Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-primary-dark tracking-tight">Aulas Activas</h2>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button className="p-2 bg-white rounded-lg shadow-sm text-primary"><LayoutDashboard size={18} /></button>
            <button className="p-2 text-gray-400"><Users size={18} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Active Class 1 */}
          <Card className="border-none shadow-premium rounded-[2.5rem] bg-white overflow-hidden group">
            <div className="h-40 bg-gray-100 relative overflow-hidden">
              <img 
                src="/Users/tamaraalison/.gemini/antigravity/brain/98c057de-1516-4485-b2c7-66fd482fff08/organic_chemistry_lab_render_1778541890699.png" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt="Chemistry class"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 backdrop-blur-md text-primary-dark border-none font-black text-[10px] uppercase">Nivel: Avanzado</Badge>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-2xl font-black text-primary-dark">Química Orgánica II</h4>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mt-1">Sección A • 32 Estudiantes</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Progreso del currículo</span>
                  <span className="text-sm font-black text-primary">68%</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '68%' }}
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <Button variant="outline" className="flex-1 rounded-xl font-bold border-gray-100">Gestionar</Button>
                <Button className="flex-1 rounded-xl font-bold bg-primary-dark">Ver Aula</Button>
              </div>
            </div>
          </Card>

          {/* Active Class 2 */}
          <Card className="border-none shadow-premium rounded-[2.5rem] bg-white overflow-hidden group">
            <div className="h-40 bg-secondary/10 relative overflow-hidden flex items-center justify-center p-8">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent" />
               <div className="relative z-10 w-full h-full border-2 border-dashed border-primary/20 rounded-2xl flex items-center justify-center">
                  <FlaskConical className="text-primary/40" size={60} />
               </div>
               <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 backdrop-blur-md text-primary-dark border-none font-black text-[10px] uppercase">Nivel: Medio</Badge>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-2xl font-black text-primary-dark">Enlace Químico</h4>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mt-1">Sección C • 28 Estudiantes</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Progreso del currículo</span>
                  <span className="text-sm font-black text-primary">42%</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '42%' }}
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <Button variant="outline" className="flex-1 rounded-xl font-bold border-gray-100">Gestionar</Button>
                <Button className="flex-1 rounded-xl font-bold bg-primary-dark">Ver Aula</Button>
              </div>
            </div>
          </Card>

          {/* New Class Card */}
          <Card className="border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/50 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-primary hover:bg-white transition-all">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all mb-6">
              <Plus size={32} />
            </div>
            <h4 className="text-xl font-black text-text-main mb-2">Nueva Aula</h4>
            <p className="text-sm text-text-secondary font-medium">Crea un nuevo grupo de estudio</p>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="text-primary" size={24} />
            <h2 className="text-2xl font-black text-primary-dark tracking-tight">Actividad Reciente</h2>
          </div>
          
          <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-white space-y-8">
            {[
              { 
                icon: CheckCircle2, 
                color: 'text-green-500 bg-green-50', 
                title: 'Tarea entregada por 12 alumnos', 
                desc: 'Práctica de Ácidos y Bases • Química Orgánica II', 
                time: 'HACE 2H' 
              },
              { 
                icon: MessageSquare, 
                color: 'text-purple-500 bg-purple-50', 
                title: 'Nueva pregunta en el foro', 
                desc: 'Carlos Méndez: "Duda sobre hibridación sp3"', 
                time: 'HACE 5H' 
              },
              { 
                icon: TrendingUp, 
                color: 'text-blue-500 bg-blue-50', 
                title: 'Contenido actualizado', 
                desc: 'Módulo de Termodinámica v2.4 cargado', 
                time: 'AYER' 
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start group">
                <div className={`p-4 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <div className="flex-grow pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-text-main group-hover:text-primary transition-colors">{item.title}</h5>
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{item.time}</span>
                  </div>
                  <p className="text-sm text-text-secondary font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Semester Status Panel */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-2xl font-black text-primary-dark tracking-tight">Estado del Semestre</h2>
          <Card className="p-10 border-none shadow-premium rounded-[2.5rem] bg-primary-dark text-white space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <GraduationCap size={120} />
            </div>
            
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest relative z-10">Resumen general de tus 4 aulas activas.</p>
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Asistencia Media</span>
                  <span className="text-xl font-black">92%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-secondary" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Tareas Corregidas</span>
                  <span className="text-xl font-black">75%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-secondary" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative z-10">
               <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-3">Próximo Hito</p>
               <h5 className="text-lg font-bold mb-2">"Examen Departamental de Química General"</h5>
               <p className="text-xs text-white/60">En 4 días hábiles</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
