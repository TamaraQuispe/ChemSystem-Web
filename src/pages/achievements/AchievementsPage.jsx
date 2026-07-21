import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Award, Star, Zap, Clock, Sparkles, TrendingUp, AlertTriangle,
  RefreshCw, Check, Lock, Target, Medal, BrainCircuit, GraduationCap,
  FlaskConical, Atom, Beaker, Microscope, BookOpen, Users, Rocket,
  Diamond, Crown, ShieldCheck, Flame, Gem, Orbit, Siren,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { studentService } from '../../services/studentService';
import { useAchievementStore } from '../../store/achievementStore';

const ICONS = {
  trophy: Trophy, star: Star, zap: Zap, target: Target, medal: Medal,
  brain: BrainCircuit, flask: FlaskConical, atom: Atom, beaker: Beaker,
  microscope: Microscope, book: BookOpen, users: Users, rocket: Rocket,
  diamond: Diamond, crown: Crown, shield: ShieldCheck, flame: Flame,
  gem: Gem, orbit: Orbit, siren: Siren,
};

const rarityConfig = {
  common: { label: 'COMÚN', bg: 'bg-secondary-container/30 text-on-secondary-container', border: 'border-secondary/10' },
  rare: { label: 'RARO', bg: 'bg-primary-container/20 text-on-primary-fixed-variant', border: 'border-primary/10' },
  epic: { label: 'ÉPICO', bg: 'bg-tertiary-fixed/30 text-tertiary', border: 'border-tertiary/10' },
  legendary: { label: 'LEGENDARIO', bg: 'bg-amber-100 text-amber-700', border: 'border-amber-200/30' },
};

const RARITY_ORDER = ['legendary', 'epic', 'rare', 'common'];

const ACHIEVEMENT_POOL = [
  { icon: 'flask', title: 'Primer Laboratorio', desc: 'Completa tu primer experimento en el laboratorio virtual.', rarity: 'common', xp: 50 },
  { icon: 'zap', title: 'Racha de Estudio', desc: 'Mantén una racha de estudio de 7 días consecutivos.', rarity: 'rare', xp: 100 },
  { icon: 'brain', title: 'Maestro de Estequiometría', desc: 'Resuelve correctamente 20 ejercicios de estequiometría.', rarity: 'epic', xp: 250 },
  { icon: 'star', title: 'Estrella del Mes', desc: 'Obtén el mejor desempeño del mes en tu grupo.', rarity: 'legendary', xp: 500 },
  { icon: 'atom', title: 'Explorador Atómico', desc: 'Completa el módulo de estructura atómica con 90%+.', rarity: 'common', xp: 60 },
  { icon: 'beaker', title: 'Alquimista', desc: 'Realiza 15 síntesis exitosas en el laboratorio virtual.', rarity: 'rare', xp: 150 },
  { icon: 'microscope', title: 'Doctor en Química', desc: 'Completa todos los módulos de un curso avanzado.', rarity: 'epic', xp: 350 },
  { icon: 'trophy', title: 'El Legado de Mendeleiev', desc: 'Completa el 100% de los desafíos y mentoriza a 50 compañeros.', rarity: 'legendary', xp: 1000 },
  { icon: 'flame', title: 'Fuera de Serie', desc: 'Mantén una racha de 30 días de actividad continua.', rarity: 'epic', xp: 300 },
  { icon: 'gem', title: 'Químico Versátil', desc: 'Completa experimentos en 5 áreas distintas de la química.', rarity: 'rare', xp: 120 },
  { icon: 'rocket', title: 'Lanzamiento Exitosa', desc: 'Completa el primer módulo de cualquier curso.', rarity: 'common', xp: 40 },
  { icon: 'diamond', title: 'Maestro del pH', desc: 'Completa 10 titulaciones sin errores.', rarity: 'rare', xp: 130 },
  { icon: 'crown', title: 'Químico Real', desc: 'Alcanza el nivel 20 en la plataforma.', rarity: 'epic', xp: 400 },
  { icon: 'shield', title: 'Guardian de la Seguridad', desc: 'Completa el módulo de seguridad sin errores.', rarity: 'common', xp: 55 },
  { icon: 'orbit', title: 'Molecular Architect', desc: 'Construye 25 moléculas en el simulador 3D.', rarity: 'rare', xp: 160 },
  { icon: 'siren', title: 'Científico de Datos', desc: 'Analiza 100 conjuntos de datos experimentales.', rarity: 'epic', xp: 280 },
  { icon: 'book', title: 'Bibliotecario Químico', desc: 'Completa 50 lecturas en la biblioteca de recursos.', rarity: 'common', xp: 45 },
  { icon: 'users', title: 'Mentor Estrella', desc: 'Ayuda a 20 compañeros en el foro de la comunidad.', rarity: 'epic', xp: 320 },
];

