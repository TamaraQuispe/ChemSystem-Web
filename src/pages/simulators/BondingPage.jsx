import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Atom, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const ELEMENTS = [
  { sym: 'H', name: 'Hidrógeno', valence: 1, electrons: 1, color: 'bg-blue-200 text-blue-700' },
  { sym: 'O', name: 'Oxígeno', valence: 2, electrons: 6, color: 'bg-red-200 text-red-700' },
  { sym: 'C', name: 'Carbono', valence: 4, electrons: 4, color: 'bg-gray-200 text-gray-700' },
  { sym: 'N', name: 'Nitrógeno', valence: 3, electrons: 5, color: 'bg-blue-300 text-blue-700' },
  { sym: 'Cl', name: 'Cloro', valence: 1, electrons: 7, color: 'bg-green-200 text-green-700' },
  { sym: 'Na', name: 'Sodio', valence: 1, electrons: 1, color: 'bg-purple-200 text-purple-700' },
];

const BondingAI = ({ atoms, octetSatisfied }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-emerald-500" /><span className="text-xs font-black text-emerald-700">Químico de Enlaces</span></div>
      {atoms.length === 0 && <p className="text-[10px] font-semibold text-emerald-600/80">Selecciona átomos para construir una molécula. Recuerda la regla del octeto: cada átomo tiende a tener 8 electrones en su última capa.</p>}
      {atoms.length > 0 && (
        <>
          <p className="text-[10px] font-semibold text-emerald-600/80">{atoms.length} átomo(s) en la molécula</p>
          {octetSatisfied !== null && (
            <p className={cn("text-[10px] font-bold", octetSatisfied ? 'text-emerald-500' : 'text-amber-500')}>
              {octetSatisfied ? '✓ Regla del octeto cumplida' : '⚠ Algunos átomos no completan su octeto'}
            </p>
          )}
        </>
      )}
    </div>
  );
};

const BondingPage = () => {
  const [step, setStep] = useState('intro');
  const [atoms, setAtoms] = useState([]);
  const [bonds, setBonds] = useState([]);

  const addAtom = (el) => {
    const id = Date.now();
    setAtoms(a => [...a, { ...el, id }]);
  };

  const totalElectrons = atoms.reduce((s, a) => s + a.valence, 0);
  const octetSatisfied = atoms.length > 0 ? atoms.every(a => a.valence >= 1 && a.valence <= 4) && totalElectrons % 2 === 0 : null;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Atom size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Laboratorio de Enlaces</h1>
            <p className="text-text-secondary font-semibold mb-2">Construye moléculas formando enlaces entre átomos. Visualiza la regla del octeto.</p>
            <div className="p-4 bg-emerald-50 rounded-2xl text-xs font-semibold text-emerald-600 mb-8 max-w-lg mx-auto">Los átomos se unen compartiendo o transfiriendo electrones para completar su última capa.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Área de Construcción</h2>
                  <div className="min-h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-200 p-6 flex items-center justify-center">
                    {atoms.length === 0 ? (
                      <p className="text-xs font-bold text-text-secondary">Selecciona átomos de la lista para construir</p>
                    ) : (
                      <div className="flex items-center gap-3 flex-wrap justify-center">
                        {atoms.map((a, i) => (
                          <motion.div key={a.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-black shadow-md relative", a.color)}>
                            {a.sym}
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border text-[8px] font-bold flex items-center justify-center text-text-secondary">
                              {a.valence}e⁻
                            </span>
                            {i < atoms.length - 1 && <span className="absolute -right-5 text-gray-300 text-lg">—</span>}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-2">Propiedades</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-xl font-black text-primary-dark">{atoms.length}</p>
                      <p className="text-[8px] font-bold text-text-secondary">Átomos</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-xl font-black text-primary-dark">{totalElectrons}</p>
                      <p className="text-[8px] font-bold text-text-secondary">e⁻ de valencia</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className={cn("text-xl font-black", octetSatisfied ? 'text-emerald-500' : 'text-amber-500')}>
                        {octetSatisfied === null ? '—' : octetSatisfied ? '✓' : '✗'}
                      </p>
                      <p className="text-[8px] font-bold text-text-secondary">Octeto</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Átomos</h2>
                <div className="space-y-2">
                  {ELEMENTS.map(el => (
                    <button key={el.sym} onClick={() => addAtom(el)}
                      className={cn("w-full p-3 rounded-xl text-left font-bold text-xs transition-all hover:scale-[1.02]", el.color)}>
                      <span className="text-sm font-black">{el.sym}</span> — {el.name} ({el.valence} e⁻)
                    </button>
                  ))}
                  <button onClick={() => { setAtoms([]); setBonds([]); }}
                    className="w-full p-3 rounded-xl bg-red-50 text-red-500 font-bold text-xs mt-2">Limpiar</button>
                </div>

                <BondingAI atoms={atoms} octetSatisfied={octetSatisfied} />
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BondingPage;
