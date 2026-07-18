import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Download, ChevronLeft, AlertTriangle, RefreshCw, Clock, BarChart3, Trophy } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const CertificateViewer = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState({});

  const fetchCerts = () => {
    setLoading(true);
    setError(null);
    api.get('/certificates/mine').then(r => {
      setCertificates(r.data || []);
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleGenerate = async (courseId) => {
    setGenerating(prev => ({ ...prev, [courseId]: true }));
    try {
      await api.post(`/certificates/courses/${courseId}/generate`);
      fetchCerts();
    } catch (err) {
      alert(err.message);
    } finally {
      setGenerating(prev => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-primary-dark tracking-tight">Mis Certificados</h1>
        <p className="text-text-secondary font-semibold mt-1">Certificados obtenidos al completar cursos</p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
        </div>
      ) : error ? (
        <Card className="p-12 text-center">
          <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-text-secondary mb-3">{error}</p>
          <button onClick={fetchCerts} className="px-5 py-2 bg-primary text-white rounded-2xl font-bold text-xs">Reintentar</button>
        </Card>
      ) : certificates.length === 0 ? (
        <Card className="p-12 text-center">
          <Award size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-black text-primary-dark mb-2">Sin certificados aún</h3>
          <p className="text-sm font-semibold text-text-secondary mb-6">Completa un curso y aprueba el examen final para obtener tu certificado.</p>
          <Link to="/courses" className="px-6 py-3 bg-primary-dark text-white rounded-2xl font-bold text-sm inline-block">
            Ver cursos disponibles
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {certificates.map((cert, idx) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="p-8 bg-gradient-to-br from-primary to-primary-dark text-white border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy size={20} className="text-secondary" />
                        <span className="text-[9px] font-bold text-secondary uppercase tracking-wider">Certificado</span>
                      </div>
                      <h2 className="text-2xl font-black text-white mb-1">{cert.metadata?.courseTitle || cert.course?.title}</h2>
                      <p className="text-sm font-semibold text-white/70">Emitido el {new Date(cert.issued_at).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-3xl font-black text-secondary">{cert.metadata?.finalScore || 0}%</p>
                      <p className="text-[9px] font-bold text-white/60">Puntaje final</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-white/70">
                      <BarChart3 size={14} /> {cert.metadata?.modulesCompleted || 0}/{cert.metadata?.totalModules || 0} módulos
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-white/70">
                      <Clock size={14} /> {cert.course?.duration_hours || '—'} horas
                    </div>
                  </div>
                  <div className="mt-4 text-[9px] font-mono text-white/40 select-all">
                    Código: {cert.certificate_code}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {certificates.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200">
          <h3 className="text-sm font-black text-primary-dark mb-2">¿Completaste un curso pero no ves tu certificado?</h3>
          <p className="text-xs font-semibold text-text-secondary mb-4">Si aprobaste el examen final de un curso, genera tu certificado aquí.</p>
          <Button
            onClick={() => handleGenerate(certificates[0]?.course_id || '')}
            isLoading={generating[certificates[0]?.course_id]}
            className="bg-amber-500 text-white rounded-2xl font-bold text-xs px-6 h-11"
          >
            <Award size={16} /> Generar certificado
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CertificateViewer;
