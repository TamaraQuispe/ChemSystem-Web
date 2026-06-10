import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileDown, 
  Send, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Eye, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  FlaskConical,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

const studentsMock = [
  { id: '2024-CH-001', name: 'Mateo Arboleda', avatar: 'MA', scores: { tasks: 9.5, lab: 8.8, exam: 9.0 }, avg: 9.1, status: 'excellent' },
  { id: '2024-CH-042', name: 'Sofía Valdivia', avatar: 'SV', scores: { tasks: 7.0, lab: 6.5, exam: 6.8 }, avg: 6.8, status: 'warning' },
  { id: '2024-CH-112', name: 'Lucas Ramírez', avatar: 'LR', scores: { tasks: 4.5, lab: 5.0, exam: 3.8 }, avg: 4.4, status: 'risk' },
  { id: '2024-CH-089', name: 'Isabella Mendoza', avatar: 'IM', scores: { tasks: 10.0, lab: 9.5, exam: 10.0 }, avg: 9.8, status: 'excellent' },
];

const TeacherGrades = () => {
  return (
    <div className="space-y-10 pb-20">
      {/* Search & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-grow max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          <input 
            type="text" 
            placeholder="Buscar alumnos por nombre o ID..." 
            className="w-full h-16 pl-16 pr-8 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg"
          />
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl px-6 h-14 font-black border-2 gap-2">
            <FileDown size={20} /> Exportar Reporte
          </Button>
          <Button className="rounded-2xl px-6 h-14 font-black bg-primary-dark gap-2">
            <Send size={20} /> Publicar Notas
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 space-y-10">
          <h1 className="text-4xl font-black text-primary-dark">Calificaciones</h1>
          <p className="text-text-secondary font-medium -mt-8">
            Gestión del rendimiento académico - Química Orgánica II
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-white">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Media Grupal</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary-dark">8.4</span>
                <span className="text-sm font-bold text-text-secondary">/10</span>
              </div>
              <p className="text-[10px] font-bold text-green-500 mt-2 flex items-center gap-1">
                <TrendingUp size={12} /> +0.4 este periodo
              </p>
            </Card>

            <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-white">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Tasa de Aprobación</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary-dark">92</span>
                <span className="text-sm font-bold text-text-secondary">%</span>
              </div>
              <p className="text-[10px] font-bold text-green-500 mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> 24/26 Alumnos
              </p>
            </Card>

            <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-white">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Simuladores</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary-dark">7.9</span>
                <span className="text-sm font-bold text-text-secondary">/10</span>
              </div>
              <p className="text-[10px] font-bold text-orange-500 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} /> Requiere refuerzo
              </p>
            </Card>

            <Card className="p-8 border-none shadow-premium rounded-[2.5rem] bg-secondary/40 relative overflow-hidden">
               <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
                  <Trophy className="text-primary-dark mb-4" size={32} />
                  <p className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-1">Puntaje Máximo</p>
                  <p className="text-sm font-black text-primary-dark">Lab. Destilación</p>
               </div>
            </Card>
          </div>

          {/* Filters Bar */}
          <Card className="p-6 border-none shadow-premium rounded-[2.5rem] bg-gray-50/50 flex flex-wrap items-center gap-6">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-4">Clase / Sección</p>
                <select className="w-full h-12 bg-white rounded-2xl px-6 border-none shadow-sm font-bold text-sm">
                  <option>Química Orgánica II-A</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-4">Periodo</p>
                <select className="w-full h-12 bg-white rounded-2xl px-6 border-none shadow-sm font-bold text-sm">
                  <option>2do Cuatrimestre</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-4">Tipo Actividad</p>
                <select className="w-full h-12 bg-white rounded-2xl px-6 border-none shadow-sm font-bold text-sm">
                  <option>Todas las actividades</option>
                </select>
              </div>
            </div>
            <button className="flex items-center gap-2 font-black text-primary-dark text-xs uppercase tracking-widest hover:bg-white p-4 rounded-2xl transition-all">
              <Filter size={18} /> Más Filtros
            </button>
          </Card>

          {/* Students Table */}
          <Card className="border-none shadow-premium rounded-[2.5rem] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-6 text-left text-[10px] font-black text-text-secondary uppercase tracking-widest">Estudiante</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-text-secondary uppercase tracking-widest">Tareas (20%)</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-text-secondary uppercase tracking-widest">Lab 3D (30%)</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-text-secondary uppercase tracking-widest">Examen (50%)</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-text-secondary uppercase tracking-widest">Promedio</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-text-secondary uppercase tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {studentsMock.map((student) => (
                    <tr key={student.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm transition-transform group-hover:scale-110",
                            student.status === 'excellent' ? "bg-blue-50 text-blue-500" :
                            student.status === 'warning' ? "bg-purple-50 text-purple-500" :
                            "bg-orange-50 text-orange-500"
                          )}>
                            {student.avatar}
                          </div>
                          <div>
                            <p className="font-black text-primary-dark">{student.name}</p>
                            <p className="text-[10px] font-bold text-text-secondary tracking-widest">{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center font-bold text-primary">{student.scores.tasks.toFixed(1)}</td>
                      <td className="px-8 py-6 text-center font-bold text-primary">{student.scores.lab.toFixed(1)}</td>
                      <td className="px-8 py-6 text-center font-bold text-primary">{student.scores.exam.toFixed(1)}</td>
                      <td className="px-8 py-6 text-center">
                        <div className={cn(
                          "inline-block px-4 py-2 rounded-xl font-black text-sm",
                          student.status === 'excellent' ? "bg-green-50 text-green-500" :
                          student.status === 'warning' ? "bg-gray-100 text-text-main" :
                          "bg-red-50 text-red-500"
                        )}>
                          {student.avg.toFixed(1)}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 text-text-secondary hover:text-primary transition-colors"><Edit2 size={18} /></button>
                           <button className="p-2 text-text-secondary hover:text-primary transition-colors"><Eye size={18} /></button>
                           {student.status === 'risk' && <button className="p-2 text-orange-500 hover:scale-110 transition-transform"><AlertTriangle size={18} /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
               <p className="italic text-xs text-text-secondary font-medium">Mostrando 4 de 26 estudiantes inscritos en esta sección</p>
               <div className="flex gap-2">
                  <button className="p-2 bg-white rounded-xl shadow-sm text-gray-400 hover:text-primary transition-colors border border-gray-100"><ChevronLeft size={20} /></button>
                  <button className="p-2 bg-white rounded-xl shadow-sm text-gray-400 hover:text-primary transition-colors border border-gray-100"><ChevronRight size={20} /></button>
               </div>
            </div>
          </Card>
        </div>

        {/* Right Panel: AI Analysis & Pendientes */}
        <div className="lg:w-1/4 space-y-8">
           <Card className="p-10 border-none shadow-premium rounded-[2.5rem] bg-white space-y-10">
              <h3 className="text-3xl font-black text-primary-dark">Análisis de Curva de Aprendizaje</h3>
              <p className="text-sm text-text-secondary font-medium leading-relaxed">
                Hemos detectado que el 65% de tus estudiantes mejoró sus notas en el módulo de Hidrocarburos tras la última práctica de simulador. Considera reforzar el tema de "Isomería" antes del examen parcial.
              </p>
              <div className="rounded-[2rem] overflow-hidden shadow-2xl relative group h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
                 <FlaskConical className="text-primary opacity-40 group-hover:scale-110 transition-transform duration-700" size={60} />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.4)_100%)]" />
              </div>
              <button className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest hover:gap-3 transition-all">
                 Ver reporte detallado de IA <ChevronRight size={18} />
              </button>
           </Card>

           <Card className="p-10 border-none shadow-premium rounded-[2.5rem] bg-gray-50 space-y-8">
              <h3 className="text-2xl font-black text-primary-dark">Pendientes</h3>
              <div className="space-y-6">
                 {[
                   { color: 'bg-orange-400', text: 'Revisar reporte de simulador de Lucas Ramírez' },
                   { color: 'bg-blue-400', text: 'Subir rúbrica para el Examen Final' },
                   { color: 'bg-secondary', text: 'Validar asistencia del grupo II-A' }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4 items-start">
                      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", item.color)} />
                      <p className="text-sm font-medium text-text-main">{item.text}</p>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherGrades;
