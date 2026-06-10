import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  AlertTriangle, 
  TrendingDown, 
  Zap, 
  Users, 
  Calendar,
  ChevronRight,
  Info,
  Sparkles,
  ArrowDownRight,
  MousePointer2,
  Clock,
  FlaskConical
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

const highFrustrationStudents = [
  { name: 'Marco Valenzuela', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco', frustration: 88, topic: 'Estequiometría Avanzada', blockedTime: 'hace 24m' },
  { name: 'Elena Rodríguez', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', frustration: 72, topic: 'Equilibrio Ácido-Base', blockedTime: 'hace 12m' },
];

const TeacherPredictive = () => {
  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Dashboard de Alertas Estratégicas</p>
        <h1 className="text-5xl font-black text-primary-dark tracking-tighter">Análisis Predictivo de Aula</h1>
        <p className="text-text-secondary font-medium max-w-2xl text-lg">
          Intervenciones pedagógicas basadas en el comportamiento cognitivo en tiempo real de sus estudiantes de Química Orgánica.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Hero Alert Card */}
          <Card className="p-10 bg-red-50/50 border-none rounded-[3rem] flex items-center justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <AlertTriangle size={200} />
             </div>
             <div className="relative z-10 flex items-center gap-10">
                <div className="text-center">
                   <h2 className="text-8xl font-black text-red-500 tracking-tighter leading-none">08</h2>
                   <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2">Estudiantes en Riesgo</p>
                </div>
                <div className="w-px h-24 bg-red-200" />
                <div className="p-4 rounded-3xl bg-white text-red-500 shadow-sm">
                   <AlertTriangle size={40} />
                </div>
             </div>
          </Card>

          {/* High Frustration Section */}
          <div className="space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-primary-dark">Estudiantes con Alta Frustración</h3>
                <button className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline">
                   Ver reporte completo <ChevronRight size={18} />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {highFrustrationStudents.map((student, i) => (
                  <Card key={i} className="p-8 border-none shadow-premium rounded-[2.5rem] bg-white space-y-6 group">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:scale-110 transition-transform">
                              <img src={student.photo} alt={student.name} />
                           </div>
                           <div>
                              <h4 className="text-xl font-black text-primary-dark">{student.name}</h4>
                              <Badge className="bg-gray-100 text-text-secondary border-none text-[10px] font-black py-1">Bloqueado {student.blockedTime}</Badge>
                           </div>
                        </div>
                        <div className="text-red-500">
                           <ArrowDownRight size={24} />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Nivel de Frustración</span>
                           <span className="text-sm font-black text-red-500">{student.frustration}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${student.frustration}%` }} 
                              className="h-full bg-red-500" 
                           />
                        </div>
                     </div>

                     <div className="p-4 rounded-2xl bg-gray-50 flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-white text-primary">
                           <FlaskConical size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Tema:</p>
                           <p className="text-xs font-bold text-primary-dark">{student.topic}</p>
                        </div>
                     </div>

                     <Button className="w-full h-14 rounded-2xl bg-primary-dark text-white font-black">
                        Intervenir Ahora
                     </Button>
                  </Card>
                ))}
             </div>
          </div>

          {/* Focus Points Section */}
          <div className="space-y-8">
             <h3 className="text-3xl font-black text-primary-dark">Focos de Refuerzo Grupal</h3>
             <Card className="p-10 border-none shadow-premium rounded-[3rem] bg-white relative overflow-hidden group">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent pointer-events-none" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <h5 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Orbitales</h5>
                         <span className="text-2xl font-black text-primary-dark">92%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full w-[92%] bg-secondary" />
                      </div>
                      <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Comprensión Óptima</p>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <h5 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Estequiometría</h5>
                         <span className="text-2xl font-black text-primary-dark">45%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full w-[45%] bg-red-500" />
                      </div>
                      <Badge className="bg-red-500 text-white border-none font-black text-[9px] uppercase px-3 py-1">Refuerzo Crítico</Badge>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <h5 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Cinética</h5>
                         <span className="text-2xl font-black text-primary-dark">68%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full w-[68%] bg-blue-400" />
                      </div>
                      <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Progresión Media</p>
                   </div>
                </div>
             </Card>
          </div>
        </div>

        {/* Sidebar AI Insights */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="p-10 border-none shadow-premium rounded-[3rem] bg-white space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 text-purple-500 opacity-20">
                 <Sparkles size={100} />
              </div>
              <div className="flex items-center gap-3">
                 <div className="p-3 rounded-2xl bg-purple-500 text-white shadow-lg shadow-purple-500/20">
                    <BrainCircuit size={28} />
                 </div>
                 <h3 className="text-2xl font-black text-primary-dark">Sugerencias IA</h3>
              </div>

              <div className="space-y-8">
                 <div className="flex gap-4">
                    <div className="p-3 h-fit rounded-xl bg-purple-50 text-purple-500">
                       <Zap size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-text-main leading-relaxed">
                          Lanzar cuestionario de repaso sobre <span className="font-black text-purple-500">Relaciones Molares</span> para estabilizar la base del 40% de la clase.
                       </p>
                       <Button className="mt-4 rounded-xl border-2 border-purple-500 text-purple-500 font-black uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-purple-500 hover:text-white transition-all">
                          Programar ahora
                       </Button>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="p-3 h-fit rounded-xl bg-purple-50 text-purple-500">
                       <Users size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-text-main leading-relaxed">
                          Formar grupos de mentoría entre pares: Asignar a <span className="font-black text-purple-500">Ana S.</span> para apoyar a <span className="font-black text-purple-500">Marco V.</span> en el módulo actual.
                       </p>
                       <Button className="mt-4 rounded-xl border-2 border-purple-500 text-purple-500 font-black uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-purple-500 hover:text-white transition-all">
                          Crear Grupos
                       </Button>
                    </div>
                 </div>
              </div>

              <Card className="p-6 bg-gray-50 border-none rounded-3xl space-y-4">
                 <div className="flex items-center gap-2">
                    <Sparkles className="text-green-500" size={16} />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Insight Predictivo</span>
                 </div>
                 <p className="text-xs font-bold text-text-secondary italic leading-relaxed">
                    "La curva de aprendizaje sugiere que si no se refuerza la Nomenclatura IUPAC esta semana, el 15% adicional de los estudiantes entrará en zona de riesgo."
                 </p>
              </Card>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherPredictive;
