import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, Bell, Lightbulb, MessageSquare, Trophy, Settings, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useParentStore } from '../../store/parentStore';

const items = [
  { icon: LayoutDashboard, label: 'Resumen', path: '/parent/dashboard' },
  { icon: Bell, label: 'Alertas', path: '/parent/alerts' },
  { icon: Lightbulb, label: 'Recomendaciones', path: '/parent/recommendations' },
  { icon: MessageSquare, label: 'Mensajes', path: '/parent/messages' },
  { icon: Trophy, label: 'Logros', path: '/parent/achievements' },
  { icon: Settings, label: 'Configuración', path: '/parent/settings' },
];

const ParentMobileNav = ({ isOpen, onClose }) => {
  const unreadCount = useParentStore((state) => state.unreadCount);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 lg:hidden flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-emerald-300 flex items-center justify-center">
                  <Heart size={20} className="text-primary-dark" fill="currentColor" />
                </div>
                <span className="text-lg font-black text-primary-dark">ChemSystem</span>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-grow px-3 py-4 space-y-1 overflow-y-auto">
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all",
                    isActive
                      ? "bg-secondary/20 text-primary-dark shadow-sm"
                      : "text-text-secondary hover:bg-gray-50 hover:text-primary"
                  )}
                >
                  <item.icon size={22} />
                  <span className="font-bold text-sm">{item.label}</span>
                  {item.label === 'Alertas' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ParentMobileNav;
