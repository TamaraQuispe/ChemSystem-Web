import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit, AlertTriangle, TrendingDown, Zap, Users,
  ChevronRight, Info, Sparkles, Clock, RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';
import { useTeacherStore } from '../../store/teacherStore';

const TeacherPredictive = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { classes, selectedClass, setSelectedClass, fetchClasses } = useTeacherStore();

  useEffect(() => { fetchClasses(); }, []);
  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    setError(null);
    teacherService.getPredictiveData(selectedClass.id)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedClass?.id]);

  if (loading && !data) {
    return (
      <div className="space-y-8">
        <div className="w-80 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-64 bg-white rounded-3xl animate-pulse border border-gray-100" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
        <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
        <button onClick={() => teacherService.getPredictiveData(selectedClass?.id).then(setData)}
          className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
      </Card>
    );
  }

  const { atRisk, suggestions, totalStudents, atRiskCount } = data || { atRisk: [], suggestions: [], totalStudents: 0, atRiskCount: 0 };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Dashboard de Alertas Estratégicas</p>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Análisis Predictivo</h1>
            <p className="text-text-secondary font-semibold mt-1">Intervenciones basadas en el rendimiento de tus estudiantes</p>
          </div>
          <button onClick={() => teacherService.getPredictiveData(selectedClass?.id).then(setData)}
            className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
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

      {atRiskCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white border-none">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle size={28} />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-black text-white mb-1">Alerta: {atRiskCount} estudiante(s) en riesgo</h2>
                <p className="text-sm font-semibold text-white/80 mb-4">Se detectaron estudiantes con bajo rendimiento sostenido. Se recomienda intervención temprana.</p>
                <div className="flex gap-2">
                  {['Programar tutoría', 'Generar reporte', 'Notificar padres'].map((action, i) => (
                    <button key={i} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all active:scale-95">
                      {action}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-4xl font-black text-white">{atRiskCount}</p>
                <p className="text-xs font-bold text-white/70">de {totalStudents}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6">
            <h2 className="text-lg font-black text-primary-dark mb-6">Estudiantes con Dificultades</h2>
            {atRisk.length === 0 ? (
              <div className="text-center py-12">
                <Zap size={48} className="text-emerald-300 mx-auto mb-4" />
                <p className="text-sm font-bold text-text-secondary">No hay estudiantes en riesgo actualmente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {atRisk.map((s, idx) => (
                  <div key={s.id} className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden">
                        <img src={s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-black text-text-main">{s.name}</p>
                        <p className="text-[10px] font-bold text-text-secondary">Promedio: {s.average}% · Tendencia: {s.trend > 0 ? '+' : ''}{s.trend}%</p>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                        s.riskLevel === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                      )}>{s.riskLevel === 'high' ? 'Crítico' : 'Alerta'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.suggestions?.map((sg, si) => (
                        <span key={si} className="text-[9px] font-semibold px-2.5 py-1 bg-white rounded-lg text-text-secondary border border-red-100">
                          {sg}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={20} className="text-primary" />
              <h2 className="text-lg font-black text-primary-dark">Sugerencias de la IA</h2>
            </div>
            <div className="space-y-4">
              {suggestions.length === 0 ? (
                <p className="text-sm font-semibold text-text-secondary text-center py-8">Sin sugerencias disponibles.</p>
              ) : suggestions.map((sg, idx) => (
                <div key={idx} className={cn(
                  "p-4 rounded-2xl",
                  sg.type === 'warning' ? 'bg-amber-50 border border-amber-100' : 'bg-blue-50 border border-blue-100'
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                      sg.type === 'warning' ? 'bg-amber-100 text-amber-500' : 'bg-blue-100 text-blue-500'
                    )}>
                      {sg.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
                    </div>
                    <p className="text-xs font-semibold text-text-secondary leading-relaxed">{sg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherPredictive;
