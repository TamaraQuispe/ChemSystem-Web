import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, AlertTriangle, RefreshCw } from 'lucide-react';
import LESSONS from '../../data/lessons';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const LessonsPage = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = () => {
    setLoading(true);
    setError(null);
    api.get('/student/progress').then(r => {
      setProgress(r.data || []);
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProgress(); }, []);

  const categories = [...new Set(LESSONS.map(l => l.category))];
  const lessonProgress = (id) => progress.find(p => p.module_id === id || p.moduleId === id);
  const totalCompleted = progress.filter(p => p.status === 'completed' || p.progress >= 100).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Micro-lecciones</h1>
            <p className="text-text-secondary font-semibold mt-1">Completadas: {totalCompleted}/{LESSONS.length}</p>
          </div>
          <button onClick={fetchProgress} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3 text-xs font-black text-primary-dark">
            <span>Progreso General</span>
            <span>{Math.round((totalCompleted / LESSONS.length) * 100)}%</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(totalCompleted / LESSONS.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full" />
          </div>
        </Card>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-3 text-xs font-bold text-red-500 flex items-center gap-2">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {categories.map((cat) => (
        <motion.div key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-black text-primary-dark mb-4">{cat}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LESSONS.filter(l => l.category === cat).map((lesson) => {
              const prog = lessonProgress(lesson.id);
              const percentage = prog ? (typeof prog === 'object' ? (prog.progress || 0) : prog) : 0;
              const isCompleted = prog?.status === 'completed' || percentage >= 100;
              return (
                <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="block group">
                  <Card className={cn(
                    "p-5 border border-gray-100 hover:shadow-md transition-all group-hover:-translate-y-0.5",
                    isCompleted && 'border-emerald-200 bg-emerald-50/30'
                  )}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-black text-primary-dark group-hover:text-primary transition-colors">{lesson.title}</h3>
                      {isCompleted && <span className="text-[8px] font-bold text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-lg">✓ Hecho</span>}
                    </div>
                    <p className="text-[10px] font-semibold text-text-secondary leading-relaxed mb-3">{lesson.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[9px] font-bold text-text-secondary">
                        <Clock size={10} /> {lesson.steps?.length || 0} pasos
                      </span>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                    {percentage > 0 && percentage < 100 && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LessonsPage;
