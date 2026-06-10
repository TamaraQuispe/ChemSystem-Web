import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Sparkles } from 'lucide-react';
import { useAchievementStore } from '../../store/achievementStore';

const AchievementToast = () => {
  const { pendingNotifications, clearNotification } = useAchievementStore();

  useEffect(() => {
    if (pendingNotifications.length > 0) {
      const timer = setTimeout(() => {
        clearNotification(pendingNotifications[0].id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [pendingNotifications, clearNotification]);

  if (pendingNotifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-8 z-[100] flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {pendingNotifications.map((notif, idx) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white border-2 border-amber-200 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-start gap-4 p-5">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-2xl shadow-lg shrink-0">
                <span>{notif.icon || '🏆'}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">
                    ¡Nuevo logro!
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#0D2140] leading-tight mb-0.5">
                  {notif.title}
                </h4>
                <p className="text-[10px] font-semibold text-gray-500">
                  +{notif.xp} XP de bonificación
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() => clearNotification(notif.id)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            {/* Progress bar decoration */}
            <div className="h-1 bg-gradient-to-r from-amber-400 to-yellow-500" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AchievementToast;
