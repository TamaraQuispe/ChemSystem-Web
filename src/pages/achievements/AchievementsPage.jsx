import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Award, Star, Zap, Clock, Sparkles,
  TrendingUp, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { studentService } from '../../services/studentService';

const rarityConfig = {
  common: { label: 'Común', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
  rare: { label: 'Raro', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  epic: { label: 'Épico', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
  legendary: { label: 'Legendario', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200/50' },
};

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchData = () => {
    setLoading(true);
    setError(null);
    studentService.getAchievements()
      .then(setAchievements)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = filter === 'all' ? achievements : achievements.filter(a => a.rarity === filter);

  const totalXp = achievements.reduce((s, a) => s + a.xp_awarded, 0);
  const legendaryCount = achievements.filter(a => a.rarity === 'legendary').length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Logros</h1>
            <p className="text-text-secondary font-semibold mt-1">Reconocimientos obtenidos</p>
          </div>
          <button onClick={fetchData} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Trophy, label: 'Total Logros', value: achievements.length, color: 'bg-secondary/20' },
          { icon: Star, label: 'Legendarios', value: legendaryCount, color: 'bg-amber-50' },
          { icon: Zap, label: 'XP por Logros', value: totalXp, color: 'bg-blue-50' },
          { icon: TrendingUp, label: 'Racha', value: `${Math.min(achievements.length, 14)} días`, color: 'bg-orange-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-premium">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", stat.color)}>
                <stat.icon size={20} className="text-primary-dark" />
              </div>
              <div>
                <p className="text-2xl font-black text-primary-dark">{stat.value}</p>
                <p className="text-[10px] font-bold text-text-secondary">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'Todos' }, { id: 'common', label: 'Comunes' },
          { id: 'rare', label: 'Raros' }, { id: 'epic', label: 'Épicos' }, { id: 'legendary', label: 'Legendarios' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)}
            className={cn("px-5 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap shrink-0",
              filter === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-text-secondary border border-gray-100"
            )}>{tab.label}</button>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gray-200 shrink-0" />
                <div className="flex-grow space-y-2">
                  <div className="w-2/3 h-4 bg-gray-200 rounded" />
                  <div className="w-full h-3 bg-gray-200 rounded" />
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
        ) : filtered.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <Trophy size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-black text-primary-dark mb-2">Sin logros aún</h3>
              <p className="text-sm font-semibold text-text-secondary">Completa actividades para ganar logros</p>
            </Card>
          </div>
        ) : filtered.map((a, idx) => {
          const rarity = rarityConfig[a.rarity] || rarityConfig.common;
          return (
            <motion.div key={a.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={cn("bg-white rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all", rarity.border)}>
              <div className="flex items-start gap-3">
                <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0", rarity.bg)}>
                  <Award size={22} className={rarity.color} />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-black text-primary-dark truncate">{a.title}</h3>
                    <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0", rarity.bg, rarity.color)}>
                      {rarity.label}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">{a.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[9px] font-semibold text-text-secondary">
                      <Clock size={10} />
                      {a.created_at ? new Date(a.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' }) : 'Reciente'}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500">
                      <Sparkles size={10} /> +{a.xp_awarded} XP
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AchievementsPage;
