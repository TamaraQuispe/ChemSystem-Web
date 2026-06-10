import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      role: null,
      emotionalState: 'motivated',

      login: (userData, token) => {
        if (token) {
          localStorage.setItem('chemsystem_token', token);
        }
        set({
          user: userData,
          isAuthenticated: true,
          token: token || null,
          role: userData.role || 'student',
        });
      },

      logout: () => {
        localStorage.removeItem('chemsystem_token');
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          role: null,
          emotionalState: 'motivated',
        });
      },

      fetchUser: async () => {
        const token = localStorage.getItem('chemsystem_token');
        if (!token) return;
        try {
          const res = await api.get('/auth/me');
          set({
            user: res.data.user,
            isAuthenticated: true,
            token,
            role: res.data.user.role || 'student',
          });
        } catch {
          localStorage.removeItem('chemsystem_token');
          set({ user: null, isAuthenticated: false, token: null, role: null });
        }
      },

      setRole: (role) => set({ role }),
      setEmotionalState: (state) => set({ emotionalState: state }),
    }),
    {
      name: 'chemsystem-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        role: state.role,
        emotionalState: state.emotionalState,
      }),
    }
  )
);
