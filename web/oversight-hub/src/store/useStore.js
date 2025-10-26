import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // ===== AUTHENTICATION STATE =====
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          tasks: [],
          selectedTask: null,
        }),

      // ===== TASK STATE =====
      tasks: [],
      selectedTask: null,
      isModalOpen: false,

      setTasks: (tasks) => set({ tasks }),
      setSelectedTask: (task) =>
        set({ selectedTask: task, isModalOpen: !!task }),
      setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

      // ===== METRICS STATE =====
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        successRate: 0,
        avgExecutionTime: 0,
        totalCost: 0,
      },
      setMetrics: (metrics) => set({ metrics }),

      // ===== UI STATE =====
      theme: 'dark', // default to dark theme
      autoRefresh: false,
      notifications: {
        desktop: true,
      },
      apiKeys: {
        mercury: '',
        gcp: '',
      },

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toggleAutoRefresh: () =>
        set((state) => ({ autoRefresh: !state.autoRefresh })),
      toggleDesktopNotifications: () =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            desktop: !state.notifications.desktop,
          },
        })),
      setApiKey: (key, value) =>
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [key]: value,
          },
        })),
    }),
    {
      name: 'oversight-hub-storage',
      partialize: (state) => ({
        // ✅ NEW: Persist authentication state
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,

        // Existing: UI preferences
        theme: state.theme,
        autoRefresh: state.autoRefresh,
        notifications: state.notifications,
        apiKeys: state.apiKeys,
      }), // persist theme and other settings
    }
  )
);

export default useStore;
