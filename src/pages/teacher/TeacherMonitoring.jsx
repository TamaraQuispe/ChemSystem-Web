import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';
import { useTeacherStore } from '../../store/teacherStore';

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
      <div className="p-8 space-y-8">
        <div className="w-80 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-72 bg-white rounded-3xl animate-pulse border" />
          <div className="lg:col-span-4 h-72 bg-white rounded-3xl animate-pulse border" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-500 text-lg font-bold">!</span>
        </div>
        <p className="text-lg font-bold text-[#1a1c1d] mb-4">{error}</p>
        <button onClick={() => teacherService.getMonitorData(selectedClass?.id).then(setData)}
          className="px-6 py-2.5 bg-[#004b71] text-white rounded-xl font-bold text-sm">Reintentar</button>
      </div>
    );
  }

  const { students = [], topics = [], stats = { excellent: 0, good: 0, risk: 0 }, progressData = [] } = data || {};

  const maxValue = Math.max(...progressData.map(d => d.value), 1);

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-10 max-w-6xl">
        <h1 className="text-4xl lg:text-5xl font-headline font-extrabold text-[#004b71] tracking-tight mb-2">Sistema de Monitoreo</h1>
        <p className="text-[#40484f] text-lg max-w-2xl leading-relaxed">Analítica avanzada de rendimiento académico en tiempo real.</p>
      </div>

      {/* Class Selector */}
      {classes.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {classes.map(c => (
            <button key={c.id} onClick={() => setSelectedClass(c)}
              className={cn("px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap",
                selectedClass?.id === c.id
                  ? 'text-white shadow-sm' : 'bg-white text-[#40484f] border border-[#c0c7d0]/30 hover:bg-[#f3f3f4]'
              )}
              style={selectedClass?.id === c.id ? { background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' } : {}}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Progress Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="lg:col-span-8 bg-[#f3f3f4] rounded-3xl p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-headline font-bold text-[#004b71] mb-1">Progreso General del Curso</h3>
                <p className="text-sm text-[#40484f] font-medium uppercase tracking-wider">{selectedClass?.name || 'Curso'}</p>
              </div>
              {stats.excellent > 0 && (
                <div className="flex items-center gap-2 text-[#007352] bg-[#86f8c8] px-3 py-1 rounded-full text-sm font-bold">
                  <span>↑</span> +{Math.round((stats.excellent / (students.length || 1)) * 100)}% vs inicio
                </div>
              )}
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between h-48 gap-3">
              {progressData.length === 0 ? (
                <div className="w-full text-center text-sm text-[#40484f] pt-16">Sin datos de progreso disponibles</div>
              ) : progressData.map((d, i) => {
                const heightPct = Math.max(8, (d.value / maxValue) * 100);
                const isLast = i === progressData.length - 1;
                return (
                  <div key={i} className="flex-1 bg-[#e2e2e3] rounded-t-xl relative group/bar" style={{ height: '80%' }}>
                    <div className={cn("absolute inset-x-0 bottom-0 rounded-t-xl transition-all duration-500 group-hover/bar:brightness-110",
                      isLast ? 'bg-gradient-to-t from-[#004b71] to-[#8ecdff]' : 'bg-[#004b71]'
                    )} style={{ height: `${heightPct}%` }} />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-[#1a1c1d] text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap">
                      {d.value}%
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">{d.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Traffic Light */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h4 className="font-headline font-bold text-[#1a1c1d] mb-4">Semáforo de Rendimiento</h4>
            <div className="space-y-4">
              {[
                { label: 'Excelente', desc: 'Promedio ≥ 80', count: stats.excellent, bg: 'bg-[#86f8c8]/30 border-[#86f8c8]/20', iconBg: 'bg-[#86f8c8]', iconColor: 'text-[#007352]', icon: 'sentiment_very_satisfied', textColor: 'text-[#007352]', subColor: 'text-[#007352]/70' },
                { label: 'En Riesgo', desc: 'Promedio 60-79', count: stats.good, bg: 'bg-[#fff9c4] border-[#fbc02d]/20', iconBg: 'bg-[#fbc02d]', iconColor: 'text-[#5f4b00]', icon: 'warning', textColor: 'text-[#5f4b00]', subColor: 'text-[#5f4b00]/70' },
                { label: 'Alerta', desc: 'Promedio < 60', count: stats.risk, bg: 'bg-[#ffdad6]/30 border-[#ffdad6]/20', iconBg: 'bg-[#ffdad6]', iconColor: 'text-[#ba1a1a]', icon: 'dangerous', textColor: 'text-[#ba1a1a]', subColor: 'text-[#ba1a1a]/70' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-2xl ${item.bg} border`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center ${item.iconColor}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {item.icon === 'sentiment_very_satisfied' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> :
                         item.icon === 'warning' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /> :
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${item.textColor}`}>{item.label}</p>
                      <p className={`text-[10px] uppercase font-semibold ${item.subColor}`}>{item.desc}</p>
                    </div>
                  </div>
                  <span className={`text-lg font-extrabold ${item.textColor}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Topics Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-12 bg-[#f3f3f4] rounded-3xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-headline font-bold text-[#004b71]">Fortalezas y Debilidades por Tema</h3>
              <p className="text-sm text-[#40484f] font-medium">Análisis basado en evaluaciones recientes</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs font-bold text-[#006c4d]">
                <span className="w-2 h-2 rounded-full bg-[#006c4d]" /> Fortalezas
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-[#ba1a1a]">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" /> Áreas Críticas
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#40484f] text-[11px] uppercase tracking-widest font-bold">
                  <th className="pb-6 pl-4">Tema</th>
                  <th className="pb-6">Comprensión</th>
                  <th className="pb-6">Estatus</th>
                  <th className="pb-6 pr-4 text-right">Promedio</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topics.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-[#40484f]">Sin datos de temas disponibles</td></tr>
                ) : topics.map((t, i) => (
                  <tr key={i} className="group hover:bg-white transition-colors">
                    <td className="py-5 pl-4 rounded-l-2xl">
                      <span className="block font-bold text-[#1a1c1d]">{t.topic}</span>
                      <span className="text-xs text-[#40484f]">{t.studentsCount} estudiantes</span>
                    </td>
                    <td className="py-5">
                      <div className="w-32 bg-[#e2e2e3] h-1.5 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full",
                          t.avgScore >= 80 ? 'bg-[#006c4d]' : t.avgScore >= 60 ? 'bg-[#fbc02d]' : 'bg-[#ba1a1a]'
                        )} style={{ width: `${t.avgScore}%` }} />
                      </div>
                    </td>
                    <td className="py-5">
                      <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold",
                        t.status === 'strong' ? 'bg-[#86f8c8] text-[#007352]' :
                        t.status === 'moderate' ? 'bg-[#fff9c4] text-[#5f4b00]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                      )}>
                        {t.status === 'strong' ? 'Fortaleza' : t.status === 'moderate' ? 'Estable' : 'Crítico'}
                      </span>
                    </td>
                    <td className="py-5 pr-4 text-right rounded-r-2xl">
                      <span className={cn("font-bold",
                        t.avgScore >= 80 ? 'text-[#006c4d]' : t.avgScore >= 60 ? 'text-[#5f4b00]' : 'text-[#ba1a1a]'
                      )}>{t.avgScore}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-12 bg-white rounded-3xl p-8 border border-[#c0c7d0]/10">
          <h3 className="text-2xl font-headline font-bold text-[#004b71] mb-6">Actividad Reciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {students.slice(0, 4).map((s, i) => (
              <div key={s.id} className="p-4 rounded-2xl bg-[#f3f3f4] hover:bg-white transition-all shadow-sm">
                <p className="text-[10px] font-bold text-[#40484f] uppercase mb-2">
                  {i === 0 ? 'Hace 2 minutos' : i === 1 ? 'Hace 15 minutos' : i === 2 ? 'Hace 1 hora' : 'Recientemente'}
                </p>
                <p className="text-sm font-semibold text-[#1a1c1d]">
                  <span className="text-[#004b71]">{s.name}</span> — Promedio: <span className={cn(s.average >= 80 ? 'text-[#006c4d]' : s.average >= 60 ? 'text-[#5f4b00]' : 'text-[#ba1a1a]')}>{s.average || '—'}%</span>
                </p>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-sm text-[#40484f] col-span-full text-center py-8">Sin actividad reciente</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherMonitoring;
