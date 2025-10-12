import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      tasks: [],
      selectedTask: null,
      isModalOpen: false,
      theme: 'dark', // default to dark theme
      setTasks: (tasks) => set({ tasks }),
      setSelectedTask: (task) =>
        set({ selectedTask: task, isModalOpen: !!task }),
      setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'oversight-hub-storage',
      partialize: (state) => ({ theme: state.theme }), // only persist theme
    }
  )
);

export default useStore;
