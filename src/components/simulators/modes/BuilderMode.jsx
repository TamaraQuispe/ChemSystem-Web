import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const ATOMS = [
  { sym: 'H', name: 'Hidrógeno', color: 'bg-blue-200 text-blue-700', bonds: 1 },
  { sym: 'O', name: 'Oxígeno', color: 'bg-red-200 text-red-700', bonds: 2 },
  { sym: 'C', name: 'Carbono', color: 'bg-gray-200 text-gray-700', bonds: 4 },
  { sym: 'N', name: 'Nitrógeno', color: 'bg-blue-300 text-blue-700', bonds: 3 },
  { sym: 'Cl', name: 'Cloro', color: 'bg-green-200 text-green-700', bonds: 1 },
  { sym: 'Na', name: 'Sodio', color: 'bg-purple-200 text-purple-700', bonds: 1 },
];

const BuilderMode = ({ simulator }) => {
  const [selected, setSelected] = useState(null);
  const [molecule, setMolecule] = useState([]);

  const addAtom = (atom) => {
    setMolecule(m => [...m, { ...atom, id: Date.now() }]);
  };

  const formula = molecule.reduce((acc, a) => {
    acc[a.sym] = (acc[a.sym] || 0) + 1;
    return acc;
  }, {});

  const formulaStr = Object.entries(formula).map(([sym, count]) => sym + (count > 1 ? count : '')).join('');

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-black text-primary-dark">Constructor Molecular</h2>

      <div className="flex gap-2 flex-wrap">
        {ATOMS.map(atom => (
          <button key={atom.sym} onClick={() => addAtom(atom)}
            className={cn("px-4 py-2 rounded-xl border border-gray-200 hover:border-primary transition-all text-xs font-bold", atom.color)}>
            {atom.sym} · {atom.name}
          </button>
        ))}
        <button onClick={() => setMolecule([])} className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold">
          Limpiar
        </button>
      </div>

      <div className="min-h-[180px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 p-6 flex items-center justify-center">
        {molecule.length === 0 ? (
          <p className="text-xs font-bold text-text-secondary">Selecciona átomos para construir una molécula</p>
        ) : (
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {molecule.map((a, i) => (
              <motion.div key={a.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black shadow-sm", a.color)}>
                {a.sym}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {molecule.length > 0 && (
        <div className="p-4 bg-primary/5 rounded-2xl text-center">
          <p className="text-sm font-bold text-text-secondary mb-1">Fórmula molecular:</p>
          <p className="text-2xl font-black text-primary-dark">{formulaStr}</p>
        </div>
      )}
    </div>
  );
};

export default BuilderMode;
