import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Zap, Droplets, Info } from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

const Ion = ({ type, delay }) => {
  const isCation = type === 'cation';
  return (
    <motion.div
      initial={{ opacity: 0, x: isCation ? 100 : -100, y: Math.random() * 200 + 100 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        x: isCation ? -100 : 100,
        y: [Math.random() * 200 + 100, Math.random() * 200 + 100],
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        delay,
        ease: "linear"
      }}
      className={`absolute w-3 h-3 rounded-full blur-[1px] flex items-center justify-center text-[8px] font-bold text-white shadow-lg ${
        isCation ? 'bg-primary' : 'bg-secondary'
      }`}
    >
      {isCation ? '+' : '-'}
    </motion.div>
  );
};

export const ElectrolysisSimulator = () => {
  const { electrolysis, setElectrolysis } = useModuleStore();
  const [ions, setIons] = useState([]);

  useEffect(() => {
    if (electrolysis.isActive) {
      const newIons = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        type: i % 2 === 0 ? 'cation' : 'anion',
        delay: Math.random() * 3
      }));
      setIons(newIons);
    } else {
      setIons([]);
    }
  }, [electrolysis.isActive]);

  return (
    <div className="space-y-8">
      {/* Main Simulator Area */}
      <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900 to-primary-dark border border-white/10 shadow-2xl">
        {/* Background Visuals */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Electrodes */}
        <div className="absolute inset-0 flex justify-between px-32 items-center">
          {/* Anode */}
          <div className="relative">
            <Badge variant="success" className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
              ÁNODO (+)
            </Badge>
            <motion.div 
              animate={{ height: [250, 255, 250] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-4 h-64 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full shadow-xl relative"
            >
              <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full" />
            </motion.div>
          </div>

          {/* Cathode */}
          <div className="relative">
            <Badge variant="accent" className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
              CÁTODO (-)
            </Badge>
            <motion.div 
              animate={{ height: [250, 245, 250] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="w-4 h-64 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full shadow-xl relative"
            >
              <div className="absolute inset-0 bg-accent/20 animate-pulse rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Flask / Solution Visual */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-primary/10 backdrop-blur-md rounded-t-[100px] border-t border-x border-white/20">
          {/* Water Surface */}
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-0 w-full h-4 bg-primary/20 blur-sm"
          />
          
          {/* Animated Ions */}
          <div className="relative w-full h-full overflow-hidden">
            {ions.map((ion) => (
              <Ion key={ion.id} type={ion.type} delay={ion.delay} />
            ))}
          </div>
        </div>

        {/* Overlay UI */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
          <div className="glass-card p-6 max-w-sm">
            <h3 className="text-white font-bold text-lg mb-2">Simulador Activo</h3>
            <p className="text-white/60 text-sm mb-4">
              Controla el voltaje y la concentración de NaCl para observar la velocidad de desprendimiento gaseoso.
            </p>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: electrolysis.isActive ? '100%' : '0%' }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-full bg-secondary"
              />
            </div>
          </div>

          <Button 
            onClick={() => setElectrolysis({ isActive: !electrolysis.isActive })}
            variant={electrolysis.isActive ? 'outline' : 'primary'}
            className="h-16 px-10 gap-3 text-lg group"
          >
            {electrolysis.isActive ? <RotateCcw /> : <Play fill="currentColor" />}
            {electrolysis.isActive ? 'Reiniciar' : 'Probar simulación'}
          </Button>
        </div>
      </div>

      {/* Control Panel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-3xl font-bold text-text-main">Panel de Control</h2>
            <Badge variant="accent">Simplificado</Badge>
          </div>
          <p className="text-text-secondary max-w-xl">
            Hemos diseñado una interfaz de simulación sin distracciones. Enfócate en las variables clave que realmente alteran el resultado químico.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <Card className="p-6 bg-white border-none shadow-premium hover:shadow-2xl transition-shadow group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Voltaje</p>
                  <p className="text-2xl font-bold text-text-main">{electrolysis.voltage} V</p>
                </div>
              </div>
              <Slider 
                value={electrolysis.voltage} 
                min={0} 
                max={30} 
                step={0.5} 
                onChange={(v) => setElectrolysis({ voltage: v })} 
              />
            </Card>

            <Card className="p-6 bg-white border-none shadow-premium hover:shadow-2xl transition-shadow group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-secondary/10 text-primary group-hover:bg-secondary group-hover:text-primary transition-colors">
                  <Droplets size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Concentración</p>
                  <p className="text-2xl font-bold text-text-main">{electrolysis.concentration} M</p>
                </div>
              </div>
              <Slider 
                value={electrolysis.concentration} 
                min={0} 
                max={2} 
                step={0.1} 
                onChange={(c) => setElectrolysis({ concentration: c })} 
              />
            </Card>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-3xl">
          <img 
            src="https://images.unsplash.com/photo-1532187875302-1df92fa1f417?q=80&w=2070&auto=format&fit=crop" 
            alt="Interface Preview"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center p-8 text-center">
            <div className="glass-card p-4">
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-2">Vista previa de interfaz</p>
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-4 bg-white/30 rounded-full" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
