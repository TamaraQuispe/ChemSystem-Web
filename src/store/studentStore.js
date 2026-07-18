import { create } from 'zustand';
import { studentService } from '../services/studentService';

export const useStudentStore = create((set) => ({
  dashboardData: null,
  achievements: [],
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const data = await studentService.getDashboard();
      set({ dashboardData: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchAchievements: async () => {
    try {
      const achievements = await studentService.getAchievements();
      set({ achievements });
    } catch { /* ignore */ }
  },
}));
