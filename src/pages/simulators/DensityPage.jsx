import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Beaker, Weight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const OBJECTS = [
  { name: 'Cubo de Aluminio', mass: 27, volume: 10, density: 2.7, color: 'bg-slate-200' },
  { name: 'Cubo de Hierro', mass: 78.7, volume: 10, density: 7.87, color: 'bg-gray-400' },
  { name: 'Cubo de Plomo', mass: 113.4, volume: 10, density: 11.34, color: 'bg-gray-600' },
  { name: 'Cubo de Madera', mass: 7, volume: 10, density: 0.7, color: 'bg-amber-200' },
  { name: 'Cubo de Hielo', mass: 9.2, volume: 10, density: 0.92, color: 'bg-blue-100' },
  { name: 'Cubo de Oro', mass: 193, volume: 10, density: 19.3, color: 'bg-yellow-300' },
];

const DensityAI = ({ object, waterVolume }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-2xl border border-sky-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-sky-500" /><span className="text-xs font-black text-sky-700">Analista de Densidad</span></div>
      {object && (
        <>
          <p className="text-[10px] font-semibold text-sky-600/80">{object.name}</p>
          <p className="text-[10px] font-semibold text-sky-600/80">Masa: {object.mass}g · Volumen: {waterVolume}mL · Densidad: <strong>{object.density} g/cm³</strong></p>
          {object.density > 1
            ? <p className="text-[10px] font-bold text-blue-500">El objeto se hunde (ρ &gt; 1 g/cm³, más denso que el agua).</p>
            : <p className="text-[10px] font-bold text-emerald-500">El objeto flota (ρ &lt; 1 g/cm³, menos denso que el agua).</p>
          }
        </>
      )}
    </div>
  );
};

const DensityPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);
  const [waterLevel, setWaterLevel] = useState(50);

  const baseWater = 50;
  const displacedVolume = selected ? selected.volume : 0;
  const totalVolume = baseWater + displacedVolume;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Weight size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Laboratorio de Densidad</h1>
            <p className="text-text-secondary font-semibold mb-2">Sumerge objetos en agua, mide el volumen desplazado y calcula su densidad.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Probeta</h2>
                  <div className="relative h-64 bg-gradient-to-b from-transparent via-blue-50 to-blue-100 rounded-3xl border-2 border-gray-200 overflow-hidden">
                    <div className="absolute bottom-0 left-4 right-4 bg-gradient-to-t from-blue-300 to-blue-200/60 rounded-b-2xl"
                      style={{ height: `${(totalVolume / 100) * 80}%`, transition: 'height 0.5s ease' }} />
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-2">
                      <span className="bg-white/80 px-2 py-0.5 rounded text-[9px] font-bold">{totalVolume} mL</span>
                    </div>
                    {selected && (
                      <motion.div initial={{ y: -20 }} animate={{ y: `${80 - (totalVolume / 100) * 80 + 10}%` }}
                        className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-lg flex items-center justify-center text-[8px] font-black shadow-md border border-white/50"
                        style={{ backgroundColor: selected.color }}>
                        {selected.name.split(' ')[1]}
                      </motion.div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Objetos</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {OBJECTS.map(obj => (
                      <button key={obj.name} onClick={() => setSelected(obj)}
                        className={cn("p-3 rounded-2xl border-2 text-center transition-all",
                          selected?.name === obj.name ? 'border-primary shadow-md' : 'border-gray-100'
                        )}>
                        <div className={cn("w-10 h-10 rounded-xl mx-auto mb-1 flex items-center justify-center text-[8px] font-black", obj.color)}>
                          {obj.mass}g
                        </div>
                        <p className="text-[8px] font-bold">{obj.name.split(' ')[2] || obj.name.split(' ')[1]}</p>
                        <p className="text-[7px] text-text-secondary">{obj.density} g/cm³</p>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-6 space-y-4">
                <h2 className="text-sm font-black text-primary-dark">Datos</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-[8px] font-bold text-text-secondary">Masa</p><p className="text-sm font-black">{selected?.mass || '—'} g</p></div>
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-[8px] font-bold text-text-secondary">Vol. inicial</p><p className="text-sm font-black">{baseWater} mL</p></div>
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-[8px] font-bold text-text-secondary">Vol. final</p><p className="text-sm font-black">{totalVolume} mL</p></div>
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-[8px] font-bold text-text-secondary">Vol. desplazado</p><p className="text-sm font-black">{displacedVolume} mL</p></div>
                </div>

                <DensityAI object={selected} waterVolume={displacedVolume} />
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DensityPage;
