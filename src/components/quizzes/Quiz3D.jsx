import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, Zap, Target, MousePointer2 } from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

const options = [
  { id: 'O', label: 'Oxígeno', sub: 'Z=8 • Grupo 16', icon: 'O' },
  { id: 'F', label: 'Flúor', sub: 'Z=9 • Grupo 17', icon: 'F' },
  { id: 'Cl', label: 'Cloro', sub: 'Z=17 • Grupo 17', icon: 'Cl' },
  { id: 'Fr', label: 'Francio', sub: 'Z=87 • Grupo 1', icon: 'Fr' },
];

export const Quiz3D = () => {
  const [selected, setSelected] = useState(null);
  const { quiz, updateQuiz } = useModuleStore();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      {/* Left Column: Question & Options */}
      <div className="xl:col-span-7 space-y-12">
        <div className="space-y-6">
          <Badge variant="primary" className="bg-primary/5 text-primary-dark flex w-fit items-center gap-2 px-4 py-2">
            <Zap size={14} className="text-primary" />
            DIFICULTAD INTERMEDIA
          </Badge>
          
          <h2 className="text-5xl font-black text-text-main leading-[1.1] tracking-tight">
            ¿Cuál de los siguientes elementos presenta la <span className="text-primary underline decoration-primary/30 decoration-8 underline-offset-8">mayor electronegatividad</span> según la escala de Pauling?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(option.id)}
              className={cn(
                "group relative p-6 text-left rounded-3xl border-2 transition-all duration-300",
                selected === option.id 
                  ? "bg-primary border-primary shadow-xl shadow-primary/30 ring-4 ring-primary/10" 
                  : "bg-white border-gray-100 hover:border-primary/30 hover:shadow-premium"
              )}
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-colors",
                  selected === option.id ? "bg-white/20 text-white" : "bg-gray-100 text-text-main"
                )}>
                  {option.id}
                </div>
                <div className="flex-grow">
                  <h3 className={cn(
                    "text-xl font-bold transition-colors",
                    selected === option.id ? "text-white" : "text-text-main"
                  )}>
                    {option.label}
                  </h3>
                  <p className={cn(
                    "text-xs transition-colors",
                    selected === option.id ? "text-white/70" : "text-text-secondary"
                  )}>
                    {option.sub}
                  </p>
                  <div className="flex gap-1 mt-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", selected === option.id ? "bg-white/40" : "bg-gray-200")} />
                    <div className={cn("w-1.5 h-1.5 rounded-full", selected === option.id ? "bg-white/40" : "bg-gray-200")} />
                  </div>
                </div>
                {selected === option.id && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-primary"
                  >
                    <Target size={14} />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right Column: 3D Lab Simulation Mock */}
      <div className="xl:col-span-5 h-[700px] sticky top-8">
        <Card className="h-full bg-gray-950 border-white/5 shadow-3xl overflow-hidden relative group">
          {/* Lab Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
          
          {/* Header UI */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Laboratorio Virtual 3D</span>
            </div>
            <div className="p-1 rounded-md hover:bg-white/5 text-white/30 cursor-pointer">
              <MousePointer2 size={16} />
            </div>
          </div>

          <div className="absolute top-16 right-6 z-10">
            <Badge variant="primary" className="bg-primary/20 border-primary/30 text-[9px]">
              RENDERIZADO EN TIEMPO REAL
            </Badge>
          </div>

          {/* Central 3D Asset Mock */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-150 animate-pulse" />
              
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotateY: [0, 10, -10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                {/* Simulated 3D Laboratory Flask/Asset */}
                <img 
                  src="https://images.unsplash.com/photo-1532187875302-1df92fa1f417?q=80&w=2070&auto=format&fit=crop" 
                  alt="3D Molecular Model"
                  className="w-72 h-72 object-cover rounded-3xl shadow-2xl border border-white/10"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay" />
              </motion.div>

              {/* Particle Effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -100],
                    x: [0, (i - 4) * 20],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute bottom-0 left-1/2 w-1 h-1 bg-secondary rounded-full blur-[1px]"
                />
              ))}
            </div>
          </div>

          {/* Information Panels Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
            <div className="glass-card bg-white/5 border-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-3 text-primary">
                <HelpCircle size={18} />
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Observación de Cristal</h4>
              </div>
              <p className="text-xs text-white/60 leading-relaxed italic">
                El <span className="text-secondary font-bold">Flúor</span> tiene un radio atómico muy pequeño, lo que genera una fuerza nuclear efectiva muy intensa sobre electrones compartidos.
              </p>
            </div>

            <div className="glass-card bg-black/40 border-white/5 p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center text-[9px] font-black text-white/40 uppercase tracking-widest">
                <span>Tendencias Periódicas</span>
                <HelpCircle size={12} />
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              <p className="text-[9px] text-white/30 italic text-center">
                La electronegatividad aumenta hacia el Flúor (arriba y derecha)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
