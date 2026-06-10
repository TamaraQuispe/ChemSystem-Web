import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const elements = [
  { symbol: 'H', name: 'Hidrógeno', number: 1, mass: 1.008, category: 'nonmetal', x: 1, y: 1 },
  { symbol: 'He', name: 'Helio', number: 2, mass: 4.0026, category: 'noble-gas', x: 18, y: 1 },
  { symbol: 'Li', name: 'Litio', number: 3, mass: 6.94, category: 'alkali-metal', x: 1, y: 2 },
  { symbol: 'Be', name: 'Berilio', number: 4, mass: 9.0122, category: 'alkaline-earth', x: 2, y: 2 },
  { symbol: 'B', name: 'Boro', number: 5, mass: 10.81, category: 'metalloid', x: 13, y: 2 },
  { symbol: 'C', name: 'Carbono', number: 6, mass: 12.011, category: 'nonmetal', x: 14, y: 2 },
  { symbol: 'N', name: 'Nitrógeno', number: 7, mass: 14.007, category: 'nonmetal', x: 15, y: 2 },
  { symbol: 'O', name: 'Oxígeno', number: 8, mass: 15.999, category: 'nonmetal', x: 16, y: 2 },
  { symbol: 'F', name: 'Flúor', number: 9, mass: 18.998, category: 'halogen', x: 17, y: 2 },
  { symbol: 'Ne', name: 'Neón', number: 10, mass: 20.18, category: 'noble-gas', x: 18, y: 2 },
  { symbol: 'Na', name: 'Sodio', number: 11, mass: 22.990, category: 'alkali-metal', x: 1, y: 3 },
  { symbol: 'Mg', name: 'Magnesio', number: 12, mass: 24.305, category: 'alkaline-earth', x: 2, y: 3 },
  { symbol: 'Al', name: 'Aluminio', number: 13, mass: 26.982, category: 'post-transition', x: 13, y: 3 },
  { symbol: 'Si', name: 'Silicio', number: 14, mass: 28.085, category: 'metalloid', x: 14, y: 3 },
  { symbol: 'P', name: 'Fósforo', number: 15, mass: 30.974, category: 'nonmetal', x: 15, y: 3 },
  { symbol: 'S', name: 'Azufre', number: 16, mass: 32.06, category: 'nonmetal', x: 16, y: 3 },
  { symbol: 'Cl', name: 'Cloro', number: 17, mass: 35.45, category: 'halogen', x: 17, y: 3 },
  { symbol: 'Ar', name: 'Argón', number: 18, mass: 39.948, category: 'noble-gas', x: 18, y: 3 },
];

const categoryColors = {
  'nonmetal': 'bg-blue-100 text-blue-800 border-blue-200',
  'noble-gas': 'bg-purple-100 text-purple-800 border-purple-200',
  'alkali-metal': 'bg-red-100 text-red-800 border-red-200',
  'alkaline-earth': 'bg-orange-100 text-orange-800 border-orange-200',
  'metalloid': 'bg-green-100 text-green-800 border-green-200',
  'halogen': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'post-transition': 'bg-teal-100 text-teal-800 border-teal-200',
};

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState(null);

  return (
    <Card className="p-8 border-none bg-white shadow-premium overflow-x-auto">
      <div className="mb-8 flex items-center justify-between min-w-[800px]">
        <div>
          <h3 className="text-2xl font-bold text-text-main">Módulo: Estructura Atómica</h3>
          <p className="text-text-secondary">Haz clic en un elemento para ver su configuración electrónica y propiedades.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl flex items-center gap-2 font-bold">
            <Zap size={18} /> +25 XP por elemento explorado
          </div>
        </div>
      </div>

      <div className="grid grid-cols-18 gap-2 min-w-[1000px] relative">
        {elements.map((el) => (
          <motion.div
            key={el.number}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            onClick={() => setSelectedElement(el)}
            style={{ gridColumn: el.x, gridRow: el.y }}
            className={cn(
              "aspect-square p-2 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center transition-all duration-200",
              categoryColors[el.category],
              selectedElement?.number === el.number ? "ring-4 ring-primary ring-offset-2" : ""
            )}
          >
            <span className="text-[10px] self-start font-bold">{el.number}</span>
            <span className="text-xl font-black">{el.symbol}</span>
            <span className="text-[8px] font-medium truncate w-full text-center">{el.name}</span>
          </motion.div>
        ))}

        {/* Legend */}
        <div className="mt-12 grid grid-cols-4 gap-4 col-span-18">
          {Object.entries(categoryColors).slice(0, 4).map(([cat, style]) => (
            <div key={cat} className="flex items-center gap-2">
              <div className={cn("w-4 h-4 rounded border", style)} />
              <span className="text-xs text-text-secondary capitalize">{cat.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal/Overlay */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-24 right-12 w-80 glass-card p-6 z-50 border-primary/20 shadow-2xl"
          >
            <button 
              onClick={() => setSelectedElement(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-4", categoryColors[selectedElement.category])}>
              {selectedElement.symbol}
            </div>
            <h4 className="text-xl font-bold text-text-main">{selectedElement.name}</h4>
            <p className="text-sm text-text-secondary mb-6">{selectedElement.category.replace('-', ' ')}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Número Atómico</span>
                <span className="font-bold">{selectedElement.number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Masa Atómica</span>
                <span className="font-bold">{selectedElement.mass} u</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Configuración</span>
                <span className="font-mono text-xs font-bold text-primary">1s² 2s² 2p⁶...</span>
              </div>
            </div>

            <Button className="w-full gap-2">
              Ver Laboratorio 3D <Info size={16} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default PeriodicTable;
