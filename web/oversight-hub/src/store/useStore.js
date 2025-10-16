import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      tasks: [],
      selectedTask: null,
      isModalOpen: false,
      theme: 'dark', // default to dark theme
      autoRefresh: false,
      notifications: {
        desktop: true,
      },
      apiKeys: {
        mercury: '',
        gcp: '',
      },
      setTasks: (tasks) => set({ tasks }),
      setSelectedTask: (task) =>
        set({ selectedTask: task, isModalOpen: !!task }),
      setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
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
        theme: state.theme,
        autoRefresh: state.autoRefresh,
        notifications: state.notifications,
        apiKeys: state.apiKeys,
      }), // persist theme and other settings
    }
  )
);

export default useStore;
