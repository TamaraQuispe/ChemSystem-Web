import React, { useState, useEffect, useRef } from 'react';
import { Bell, Heart, ChevronDown, Menu, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useParentStore } from '../../store/parentStore';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const ParentHeader = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const { children, selectedChild, setSelectedChild, fetchUnreadCount } = useParentStore();
  const [showChildDropdown, setShowChildDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const childRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (showNotifs) {
      api.get('/notifications').then(r => setNotifications(r.data || [])).catch(() => {});
    }
  }, [showNotifs]);

  useEffect(() => {
    const handleClick = (e) => {
      if (childRef.current && !childRef.current.contains(e.target)) setShowChildDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  return (
    <header className="h-24 px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl border border-gray-200 text-primary-dark hover:bg-gray-50 transition-all cursor-pointer shrink-0">
          <Menu size={20} className="stroke-[2.5]" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
          <Heart size={20} className="text-primary-dark" />
        </div>
        <div>
          <h1 className="text-lg font-black text-primary-dark tracking-tight">Panel Familiar</h1>
          <p className="text-[11px] font-bold text-text-secondary">Progreso académico y bienestar</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Child Selector */}
        {children.length > 0 && (
          <div className="relative" ref={childRef}>
            <button onClick={() => setShowChildDropdown(!showChildDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-primary-dark hover:bg-gray-100 transition-all">
              <User size={14} />
              <span className="hidden sm:inline truncate max-w-[100px]">{selectedChild?.name || 'Seleccionar hijo'}</span>
              <ChevronDown size={14} className={cn("transition-transform", showChildDropdown && "rotate-180")} />
            </button>
            {showChildDropdown && (
              <div className="absolute top-12 right-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <p className="px-4 py-2 text-[9px] font-bold text-text-secondary uppercase tracking-wider border-b border-gray-50">Seleccionar hijo</p>
                {children.map(child => (
                  <button key={child.id} onClick={() => { setSelectedChild(child); setShowChildDropdown(false); }}
                    className={cn("w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-all", selectedChild?.id === child.id && "bg-secondary/10")}>
                    <img src={child.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${child.name}`} alt={child.name} className="w-8 h-8 rounded-lg" />
                    <div>
                      <p className="text-xs font-black text-text-main">{child.name}</p>
                      <p className="text-[9px] font-bold text-text-secondary">Nivel {child.level}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all relative">
            <Bell size={22} />
            {unreadCount > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[7px] text-white font-black">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </motion.div>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-14 right-0 w-[340px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h4 className="font-black text-primary-dark">Notificaciones</h4>
                  {unreadCount > 0 && <span className="text-[10px] font-bold text-primary bg-secondary/20 px-2 py-0.5 rounded-full">{unreadCount} sin leer</span>}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} onClick={() => markAsRead(n.id)}
                      className={cn("p-4 border-b border-gray-50 transition-all hover:bg-gray-50 flex gap-3 cursor-pointer", !n.is_read && "bg-secondary/5")}>
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                        n.type === 'alert' ? 'bg-red-50 text-red-500' :
                        n.type === 'achievement' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500')}>
                        <span className="text-sm">{n.type === 'alert' ? '⚠' : n.type === 'achievement' ? '✓' : 'ℹ'}</span>
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className={cn("text-xs font-black truncate", !n.is_read ? "text-primary-dark" : "text-text-main")}>{n.title}</h5>
                          <span className="text-[9px] text-text-secondary font-medium shrink-0">
                            {new Date(n.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-secondary leading-relaxed font-semibold mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-10 text-center space-y-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <Bell size={28} className="text-gray-300" />
                      </div>
                      <p className="text-xs font-bold text-text-secondary">No hay notificaciones</p>
                      <p className="text-[9px] font-semibold text-gray-400">Las alertas sobre tus hijos aparecerán aquí</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-8 bg-gray-200" />

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-primary-dark leading-none mb-1">{user?.name || 'Padre de Familia'}</p>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Familia</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-200 border-2 border-white shadow-md overflow-hidden shrink-0">
            <img src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Parent'} alt={user?.name || 'Parent'} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ParentHeader;
