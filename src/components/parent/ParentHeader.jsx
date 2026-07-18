import React, { useState, useEffect, useRef } from 'react';
import { Bell, Heart, ChevronDown, Menu, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useParentStore } from '../../store/parentStore';
import { cn } from '../../utils/cn';

const ParentHeader = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const { children, selectedChild, setSelectedChild, unreadCount, fetchUnreadCount } = useParentStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-24 px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl border border-gray-200 text-primary-dark hover:bg-gray-50 transition-all cursor-pointer shrink-0"
        >
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-primary-dark hover:bg-gray-100 transition-all"
            >
              <User size={14} />
              <span className="hidden sm:inline truncate max-w-[100px]">{selectedChild?.name || 'Seleccionar hijo'}</span>
              <ChevronDown size={14} className={cn("transition-transform", showDropdown && "rotate-180")} />
            </button>
            {showDropdown && (
              <div className="absolute top-12 right-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <p className="px-4 py-2 text-[9px] font-bold text-text-secondary uppercase tracking-wider border-b border-gray-50">Seleccionar hijo</p>
                {children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => { setSelectedChild(child); setShowDropdown(false); }}
                    className={cn(
                      "w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-all",
                      selectedChild?.id === child.id && "bg-secondary/10"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden">
                      <img src={child.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${child.name}`} alt={child.name} className="w-full h-full object-cover" />
                    </div>
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

        <button className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all relative">
          <Bell size={22} />
          {unreadCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[7px] text-white font-black">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
          )}
        </button>

        <div className="w-px h-8 bg-gray-200" />

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-primary-dark leading-none mb-1">{user?.name || 'Padre de Familia'}</p>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Familia</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-200 border-2 border-white shadow-md overflow-hidden shrink-0">
            <img
              src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Parent'}
              alt={user?.name || 'Parent'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ParentHeader;
