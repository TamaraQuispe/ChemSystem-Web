import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import {
  CheckCircle2, AlertTriangle, XCircle, TrendingUp,
  Target, RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';
import { useTeacherStore } from '../../store/teacherStore';

const progressData = [
  { name: 'SEM 1', value: 30 }, { name: 'SEM 2', value: 45 },
  { name: 'SEM 3', value: 38 }, { name: 'SEM 4', value: 65 },
  { name: 'SEM 5', value: 55 }, { name: 'SEM 6', value: 85 },
];

const TeacherMonitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { classes, selectedClass, setSelectedClass, fetchClasses } = useTeacherStore();

  useEffect(() => { fetchClasses(); }, []);
  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    setError(null);
    teacherService.getMonitorData(selectedClass.id)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedClass?.id]);

  if (loading && !data) {
    return (
      <div className="space-y-8">
        <div className="w-80 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
        </div>
        <div className="h-72 bg-white rounded-3xl animate-pulse border border-gray-100" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
        <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
        <button onClick={() => teacherService.getMonitorData(selectedClass?.id).then(setData)}
          className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
      </Card>
    );
  }

  const { students, topics, stats } = data || { students: [], topics: [], stats: { excellent: 0, good: 0, risk: 0 } };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-primary-dark tracking-tight">Monitoreo en Tiempo Real</h1>
        <p className="text-text-secondary font-semibold mt-1">Progreso y rendimiento de tus estudiantes</p>
      </motion.div>

      {classes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {classes.map(c => (
            <button key={c.id} onClick={() => setSelectedClass(c)}
              className={cn("px-5 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap",
                selectedClass?.id === c.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-text-secondary border border-gray-100"
              )}>{c.name}</button>
          ))}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: CheckCircle2, label: 'Excelente', value: stats.excellent, color: 'bg-emerald-50', iconColor: 'text-emerald-500', border: 'border-emerald-200' },
          { icon: Target, label: 'Bueno', value: stats.good, color: 'bg-blue-50', iconColor: 'text-blue-500', border: 'border-blue-200' },
          { icon: XCircle, label: 'En Riesgo', value: stats.risk, color: 'bg-red-50', iconColor: 'text-red-500', border: 'border-red-200' },
        ].map((item, idx) => (
          <div key={idx} className={cn("bg-white rounded-3xl p-6 border shadow-premium", item.border)}>
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.color)}>
                <item.icon size={24} className={item.iconColor} />
              </div>
              <div>
                <p className="text-3xl font-black text-primary-dark">{item.value}</p>
                <p className="text-xs font-bold text-text-secondary">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6">
            <h2 className="text-lg font-black text-primary-dark mb-6">Progreso General del Curso</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }} />
                  <YAxis hide={true} />
                  <Tooltip cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="value" stroke="#005B8F" strokeWidth={3} dot={{ fill: '#005B8F', stroke: '#fff', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-6">
            <h2 className="text-lg font-black text-primary-dark mb-6">Fortalezas y Debilidades por Tema</h2>
            <div className="space-y-4">
              {topics.length === 0 ? (
                <p className="text-sm font-semibold text-text-secondary text-center py-8">Sin datos de temas aún.</p>
              ) : topics.map((t, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-text-main">{t.topic}</span>
                    <span className={cn(
                      "text-[10px] font-black",
                      t.status === 'strong' ? 'text-emerald-500' : t.status === 'moderate' ? 'text-amber-500' : 'text-red-500'
                    )}>{t.avgScore}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full transition-all",
                      t.status === 'strong' ? 'bg-emerald-400' : t.status === 'moderate' ? 'bg-amber-400' : 'bg-red-400'
                    )} style={{ width: `${t.avgScore}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card className="p-6">
          <h2 className="text-lg font-black text-primary-dark mb-6">Estudiantes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Estudiante</th>
                  <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Promedio</th>
                  <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan={3} className="py-12 text-center text-sm font-semibold text-text-secondary">Sin estudiantes inscritos</td></tr>
                ) : students.map((s, idx) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden">
                          <img src={s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-black text-text-main">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs font-bold">{s.average}%</td>
                    <td className="py-3">
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider",
                        s.status === 'excellent' ? 'bg-emerald-50 text-emerald-500' :
                        s.status === 'good' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'
                      )}>
                        {s.status === 'excellent' ? 'Excelente' : s.status === 'good' ? 'Bueno' : 'En Riesgo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TeacherMonitoring;
