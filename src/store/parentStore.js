import { create } from 'zustand';
import { parentService } from '../services/parentService';

export const useParentStore = create((set, get) => ({
  children: [],
  selectedChild: null,
  unreadCount: 0,

  fetchChildren: async () => {
    try {
      const children = await parentService.getChildren();
      set((state) => ({
        children,
        selectedChild: state.selectedChild || children[0] || null,
      }));
    } catch {
      // silently fail
    }
  },

  setSelectedChild: (child) => set({ selectedChild: child }),

  fetchUnreadCount: async () => {
    try {
      const res = await parentService.getUnreadCount();
      set({ unreadCount: res.count });
    } catch {
      // silently fail
    }
  },

  refreshUnreadCount: () => {
    const { fetchUnreadCount } = get();
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  },
}));
