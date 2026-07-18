import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, TrendingUp, AlertTriangle, RefreshCw, Check, X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
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
  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    setError(null);
    teacherService.getGrades(selectedClass.id)
      .then(setStudents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedClass?.id]);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reloadGrades = useCallback(() => {
    if (!selectedClass) return;
    teacherService.getGrades(selectedClass.id).then(setStudents);
  }, [selectedClass?.id]);

  const handleSaveGrade = async (gradeId) => {
    if (!gradeId) return;
    const score = parseFloat(editValue);
    if (isNaN(score) || score < 0 || score > 100) return;
    try {
      await teacherService.updateGrade(gradeId, score);
      setEditing(null);
      reloadGrades();
    } catch {
      alert('Error al guardar la calificación');
    }
  };

  const startEdit = (gradeId, currentScore) => {
    setEditing(gradeId);
    setEditValue(String(currentScore));
  };

  const avgScore = students.length ? Math.round(students.reduce((s, st) => s + st.average, 0) / students.length) : 0;
  const passRate = students.length ? Math.round(students.filter(s => s.average >= 60).length / students.length * 100) : 0;
  const maxScore = students.length ? Math.max(...students.map(s => s.average)) : 0;

  if (loading && students.length === 0) {
    return (
      <div className="space-y-8">
        <div className="w-80 h-9 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
        </div>
        <div className="h-64 bg-white rounded-3xl animate-pulse border border-gray-100" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
        <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
        <button onClick={() => teacherService.getGrades(selectedClass?.id).then(setStudents)}
          className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
      </Card>
    );
  }

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
        <td className="py-4">
          <div className="flex items-center gap-1">
            <input type="number" min="0" max="100" value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSaveGrade(gradeId); if (e.key === 'Escape') setEditing(null); }}
              className="w-16 h-8 bg-white border border-gray-200 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-primary/20 outline-none"
              autoFocus />
            <button onClick={() => handleSaveGrade(gradeId)} className="p-1 hover:bg-emerald-50 rounded text-emerald-500"><Check size={14} /></button>
            <button onClick={() => setEditing(null)} className="p-1 hover:bg-red-50 rounded text-red-400"><X size={14} /></button>
          </div>
        </td>
      );
    }

    return (
      <td className="py-4">
        <button onClick={() => gradeId && startEdit(gradeId, score)}
          className="text-xs font-bold text-text-main hover:bg-gray-50 px-2 py-1 rounded-lg transition-all cursor-pointer">
          {score}
        </button>
      </td>
    );
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary-dark tracking-tight">Calificaciones</h1>
            <p className="text-text-secondary font-semibold mt-1">Gestiona las notas de tus estudiantes</p>
          </div>
        </div>
      </motion.div>

      {classes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {classes.map(c => (
            <button key={c.id} onClick={() => setSelectedClass(c)}
              className={cn("px-5 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap",
                selectedClass?.id === c.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-text-secondary border border-gray-100"
              )}>{c.name}</button>
          ))}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Promedio General', value: avgScore, icon: TrendingUp, color: 'bg-blue-50', textColor: 'text-blue-500' },
          { label: 'Tasa de Aprobación', value: `${passRate}%`, icon: TrendingUp, color: 'bg-emerald-50', textColor: 'text-emerald-500' },
          { label: 'Puntaje Máximo', value: maxScore, icon: TrendingUp, color: 'bg-violet-50', textColor: 'text-violet-500' },
          { label: 'Total Estudiantes', value: students.length, icon: TrendingUp, color: 'bg-amber-50', textColor: 'text-amber-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-premium">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", stat.color)}>
                <stat.icon size={20} className={stat.textColor} />
              </div>
              <div>
                <p className="text-2xl font-black text-primary-dark">{stat.value}</p>
                <p className="text-[10px] font-bold text-text-secondary">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-grow max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Buscar estudiante..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-gray-50 border-none rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <span className="text-[10px] font-bold text-text-secondary ml-auto">Click en la nota para editar</span>
            <button onClick={reloadGrades} className="p-2.5 text-text-secondary hover:bg-gray-100 rounded-xl transition-all">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Estudiante</th>
                  <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Tareas (20%)</th>
                  <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Lab 3D (30%)</th>
                  <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Examen (50%)</th>
                  <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Promedio</th>
                  <th className="pb-3 text-[10px] font-black text-text-secondary uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-sm font-semibold text-text-secondary">No hay estudiantes</td></tr>
                ) : filtered.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 overflow-hidden">
                          <img src={s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-black text-text-main">{s.name}</span>
                      </div>
                    </td>
                    {renderEditableCell(s, 'task')}
                    {renderEditableCell(s, 'lab')}
                    {renderEditableCell(s, 'exam')}
                    <td className="py-4">
                      <span className={cn("text-xs font-black px-2.5 py-1 rounded-lg",
                        s.average >= 80 ? 'bg-emerald-50 text-emerald-500' :
                        s.average >= 60 ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                      )}>{s.average}</span>
                    </td>
                    <td className="py-4">
                      <span className={cn("text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                        s.status === 'good' ? 'bg-emerald-50 text-emerald-500' :
                        s.status === 'fair' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                      )}>
                        {s.status === 'good' ? 'Bueno' : s.status === 'fair' ? 'Regular' : 'En Riesgo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TeacherGrades;
