import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const FLAME_COLORS = [
  { salt: 'Cloruro de Sodio', formula: 'NaCl', color: 'from-yellow-300 to-orange-400', name: 'Amarillo/Naranja' },
  { salt: 'Cloruro de Potasio', formula: 'KCl', color: 'from-violet-300 to-pink-400', name: 'Violeta' },
  { salt: 'Cloruro de Cobre (II)', formula: 'CuCl₂', color: 'from-green-300 to-emerald-500', name: 'Verde' },
  { salt: 'Cloruro de Estroncio', formula: 'SrCl₂', color: 'from-red-400 to-red-600', name: 'Rojo' },
  { salt: 'Cloruro de Bario', formula: 'BaCl₂', color: 'from-yellow-200 to-lime-300', name: 'Amarillo Verdoso' },
  { salt: 'Cloruro de Calcio', formula: 'CaCl₂', color: 'from-orange-300 to-red-400', name: 'Naranja/Rojo' },
];

const ExplorerMode = ({ simulator }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-black text-primary-dark">Ensayo a la Llama</h2>
      <p className="text-[10px] font-semibold text-text-secondary">Cada sal metálica produce un color característico al calentarse.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {FLAME_COLORS.map(salt => (
          <button key={salt.formula} onClick={() => setSelected(salt)}
            className={cn("p-4 rounded-2xl border-2 text-center transition-all hover:scale-105",
              selected?.formula === salt.formula ? 'border-primary shadow-md' : 'border-gray-100'
            )}>
            <div className={cn("h-16 rounded-xl mb-2 bg-gradient-to-b", salt.color)} />
            <p className="text-xs font-black text-primary-dark">{salt.salt}</p>
            <p className="text-[9px] font-semibold text-text-secondary">{salt.formula}</p>
          </button>
        ))}
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-b", selected.color)} />
            <div>
              <p className="text-sm font-black text-primary-dark">{selected.salt}</p>
              <p className="text-[10px] font-bold text-text-secondary">{selected.formula}</p>
              <p className="text-[10px] font-semibold text-text-secondary mt-1">Color: {selected.name}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExplorerMode;
