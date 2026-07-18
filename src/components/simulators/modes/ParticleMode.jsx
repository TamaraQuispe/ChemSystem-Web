import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Gauge } from 'lucide-react';
import { Slider } from '../../ui/Slider';

const ParticleMode = ({ simulator }) => {
  const [temperature, setTemperature] = useState(0);
  const [particles, setParticles] = useState([]);

  const state = temperature < -20 ? 'Sólido' : temperature < 80 ? 'Líquido' : 'Gas';

  useEffect(() => {
    const count = state === 'Sólido' ? 20 : state === 'Líquido' ? 30 : 40;
    const speed = state === 'Sólido' ? 0.3 : state === 'Líquido' ? 1.5 : 4;
    const newP = Array.from({ length: count }, (_, i) => ({
      id: i, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10,
      vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed,
    }));
    setParticles(newP);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        let nx = p.x + p.vx;
        let ny = p.y + p.vy;
        if (nx < 5 || nx > 95) { nx = Math.max(5, Math.min(95, nx)); p.vx *= -1; }
        if (ny < 5 || ny > 95) { ny = Math.max(5, Math.min(95, ny)); p.vy *= -1; }
        return { ...p, x: nx, y: ny };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [temperature, state]);

  const size = state === 'Sólido' ? 8 : state === 'Líquido' ? 6 : 4;
  const color = state === 'Sólido' ? '#005B8F' : state === 'Líquido' ? '#78F0C4' : '#F59E0B';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-primary-dark">Estados de la Materia</h2>
        <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold">{state}</span>
      </div>

      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden border border-gray-200">
        {particles.map(p => (
          <motion.div key={p.id}
            animate={{ x: p.x + '%', y: p.y + '%' }}
            transition={{ duration: 0.05, ease: 'linear' }}
            className="absolute rounded-full"
            style={{ width: size, height: size, backgroundColor: color, opacity: state === 'Gas' ? 0.6 : 0.9 }}
          />
        ))}
        <div className="absolute bottom-4 left-4 text-[9px] font-bold text-text-secondary">
          {particles.length} partículas · {state === 'Sólido' ? 'Estructura cristalina' : state === 'Líquido' ? 'Movimiento libre' : 'Alta energía cinética'}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-text-secondary"><Thermometer size={14} className="inline" /> Temperatura</span><span className="text-sm font-black text-primary-dark">{temperature}°C</span></div>
        <Slider min={-50} max={150} value={temperature} onChange={setTemperature} />
        <div className="flex justify-between text-[9px] font-bold text-text-secondary mt-1"><span>Sólido</span><span>Líquido</span><span>Gaseoso</span></div>
      </div>
    </div>
  );
};

export default ParticleMode;
