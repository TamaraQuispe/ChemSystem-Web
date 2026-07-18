import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Clock, BarChart3, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Trophy, Sparkles, Lightbulb, AlertTriangle, Award, RotateCcw, FlaskConical, ArrowRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import QuestionValidator from '../../components/modules/QuestionValidator';
import api from '../../services/api';

const PHASES = {
  INTRO: 'intro',
  LEARNING: 'learning',
  FINAL_EXAM: 'final-exam',
  SUMMARY: 'summary',
  CURIOSITIES: 'curiosities',
  COMPLETE: 'complete',
};

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionResults, setSectionResults] = useState([]);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/modules/${id}/content`).then(r => {
      setModule(r.data);
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const sections = module?.sections || [];
  const totalSections = sections.length;
  const completedSections = sectionResults.filter(r => r !== undefined).length;

  const handleSectionQuestion = (isCorrect, isNext) => {
    const newResults = [...sectionResults];
    newResults[currentSection] = isCorrect;
    setSectionResults(newResults);
    if (isNext) {
      if (currentSection < totalSections - 1) {
        setCurrentSection(s => s + 1);
      } else {
        setPhase(PHASES.FINAL_EXAM);
      }
    }
  };

  const handleExamSubmit = () => {
    setExamSubmitted(true);
    const exam = module?.finalExam || [];
    const correct = exam.filter((q, i) => {
      const userAnswer = examAnswers[i];
      return userAnswer === q.options[q.correctIndex];
    }).length;
    setSaving(true);
    api.post('/student/quiz/complete', {
      module_id: id,
      score: Math.round((correct / exam.length) * 100),
      max_score: 100,
      xp_earned: correct * 10,
      time_spent_seconds: 0,
    }).catch(() => {}).finally(() => setSaving(false));
  };

  const sectionScore = sectionResults.filter(r => r === true).length;
  const examScore = module?.finalExam?.length
    ? Math.round((Object.entries(examAnswers).filter(([i, ans]) => ans === module.finalExam[i]?.options[module.finalExam[i]?.correctIndex]).length / module.finalExam.length) * 100)
    : 0;

  if (loading) return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
      <div className="w-64 h-8 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-48 bg-white rounded-3xl animate-pulse border border-gray-100" />
      <div className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100" />
    </div>
  );

  if (error || !module) return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <AlertTriangle size={48} className="text-gray-300 mx-auto mb-4" />
      <p className="text-lg font-bold text-text-secondary">{error || 'Módulo no encontrado'}</p>
      <Link to="/modules" className="text-sm font-bold text-primary mt-4 inline-block">← Volver a módulos</Link>
    </div>
  );

  const progressPct = phase === PHASES.INTRO ? 0
    : phase === PHASES.LEARNING ? Math.round((completedSections / totalSections) * 50)
    : phase === PHASES.FINAL_EXAM ? 60
    : phase === PHASES.SUMMARY ? 80
    : phase === PHASES.CURIOSITIES ? 90
    : 100;

  return (
    <div className="max-w-4xl mx-auto pb-16 px-4">
      {/* Progress bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md pb-3 pt-3 mb-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate('/modules')} className="text-[10px] font-bold text-gray-400 hover:text-primary flex items-center gap-1">
            <ChevronLeft size={14} /> Módulos
          </button>
          <div className="flex items-center gap-3 text-[9px] font-bold text-text-secondary">
            <span className={cn(phase === PHASES.LEARNING && 'text-primary')}>Contenido</span>
            <span className="text-gray-300">·</span>
            <span className={cn(phase === PHASES.FINAL_EXAM && 'text-primary')}>Evaluación</span>
            <span className="text-gray-300">·</span>
            <span className={cn(phase === PHASES.SUMMARY && 'text-primary')}>Resumen</span>
          </div>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {phase === PHASES.INTRO && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                  <BookOpen size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-primary-dark">{module.title}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-lg",
                      module.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-500' :
                      module.difficulty === 'intermediate' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                    )}>
                      {module.difficulty === 'beginner' ? 'Básico' : module.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-text-secondary">
                      <Clock size={12} /> {module.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500">
                      <Award size={12} /> +{module.xp_reward} XP
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm font-semibold text-text-secondary mb-6">{module.description}</p>

              {module.objectives?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-black text-primary-dark mb-3">🎯 Objetivos de aprendizaje</h3>
                  <ul className="space-y-2">
                    {module.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-semibold text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {module.prerequisites?.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-[10px] font-bold text-amber-600 mb-1">📋 Requisitos previos</p>
                  <ul className="space-y-1">
                    {module.prerequisites.map((pr, i) => (
                      <li key={i} className="text-[10px] font-semibold text-amber-500">• {pr}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                  <p className="text-lg font-black text-primary-dark">{totalSections}</p>
                  <p className="text-[9px] font-bold text-text-secondary">Secciones</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                  <p className="text-lg font-black text-primary-dark">{module.finalExam?.length || 0}</p>
                  <p className="text-[9px] font-bold text-text-secondary">Preguntas finales</p>
                </div>
              </div>

              <Button onClick={() => setPhase(PHASES.LEARNING)} className="w-full h-14 bg-primary-dark text-white rounded-2xl font-bold text-base gap-2">
                Comenzar aprendizaje <ArrowRight size={18} />
              </Button>
            </Card>
          </motion.div>
        )}

        {/* LEARNING */}
        {phase === PHASES.LEARNING && sections.length > 0 && (
          <motion.div key="learning" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-text-secondary">Sección {currentSection + 1} de {totalSections}</span>
              <span className="text-[9px] font-bold text-primary">{Math.round(((currentSection) / totalSections) * 100)}% completado</span>
            </div>

            <Card className="p-8">
              <h2 className="text-xl font-black text-primary-dark mb-4">{sections[currentSection]?.title}</h2>

              <div className="text-sm font-semibold text-text-secondary leading-relaxed space-y-3 whitespace-pre-line mb-4">
                {sections[currentSection]?.content?.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-black text-primary-dark text-base">{line.replace(/\*\*/g, '')}</p>;
                  }
                  if (line.startsWith('•')) {
                    return <li key={i} className="ml-4 text-xs">{line.replace('• ', '')}</li>;
                  }
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="text-sm">{line}</p>;
                })}
              </div>

              {sections[currentSection]?.highlight && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-amber-700">{sections[currentSection].highlight}</p>
                  </div>
                </div>
              )}

              {sections[currentSection]?.question && (
                <QuestionValidator
                  question={sections[currentSection].question}
                  onComplete={handleSectionQuestion}
                />
              )}

              {!sections[currentSection]?.question && (
                <button onClick={() => {
                  const newResults = [...sectionResults];
                  newResults[currentSection] = null; // mark as viewed
                  setSectionResults(newResults);
                  if (currentSection < totalSections - 1) {
                    setCurrentSection(s => s + 1);
                  } else {
                    setPhase(PHASES.FINAL_EXAM);
                  }
                }}
                  className="mt-6 px-6 py-3 bg-primary-dark text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all">
                  Continuar <ChevronRight size={16} className="inline" />
                </button>
              )}
            </Card>
          </motion.div>
        )}

        {/* FINAL EXAM */}
        {phase === PHASES.FINAL_EXAM && (
          <motion.div key="exam" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-primary-dark">Evaluación Final</h2>
              <span className="text-[9px] font-bold text-text-secondary">{module.finalExam?.length || 0} preguntas</span>
            </div>

            {module.finalExam?.map((q, qi) => (
              <Card key={qi} className={cn("p-6", examSubmitted && examAnswers[qi] === q.options[q.correctIndex] ? 'border-emerald-200' : examSubmitted ? 'border-red-200' : '')}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">{qi + 1}</span>
                  <span className="text-xs font-bold text-text-secondary">Pregunta {qi + 1}</span>
                  {examSubmitted && (
                    <span className={cn("ml-auto text-[9px] font-bold px-2 py-0.5 rounded-lg",
                      examAnswers[qi] === q.options[q.correctIndex] ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                    )}>
                      {examAnswers[qi] === q.options[q.correctIndex] ? 'Correcta' : 'Incorrecta'}
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-primary-dark mb-4">{q.text}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = examAnswers[qi] === opt;
                    const isCorrect = opt === q.options[q.correctIndex];
                    const showResult = examSubmitted;
                    return (
                      <button key={oi} onClick={() => !examSubmitted && setExamAnswers(a => ({ ...a, [qi]: opt }))}
                        disabled={examSubmitted}
                        className={cn("w-full text-left p-4 rounded-2xl border-2 transition-all text-xs font-semibold",
                          showResult && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-700",
                          showResult && isSelected && !isCorrect && "border-red-400 bg-red-50 text-red-700",
                          !showResult && isSelected && "border-primary bg-primary/5 text-primary-dark",
                          !showResult && !isSelected && "border-gray-100 hover:border-gray-200 text-text-main",
                          showResult && !isCorrect && !isSelected && "border-gray-100 opacity-60"
                        )}>
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[9px] font-black shrink-0">{String.fromCharCode(65 + oi)}</span>
                          {opt}
                          {showResult && isCorrect && <CheckCircle2 size={18} className="text-emerald-500 ml-auto shrink-0" />}
                          {showResult && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 ml-auto shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {examSubmitted && q.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-2xl text-xs font-semibold text-blue-600">
                    {q.explanation}
                  </div>
                )}
              </Card>
            ))}

            {!examSubmitted ? (
              <Button onClick={handleExamSubmit} disabled={Object.keys(examAnswers).length < (module.finalExam?.length || 0)}
                className="w-full h-12 bg-primary-dark text-white rounded-2xl font-bold text-sm" isLoading={saving}>
                Enviar respuestas
              </Button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <Card className={cn("p-6 text-center", examScore >= 70 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200')}>
                  <p className="text-3xl font-black">{examScore}%</p>
                  <p className="text-xs font-bold mt-2">{examScore >= 70 ? '¡Aprobado!' : 'Sigue practicando'}</p>
                  <p className="text-[9px] font-semibold text-text-secondary mt-1">
                    {Object.entries(examAnswers).filter(([i, ans]) => ans === module.finalExam[i]?.options[module.finalExam[i]?.correctIndex]).length} de {module.finalExam?.length || 0} correctas
                  </p>
                </Card>
                <Button onClick={() => setPhase(PHASES.SUMMARY)} className="w-full h-12 bg-primary-dark text-white rounded-2xl font-bold text-sm">
                  Ver resumen <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* SUMMARY */}
        {phase === PHASES.SUMMARY && module.summary && (
          <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <h2 className="text-lg font-black text-primary-dark">Resumen del Módulo</h2>

            {module.summary.concepts?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-sm font-black text-primary-dark mb-4">📚 Conceptos principales</h3>
                <ul className="space-y-2">
                  {module.summary.concepts.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-semibold text-text-secondary">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {module.summary.formulas?.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-sm font-black text-primary-dark mb-4">📐 Fórmulas importantes</h3>
                  <ul className="space-y-2">
                    {module.summary.formulas.map((f, i) => (
                      <li key={i} className="px-3 py-2 bg-blue-50 rounded-xl text-xs font-bold text-blue-600 font-mono">{f}</li>
                    ))}
                  </ul>
                </Card>
              )}

              {module.summary.commonMistakes?.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-sm font-black text-primary-dark mb-4">⚠️ Errores frecuentes</h3>
                  <ul className="space-y-2">
                    {module.summary.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-semibold text-text-secondary">
                        <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {module.summary.applications?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-sm font-black text-primary-dark mb-4">🔬 Aplicaciones prácticas</h3>
                <ul className="space-y-2">
                  {module.summary.applications.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-semibold text-text-secondary">
                      <FlaskConical size={14} className="text-primary shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <Button onClick={() => setPhase(PHASES.CURIOSITIES)} className="w-full h-12 bg-primary-dark text-white rounded-2xl font-bold text-sm">
              Ver curiosidades <Sparkles size={16} />
            </Button>
          </motion.div>
        )}

        {/* CURIOSITIES */}
        {phase === PHASES.CURIOSITIES && (
          <motion.div key="curiosities" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <h2 className="text-lg font-black text-primary-dark">Curiosidades sobre {module.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {module.curiosities?.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className={cn("p-6 border-l-4 h-full",
                    c.type === 'history' ? 'border-l-amber-400' :
                    c.type === 'industry' ? 'border-l-blue-400' :
                    c.type === 'research' ? 'border-l-violet-400' :
                    c.type === 'analogy' ? 'border-l-emerald-400' : 'border-l-primary'
                  )}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-lg",
                        c.type === 'history' ? 'bg-amber-50 text-amber-500' :
                        c.type === 'industry' ? 'bg-blue-50 text-blue-500' :
                        c.type === 'research' ? 'bg-violet-50 text-violet-500' :
                        c.type === 'analogy' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-500'
                      )}>
                        {c.type === 'history' ? 'Historia' : c.type === 'industry' ? 'Industria' : c.type === 'research' ? 'Investigación' : c.type === 'analogy' ? 'Analogía' : 'Dato'}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-primary-dark mb-2">{c.title}</h4>
                    <p className="text-[11px] font-semibold text-text-secondary leading-relaxed">{c.content}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Button onClick={() => setPhase(PHASES.COMPLETE)} className="w-full h-12 bg-primary-dark text-white rounded-2xl font-bold text-sm">
              Finalizar módulo <Trophy size={16} />
            </Button>
          </motion.div>
        )}

        {/* COMPLETE */}
        {phase === PHASES.COMPLETE && (
          <motion.div key="complete" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12 space-y-6">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <Trophy size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-primary-dark">¡Módulo completado!</h2>
            <p className="text-text-secondary font-semibold">{module.title}</p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <p className="text-2xl font-black text-emerald-500">{sectionScore}/{totalSections}</p>
                <p className="text-[9px] font-bold text-text-secondary">Secciones</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl">
                <p className="text-2xl font-black text-amber-500">+{module.xp_reward}</p>
                <p className="text-[9px] font-bold text-text-secondary">XP ganados</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={() => navigate('/modules')} className="px-8 py-3 bg-primary-dark text-white rounded-2xl font-bold text-sm">
                Siguiente módulo <ArrowRight size={16} />
              </Button>
              <Button onClick={() => { setPhase(PHASES.INTRO); setCurrentSection(0); setSectionResults([]); setExamAnswers({}); setExamSubmitted(false); }}
                variant="outline" className="px-8 py-3 rounded-2xl font-bold text-sm">
                <RotateCcw size={16} /> Repetir
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleDetail;
