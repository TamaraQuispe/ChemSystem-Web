import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLessonStore = create(
  persist(
    (set) => ({
      progress: {},
      getProgress: (lessonId) => {
        const state = useLessonStore.getState();
        return state.progress[lessonId] || { completedSteps: 0, totalSteps: 0, percentage: 0 };
      },
      saveProgress: (lessonId, currentStep, totalSteps) => {
        set((state) => {
          const existing = state.progress[lessonId];
          const newPercentage = Math.round(((currentStep + 1) / totalSteps) * 100);
          const maxSteps = Math.max(existing?.completedSteps || 0, currentStep + 1);
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                completedSteps: maxSteps,
                totalSteps,
                percentage: Math.max(existing?.percentage || 0, newPercentage),
                lastStep: Math.max(existing?.lastStep || 0, currentStep),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      markCompleted: (lessonId, totalSteps) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [lessonId]: {
              completedSteps: totalSteps,
              totalSteps,
              percentage: 100,
              lastStep: totalSteps - 1,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },
      resetProgress: (lessonId) => {
        set((state) => {
          const { [lessonId]: _, ...rest } = state.progress;
          return { progress: rest };
        });
      },
    }),
    {
      name: 'chemsystem-lessons',
    }
  )
);
