import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const GLASSWARE = [
  { id: 'beaker', name: 'Vaso de Precipitados', icon: '🧪', capacity: '250 mL', category: 'volumétrico' },
  { id: 'flask', name: 'Matraz Erlenmeyer', icon: '⚗️', capacity: '500 mL', category: 'volumétrico' },
  { id: 'burette', name: 'Bureta', icon: '💧', capacity: '50 mL', category: 'volumétrico' },
  { id: 'pipette', name: 'Pipeta', icon: '🧫', capacity: '10 mL', category: 'volumétrico' },
  { id: 'tube', name: 'Tubo de Ensayo', icon: '🔬', capacity: '15 mL', category: 'contención' },
  { id: 'funnel', name: 'Embudo', icon: '🔽', capacity: '—', category: 'separación' },
];

const WorkbenchMode = ({ simulator }) => {
  const [bench, setBench] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', ...new Set(GLASSWARE.map(g => g.category))];
  const filtered = activeCategory === 'all' ? GLASSWARE : GLASSWARE.filter(g => g.category === activeCategory);

  const addToBench = (item) => {
    setBench(b => [...b, { ...item, benchId: Date.now() }]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-black text-primary-dark">Banco de Trabajo</h2>

      <div className="flex gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={cn("px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all",
              activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-50 text-text-secondary'
            )}>
            {cat === 'all' ? 'Todo' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {filtered.map(item => (
          <button key={item.id} onClick={() => addToBench(item)}
            className="p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all text-center">
            <span className="text-2xl block mb-1">{item.icon}</span>
            <p className="text-[8px] font-bold text-text-main">{item.name}</p>
            <p className="text-[7px] font-semibold text-text-secondary">{item.capacity}</p>
          </button>
        ))}
      </div>

      <div className="min-h-[120px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 p-4">
        <p className="text-[9px] font-bold text-text-secondary mb-2">Mesada ({bench.length} items)</p>
        {bench.length === 0 ? (
          <p className="text-xs font-semibold text-text-secondary text-center py-6">Arrastra material al área de trabajo</p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {bench.map(item => (
              <div key={item.benchId} className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                <span>{item.icon}</span>
                <span className="text-[9px] font-bold">{item.name}</span>
                <button onClick={() => setBench(b => b.filter(x => x.benchId !== item.benchId))}
                  className="ml-1 text-gray-400 hover:text-red-500 text-[10px]">✕</button>
              </div>
            ))}
            <button onClick={() => setBench([])} className="px-3 py-2 bg-red-50 text-red-500 rounded-xl text-[9px] font-bold">Limpiar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkbenchMode;
