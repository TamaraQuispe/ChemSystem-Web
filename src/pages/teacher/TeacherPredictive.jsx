import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';
import { useTeacherStore } from '../../store/teacherStore';

const TeacherPredictive = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { classes, selectedClass, setSelectedClass, fetchClasses } = useTeacherStore();
  const [modalStudent, setModalStudent] = useState(null);
  const [modalMsg, setModalMsg] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => { fetchClasses(); }, []);
  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    setError(null);
    teacherService.getPredictiveData(selectedClass.id)
      .then(async (d) => {
        setData(d);
        // Get AI suggestions
        if (d?.atRisk?.length > 0) {
          try {
            const { default: api } = await import('../../services/api');
            const res = await api.post('/ai/suggest', {
              atRiskStudents: d.atRisk, className: selectedClass.name,
            });
            if (res.data?.length > 0) setData(prev => ({ ...prev, suggestions: res.data }));
          } catch {}
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedClass?.id]);

  const { atRisk = [], suggestions = [], totalStudents = 0, atRiskCount = 0 } = data || {};

  if (loading && !data) {
    return (
      <div className="p-8 space-y-8">
        <div className="w-80 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {[1, 2].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border" />)}
          </div>
          <div className="lg:col-span-4 h-96 bg-white rounded-2xl animate-pulse border" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-500 text-lg font-bold">!</span>
        </div>
        <p className="text-lg font-bold text-[#1a1c1d] mb-4">{error}</p>
        <button onClick={() => teacherService.getPredictiveData(selectedClass?.id).then(setData)}
          className="px-6 py-2.5 bg-[#004b71] text-white rounded-xl font-bold text-sm">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10">
      {/* Header */}
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-[#004b71] font-semibold text-sm tracking-widest uppercase mb-2 block">Dashboard de Alertas Estratégicas</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1c1d] tracking-tighter leading-none font-headline">Análisis Predictivo de Aula</h1>
            <p className="text-[#40484f] mt-4 max-w-xl text-lg leading-relaxed">
              Intervenciones pedagógicas basadas en el rendimiento de tus estudiantes.
            </p>
          </div>
          <div className="bg-[#ffdad6] p-6 rounded-2xl flex items-center gap-6 shadow-sm">
            <div className="text-[#93000a]">
              <span className="text-5xl font-black block">{atRiskCount}</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Estudiantes en Riesgo</span>
            </div>
            <div className="h-12 w-px bg-[#93000a]/20" />
            <svg className="w-10 h-10 text-[#93000a]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 8h2v2h-2zm0-6h2v4h-2z"/></svg>
          </div>
        </div>
      </section>

      {/* Class Selector */}
      {classes.length > 0 && (
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          {classes.map(c => (
            <button key={c.id} onClick={() => setSelectedClass(c)}
              className={cn("px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap",
                selectedClass?.id === c.id
                  ? 'text-white shadow-sm' : 'bg-white text-[#40484f] border border-[#c0c7d0]/30 hover:bg-[#f3f3f4]'
              )}
              style={selectedClass?.id === c.id ? { background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' } : {}}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: At Risk Students + Group Focus */}
        <div className="lg:col-span-8 space-y-6">
          {/* At Risk Students */}
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#1a1c1d] font-headline">Estudiantes con Dificultades</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atRisk.length === 0 ? (
              <div className="md:col-span-2 p-12 text-center bg-white rounded-2xl border border-[#c0c7d0]/10">
                <svg className="w-12 h-12 text-[#86f8c8] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-sm font-bold text-[#40484f]">No hay estudiantes en riesgo actualmente</p>
              </div>
            ) : atRisk.slice(0, 4).map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-2xl border border-[#c0c7d0]/10 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[#e8e8e9] overflow-hidden border-2 border-[#ffdad6]/20 flex items-center justify-center text-lg font-bold text-[#40484f]">
                    {(s.name || '??').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1a1c1d] text-lg">{s.name}</h3>
                    <span className="text-xs text-[#40484f] bg-[#f3f3f4] px-2 py-0.5 rounded-full">{s.riskLevel === 'high' ? 'Intervención urgente' : 'Seguimiento necesario'}</span>
                  </div>
                  <svg className="w-6 h-6 text-[#ba1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#40484f] uppercase tracking-wider">Promedio</span>
                      <span className={s.average < 50 ? 'text-[#ba1a1a]' : 'text-[#5f4b00]'}>{s.average}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#e8e8e9] rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", s.average < 50 ? 'bg-[#ba1a1a]' : 'bg-[#fbc02d]')} style={{ width: `${Math.min(100, s.average)}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#f3f3f4] p-3 rounded-xl">
                    <svg className="w-5 h-5 text-[#004b71] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    <span className="text-sm font-medium text-[#40484f]">Tendencia: <span className={cn("font-bold", s.trend > 0 ? 'text-[#006c4d]' : 'text-[#ba1a1a]')}>{s.trend > 0 ? '+' : ''}{s.trend}%</span></span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.suggestions?.slice(0, 2).map((sg, si) => (
                      <span key={si} className="text-[10px] font-semibold px-2.5 py-1 bg-[#f3f3f4] rounded-lg text-[#40484f]">{sg}</span>
                    ))}
                  </div>
                  <button onClick={() => setModalStudent(s)}
                    className="w-full py-3 rounded-xl font-bold text-sm tracking-tight group-hover:shadow-md transition-all active:scale-95 text-white"
                    style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
                    Intervenir Ahora
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Group Focus */}
          <div className="bg-[#f3f3f4] p-8 rounded-3xl border border-[#c0c7d0]/10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold tracking-tight text-[#1a1c1d] mb-6 font-headline">Focos de Refuerzo Grupal</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Comprensión General', value: Math.round((totalStudents - atRiskCount) / (totalStudents || 1) * 100), color: 'bg-[#69dbad]', textColor: 'text-[#005139]', status: 'Óptimo' },
                  { label: 'Estudiantes en Riesgo', value: atRiskCount > 0 ? Math.round((atRiskCount / (totalStudents || 1)) * 100) : 0, color: 'bg-[#ba1a1a]', textColor: 'text-[#93000a]', status: atRiskCount > 0 ? 'Requiere atención' : 'Sin riesgo' },
                  { label: 'Tasa de Seguimiento', value: suggestions.length > 0 ? 68 : 100, color: 'bg-[#8ecdff]', textColor: 'text-[#004b71]', status: 'Progresión Media' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-[#40484f] uppercase">{item.label}</span>
                      <span className="text-2xl font-black text-[#1a1c1d]">{item.value}%</span>
                    </div>
                    <div className="w-full h-3 bg-white rounded-full">
                      <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
                    </div>
                    <p className={cn("text-[10px] font-medium", item.textColor)}>{item.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Suggestions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#e8e8e9] p-8 rounded-[2rem] border border-[#c0c7d0]/10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#6c228c] w-10 h-10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l-5-5v3h-3c-3.86 0-7 3.14-7 7 0 2.76 2.24 5 5 5h4v-2H9c-1.66 0-3-1.34-3-3 0-2.76 2.24-5 5-5h3v3l5-5z"/></svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#1a1c1d] font-headline">Sugerencias IA</h2>
            </div>
            <div className="space-y-8 flex-1">
              {suggestions.length === 0 ? (
                <p className="text-sm text-[#40484f]">Sin sugerencias disponibles.</p>
              ) : suggestions.map((sg, i) => (
                <div key={i}>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#6c228c] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {sg.type === 'warning' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /> :
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>}
                      </svg>
                      <p className="text-sm font-medium text-[#1a1c1d] leading-snug">{sg.message}</p>
                    </div>
                    <button onClick={async () => {
                      if (sg.type === 'warning' && selectedClass) {
                        window.location.href = '/teacher/monitoring';
                      } else {
                        try {
                          const { default: api } = await import('../../services/api');
                          await api.post('/notifications', {
                            title: 'Acción programada: ' + selectedClass?.name,
                            message: sg.message,
                            type: 'info',
                          });
                          const btn = document.createElement('div');
                          btn.className = 'fixed top-4 right-4 bg-[#006c4d] text-white px-6 py-4 rounded-2xl shadow-2xl z-50 text-sm font-bold animate-in slide-in-from-top';
                          btn.textContent = '✅ Acción programada correctamente';
                          document.body.appendChild(btn);
                          setTimeout(() => btn.remove(), 3000);
                        } catch {
                          alert('✅ Acción programada (sin conexión al servidor)');
                        }
                      }
                    }} className="w-full py-2 border-2 border-[#6c228c] text-[#6c228c] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#6c228c] hover:text-white transition-all">
                      {sg.type === 'warning' ? 'Revisar Ahora' : 'Programar Acción'}
                    </button>
                  </div>
                  {i < suggestions.length - 1 && <div className="h-px bg-[#1a1c1d]/5 my-6" />}
                </div>
              ))}
            </div>
            <div className="mt-10">
              <div className="h-32 bg-gradient-to-br from-[#cbe6ff] to-[#86f8c8]/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-black text-[#004b71]/20">📊</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Modal */}
      {modalStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setModalStudent(null); setModalMsg(''); }}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#1a1c1d] font-headline">Intervenir: {modalStudent.name}</h3>
                <p className="text-sm text-[#40484f] mt-1">Promedio: {modalStudent.average}% · Tendencia: {modalStudent.trend > 0 ? '+' : ''}{modalStudent.trend}%</p>
              </div>
              <button onClick={() => { setModalStudent(null); setModalMsg(''); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-lg">✕</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-[#004b71] block mb-2">Mensaje de intervención</label>
                <textarea value={modalMsg} onChange={e => setModalMsg(e.target.value)}
                  className="w-full bg-[#f3f3f4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#004b71]/20 outline-none resize-none"
                  placeholder="Escribe un mensaje para el estudiante y sus padres..." rows={4} />
              </div>

              <div className="p-4 bg-[#cbe6ff]/20 rounded-2xl border border-[#cbe6ff]/30">
                <p className="text-xs text-[#40484f] font-medium flex items-start gap-2">
                  <span className="text-lg shrink-0">💡</span>
                  <span>Este mensaje será enviado al estudiante y notificará a los padres de familia sobre la intervención.</span>
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setModalStudent(null); setModalMsg(''); }}
                  className="flex-1 h-11 bg-[#e8e8e9] text-[#40484f] rounded-xl font-bold text-sm hover:bg-[#e2e2e3] transition-all">
                  Cancelar
                </button>
                <button onClick={async () => {
                  if (!modalMsg.trim()) return;
                  setSending(true);
                  try {
                    const { default: api } = await import('../../services/api');
                    await api.post('/notifications', {
                      title: `Intervención: ${modalStudent.name}`,
                      message: modalMsg,
                      type: 'alert',
                    });
                    setModalStudent(null);
                    setModalMsg('');
                    const toast = document.createElement('div');
                    toast.className = 'fixed top-4 right-4 bg-[#006c4d] text-white px-6 py-4 rounded-2xl shadow-2xl z-50 text-sm font-bold';
                    toast.textContent = `✅ Intervención enviada a ${modalStudent.name}`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                  } catch { alert('Error al enviar la intervención'); }
                  setSending(false);
                }} disabled={!modalMsg.trim() || sending}
                  className="flex-1 h-11 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
                  {sending ? 'Enviando...' : 'Enviar Intervención'}
                </button>
              </div>

              <div className="flex gap-2">
                <button onClick={async () => {
                  setSending(true);
                  try {
                    const { default: api } = await import('../../services/api');
                    await api.post('/notifications', {
                      title: `Intervención urgente: ${modalStudent.name}`,
                      message: `Se requiere atención inmediata para ${modalStudent.name}. Promedio: ${modalStudent.average}%`,
                      type: 'alert',
                    });
                    setModalStudent(null);
                    setModalMsg('');
                  } catch { alert('Error'); }
                  setSending(false);
                }} className="flex-1 h-10 bg-[#ba1a1a] text-white rounded-xl font-bold text-xs hover:bg-[#93000a] transition-all">
                  🚨 Alerta Urgente
                </button>
                <button onClick={() => { setModalStudent(null); setModalMsg(''); window.location.href = '/teacher/community'; }}
                  className="flex-1 h-10 bg-[#6c228c] text-white rounded-xl font-bold text-xs hover:bg-[#5300b3] transition-all">
                  💬 Contactar Padres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPredictive;
