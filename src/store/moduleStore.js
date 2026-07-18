import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useModuleStore = create(
  persist(
    () => ({
      quiz: {
        currentQuestionIndex: 0,
        xpMultiplier: 1.5,
        timeRemaining: 165,
        hintsUsed: 0,
        score: 0,
        history: [],
      },
      notifications: [
        { id: 1, title: 'Nuevo módulo disponible', message: 'El módulo de Termodinámica Aplicada ya está disponible.', type: 'info', time: 'Hace 2 horas', unread: true },
        { id: 2, title: 'Logro desbloqueado', message: 'Completaste 10 experimentos de catálisis.', type: 'achievement', time: 'Ayer', unread: true },
      ],
    }),
    { name: 'chemsystem-modules', partialize: (state) => ({ quiz: state.quiz, notifications: state.notifications }) }
  )
);
