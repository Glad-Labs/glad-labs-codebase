import create from 'zustand';

const useStore = create((set) => ({
  tasks: [],
  selectedTask: null,
  isModalOpen: false,
  setTasks: (tasks) => set({ tasks }),
  setSelectedTask: (task) => set({ selectedTask: task, isModalOpen: !!task }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));

export default useStore;
