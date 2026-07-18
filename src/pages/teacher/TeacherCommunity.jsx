import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';

const TeacherCommunity = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchConversations = () => {
    setLoading(true);
    setError(null);
    teacherService.getConversations()
      .then(data => {
        setConversations(data);
        if (data.length > 0 && !selectedConv) setSelectedConv(data[0]);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => {
    if (!selectedConv) return;
    setMsgLoading(true);
    teacherService.getConversationMessages(selectedConv.id)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setMsgLoading(false));
  }, [selectedConv?.id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    const content = newMessage.trim();
    setNewMessage('');
    setMessages(prev => [...prev, { id: Date.now(), from: 'teacher', text: content, time: 'Ahora' }]);
    try {
      await teacherService.sendMessage(selectedConv.id, content);
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)]">
        <div className="w-80 bg-[#f3f3f4] border-r border-[#c0c7d0]/20 p-6 space-y-4">
          {[1, 2].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}
        </div>
        <div className="flex-grow p-6 space-y-4">
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-500 text-lg font-bold">!</span>
        </div>
        <p className="text-lg font-bold text-[#1a1c1d] mb-4">{error}</p>
        <button onClick={fetchConversations} className="px-6 py-2.5 bg-[#004b71] text-white rounded-xl font-bold text-sm">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Left: Conversation List */}
      <aside className="hidden lg:flex flex-col w-80 h-full border-r border-[#c0c7d0]/20 bg-[#f3f3f4] p-4 gap-4 overflow-y-auto">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#004b71] mb-4">Conversaciones</h3>
          {conversations.length === 0 ? (
            <p className="text-xs text-[#40484f]">Sin conversaciones activas</p>
          ) : conversations.map(conv => (
            <button key={conv.id} onClick={() => setSelectedConv(conv)}
              className={cn("w-full mb-2 p-4 rounded-2xl text-left transition-all border",
                selectedConv?.id === conv.id ? 'bg-white border-[#004b71]/20 shadow-sm' : 'bg-white/50 border-transparent hover:bg-white'
              )}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#cbe6ff] flex items-center justify-center text-xs font-bold text-[#004b71]">
                  {(conv.parent?.name || '??').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1c1d] truncate">{conv.parent?.name}</p>
                  <p className="text-[10px] text-[#40484f]">{conv.subject}</p>
                </div>
              </div>
              {conv.student && (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#004b71]">
                  <span>🎓</span> {conv.student.name}
                </div>
              )}
              {conv.lastMessage && (
                <p className="text-[11px] text-[#40484f] truncate mt-1">{conv.lastMessage.content}</p>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Center: Chat */}
      <section className="flex-1 flex flex-col bg-white relative">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#c0c7d0]/10 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#cbe6ff] flex items-center justify-center text-xs font-bold text-[#004b71]">
                  {(selectedConv.parent?.name || '?').charAt(0)}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1a1c1d]">{selectedConv.parent?.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#006c4d]" />
                    <span className="text-[10px] text-[#40484f] font-medium">{selectedConv.subject}</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#004b71] text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
                Intervención Urgente
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {msgLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={cn("flex", i % 2 === 0 ? 'justify-start' : 'justify-end')}>
                      <div className={cn("h-12 w-48 rounded-2xl animate-pulse", i % 2 === 0 ? 'bg-gray-100 rounded-tl-none' : 'bg-gray-100 rounded-tr-none')} />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-[#f3f3f4] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[#40484f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-[#40484f]">No hay mensajes aún. Escribe algo para iniciar la conversación.</p>
                </div>
              ) : (
                <>
                  {/* System Notification */}
                  <div className="flex justify-center">
                    <div className="bg-[#ffdad6]/20 px-4 py-2 rounded-full flex items-center gap-2 border border-[#ba1a1a]/10">
                      <svg className="w-4 h-4 text-[#ba1a1a]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 8h2v2h-2zm0-6h2v4h-2z"/></svg>
                      <p className="text-[11px] font-semibold text-[#93000a] uppercase tracking-tight">Conversación con padre de familia</p>
                    </div>
                  </div>

                  {messages.map(msg => {
                    const fromType = msg.from;
                    const isTeacher = fromType === 'teacher';
                    const isParent = fromType === 'parent';
                    const isStudent = fromType === 'student';
                    const alignRight = isTeacher;
                    return (
                      <div key={msg.id} className={cn("flex items-start gap-4 max-w-2xl", alignRight ? 'ml-auto flex-row-reverse' : '')}>
                        <div className={cn("w-8 h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden text-[9px] font-bold",
                          isTeacher ? 'bg-[#cbe6ff] text-[#004b71]' :
                          isParent ? 'bg-[#86f8c8] text-[#007352]' : 'bg-[#f8d8ff] text-[#6c228c]'
                        )}>
                          {isTeacher ? 'D' : isParent ? 'P' : 'E'}
                        </div>
                        <div className={cn("space-y-1", alignRight ? 'text-right' : '')}>
                          <div className="flex items-center gap-2">
                            <span className={cn("text-[10px] font-bold uppercase",
                              isTeacher ? 'text-[#004b71]' :
                              isParent ? 'text-[#006c4d]' : 'text-[#6c228c]'
                            )}>
                              {isTeacher ? 'Docente' : isParent ? 'Padre' : 'Estudiante'}
                            </span>
                            <span className="text-[9px] text-[#40484f]">{msg.time}</span>
                          </div>
                          <div className={cn("p-4 rounded-2xl shadow-sm text-sm text-[#1a1c1d] leading-relaxed",
                            isTeacher ? 'bg-[#e8e8e9] rounded-tr-none' :
                            isParent ? 'bg-[#86f8c8]/40 rounded-tl-none' : 'bg-[#f8d8ff]/40 rounded-tl-none'
                          )}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-[#c0c7d0]/10">
              <div className="relative flex items-center">
                <input type="text" placeholder="Escribe un mensaje de apoyo o coordinación..."
                  value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="w-full pl-6 pr-24 py-4 bg-[#f3f3f4] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#004b71]/20 outline-none placeholder:text-[#40484f]/50" />
                <div className="absolute right-3 flex items-center gap-2">
                  <button onClick={handleSend} disabled={!newMessage.trim()}
                    className="p-3 bg-[#004b71] text-white rounded-xl shadow-lg disabled:opacity-50 transition-all"
                    style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-[#f9f9fa]">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <p className="text-sm font-bold text-[#40484f]">Selecciona una conversación</p>
            </div>
          </div>
        )}
      </section>

      {/* Right: Events & AI */}
      <aside className="hidden xl:flex flex-col w-72 h-full border-l border-[#c0c7d0]/10 bg-white p-6 gap-6 overflow-y-auto">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#40484f]">Eventos Críticos</h3>
        <div className="space-y-4">
          {selectedConv && (
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-1 h-12 bg-[#ba1a1a] rounded-full shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#1a1c1d] group-hover:text-[#004b71] transition-colors">Conversación activa</p>
                <p className="text-[11px] text-[#40484f] leading-tight mt-1">Mensajes intercambiados con {selectedConv.parent?.name}</p>
              </div>
            </div>
          )}
          <div className="flex gap-4 group cursor-pointer opacity-60">
            <div className="w-1 h-12 bg-[#006c4d] rounded-full shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#1a1c1d]">Hito Alcanzado</p>
              <p className="text-[11px] text-[#40484f] leading-tight mt-1">Se completó el módulo de Estequiometría con 95% de precisión.</p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-[#c0c7d0]/10">
          <div className="bg-[#cbe6ff]/10 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-[#004b71]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l-5-5v3h-3c-3.86 0-7 3.14-7 7 0 2.76 2.24 5 5 5h4v-2H9c-1.66 0-3-1.34-3-3 0-2.76 2.24-5 5-5h3v3l5-5z"/></svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Sugerencia IA</span>
            </div>
            <p className="text-xs text-[#1a1c1d] leading-snug">Mantén una comunicación clara y empática con los padres. El seguimiento colaborativo mejora el rendimiento estudiantil.</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TeacherCommunity;
