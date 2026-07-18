import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Heart, Send, Clock, AlertTriangle, RefreshCw, User
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    setError(null);
    api.get('/community').then(r => {
      setPosts(r.data || []);
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    try {
      await api.post('/community', { title: newPost.title, content: newPost.content, category: 'general' });
      setNewPost({ title: '', content: '' });
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
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
                    <Heart size={12} className="text-red-400" />
                    {post.likes_count || 0}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-semibold text-text-secondary">
                    <MessageSquare size={12} />
                    {post.comments_count || 0}
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
    </div>
  );
};

export default Community;
