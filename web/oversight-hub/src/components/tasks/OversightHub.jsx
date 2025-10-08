import React from 'react';
import { useTasks } from '../../features/tasks/useTasks';
import useStore from '../../store/useStore';
import TaskList from './TaskList';
import TaskDetailModal from './TaskDetailModal';
import ErrorMessage from '../common/ErrorMessage';

const OversightHub = () => {
  const { tasks, loading, error } = useTasks();
  const { isModalOpen, setSelectedTask, clearSelectedTask } = useStore();

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <TaskList tasks={tasks} onTaskClick={setSelectedTask} />
      {isModalOpen && <TaskDetailModal onClose={clearSelectedTask} />}
    </div>
  );
};

export default OversightHub;
