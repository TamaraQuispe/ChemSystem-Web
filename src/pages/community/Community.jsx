import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Heart, Send, Clock, AlertTriangle, RefreshCw, User,
  GraduationCap, Users, ArrowLeft, ChevronRight, Bot,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import api from '../../services/api';
import { studentService } from '../../services/studentService';

const ROLES = {
  teacher: { label: 'Docente', bg: 'bg-[#004b71]/10 text-[#004b71]' },
  parent: { label: 'Padre', bg: 'bg-[#6c228c]/10 text-[#6c228c]' },
  student: { label: 'Tú', bg: 'bg-[#006c4d]/10 text-[#006c4d]' },
};

const ConversationList = ({ conversations, activeId, onSelect, onBack }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 mb-4">
      <button onClick={onBack} className="p-1.5 hover:bg-surface-container rounded-lg transition-all md:hidden"><ArrowLeft size={16} /></button>
      <h3 className="font-headline font-bold text-sm text-on-surface">Mis Conversaciones</h3>
    </div>
    {conversations.length === 0 ? (
      <div className="text-center py-8">
        <MessageSquare size={32} className="text-gray-300 mx-auto mb-2" />
        <p className="text-xs text-on-surface-variant">Sin conversaciones activas</p>
      </div>
    ) : conversations.map(c => (
      <button key={c.id} onClick={() => onSelect(c.id)}
        className={cn('w-full text-left p-3 rounded-xl transition-all', activeId === c.id ? 'bg-primary/5 border border-primary/10' : 'hover:bg-surface-container')}>
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap size={14} className="text-[#004b71] shrink-0" />
          <span className="text-xs font-bold text-on-surface truncate">{c.teacher?.name || 'Docente'}</span>
          {c.parent && <span className="text-[9px] text-on-surface-variant">· {c.parent.name}</span>}
        </div>
        <p className="text-[10px] text-on-surface-variant truncate">{c.subject}</p>
        {c.lastMessage && (
          <p className="text-[9px] text-on-surface-variant/60 mt-1 truncate">{c.lastMessage.content}</p>
        )}
      </button>
    ))}
  </div>
);

