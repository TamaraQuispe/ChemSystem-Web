import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw, ChevronDown, CheckCircle } from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const MolecularBuilder = () => {
  const { molecular, setMolecular } = useModuleStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Central Molecular Visualization */}
      <div className="relative aspect-square flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-primary/5 rounded-[4rem] -rotate-3 blur-3xl" />
        <Card className="w-full max-w-lg aspect-square p-12 border-none shadow-premium rounded-[3rem] relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 flex flex-col items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="relative z-10"
          >
            <div className="w-64 h-64 rounded-2xl shadow-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-48 h-48 text-primary-dark/30">
                <circle cx="50" cy="30" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="25" cy="70" r="8" fill="currentColor" opacity="0.4" />
                <circle cx="75" cy="70" r="8" fill="currentColor" opacity="0.5" />
                <line x1="50" y1="38" x2="25" y2="62" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                <line x1="50" y1="38" x2="75" y2="62" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                <line x1="33" y1="70" x2="67" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>
            {/* Connection Lines (CSS) */}
            <div className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
          </motion.div>
          
          <div className="mt-12 text-center space-y-4 relative z-10">
            <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
              Diagrama Activo
            </div>
            <p className="text-lg font-bold text-text-main italic">
              H₂SO₄ <span className="text-text-secondary font-medium">en formación molecular</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Configuration Panel */}
      <div className="space-y-8">
        <Card className="p-10 border-none shadow-premium rounded-[2.5rem] bg-white relative">
          <p className="text-primary font-black text-sm mb-2">Paso 4 de 6</p>
          <h2 className="text-3xl font-black text-text-main leading-tight mb-8">
            Configuración de los orbitales de enlace
          </h2>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Selecciona el tipo de enlace</label>
              <div className="relative group">
                <select 
                  className="w-full h-16 px-6 bg-gray-50 border-gray-100 rounded-2xl text-text-main font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all"
                  value={molecular.selectedBond}
                  onChange={(e) => setMolecular({ selectedBond: e.target.value })}
                >
                  <option>Enlace Covalente Simple</option>
                  <option>Enlace Covalente Doble</option>
                  <option>Enlace Covalente Coordinado</option>
                  <option>Enlace Iónico</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none group-hover:text-primary transition-colors" size={20} />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={40} />
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center text-accent shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-xs text-accent font-bold leading-relaxed">
                    Dato curioso: El azufre puede expandir su octeto para formar hasta seis enlaces en condiciones específicas.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={() => setMolecular({ isVerified: true })}
                className="flex-grow h-16 rounded-2xl text-lg gap-3"
              >
                Verificar Paso <ArrowRight size={20} />
              </Button>
              <Button 
                variant="secondary" 
                className="w-16 h-16 rounded-2xl p-0 flex items-center justify-center bg-secondary/30 text-primary border-none shadow-none hover:bg-secondary/50"
              >
                <RotateCcw size={24} />
              </Button>
            </div>
          </div>
        </Card>

        {molecular.isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-6 bg-green-50 border border-green-100 rounded-3xl"
          >
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-green-800">¡Paso verificado!</p>
              <p className="text-xs text-green-600">Has configurado correctamente los orbitales híbridos sp³d².</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
