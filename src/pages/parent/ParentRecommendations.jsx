import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit, Lightbulb, BookOpen, Target, Clock,
  Sparkles, TrendingUp, ArrowRight, AlertTriangle,
  CheckCircle, Play, Download, Star, RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { parentService } from '../../services/parentService';
import { useParentStore } from '../../store/parentStore';

const insights = [
  { icon: BrainCircuit, label: 'Inteligencias Múltiples', value: 'Lógico-Matemática', detail: 'Fortaleza dominante', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: TrendingUp, label: 'Ritmo de Aprendizaje', value: 'Por encima del promedio', detail: '+18% vs grupo', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Target, label: 'Área de Mejora', value: 'Termodinámica', detail: '55% de dominio', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Clock, label: 'Tiempo Óptimo', value: 'Mañanas (8-11am)', detail: 'Mayor concentración', color: 'text-violet-500', bg: 'bg-violet-50' },
];

const priorityConfig = {
  high: { badge: 'bg-red-500/10 text-red-500', label: 'Prioridad Alta' },
  medium: { badge: 'bg-amber-500/10 text-amber-500', label: 'Prioridad Media' },
  low: { badge: 'bg-blue-500/10 text-blue-500', label: 'Prioridad Baja' },
};

const typeConfig = {
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50/50', border: 'border-amber-200/50' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50/50', border: 'border-emerald-200/50' },
  tip: { icon: Lightbulb, color: 'text-blue-500', bg: 'bg-blue-50/50', border: 'border-blue-200/50' },
};