const ChatView = ({ conversation, messages, onSend, loading }) => {
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const [sending, setSending] = useState(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    await onSend(input);
    setInput('');
    setSending(false);
  }, [input, sending, onSend]);

  if (!conversation) return (
    <div className="flex items-center justify-center h-full text-on-surface-variant text-xs p-8 text-center">
      Selecciona una conversación para ver los mensajes
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap size={16} className="text-[#004b71]" />
          <span className="text-sm font-bold text-on-surface">{conversation.teacher?.name || 'Docente'}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
          <Users size={12} />
          <span>{conversation.parent?.name || 'Padre'} · Tú</span>
          <ChevronRight size={10} />
          <span className="truncate">{conversation.subject}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-surface-container rounded-xl animate-pulse" />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant text-xs">No hay mensajes aún. Escribe algo para iniciar la conversación.</div>
        ) : messages.map(m => {
          const role = ROLES[m.from] || { label: m.from, bg: 'bg-gray-100 text-gray-600' };
          const isMe = m.from === 'student';
          return (
            <div key={m.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[80%]', !isMe && 'flex items-start gap-2')}>
                {!isMe && <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-1"><Bot size={12} className="text-on-surface-variant" /></div>}
                <div>
                  {!isMe && <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full', role.bg)}>{role.label}</span>}
                  <div className={cn('rounded-2xl px-4 py-2.5 mt-1', isMe ? 'bg-primary text-on-primary rounded-br-md' : 'bg-surface-container text-on-surface rounded-bl-md')}>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <span className={cn('text-[9px] mt-1 block', isMe ? 'text-on-primary/60' : 'text-on-surface-variant/60')}>{m.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-outline-variant/10">
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Escribe un mensaje..." value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            className="flex-1 h-10 px-4 bg-surface-container border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none" />
          <button onClick={handleSend} disabled={!input.trim() || sending}
            className="p-2.5 bg-primary text-on-primary rounded-xl disabled:opacity-50 transition-all">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('forum');
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [convLoading, setConvLoading] = useState(false);
  const [showConvList, setShowConvList] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    setError(null);
    api.get('/community').then(r => {
      setPosts(r.data || []);
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); fetchConversations(); }, []);

  const fetchConversations = async () => {
    try {
      const convs = await studentService.getConversations();
      setConversations(convs || []);
      if (convs?.length > 0) {
        setActiveConv(convs[0]);
        setShowConvList(false);
      }
    } catch {}
  };

  const selectConversation = async (convId) => {
    const conv = conversations.find(c => c.id === convId);
    setActiveConv(conv);
    setShowConvList(false);
    setConvLoading(true);
    try {
      const msgs = await studentService.getConversationMessages(convId);
      setMessages(msgs || []);
    } catch {}
    setConvLoading(false);
  };

  const handleSendMessage = async (content) => {
    if (!activeConv) return;
    try {
      await studentService.sendMessage(activeConv.id, content);
      const msgs = await studentService.getConversationMessages(activeConv.id);
      setMessages(msgs || []);
    } catch (err) { alert(err.message); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    try {
      await api.post('/community', { title: newPost.title, content: newPost.content, category: 'general' });
      setNewPost({ title: '', content: '' });
      setShowForm(false);
      fetchPosts();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button onClick={() => setActiveTab('forum')}
          className={cn('px-5 py-2.5 rounded-full font-bold text-xs transition-all', activeTab === 'forum' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface-variant')}>
          Foro Comunitario
        </button>
        <button onClick={() => setActiveTab('tripartite')}
          className={cn('px-5 py-2.5 rounded-full font-bold text-xs transition-all', activeTab === 'tripartite' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface-variant')}>
          Colaboración Tripartita
        </button>
      </div>

      {activeTab === 'forum' ? (
        <>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-primary-dark tracking-tight">Comunidad</h1>
                <p className="text-text-secondary font-semibold mt-1">Comparte y aprende con otros estudiantes</p>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchPosts} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
                <Button onClick={() => setShowForm(!showForm)} className="rounded-2xl bg-primary-dark text-white text-xs font-bold px-5 h-10">
                  + Nuevo Post
                </Button>
              </div>
            </div>
          </motion.div>

          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 border-primary/20">
                <form onSubmit={handleCreate} className="space-y-4">
                  <input type="text" placeholder="Título de tu publicación..." value={newPost.title}
                    onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                    className="w-full h-11 px-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                  <textarea placeholder="Comparte tus ideas, dudas o logros..." value={newPost.content} rows={3}
                    onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
                    <Button type="submit" size="sm" className="bg-primary-dark text-white">Publicar</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
                    <div className="flex-grow space-y-2">
                      <div className="w-1/3 h-4 bg-gray-200 rounded" />
                      <div className="w-full h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              <Card className="p-12 text-center">
                <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
                <button onClick={fetchPosts} className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
              </Card>
            ) : posts.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-black text-primary-dark mb-2">Sin publicaciones aún</h3>
                <p className="text-sm font-semibold text-text-secondary">Sé el primero en compartir algo con la comunidad.</p>
              </Card>
            ) : posts.map((post, idx) => (
              <motion.div key={post.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                    <User size={24} className="text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-black text-primary-dark">{post.title}</h3>
                      {post.category && (
                        <span className="text-[8px] font-bold px-2 py-0.5 bg-primary/5 text-primary rounded-lg uppercase tracking-wider">{post.category}</span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-text-secondary leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-[9px] font-semibold text-text-secondary">
                        <Heart size={12} className="text-red-400" />{post.likes_count || 0}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-semibold text-text-secondary">
                        <MessageSquare size={12} />{post.comments_count || 0}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-semibold text-text-secondary">
                        <Clock size={12} />
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' }) : 'Reciente'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            {/* Conversation List */}
            <div className={cn('md:col-span-4 border-r border-outline-variant/10 p-4', showConvList ? 'block' : 'hidden md:block')}>
              <ConversationList conversations={conversations} activeId={activeConv?.id}
                onSelect={selectConversation} onBack={() => setActiveTab('forum')} />
            </div>
            {/* Chat Area */}
            <div className={cn('md:col-span-8 flex flex-col', !showConvList ? 'block' : 'hidden md:block')}>
              <ChatView conversation={activeConv} messages={messages} loading={convLoading}
                onSend={handleSendMessage} />
            </div>
          </div>
          {conversations.length === 0 && (
            <div className="p-8 text-center">
              <Users size={40} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-headline font-bold text-on-surface mb-1">Colaboración Tripartita</h3>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                Las conversaciones con tus docentes y padres aparecerán aquí. Cuando un docente o padre inicie una conversación contigo, podrás verla y participar.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Community;
