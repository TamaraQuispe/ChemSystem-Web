import React, { useState } from 'react';
import { cn } from '../../../utils/cn';

const EXAMPLES = {
  'Combustión Metano': { left: 'CH₄ + 2O₂', right: 'CO₂ + 2H₂O', atoms: { C: [1, 1], H: [4, 4], O: [4, 4] } },
  'Síntesis Amoniaco': { left: 'N₂ + 3H₂', right: '2NH₃', atoms: { N: [2, 2], H: [6, 6] } },
  'Respiración': { left: 'C₆H₁₂O₆ + 6O₂', right: '6CO₂ + 6H₂O', atoms: { C: [6, 6], H: [12, 12], O: [18, 18] } },
};

const EquationMode = ({ simulator }) => {
  const [example, setExample] = useState(EXAMPLES['Combustión Metano']);

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-black text-primary-dark">Balanceo de Ecuaciones</h2>

      <div className="flex gap-2 flex-wrap">
        {Object.keys(EXAMPLES).map(name => (
          <button key={name} onClick={() => setExample(EXAMPLES[name])}
            className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all",
              example === EXAMPLES[name] ? 'bg-primary text-white' : 'bg-gray-50 text-text-secondary hover:bg-gray-100'
            )}>{name}</button>
        ))}
      </div>

      <div className="p-8 bg-gray-50 rounded-3xl text-center">
        <p className="text-2xl font-black text-primary-dark mb-2">{example.left} → {example.right}</p>
        <p className="text-xs font-bold text-emerald-500">✓ Ecuación balanceada</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-2 font-black text-text-secondary">Átomo</th>
              <th className="pb-2 font-black text-text-secondary">Reactivos</th>
              <th className="pb-2 font-black text-text-secondary">Productos</th>
              <th className="pb-2 font-black text-text-secondary">Balance</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(example.atoms).map(([atom, [l, r]]) => (
              <tr key={atom} className="border-b border-gray-50">
                <td className="py-3 font-black text-text-main">{atom}</td>
                <td className="py-3 font-bold">{l}</td>
                <td className="py-3 font-bold">{r}</td>
                <td className="py-3">
                  <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold",
                    l === r ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500')}>
                    {l === r ? '✓' : '✗'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquationMode;
