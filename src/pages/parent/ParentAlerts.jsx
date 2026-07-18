import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, AlertTriangle, CheckCircle, BookOpen, Heart,
  Info, Filter, ChevronRight, Clock, RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { parentService } from '../../services/parentService';
import { useParentStore } from '../../store/parentStore';

const categories = [
  { id: 'all', label: 'Todas', icon: Bell },
  { id: 'alert', label: 'Académicas', icon: BookOpen },
  { id: 'emotional', label: 'Emocionales', icon: Heart },
  { id: 'achievement', label: 'Logros', icon: CheckCircle },
  { id: 'system', label: 'Sistema', icon: Info },
];

const severityColors = {
  high: { badge: 'bg-red-500/10 text-red-500 border-red-200/50', dot: 'bg-red-500', label: 'Importante' },
  medium: { badge: 'bg-amber-500/10 text-amber-500 border-amber-200/50', dot: 'bg-amber-500', label: 'Media' },
  low: { badge: 'bg-blue-500/10 text-blue-500 border-blue-200/50', dot: 'bg-blue-500', label: 'Informativa' },
};

const typeConfig = {
  alert: { icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
  emotional: { icon: Heart, color: 'text-rose-500 bg-rose-50' },
  achievement: { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
  system: { icon: Info, color: 'text-gray-500 bg-gray-50' },
  urgent: { icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
  info: { icon: Info, color: 'text-blue-500 bg-blue-50' },
};

const ParentAlerts = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const selectedChild = useParentStore((state) => state.selectedChild);

  const fetchAlerts = () => {
    setLoading(true);
    setError(null);
    parentService.getAlerts(selectedChild?.id, activeCategory)
      .then(setAlerts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, [activeCategory, selectedChild?.id]);

  const markAsRead = async (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    try {
      await parentService.markAlertRead(id);
    } catch {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: false } : a));
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Centro de Alertas</h1>
            <p className="text-text-secondary font-semibold mt-1">Notificaciones y seguimiento académico</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-primary/5 text-primary rounded-2xl text-xs font-bold flex items-center gap-2">
              <Bell size={14} />
              {unreadCount} sin leer
            </div>
            <button onClick={fetchAlerts} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap shrink-0",
              activeCategory === cat.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white text-text-secondary border border-gray-100 hover:border-gray-200 hover:bg-gray-50"
            )}
          >
            <cat.icon size={16} />
            {cat.label}
          </button>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="flex-grow space-y-2">
                    <div className="w-3/4 h-4 bg-gray-200 rounded" />
                    <div className="w-full h-3 bg-gray-200 rounded" />
                    <div className="w-1/3 h-3 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Card className="p-12 text-center">
            <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
            <button onClick={fetchAlerts} className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
          </Card>
        ) : alerts.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-gray-300" />
            </div>
            <p className="text-sm font-bold text-text-secondary">No hay alertas en esta categoría</p>
          </Card>
        ) : (
          alerts.map((alert, idx) => {
            const typeStyle = typeConfig[alert.type] || typeConfig.info;
            const TypeIcon = typeStyle.icon;
            const severity = severityColors[alert.severity] || severityColors.low;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => !alert.read && markAsRead(alert.id)}
                className={cn(
                  "bg-white rounded-3xl p-5 border transition-all cursor-pointer hover:shadow-md",
                  alert.read ? "border-gray-100" : "border-primary/10 shadow-sm"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0", typeStyle.color)}>
                    <TypeIcon size={20} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      {!alert.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      <h3 className={cn("text-sm", alert.read ? "font-bold text-text-main" : "font-black text-primary-dark")}>
                        {alert.title}
                      </h3>
                    </div>
                    <p className="text-xs font-semibold text-text-secondary leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg border", severity.badge)}>
                        {severity.label}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-text-secondary">
                        <Clock size={12} />
                        {alert.time}
                      </span>
                    </div>
                  </div>
                  <button className="p-1.5 text-text-secondary hover:bg-gray-50 rounded-lg transition-all shrink-0 self-start">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
};

export default ParentAlerts;
