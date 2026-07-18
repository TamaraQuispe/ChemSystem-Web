import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Lightbulb, RotateCcw, Droplets, FlaskConical, Play } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const TitrationAI = ({ pH, volume, equivalence }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50/50 rounded-2xl border border-pink-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-pink-500" /><span className="text-xs font-black text-pink-700">Asistente de Valoración</span></div>
      {volume === 0 && <p className="text-[10px] font-semibold text-pink-600/80">Agrega base gota a gota usando el control deslizante. Observa cómo cambia el pH.</p>}
      {equivalence && <p className="text-[10px] font-bold text-emerald-500">✓ Punto de equivalencia alcanzado. Todo el ácido ha sido neutralizado.</p>}
      {volume > 0 && !equivalence && <p className="text-[10px] font-semibold text-pink-600/80">pH actual: {pH.toFixed(1)}. Sigue agregando base hasta alcanzar pH 7.</p>}
    </div>
  );
};

const TitrationPage = () => {
  const [step, setStep] = useState('intro');
  const [volume, setVolume] = useState(0);
  const [acidConc] = useState(0.1);
  const [indicator, setIndicator] = useState('fenolftaleína');
  const [drops, setDrops] = useState([]);

  const pH = volume < 10 ? 1 + Math.log10(1 / acidConc) + volume * 0.6 : volume === 10 ? 7 : 14 - Math.log10(1 / acidConc) - (volume - 10) * 0.6;
  const equivalence = Math.abs(volume - 10) < 0.3;

  const titrationData = Array.from({ length: 21 }, (_, i) => ({
    vol: (i * 1).toFixed(1),
    pH: i < 10 ? 1 + Math.log10(1 / acidConc) + i * 0.6 : i === 10 ? 7 : 14 - Math.log10(1 / acidConc) - (i - 10) * 0.6,
  }));

  const addDrop = () => {
    setVolume(v => Math.min(20, v + 0.5));
    setDrops(d => [...d.slice(-19), { id: Date.now(), x: Math.random() * 60 + 20, y: Math.random() * 40 + 10 }]);
  };

  const indicatorColor = pH < 3 ? '#FF0000' : pH < 5 ? '#FF6666' : pH < 7 ? '#FFAAAA' : equivalence ? '#FFB3C6' : '#FF69B4';

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Droplets size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Simulador de Titulación</h1>
            <p className="text-text-secondary font-semibold mb-2">Realiza una valoración ácido-base gota a gota. Observa el cambio de color y la curva de pH.</p>
            <div className="p-4 bg-pink-50 rounded-2xl text-xs font-semibold text-pink-600 mb-8 max-w-lg mx-auto">En el punto de equivalencia, moles de ácido = moles de base. El indicador cambia de color.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Valoración</h2>
                  <div className="relative h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl border border-blue-200 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <FlaskConical size={40} className="text-blue-300" />
                    </div>
                    <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-8 rounded-full"
                      animate={{ backgroundColor: indicatorColor }} transition={{ duration: 0.3 }} />
                    <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center">
                      <div className="w-20" style={{ background: `linear-gradient(to top, ${indicatorColor}44, transparent)`, height: `${Math.min(100, volume * 5)}%` }} />
                    </div>
                    {drops.map(d => (
                      <motion.div key={d.id} initial={{ y: -10, opacity: 1 }} animate={{ y: 60, opacity: 0 }}
                        className="absolute w-2 h-2 rounded-full bg-pink-300" style={{ left: `${d.x}%`, top: `${d.y}%` }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Button onClick={addDrop} className="bg-primary-dark text-white rounded-2xl font-bold text-xs h-10 gap-2">
                      <Play size={14} /> Gota
                    </Button>
                    <span className="text-xs font-bold text-text-secondary">Volumen: {volume.toFixed(1)} mL</span>
                    <span className={cn("text-xs font-bold px-3 py-1.5 rounded-xl", equivalence ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50')}>
                      pH: {pH.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-2"><span className="text-[9px] font-bold">Volumen (mL)</span><span className="text-xs font-black">{volume.toFixed(1)}</span></div>
                    <input type="range" min="0" max="20" step="0.5" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex gap-2">
                    {['Fenolftaleína', 'Anaranjado de Metilo', 'Azul de Bromotimol'].map(ind => (
                      <button key={ind} onClick={() => setIndicator(ind)}
                        className={cn("px-3 py-1.5 rounded-xl text-[8px] font-bold transition-all",
                          indicator === ind ? 'bg-primary text-white' : 'bg-gray-50 text-text-secondary'
                        )}>{ind}</button>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Curva de Titulación</h2>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={titrationData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="vol" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} label={{ value: 'Vol. base (mL)', position: 'insideBottom', offset: -5, style: { fontSize: 9 } }} />
                        <YAxis hide={true} domain={[0, 14]} />
                        <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                        <Line type="monotone" dataKey="pH" stroke="#8B3DFF" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <TitrationAI pH={pH} volume={volume} equivalence={equivalence} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TitrationPage;
