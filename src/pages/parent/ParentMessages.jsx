import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Send, CheckCheck, RefreshCw, AlertTriangle,
  User, School
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { parentService } from '../../services/parentService';

const ParentMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchConversations = () => {
    setLoading(true);
    setError(null);
    parentService.getConversations()
      .then((data) => {
        setConversations(data);
        if (data.length > 0 && !selectedConv) {
          setSelectedConv(data[0]);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConv) return;
    setMessagesLoading(true);
    parentService.getConversationMessages(selectedConv.id)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setMessagesLoading(false));
  }, [selectedConv?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    const content = newMessage.trim();
    setNewMessage('');
    setMessages(prev => [...prev, { id: Date.now(), from: 'parent', text: content, time: 'Ahora', pending: true }]);
    try {
      const msg = await parentService.sendMessage(selectedConv.id, content);
      setMessages(prev => prev.map(m => m.pending ? { ...msg, pending: false } : m));
      fetchConversations();
    } catch {
      setMessages(prev => prev.map(m => m.pending ? { ...m, text: m.text + ' ❌', pending: false } : m));
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Mensajería con Docentes</h1>
            <p className="text-text-secondary font-semibold mt-1">Comunícate directamente con los profesores</p>
          </div>
          <button onClick={fetchConversations} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden h-[600px] animate-pulse">
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                <div className="flex-grow space-y-2">
                  <div className="w-1/3 h-3 bg-gray-200 rounded" />
                  <div className="w-2/3 h-2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <Card className="p-12 text-center">
          <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
          <button onClick={fetchConversations} className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
        </Card>
      ) : conversations.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-black text-primary-dark mb-2">Sin conversaciones</h3>
          <p className="text-sm font-semibold text-text-secondary">Aún no tienes mensajes con docentes. Cuando un profesor te contacte, aparecerá aquí.</p>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row h-[600px]">
            {/* Conversation List */}
            <div className="w-full lg:w-[340px] border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col shrink-0">
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-black text-primary-dark">Conversaciones</p>
                <p className="text-[10px] font-bold text-text-secondary mt-0.5">{conversations.length} activas</p>
              </div>
              <div className="flex-grow overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={cn(
                      "w-full p-4 flex items-start gap-3 border-b border-gray-50 transition-all text-left",
                      selectedConv?.id === conv.id ? "bg-secondary/10" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      <img src={conv.teacher.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.teacher.name}`} alt={conv.teacher.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-primary-dark truncate">{conv.teacher.name}</span>
                        <span className="text-[9px] font-semibold text-text-secondary shrink-0">{conv.lastMessage?.time || ''}</span>
                      </div>
                      <p className="text-[10px] font-bold text-text-secondary mt-0.5">{conv.subject}</p>
                      {conv.student && (
                        <p className="text-[9px] font-semibold text-primary mt-0.5">Sobre: {conv.student.name}</p>
                      )}
                      {conv.lastMessage && (
                        <p className="text-[10px] font-semibold text-gray-400 mt-1 truncate">{conv.lastMessage.content}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow flex flex-col min-w-0">
              {selectedConv ? (
                <>
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        <img src={selectedConv.teacher.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConv.teacher.name}`} alt={selectedConv.teacher.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-primary-dark truncate">{selectedConv.teacher.name}</h3>
                        <p className="text-[10px] font-bold text-text-secondary truncate">{selectedConv.subject}</p>
                      </div>
                    </div>
                    {selectedConv.student && (
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-xl text-[10px] font-bold text-primary">
                        <School size={12} />
                        {selectedConv.student.name}
                      </div>
                    )}
                  </div>

                  <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {messagesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
                            <div className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-3 animate-pulse",
                              i % 2 === 0 ? "bg-primary/20" : "bg-gray-100"
                            )}>
                              <div className="w-32 h-3 bg-white/30 rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-xs font-semibold text-text-secondary">No hay mensajes aún. Escribe algo para iniciar la conversación.</p>
                      </div>
                    ) : (
                      <>
                        {/* System notification */}
                        <div className="flex justify-center">
                          <div className="bg-[#cbe6ff]/20 px-4 py-2 rounded-full flex items-center gap-2 border border-[#cbe6ff]/10">
                            <span className="text-[10px]">💬</span>
                            <p className="text-[10px] font-semibold text-[#004b71]">Colaboración: Docente · Padre · Estudiante</p>
                          </div>
                        </div>
                        {messages.map((msg) => {
                          const isParent = msg.from === 'parent';
                          const isTeacher = msg.from === 'teacher';
                          const isStudent = msg.from === 'student';
                          return (
                            <div key={msg.id} className={cn("flex items-start gap-3 max-w-[85%] sm:max-w-[75%]", isParent ? "ml-auto flex-row-reverse" : "")}>
                              <div className={cn("w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold mt-1",
                                isTeacher ? 'bg-[#cbe6ff] text-[#004b71]' : isParent ? 'bg-[#86f8c8] text-[#007352]' : 'bg-[#f8d8ff] text-[#6c228c]'
                              )}>
                                {isTeacher ? 'D' : isParent ? 'P' : 'E'}
                              </div>
                              <div className={cn("space-y-1", isParent ? "text-right" : "")}>
                                <div className="flex items-center gap-2">
                                  <span className={cn("text-[9px] font-bold uppercase",
                                    isTeacher ? 'text-[#004b71]' : isParent ? 'text-[#006c4d]' : 'text-[#6c228c]'
                                  )}>
                                    {isTeacher ? 'Docente' : isParent ? 'Tú' : 'Estudiante'}
                                  </span>
                                  <span className="text-[8px] text-[#40484f]">{msg.time}</span>
                                </div>
                                <div className={cn("rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                  isParent ? 'bg-[#004b71] text-white rounded-br-md' :
                                  isTeacher ? 'bg-[#e8e8e9] text-[#1a1c1d] rounded-bl-md' :
                                  'bg-[#f8d8ff] text-[#1a1c1d] rounded-bl-md'
                                )}>
                                  <p className="text-xs font-semibold leading-relaxed">{msg.text}</p>
                                  <div className={cn("flex items-center gap-1 mt-1", isParent ? "justify-end" : "justify-start")}>
                                    {isParent && <CheckCheck size={12} className={msg.pending ? "text-white/40" : "text-white/70"} />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="px-6 py-4 border-t border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-grow h-11 px-5 bg-gray-50 border-none rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center bg-gray-50/50">
                  <div className="text-center">
                    <MessageSquare size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-text-secondary">Selecciona una conversación</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ParentMessages;
