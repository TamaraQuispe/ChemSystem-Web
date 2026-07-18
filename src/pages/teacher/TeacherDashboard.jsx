import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, FlaskConical, ChevronRight,
  TrendingUp, Clock, AlertTriangle, RefreshCw, X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';

const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', section: 'A' });
  const [creating, setCreating] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    teacherService.getDashboard()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) return;
    setCreating(true);
    try {
      await teacherService.createClass(form);
      setShowCreateModal(false);
      setForm({ name: '', subject: '', section: 'A' });
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="w-96 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
        <p className="text-lg font-bold text-text-main mb-4">{error}</p>
        <Button onClick={fetchData}>Reintentar</Button>
      </Card>
    );
  }

  const { classrooms, stats, activity } = data;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-primary-dark mb-2">Panel de Control Docente</h1>
        <p className="text-text-secondary font-medium">Gestiona tus aulas y supervisa el progreso de tus estudiantes.</p>
      </motion.div>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-primary-dark">Nueva Aula</h2>
                  <button onClick={() => setShowCreateModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleCreateClass} className="space-y-4">
                  <Input label="Nombre del aula" placeholder="Ej: Química Orgánica II" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  <Input label="Materia" placeholder="Ej: Química Orgánica" value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
                  <Input label="Sección" placeholder="A" value={form.section}
                    onChange={e => setForm(f => ({ ...f, section: e.target.value }))} />
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                    <Button type="submit" className="flex-1 bg-primary-dark text-white" isLoading={creating}>Crear Aula</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { icon: BookOpen, label: 'Aulas Activas', value: stats.totalClassrooms, color: 'bg-blue-50', iconColor: 'text-blue-500' },
          { icon: Users, label: 'Total Estudiantes', value: stats.totalStudents, color: 'bg-emerald-50', iconColor: 'text-emerald-500' },
          { icon: TrendingUp, label: 'Progreso Promedio', value: `${stats.avgProgress}%`, color: 'bg-violet-50', iconColor: 'text-violet-500' },
        ].map((stat, idx) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-primary-dark">Tus Aulas</h2>
              <Button size="sm" className="rounded-xl bg-primary-dark text-white text-xs font-bold px-4 h-9" onClick={() => setShowCreateModal(true)}>
                + Nueva Aula
              </Button>
            </div>
            {classrooms.length === 0 ? (
              <p className="text-sm font-semibold text-text-secondary text-center py-8">No tienes aulas asignadas aún.</p>
            ) : (
              <div className="space-y-3">
                {classrooms.map((c, idx) => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FlaskConical size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-primary-dark">{c.name}</p>
                        <p className="text-[10px] font-bold text-text-secondary">{c.subject} · {c.code} · {c.studentCount} estudiantes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-black text-primary-dark mb-6">Actividad Reciente</h2>
            {activity.length === 0 ? (
              <p className="text-sm font-semibold text-text-secondary text-center py-8">Sin actividad reciente.</p>
            ) : (
              <div className="space-y-1">
                {activity.map((a, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                      a.type === 'alert' ? 'bg-red-50 text-red-500' : a.type === 'achievement' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                    )}>
                      {a.type === 'alert' ? <AlertTriangle size={16} /> : a.type === 'achievement' ? <TrendingUp size={16} /> : <Clock size={16} />}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-xs font-bold text-text-main">{a.title}</p>
                      <p className="text-[10px] font-semibold text-text-secondary mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
