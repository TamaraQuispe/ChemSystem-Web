import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, Bot } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const AITutor = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu tutor de química con IA. Pregúntame cualquier duda sobre tus cursos, laboratorios o ejercicios.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data?.reply || 'No pude procesar tu consulta.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión. Intenta de nuevo.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* FAB Button */}
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#004b71] to-[#006494] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40">
        <Bot size={28} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-[#004b71] to-[#006494] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot size={22} />
                  <div>
                    <p className="font-bold text-sm">Tutor IA de Química</p>
                    <p className="text-[10px] text-white/70">OpenRouter · GPT-4o Mini</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-all"><X size={18} /></button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn("max-w-[85%] rounded-2xl px-4 py-3",
                      msg.role === 'user' ? 'bg-[#004b71] text-white rounded-br-md' : 'bg-gray-50 text-[#1a1c1d] rounded-bl-md'
                    )}>
                      <p className="text-xs leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
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
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Pregunta sobre química..." value={input}
                    onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                    className="flex-1 h-10 px-4 bg-gray-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#004b71]/20 outline-none" />
                  <button onClick={handleSend} disabled={!input.trim() || loading}
                    className="p-2.5 bg-[#004b71] text-white rounded-xl disabled:opacity-50 transition-all">
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-[8px] text-gray-400 mt-2 text-center">Powered by OpenRouter · GPT-4o Mini</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AITutor;
