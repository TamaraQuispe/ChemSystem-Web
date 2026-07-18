import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Target, Zap, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [aRes, rRes] = await Promise.allSettled([
        api.get('/analytics/me'),
        api.get('/analytics/rankings'),
      ]);
      if (aRes.status === 'fulfilled') setAnalytics(aRes.value.data);
      if (rRes.status === 'fulfilled') setRankings(rRes.value.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="w-64 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
        <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
        <button onClick={fetchData} className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
      </Card>
    );
  }

  const stats = [
    { icon: TrendingUp, label: 'Rendimiento Promedio', value: analytics?.avg_yield ? `${analytics.avg_yield}%` : '—', color: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { icon: Target, label: 'Precisión', value: analytics?.avg_accuracy ? `${analytics.avg_accuracy}%` : '—', color: 'bg-blue-50', iconColor: 'text-blue-500' },
    { icon: Zap, label: 'Mejor Rendimiento', value: analytics?.best_yield ? `${analytics.best_yield}%` : '—', color: 'bg-amber-50', iconColor: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-primary-dark tracking-tight">Analíticas</h1>
        <p className="text-text-secondary font-semibold mt-1">Tu rendimiento académico detallado</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-premium">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
                <stat.icon size={24} className={stat.iconColor} />
              </div>
              <div>
                <p className="text-2xl font-black text-primary-dark">{stat.value}</p>
                <p className="text-xs font-bold text-text-secondary">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-primary-dark">Ranking General</h2>
            <span className="text-xs font-bold text-text-secondary">#{analytics?.rank_position || '—'}° de {rankings.length || '—'}</span>
          </div>
          {rankings.length === 0 ? (
            <p className="text-sm font-semibold text-text-secondary text-center py-8">Aún no hay datos de ranking.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">#</th>
                    <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Estudiante</th>
                    <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Rendimiento</th>
                    <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Precisión</th>
                    <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Experimentos</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.slice(0, 10).map((r, idx) => (
                    <tr key={r.id || idx} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                      <td className="py-3 text-xs font-black text-text-secondary">{idx + 1}</td>
                      <td className="py-3 text-xs font-bold text-text-main">{r.name || r.user?.name || `Estudiante ${idx + 1}`}</td>
                      <td className="py-3 text-xs font-bold text-text-main">{r.avg_yield || r.average || '—'}%</td>
                      <td className="py-3 text-xs font-bold text-text-main">{r.avg_accuracy || '—'}%</td>
                      <td className="py-3 text-xs font-bold text-text-main">{r.total_experiments || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;
