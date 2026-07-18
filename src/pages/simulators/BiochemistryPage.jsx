import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Dna } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const MOLECULES = [
  { name: 'ADN', desc: 'Doble hélice con pares de bases A-T y G-C. Almacena información genética.', color: '#005B8F' },
  { name: 'Hemoglobina', desc: 'Proteína transportadora de oxígeno en glóbulos rojos. Contiene 4 grupos hemo con Fe.', color: '#EF4444' },
  { name: 'ATP', desc: 'Adenosín Trifosfato. Moneda energética de la célula. Almacena energía en enlaces fosfato.', color: '#F59E0B' },
  { name: 'Glucosa', desc: 'C₆H₁₂O₆. Fuente primaria de energía. Se metaboliza en glucólisis y respiración celular.', color: '#059669' },
  { name: 'Fosfolípido', desc: 'Componente principal de membranas celulares. Cabeza polar + colas apolares.', color: '#8B3DFF' },
  { name: 'Colágeno', desc: 'Proteína estructural más abundante. Triple hélice de cadenas polipeptídicas.', color: '#06B6D4' },
];

const BiochemistryAI = ({ molecule }) => (
  <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50/50 rounded-2xl border border-emerald-100 space-y-2">
    <div className="flex items-center gap-2"><Lightbulb size={16} className="text-emerald-500" /><span className="text-xs font-black text-emerald-700">Bioquímica IA</span></div>
    {molecule && <p className="text-[10px] font-semibold text-emerald-600/80">{molecule.desc}</p>}
  </div>
);

const BiochemistryPage = () => {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Dna size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Bioquímica Molecular</h1>
            <p className="text-text-secondary font-semibold mb-2">Explora moléculas biológicas fundamentales y sus funciones.</p>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}
        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Moléculas Biológicas</h2>
                <div className="grid grid-cols-2 gap-3">
                  {MOLECULES.map(m => (
                    <button key={m.name} onClick={() => setSelected(m)}
                      className={cn("p-4 rounded-2xl border-2 text-center transition-all", selected?.name === m.name ? 'border-current shadow-md' : 'border-gray-100')}>
                      <p className="text-xs font-black">{m.name}</p>
                    </button>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Visor Molecular</h2>
                {selected ? (
                  <div className="text-center">
                    <div className="h-48 flex items-center justify-center">
                      <svg viewBox="0 0 120 120" className="w-40 h-40">
                        {selected.name === 'ADN' && (<>
                          <path d="M30,10 C40,30 20,60 40,80 C60,100 40,110 30,120" fill="none" stroke="#005B8F" strokeWidth="3" />
                          <path d="M70,10 C60,30 80,60 60,80 C40,100 60,110 70,120" fill="none" stroke="#005B8F" strokeWidth="3" />
                          {[20, 40, 60, 80, 100].map(y => <line key={y} x1={35 + Math.sin(y / 20) * 10} y1={y} x2={65 - Math.sin(y / 20) * 10} y2={y} stroke="#F59E0B" strokeWidth="1.5" />)}
                        </>)}
                        {selected.name === 'Hemoglobina' && (<>
                          <circle cx="50" cy="50" r="30" fill="#EF444422" stroke="#EF4444" strokeWidth="2" />
                          <circle cx="60" cy="45" r="25" fill="#EF444411" stroke="#EF4444" strokeWidth="1.5" />
                          <circle cx="50" cy="50" r="5" fill="#EF4444" />
                        </>)}
                        {selected.name === 'ATP' && (<>
                          <rect x="40" y="30" width="20" height="15" rx="3" fill="#F59E0B33" stroke="#F59E0B" strokeWidth="1.5" />
                          <line x1="50" y1="45" x2="50" y2="60" stroke="#F59E0B" strokeWidth="2" />
                          <text x="50" y="55" textAnchor="middle" fill="#F59E0B" fontSize="8" fontWeight="bold">P~P~P</text>
                        </>)}
                        {selected.name === 'Glucosa' && (<>
                          <polygon points="60,20 85,40 80,70 40,70 35,40" fill="none" stroke="#059669" strokeWidth="2" />
                          {[[50, 45], [55, 50], [60, 45], [65, 50]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="#059669" />)}
                          <text x="60" y="85" textAnchor="middle" fill="#059669" fontSize="7" fontWeight="bold">C₆H₁₂O₆</text>
                        </>)}
                        {selected.name === 'Fosfolípido' && (<>
                          <circle cx="60" cy="30" r="10" fill="#8B3DFF33" stroke="#8B3DFF" strokeWidth="1.5" />
                          <line x1="60" y1="40" x2="60" y2="80" stroke="#8B3DFF" strokeWidth="2" />
                          <line x1="60" y1="40" x2="40" y2="80" stroke="#8B3DFF" strokeWidth="1.5" />
                          <line x1="60" y1="40" x2="80" y2="80" stroke="#8B3DFF" strokeWidth="1.5" />
                        </>)}
                        {selected.name === 'Colágeno' && (<>
                          <path d="M20,10 Q40,40 30,70 Q20,100 40,120" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
                          <path d="M50,10 Q70,40 60,70 Q50,100 70,120" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
                          <path d="M35,10 Q55,40 45,70 Q35,100 55,120" fill="none" stroke="#06B6D4" strokeWidth="1" />
                        </>)}
                      </svg>
                    </div>
                    <BiochemistryAI molecule={selected} />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center"><p className="text-xs font-bold text-text-secondary">Selecciona una molécula</p></div>
                )}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default BiochemistryPage;
