import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Clock,
  Target,
  FlaskConical,
  Activity,
  ChevronRight,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

const progressData = [
  { name: 'SEM 1', value: 30 },
  { name: 'SEM 2', value: 45 },
  { name: 'SEM 3', value: 38 },
  { name: 'SEM 4', value: 65 },
  { name: 'SEM 5', value: 55 },
  { name: 'SEM 6', value: 85 },
];

const topicsMock = [
  { topic: 'Termodinámica Química', desc: 'Leyes de la energía y entropía', comprehension: 82, time: 42, patterns: 'Excelente Domina Fórmulas', status: 'success' },
  { topic: 'Equilibrio Iónico', desc: 'pH, pOH y soluciones buffer', comprehension: 45, time: 18, patterns: 'Baja Retención Duda en Cálculos', status: 'risk' },
  { topic: 'Cinética Reaccional', desc: 'Velocidad y catalizadores', comprehension: 68, time: 35, patterns: 'Progreso Estable', status: 'info' },
];

const TeacherMonitoring = () => {
  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black text-primary-dark mb-2">Sistema de Monitoreo</h1>
        <p className="text-text-secondary font-medium max-w-2xl">
          Analítica avanzada de rendimiento académico en tiempo real. Gestiona el progreso de tus estudiantes con precisión quirúrgica.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-8">
          <Card className="p-10 border-none shadow-premium rounded-[2.5rem] bg-white space-y-8">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-2xl font-black text-primary-dark">Progreso General del Curso</h3>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Cátedra de Química Orgánica II</p>
               </div>
               <Badge className="bg-secondary/20 text-primary-dark border-none font-black px-4 py-2 gap-2">
                  <TrendingUp size={16} /> +12% vs mes anterior
               </Badge>
            </div>

            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                     <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#005B8F" />
                           <stop offset="100%" stopColor="#78F0C4" />
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }} 
                        dy={15}
                     />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#F8FAFC' }}
                     />
                     <Bar 
                        dataKey="value" 
                        radius={[10, 10, 10, 10]} 
                        fill="url(#barGradient)" 
                        barSize={60} 
                     />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Semáforo de Rendimiento */}
        <div className="lg:col-span-4">
          <Card className="p-10 border-none shadow-premium rounded-[2.5rem] bg-white h-full space-y-8">
            <h3 className="text-xl font-black text-primary-dark">Semáforo de Rendimiento</h3>
            
            <div className="space-y-4">
               {[
                 { icon: Smile, color: 'bg-green-50 text-green-500', label: 'Excelente', range: 'PROMEDIO > 9.0', count: 42 },
                 { icon: Meh, color: 'bg-orange-50 text-orange-500', label: 'En Riesgo', range: 'PROMEDIO 6.0 - 7.5', count: 12 },
                 { icon: Frown, color: 'bg-red-50 text-red-500', label: 'Alerta', range: 'PROMEDIO < 5.0', count: '05' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", item.color)}>
                          <item.icon size={24} />
                       </div>
                       <div>
                          <p className="font-black text-sm text-text-main">{item.label}</p>
                          <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">{item.range}</p>
                       </div>
                    </div>
                    <span className="text-2xl font-black text-primary-dark">{item.count}</span>
                 </div>
               ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Fortalezas y Debilidades por Tema */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-primary-dark tracking-tight">Fortalezas y Debilidades por Tema</h2>
            <div className="flex gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Fortalezas</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Áreas Críticas</span>
               </div>
            </div>
         </div>

         <Card className="border-none shadow-premium rounded-[2.5rem] bg-white overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="bg-gray-50/50 border-b border-gray-50">
                        <th className="px-8 py-6 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Módulo de Estudio</th>
                        <th className="px-8 py-6 text-center text-[10px] font-black text-text-secondary uppercase tracking-widest">Comprensión Media</th>
                        <th className="px-8 py-6 text-center text-[10px] font-black text-text-secondary uppercase tracking-widest">Tiempo Promedio</th>
                        <th className="px-8 py-6 text-center text-[10px] font-black text-text-secondary uppercase tracking-widest">Identificación de Patrones</th>
                        <th className="px-8 py-6 text-right text-[10px] font-black text-text-secondary uppercase tracking-widest">Estatus</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {topicsMock.map((item, index) => (
                       <tr key={index} className="group hover:bg-gray-50/50 transition-all">
                          <td className="px-8 py-6">
                             <h4 className="font-black text-primary-dark text-lg">{item.topic}</h4>
                             <p className="text-xs text-text-secondary font-medium">{item.desc}</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex flex-col items-center gap-2">
                                <div className="h-1.5 w-32 bg-gray-50 rounded-full overflow-hidden">
                                   <motion.div 
                                      initial={{ width: 0 }} 
                                      animate={{ width: `${item.comprehension}%` }} 
                                      className={cn("h-full", item.status === 'success' ? 'bg-green-500' : item.status === 'risk' ? 'bg-red-500' : 'bg-primary')} 
                                   />
                                </div>
                                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{item.comprehension}% de alumnos dominan el tema</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center font-bold text-primary-dark">
                             {item.time} min / sesión
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex gap-2 justify-center">
                                {item.patterns.split(' ').map((p, i) => (
                                   <Badge key={i} className={cn(
                                     "border-none font-bold text-[9px] uppercase px-3 py-1",
                                     i === 0 ? "bg-primary/10 text-primary" : "bg-gray-100 text-text-secondary"
                                   )}>
                                      {p}
                                   </Badge>
                                ))}
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             {item.status === 'success' ? <CheckCircle2 className="text-green-500 ml-auto" size={24} /> :
                              item.status === 'risk' ? <AlertTriangle className="text-red-500 ml-auto" size={24} /> :
                              <Activity className="text-primary ml-auto" size={24} />}
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>

      {/* Actividad en Tiempo Real Section */}
      <div className="space-y-6">
         <h2 className="text-2xl font-black text-primary-dark tracking-tight">Actividad en Tiempo Real</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { time: 'HACE 2 MINUTOS', user: 'Laura M.', action: 'completó Simulador de pH con', result: '9.8', color: 'bg-green-50 border-green-100' },
              { time: 'HACE 15 MINUTOS', user: 'Carlos D.', action: 'solicitó tutoría en', result: '"Leyes de gases"', color: 'bg-blue-50 border-blue-100' },
              { time: 'HACE 1 HORA', user: '32 estudiantes', action: 'han iniciado sesión en', result: 'Laboratorio Virtual', color: 'bg-gray-50 border-gray-100' },
              { time: 'PROGRAMADO', user: 'Sincronización de calificaciones', action: 'con LMS', result: 'Pendiente', color: 'bg-purple-50 border-purple-100' },
            ].map((item, i) => (
              <Card key={i} className={cn("p-8 border-none shadow-sm rounded-[2rem] space-y-4", item.color)}>
                 <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{item.time}</p>
                 <p className="text-sm font-medium leading-relaxed">
                    <span className="font-black text-primary-dark">{item.user}</span> {item.action} <span className={cn("font-black", item.result === 'Pendiente' ? 'text-purple-500' : 'text-primary-dark')}>{item.result}</span>
                 </p>
              </Card>
            ))}
         </div>
      </div>
    </div>
  );
};

export default TeacherMonitoring;
