import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronLeft, ChevronRight, CheckCircle2, Lock, Play,
  Clock, BarChart3, AlertTriangle, GraduationCap, Lightbulb,
  Award, Sparkles, ArrowRight, RotateCcw, School,
  ChevronDown, ChevronUp, Circle, CircleDot, Trophy
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const CourseDetail = () => {
  const { courseSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [moduleAssessments, setModuleAssessments] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [showAssessment, setShowAssessment] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [finalExamState, setFinalExamState] = useState(null);
  const [finalExamResult, setFinalExamResult] = useState(null);

  useEffect(() => {
    api.get(`/courses/${courseSlug}/tree`).then(r => {
      setData(r.data);
      setFinalExamState({ unlocked: r.data.finalExamUnlocked, exam: r.data.finalExam, statuses: r.data.moduleStatuses });
      // Auto-expand first module and load first lesson
      if (r.data?.modules?.[0]) {
        setExpandedModules({ [r.data.modules[0].id]: true });
        if (r.data.modules[0].lessons?.[0]) {
          loadLesson(r.data.modules[0].lessons[0].id);
        }
      }
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [courseSlug]);

  const loadLesson = async (lessonId) => {
    if (currentLesson === lessonId) return;
    setLessonLoading(true);
    setCurrentLesson(lessonId);
    setShowAssessment(null);
    setAssessmentResult(null);
    try {
      const r = await api.get(`/courses/lessons/${lessonId}`);
      setLessonContent(r.data);
      if (r.data?.lesson?.module_id && !moduleAssessments[r.data.lesson.module_id]) {
        const ass = await api.get(`/courses/modules/${r.data.lesson.module_id}/assessments`);
        setModuleAssessments(prev => ({ ...prev, [r.data.lesson.module_id]: ass.data || [] }));
      }
    } catch { }
    setLessonLoading(false);
  };

  const handleSubmitAnswer = async (assessmentId, questionId, selectedOptionId) => {
    try {
      const res = await api.post(`/assessments/${assessmentId}/submit`, {
        answers: [{ questionId, selectedOptionId }], timeSpentSeconds: 0,
      });
      setAssessmentResult(res.data);
    } catch (err) { alert(err.message); }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Find current lesson index for prev/next navigation
  const allLessons = data?.modules?.flatMap(m => m.lessons || []) || [];
  const currentIdx = allLessons.findIndex(l => l.id === currentLesson);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
  const moduleProgress = data?.modules?.length ? Math.round((data.modules.filter(m => m.lessons?.some(l => l.id === currentLesson)).length / data.modules.length) * 100) : 0;

  if (loading) return (
    <div className="flex h-[calc(100vh-100px)]">
      <div className="w-80 bg-surface-container-low border-r border-outline-variant/10 p-6 space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-surface-container-high rounded-xl animate-pulse" />)}
      </div>
      <div className="flex-grow p-12 space-y-6">
        <div className="w-1/2 h-8 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-64 bg-surface-container-lowest rounded-3xl animate-pulse border" />
      </div>
    </div>
  );

  if (error || !data?.course) return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <AlertTriangle size={48} className="text-gray-300 mx-auto mb-4" />
      <p className="text-lg font-bold text-text-secondary">{error || 'Curso no encontrado'}</p>
      <Link to="/modules" className="text-sm font-bold text-primary mt-4 inline-block">← Volver a módulos</Link>
    </div>
  );

  const { course, modules } = data;

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#f9f9fa]">
      {/* Course Index Sidebar */}
      <aside className="w-80 shrink-0 bg-surface-container-low border-r border-outline-variant/10 overflow-y-auto custom-scrollbar hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <School size={20} className="text-[#004b71]" />
            <h3 className="font-headline font-bold text-sm text-[#1a1c1d] uppercase tracking-tighter">Índice del Curso</h3>
          </div>
          <div className="space-y-4">
            {modules.map((mod, mi) => (
              <div key={mod.id}>
                <button onClick={() => toggleModule(mod.id)}
                  className="flex items-center justify-between w-full text-left font-headline font-bold text-[#004b71] group">
                  <span className="text-sm">{mi + 1}. {mod.title}</span>
                  {mod.lessons?.length > 0 && (
                    expandedModules[mod.id]
                      ? <ChevronUp size={16} className="text-gray-400" />
                      : <ChevronDown size={16} className="text-gray-400" />
                  )}
                </button>
                {expandedModules[mod.id] && mod.lessons?.length > 0 && (
                  <ul className="mt-2 ml-4 space-y-1 border-l-2 border-outline-variant/20">
                    {mod.lessons.map(lesson => {
                      const isActive = currentLesson === lesson.id;
                      return (
                        <li key={lesson.id}>
                          <button onClick={() => loadLesson(lesson.id)}
                            className={cn("block w-full text-left px-4 py-2 text-xs rounded-r-md transition-colors",
                              isActive ? 'text-[#004b71] font-bold bg-[#004b71]/5 border-l-2 border-[#004b71] -ml-[2px]' : 'text-[#40484f] hover:text-[#004b71]'
                            )}>
                            {lesson.title}
                          </button>
                        </li>
                      );
                    })}
                    {moduleAssessments[mod.id]?.length > 0 && (
                      <li>
                        <button onClick={() => { setShowAssessment(mod.id); setCurrentLesson(null); setLessonContent(null); }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-semibold text-[#007352] bg-[#86f8c8]/30 rounded-r-md mt-2">
                          <Award size={14} /> Práctica Calificada
                        </button>
                      </li>
                    )}
                  </ul>
                )}
                {expandedModules[mod.id] && !mod.lessons?.length && (
                  <p className="ml-6 mt-1 text-[10px] text-[#40484f]/60">Sin contenido</p>
                )}
              </div>
            ))}
          </div>

          {/* Final Exam */}
          <div className="mt-10">
            <button className={cn("w-full p-4 rounded-xl border-2 border-dashed transition-all group flex flex-col items-center text-center gap-2",
              finalExamState?.unlocked ? 'border-[#6c228c]/40 bg-[#6c228c]/5 hover:bg-[#6c228c]/10' : 'border-gray-300 bg-gray-50'
            )}>
              <Trophy size={28} className={finalExamState?.unlocked ? 'text-[#6c228c]' : 'text-gray-400'} />
              <span className="font-headline font-bold text-sm text-[#6c228c]">Examen Final del Curso</span>
              <p className="text-[10px] text-[#40484f]/60 leading-tight">
                {finalExamState?.unlocked ? '¡Disponible! Completa el curso' : 'Requiere completar todos los módulos'}
              </p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto px-8 lg:px-12 py-8 relative">
        {/* Floating background elements */}
        <div className="absolute top-10 right-10 w-64 h-64 border border-[#004b71]/20 rounded-full blur-3xl bg-[#004b71]/5 pointer-events-none" />
        <div className="absolute -bottom-20 left-20 w-96 h-96 border border-[#006c4d]/20 rounded-full blur-3xl bg-[#006c4d]/5 pointer-events-none" />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#40484f]/60 mb-6 font-medium">
          <span>Módulos</span>
          <ChevronRight size={12} />
          <span className="text-[#004b71] font-bold">{course.title}</span>
          {lessonContent?.lesson && (
            <>
              <ChevronRight size={12} />
              <span className="text-[#004b71] font-bold">{lessonContent.lesson.title}</span>
            </>
          )}
        </nav>

        {showAssessment ? (
          /* Assessment View */
          <AssessmentView
            assessment={moduleAssessments[showAssessment]?.[0]}
            onBack={() => setShowAssessment(null)}
            courseId={courseSlug}
          />
        ) : lessonLoading ? (
          <div className="space-y-6 max-w-5xl">
            <div className="w-1/2 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-96 bg-white rounded-3xl animate-pulse border" />
          </div>
        ) : lessonContent ? (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-headline font-extrabold text-[#1a1c1d] mb-4 tracking-tight">
                {lessonContent.lesson?.title}
              </h1>
              <p className="text-lg text-[#40484f] leading-relaxed max-w-3xl">
                {lessonContent.lesson?.description || 'Explora el contenido de esta lección para profundizar tus conocimientos.'}
              </p>
            </header>

            {/* Content Blocks - Bento Grid */}
            <article className="max-w-5xl space-y-12">
              <div className="grid grid-cols-12 gap-6">
                {lessonContent.lesson?.content_blocks?.map((block, bi) => (
                  <React.Fragment key={bi}>
                    {block.type === 'text' && (
                      <div className="col-span-12 md:col-span-7">
                        <div className="bg-[#f3f3f4] p-8 rounded-3xl border border-outline-variant/5">
                          <div className="text-[#40484f] leading-loose text-sm whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: block.data?.content }} />
                        </div>
                      </div>
                    )}
                    {block.type === 'highlight' && (
                      <div className={cn("col-span-12 md:col-span-5 p-6 rounded-2xl border-l-4 text-sm flex items-start gap-3",
                        block.data?.variant === 'warning' ? 'bg-[#ffdad6]/30 border-[#ba1a1a]' :
                        'bg-[#cbe6ff]/30 border-[#004b71]'
                      )}>
                        <Lightbulb size={20} className={block.data?.variant === 'warning' ? 'text-[#ba1a1a] shrink-0 mt-0.5' : 'text-[#004b71] shrink-0 mt-0.5'} />
                        <span className="font-medium text-[#40484f]">{block.data?.text}</span>
                      </div>
                    )}
                    {block.type === 'image' && (
                      <div className="col-span-12 md:col-span-5">
                        <div className="h-full bg-[#e8e8e9] rounded-3xl overflow-hidden relative">
                          <div className="absolute inset-0 flex items-center justify-center text-[#40484f]">
                            <BookOpen size={32} />
                          </div>
                          {block.data?.caption && (
                            <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                              <p className="text-[10px] font-bold text-[#004b71] text-center">{block.data.caption}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Page Indicator */}
              <div className="flex items-center justify-center gap-2">
                {allLessons.map((l, i) => (
                  <div key={l.id}
                    className={cn("h-1.5 rounded-full transition-all",
                      l.id === currentLesson ? 'w-8 bg-[#004b71]' : 'w-2 bg-[#004b71]/20'
                    )} />
                ))}
              </div>
            </article>

            {/* Navigation Footer */}
            <footer className="pt-10 border-t border-outline-variant/10 flex items-center justify-between">
              {prevLesson ? (
                <button onClick={() => loadLesson(prevLesson.id)}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#e8e8e9] text-[#40484f] hover:bg-[#e2e2e3] transition-all group">
                  <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Anterior</span>
                    <span className="font-bold text-sm">{prevLesson.title}</span>
                  </div>
                </button>
              ) : <div />}

              {nextLesson ? (
                <button onClick={() => loadLesson(nextLesson.id)}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#86f8c8] text-[#007352] hover:shadow-lg transition-all group">
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-[#007352]/60">Siguiente</span>
                    <span className="font-bold text-sm">{nextLesson.title}</span>
                  </div>
                  <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                </button>
              ) : <div />}
            </footer>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center py-20">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-black text-[#1a1c1d] mb-2">Selecciona una lección</h3>
            <p className="text-sm font-semibold text-[#40484f]">Elige una lección del índice del curso para comenzar</p>
          </div>
        )}
      </div>

      {/* Floating Progress Circle */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center relative group cursor-pointer border border-outline-variant/10">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="32" cy="32" fill="transparent" r="28" stroke="#e2e2e3" strokeWidth="4" />
            <circle cx="32" cy="32" fill="transparent" r="28" stroke="#004b71" strokeDasharray="176"
              strokeDashoffset={176 - (176 * (moduleProgress || 0)) / 100} strokeWidth="4" />
          </svg>
          <GraduationCap size={20} className="text-[#004b71] group-hover:scale-110 transition-transform" />
          <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-[#1a1c1d] text-white py-2 px-4 rounded-xl text-xs font-bold shadow-xl whitespace-nowrap">
              {moduleProgress}% del curso completado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Assessment View */
const AssessmentView = ({ assessment, onBack, courseId }) => {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!assessment || Object.keys(answers).length < (assessment.questions?.length || 0)) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/assessments/${assessment.id}/submit`, {
        answers: Object.entries(answers).map(([qId, optId]) => ({ questionId: qId, selectedOptionId: optId })),
        timeSpentSeconds: 0,
      });
      setResult(res.data);
    } catch (err) { alert(err.message); }
    setSubmitting(false);
  };

  if (!assessment) return (
    <div className="text-center py-12">
      <p className="text-sm font-bold text-[#40484f]">No hay práctica disponible para este módulo.</p>
      <button onClick={onBack} className="mt-4 text-sm font-bold text-[#004b71]">← Volver</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Questions */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-lg font-headline font-bold text-[#1a1c1d] mb-6 flex items-center gap-2">
                <GraduationCap size={20} className="text-[#004b71]" />
                {assessment.title}
              </h3>
              {assessment.questions?.map((q, qi) => (
                <div key={q.id} className="mb-8 last:mb-0 pb-8 last:pb-0 border-b last:border-b-0 border-outline-variant/20">
                  <p className="text-sm font-bold text-[#1a1c1d] mb-4">{qi + 1}. {q.text}</p>
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <button key={opt.id} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.id }))}
                        className={cn("w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium",
                          answers[q.id] === opt.id ? 'border-[#004b71] bg-[#004b71]/5 text-[#004b71]' : 'border-outline-variant/30 hover:border-[#004b71]/30 text-[#40484f]'
                        )}>
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <Button onClick={handleSubmit} isLoading={submitting}
                disabled={Object.keys(answers).length < (assessment.questions?.length || 0)}
                className="w-full h-12 bg-gradient-to-r from-[#004b71] to-[#006494] text-white rounded-2xl font-bold text-sm shadow-lg mt-6">
                Enviar respuestas
              </Button>
            </section>
          </div>

          {/* Right: Stats */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="backdrop-blur-md bg-white/70 rounded-3xl border border-white/50 p-8 shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#004b71]/10 rounded-full blur-2xl" />
              <h3 className="text-xl font-headline font-extrabold text-[#1a1c1d] mb-8">Detalles de Evaluación</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-[#f3f3f4] flex flex-col gap-2">
                  <GraduationCap size={20} className="text-[#004b71]" />
                  <span className="text-xs font-bold text-[#40484f] uppercase tracking-tighter">Preguntas</span>
                  <span className="text-2xl font-headline font-bold">{assessment.questions?.length || 0}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#f3f3f4] flex flex-col gap-2">
                  <Clock size={20} className="text-[#004b71]" />
                  <span className="text-xs font-bold text-[#40484f] uppercase tracking-tighter">Tiempo Límite</span>
                  <span className="text-2xl font-headline font-bold">{assessment.time_limit_minutes || '—'} Min</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#f3f3f4] flex flex-col gap-2">
                  <Award size={20} className="text-[#004b71]" />
                  <span className="text-xs font-bold text-[#40484f] uppercase tracking-tighter">Puntaje Mínimo</span>
                  <span className="text-2xl font-headline font-bold">{assessment.passing_score || 70}%</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#f3f3f4] flex flex-col gap-2">
                  <RotateCcw size={20} className="text-[#004b71]" />
                  <span className="text-xs font-bold text-[#40484f] uppercase tracking-tighter">Intentos</span>
                  <span className="text-2xl font-headline font-bold">{assessment.max_attempts || 1}</span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-[#40484f]">
                  <AlertTriangle size={16} className="text-[#ba1a1a]" />
                  <span>El intento no puede pausarse una vez iniciado.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results */
        <div className="max-w-3xl mx-auto space-y-6">
          <div className={cn("p-8 rounded-2xl text-center",
            result.passed ? 'bg-[#86f8c8]/20 border-2 border-[#86f8c8]' : 'bg-[#ffdad6]/30 border-2 border-[#ffdad6]'
          )}>
            <Trophy size={48} className={cn("mx-auto mb-4", result.passed ? 'text-[#006c4d]' : 'text-[#ba1a1a]')} />
            <h3 className="text-2xl font-headline font-bold mb-2">{result.passed ? '¡Práctica Aprobada!' : 'Sigue practicando'}</h3>
            <p className="text-lg font-bold">{result.correctCount}/{result.totalQuestions} correctas · {result.percentage}%</p>
          </div>
          {assessment.questions?.map((q, qi) => {
            const ga = result.gradedAnswers?.[qi];
            return (
              <div key={q.id} className={cn("p-6 rounded-2xl border-2", ga?.isCorrect ? 'border-[#86f8c8]/50 bg-[#86f8c8]/10' : 'border-[#ffdad6]/50 bg-[#ffdad6]/10')}>
                <div className="flex items-start gap-3">
                  {ga?.isCorrect ? <CheckCircle2 size={20} className="text-[#006c4d] shrink-0 mt-0.5" /> : <AlertTriangle size={20} className="text-[#ba1a1a] shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-sm font-bold text-[#1a1c1d] mb-2">{qi + 1}. {q.text}</p>
                    <p className="text-xs font-medium text-[#40484f]">{ga?.explanation || q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex gap-4 justify-center pt-4">
            {!result.passed && (
              <Button onClick={() => { setResult(null); setAnswers({}); }}
                className="px-8 py-3 bg-[#004b71] text-white rounded-2xl font-bold text-sm">
                Reintentar
              </Button>
            )}
            <Button onClick={onBack}
              className="px-8 py-3 bg-[#e8e8e9] text-[#40484f] rounded-2xl font-bold text-sm">
              Volver al curso
            </Button>
            {result.passed && (
              <Button onClick={async () => {
                try {
                  await api.post(`/certificates/courses/${courseId}/generate`);
                  alert('¡Certificado generado!');
                } catch { alert('Completa el examen final primero.'); }
              }} className="px-8 py-3 bg-gradient-to-r from-[#004b71] to-[#006494] text-white rounded-2xl font-bold text-sm">
                Generar Certificado
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
