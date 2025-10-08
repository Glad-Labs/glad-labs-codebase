import create from 'zustand';

const useStore = create((set) => ({
  selectedTask: null,
  isModalOpen: false,
  setSelectedTask: (task) => set({ selectedTask: task, isModalOpen: !!task }),
  clearSelectedTask: () => set({ selectedTask: null, isModalOpen: false }),
}));

export default useStore;
