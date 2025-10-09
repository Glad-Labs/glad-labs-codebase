import React from 'react';
import useTasks from './hooks/useTasks';
import useStore from './store/useStore';
import TaskList from './components/tasks/TaskList';
import TaskDetailModal from './components/tasks/TaskDetailModal';
import './OversightHub.css';

const OversightHub = () => {
  const { loading, error } = useTasks();
  const tasks = useStore((state) => state.tasks);
  const { isModalOpen, setSelectedTask, clearSelectedTask } = useStore();

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-400">Loading tasks...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 bg-red-100 border border-red-400 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="oversight-hub-layout">
      <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
      {isModalOpen && <TaskDetailModal onClose={clearSelectedTask} />}
    </div>
  );
};

export default OversightHub;
