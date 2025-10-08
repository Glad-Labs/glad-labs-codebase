import React, { useState } from 'react';
import { useTasks } from '../../features/tasks/useTasks';
import TaskList from './TaskList';
import TaskDetailModal from './TaskDetailModal';
import ErrorMessage from '../common/ErrorMessage';

const OversightHub = () => {
  const { tasks, loading, error } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default OversightHub;
