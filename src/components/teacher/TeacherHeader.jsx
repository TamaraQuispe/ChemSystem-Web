import React from 'react';
import { Bell, Search, Settings, User, FlaskConical } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../ui/Badge';

const TeacherHeader = ({ showSearch = false }) => {
  const { user } = useAuthStore();

  return (
    <header className="h-24 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
      {/* Search or Title */}
      <div className="flex-grow max-w-2xl">
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Explorar laboratorio, recursos..." 
              className="w-full h-12 pl-14 pr-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
            />
          </div>
        ) : (
          <div className="flex gap-8 items-center">
             <span className="text-sm font-bold text-text-secondary hover:text-primary cursor-pointer transition-colors">Explorar</span>
             <span className="text-sm font-bold text-primary underline decoration-2 underline-offset-8 cursor-pointer">Laboratorio</span>
             <span className="text-sm font-bold text-text-secondary hover:text-primary cursor-pointer transition-colors">Recursos</span>
          </div>
        )}
      </div>

      {/* Actions & User */}
      <div className="flex items-center gap-6">
        <button className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all relative">
          <Bell size={22} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <button className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
          <Settings size={22} />
        </button>

        <div className="w-px h-8 bg-gray-200 mx-2" />

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-black text-primary-dark leading-none mb-1">{user?.name || 'Docente'}</p>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Laboratorio de Cristal</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-200 border-2 border-white shadow-md overflow-hidden">
            <img 
              src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'} 
              alt={user?.name || 'Teacher'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;
