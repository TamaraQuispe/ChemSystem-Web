import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

const TeacherHeader = ({ showSearch = false }) => {
  const { user } = useAuthStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    if (showNotifs) {
      api.get('/notifications').then(r => {
        setNotifications(r.data || []);
      }).catch(() => {});
    }
  }, [showNotifs]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
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
    <header className="h-24 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="flex-grow max-w-2xl">
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Explorar laboratorio, recursos..."
              className="w-full h-12 pl-14 pr-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
          </div>
        ) : (
          <div className="flex gap-8 items-center">
            <span className="text-sm font-bold text-text-secondary hover:text-primary cursor-pointer transition-colors" onClick={() => window.location.href = '/teacher/dashboard'}>Panel</span>
            <span className="text-sm font-bold text-primary underline decoration-2 underline-offset-8 cursor-pointer" onClick={() => window.location.href = '/teacher/grades'}>Calificaciones</span>
            <span className="text-sm font-bold text-text-secondary hover:text-primary cursor-pointer transition-colors" onClick={() => window.location.href = '/teacher/monitoring'}>Monitoreo</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all relative">
            <Bell size={22} />
            {unreadCount > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ba1a1a] rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[7px] text-white font-black">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </motion.div>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-14 right-0 w-[340px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h4 className="font-black text-[#004b71]">Notificaciones</h4>
                  {unreadCount > 0 && <span className="text-[10px] font-bold text-[#004b71] bg-[#cbe6ff] px-2 py-0.5 rounded-full">{unreadCount} sin leer</span>}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length > 0 ? notifications.map((n) => (
                    <div key={n.id} onClick={() => markAsRead(n.id)}
                      className={cn("p-4 border-b border-gray-50 transition-all hover:bg-gray-50 flex gap-3 cursor-pointer",
                        !n.is_read && "bg-[#cbe6ff]/10")}>
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                        n.type === 'alert' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                        n.type === 'achievement' ? 'bg-[#86f8c8] text-[#006c4d]' : 'bg-[#cbe6ff] text-[#004b71]')}>
                        <span className="text-sm">{n.type === 'alert' ? '⚠' : n.type === 'achievement' ? '✓' : 'ℹ'}</span>
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className={cn("text-xs font-black truncate", !n.is_read ? "text-[#004b71]" : "text-[#1a1c1d]")}>{n.title}</h5>
                          <span className="text-[9px] text-[#40484f] font-medium shrink-0">{new Date(n.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' })}</span>
                        </div>
                        <p className="text-[10px] text-[#40484f] leading-relaxed font-semibold mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-10 text-center space-y-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <Bell size={28} className="text-gray-300" />
                      </div>
                      <p className="text-xs font-bold text-[#40484f]">No hay notificaciones</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={() => window.location.href = '/teacher/settings'} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
          <Settings size={22} />
        </button>

        <div className="w-px h-8 bg-gray-200 mx-2" />

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-black text-primary-dark leading-none mb-1">{user?.name || 'Docente'}</p>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Laboratorio de Cristal</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-200 border-2 border-white shadow-md overflow-hidden">
            <img src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'} alt={user?.name || 'Teacher'} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;
