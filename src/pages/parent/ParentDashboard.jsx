import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Clock, Target, Zap, Award, ChevronRight, ChevronDown,
  BrainCircuit, BookOpen, AlertTriangle, CheckCircle,
  Lightbulb, ArrowUpRight, Heart, Sparkles, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { parentService } from '../../services/parentService';
import { useParentStore } from '../../store/parentStore';

const subjects = [
  { key: 'General', label: 'Química General', color: '#005B8F' },
  { key: 'Organica', label: 'Química Orgánica', color: '#78F0C4' },
  { key: 'Termodinamica', label: 'Termodinámica', color: '#F59E0B' },
  { key: 'Cinetica', label: 'Cinética Química', color: '#8B3DFF' },
  { key: 'Acidos', label: 'Ácidos y Bases', color: '#EF4444' },
];

const renderTrend = (trend, change) => {
  if (trend === 'up') return <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500"><ArrowUpRight size={12} />{change}</span>;
  return <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-500"><ArrowUpRight size={12} className="rotate-90" />{change}</span>;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-100">
      <p className="text-xs font-black text-primary-dark mb-2">{label}</p>
      {payload.map((entry) => {
        const subject = subjects.find(s => s.key === entry.dataKey);
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subject?.color || entry.color }} />
            <span className="text-[10px] font-semibold text-text-secondary">{subject?.label || entry.dataKey}</span>
            <span className="text-[10px] font-black text-text-main ml-auto">{entry.value}%</span>
          </div>
        );
      })}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-200" />
      <div className="w-14 h-3 bg-gray-200 rounded" />
    </div>
    <div className="w-20 h-7 bg-gray-200 rounded mb-2" />
    <div className="w-24 h-3 bg-gray-200 rounded" />
  </div>
);

