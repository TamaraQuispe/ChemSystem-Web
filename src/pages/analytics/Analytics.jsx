import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Target, Zap, Clock, AlertTriangle, RefreshCw, Trophy,
  BookOpen, Beaker, BrainCircuit, Lightbulb, Award, ChevronRight,
  Thermometer, Droplets, Atom, Shield, BarChart3, Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAchievementStore } from '../../store/achievementStore';
import api from '../../services/api';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end justify-around gap-3" style={{ height: 180 }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 180;
        const colors = ['bg-sky-100', 'bg-sky-200', 'bg-sky-300', 'bg-sky-400', 'bg-sky-500', 'bg-primary'];
        return (
          <div key={i} className="flex flex-col items-center gap-1 group" style={{ width: '12%' }}>
            <div className="relative flex justify-center w-full">
              <div className={cn(
                'w-full rounded-t-xl transition-all duration-500 group-hover:opacity-80',
                colors[i % colors.length]
              )} style={{ height: Math.max(pct, 4) }} />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1a1c1d] text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {d.value}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CircularProgress = ({ percent, size = 100, strokeWidth = 8 }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(percent, 100) / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="transparent" stroke="#e2e2e3" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="transparent" stroke="#006c4d" strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-1000" />
    </svg>
  );
};

const SkillBar = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="font-medium text-on-surface-variant">{label}</span>
      <span className="font-bold text-on-surface">{percent}%</span>
    </div>
    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
      <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${percent}%` }} />
    </div>
  </div>
);

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('monthly');
  const store = useAchievementStore();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [aRes, rRes, dRes] = await Promise.allSettled([
        api.get('/analytics/me'),
        api.get('/analytics/rankings'),
        api.get('/student/dashboard'),
      ]);
      if (aRes.status === 'fulfilled') setAnalytics(aRes.value.data);
      if (rRes.status === 'fulfilled') setRankings(rRes.value.data || []);
      if (dRes.status === 'fulfilled') setDashboard(dRes.value.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const avgYield = analytics?.avg_yield ? Number(analytics.avg_yield) : 0;
  const avgAccuracy = analytics?.avg_accuracy ? Number(analytics.avg_accuracy) : 0;
  const bestYield = analytics?.best_yield || 0;
  const totalExps = analytics?.total_experiments || 0;
  const rankPos = analytics?.rank_position || rankings.length;
  const level = dashboard?.user?.level || store.level || 1;
  const xp = dashboard?.user?.xp || store.totalXp || 0;
  const userName = dashboard?.user?.name || 'Estudiante';
  const modulesCompleted = dashboard?.kpis?.modulesCompleted || 0;
  const streak = dashboard?.kpis?.streak || store.currentStreak || 0;

  const chartData = useMemo(() => {
    const predictions = analytics?.recentPredictions || [];
    if (predictions.length === 0) {
      return MONTHS.slice(0, 6).map((m, i) => ({ label: m, value: Math.round(50 + Math.random() * 40) }));
    }
    return predictions.slice(0, 6).reverse().map((p, i) => ({
      label: new Date(p.created_at).toLocaleDateString('es', { month: 'short' }),
      value: Math.round(p.yield_percent || p.accuracy_percent || 50),
    }));
  }, [analytics]);

  const myRanking = rankings.findIndex(r => r.user_id === analytics?.user_id || r.user?.id === analytics?.user_id);

  if (loading) return (
    <div className="space-y-8">
      <div className="w-72 h-10 bg-surface-container rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-container-lowest rounded-3xl animate-pulse border border-outline-variant/10" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant/10">
      <AlertTriangle size={40} className="text-gray-300 mx-auto mb-4" />
      <p className="text-lg font-bold text-on-surface mb-3">{error}</p>
      <button onClick={fetchData} className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm">Reintentar</button>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Page Intro */}
      <section>
        <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight">Rendimiento Académico</h1>
        <p className="text-on-surface-variant max-w-2xl mt-1">
          Tu narrativa de aprendizaje en números. Analiza tu progreso, identifica fortalezas y supera tus metas.
        </p>
      </section>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: TrendingUp, label: 'Rendimiento Promedio', value: `${avgYield}%`, badge: `+${Math.max(0, Math.round(avgYield - 80))}%`, badgeColor: 'text-secondary bg-secondary-container/30', iconBg: 'bg-sky-50', iconColor: 'text-sky-600' },
          { icon: Target, label: 'Precisión de Prácticas', value: `${avgAccuracy}%`, badge: avgAccuracy >= 80 ? 'Alta' : 'Media', badgeColor: avgAccuracy >= 80 ? 'text-sky-600 bg-sky-100/50' : 'text-amber-600 bg-amber-100/50', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
          { icon: Zap, label: 'Mejor Rendimiento', value: `${bestYield}%`, badge: `Top ${Math.max(1, Math.round(rankPos))}%`, badgeColor: 'text-amber-600 bg-amber-100/50', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-white/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', stat.iconBg)}>
                <stat.icon size={24} className={stat.iconColor} />
              </div>
              <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full', stat.badgeColor)}>{stat.badge}</span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant">{stat.label}</p>
            <h3 className="text-4xl font-headline font-extrabold text-on-surface">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Charts & Skills */}
        <div className="lg:col-span-8 space-y-8">
          {/* Progress Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-surface-container-lowest/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-xl shadow-sky-900/5">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="font-headline font-bold text-on-surface text-xl">Progreso Académico</h4>
                <p className="text-xs text-on-surface-variant">Evolución mensual de puntajes</p>
              </div>
              <div className="flex gap-2">
                {['monthly', 'annual'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={cn('px-3 py-1.5 text-[10px] font-bold rounded-full transition-all',
                      activeTab === tab ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    )}>
                    {tab === 'monthly' ? 'Mensual' : 'Anual'}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-56 relative">
              <BarChart data={chartData} height={200} />
              <div className="flex justify-between mt-4 px-1 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                {chartData.map((d, i) => <span key={i}>{d.label}</span>)}
              </div>
            </div>
          </motion.div>

          {/* Skills + Success */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-surface-container-lowest p-6 rounded-3xl border border-white/50">
              <h4 className="font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
                <BrainCircuit size={20} className="text-primary" />
                Habilidades
              </h4>
              <div className="space-y-4">
                <SkillBar label="Resolución de Problemas" percent={Math.round(avgYield * 0.95 + 5)} color="bg-primary" />
                <SkillBar label="Teoría Química" percent={Math.round(avgYield * 0.75 + 15)} color="bg-secondary-fixed-dim" />
                <SkillBar label="Análisis de Laboratorio" percent={Math.round(avgYield * 0.85 + 8)} color="bg-tertiary-fixed-dim" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-surface-container-lowest p-6 rounded-3xl border border-white/50 flex flex-col items-center justify-center text-center">
              <div className="relative mb-4">
                <CircularProgress percent={avgAccuracy} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-headline font-bold text-xl text-on-surface">{avgAccuracy}%</span>
                </div>
              </div>
              <h5 className="font-headline font-bold text-on-surface">Éxito en Prácticas</h5>
              <p className="text-xs text-on-surface-variant mt-1">Basado en tus últimas {Math.min(totalExps, 10)} sesiones.</p>
            </motion.div>
          </div>
        </div>

        {/* Right: Ranking + Topics + Achievement */}
        <div className="lg:col-span-4 space-y-8">
          {/* Ranking */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-white/50 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline font-bold text-on-surface">Ranking General</h4>
              <span className="text-[10px] font-bold text-on-surface-variant">#{rankPos || '—'} de {rankings.length || '—'}</span>
            </div>
            <div className="space-y-3">
              {rankings.slice(0, 5).map((r, idx) => {
                const isMe = r.user_id === analytics?.user_id || r.user?.id === analytics?.user_id;
                return (
                  <div key={r.id || idx} className={cn('flex items-center justify-between p-3 rounded-2xl',
                    isMe ? 'bg-sky-50 border border-sky-100' : '')}>
                    <div className="flex items-center gap-3">
                      <span className={cn('text-xs font-bold w-4', isMe ? 'text-primary' : 'text-on-surface-variant')}>{idx + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                        {(r.user?.name || r.name || '?')[0]}
                      </div>
                      <div>
                        <span className={cn('text-sm font-semibold', isMe ? 'text-primary' : 'text-on-surface')}>
                          {r.user?.name || r.name || `Estudiante ${idx + 1}`}
                        </span>
                        {isMe && <span className="text-[9px] font-bold text-primary ml-1">(tú)</span>}
                      </div>
                    </div>
                    <span className={cn('text-xs font-bold', isMe ? 'text-primary' : 'text-on-surface')}>
                      {r.avg_yield ? `${Number(r.avg_yield).toFixed(1)}%` : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
            {rankings.length > 5 && (
              <button className="w-full mt-4 py-3 text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-sky-50 rounded-xl transition-colors">
                Ver Ranking Completo
              </button>
            )}
          </motion.div>

          {/* Topics Analysis */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-surface-container-highest/30 p-6 rounded-3xl border border-white/20">
            <h4 className="font-headline font-bold text-on-surface mb-4">Análisis por Tema</h4>
            <div className="space-y-4">
              {[
                { icon: Droplets, label: 'Química Orgánica', status: 'Excelente', color: 'bg-secondary-container text-on-secondary-container', textColor: 'text-secondary' },
                { icon: Thermometer, label: 'Termodinámica', status: 'Bueno', color: 'bg-sky-100 text-sky-700', textColor: 'text-sky-600' },
                { icon: Beaker, label: 'Estequiometría', status: 'Reforzar', color: 'bg-amber-100 text-amber-700', textColor: 'text-amber-600' },
              ].map((topic, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', topic.color)}>
                      <topic.icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-on-surface">{topic.label}</span>
                  </div>
                  <span className={cn('text-xs font-bold', topic.textColor)}>{topic.status}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Latest Achievement */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-3xl text-white overflow-hidden relative group">
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Último Logro</span>
              <h4 className="font-headline font-bold text-lg mt-1">
                {dashboard?.achievements?.[0]?.title || 'Primeros Pasos'}
              </h4>
              <p className="text-xs opacity-90 mt-2 mb-4">
                {dashboard?.achievements?.[0]?.rarity === 'legendary' ? 'Logro legendario desbloqueado.' : 'Sigue así para desbloquear más logros.'}
              </p>
              <button onClick={() => navigate('/achievements')} className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/30 transition-colors">
                Ver Logros
              </button>
            </div>
            <Award size={120} className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-on-surface-variant/40 text-[10px] font-bold uppercase tracking-[0.2em] pt-8">
        ChemSystem · Datos actualizados en tiempo real
      </footer>
    </div>
  );
};

export default Analytics;
