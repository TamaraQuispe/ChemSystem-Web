import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const EXAMPLES = [
  { left: 'H₂ + O₂', right: 'H₂O', expected: [2, 1, 2], atoms: ['H', 'O'], names: ['Hidrógeno', 'Oxígeno', 'Agua'] },
  { left: 'N₂ + H₂', right: 'NH₃', expected: [1, 3, 2], atoms: ['N', 'H'], names: ['Nitrógeno', 'Hidrógeno', 'Amoniaco'] },
  { left: 'Fe + O₂', right: 'Fe₂O₃', expected: [4, 3, 2], atoms: ['Fe', 'O'], names: ['Hierro', 'Oxígeno', 'Óxido de Hierro (III)'] },
];

const BalanceAI = ({ equation, coefs, onSuggestion }) => {
  if (!equation) return null;
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb size={16} className="text-amber-500" />
        <span className="text-xs font-black text-blue-700">Asistente de Balanceo</span>
      </div>
      <p className="text-[10px] font-semibold text-blue-600/80 leading-relaxed">
        {coefs.every(c => c === 0)
          ? 'Empieza asignando coeficientes a cada compuesto. La suma de átomos a la izquierda debe igualar la suma a la derecha.'
          : coefs.some(c => c < 0)
          ? 'Los coeficientes no pueden ser negativos. Usa números enteros positivos.'
          : 'Bien, llevas buen camino. Verifica que cada elemento tenga el mismo número de átomos en ambos lados.'}
      </p>
      <div className="flex gap-2">
        {coefs.some(c => c === 0) && (
          <button onClick={() => onSuggestion(equation.expected)} className="px-3 py-1.5 bg-white rounded-xl border border-blue-200 text-[9px] font-bold text-blue-600 hover:bg-blue-50">
            Sugerir coeficientes
          </button>
        )}
      </div>
    </div>
  );
};

const BalancePage = () => {
  const [step, setStep] = useState('intro');
  const [selectedEx, setSelectedEx] = useState(0);
  const [coefs, setCoefs] = useState([0, 0, 0]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const eq = EXAMPLES[selectedEx];
  const isCorrect = coefs.every((c, i) => c === eq.expected[i]);
  const totalAtomsLeft = coefs[0] * eq.atoms.length + coefs[1] * eq.atoms.length;
  const totalAtomsRight = coefs[2] * eq.atoms.length;

  const checkBalance = () => {
    if (coefs.some(c => c <= 0)) { setFeedback('Todos los coeficientes deben ser positivos.'); return; }
    if (isCorrect) { setFeedback('¡Correcto! La ecuación está balanceada.'); setScore(s => s + 1); }
    else { setFeedback('Los átomos no coinciden. Revisa los coeficientes.'); }
  };

  const reset = () => { setCoefs([0, 0, 0]); setFeedback(null); };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl"><CheckCircle2 size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-primary-dark mb-3">Balanceo de Ecuaciones</h1>
            <p className="text-text-secondary font-semibold mb-2">Ajusta los coeficientes para que cada elemento tenga el mismo número de átomos en reactivos y productos.</p>
            <div className="p-4 bg-purple-50 rounded-2xl text-xs font-semibold text-purple-600 mb-8 max-w-lg mx-auto">Ley de Conservación de la Masa: en una reacción química, la masa no se crea ni se destruye.</div>
            <Button onClick={() => setStep('lab')} className="px-10 py-4 bg-primary-dark text-white rounded-2xl font-bold text-base">Comenzar</Button>
          </motion.div>
        )}

        {step === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep('intro')} className="text-xs font-bold text-gray-400 hover:text-primary">← Volver</button>
              <span className="text-gray-300">/</span>
              <span className="text-xs font-bold text-primary-dark">Balanceo</span>
              <span className="text-xs font-bold text-text-secondary ml-auto">Puntuación: {score}</span>
            </div>

            <div className="flex gap-2">
              {EXAMPLES.map((ex, i) => (
                <button key={i} onClick={() => { setSelectedEx(i); reset(); }}
                  className={cn("px-4 py-2 rounded-xl text-[9px] font-bold transition-all",
                    selectedEx === i ? 'bg-primary text-white' : 'bg-gray-50 text-text-secondary'
                  )}>{ex.names[2]}</button>
              ))}
            </div>

            <Card className="p-8">
              <div className="text-center mb-8">
                <p className="text-2xl font-black text-primary-dark tracking-wide">
                  <span className="text-blue-500">{coefs[0] || '_'}</span>{eq.left.replace('+', ` + `)}
                  {' → '}
                  <span className="text-emerald-500">{coefs[2] || '_'}</span>{eq.right}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {eq.names.map((name, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[9px] font-bold text-text-secondary mb-1">{name}</p>
                    <input type="number" min="0" max="20" value={coefs[i] || ''}
                      onChange={e => { const v = parseInt(e.target.value) || 0; const n = [...coefs]; n[i] = v; setCoefs(n); setFeedback(null); }}
                      className="w-full h-12 text-center text-xl font-black bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all"
                      placeholder="?" />
                  </div>
                ))}
              </div>

              {feedback && (
                <div className={cn("p-4 rounded-2xl text-xs font-bold text-center mb-4", isCorrect ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500')}>
                  {feedback}
                </div>
              )}

              {/* Atom counter table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-gray-100">
                    <th className="pb-2 font-black text-text-secondary text-left">Átomo</th>
                    <th className="pb-2 font-black text-text-secondary text-center">Reactivos</th>
                    <th className="pb-2 font-black text-text-secondary text-center">Productos</th>
                    <th className="pb-2 font-black text-text-secondary text-center">Estado</th>
                  </tr></thead>
                  <tbody>
                    {eq.atoms.map((atom, i) => {
                      const left = coefs[0] * 1 + coefs[1] * (i === 0 ? 1 : 0);
                      const right = coefs[2] * (i === 0 ? 1 : 0);
                      const balanced = coefs.every(c => c > 0) ? left === right : null;
                      return (
                        <tr key={atom} className="border-b border-gray-50">
                          <td className="py-3 font-bold text-text-main">{atom}</td>
                          <td className="py-3 text-center font-bold">{left || '—'}</td>
                          <td className="py-3 text-center font-bold">{right || '—'}</td>
                          <td className="py-3 text-center">
                            {balanced === true && <CheckCircle2 size={16} className="text-emerald-500 inline" />}
                            {balanced === false && <XCircle size={16} className="text-red-500 inline" />}
                            {balanced === null && <span className="text-gray-300">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <BalanceAI equation={eq} coefs={coefs} onSuggestion={(c) => setCoefs(c)} />

              <div className="flex gap-3 mt-6">
                <Button onClick={checkBalance} className="flex-1 bg-primary-dark text-white rounded-2xl font-bold text-sm h-12">Verificar</Button>
                <Button onClick={reset} variant="outline" className="rounded-2xl font-bold text-sm h-12"><RotateCcw size={16} /> Reiniciar</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BalancePage;
