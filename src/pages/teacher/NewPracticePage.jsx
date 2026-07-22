import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';
import { useTeacherStore } from '../../store/teacherStore';
import api from '../../services/api';

const SIMULATORS = [
  { id: 'organica', title: 'Química Orgánica', desc: 'Mecanismos de reacción, isomería y síntesis de compuestos complejos.', icon: '🧬', color: 'text-[#004b71]', bg: 'bg-primary/5' },
  { id: 'enlaces', title: 'Enlaces Químicos', desc: 'Geometría molecular (VSEPR), polaridad e hibridación orbital.', icon: '🔗', color: 'text-[#006c4d]', bg: 'bg-[#86f8c8]/10' },
  { id: 'estequiometria', title: 'Estequiometría', desc: 'Balanceo de ecuaciones, reactivo limitante y rendimiento teórico.', icon: '⚖️', color: 'text-[#6c228c]', bg: 'bg-[#f8d8ff]/20' },
];

const NewPracticePage = () => {
  const navigate = useNavigate();
  const { classes } = useTeacherStore();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const fileInputRef = useRef(null);

  // Step 1 state
  const [selectedSim, setSelectedSim] = useState('organica');
  const [topic, setTopic] = useState('');
  const [objectives, setObjectives] = useState('');
  const [difficulty, setDifficulty] = useState('Intermedio');

  // Step 2 state
  const [reactants, setReactants] = useState([
    { formula: 'C₂H₆O', name: 'Etanol (Grado Reactivo)', desc: 'Polaridad Alta', active: true },
    { formula: 'H₂SO₄', name: 'Ácido Sulfúrico (98%)', desc: 'Catalizador Ácido', active: true },
    { formula: 'KMnO₄', name: 'Permanganato de Potasio', desc: 'Agente Oxidante', active: false },
  ]);
  const [tempValue, setTempValue] = useState(180);
  const [pressureValue, setPressureValue] = useState(1.2);

  // Step 3 state
  const [selectedGroups, setSelectedGroups] = useState({});
  const [dueDate, setDueDate] = useState('');
  const [autoGrade, setAutoGrade] = useState(true);
  const [multiAttempt, setMultiAttempt] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1) {
      if (!selectedSim) newErrors.sim = 'Selecciona un simulador';
      if (!topic.trim()) newErrors.topic = 'Ingresa el tema de la práctica';
      if (!objectives.trim()) newErrors.objectives = 'Define los objetivos de aprendizaje';
    }
    if (s === 2) {
      if (!reactants.some(r => r.active)) newErrors.reactants = 'Selecciona al menos un reactivo';
    }
    if (s === 3) {
      const anySelected = Object.values(selectedGroups).some(v => v);
      if (!anySelected) newErrors.groups = 'Selecciona al menos un grupo';
      if (!dueDate) newErrors.date = 'Selecciona una fecha límite';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 3) setStep(s => s + 1);
    else alert('¡Práctica creada con éxito!');
  };

  const handlePrev = () => {
    if (step > 1) setStep(s => s - 1);
    setErrors({});
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Wizard Stepper */}
      <div className="flex items-center justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#e2e2e3] -translate-y-1/2 z-0" />
        {[{ num: 1, label: 'Contenido' }, { num: 2, label: 'Parámetros' }, { num: 3, label: 'Asignación' }].map(s => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setStep(s.num)}>
            <div className={cn("w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all shadow-sm",
              step === s.num ? 'bg-[#004b71] text-white border-[#004b71] shadow-md shadow-[#004b71]/30' :
              step > s.num ? 'bg-[#86f8c8] text-[#007352] border-[#86f8c8]' : 'bg-white text-[#c0c7d0] border-[#c0c7d0]'
            )}>
              {step > s.num ? <span>✓</span> : s.num}
            </div>
            <span className={cn("font-headline text-xs font-bold uppercase tracking-widest", step === s.num ? 'text-[#004b71]' : 'text-[#707880]')}>{s.label}</span>
          </div>
        ))}
      </div>

      <form className="space-y-8" onSubmit={e => e.preventDefault()}>
        {/* Step 1: Contenido */}
        {step === 1 && (
          <section>
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[#004b71] font-bold tracking-widest uppercase text-xs">Nueva Práctica</span>
                <h2 className="text-3xl font-headline font-extrabold text-[#1a1c1d] mt-2">Paso 1: Definición del Simulador</h2>
                <p className="text-[#40484f] mt-2 max-w-2xl">Elige la base técnica y define los objetivos de tu nueva práctica experimental.</p>
              </div>
              <div className="flex items-center gap-3 bg-[#f3f3f4] p-2 rounded-2xl px-5">
                {[{ n: '01', active: true }, { n: '02', active: false }, { n: '03', active: false }].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && <div className={cn("h-1 w-8 rounded-full", s.active ? 'bg-[#004b71]' : 'bg-[#e2e2e3]')} />}
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs",
                      s.active ? 'bg-[#004b71] text-white shadow-md ring-4 ring-[#004b71]/10' : 'bg-[#e2e2e3] text-[#40484f]'
                    )}>{s.n}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Simulator Selection */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#c0c7d0]/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#cbe6ff]/30 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-[#004b71]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1a1c1d]">Seleccionar Simulador</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {SIMULATORS.map(sim => (
                      <div key={sim.id} onClick={() => setSelectedSim(sim.id)}
                        className={cn("flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                          selectedSim === sim.id ? 'border-[#004b71] bg-[#004b71]/5' : 'border-[#c0c7d0]/10 hover:border-[#c0c7d0]/30 bg-[#f3f3f4]/50'
                        )}>
                        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-2xl", sim.bg)}>
                          {sim.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#1a1c1d]">{sim.title}</h4>
                          <p className="text-xs text-[#40484f]">{sim.desc}</p>
                        </div>
                        {selectedSim === sim.id && (
                          <div className="w-6 h-6 rounded-full bg-[#004b71] text-white flex items-center justify-center text-xs font-bold">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Details & Objectives */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#c0c7d0]/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#cbe6ff]/30 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-[#004b71]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1a1c1d]">Detalles de la Práctica</h3>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-semibold text-[#004b71] block mb-2">Tema de la Práctica *</label>
                      <input value={topic} onChange={e => setTopic(e.target.value)}
                        className={cn("w-full bg-[#f3f3f4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#004b71]/20 outline-none",
                          errors.topic && 'ring-2 ring-[#ba1a1a] bg-[#ffdad6]/20')}
                        placeholder="Ej: Hidrocarburos Aromáticos" />
                      {errors.topic && <p className="text-xs text-[#ba1a1a] mt-1 font-medium">{errors.topic}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#004b71] block mb-2">Objetivos de Aprendizaje *</label>
                      <textarea value={objectives} onChange={e => setObjectives(e.target.value)}
                        className={cn("w-full bg-[#f3f3f4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#004b71]/20 outline-none resize-none",
                          errors.objectives && 'ring-2 ring-[#ba1a1a] bg-[#ffdad6]/20')}
                        placeholder="Define qué aprenderá el alumno..." rows={4} />
                      {errors.objectives && <p className="text-xs text-[#ba1a1a] mt-1 font-medium">{errors.objectives}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#004b71] block mb-2">Nivel de Dificultad</label>
                      <div className="flex gap-2">
                        {['Básico', 'Intermedio', 'Avanzado'].map(d => (
                          <label key={d} className="flex-1 cursor-pointer">
                            <input type="radio" name="diff" value={d} checked={difficulty === d} onChange={e => setDifficulty(e.target.value)} className="peer sr-only" />
                            <div className="text-center p-3 rounded-xl border-2 border-transparent peer-checked:border-[#004b71] peer-checked:bg-white transition-all bg-[#f3f3f4]/50 text-sm font-medium text-[#40484f] peer-checked:text-[#004b71]">{d}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center border-2 border-dashed border-[#c0c7d0] rounded-[2rem] p-8 bg-white/30 cursor-pointer hover:bg-[#f3f3f4] transition-colors">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-[#e2e2e3] flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[#707880]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    </div>
                    {fileInfo ? (
                      <>
                        <p className="text-sm font-bold text-[#004b71]">{fileInfo.name}</p>
                        <p className="text-xs text-[#707880] mt-1">{(fileInfo.size / 1024 / 1024).toFixed(1)} MB · Subido ✓</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-[#40484f]">Adjuntar archivo</p>
                        <p className="text-xs text-[#707880] mt-1">PDF, Word, Excel, imágenes, video · Máx. 500 MB</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" hidden
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                          const res = await api.uploadFile('/upload', file, 'practices');
                          setFileInfo(res.data);
                          setUploadedFile(file);
                        } catch (err) {
                          alert(err.message);
                        }
                        setUploading(false);
                      }} />
                    {uploading && <p className="text-xs text-[#004b71] mt-2 font-bold animate-pulse">Subiendo archivo...</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 flex justify-end items-center py-6 border-t border-[#c0c7d0]/10">
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-[#e8e8e9] text-[#40484f] font-bold rounded-xl hover:bg-[#e2e2e3] transition-all">Guardar Borrador</button>
                <button onClick={handleNext} className="px-10 py-3 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                  style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
                  Siguiente: Parámetros →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Parámetros */}
        {step === 2 && (
          <section>
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[#004b71] font-bold tracking-widest uppercase text-xs">Módulo Experimental</span>
                <h2 className="text-3xl font-headline font-extrabold text-[#1a1c1d] mt-2">Paso 2: Parámetros del Simulador</h2>
                <p className="text-[#40484f] mt-2 max-w-2xl">Define las condiciones termodinámicas y los reactivos activos para la simulación.</p>
              </div>
              <div className="flex items-center gap-3 bg-[#f3f3f4] p-2 rounded-2xl px-5">
                {[{ n: '01', active: false }, { n: '02', active: true }, { n: '03', active: false }].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && <div className={cn("h-1 w-8 rounded-full", s.active || (i === 1) ? 'bg-[#004b71]' : 'bg-[#e2e2e3]')} />}
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs",
                      s.active ? 'bg-[#004b71] text-white shadow-md ring-4 ring-[#004b71]/10' : 'bg-[#e2e2e3] text-[#40484f]'
                    )}>{s.n}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Reactivos */}
              <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 shadow-sm border border-[#c0c7d0]/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#cbe6ff]/30 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-[#004b71]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1a1c1d]">Reactivos de Síntesis</h3>
                  </div>
                  <span className="text-xs font-bold text-[#40484f]/60 bg-[#e8e8e9] px-3 py-1 rounded-full">3 SUSTANCIAS</span>
                </div>
                <div className="space-y-3">
                  {reactants.map((r, i) => (
                    <div key={i} className={cn("flex items-center justify-between p-4 bg-[#f3f3f4]/50 hover:bg-[#f3f3f4] transition-colors rounded-2xl group",
                      !r.active && 'opacity-50')}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-[#c0c7d0]/5">
                          <span className={cn("font-bold text-sm", r.active ? 'text-[#004b71]' : 'text-[#40484f]/40')}>{r.formula}</span>
                        </div>
                        <div>
                          <h4 className={cn("font-bold", r.active ? 'text-[#1a1c1d] group-hover:text-[#004b71]' : 'text-[#40484f]/60')}>{r.name}</h4>
                          <p className={cn("text-xs", r.active ? 'text-[#40484f]' : 'text-[#40484f]/40')}>{r.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={r.active} onChange={() => {
                          const newR = [...reactants]; newR[i].active = !newR[i].active; setReactants(newR);
                        }} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#e2e2e3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004b71]" />
                      </label>
                    </div>
                  ))}
                </div>
                {errors.reactants && <p className="text-xs text-[#ba1a1a] mt-2 font-medium">{errors.reactants}</p>}
                <button className="mt-6 flex items-center gap-2 text-[#004b71] font-bold text-sm hover:underline">
                  <span>+</span> Añadir reactivo personalizado
                </button>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                {/* Condiciones */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#c0c7d0]/10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-[#cbe6ff]/30 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-[#004b71]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1a1c1d]">Condiciones</h3>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-[#1a1c1d] text-sm">Temperatura Máxima</label>
                        <span className="bg-[#cbe6ff] text-[#004b71] font-bold px-3 py-1 rounded-lg text-xs">{tempValue}°C</span>
                      </div>
                      <input type="range" min="25" max="300" value={tempValue} onChange={e => setTempValue(Number(e.target.value))} className="w-full h-1.5 bg-[#e8e8e9] rounded-lg appearance-none cursor-pointer accent-[#004b71]" />
                      <div className="flex justify-between text-[10px] text-[#40484f] font-medium"><span>25°C</span><span>300°C</span></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-[#1a1c1d] text-sm">Presión de Trabajo</label>
                        <span className="bg-[#cbe6ff] text-[#004b71] font-bold px-3 py-1 rounded-lg text-xs">{pressureValue} atm</span>
                      </div>
                      <input type="range" min="0.5" max="5" step="0.1" value={pressureValue} onChange={e => setPressureValue(Number(e.target.value))} className="w-full h-1.5 bg-[#e8e8e9] rounded-lg appearance-none cursor-pointer accent-[#004b71]" />
                      <div className="flex justify-between text-[10px] text-[#40484f] font-medium"><span>0.5 atm</span><span>5.0 atm</span></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-[#1a1c1d] text-sm">Rango de pH</label>
                        <span className="bg-[#cbe6ff] text-[#004b71] font-bold px-3 py-1 rounded-lg text-xs">4.5 - 7.2</span>
                      </div>
                      <div className="relative h-1.5 bg-[#e8e8e9] rounded-lg">
                        <div className="absolute left-[15%] right-[30%] h-full bg-[#004b71]/40 rounded-lg" />
                        <div className="absolute left-[15%] w-3.5 h-3.5 -top-[3px] bg-[#004b71] rounded-full shadow-md" />
                        <div className="absolute right-[30%] w-3.5 h-3.5 -top-[3px] bg-[#004b71] rounded-full shadow-md" />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#40484f] font-medium"><span>0 pH</span><span>14 pH</span></div>
                    </div>
                  </div>
                </div>

                {/* Herramientas */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#c0c7d0]/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#cbe6ff]/30 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-[#004b71]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1a1c1d]">Herramientas</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Espectrómetro IR', desc: 'Análisis estructural en tiempo real', pro: false },
                      { name: 'Gráficas Dinámicas', desc: 'Cinética de reacción visualizada', pro: false },
                      { name: 'IA Predictiva', desc: 'Cálculo de rendimientos teóricos', pro: true },
                    ].map((tool, i) => (
                      <label key={i} className={cn("flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all",
                        tool.pro ? 'border-[#6c228c]/20 bg-[#f8d8ff]/10 hover:bg-[#f8d8ff]/20' : 'border-[#c0c7d0]/10 hover:bg-[#f3f3f4]'
                      )}>
                        <input type="checkbox" defaultChecked className={cn("w-5 h-5 rounded focus:ring-2",
                          tool.pro ? 'text-[#6c228c] focus:ring-[#6c228c]/20' : 'text-[#004b71] focus:ring-[#004b71]/20'
                        )} />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className={cn("font-bold text-sm", tool.pro ? 'text-[#6c228c]' : 'text-[#1a1c1d]')}>{tool.name}</span>
                            {tool.pro && <span className="text-[8px] bg-[#6c228c] text-white px-1.5 py-0.5 rounded-full uppercase font-black">Pro</span>}
                          </div>
                          <span className="text-xs text-[#40484f]">{tool.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 flex justify-between items-center py-6 border-t border-[#c0c7d0]/10">
              <button onClick={handlePrev} className="px-8 py-3 text-[#004b71] font-bold hover:bg-[#cbe6ff]/30 rounded-xl transition-all">Atrás</button>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-[#e8e8e9] text-[#40484f] font-bold rounded-xl hover:bg-[#e2e2e3] transition-all">Guardar Borrador</button>
                <button onClick={handleNext} className="px-10 py-3 text-white font-bold rounded-xl shadow-lg shadow-[#004b71]/20 hover:scale-[1.02] active:scale-95 transition-all"
                  style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
                  Siguiente: Procedimiento
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Asignación */}
        {step === 3 && (
          <section>
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[#004b71] font-bold tracking-widest uppercase text-xs">Publicación</span>
                <h2 className="text-3xl font-headline font-extrabold text-[#1a1c1d] mt-2">Paso 3: Asignación y Programación</h2>
                <p className="text-[#40484f] mt-2 max-w-2xl">Define quiénes deben realizar esta práctica y la fecha de entrega oficial.</p>
              </div>
              <div className="flex items-center gap-3 bg-[#f3f3f4] p-2 rounded-2xl px-5">
                {[{ n: '01', active: false }, { n: '02', active: false }, { n: '03', active: true }].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && <div className={cn("h-1 w-8 rounded-full", s.active ? 'bg-[#004b71]' : 'bg-[#e2e2e3]')} />}
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs",
                      s.active ? 'bg-[#004b71] text-white shadow-md ring-4 ring-[#004b71]/10' : 'bg-[#e2e2e3] text-[#40484f]'
                    )}>{s.n}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Groups */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#c0c7d0]/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#cbe6ff]/30 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-[#004b71]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1a1c1d]">Seleccionar Grupos</h3>
                  </div>
                  <div className="space-y-3">
                    {(classes.length > 0 ? classes : [
                      { id: 1, name: 'Química Orgánica II-A', code: 'QA' },
                      { id: 2, name: 'Laboratorio Avanzado B', code: 'LB' },
                      { id: 3, name: 'Teoría Cuántica I', code: 'TC', disabled: true },
                    ]).map((c, i) => (
                      <div key={c.id} className={cn("flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer",
                        c.disabled ? 'opacity-60 bg-[#f3f3f4]/30' : 'bg-[#f3f3f4]/50 hover:bg-[#f3f3f4] group'
                      )} onClick={() => {
                        if (c.disabled) return;
                        setSelectedGroups(prev => ({ ...prev, [c.id]: !prev[c.id] }));
                      }}>
                        <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-bold",
                            i === 0 ? 'bg-[#86f8c8] text-[#007352]' : i === 1 ? 'bg-[#cbe6ff] text-[#004b71]' : 'bg-[#e2e2e3] text-[#40484f]'
                          )}>{c.code || c.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <h4 className={cn("font-bold", c.disabled ? 'text-[#40484f]/60' : 'text-[#1a1c1d]')}>{c.name}</h4>
                            <p className="text-xs text-[#40484f]">{c.disabled ? 'Curso completado' : `${Math.floor(Math.random() * 15) + 20} estudiantes`}</p>
                          </div>
                        </div>
                        <input type="checkbox" checked={selectedGroups[c.id] || false} disabled={c.disabled}
                          onChange={() => {}} className="w-5 h-5 rounded text-[#004b71] focus:ring-[#004b71]/20" />
                      </div>
                    ))}
                    {errors.groups && <p className="text-xs text-[#ba1a1a] mt-2 font-medium">{errors.groups}</p>}
                  </div>
                </div>
              </div>

              {/* Right: Schedule & Settings */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#c0c7d0]/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#cbe6ff]/30 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-[#004b71]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <h3 className="font-headline font-bold text-xl text-[#1a1c1d]">Programación</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-[#004b71] block mb-2">Fecha Límite de Entrega *</label>
                      <div className={cn("bg-[#f3f3f4] p-4 rounded-2xl flex items-center gap-4", errors.date && 'ring-2 ring-[#ba1a1a] bg-[#ffdad6]/20')}>
                        <span className="text-[#004b71]">📅</span>
                        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                          className="bg-transparent border-none focus:ring-0 w-full font-medium outline-none" />
                      </div>
                      {errors.date && <p className="text-xs text-[#ba1a1a] mt-1 font-medium">{errors.date}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#004b71] block mb-2">Configuración de Calificación</label>
                      <div className="space-y-4">
                        {[
                        { label: 'Auto-calificar cuestionario', state: autoGrade, set: setAutoGrade },
                        { label: 'Permitir múltiples intentos', state: multiAttempt, set: setMultiAttempt },
                        { label: 'Mostrar resultados al alumno', state: showResults, set: setShowResults },
                      ].map((opt, i) => (
                        <div key={i} onClick={() => opt.set(!opt.state)} className="flex items-center justify-between p-3 bg-[#f3f3f4]/50 rounded-xl cursor-pointer">
                          <span className="text-sm font-medium text-[#40484f]">{opt.label}</span>
                          <div className={cn("w-12 h-6 rounded-full relative transition-all", opt.state ? 'bg-[#004b71]' : 'bg-[#e2e2e3]')}>
                            <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all", opt.state ? 'right-1' : 'left-1')} />
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#86f8c8]/10 rounded-[2rem] p-6 border border-[#86f8c8]/20 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#86f8c8] flex items-center justify-center shrink-0">
                    <span className="text-2xl text-[#007352]">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#006c4d] text-lg">Listo para Publicar</h4>
                    <p className="text-sm text-[#40484f]">La práctica se publicará automáticamente en los muros de los alumnos seleccionados.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 flex items-center justify-between py-6 border-t border-[#c0c7d0]/10">
              <button onClick={handlePrev} className="px-8 py-3 text-[#004b71] font-bold hover:bg-[#cbe6ff]/30 rounded-xl transition-all">← Atrás</button>
              <button onClick={handleNext} className="px-10 py-3 bg-[#006c4d] text-white font-bold rounded-xl shadow-lg shadow-[#006c4d]/20 hover:scale-[1.02] active:scale-95 transition-all">
                Publicar Módulo 📤
              </button>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="flex items-center justify-between pt-12 border-t border-[#c0c7d0]/10">
          <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 font-semibold text-[#40484f] hover:bg-[#e8e8e9] rounded-xl transition-colors">Cancelar</button>
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button type="button" onClick={handlePrev} className="px-8 py-3 font-semibold text-[#004b71] border-2 border-[#004b71] rounded-xl hover:bg-[#004b71]/5 transition-colors">Anterior</button>
            )}
            <button type="button" onClick={handleNext}
              className="px-10 py-3 text-white rounded-xl font-semibold shadow-lg active:scale-95 transition-transform flex items-center gap-2"
              style={step === 3 ? { background: '#006c4d' } : { background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
              <span>{step === 3 ? 'Finalizar y Publicar' : 'Siguiente Paso'}</span>
              <span>{step === 3 ? '📤' : '→'}</span>
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default NewPracticePage;