const ParentRecommendations = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insightData, setInsightData] = useState(null);
  const selectedChild = useParentStore((state) => state.selectedChild);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    parentService.getRecommendations(selectedChild?.id)
      .then(async (recs) => {
        setRecommendations(recs);
        // Get AI recommendations
        try {
          const { default: api } = await import('../../services/api');
          const dash = await api.get('/parent/dashboard' + (selectedChild?.id ? `?child_id=${selectedChild.id}` : ''));
          if (dash.data?.kpis && dash.data?.student) {
            const aiRes = await api.post('/ai/recommend', {
              studentName: dash.data.student.name,
              kpis: dash.data.kpis,
              subjectProgress: dash.data.subjectProgress || [],
            });
            if (aiRes.data?.insights?.length > 0) {
              setInsightData(aiRes.data);
            }
          }
        } catch {}
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedChild?.id]);

  const filteredRecs = activeTab === 'all'
    ? recommendations
    : recommendations.filter(r => r.priorityLabel === activeTab);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Recomendaciones de Apoyo</h1>
            <p className="text-text-secondary font-semibold mt-1">Análisis inteligente para potenciar el aprendizaje</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-primary/5 text-primary rounded-2xl text-xs font-bold flex items-center gap-2">
              <Sparkles size={14} />
              Analizado por IA
            </div>
            <button onClick={fetchData} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Insights (static for now) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {(insightData?.insights || insights).map((item, idx) => (
          <motion.div
            key={item.label || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-premium"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", item.bg || 'bg-blue-50')}>
              {item.icon ? <item.icon size={20} className={item.color || 'text-blue-500'} /> : <span className="text-lg">🤖</span>}
            </div>
            <p className="text-xs font-bold text-text-secondary mb-0.5">{item.label || 'Análisis IA'}</p>
            <p className="text-sm font-black text-primary-dark">{item.value}</p>
            <p className="text-[10px] font-semibold text-text-secondary mt-0.5">{item.detail}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex gap-2"
      >
        {[
          { id: 'all', label: 'Todas' },
          { id: 'high', label: 'Prioridad Alta' },
          { id: 'medium', label: 'Prioridad Media' },
          { id: 'low', label: 'Prioridad Baja' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white text-text-secondary border border-gray-100 hover:border-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="flex-grow space-y-3">
                    <div className="w-1/3 h-4 bg-gray-200 rounded" />
                    <div className="w-full h-3 bg-gray-200 rounded" />
                    <div className="w-1/4 h-3 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Card className="p-12 text-center">
            <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
            <button onClick={fetchData} className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
          </Card>
        ) : filteredRecs.length === 0 ? (
          <Card className="p-12 text-center">
            <Lightbulb size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-text-secondary">No hay recomendaciones en esta categoría</p>
          </Card>
        ) : (
          filteredRecs.map((rec, idx) => {
            const typeStyle = typeConfig[rec.type] || typeConfig.tip;
            const priority = priorityConfig[rec.priorityLabel] || priorityConfig.low;
            return (
              <motion.div
                key={rec.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn("bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all", typeStyle.border)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", typeStyle.bg)}>
                    <typeStyle.icon size={24} className={typeStyle.color} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-black text-primary-dark">{rec.title || 'Recomendación'}</h3>
                      <span className={cn("text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider", priority.badge)}>
                        {priority.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-text-secondary leading-relaxed">{rec.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Download size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Reporte Completo de Análisis</h3>
              <p className="text-xs font-semibold text-white/70">Descarga el informe detallado con todas las recomendaciones personalizadas</p>
            </div>
          </div>
          <button onClick={() => {
            const doc = `
            <html><head><meta charset="utf-8"><title>Reporte de Recomendaciones</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1c1d; }
              h1 { font-size: 24px; color: #004b71; margin-bottom: 8px; }
              h2 { font-size: 18px; color: #004b71; margin-top: 30px; margin-bottom: 12px; }
              .insight { background: #f3f3f4; padding: 16px; border-radius: 16px; margin-bottom: 12px; }
              .rec { border-left: 4px solid #004b71; padding: 12px 16px; margin-bottom: 16px; background: #f9f9fa; }
              .rec-warning { border-left-color: #f59e0b; }
              .badge { background: #cbe6ff; color: #004b71; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 6px; }
              p { font-size: 14px; line-height: 1.6; color: #40484f; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e2e3; font-size: 12px; color: #707880; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin: 16px 0; }
              td { padding: 8px 12px; border-bottom: 1px solid #e2e2e3; font-size: 13px; }
              td:first-child { font-weight: 600; color: #1a1c1d; }
              td:last-child { color: #40484f; }
            </style></head><body>
              <h1>Reporte de Recomendaciones</h1>
              <p style="color:#707880;margin-bottom:30px;">Generado el ${new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <h2>📊 Análisis General</h2>
              <div class="insight"><table>
                ${insights.map(i => `<tr><td>${i.label}</td><td><strong>${i.value}</strong> · ${i.detail}</td></tr>`).join('')}
              </table></div>
              <h2>💡 Recomendaciones</h2>
              ${filteredRecs.map(r => {
                const priorityLabel = r.priorityLabel === 'high' ? 'Prioridad Alta' : r.priorityLabel === 'medium' ? 'Prioridad Media' : 'Prioridad Baja';
                const icon = r.priorityLabel === 'high' ? '🔴' : r.priorityLabel === 'medium' ? '🟡' : '🔵';
                return `<div class="rec"><div class="badge">${icon} ${priorityLabel}</div><p style="font-weight:600;margin-bottom:4px;">${r.title || 'Recomendación'}</p><p>${r.message}</p></div>`;
              }).join('')}
              <div class="footer"><p>ChemSystem · Plataforma Educativa de Química · Este reporte fue generado automáticamente basado en el rendimiento académico del estudiante.</p></div>
            </body></html>`;
            const blob = new Blob([doc], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `recomendaciones-${new Date().toISOString().slice(0, 10)}.html`; a.click();
            URL.revokeObjectURL(url);
          }} className="px-6 py-3 bg-white text-primary-dark rounded-2xl font-bold text-sm hover:bg-white/90 transition-all active:scale-95 shrink-0">
            Descargar Reporte
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ParentRecommendations;
