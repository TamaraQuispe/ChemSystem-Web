import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, GraduationCap, BookOpen, Layers, Sparkles, BarChart3, Dumbbell } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const INITIAL_MESSAGE = { role: 'assistant', content: '¡Hola! Soy el Dr. García, tu tutor de química. Estoy aquí para ayudarte a comprender los conceptos y resolver tus dudas.' };

const ContextCard = ({ context }) => {
  if (!context?.course) return null;

  const moduleInfo = context.module?.title || '—';
  const lessonInfo = context.lesson?.title || '—';

  return (
    <div className="mx-4 mt-3 mb-1 bg-gradient-to-r from-[#004b71]/5 to-[#006494]/5 rounded-2xl border border-[#004b71]/10 p-3">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap size={14} className="text-[#004b71]" />
        <span className="text-[10px] font-bold text-[#004b71] uppercase tracking-tighter truncate">
          {context.course.title}
        </span>
        <span className="ml-auto text-[9px] font-bold text-[#40484f]/60">
          {context.progress?.percent || 0}%
        </span>
      </div>

      {context.module && (
        <div className="flex items-center gap-2 mb-1">
          <Layers size={12} className="text-[#006494] shrink-0" />
          <span className="text-[10px] text-[#40484f] truncate">{moduleInfo}</span>
        </div>
      )}

      {context.lesson && (
        <div className="flex items-center gap-2">
          <BookOpen size={12} className="text-[#006c4d] shrink-0" />
          <span className="text-[10px] text-[#40484f] truncate">{lessonInfo}</span>
        </div>
      )}

      {context.lastAssessment && (
        <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-[#004b71]/10">
          <BarChart3 size={12} className={cn(context.lastAssessment.passed ? 'text-[#006c4d]' : 'text-[#ba1a1a]')} />
          <span className={cn('text-[9px] font-bold', context.lastAssessment.passed ? 'text-[#006c4d]' : 'text-[#ba1a1a]')}>
            Última práctica: {context.lastAssessment.score}% {context.lastAssessment.passed ? '✅' : '❌'}
          </span>
        </div>
      )}
    </div>
  );
};

const AITutor = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const endRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchContext = useCallback(async () => {
    if (hasFetched.current) return;
    setContextLoading(true);
    try {
      const res = await api.get('/ai/context');
      if (res?.data) {
        setContext(res.data);
        if (res.data.course && res.data.user?.name) {
          const name = res.data.user.name.split(' ')[0];
          const course = res.data.course.title;
          const moduleName = res.data.module?.title;
          const lastScore = res.data.lastAssessment;

          let greeting = `¡Hola ${name}! `;
          if (moduleName) {
            greeting += `Veo que estás estudiando **${moduleName}** dentro del curso ${course}.`;
          } else {
            greeting += `Veo que estás en el curso ${course}.`;
          }

          if (lastScore && !lastScore.passed) {
            greeting += ` En tu última práctica obtuviste ${lastScore.score}%. Vamos a repasar los conceptos que necesitas reforzar.`;
          } else if (lastScore && lastScore.passed) {
            greeting += ` En tu última práctica obtuviste ${lastScore.score}%. ¡Buen trabajo!`;
          } else {
            greeting += ' ¿En qué te gustaría que te ayude hoy?';
          }

          setMessages([{ role: 'assistant', content: greeting }]);
        }
      }
    } catch {
      // Fallback to default greeting
    } finally {
      setContextLoading(false);
      hasFetched.current = true;
    }
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
    hasFetched.current = false;
    fetchContext();
  }, [fetchContext]);

  const MAX_LENGTH = 2000;

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;
    if (input.length > MAX_LENGTH) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ El mensaje no puede exceder ${MAX_LENGTH} caracteres.` }]);
      return;
    }
    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    try {
      const history = updatedMessages.slice(-20).map(m => ({ role: m.role, content: m.content }));
      const res = await api.post('/ai/chat', { messages: history });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data?.reply || 'Error: respuesta vacía.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error: ' + (err.message || 'conexión') }]);
    }
    setLoading(false);
  }, [input, loading, messages]);

  const handleExercises = useCallback(async () => {
    if (exercisesLoading) return;
    setExercisesLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: '¿Puedes darme ejercicios para practicar?' }]);
    try {
      const res = await api.post('/ai/exercises', { count: 3 });
      const exercises = res.data;
      if (Array.isArray(exercises) && exercises.length > 0) {
        let content = 'Claro, aquí tienes 3 ejercicios para practicar:\n\n';
        exercises.forEach((ex, i) => {
          content += `**${i + 1}. ${ex.question}**\n\n`;
          if (ex.options) {
            Object.entries(ex.options).forEach(([key, val]) => {
              content += `${key}) ${val}\n`;
            });
          }
          content += `\n*Respuesta correcta: ${ex.correctAnswer}*\n`;
          if (ex.explanation) content += `Explicación: ${ex.explanation}\n`;
          content += '\n---\n\n';
        });
        content += '¿Quieres que resolvamos algún ejercicio paso a paso?';
        setMessages(prev => [...prev, { role: 'assistant', content }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, tuve un problema generando los ejercicios. ¿Puedes intentarlo de nuevo?' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error al generar los ejercicios. Intenta de nuevo más tarde.' }]);
    }
    setExercisesLoading(false);
  }, [exercisesLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      <button onClick={handleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#004b71] to-[#006494] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40">
        <GraduationCap size={28} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-24 right-6 w-[400px] h-[560px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden">

              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-[#004b71] to-[#006494] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <GraduationCap size={22} />
                  <div>
                    <p className="font-bold text-sm">Dr. García — Tutor</p>
                    <p className="text-[10px] text-white/70">Profesor de Química</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Context Card */}
              {context && <ContextCard context={context} />}

              {/* Quick Actions */}
              {context?.course && !loading && (
                <div className="flex gap-2 px-4 pt-3 pb-1">
                  <button onClick={handleExercises} disabled={exercisesLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f0f1] hover:bg-[#e8e8e9] rounded-xl text-[10px] font-bold text-[#004b71] transition-all">
                    <Dumbbell size={12} />
                    Ejercicios
                  </button>
                  <button
                    onClick={() => {
                      setMessages(prev => [...prev, { role: 'user', content: 'Explícame este tema como si fuera principiante.' }]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f0f1] hover:bg-[#e8e8e9] rounded-xl text-[10px] font-bold text-[#006c4d] transition-all">
                    <Sparkles size={12} />
                    Explicación fácil
                  </button>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {contextLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 rounded-bl-md">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-[#004b71] text-white rounded-br-md'
                        : 'bg-gray-50 text-[#1a1c1d] rounded-bl-md'
                    )}>
                      <p className="text-xs whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && !exercisesLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 rounded-bl-md">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <input type="text"
                    placeholder="Escribe tu consulta al Dr. García..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 h-10 px-4 bg-gray-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#004b71]/20 outline-none placeholder:text-gray-400" />
                  <button onClick={handleSend} disabled={!input.trim() || loading}
                    className="p-2.5 bg-[#004b71] text-white rounded-xl disabled:opacity-50 transition-all">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AITutor;
