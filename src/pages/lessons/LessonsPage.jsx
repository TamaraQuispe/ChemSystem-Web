import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, RotateCcw } from 'lucide-react';
import LESSONS from '../../data/lessons';
import { useLessonStore } from '../../store/lessonStore';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

const LessonsPage = () => {
  const progress = useLessonStore((s) => s.progress);
  const totalCompleted = Object.values(progress).filter((p) => p.percentage >= 100).length;

  const categories = [...new Set(LESSONS.map((l) => l.category))];

  return (
    <div className="space-y-10 pb-16">
      
      <div className="space-y-1.5">
        <h1 className="text-4xl font-extrabold text-[#0D2140] tracking-tight">
          Micro-lecciones
        </h1>
        <p className="text-base text-gray-500 font-medium">
          Aprende química a tu propio ritmo con lecciones interactivas. Completadas: {totalCompleted}/{LESSONS.length}
        </p>
      </div>

      {/* Header progress bar */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-3 text-xs font-black text-[#0D2140]">
          <span>Progreso General</span>
          <span>{Math.round((totalCompleted / LESSONS.length) * 100)}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalCompleted / LESSONS.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
          />
        </div>
      </div>

      {categories.map((cat) => (
        <section key={cat}>
          <h2 className="text-2xl font-extrabold text-[#0D2140] tracking-tight mb-6">{cat}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LESSONS.filter((l) => l.category === cat).map((lesson, idx) => {
              const prog = progress[lesson.id];
              const pct = prog?.percentage || 0;
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link to={`/lessons/${lesson.id}`} className="block h-full">
                    <Card className="h-full flex flex-col p-0 overflow-hidden group border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem]">
                      <div className="h-36 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                        {lesson.icon}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase">
                            {lesson.category}
                          </span>
                          <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                            <Clock size={11} /> {lesson.duration}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-[#0D2140] tracking-tight mb-2 group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-400 text-xs font-semibold leading-relaxed mb-4 flex-grow">
                          {lesson.description}
                        </p>
                        {pct > 0 ? (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-bold text-gray-400">
                              <span>{pct}% completado</span>
                              {pct >= 100 ? <span className="text-emerald-600">✔ Completado</span> : <span>Continuar</span>}
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                            <span>Comenzar lección</span>
                            <ChevronRight size={14} />
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default LessonsPage;
