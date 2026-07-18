import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Lightbulb,
  MessageSquare,
  Trophy,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Heart,
  FlaskConical
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { useParentStore } from '../../store/parentStore';
import { Button } from '../ui/Button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Resumen', path: '/parent/dashboard' },
  { icon: Bell, label: 'Alertas', path: '/parent/alerts' },
  { icon: Lightbulb, label: 'Recomendaciones', path: '/parent/recommendations' },
  { icon: MessageSquare, label: 'Mensajes', path: '/parent/messages' },
  { icon: Trophy, label: 'Logros', path: '/parent/achievements' },
  { icon: Settings, label: 'Configuración', path: '/parent/settings' },
];

const ParentSidebar = ({ onNavClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const unreadCount = useParentStore((state) => state.unreadCount);
  const selectedChild = useParentStore((state) => state.selectedChild);
  const expanded = !isCollapsed;

  const fetchProgress = async () => {
    setLoadingProgress(true);
    setShowProgress(true);
    try {
      const { default: api } = await import('../../services/api');
      const res = await api.get('/parent/dashboard' + (selectedChild?.id ? `?child_id=${selectedChild.id}` : ''));
      setProgressData(res.data);
    } catch { setProgressData(null); }
    setLoadingProgress(false);
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col overflow-hidden z-50 shrink-0 transition-all duration-300",
        "hidden lg:flex glass-sidebar",
        isCollapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Brand */}
      <div className={cn(
        "flex items-center shrink-0 border-b border-gray-100 transition-all duration-300",
        expanded ? "px-5 py-4 gap-3" : "px-0 py-4 justify-center"
      )}>
        <div className="min-w-[40px] h-10 rounded-xl bg-gradient-to-br from-secondary to-emerald-300 flex items-center justify-center text-primary-dark shadow-lg shadow-secondary/30 shrink-0">
          <Heart size={24} fill="currentColor" />
        </div>
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          expanded ? "w-auto opacity-100" : "w-0 opacity-0"
        )}>
          <span className="text-xl font-black text-primary-dark tracking-tighter block leading-none whitespace-nowrap">ChemSystem</span>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest whitespace-nowrap">Familia</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden",
        expanded ? "space-y-1 px-3 py-4" : "space-y-2 px-0 py-4"
      )}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={false}
            onClick={onNavClick}
            className={({ isActive }) => cn(
              "flex items-center rounded-xl transition-all duration-200 group relative",
              expanded
                ? "gap-4 px-3 py-2.5"
                : "gap-0 px-0 py-3 justify-center mx-auto w-12",
              isActive
                ? "bg-secondary/20 text-primary-dark shadow-sm"
                : "text-text-secondary hover:bg-gray-50 hover:text-primary"
            )}
          >
            <item.icon size={22} className="min-w-[22px] shrink-0" />
            <span className={cn(
              "font-bold text-sm overflow-hidden transition-all duration-300 whitespace-nowrap",
              expanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}>
              {item.label}
            </span>
            {(item.label === 'Alertas' && unreadCount > 0) && (
              <span className={cn(
                "bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center",
                expanded ? "px-1.5 py-0.5 ml-auto" : "absolute -top-0.5 -right-0.5 w-4 h-4"
              )}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* New Report Button */}
      {expanded && (
        <div className="px-4 py-3 shrink-0">
          <Button onClick={fetchProgress} className="w-full h-11 bg-primary-dark text-white rounded-2xl shadow-xl shadow-primary/20 gap-3 font-bold active:scale-95 transition-all text-sm">
            <FlaskConical size={20} /> Ver Progreso
          </Button>
        </div>
      )}

      {/* Bottom Actions */}
      <div className={cn(
        "mt-auto shrink-0 border-t border-gray-100 transition-all duration-300",
        expanded ? "space-y-0.5 px-3 py-3" : "space-y-1 px-0 py-3"
      )}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex items-center rounded-xl text-text-secondary hover:bg-gray-50 transition-all",
            expanded ? "gap-4 px-3 py-2 w-full" : "gap-0 px-0 py-3 justify-center mx-auto w-12"
          )}
        >
          {isCollapsed ? <ChevronRight size={22} className="shrink-0" /> : <ChevronLeft size={22} className="shrink-0" />}
          <span className={cn(
            "font-bold text-sm overflow-hidden transition-all duration-300 whitespace-nowrap",
            expanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}>
            Contraer
          </span>
        </button>

        <button
          className={cn(
            "flex items-center rounded-xl text-text-secondary hover:bg-gray-50 transition-all",
            expanded ? "gap-4 px-3 py-2 w-full" : "gap-0 px-0 py-3 justify-center mx-auto w-12"
          )}
        >
          <HelpCircle size={22} className="shrink-0" />
          <span className={cn(
            "font-bold text-sm overflow-hidden transition-all duration-300 whitespace-nowrap",
            expanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}>
            Ayuda
          </span>
        </button>

        <button
          onClick={logout}
          className={cn(
            "flex items-center rounded-xl text-text-secondary hover:bg-red-50 hover:text-red-500 transition-all",
            expanded ? "gap-4 px-3 py-2 w-full" : "gap-0 px-0 py-3 justify-center mx-auto w-12"
          )}
        >
          <LogOut size={22} className="shrink-0" />
          <span className={cn(
            "font-bold text-sm overflow-hidden transition-all duration-300 whitespace-nowrap",
            expanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}>
            Cerrar Sesión
          </span>
        </button>
      </div>

      {/* Progress Modal */}
      {showProgress && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProgress(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-primary-dark">Progreso de {selectedChild?.name || 'tu hijo'}</h3>
                <p className="text-sm text-text-secondary mt-1">Resumen de rendimiento académico</p>
              </div>
              <button onClick={() => setShowProgress(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-lg">✕</button>
            </div>

            {loadingProgress ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : progressData ? (
              <div className="space-y-5">
                {/* Nivel y XP */}
                <div className="text-center p-5 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl">
                  <p className="text-3xl font-black">Nivel {progressData.user?.level || 1}</p>
                  <p className="text-sm text-white/70 mt-1">{progressData.user?.xp || 0} XP totales</p>
                  <div className="w-full h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: `${((progressData.user?.xp || 0) % 200 / 200) * 100}%` }} />
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                    <p className="text-2xl font-black text-emerald-500">{progressData.kpis?.avgScore || 0}%</p>
                    <p className="text-[10px] font-bold text-text-secondary">Promedio</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl text-center">
                    <p className="text-2xl font-black text-blue-500">{progressData.kpis?.streak || 0}</p>
                    <p className="text-[10px] font-bold text-text-secondary">Racha (días)</p>
                  </div>
                  <div className="p-4 bg-violet-50 rounded-2xl text-center">
                    <p className="text-2xl font-black text-violet-500">{progressData.kpis?.challengesCompleted || '—'}</p>
                    <p className="text-[10px] font-bold text-text-secondary">Módulos</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-2xl text-center">
                    <p className="text-2xl font-black text-orange-500">{progressData.kpis?.experimentsCount || 0}</p>
                    <p className="text-[10px] font-bold text-text-secondary">Actividades</p>
                  </div>
                </div>

                {/* Últimos logros */}
                {progressData.achievements?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-text-secondary mb-2">Últimos logros</p>
                    <div className="space-y-2">
                      {progressData.achievements.slice(0, 3).map((a, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                            a.rarity === 'legendary' ? 'bg-amber-100 text-amber-500' :
                            a.rarity === 'epic' ? 'bg-violet-100 text-violet-500' :
                            a.rarity === 'rare' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'
                          )}>
                            <Trophy size={14} />
                          </div>
                          <span className="text-[10px] font-bold text-text-main">{a.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => { setShowProgress(false); window.location.href = '/parent/achievements'; }}
                  className="w-full py-3 bg-primary-dark text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all">
                  Ver informe completo →
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm font-bold text-text-secondary">No hay datos disponibles</p>
                <p className="text-xs text-gray-400 mt-1">Selecciona un hijo para ver su progreso</p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ParentSidebar;
