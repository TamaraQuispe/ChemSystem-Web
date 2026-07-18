import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Gauge, Lightbulb, RotateCcw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const PHASE_DATA = [
  { temp: -30, press: 1, state: 'solid', label: 'Sólido', color: 'bg-blue-100 text-blue-700', particleSize: 10, particleSpeed: 0.2 },
  { temp: 25, press: 1, state: 'liquid', label: 'Líquido', color: 'bg-cyan-100 text-cyan-700', particleSize: 7, particleSpeed: 1.5 },
  { temp: 100, press: 1, state: 'gas', label: 'Gaseoso', color: 'bg-amber-100 text-amber-700', particleSize: 4, particleSpeed: 4 },
  { temp: 120, press: 3, state: 'supercritical', label: 'Supercrítico', color: 'bg-violet-100 text-violet-700', particleSize: 3, particleSpeed: 6 },
];

const MatterStatesAI = ({ state }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-2xl border border-orange-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-orange-500" /><span className="text-xs font-black text-orange-700">Termodinámica IA</span></div>
      {state === 'solid' && <p className="text-[10px] font-semibold text-orange-600/80">Las partículas vibran en posiciones fijas. Fuerzas intermoleculares fuertes mantienen la estructura cristalina.</p>}
      {state === 'liquid' && <p className="text-[10px] font-semibold text-orange-600/80">Las partículas se deslizan unas sobre otras. El líquido adopta la forma del recipiente pero mantiene volumen constante.</p>}
      {state === 'gas' && <p className="text-[10px] font-semibold text-orange-600/80">Las partículas se mueven libremente a altas velocidades. Ocupan todo el volumen disponible.</p>}
      {state === 'supercritical' && <p className="text-[10px] font-semibold text-orange-600/80">Estado supercrítico: ni líquido ni gas. Propiedades únicas: difunde como gas pero disuelve como líquido.</p>}
    </div>
  );
};

const MatterStatesPage = () => {
  const [step, setStep] = useState('intro');
  const [temperature, setTemperature] = useState(25);
  const [pressure, setPressure] = useState(1);
  const [particles, setParticles] = useState([]);

  const currentState = temperature < 0 ? 'solid' : temperature < 100 ? 'liquid' : pressure > 2 ? 'supercritical' : 'gas';
  const stateInfo = PHASE_DATA.find(p => p.state === currentState) || PHASE_DATA[1];

  useEffect(() => {
    const count = currentState === 'solid' ? 25 : currentState === 'liquid' ? 35 : 50;
    const newP = Array.from({ length: count }, (_, i) => ({
      id: i, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10,
      vx: (Math.random() - 0.5) * stateInfo.particleSpeed,
      vy: (Math.random() - 0.5) * stateInfo.particleSpeed,
    }));
    setParticles(newP);
  }, [currentState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        let nx = p.x + p.vx, ny = p.y + p.vy;
        if (nx < 3 || nx > 97) { nx = Math.max(3, Math.min(97, nx)); p.vx *= -1; }
        if (ny < 3 || ny > 97) { ny = Math.max(3, Math.min(97, ny)); p.vy *= -1; }
        return { ...p, x: nx, y: ny };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [particles.length]);

  const stateColor = currentState === 'solid' ? '#005B8F' : currentState === 'liquid' ? '#06B6D4' : currentState === 'gas' ? '#F59E0B' : '#8B3DFF';

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Thermometer size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Estados de la Materia</h1>
            <p className="text-text-secondary font-semibold mb-2">Observa cómo cambia el estado de la materia al variar temperatura y presión.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-primary-dark">Simulación Molecular</h2>
                    <span className={cn("px-4 py-1.5 rounded-xl text-[9px] font-bold", stateInfo.color)}>{stateInfo.label}</span>
                  </div>
                  <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden border border-gray-200">
                    {particles.map(p => (
                      <motion.div key={p.id}
                        animate={{ x: `${p.x}%`, y: `${p.y}%` }}
                        transition={{ duration: 0.05, ease: 'linear' }}
                        className="absolute rounded-full"
                        style={{
                          width: stateInfo.particleSize,
                          height: stateInfo.particleSize,
                          backgroundColor: stateColor,
                          opacity: currentState === 'gas' ? 0.5 : currentState === 'supercritical' ? 0.4 : 0.85,
                        }}
                      />
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Diagrama de Fases</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {PHASE_DATA.map(p => (
                      <div key={p.state} className={cn("p-4 rounded-2xl border-2 text-center",
                        currentState === p.state ? 'border-primary bg-primary/5' : 'border-gray-100'
                      )}>
                        <div className="flex items-center gap-2 mb-2 justify-center">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.state === 'solid' ? '#005B8F' : p.state === 'liquid' ? '#06B6D4' : p.state === 'gas' ? '#F59E0B' : '#8B3DFF' }} />
                          <span className="text-xs font-black">{p.label}</span>
                        </div>
                        <p className="text-[8px] font-bold text-text-secondary">{p.temp}°C · {p.press} atm</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between mb-2"><span className="text-[9px] font-bold"><Thermometer size={12} className="inline" /> Temperatura</span><span className="text-xs font-black">{temperature}°C</span></div>
                  <input type="range" min="-50" max="150" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full accent-primary" />
                  <div className="flex justify-between text-[8px] font-bold text-text-secondary mt-1"><span>Sólido</span><span>Líquido</span><span>Gas</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-2"><span className="text-[9px] font-bold"><Gauge size={12} className="inline" /> Presión</span><span className="text-xs font-black">{pressure} atm</span></div>
                  <input type="range" min="0.5" max="5" step="0.1" value={pressure} onChange={e => setPressure(Number(e.target.value))} className="w-full accent-primary" />
                </div>

                <MatterStatesAI state={currentState} />
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatterStatesPage;
