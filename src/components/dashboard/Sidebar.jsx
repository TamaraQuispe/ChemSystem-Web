import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FlaskConical, 
  BookOpen, 
  BookMarked,
  LineChart, 
  Award,
  Users, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Zap,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../ui/Card';

const menuItems = [
  { icon: LayoutDashboard, label: 'Panel Principal', path: '/home' },
  { icon: FlaskConical, label: 'Simuladores', path: '/simulators' },
  { icon: BookOpen, label: 'Micro-lecciones', path: '/lessons' },
  { icon: BookMarked, label: 'Mis Módulos', path: '/modules' },
  { icon: Award, label: 'Logros', path: '/achievements' },
  { icon: LineChart, label: 'Rendimiento', path: '/analytics' },
  { icon: Users, label: 'Comunidad', path: '/community' },
];

const Sidebar = ({ isMobileOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const expanded = !isCollapsed || isMobileOpen;

  return (
    <>
      {isMobileOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-[1.5px] z-50 lg:hidden cursor-pointer"
        />
      )}

      <aside
        className={cn(
          "h-screen flex flex-col overflow-hidden z-50 shrink-0 transition-all duration-300",
          "hidden lg:flex lg:sticky lg:top-0",
          "fixed inset-y-0 left-0 bg-white shadow-2xl border-r border-gray-100 lg:shadow-none lg:border-none",
          isMobileOpen ? "flex translate-x-0" : "translate-x-[-100%] lg:translate-x-0",
          isMobileOpen ? "w-[280px]" : isCollapsed ? "w-[72px]" : "w-[280px]"
        )}
      >
        {/* Brand */}
        <div className={cn(
          "flex items-center shrink-0 border-b border-gray-100 transition-all duration-300",
          expanded ? "px-5 py-4 gap-3" : "px-0 py-4 justify-center"
        )}>
          <div className="min-w-[40px] h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0">
            <FlaskConical size={24} />
          </div>
          <div className={cn(
            "overflow-hidden transition-all duration-300",
            expanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}>
            <span className="text-2xl font-black text-primary-dark tracking-tighter whitespace-nowrap">ChemSystem</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-[#0D2140] hover:bg-gray-50 transition-all cursor-pointer ml-auto shrink-0"
          >
            <X size={16} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Progress */}
        {expanded && (
          <div className="px-4 pt-4 pb-2 space-y-2 shrink-0 hidden [@media(min-height:650px)]:block">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-black text-primary-dark">Módulos</p>
                <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">Progreso Actual: 64%</p>
              </div>
              <Zap size={18} className="text-secondary fill-secondary" />
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '64%' }}
                className="h-full bg-secondary" 
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={cn(
          "flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden",
          expanded ? "space-y-1 px-3 py-3" : "space-y-2 px-0 py-4"
        )}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={false}
              className={({ isActive }) => cn(
                "flex items-center rounded-xl transition-all duration-200 group",
                expanded 
                  ? "gap-4 px-3 py-2.5" 
                  : "gap-0 px-0 py-3 justify-center mx-auto w-12",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-text-secondary hover:bg-gray-50 hover:text-primary"
              )}
            >
              <item.icon size={22} className="min-w-[22px] shrink-0" />
              <span className={cn(
                "font-bold text-sm overflow-hidden transition-all duration-300",
                expanded ? "w-auto opacity-100" : "w-0 opacity-0"
              )}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* New Practice Button */}
        {expanded && (
          <div className="px-4 py-3 shrink-0">
            <NavLink 
              to="/molecular/builder" 
              onClick={onClose}
              className="w-full h-11 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 font-bold hover:bg-primary-dark transition-all active:scale-95 shrink-0 text-sm"
            >
              Nueva Práctica
            </NavLink>
          </div>
        )}

        {/* Support */}
        {expanded && (
          <div className="px-4 pb-3 shrink-0 hidden [@media(min-height:820px)]:block">
            <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2.5">Recursos de Apoyo</p>
            <Card className="p-4 border border-gray-100 shadow-sm bg-white rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={16} />
                <span className="text-xs font-bold">Pistas Activas</span>
              </div>
              <p className="text-[10px] text-text-secondary font-medium leading-relaxed">
                Tienes 2 pistas disponibles para este reto.
              </p>
            </Card>
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
              "hidden lg:flex items-center rounded-xl text-text-secondary hover:bg-gray-50 transition-all",
              expanded ? "gap-4 px-3 py-2 w-full" : "gap-0 px-0 py-3 justify-center mx-auto w-12"
            )}
          >
            {isCollapsed ? <ChevronRight size={22} className="shrink-0" /> : <ChevronLeft size={22} className="shrink-0" />}
            <span className={cn(
              "font-bold text-sm overflow-hidden transition-all duration-300",
              expanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}>
              Contraer
            </span>
          </button>
          
          <button
            onClick={() => alert("Abriendo centro de ayuda de ChemSystem...")}
            className={cn(
              "flex items-center rounded-xl text-text-secondary hover:bg-gray-50 transition-all",
              expanded ? "gap-4 px-3 py-2 w-full" : "gap-0 px-0 py-3 justify-center mx-auto w-12"
            )}
          >
            <HelpCircle size={22} className="shrink-0" />
            <span className={cn(
              "font-bold text-sm overflow-hidden transition-all duration-300",
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
              "font-bold text-sm overflow-hidden transition-all duration-300",
              expanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}>
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
