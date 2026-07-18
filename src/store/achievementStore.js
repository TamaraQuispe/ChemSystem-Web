import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const ACHIEVEMENTS = [
  {
    id: 'first-experiment',
    title: 'Primer Experimento',
    description: 'Completa tu primera actividad en el laboratorio.',
    icon: '🔬',
    requirement: { type: 'activities', count: 1 },
    xp: 50,
  },
  {
    id: 'aprendiz-quimica',
    title: 'Aprendiz de Química',
    description: 'Acumula 100 puntos de experiencia.',
    icon: '⚗️',
    requirement: { type: 'xp', count: 100 },
    xp: 100,
  },
  {
    id: 'cientifico-formacion',
    title: 'Científico en Formación',
    description: 'Acumula 250 puntos de experiencia.',
    icon: '🧪',
    requirement: { type: 'xp', count: 250 },
    xp: 150,
  },
  {
    id: 'maestro-reacciones',
    title: 'Maestro de Reacciones',
    description: 'Acumula 500 puntos de experiencia.',
    icon: '🏆',
    requirement: { type: 'xp', count: 500 },
    xp: 250,
  },
  {
    id: 'simulador-catalisis',
    title: 'Experto en Catálisis',
    description: 'Completa 3 simulaciones de catálisis.',
    icon: '🧫',
    requirement: { type: 'catalysis', count: 3 },
    xp: 200,
  },
  {
    id: 'racha-estudio',
    title: 'Racha de Estudio',
    description: 'Completa actividades en 3 días consecutivos.',
    icon: '🔥',
    requirement: { type: 'streak', count: 3 },
    xp: 100,
  },
];

const XP_PER_ACTIVITY = {
  lesson: 30,
  exercise: 50,
  simulation: 75,
  catalysis: 100,
};

function calculateLevel(xp) {
  const threshold = 200;
  return Math.floor(xp / threshold) + 1;
}

function checkNewAchievements(state) {
  const unlocked = state.achievements.filter((a) => a.unlockedAt).length;
  const newOnes = [];
  const now = new Date().toISOString();

  for (const def of ACHIEVEMENTS) {
    const already = state.achievements.find((a) => a.id === def.id && a.unlockedAt);
    if (already) continue;

    let earned = false;
    const req = def.requirement;

    if (req.type === 'xp' && state.totalXp >= req.count) earned = true;
    if (req.type === 'activities' && state.activitiesCompleted >= req.count) earned = true;
    if (req.type === 'catalysis' && state.simulationsCompleted >= req.count) earned = true;
    if (req.type === 'streak' && state.currentStreak >= req.count) earned = true;

    if (earned) {
      newOnes.push({ ...def, unlockedAt: now });
    }
  }

  const updatedAchievements = state.achievements.map((a) => {
    const match = newOnes.find((n) => n.id === a.id);
    if (match) return match;
    return a;
  });

  return { newAchievements: newOnes, updatedAchievements };
}

export const useAchievementStore = create(
  persist(
    (set, get) => ({
      totalXp: 0,
      level: 1,
      activitiesCompleted: 0,
      simulationsCompleted: 0,
      currentStreak: 0,
      lastActivityDate: null,
      achievements: ACHIEVEMENTS.map((a) => ({ ...a, unlockedAt: null })),
      pendingNotifications: [],

      addXp: (amount, source = 'exercise') => {
        const state = get();
        const newXp = state.totalXp + amount;
        const newLevel = calculateLevel(newXp);
        const now = new Date().toISOString();
        const today = now.slice(0, 10);

        let streak = state.currentStreak;
        if (state.lastActivityDate) {
          const lastDay = state.lastActivityDate.slice(0, 10);
          const diff = (new Date(today) - new Date(lastDay)) / 86400000;
          if (diff === 1) streak += 1;
          else if (diff > 1) streak = 1;
        } else {
          streak = 1;
        }

        const updates = {
          totalXp: newXp,
          level: newLevel,
          currentStreak: streak,
          lastActivityDate: now,
        };

        if (source === 'simulation' || source === 'catalysis') {
          updates.simulationsCompleted = state.simulationsCompleted + 1;
        }
        if (source === 'exercise' || source === 'lesson' || source === 'simulation' || source === 'catalysis') {
          updates.activitiesCompleted = state.activitiesCompleted + 1;
        }

        set(updates);
        get().checkAndAwardAchievements();
        // Sync XP with backend
        api.post('/student/quiz/complete', {
          score: amount, max_score: amount, xp_earned: amount,
          time_spent_seconds: 0,
        }).catch(() => {});
      },

      checkAndAwardAchievements: () => {
        const state = get();
        const { newAchievements, updatedAchievements } = checkNewAchievements(state);

        if (newAchievements.length > 0) {
          const totalNewXp = newAchievements.reduce((sum, a) => sum + a.xp, 0);
          const bonuses = newAchievements.map((a) => ({ id: a.id, title: a.title, icon: a.icon, xp: a.xp }));

          set({
            achievements: updatedAchievements,
            totalXp: state.totalXp + totalNewXp,
            level: calculateLevel(state.totalXp + totalNewXp),
            pendingNotifications: [
              ...state.pendingNotifications,
              ...bonuses.map((b) => ({
                id: b.id,
                title: b.title,
                icon: b.icon,
                xp: b.xp,
                createdAt: new Date().toISOString(),
              })),
            ],
          });

          // Sync achievements to backend
          newAchievements.forEach(a => {
            api.post('/student/achievements', {
              title: a.title,
              description: a.description,
              icon: a.icon,
              rarity: 'common',
              xp_awarded: a.xp,
            }).catch(() => {});
          });
        }
      },

      clearNotification: (id) => {
        set((state) => ({
          pendingNotifications: state.pendingNotifications.filter((n) => n.id !== id),
        }));
      },
    }),
    {
      name: 'chemsystem-achievements',
      partialize: (state) => ({
        totalXp: state.totalXp,
        level: state.level,
        activitiesCompleted: state.activitiesCompleted,
        simulationsCompleted: state.simulationsCompleted,
        currentStreak: state.currentStreak,
        lastActivityDate: state.lastActivityDate,
        achievements: state.achievements,
      }),
    }
  )
);

export { ACHIEVEMENTS, XP_PER_ACTIVITY };
