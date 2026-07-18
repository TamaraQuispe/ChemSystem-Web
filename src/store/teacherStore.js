import { create } from 'zustand';
import { teacherService } from '../services/teacherService';

export const useTeacherStore = create((set) => ({
  classes: [],
  selectedClass: null,
  students: [],
  loading: false,

  fetchClasses: async () => {
    set({ loading: true });
    try {
      const classes = await teacherService.getClasses();
      set((state) => ({
        classes,
        selectedClass: state.selectedClass || classes[0] || null,
        loading: false,
      }));
    } catch {
      set({ loading: false });
    }
  },

  setSelectedClass: (classroom) => set({ selectedClass: classroom }),

  fetchStudents: async (classId) => {
    try {
      const students = await teacherService.getGrades(classId);
      set({ students });
    } catch {
      // silently fail
    }
  },
}));
