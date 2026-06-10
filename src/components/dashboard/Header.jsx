import React, { useState, useEffect } from 'react';
import { Bell, Zap, Target, Cloud, Flame, X, Check, Info, AlertTriangle, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useAchievementStore } from '../../store/achievementStore';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const Header = ({ onMenuClick }) => {
  const { user, emotionalState, setEmotionalState } = useAuthStore();
  const { level, totalXp } = useAchievementStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (showNotifs) {
      api.get('/notifications').then((res) => {
        setNotifications(res.data || []);
      }).catch(() => {
        // Fallback vacío silencioso
      });
    }
  }, [showNotifs]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="h-20 md:h-24 px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100 shrink-0">
      
      <div className="flex items-center gap-3 sm:gap-6 md:gap-12 min-w-0">
        
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl border border-gray-200 text-primary-dark hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shrink-0"
        >
          <Menu size={20} className="stroke-[2.5]" />
        </button>

        <h1 className="text-xl sm:text-2xl font-black text-primary-dark tracking-tight truncate">
          Panel Principal
        </h1>
        
        <div className="hidden md:flex items-center gap-6 px-6 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 shrink-0">
          <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">¿Cómo te sientes hoy?</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setEmotionalState('motivated')}
              className={cn(
                "hover:scale-125 transition-all p-1 rounded-lg",
                emotionalState === 'motivated' ? "text-orange-500 bg-orange-50 shadow-sm" : "text-orange-400 opacity-40 hover:opacity-100"
              )}
            >
              <Zap size={20} fill={emotionalState === 'motivated' ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => setEmotionalState('stressed')}
              className={cn(
                "hover:scale-125 transition-all p-1 rounded-lg",
                emotionalState === 'stressed' ? "text-red-500 bg-red-50 shadow-sm" : "text-red-400 opacity-40 hover:opacity-100"
              )}
            >
              <Target size={20} fill={emotionalState === 'stressed' ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => setEmotionalState('calm')}
              className={cn(
                "hover:scale-125 transition-all p-1 rounded-lg",
                emotionalState === 'calm' ? "text-blue-500 bg-blue-50 shadow-sm" : "text-blue-300 opacity-40 hover:opacity-100"
              )}
            >
              <Cloud size={20} fill={emotionalState === 'calm' ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 md:gap-8 shrink-0">
        
        <div className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-secondary/20 text-primary rounded-2xl border border-secondary/30">
          <Flame size={16} className="text-primary fill-primary animate-pulse" />
          <span className="text-xs sm:text-sm font-black whitespace-nowrap">Nivel {level}</span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-110 cursor-pointer"
          >
            <Bell size={22} className="text-primary" />
            {unreadCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
              >
                <span className="text-[7px] text-white font-black">{unreadCount}</span>
              </motion.div>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-16 right-[-40px] sm:right-0 w-[300px] sm:w-[350px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h4 className="font-black text-primary-dark">Notificaciones</h4>
                </div>

                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id}
                        className={cn(
                          "p-4 sm:p-5 border-b border-gray-50 transition-all hover:bg-gray-50 flex gap-3 sm:gap-4",
                          !n.is_read && "bg-primary/[0.02]"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                          n.type === 'urgent' || n.type === 'alert' ? "bg-red-50 text-red-500" :
                          n.type === 'achievement' ? "bg-green-50 text-green-500" :
                          "bg-blue-50 text-blue-500"
                        )}>
                          {n.type === 'urgent' || n.type === 'alert' ? <AlertTriangle size={18} /> :
                           n.type === 'achievement' ? <Check size={18} /> :
                           <Info size={18} />}
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-grow">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className={cn("text-xs font-black truncate", !n.is_read ? "text-primary-dark" : "text-text-main")}>
                              {n.title}
                            </h5>
                            <span className="text-[9px] text-text-secondary font-medium shrink-0">
                              {new Date(n.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center space-y-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Bell size={28} />
                      </div>
                      <p className="text-xs font-bold text-text-secondary tracking-tight">No hay notificaciones</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-8 bg-gray-200 shrink-0" />

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-black text-primary-dark leading-none mb-1">{user?.name || 'Usuario'}</p>
            <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">{user?.role === 'teacher' ? 'Docente' : 'Estudiante'}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-200 border-2 border-white shadow-md overflow-hidden shrink-0">
            <img 
              src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} 
              alt={user?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
