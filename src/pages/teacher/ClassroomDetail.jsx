import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { teacherService } from '../../services/teacherService';
import { useTeacherStore } from '../../store/teacherStore';

const ClassroomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const setSelectedClass = useTeacherStore(s => s.setSelectedClass);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    teacherService.getClassroomOverview(id).then(r => {
      setData(r);
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 max-w-4xl mx-auto"><div className="h-48 bg-white rounded-3xl animate-pulse border" /></div>;
  if (error || !data) return (
    <div className="p-12 text-center">
      <p className="text-lg font-bold text-[#1a1c1d]">{error || 'Aula no encontrada'}</p>
      <Link to="/teacher/dashboard" className="text-sm text-[#004b71] mt-4 inline-block">← Volver al panel</Link>
    </div>
  );

  const quickActions = [
    { label: 'Calificaciones', icon: '📊', path: '/teacher/grades', color: 'bg-[#cbe6ff]/30 text-[#004b71]' },
    { label: 'Monitoreo', icon: '📈', path: '/teacher/monitoring', color: 'bg-[#86f8c8]/30 text-[#006c4d]' },
    { label: 'Análisis Predictivo', icon: '🔮', path: '/teacher/predictive', color: 'bg-[#f8d8ff]/30 text-[#6c228c]' },
    { label: 'Comunidad', icon: '💬', path: '/teacher/community', color: 'bg-[#cbe6ff]/30 text-[#004b71]' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/teacher/dashboard')} className="text-xs font-bold text-[#40484f] hover:text-[#004b71] mb-4 flex items-center gap-1">← Panel Principal</button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-[#004b71]">{data.name}</h1>
            <p className="text-[#40484f] mt-1">{data.subject} · {data.code} · Sección {data.section}</p>
          </div>
          <button onClick={() => { setSelectedClass({ id: data.id, name: data.name }); navigate('/teacher/grades'); }}
            className="px-6 py-3 text-white font-bold rounded-xl shadow-lg text-sm"
            style={{ background: 'linear-gradient(135deg, #004b71 0%, #006494 100%)' }}>
            Ir a Calificaciones
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Estudiantes', value: data.studentCount, icon: '👥', bg: 'bg-[#cbe6ff]/20' },
          { label: 'Tareas', value: data.assignmentCount, icon: '📋', bg: 'bg-[#86f8c8]/20' },
          { label: 'Calificaciones', value: data.gradesCount, icon: '📝', bg: 'bg-[#f8d8ff]/20' },
          { label: 'En Riesgo', value: data.atRiskCount, icon: '⚠️', bg: 'bg-[#ffdad6]/30' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-[#c0c7d0]/10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", kpi.bg)}>{kpi.icon}</div>
              <div>
                <p className="text-2xl font-black text-[#004b71]">{kpi.value}</p>
                <p className="text-[10px] font-bold text-[#40484f]">{kpi.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-headline font-bold text-[#004b71] mb-4">Accesos Directos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {quickActions.map((action, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
            onClick={() => { setSelectedClass({ id: data.id, name: data.name }); navigate(action.path); }}
            className={cn("p-5 rounded-2xl text-left hover:shadow-md transition-all border border-transparent hover:border-current", action.color)}>
            <span className="text-2xl block mb-2">{action.icon}</span>
            <span className="font-bold text-sm">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#c0c7d0]/10">
        <h3 className="font-bold text-[#004b71] mb-4">Información del Aula</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {[
            ['Código', data.code],
            ['Materia', data.subject],
            ['Sección', data.section],
            ['Estudiantes', data.studentCount],
            ['Tareas', data.assignmentCount],
            ['Calificaciones', data.gradesCount],
          ].map(([label, value], i) => (
            <div key={i} className="p-3 bg-[#f3f3f4] rounded-xl">
              <p className="text-[10px] font-bold text-[#40484f] uppercase">{label}</p>
              <p className="font-bold text-[#004b71] mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetail;
