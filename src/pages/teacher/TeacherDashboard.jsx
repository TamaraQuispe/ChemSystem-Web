import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';
import { useTeacherStore } from '../../store/teacherStore';

const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', section: 'A' });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const setSelectedClass = useTeacherStore(s => s.setSelectedClass);
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', subject: '', section: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    teacherService.getDashboard()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) return;
    setCreating(true);
    try {
      await teacherService.createClass(form);
      setShowCreateModal(false);
      setForm({ name: '', subject: '', section: 'A' });
      fetchData();
    } catch (err) { alert(err.message); }
    setCreating(false);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    if (!editingClass || !editForm.name.trim() || !editForm.subject.trim()) return;
    setSavingEdit(true);
    try {
      await teacherService.updateClassroom(editingClass.id, editForm);
      setEditingClass(null);
      fetchData();
    } catch (err) { alert(err.message); }
    setSavingEdit(false);
  };

  if (loading) return (
    <div className="space-y-8 p-8">
      <div className="w-96 h-9 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-72 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <span className="text-red-500 text-lg font-bold">!</span>
      </div>
      <p className="text-lg font-bold text-[#1a1c1d] mb-4">{error}</p>
      <button onClick={fetchData} className="px-6 py-2.5 bg-[#004b71] text-white rounded-xl font-bold text-sm">Reintentar</button>
    </div>
  );

  const { classrooms = [], stats = {}, activity = [] } = data || {};

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#004b71] mb-2 font-headline">Panel de Control Docente</h1>
          <p className="text-[#40484f] max-w-2xl">Gestiona tus aulas virtuales, supervisa el progreso de tus estudiantes y organiza recursos científicos.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => {
            if (!data) return;
            const { classrooms = [], activity = [] } = data;
            const rows = [['Aula', 'Materia', 'Código', 'Estudiantes', 'Progreso %', 'Tareas']];
            classrooms.forEach(c => rows.push([c.name, c.subject, c.code, c.studentCount, c.progress, c.assignmentCount]));
            rows.push([]);
            rows.push(['ACTIVIDAD RECIENTE']);
            rows.push(['Tipo', 'Título', 'Mensaje', 'Tiempo']);
            activity.forEach(a => rows.push([a.type, a.title, a.message || '', a.time]));
            const csv = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `reporte-docente-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
            URL.revokeObjectURL(url);
          }} className="bg-[#e8e8e9] px-4 py-2 rounded-lg font-medium text-[#004b71] hover:bg-[#e2e2e3] transition-colors text-sm font-bold">Ver Reportes</button>
          <button onClick={() => setShowCreateModal(true)} className="px-5 py-2 rounded-lg font-semibold shadow-md text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>Configurar Aula</button>
        </div>
      </section>

      {/* Quick Actions Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="md:col-span-2 bg-white p-8 rounded-2xl flex flex-col justify-between group cursor-pointer hover:bg-[#004b71] transition-colors duration-300"
          onClick={() => navigate('/teacher/grades')}>
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#004b71]/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6 text-[#004b71] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a1c1d] group-hover:text-white mb-2">Asignar Tareas</h3>
            <p className="text-[#40484f] group-hover:text-white/80 text-sm">Distribuye guías de laboratorio y ejercicios a tus grupos.</p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[#004b71] group-hover:text-white font-bold text-sm">
            Comenzar ahora <span>→</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#86f8c8] p-6 rounded-2xl flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => navigate('/teacher/monitoring')}>
          <div className="w-10 h-10 rounded-lg bg-[#006c4d]/10 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#006c4d]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#005139]">Nuevas Actividades</h3>
            <p className="text-[#005139]/70 text-xs mt-1">Explora simuladores y recursos actualizados.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-[#f8d8ff] p-6 rounded-2xl flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => navigate('/teacher/community')}>
          <div className="w-10 h-10 rounded-lg bg-[#6c228c]/10 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#6c228c]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#320047]">Recursos Compartidos</h3>
            <p className="text-[#320047]/70 text-xs mt-1">Accede a la biblioteca de la comunidad.</p>
          </div>
        </motion.div>
      </div>

      {/* Classroom Cards Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#004b71] font-headline">Aulas Activas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classrooms.map((c, idx) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#004b71]/5 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#004b71] tracking-widest uppercase">
                  {c.studentCount} Estudiantes
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1a1c1d] mb-1">{c.name}</h3>
                <p className="text-xs text-[#40484f] mb-6">{c.subject} • Sección {c.section} • {c.code}</p>
                <div className="flex justify-between items-center text-xs mb-4">
                  <span className="text-[#40484f]">Progreso del currículo</span>
                  <span className="font-bold text-[#004b71]">{c.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#edeeef] rounded-full mb-6">
                  <div className="h-full bg-[#004b71] rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingClass(c)}
                    className="flex-1 py-2 text-xs font-bold text-[#004b71] border border-[#c0c7d0]/30 rounded-lg hover:bg-[#f3f3f4] transition-colors">
                    Gestionar
                  </button>
                  <button onClick={() => navigate(`/teacher/classroom/${c.id}`)}
                    className="flex-1 py-2 text-xs font-bold text-white rounded-lg" style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
                    Ver Aula
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* New Classroom Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-white rounded-2xl overflow-hidden border-2 border-dashed border-[#c0c7d0]/50 flex flex-col items-center justify-center min-h-[320px] group cursor-pointer hover:border-[#004b71]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#edeeef] flex items-center justify-center group-hover:bg-[#cbe6ff] transition-colors mb-4">
              <span className="text-[#40484f] group-hover:text-[#004b71] text-2xl font-bold">+</span>
            </div>
            <h3 className="font-bold text-[#40484f]">Nueva Aula</h3>
            <p className="text-xs text-[#40484f]/60">Crea un nuevo grupo de estudio</p>
          </motion.div>
        </div>
      </section>

      {/* Activity + Semester Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#f3f3f4] rounded-3xl p-8">
          <h3 className="text-xl font-bold text-[#004b71] mb-6 flex items-center gap-2 font-headline">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Actividad Reciente
          </h3>
          <div className="space-y-6">
            {activity.length === 0 ? (
              <p className="text-sm text-[#40484f]">Sin actividad reciente.</p>
            ) : activity.slice(0, 5).map((a, i) => (
              <div key={i} className={`flex items-start gap-4 ${i < Math.min(activity.length, 5) - 1 ? 'pb-6 border-b border-[#c0c7d0]/10' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  a.type === 'alert' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                  a.type === 'achievement' ? 'bg-[#86f8c8] text-[#006c4d]' : 'bg-[#cbe6ff] text-[#004b71]'
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {a.type === 'alert' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /> :
                     a.type === 'achievement' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> :
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a1c1d]">{a.title}</p>
                  <p className="text-xs text-[#40484f] truncate">{a.message}</p>
                </div>
                <span className="text-[10px] font-bold text-[#40484f]/50 uppercase shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Semester Status */}
        <div className="bg-[#004b71] text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2 font-headline">Estado del Semestre</h3>
            <p className="text-white/70 text-xs mb-8">Resumen general de tus {classrooms.length} aulas activas.</p>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2 font-bold uppercase tracking-widest">
                  <span>Progreso Promedio</span>
                  <span>{stats.avgProgress || 0}%</span>
                </div>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#86f8c8]" style={{ width: `${stats.avgProgress || 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2 font-bold uppercase tracking-widest">
                  <span>Aulas Activas</span>
                  <span>{stats.totalClassrooms || 0}</span>
                </div>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#86f8c8]" style={{ width: `${Math.min(100, ((stats.totalClassrooms || 0) / 5) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 bg-white/10 p-4 rounded-2xl backdrop-blur-md relative z-10">
            <p className="text-[10px] font-bold text-[#86f8c8] uppercase tracking-widest mb-1">Total Estudiantes</p>
            <p className="text-2xl font-bold">{stats.totalStudents || 0}</p>
          </div>
        </div>
      </div>

      {/* Create Classroom Modal */}
      {/* Edit Classroom Modal */}
      {editingClass && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingClass(null)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1a1c1d] font-headline">Gestionar: {editingClass.name}</h2>
              <button onClick={() => { setEditingClass(null); setEditForm({ name: '', subject: '', section: '' }); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">✕</button>
            </div>
            <form onSubmit={handleUpdateClass} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#40484f] mb-1 block">Nombre del aula</label>
                <input value={editForm.name || editingClass.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full h-12 px-4 bg-[#f3f3f4] border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#004b71]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#40484f] mb-1 block">Materia</label>
                <input value={editForm.subject || editingClass.subject} onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))} required
                  className="w-full h-12 px-4 bg-[#f3f3f4] border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#004b71]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#40484f] mb-1 block">Sección</label>
                <input value={editForm.section || editingClass.section} onChange={e => setEditForm(f => ({ ...f, section: e.target.value }))}
                  className="w-full h-12 px-4 bg-[#f3f3f4] border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#004b71]/20 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setEditingClass(null); setEditForm({ name: '', subject: '', section: '' }); }}
                  className="flex-1 h-11 bg-[#e8e8e9] text-[#40484f] rounded-xl font-bold text-sm">Cancelar</button>
                <button type="submit" disabled={savingEdit}
                  className="flex-1 h-11 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
                  {savingEdit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1a1c1d] font-headline">Nueva Aula</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">✕</button>
            </div>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#40484f] mb-1 block">Nombre del aula</label>
                <input placeholder="Ej: Química Orgánica II" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full h-12 px-4 bg-[#f3f3f4] border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#004b71]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#40484f] mb-1 block">Materia</label>
                <input placeholder="Ej: Química Orgánica" value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required
                  className="w-full h-12 px-4 bg-[#f3f3f4] border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#004b71]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#40484f] mb-1 block">Sección</label>
                <input placeholder="A" value={form.section}
                  onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                  className="w-full h-12 px-4 bg-[#f3f3f4] border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#004b71]/20 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="flex-1 h-11 bg-[#e8e8e9] text-[#40484f] rounded-xl font-bold text-sm">Cancelar</button>
                <button type="submit" disabled={creating}
                  className="flex-1 h-11 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
                  {creating ? 'Creando...' : 'Crear Aula'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