const LegendarySection = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-8">
      <h2 className="text-2xl font-headline font-extrabold text-on-surface">Insignias Legendarias</h2>
      <div className="h-1 w-12 bg-tertiary rounded-full" />
    </div>
    <div className="bg-gradient-to-br from-tertiary/5 to-[#f8d8ff]/20 p-1 rounded-[2rem]">
      <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-[1.9rem] p-8 md:p-12 border border-tertiary/10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-tertiary/20 blur-3xl rounded-full group-hover:bg-tertiary/30 transition-all duration-700" />
            <div className="w-40 h-40 rounded-full border-4 border-dashed border-tertiary/30 animate-spinSlow absolute inset-0" />
            <div className="w-40 h-40 bg-gradient-to-br from-tertiary to-tertiary-container rounded-full flex items-center justify-center relative shadow-2xl overflow-hidden">
              <Crown size={64} className="text-white" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
          <div className="text-center lg:text-left flex-1">
            <span className="inline-block px-4 py-1 bg-[#f8d8ff] text-tertiary font-bold text-xs rounded-full mb-4 uppercase tracking-[0.2em]">
              Leyenda del Laboratorio
            </span>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface mb-4">El Legado de Mendeleiev</h3>
            <p className="text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
              Este reconocimiento se otorga únicamente a los estudiantes que han completado el 100% de los desafíos
              avanzados, mentorizado a más de 50 compañeros y descubierto una variante de reacción en la simulación avanzada.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="px-6 py-3 bg-tertiary text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-tertiary/20">
                <Lock size={18} />
                Logro No Desbloqueado
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant flex items-center justify-center text-[10px] text-on-surface-variant font-bold">
                    {['A', 'B', 'C'][i - 1]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-tertiary-container flex items-center justify-center text-[10px] text-white font-bold">
                  +12
                </div>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">Solo 14 personas tienen este logro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AchievementCard = ({ achievement, unlocked, createdAt, progress }) => {
  const rarity = rarityConfig[achievement.rarity] || rarityConfig.common;
  const Icon = ICONS[achievement.icon] || Trophy;
  const isLocked = !unlocked;
  const isInProgress = !unlocked && progress > 0;

  return (
    <div className={cn(
      'achievement-card rounded-[2rem] p-6 flex items-center gap-6 border transition-all duration-300',
      unlocked ? 'bg-surface-container-lowest border-primary/10' : isInProgress ? 'bg-surface-container-lowest border-outline-variant/20 opacity-80' : 'bg-surface-container-low border-outline-variant/5 opacity-60',
    )}>
      {/* Icon */}
      <div className="relative shrink-0">
        <div className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center',
          unlocked ? 'bg-primary/10 text-primary' : isInProgress ? 'bg-surface-container text-on-surface-variant/40' : 'bg-surface-container text-on-surface-variant/20',
        )}>
          <Icon size={36} className={unlocked ? '' : ''} />
        </div>
        {unlocked && (
          <div className="absolute -bottom-1 -right-1 bg-secondary text-white rounded-full p-1 border-2 border-white">
            <Check size={12} strokeWidth={3} />
          </div>
        )}
        {isLocked && !isInProgress && <Lock size={18} className="absolute -bottom-1 -right-1 text-on-surface-variant/30" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn('font-headline font-bold text-sm', unlocked ? 'text-on-surface' : 'text-on-surface-variant/50')}>
            {achievement.title}
          </h3>
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0', rarity.bg)}>
            {rarity.label}
          </span>
        </div>
        <p className={cn('text-xs mb-3', unlocked ? 'text-on-surface-variant' : 'text-on-surface-variant/60')}>
          {achievement.desc}
        </p>

        {unlocked && createdAt && (
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-medium">
            <Clock size={12} />
            Obtenido el {new Date(createdAt).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        )}

        {isInProgress && progress && (
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-headline font-bold text-sm text-on-surface">{achievement.title}</h3>
              <span className="text-[10px] px-2 py-0.5 bg-surface-variant text-on-surface-variant rounded-full font-bold">{Math.round(progress * 100)}%</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-3">{achievement.desc}</p>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          </div>
        )}

        {unlocked && achievement.xp > 0 && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 mt-1">
            <Sparkles size={12} /> +{achievement.xp} XP
          </div>
        )}
      </div>
    </div>
  );
};

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const store = useAchievementStore();
  const { totalXp, level, currentStreak } = store;

  const fetchData = () => {
    setLoading(true);
    setError(null);
    studentService.getAchievements()
      .then(setAchievements)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const unlockedIds = new Set(achievements.map(a => a.title));
  const merged = ACHIEVEMENT_POOL.map(def => ({
    ...def,
    unlocked: unlockedIds.has(def.title),
    createdAt: achievements.find(a => a.title === def.title)?.created_at,
    progress: !unlockedIds.has(def.title) ? Math.random() * 0.8 : 1,
  }));

  // Sort: unlocked first (by rarity), then in-progress, then locked
  merged.sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    const aP = a.progress || 0; const bP = b.progress || 0;
    if (aP > 0 && aP < 1 && !(bP > 0 && bP < 1)) return -1;
    if (bP > 0 && bP < 1 && !(aP > 0 && aP < 1)) return 1;
    return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
  });

  const filtered = filter === 'all' ? merged : merged.filter(a => a.rarity === filter);
  const unlockedCount = merged.filter(a => a.unlocked).length;
  const totalPossible = ACHIEVEMENT_POOL.length;
  const totalAwardedXp = achievements.reduce((s, a) => s + a.xp_awarded, 0);

  const FILTER_TABS = [
    { id: 'all', label: 'Todos' },
    ...Object.entries(rarityConfig).map(([k, v]) => ({ id: k, label: v.label })),
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-headline font-extrabold text-primary mb-2">Mis Logros y Reconocimientos</h2>
            <p className="text-on-surface-variant">Tu camino hacia la maestría química en números</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 text-primary font-bold text-sm hover:underline transition-all">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualizar estadísticas
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/5 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,75,113,0.08)] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Trophy size={24} /></div>
              <span className="text-[10px] font-bold text-on-surface-variant/50">OBTENIDOS</span>
            </div>
            <p className="text-3xl font-headline font-bold text-on-surface">{unlockedCount}/{totalPossible}</p>
            <p className="text-sm text-on-surface-variant mt-1">Total Logros</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/5 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,75,113,0.08)] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-tertiary/10 rounded-2xl text-tertiary"><Star size={24} /></div>
              <span className="text-[10px] font-bold text-on-surface-variant/50">TOTAL</span>
            </div>
            <p className="text-3xl font-headline font-bold text-on-surface">{totalAwardedXp.toLocaleString()}</p>
            <p className="text-sm text-on-surface-variant mt-1">Puntos de Prestigio</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/5 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,75,113,0.08)] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary/10 rounded-2xl text-secondary"><Flame size={24} /></div>
              <span className="text-[10px] font-bold text-on-surface-variant/50">ACTUAL</span>
            </div>
            <p className="text-3xl font-headline font-bold text-on-surface">{currentStreak || 0} días</p>
            <p className="text-sm text-on-surface-variant mt-1">Racha de Estudio</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/5 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,75,113,0.08)] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#f4cbff]/30 rounded-2xl text-tertiary"><GraduationCap size={24} /></div>
              <span className="text-[10px] font-bold text-on-surface-variant/50">RANGO</span>
            </div>
            <p className="text-3xl font-headline font-bold text-on-surface">Nivel {level || 1}</p>
            <p className="text-sm text-on-surface-variant mt-1">Nivel de Progresión</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {FILTER_TABS.map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)}
            className={cn(
              'px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all active:scale-95',
              filter === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-surface-container-lowest rounded-[2rem] p-6 border border-outline-variant/10 animate-pulse">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-surface-container shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-2/3 h-4 bg-surface-container rounded" />
                  <div className="w-full h-3 bg-surface-container rounded" />
                  <div className="w-1/3 h-3 bg-surface-container rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant/10">
          <AlertTriangle size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-on-surface mb-3">{error}</p>
          <button onClick={fetchData} className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm">Reintentar</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-16 text-center border border-outline-variant/10">
          <Trophy size={56} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-2xl font-headline font-extrabold text-on-surface mb-2">Sin logros aún</h3>
          <p className="text-on-surface-variant">Completa actividades para ganar logros y reconocimientos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((achievement, idx) => (
            <motion.div key={achievement.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
              <AchievementCard
                achievement={achievement}
                unlocked={achievement.unlocked}
                createdAt={achievement.createdAt}
                progress={achievement.progress}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Legendary Section */}
      <LegendarySection />
    </div>
  );
};

export default AchievementsPage;
