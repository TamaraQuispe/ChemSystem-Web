import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useModuleStore = create(
  persist(
    (set) => ({
      // Electrolysis Simulator State
      electrolysis: {
        voltage: 12.5,
        concentration: 0.5,
        isActive: false,
        activeLessonId: 'fundamentals',
        completedLessons: ['fundamentals'],
      },
      setElectrolysis: (params) => 
        set((state) => ({ 
          electrolysis: { ...state.electrolysis, ...params } 
        })),

      // Quiz State
      quiz: {
        currentQuestionIndex: 0,
        xpMultiplier: 1.5,
        timeRemaining: 165, // 02:45
        hintsUsed: 0,
        score: 0,
        history: [],
      },
      updateQuiz: (data) => 
        set((state) => ({ 
          quiz: { ...state.quiz, ...data } 
        })),

      // Molecular Builder State
      molecular: {
        currentStep: 4,
        totalSteps: 6,
        selectedBond: 'Covalente Simple',
        isVerified: false,
        compounds: [
          { id: 'h2so4', name: 'Ácido Sulfúrico', formula: 'H2SO4', progress: 65 }
        ]
      },
      setMolecular: (data) => 
        set((state) => ({ 
          molecular: { ...state.molecular, ...data } 
        })),

      // AI Leveling Path State
      aiPath: {
        overallProgress: 42,
        currentHito: 'Examen de Suficiencia',
        emotionalState: 'Óptimo',
        nodes: [
          { id: 'materia', title: 'Materia y Átomo', status: 'completed' },
          { id: 'nomenclatura', title: 'Nomenclatura IUPAC', status: 'active', progress: 60 },
          { id: 'estequiometria', title: 'Estequiometría', status: 'blocked' },
          { id: 'equilibrio', title: 'Equilibrio Químico', status: 'blocked' },
        ],
        recommendations: [
          { id: 1, type: 'video', title: 'Trucos para Nomenclatura Tradicional', duration: '2:45 min' },
          { id: 2, type: 'sim', title: 'Reactor de Óxidos v2.1', note: 'Práctica virtual obligatoria' }
        ]
      },
      updateAIPath: (data) => 
        set((state) => ({ 
          aiPath: { ...state.aiPath, ...data } 
        })),

      // Notifications State
      notifications: [
        { 
          id: 1, 
          title: 'Reto Urgente', 
          message: 'El cuestionario de Gases vence hoy a las 23:59.', 
          type: 'urgent',
          time: 'hace 5 min',
          unread: true 
        },
        { 
          id: 2, 
          title: 'Nuevo Logro', 
          message: 'Has desbloqueado "Maestro de Enlaces".', 
          type: 'success',
          time: 'hace 2 horas',
          unread: true 
        },
        { 
          id: 3, 
          title: 'Sugerencia de IA', 
          message: 'Basado en tu progreso, te recomendamos practicar Estequiometría.', 
          type: 'info',
          time: 'hace 5 horas',
          unread: false 
        }
      ],
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, unread: false } : n)
      })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'chemsystem-modules',
    }
  )
);
