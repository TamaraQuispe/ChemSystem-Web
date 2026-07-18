import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FlaskConical, 
  BookOpen, 
  Users, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Zap,
  Sparkles,
  Settings,
  Activity,
  BrainCircuit
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const teacherMenuItems = [
  { icon: LayoutDashboard, label: 'Panel Principal', path: '/teacher/dashboard' },
  { icon: BookOpen, label: 'Calificaciones', path: '/teacher/grades' },
  { icon: Activity, label: 'Monitoreo', path: '/teacher/monitoring' },
  { icon: BrainCircuit, label: 'Análisis Predictivo', path: '/teacher/predictive' },
  { icon: Users, label: 'Comunidad', path: '/teacher/community' },
  { icon: Settings, label: 'Configuración', path: '/teacher/settings' },
];

const TeacherSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const expanded = !isCollapsed;

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
        <div className="min-w-[40px] h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0">
          <FlaskConical size={24} />
        </div>
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          expanded ? "w-auto opacity-100" : "w-0 opacity-0"
        )}>
          <span className="text-xl font-black text-primary-dark tracking-tighter block leading-none whitespace-nowrap">ChemSystem</span>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest whitespace-nowrap">Laboratorio Digital</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden",
        expanded ? "space-y-1 px-3 py-4" : "space-y-2 px-0 py-4"
      )}>
        {teacherMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
              "font-bold text-sm overflow-hidden transition-all duration-300 whitespace-nowrap",
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
          <Button onClick={() => window.location.href = '/teacher/new-practice'} className="w-full h-11 bg-primary-dark text-white rounded-2xl shadow-xl shadow-primary/20 gap-3 font-bold active:scale-95 transition-all text-sm">
            <Plus size={20} /> Nueva Práctica
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
          onClick={() => window.open('https://chemsystem.edu/ayuda', '_blank')}
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
    </aside>
  );
};

export default TeacherSidebar;
