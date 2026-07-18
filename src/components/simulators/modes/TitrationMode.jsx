import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Droplet, FlaskConical } from 'lucide-react';
import { Slider } from '../../ui/Slider';
import { cn } from '../../../utils/cn';

const TitrationMode = ({ simulator }) => {
  const [acidConc, setAcidConc] = useState(0.1);
  const [baseConc, setBaseConc] = useState(0.1);
  const [volume, setVolume] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const pH = volume < 10 ? 1 + Math.log10(1 / acidConc) : volume === 10 ? 7 : 14 - Math.log10(1 / baseConc);
  const isEquivalence = Math.abs(volume - 10) < 0.5;

  const titrationData = Array.from({ length: 21 }, (_, i) => ({
    vol: (i * 1).toFixed(1),
    pH: i < 10 ? 1 + Math.log10(1 / acidConc) + i * 0.6 : i === 10 ? 7 : 14 - Math.log10(1 / baseConc) - (i - 10) * 0.6,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-primary-dark">Valoración Ácido-Base</h2>
        <span className={cn("px-4 py-2 rounded-xl text-xs font-bold", isEquivalence ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-text-secondary')}>
          pH: {pH.toFixed(1)} {isEquivalence && '⚖ Punto de Equivalencia'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative h-48 bg-gradient-to-b from-blue-100 to-blue-50 rounded-3xl border border-blue-200 flex items-center justify-center overflow-hidden">
            <div className="text-center z-10">
              <Droplet size={32} className="text-blue-400 mx-auto" />
              <p className="text-xs font-bold text-text-secondary mt-1">HCl {acidConc}M</p>
            </div>
            <motion.div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-300 to-transparent"
              animate={{ height: `${Math.min(100, volume * 5)}%` }} transition={{ duration: 0.3 }} />
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs font-bold text-text-secondary shrink-0">Vol. Base</span>
            <Slider min={0} max={20} step={0.5} value={volume} onChange={setVolume} />
            <span className="text-xs font-black text-primary-dark w-12 text-right">{volume} mL</span>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={titrationData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="vol" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9, fontWeight: 700 }} label={{ value: 'mL', position: 'insideBottom', offset: -5 }} />
              <YAxis hide={true} domain={[0, 14]} />
              <Tooltip cursor={{ stroke: '#E5E7EB' }} />
              <Line type="monotone" dataKey="pH" stroke="#8B3DFF" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TitrationMode;
