import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Hexagon, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const CHAIN_PARTS = [
  { id: 'C', label: 'Carbono', sym: 'C', type: 'carbon' },
  { id: 'CH3', label: 'Metilo', sym: 'CH₃', type: 'methyl' },
  { id: 'OH', label: 'Hidroxilo', sym: 'OH', type: 'hydroxyl' },
  { id: 'COOH', label: 'Carboxilo', sym: 'COOH', type: 'carboxyl' },
  { id: 'NH2', label: 'Amino', sym: 'NH₂', type: 'amino' },
  { id: 'Cl', label: 'Cloro', sym: 'Cl', type: 'halogen' },
];

const NomenclatureAI = ({ chain }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50/50 rounded-2xl border border-teal-100 space-y-2">
      <div className="flex items-center gap-2"><Lightbulb size={16} className="text-teal-500" /><span className="text-xs font-black text-teal-700">Nomenclatura IUPAC</span></div>
      {chain.length === 0 && <p className="text-[10px] font-semibold text-teal-600/80">Construye una cadena carbonada seleccionando grupos. La IA generará el nombre IUPAC.</p>}
      {chain.length > 0 && (
        <>
          <p className="text-[10px] font-semibold text-teal-600/80">Cadena: {chain.map(c => c.sym).join('-')}</p>
          <p className="text-[10px] font-semibold text-teal-600/80">Carbonos: {chain.filter(c => c.type === 'carbon').length}</p>
          <p className="text-[10px] font-semibold text-teal-600/80">Grupos funcionales: {chain.filter(c => c.type !== 'carbon').map(c => c.label).join(', ') || 'ninguno'}</p>
        </>
      )}
    </div>
  );
};

const OrganicNomenclaturePage = () => {
  const [step, setStep] = useState('intro');
  const [chain, setChain] = useState([]);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl"><Hexagon size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Nomenclatura Orgánica</h1>
            <p className="text-text-secondary font-semibold mb-2">Construye cadenas carbonadas y aprende a nombrarlas según IUPAC.</p>
            <div className="p-4 bg-teal-50 rounded-2xl text-xs font-semibold text-teal-600 mb-8 max-w-lg mx-auto">La nomenclatura IUPAC asigna nombres sistemáticos a los compuestos orgánicos según su estructura.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-sm font-black text-primary-dark mb-4">Cadena Carbonada</h2>
                  <div className="min-h-[160px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-200 p-6 flex items-center justify-center">
                    {chain.length === 0 ? (
                      <p className="text-xs font-bold text-text-secondary">Agrega grupos para construir la cadena</p>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {chain.map((c, i) => (
                          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="px-4 py-3 bg-white rounded-2xl border-2 border-primary/20 shadow-sm font-bold text-xs text-primary-dark">
                            {c.sym}
                            {i < chain.length - 1 && <span className="ml-2 text-gray-300">—</span>}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {chain.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-sm font-black text-primary-dark mb-2">Nombre sugerido</h2>
                    <p className="text-lg font-black text-primary-dark">
                      {chain.filter(c => c.type === 'carbon').length}-{chain.find(c => c.type !== 'carbon')?.label?.toLowerCase() || 'ano'}
                    </p>
                  </Card>
                )}
              </div>

              <Card className="p-6">
                <h2 className="text-sm font-black text-primary-dark mb-4">Grupos</h2>
                <div className="space-y-2">
                  {CHAIN_PARTS.map(part => (
                    <button key={part.id} onClick={() => setChain(c => [...c, part])}
                      className="w-full p-3 rounded-xl text-left font-bold text-xs bg-gray-50 hover:bg-primary/5 hover:border-primary/30 border border-gray-100 transition-all">
                      <span className="text-sm font-black">{part.sym}</span>
                      <br /><span className="text-[9px] text-text-secondary">{part.label}</span>
                    </button>
                  ))}
                  <button onClick={() => setChain([])}
                    className="w-full p-3 rounded-xl bg-red-50 text-red-500 font-bold text-xs mt-2">Limpiar</button>
                </div>

                <NomenclatureAI chain={chain} />
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganicNomenclaturePage;
