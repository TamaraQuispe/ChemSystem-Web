import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Send, User, Clock, Sparkles,
  CheckCheck, RefreshCw, AlertTriangle, School
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
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
    teacherService.getConversationMessages
      ? teacherService.getConversationMessages(selectedConv.id).then(setMessages).catch(() => {}).finally(() => setMsgLoading(false))
      : setMsgLoading(false);
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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Comunidad Educativa</h1>
            <p className="text-text-secondary font-semibold mt-1">Comunicación con padres de familia</p>
          </div>
          <button onClick={fetchConversations} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden h-[600px] animate-pulse">
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200" />
              <div className="flex-grow space-y-2"><div className="w-1/3 h-3 bg-gray-200 rounded" /><div className="w-2/3 h-2 bg-gray-200 rounded" /></div>
            </div>)}
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
          <p className="text-sm font-semibold text-text-secondary">Cuando los padres te contacten, las conversaciones aparecerán aquí.</p>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden">
          <div className="flex flex-col lg:flex-row h-[600px]">
            <div className="w-full lg:w-[340px] border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col shrink-0">
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-black text-primary-dark">Conversaciones con Padres</p>
                <p className="text-[10px] font-bold text-text-secondary mt-0.5">{conversations.length} activas</p>
              </div>
              <div className="flex-grow overflow-y-auto">
                {conversations.map(conv => (
                  <button key={conv.id} onClick={() => setSelectedConv(conv)}
                    className={cn("w-full p-4 flex items-start gap-3 border-b border-gray-50 transition-all text-left",
                      selectedConv?.id === conv.id ? "bg-secondary/10" : "hover:bg-gray-50"
                    )}>
                    <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      <img src={conv.parent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.parent.name}`} alt={conv.parent.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-primary-dark truncate">{conv.parent.name}</span>
                        <span className="text-[9px] font-semibold text-text-secondary shrink-0">{conv.lastMessage?.time || ''}</span>
                      </div>
                      <p className="text-[10px] font-bold text-text-secondary mt-0.5">{conv.subject}</p>
                      {conv.student && <p className="text-[9px] font-semibold text-primary mt-0.5">Sobre: {conv.student.name}</p>}
                      {conv.lastMessage && <p className="text-[10px] font-semibold text-gray-400 mt-1 truncate">{conv.lastMessage.content}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow flex flex-col min-w-0">
              {selectedConv ? (
                <>
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        <img src={selectedConv.parent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConv.parent.name}`} alt={selectedConv.parent.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-primary-dark truncate">{selectedConv.parent.name}</h3>
                        <p className="text-[10px] font-bold text-text-secondary truncate">{selectedConv.subject}</p>
                      </div>
                    </div>
                    {selectedConv.student && (
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-xl text-[10px] font-bold text-primary">
                        <School size={12} />{selectedConv.student.name}
                      </div>
                    )}
                  </div>

                  <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {msgLoading ? (
                      <div className="space-y-4">{[1, 2].map(i => <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[75%] rounded-2xl px-4 py-3 animate-pulse", i % 2 === 0 ? "bg-primary/20" : "bg-gray-100")}>
                          <div className="w-32 h-3 bg-white/30 rounded" /></div></div>)}</div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-xs font-semibold text-text-secondary">No hay mensajes aún.</p>
                      </div>
                    ) : messages.map(msg => (
                      <div key={msg.id} className={cn("flex", msg.from === 'teacher' ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3",
                          msg.from === 'teacher' ? "bg-primary text-white rounded-br-md" : "bg-gray-50 text-text-main rounded-bl-md"
                        )}>
                          <p className="text-xs font-semibold leading-relaxed">{msg.text}</p>
                          <div className={cn("flex items-center gap-1 mt-1", msg.from === 'teacher' ? "justify-end" : "justify-start")}>
                            <span className={cn("text-[9px] font-medium", msg.from === 'teacher' ? "text-white/70" : "text-gray-400")}>{msg.time}</span>
                            {msg.from === 'teacher' && <CheckCheck size={12} className="text-white/70" />}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="px-6 py-4 border-t border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                      <input type="text" placeholder="Escribe un mensaje..." value={newMessage}
                        onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                        className="flex-grow h-11 px-5 bg-gray-50 border-none rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                      <button onClick={handleSend} disabled={!newMessage.trim()}
                        className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed">
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

export default TeacherCommunity;
