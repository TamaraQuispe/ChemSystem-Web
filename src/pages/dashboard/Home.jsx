import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, FlaskConical, Beaker, Atom, ChevronRight,
  Award, Flame, FileText, CalendarDays, Target, Zap,
  Clock, TrendingUp, AlertTriangle, GraduationCap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { studentService } from '../../services/studentService';

const quickAccess = [
  { icon: GraduationCap, label: 'Cursos', path: '/modules', color: 'bg-primary/10 text-primary' },
  { icon: FlaskConical, label: 'Simuladores', path: '/simulators', color: 'bg-blue-50 text-blue-500' },
  { icon: Beaker, label: 'Laboratorio', path: '/modules', color: 'bg-emerald-50 text-emerald-500' },
  { icon: BookOpen, label: 'Lecciones', path: '/lessons', color: 'bg-amber-50 text-amber-500' },
];

const Home = () => {
  const { user } = useAuthStore();
  const { dashboardData, loading, fetchDashboard } = useStudentStore();
  const [assignments, setAssignments] = React.useState([]);
  const [selectedAssignment, setSelectedAssignment] = React.useState(null);

  useEffect(() => { fetchDashboard(); }, []);

  useEffect(() => {
    studentService.getAssignments().then(setAssignments).catch(() => {});
  }, []);

  const defaultXp = [
    { day: 'L', xp: 55 }, { day: 'M', xp: 85 }, { day: 'X', xp: 35 },
    { day: 'J', xp: 75 }, { day: 'V', xp: 90 }, { day: 'S', xp: 45 }, { day: 'D', xp: 65 },
  ];

  const data = dashboardData;
  const weeklyXp = data?.weeklyXp || defaultXp;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-primary-dark tracking-tight">
          Bienvenido, {user?.name || 'Estudiante'}
        </h1>
        <p className="text-text-secondary font-semibold mt-1">Continúa tu viaje en la química</p>
      </motion.div>

      {/* KPI Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Promedio', value: data?.kpis?.avgScore || '—', color: 'bg-blue-50', iconColor: 'text-blue-500' },
          { icon: Flame, label: 'Racha', value: `${data?.kpis?.streak || 0} días`, color: 'bg-orange-50', iconColor: 'text-orange-500' },
          { icon: FlaskConical, label: 'Experimentos', value: data?.kpis?.experimentsCount || 0, color: 'bg-emerald-50', iconColor: 'text-emerald-500' },
          { icon: Award, label: 'Módulos', value: data?.kpis?.modulesCompleted || 0, color: 'bg-violet-50', iconColor: 'text-violet-500' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-premium">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", kpi.color)}>
                <kpi.icon size={20} className={kpi.iconColor} />
              </div>
              <div>
                <p className="text-xl font-black text-primary-dark">{kpi.value}</p>
                <p className="text-[10px] font-bold text-text-secondary">{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* XP Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-primary-dark">XP Esta Semana</h2>
                <div className="flex items-center gap-1 text-xs font-bold text-text-secondary">
                  <Zap size={14} className="text-amber-500" />
                  {weeklyXp.reduce((s, d) => s + d.xp, 0)} XP
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyXp} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#005B8F" />
                        <stop offset="100%" stopColor="#005B8F" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }} />
                    <YAxis hide={true} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="xp" fill="url(#xpGrad)" radius={[10, 10, 10, 10]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Current Module */}
          {data?.currentModule && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Link to="/modules" className="block">
                <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark text-white hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Módulo Actual</p>
                      <h3 className="text-xl font-black text-white mt-1">{data.currentModule.title}</h3>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: `${data.currentModule.progress}%` }} />
                        </div>
                        <span className="text-xs font-bold text-secondary">{data.currentModule.progress}%</span>
                      </div>
                    </div>
                    <ChevronRight size={24} className="text-white/50" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          )}

          {/* Pending Practices */}
          {assignments.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
              <Card className="p-6 border-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-primary-dark">Prácticas Pendientes</h2>
                  <span className="text-[10px] font-bold text-primary">{assignments.length} prácticas</span>
                </div>
                <div className="space-y-3">
                  {assignments.slice(0, 5).map(a => (
                    <div key={a.id} className="flex items-start gap-3 p-3 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-all">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary-dark truncate">{a.title}</p>
                        <p className="text-[10px] font-semibold text-text-secondary line-clamp-2">{a.description}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          {a.due_date && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-text-secondary">
                              <CalendarDays size={10} /> Ven: {new Date(a.due_date).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                            </span>
                          )}
                          {a.file_name && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-text-secondary">
                              <FileText size={10} /> {a.file_name}
                            </span>
                          )}
                        </div>
                        <button onClick={() => setSelectedAssignment(a)}
                          className="mt-2 text-[9px] font-bold text-primary hover:text-primary-dark transition-colors">
                          Ver detalle →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <h2 className="text-lg font-black text-primary-dark mb-4">Actividad Reciente</h2>
              {data?.recentActivity?.length > 0 ? (
                <div className="space-y-1">
                  {data.recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                        a.type === 'alert' ? 'bg-red-50 text-red-500' : a.type === 'achievement' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                      )}>
                        {a.type === 'alert' ? <AlertTriangle size={14} /> : a.type === 'achievement' ? <Award size={14} /> : <Clock size={14} />}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="text-xs font-bold text-text-main">{a.title}</p>
                        <p className="text-[9px] font-semibold text-text-secondary mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-semibold text-text-secondary text-center py-6">Sin actividad reciente</p>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Access */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-2 gap-4">
            {quickAccess.map((item) => (
              <Link key={item.path} to={item.path}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-premium hover:shadow-lg transition-all text-center group">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3", item.color)}>
                  <item.icon size={24} />
                </div>
                <p className="text-xs font-black text-text-main group-hover:text-primary transition-colors">{item.label}</p>
              </Link>
            ))}
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-primary-dark">Logros</h2>
                <Link to="/achievements" className="text-[10px] font-bold text-primary hover:text-primary-dark transition-colors">Ver todos</Link>
              </div>
              {data?.achievements?.length > 0 ? (
                <div className="space-y-3">
                  {data.achievements.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-2xl">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                        a.rarity === 'legendary' ? 'bg-amber-100 text-amber-500' :
                        a.rarity === 'epic' ? 'bg-violet-100 text-violet-500' :
                        a.rarity === 'rare' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'
                      )}>
                        <Award size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-text-main">{a.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award size={32} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-text-secondary">Completa actividades para ganar logros</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Level & XP */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-transparent border-secondary/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                  <Flame size={28} className="text-secondary" fill="#78F0C4" />
                </div>
                <div>
                  <p className="text-2xl font-black text-primary-dark">Nivel {data?.user?.level || user?.level || 1}</p>
                  <p className="text-xs font-bold text-text-secondary">{data?.user?.xp || user?.xp || 0} XP totales</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Practice Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAssignment(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="relative bg-white rounded-3xl shadow-2xl border border-outline-variant/10 max-w-lg w-full max-h-[80vh] overflow-y-auto p-8">
            <button onClick={() => setSelectedAssignment(null)}
              className="absolute top-4 right-4 p-2 hover:bg-surface-container rounded-xl transition-colors">
              <span className="text-lg">✕</span>
            </button>

            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <FileText size={32} className="text-primary" />
            </div>

            <h3 className="text-2xl font-headline font-extrabold text-on-surface mb-2">{selectedAssignment.title}</h3>

            {selectedAssignment.type && (
              <span className="inline-block text-[9px] px-2 py-1 bg-secondary-container/40 text-on-secondary-container rounded-full font-bold uppercase tracking-wider mb-4">
                {selectedAssignment.type === 'task' ? 'Tarea' : selectedAssignment.type === 'lab' ? 'Laboratorio' : selectedAssignment.type === 'exam' ? 'Examen' : selectedAssignment.type}
              </span>
            )}

            <div className="space-y-4 mt-4">
              <div>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider mb-1">Descripción</p>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{selectedAssignment.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedAssignment.due_date && (
                  <div className="bg-surface-container-low rounded-xl p-4">
                    <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider mb-1">Fecha Límite</p>
                    <p className="text-sm font-bold text-on-surface">
                      {new Date(selectedAssignment.due_date).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
                {selectedAssignment.max_score && (
                  <div className="bg-surface-container-low rounded-xl p-4">
                    <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider mb-1">Puntaje Máximo</p>
                    <p className="text-sm font-bold text-on-surface">{selectedAssignment.max_score}</p>
                  </div>
                )}
                {selectedAssignment.file_url && (
                  <div className="bg-surface-container-low rounded-xl p-4 col-span-2">
                    <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider mb-1">Archivo Adjunto</p>
                    <a href={selectedAssignment.file_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                      <FileText size={16} />
                      {selectedAssignment.file_name || 'Descargar archivo'}
                      <span className="text-[10px] text-on-surface-variant font-medium ml-auto">
                        {selectedAssignment.file_size ? `${(selectedAssignment.file_size / 1024 / 1024).toFixed(1)} MB` : ''}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-outline-variant/10 flex gap-3">
              {selectedAssignment.file_url && (
                <a href={selectedAssignment.file_url} target="_blank" rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm text-center hover:opacity-90 transition-all">
                  Descargar Archivo
                </a>
              )}
              <button onClick={() => setSelectedAssignment(null)}
                className="flex-1 px-6 py-3 bg-surface-container-high text-on-surface rounded-2xl font-bold text-sm hover:bg-surface-variant transition-all">
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
