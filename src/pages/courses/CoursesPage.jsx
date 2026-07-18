import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, BarChart3, ChevronRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = () => {
    setLoading(true);
    setError(null);
    api.get('/courses').then(r => {
      setCourses(r.data || []);
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-primary-dark tracking-tight">Cursos Disponibles</h1>
        <p className="text-text-secondary font-semibold mt-1">Selecciona un curso para comenzar tu aprendizaje</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
        </div>
      ) : error ? (
        <Card className="p-12 text-center">
          <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
          <button onClick={fetchCourses} className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
        </Card>
      ) : courses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-black text-primary-dark mb-2">Sin cursos disponibles</h3>
          <p className="text-sm font-semibold text-text-secondary">Pronto agregaremos nuevos cursos.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link to={`/courses/${course.id}`} className="block group">
                <Card className="p-6 border border-gray-100 hover:shadow-lg transition-all group-hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                      <BookOpen size={28} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h2 className="text-lg font-black text-primary-dark group-hover:text-primary transition-colors">{course.title}</h2>
                      <p className="text-xs font-semibold text-text-secondary mt-1 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-lg",
                          course.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-500' :
                          course.difficulty === 'intermediate' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                        )}>
                          {course.difficulty === 'beginner' ? 'Básico' : course.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-text-secondary">
                          <Clock size={12} /> {course.duration_hours}h
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors shrink-0 mt-3" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
