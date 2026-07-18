import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Award, Star, Zap, Target, BookOpen,
  FlaskConical, BrainCircuit, Medal, Sparkles,
  Clock, Calendar, TrendingUp, Gem, RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { parentService } from '../../services/parentService';
import { useParentStore } from '../../store/parentStore';

const rarityConfig = {
  common: { label: 'Común', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
  rare: { label: 'Raro', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  epic: { label: 'Épico', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
  legendary: { label: 'Legendario', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200/50' },
};

const iconMap = {
  common: BookOpen,
  rare: Star,
  epic: Medal,
  legendary: Trophy,
};

const monthlyProgress = [
  { month: 'Ene', xp: 150, achievements: 2 },
  { month: 'Feb', xp: 320, achievements: 3 },
  { month: 'Mar', xp: 580, achievements: 5 },
  { month: 'Abr', xp: 890, achievements: 7 },
  { month: 'May', xp: 1250, achievements: 9 },
  { month: 'Jun', xp: 1680, achievements: 12 },
];

const ParentAchievements = () => {
  const [filter, setFilter] = useState('all');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const selectedChild = useParentStore((state) => state.selectedChild);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    parentService.getAchievements(selectedChild?.id)
      .then(setAchievements)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedChild?.id]);

  const filteredAchievements = filter === 'all'
    ? achievements
    : achievements.filter(a => a.rarity === filter);

  const stats = [
    { icon: Trophy, label: 'Total Logros', value: achievements.length.toString() },
    { icon: Star, label: 'Legendarios', value: achievements.filter(a => a.rarity === 'legendary').length.toString() },
    { icon: Zap, label: 'Racha Actual', value: '7 días' },
    { icon: TrendingUp, label: 'XP Total', value: achievements.reduce((s, a) => s + (a.xp || 0), 0).toString() },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Historial de Logros</h1>
            <p className="text-text-secondary font-semibold mt-1">Evolución y reconocimientos obtenidos</p>
          </div>
          <button onClick={fetchData} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-premium"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <stat.icon size={20} className="text-primary-dark" />
              </div>
              <div>
                <p className="text-2xl font-black text-primary-dark">{stat.value}</p>
                <p className="text-[10px] font-bold text-text-secondary">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-primary-dark">Evolución Mensual</h2>
            <div className="flex items-center gap-1 text-xs font-bold text-text-secondary">
              <Calendar size={14} />
              2026
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {monthlyProgress.map((month, idx) => {
              const maxXp = Math.max(...monthlyProgress.map(m => m.xp));
              const heightPercent = (month.xp / maxXp) * 100;
              return (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[9px] font-bold text-text-secondary">{month.xp}XP</span>
                  <div className="w-full relative flex items-end justify-center" style={{ height: '80px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + idx * 0.05 }}
                      className={cn(
                        "w-full max-w-[32px] rounded-xl transition-all",
                        month.xp >= 1000 ? "bg-gradient-to-t from-amber-400 to-amber-300" :
                        month.xp >= 500 ? "bg-gradient-to-t from-violet-400 to-violet-300" :
                        "bg-gradient-to-t from-blue-400 to-blue-300"
                      )}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-text-secondary">{month.month}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {[
          { id: 'all', label: 'Todos' },
          { id: 'common', label: 'Comunes' },
          { id: 'rare', label: 'Raros' },
          { id: 'epic', label: 'Épicos' },
          { id: 'legendary', label: 'Legendarios' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "px-5 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap shrink-0",
              filter === tab.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white text-text-secondary border border-gray-100 hover:border-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gray-200 shrink-0" />
                <div className="flex-grow space-y-2">
                  <div className="w-2/3 h-4 bg-gray-200 rounded" />
                  <div className="w-full h-3 bg-gray-200 rounded" />
                  <div className="w-1/3 h-3 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
              <button onClick={fetchData} className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
            </Card>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <Trophy size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-black text-primary-dark mb-2">Sin logros aún</h3>
              <p className="text-sm font-semibold text-text-secondary">Los logros aparecerán aquí a medida que tu hijo complete módulos</p>
            </Card>
          </div>
        ) : (
          filteredAchievements.map((achievement, idx) => {
            const rarity = rarityConfig[achievement.rarity] || rarityConfig.common;
            const Icon = iconMap[achievement.rarity] || Award;
            return (
              <motion.div
                key={achievement.title + idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={cn("bg-white rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all", rarity.border)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0", rarity.bg)}>
                    <Icon size={22} className={rarity.color} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-black text-primary-dark truncate">{achievement.title}</h3>
                      <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0", rarity.bg, rarity.color)}>
                        {rarity.label}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">{achievement.desc}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[9px] font-semibold text-text-secondary">
                        <Clock size={10} />
                        {achievement.date ? new Date(achievement.date).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Reciente'}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500">
                        <Sparkles size={10} />
                        +{achievement.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
};

export default ParentAchievements;
