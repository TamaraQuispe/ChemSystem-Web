import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, ChevronLeft, AlertTriangle, Sparkles, Trophy, Clock, BarChart3, GraduationCap, Share2, Bolt, BookOpen, BadgeCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import api from '../../services/api';

const COLORS = ['#86f8c8', '#004b71', '#6c228c'];

function generateCertificateHTML(cert, userName) {
  const courseTitle = cert.metadata?.courseTitle || cert.course?.title || 'Curso';
  const date = new Date(cert.issued_at).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
  const code = cert.certificate_code;
  const score = cert.metadata?.finalScore || 0;
  const modules = `${cert.metadata?.modulesCompleted || 0}/${cert.metadata?.totalModules || 0}`;

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"/><title>Certificado - ${courseTitle}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #f9f9fa; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 40px; }
  .cert { max-width: 900px; width: 100%; background: white; border-radius: 24px; padding: 60px 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); position: relative; overflow: hidden; border: 1px solid #e2e2e3; }
  .cert::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #004b71, #006494, #6c228c); }
  .border-deco { position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 1px solid #e2e2e3; border-radius: 16px; pointer-events: none; }
  .badge { width: 100px; height: 100px; background: linear-gradient(135deg, #004b71, #006494); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; box-shadow: 0 8px 32px rgba(0,75,113,0.2); }
  .badge svg { width: 50px; height: 50px; fill: white; }
  h1 { font-family: 'Playfair Display', serif; font-size: 42px; color: #1a1c1d; text-align: center; margin-bottom: 8px; }
  .subtitle { text-align: center; color: #40484f; font-size: 16px; margin-bottom: 40px; }
  .course-badge { display: flex; align-items: center; gap: 16px; background: #f3f3f4; border-radius: 16px; padding: 20px 28px; margin-bottom: 36px; justify-content: center; }
  .course-badge h2 { font-size: 22px; font-weight: 700; color: #1a1c1d; }
  .course-badge p { font-size: 14px; color: #40484f; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
  .stat { text-align: center; padding: 16px; background: #f9f9fa; border-radius: 12px; }
  .stat .num { font-size: 28px; font-weight: 800; color: #1a1c1d; }
  .stat .label { font-size: 12px; color: #707880; margin-top: 4px; }
  .footer { text-align: center; border-top: 1px solid #e2e2e3; padding-top: 24px; margin-top: 8px; }
  .footer .code { font-family: monospace; font-size: 12px; color: #707880; letter-spacing: 1px; }
  .footer .verify { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; color: #004b71; font-weight: 600; margin-bottom: 8px; }
  @media print { body { padding: 0; } .cert { box-shadow: none; border: none; } }
</style></head><body>
<div class="cert">
  <div class="border-deco"></div>
  <div class="badge"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
  <h1>Certificado de Finalización</h1>
  <p class="subtitle">Otorgado por ChemSystem Education a</p>
  <h1 style="font-size: 36px; color: #004b71;">${userName}</h1>
  <p class="subtitle" style="margin-bottom: 32px;">Por completar exitosamente el curso</p>
  <div class="course-badge">
    <div style="text-align: center;">
      <h2>${courseTitle}</h2>
      <p>Puntaje final: ${score}% &middot; ${modules} módulos &middot; ${date}</p>
    </div>
  </div>
  <div class="stats">
    <div class="stat"><div class="num">${score}%</div><div class="label">Puntaje Final</div></div>
    <div class="stat"><div class="num">${modules}</div><div class="label">Módulos</div></div>
    <div class="stat"><div class="num">${date.split(' de ')[0]}</div><div class="label">${date.split(' de ')[1] || date}</div></div>
  </div>
  <div class="footer">
    <div class="verify"><svg width="16" height="16" viewBox="0 0 24 24" fill="#004b71"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> Verificado por ChemSystem Education</div>
    <div class="code">Código: ${code}</div>
  </div>
</div>
</body></html>`;
}

const ConfettiAnimation = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const fragments = [];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;width:6px;height:6px;background:${COLORS[i % 3]};opacity:${0.3 + Math.random() * 0.4};border-radius:2px;left:${Math.random() * 100}%;top:-10px;animation:confettiFall ${3 + Math.random() * 4}s linear infinite;animation-delay:${Math.random() * 3}s;`;
      fragments.push(el);
      container.appendChild(el);
    }
    const style = document.createElement('style');
    style.textContent = `@keyframes confettiFall{to{transform:translateY(100vh) rotate(720deg);opacity:0}}`;
    document.head.appendChild(style);
    return () => { fragments.forEach(el => el.remove()); style.remove(); };
  }, []);
  return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />;
};

const CertificateCard = ({ cert, userName, index }) => {
  const courseTitle = cert.metadata?.courseTitle || cert.course?.title || 'Curso';
  const date = new Date(cert.issued_at).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
  const score = cert.metadata?.finalScore || 0;
  const modulesCompleted = cert.metadata?.modulesCompleted || 0;
  const totalModules = cert.metadata?.totalModules || 0;
  const code = cert.certificate_code;

  const handleDownload = () => {
    const html = generateCertificateHTML(cert, userName);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado-${cert.course?.slug || 'curso'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: `Certificado - ${courseTitle}`, text: `¡Completé ${courseTitle} en ChemSystem! 🎉` });
    } catch { /* fallback */ }
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl border border-outline-variant/20 shadow-[0_12px_32px_rgba(26,28,29,0.06)]">
      <ConfettiAnimation />

      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary-container to-tertiary" />

      <div className="p-8 md:p-10 relative z-10">
        {/* Badge + Title */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center border-4 border-white shadow-xl mb-6"
          >
            <Trophy size={52} className="text-secondary-fixed" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-2 tracking-tight"
          >
            ¡Felicidades, {userName}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-on-surface-variant max-w-xl leading-relaxed"
          >
            Has demostrado un dominio excepcional de los contenidos del curso. Tu dedicación al aprendizaje científico marca un nuevo hito en tu formación académica.
          </motion.p>
        </div>

        {/* Course Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-surface-container-low rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-10 border border-outline-variant/10"
        >
          <div className="w-20 h-20 shrink-0 bg-secondary-fixed/40 rounded-2xl flex items-center justify-center">
            <GraduationCap size={36} className="text-on-secondary-container" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className="font-headline font-bold text-2xl text-on-surface mb-1">{courseTitle}</h3>
            <p className="text-on-surface-variant mb-2">Certificación Profesional ChemSystem</p>
            <div className="flex items-center gap-2 text-primary font-semibold text-sm justify-center md:justify-start">
              <BadgeCheck size={16} />
              Verificado por ChemSystem Education
            </div>
          </div>
          <div className="text-center shrink-0">
            <p className="text-3xl font-headline font-extrabold text-primary">{score}%</p>
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter">Puntaje Final</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Bolt size={24} className="text-primary" />
            </div>
            <p className="text-3xl font-headline font-extrabold text-on-surface">{score}</p>
            <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter">Puntaje %</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
              <BookOpen size={24} className="text-secondary" />
            </div>
            <p className="text-3xl font-headline font-extrabold text-on-surface">{modulesCompleted}/{totalModules}</p>
            <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter">Módulos Completados</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-tertiary/10 rounded-full flex items-center justify-center">
              <Award size={24} className="text-tertiary" />
            </div>
            <p className="text-3xl font-headline font-extrabold text-on-surface">Obtenida</p>
            <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter">Certificación</p>
          </div>
        </motion.div>

        {/* Certificate Code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8"
        >
          <p className="text-[10px] font-mono text-on-surface-variant/40 tracking-wider select-all">
            Código: {code} · Emitido el {date}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-headline font-bold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Download size={20} />
            Descargar Certificado
          </button>
          <button onClick={() => window.location.href = '/courses'}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-surface-container-high text-on-surface rounded-xl font-headline font-bold hover:bg-surface-variant active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
            Volver a Cursos
          </button>
        </motion.div>

        {/* Share Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-8 p-4 bg-tertiary-fixed/30 rounded-2xl border border-tertiary/10 flex items-center gap-4 max-w-sm mx-auto"
        >
          <div className="w-10 h-10 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center shrink-0">
            {typeof navigator?.share === 'function' ? (
              <button onClick={handleShare} className="flex items-center justify-center w-full h-full">
                <Share2 size={16} />
              </button>
            ) : (
              <Share2 size={16} />
            )}
          </div>
          <p className="text-left text-sm text-on-tertiary-fixed-variant leading-tight">
            ¿Te sientes orgulloso? Comparte tu logro con la <strong>Comunidad</strong>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const CertificateViewer = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('Estudiante');

  const fetchCerts = () => {
    setLoading(true);
    setError(null);
    api.get('/certificates/mine').then(r => {
      const certs = r.data || [];
      setCertificates(certs);
      if (certs.length > 0) {
        try { api.get('/users/me').then(r2 => {
          if (r2.data?.name) setUserName(r2.data.name.split(' ')[0]);
        }); } catch {}
      }
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCerts(); }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="h-96 bg-surface-container-lowest rounded-3xl animate-pulse border border-outline-variant/10" />
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto">
      <div className="p-12 text-center bg-white rounded-3xl border border-outline-variant/20">
        <AlertTriangle size={40} className="text-gray-300 mx-auto mb-4" />
        <p className="text-lg font-bold text-on-surface mb-3">{error}</p>
        <button onClick={fetchCerts} className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm">
          Reintentar
        </button>
      </div>
    </div>
  );

  if (certificates.length === 0) return (
    <div className="max-w-4xl mx-auto">
      <div className="p-16 text-center bg-white rounded-3xl border border-outline-variant/20">
        <Award size={56} className="text-gray-200 mx-auto mb-4" />
        <h3 className="text-2xl font-headline font-extrabold text-on-surface mb-2">Sin certificados aún</h3>
        <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
          Completa un curso y aprueba el examen final para obtener tu certificado de finalización.
        </p>
        <a href="/courses" className="inline-flex px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl font-headline font-bold shadow-lg hover:shadow-primary/20 transition-all">
          Ver cursos disponibles
        </a>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center md:text-left mb-2">
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Mis Certificados</h1>
        <p className="text-on-surface-variant mt-1">Certificados obtenidos al completar cursos en ChemSystem</p>
      </div>

      {certificates.map((cert, idx) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.15 }}
        >
          <CertificateCard cert={cert} userName={userName} index={idx} />
        </motion.div>
      ))}
    </div>
  );
};

export default CertificateViewer;
