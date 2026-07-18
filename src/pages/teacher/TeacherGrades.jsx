import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';
import { useTeacherStore } from '../../store/teacherStore';

const TeacherGrades = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const { classes, selectedClass, setSelectedClass, fetchClasses } = useTeacherStore();

  useEffect(() => { fetchClasses(); }, []);

  const reloadGrades = useCallback(() => {
    if (!selectedClass) return;
    setLoading(true);
    teacherService.getGrades(selectedClass.id)
      .then(setStudents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedClass?.id]);

  useEffect(() => { reloadGrades(); }, [selectedClass?.id]);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveGrade = async (gradeId) => {
    if (!gradeId) return;
    const score = parseFloat(editValue);
    if (isNaN(score) || score < 0 || score > 100) return;
    try {
      await teacherService.updateGrade(gradeId, score);
      setEditing(null);
      reloadGrades();
    } catch { alert('Error al guardar la calificación'); }
  };

  const startEdit = (gradeId, currentScore) => {
    setEditing(gradeId);
    setEditValue(String(currentScore));
  };

  const withGrades = students.filter(s => s.status !== 'no_data');
  const avgScore = withGrades.length ? (withGrades.reduce((s, st) => s + st.average, 0) / withGrades.length / 10).toFixed(1) : '—';
  const passRate = students.length ? Math.round(students.filter(s => s.average !== null && s.average >= 60).length / students.length * 100) : 0;
  const maxScore = students.length ? Math.max(...students.map(s => s.average || 0)) / 10 : 0;
  const passCount = students.filter(s => s.average !== null && s.average >= 60).length;

  const getGradeId = (student, type) => {
    const record = student.gradeRecords?.find(g => g.type === type);
    return record ? record.id : null;
  };

  const getScore = (student, type) => {
    if (type === 'task') return student.tasks;
    if (type === 'lab') return student.lab3d;
    return student.exam;
  };

  const renderEditableCell = (student, type) => {
    const gradeId = getGradeId(student, type);
    const score = getScore(student, type);

    if (editing === gradeId) {
      return (
        <td className="px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <input type="number" min="0" max="100" value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSaveGrade(gradeId); if (e.key === 'Escape') setEditing(null); }}
              className="w-14 h-8 bg-white border border-gray-200 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-[#004b71]/20 outline-none"
              autoFocus />
            <button onClick={() => handleSaveGrade(gradeId)} className="p-1 hover:bg-emerald-50 rounded text-emerald-500">✓</button>
            <button onClick={() => setEditing(null)} className="p-1 hover:bg-red-50 rounded text-red-400">✕</button>
          </div>
        </td>
      );
    }

    return (
      <td className="px-4 py-4 text-center">
        <button onClick={() => gradeId && startEdit(gradeId, score)}
          className={cn("text-sm font-semibold cursor-pointer hover:text-[#004b71] transition-colors",
            student.status === 'no_data' ? 'text-gray-300' : 'text-sky-700'
          )}>
          {score > 0 ? (score / 10).toFixed(1) : '—'}
        </button>
      </td>
    );
  };

  if (loading && students.length === 0) {
    return (
      <div className="p-8 space-y-8">
        <div className="w-80 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-xl animate-pulse border" />)}
        </div>
        <div className="h-64 bg-white rounded-xl animate-pulse border" />
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
        <button onClick={reloadGrades} className="px-6 py-2.5 bg-[#004b71] text-white rounded-xl font-bold text-sm">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#004b71] tracking-tight font-headline">Calificaciones</h2>
          <p className="text-[#40484f] mt-1">Gestión del rendimiento académico</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => {
            if (!students.length) return;
            const headers = ['Estudiante', 'Tareas (20%)', 'Lab 3D (30%)', 'Examen (50%)', 'Promedio', 'Estado'];
            const rows = students.map(s => [s.name, s.tasks || 0, s.lab3d || 0, s.exam || 0, s.average || 0, s.status === 'good' ? 'Bueno' : s.status === 'fair' ? 'Regular' : s.status === 'no_data' ? 'Sin datos' : 'En Riesgo']);
            const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `calificaciones-${selectedClass?.name || 'curso'}.csv`; a.click();
            URL.revokeObjectURL(url);
          }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[#004b71] font-semibold text-sm bg-white border border-[#c0c7d0]/30 hover:bg-[#f3f3f4] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Exportar Reporte
          </button>
          <button onClick={async () => {
            if (!selectedClass) return;
            try {
              const res = await teacherService.publishGrades(selectedClass.id);
              const { gradesPublished, studentsNotified } = res.data || res;
              const toast = document.createElement('div');
              toast.className = 'fixed top-4 right-4 bg-[#006c4d] text-white px-6 py-4 rounded-2xl shadow-2xl z-50 text-sm font-bold';
              toast.textContent = `✅ ${gradesPublished} notas publicadas · ${studentsNotified} estudiantes notificados`;
              document.body.appendChild(toast);
              setTimeout(() => toast.remove(), 4000);
            } catch { alert('Error al publicar notas'); }
          }} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Publicar Notas
          </button>
        </div>
      </div>

      {/* Class Selector */}
      {classes.length > 0 && (
        <div className="flex gap-2 flex-wrap">
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

      {/* Bento Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Media Grupal', value: avgScore, suffix: '/10', trend: '+0.4 este periodo', trendColor: 'text-emerald-600', icon: 'analytics', bgIcon: true },
          { label: 'Tasa de Aprobación', value: passRate, suffix: '%', trend: `${passCount}/${students.length} Alumnos`, trendColor: 'text-emerald-600', icon: 'verified', bgIcon: true },
          { label: 'Simuladores', value: students.length ? (students.reduce((s, st) => s + (st.lab3d || 0), 0) / students.length / 10).toFixed(1) : '—', suffix: '/10', trend: 'Requiere refuerzo', trendColor: 'text-amber-500', icon: 'science', bgIcon: true },
          { label: 'Puntaje Máximo', value: maxScore.toFixed(1), suffix: '', trend: 'Lab. Destilación', trendColor: 'text-on-secondary-container', icon: 'workspace_premium', bgIcon: false, bgClass: 'bg-[#86f8c8]' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={cn("p-6 rounded-xl shadow-sm flex flex-col justify-between h-32 relative overflow-hidden", stat.bgClass || 'bg-white')}>
            <div className="z-10">
              <p className="text-xs font-bold text-[#40484f] uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-[#004b71] mt-1">{stat.value}<span className="text-sm font-medium text-slate-400">{stat.suffix}</span></h3>
            </div>
            <div className={cn("flex items-center gap-1 text-xs font-bold z-10", stat.trendColor)}>
              {stat.trendColor.includes('emerald') && <span>↑</span>}
              {stat.trend}
            </div>
            {stat.bgIcon && (
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <svg className="w-28 h-28 text-[#004b71]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[#f3f3f4] p-4 rounded-xl">
        <div className="relative flex-grow max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Buscar alumnos por nombre..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#004b71]/20 outline-none" />
        </div>
        <span className="text-xs font-bold text-[#40484f]">{filtered.length} estudiantes</span>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f3f3f4]/50">
                <th className="px-6 py-4 text-xs font-bold text-[#40484f] uppercase tracking-wider">Estudiante</th>
                <th className="px-6 py-4 text-xs font-bold text-[#40484f] uppercase tracking-wider text-center">Tareas (20%)</th>
                <th className="px-6 py-4 text-xs font-bold text-[#40484f] uppercase tracking-wider text-center">Lab 3D (30%)</th>
                <th className="px-6 py-4 text-xs font-bold text-[#40484f] uppercase tracking-wider text-center">Examen (50%)</th>
                <th className="px-6 py-4 text-xs font-bold text-[#40484f] uppercase tracking-wider text-center">Promedio</th>
                <th className="px-6 py-4 text-xs font-bold text-[#40484f] uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-sm font-semibold text-[#40484f]">No hay estudiantes</td></tr>
              ) : filtered.map((s, idx) => {
                const initials = (s.name || '??').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <tr key={s.id} className={cn("hover:bg-slate-50/50 transition-colors", s.status === 'risk' ? 'bg-[#ffdad6]/10' : '')}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs",
                          s.average >= 80 ? 'bg-[#cbe6ff] text-[#004b71]' :
                          s.status === 'risk' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                          s.status === 'no_data' ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-600'
                        )}>{initials}</div>
                        <div>
                          <p className="text-sm font-bold text-[#004b71]">{s.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">ID: {s.id?.slice(0, 8) || '—'}</p>
                        </div>
                      </div>
                    </td>
                    {['task', 'lab', 'exam'].map(type => renderEditableCell(s, type))}
                    <td className="px-6 py-4 text-center">
                      <div className={cn("inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm",
                        s.average >= 80 ? 'bg-[#86f8c8]/30 text-[#007352]' :
                        s.average >= 60 ? 'bg-gray-100 text-gray-600' :
                        s.status === 'no_data' ? 'bg-gray-50 text-gray-300' : 'bg-[#ba1a1a] text-white shadow-sm'
                      )}>
                        {s.status === 'no_data' ? '—' : (s.average / 10).toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => {
                          const gradeId = getGradeId(s, 'task') || getGradeId(s, 'lab') || getGradeId(s, 'exam');
                          if (gradeId) startEdit(gradeId, getScore(s, 'task') || getScore(s, 'lab') || getScore(s, 'exam'));
                        }} className="p-1.5 text-slate-400 hover:text-[#004b71] transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        {s.status === 'risk' && (
                          <button className="p-1.5 text-slate-400 hover:text-[#ba1a1a] transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-[#f3f3f4]/30 flex items-center justify-between">
          <p className="text-xs text-[#40484f] font-medium italic">Mostrando {filtered.length} de {students.length} estudiantes inscritos</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white p-8 rounded-2xl shadow-sm grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h4 className="text-2xl font-extrabold text-[#004b71] tracking-tight font-headline">Análisis de Curva de Aprendizaje</h4>
            <p className="text-[#40484f] text-sm leading-relaxed">
              Hemos detectado que el {passRate}% de tus estudiantes mejoró sus notas en los últimos módulos. 
              {selectedClass && ` Considera reforzar los temas con tu clase ${selectedClass.name}.`}
            </p>
            <div className="pt-2">
              <button className="text-[#6c228c] font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                Ver reporte detallado de IA <span>→</span>
              </button>
            </div>
          </div>
          <div className="h-48 bg-gradient-to-br from-[#cbe6ff] to-[#86f8c8]/30 rounded-xl flex items-center justify-center">
            <span className="text-4xl font-black text-[#004b71]/20">📊</span>
          </div>
        </div>

        <div className="lg:w-1/3 bg-[#e8e8e9]/40 p-8 rounded-2xl border border-white/50">
          <h4 className="text-lg font-bold text-[#004b71] mb-4 font-headline">Pendientes</h4>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <p className="text-sm font-medium text-[#40484f]">{students.filter(s => s.status === 'risk').length > 0 ? `Revisar reporte de ${students.filter(s => s.status === 'risk')[0]?.name || 'estudiantes'} en riesgo` : 'No hay estudiantes en riesgo'}</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <p className="text-sm font-medium text-[#40484f]">Subir rúbrica para el Examen Final</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <p className="text-sm font-medium text-[#40484f]">Validar asistencia del grupo</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherGrades;
