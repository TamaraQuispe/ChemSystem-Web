import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, FlaskConical, Beaker, ChevronRight,
  Play, Award, AlertTriangle, RefreshCw, GraduationCap,
  Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const categoryMeta = {
  beginner: { label: 'BÁSICO', color: 'bg-emerald-50 text-emerald-500 border-emerald-200' },
  intermediate: { label: 'INTERMEDIO', color: 'bg-amber-50 text-amber-500 border-amber-200' },
  advanced: { label: 'AVANZADO', color: 'bg-red-50 text-red-500 border-red-200' },
};

const ModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, cRes, pRes] = await Promise.allSettled([
        api.get('/modules'),
        api.get('/courses'),
        api.get('/student/progress'),
      ]);
      if (mRes.status === 'fulfilled') setModules(mRes.value.data || []);
      if (cRes.status === 'fulfilled') setCourses(cRes.value.data || []);
      if (pRes.status === 'fulfilled') setProgress(pRes.value.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getModuleProgress = (moduleId) => {
    const p = progress.find(p => p.moduleId === moduleId || p.module_id === moduleId);
    return p ? p.progress || 0 : 0;
  };

  const getModuleStatus = (moduleId) => {
    const p = progress.find(p => p.moduleId === moduleId || p.module_id === moduleId);
    return p ? p.status : 'not_started';
  };

  const iconMap = [FlaskConical, Beaker, BookOpen, Award];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="w-64 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="w-1/3 h-3 bg-gray-200 rounded" />
                <div className="w-2/3 h-4 bg-gray-200 rounded" />
                <div className="w-full h-3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
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

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Módulos de Aprendizaje</h1>
            <p className="text-text-secondary font-semibold mt-1">Explora y aprende química con contenido estructurado</p>
          </div>
          <button onClick={fetchData} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
            <RefreshCw size={20} />
          </button>
        </div>
      </motion.div>

      {/* Courses Section */}
      {courses.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-primary-dark mb-4 flex items-center gap-2">
            <GraduationCap size={20} className="text-primary" /> Cursos Completos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {courses.map((course, idx) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Link to={`/modules/course/${course.slug}`} className="block group">
                  <Card className="p-5 border border-gray-100 hover:shadow-lg transition-all group-hover:-translate-y-1 bg-gradient-to-br from-primary/[0.02] to-transparent">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                        <GraduationCap size={24} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h3 className="text-sm font-black text-primary-dark group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="text-[10px] font-semibold text-text-secondary mt-1 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={cn("text-[8px] font-bold px-2 py-0.5 rounded-lg",
                            course.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-500' :
                            course.difficulty === 'intermediate' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                          )}>
                            {course.difficulty === 'beginner' ? 'Básico' : course.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                          </span>
                          <span className="flex items-center gap-1 text-[8px] font-bold text-text-secondary">
                            <Clock size={10} /> {course.duration_hours}h
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors shrink-0 mt-2" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Standalone Modules */}
      <h2 className="text-lg font-black text-primary-dark mb-4">Módulos Individuales</h2>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-black text-primary-dark mb-2">Sin módulos disponibles</h3>
              <p className="text-sm font-semibold text-text-secondary">Los módulos aparecerán aquí cuando estén publicados.</p>
            </Card>
          </div>
        ) : modules.map((mod, idx) => {
          const meta = categoryMeta[mod.difficulty] || categoryMeta.beginner;
          const Icon = iconMap[idx % iconMap.length];
          const prog = getModuleProgress(mod.id);
          const status = getModuleStatus(mod.id);
          const isLocked = status === 'not_started';
          return (
            <motion.div key={mod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}>
              <Link to={isLocked ? '#' : `/modules/${mod.id}`} className="block group">
                <div className={cn(
                  "bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1",
                  isLocked && 'opacity-60'
                )}>
                  <div className="h-36 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center relative">
                    <Icon size={48} className="text-primary/30" />
                    {isLocked && (
                      <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider">Bloqueado</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn("text-[8px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider", meta.color)}>
                        {meta.label}
                      </span>
                      <span className="text-[8px] font-bold text-text-secondary">{mod.duration_minutes} MIN</span>
                    </div>
                    <h3 className="text-base font-black text-primary-dark mb-1">{mod.title}</h3>
                    <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">{mod.description}</p>
                    {prog > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-bold text-text-secondary">Progreso</span>
                          <span className="text-[9px] font-black text-primary">{prog}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${prog}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                      {status === 'completed' ? (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500"><Award size={12} /> Completado</span>
                      ) : !isLocked ? (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-primary"><Play size={12} /> Continuar</span>
                      ) : null}
                      <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ModulesPage;