const ParentDashboard = () => {
  const [greeting, setGreeting] = useState('Buenos días');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailSubject, setDetailSubject] = useState(null);
  const selectedChild = useParentStore((state) => state.selectedChild);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    parentService.getDashboard(selectedChild?.id)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedChild?.id]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="w-72 h-9 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-56 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="h-80 bg-white rounded-3xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
        <p className="text-lg font-bold text-text-main mb-2">Error al cargar el dashboard</p>
        <p className="text-sm text-text-secondary mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all">
          Reintentar
        </button>
      </Card>
    );
  }

  const { kpis, student, weeklyEvolution, subjectProgress, recentActivity, recommendations } = data;

  const kpiConfig = [
    { icon: TrendingUp, label: 'Promedio General', value: `${kpis.avgScore}`, change: '+2.3', color: 'bg-emerald-50', iconColor: 'text-emerald-500', trend: 'up' },
    { icon: Clock, label: 'Tiempo de Estudio', value: '12.5h', change: '+1.8h', color: 'bg-blue-50', iconColor: 'text-blue-500', trend: 'up' },
    { icon: Target, label: 'Retos Completados', value: kpis.challengesCompleted, change: '80%', color: 'bg-violet-50', iconColor: 'text-violet-500', trend: 'up' },
    { icon: Zap, label: 'Racha Actual', value: `${kpis.streak} días`, change: '¡récord!', color: 'bg-orange-50', iconColor: 'text-orange-500', trend: 'up' },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-primary-dark tracking-tight">
          {greeting}, bienvenido
        </h1>
        <p className="text-text-secondary font-semibold mt-1">
          Así va el progreso académico de {student.name}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {kpiConfig.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-premium hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", kpi.color)}>
                <kpi.icon size={24} className={kpi.iconColor} />
              </div>
              {renderTrend(kpi.trend, kpi.change)}
            </div>
            <p className="text-2xl font-black text-primary-dark tracking-tight">{kpi.value}</p>
            <p className="text-xs font-bold text-text-secondary mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-primary" />
              <h2 className="text-lg font-black text-primary-dark">Evolución Semanal</h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors">
              Últimas 6 semanas
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            {subjects.map(sub => (
              <div key={sub.key} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: sub.color }} />
                <span className="text-[10px] font-bold text-text-secondary">{sub.label}</span>
              </div>
            ))}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyEvolution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {subjects.map(sub => (
                    <linearGradient key={sub.key} id={`g_${sub.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={sub.color} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={sub.color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }} />
                <YAxis hide={true} domain={[40, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '4 4' }} />
                {subjects.map(sub => (
                  <Area
                    key={sub.key}
                    type="monotone"
                    dataKey={sub.key}
                    stroke={sub.color}
                    strokeWidth={2.5}
                    fill={`url(#g_${sub.key})`}
                    dot={false}
                    activeDot={{ r: 4, fill: sub.color, stroke: '#fff', strokeWidth: 2 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-5"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-primary-dark">Rendimiento por Materia</h2>
              <button onClick={() => {
                const subjectsWithData = subjectProgress.filter(s => s.progress > 0);
                if (subjectsWithData.length > 0) setDetailSubject(subjectsWithData[0]);
              }} className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                Ver detalle <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-4">
              {subjectProgress.length === 0 ? (
                <p className="text-sm font-semibold text-text-secondary text-center py-4">Aún no hay datos de materias</p>
              ) : subjectProgress.map((item) => (
                <div key={item.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-text-main">{item.subject}</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-wider",
                      item.status === 'excelente' && 'text-emerald-500',
                      item.status === 'bueno' && 'text-blue-500',
                      item.status === 'atencion' && 'text-amber-500'
                    )}>
                      {item.progress}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={cn(
                        "h-full rounded-full transition-all",
                        item.progress >= 80 && 'bg-emerald-400',
                        item.progress >= 60 && item.progress < 80 && 'bg-blue-400',
                        item.progress < 60 && 'bg-amber-400'
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-black text-primary-dark mb-6">Actividad Reciente</h2>
            <div className="space-y-1">
              {recentActivity.length === 0 ? (
                <p className="text-sm font-semibold text-text-secondary text-center py-4">No hay actividad reciente</p>
              ) : recentActivity.map((activity, idx) => {
                const Icon = activity.type === 'alert' || activity.type === 'urgent' ? AlertTriangle :
                  activity.type === 'achievement' ? Award :
                  activity.type === 'emotional' ? Heart : BookOpen;
                const color = activity.type === 'alert' ? 'text-red-500' :
                  activity.type === 'achievement' ? 'text-emerald-500' :
                  activity.type === 'emotional' ? 'text-rose-500' : 'text-blue-500';
                return (
                  <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", color.replace('text', 'bg') + '/10')}>
                      <Icon size={16} className={color} />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-xs font-bold text-text-main">{activity.label || activity.message}</p>
                      <p className="text-[10px] font-semibold text-text-secondary mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >
          <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/10">
                <Heart size={28} className="text-secondary" fill="#78F0C4" />
              </div>
              <div>
                <p className="text-sm font-black text-white">{student.name}</p>
                <p className="text-[11px] font-bold text-white/70">Nivel {student.level} · {student.xp} XP</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Último acceso</p>
                <p className="text-sm font-black text-white">Hoy 08:30</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Tareas</p>
                <p className="text-sm font-black text-white">3 pendientes</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <BrainCircuit size={20} className="text-primary" />
              <h2 className="text-base font-black text-primary-dark">Recomendaciones de Apoyo</h2>
            </div>
            <div className="space-y-4">
              {recommendations.length === 0 ? (
                <p className="text-xs font-semibold text-text-secondary text-center py-4">No hay recomendaciones disponibles</p>
              ) : recommendations.map((rec, idx) => (
                <div key={idx} className={cn(
                  "p-4 rounded-2xl",
                  rec.type === 'warning' ? 'bg-amber-50' : rec.type === 'success' ? 'bg-emerald-50' : 'bg-blue-50'
                )}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                      {rec.type === 'warning' ? <AlertTriangle size={18} className="text-amber-500" /> :
                       rec.type === 'success' ? <CheckCircle size={18} className="text-emerald-500" /> :
                       <Lightbulb size={18} className="text-blue-500" />}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-text-main mb-1">{rec.title}</h3>
                      <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">{rec.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => window.location.href = '/parent/recommendations'}
              className="w-full mt-4 py-3 bg-primary/5 text-primary rounded-2xl font-bold text-xs hover:bg-primary/10 transition-all active:scale-[0.98]">
              Ver todas las recomendaciones →
            </button>
          </Card>
        </motion.div>
      </div>

      {/* Subject Detail Modal */}
      {detailSubject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailSubject(null)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-primary-dark">{detailSubject.subject}</h3>
                <p className="text-sm text-text-secondary mt-1">Rendimiento detallado</p>
              </div>
              <button onClick={() => setDetailSubject(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-lg">✕</button>
            </div>
            <div className="space-y-5">
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <p className="text-5xl font-black text-primary-dark">{detailSubject.progress}%</p>
                <p className="text-xs font-bold text-text-secondary mt-2">Progreso actual</p>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${detailSubject.progress}%` }}
                  className={cn("h-full rounded-full",
                    detailSubject.progress >= 80 ? 'bg-emerald-400' : detailSubject.progress >= 60 ? 'bg-blue-400' : 'bg-amber-400'
                  )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-text-secondary">Estado</p>
                  <p className={cn("text-sm font-black mt-1",
                    detailSubject.status === 'excelente' ? 'text-emerald-500' : detailSubject.status === 'bueno' ? 'text-blue-500' : 'text-amber-500'
                  )}>
                    {detailSubject.status === 'excelente' ? 'Excelente' : detailSubject.status === 'bueno' ? 'Bueno' : 'Atención'}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-text-secondary">Rendimiento</p>
                  <p className="text-sm font-black text-blue-500 mt-1">{detailSubject.progress >= 80 ? 'Sobre la media' : detailSubject.progress >= 60 ? 'En desarrollo' : 'Requiere refuerzo'}</p>
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl flex items-start gap-3">
                <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-text-secondary">
                  {detailSubject.progress >= 80 ? 'Tu hijo domina esta materia. Sigue motivándolo con nuevos retos.' :
                   detailSubject.progress >= 60 ? 'Tu hijo va bien, pero puede mejorar. Revisa las recomendaciones para reforzar.' :
                   'Esta materia necesita atención. Te sugerimos revisar las recomendaciones de apoyo.'}
                </p>
              </div>
              <button onClick={() => { setDetailSubject(null); window.location.href = '/parent/recommendations'; }}
                className="w-full py-3 bg-primary-dark text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all">
                Ver recomendaciones →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
