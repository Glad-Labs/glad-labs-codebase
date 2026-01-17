import React, { useState } from 'react';
import { useTasks } from '../../features/tasks/useTasks';
import useStore from '../../store/useStore';
import TaskList from './TaskList';
import TaskDetailModal from './TaskDetailModal';
import ErrorMessage from '../common/ErrorMessage';

const OversightHub = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { tasks, loading, error, total, _hasMore } = useTasks(page, limit);
  const { isModalOpen, setSelectedTask, clearSelectedTask } = useStore();

  if (loading && tasks.length === 0) return <p>Loading tasks...</p>;
  if (error) return <ErrorMessage message={error} />;

  const totalPages = Math.ceil(total / limit);
  const currentPage = page;

  return (
    <div>
      <TaskList
        tasks={tasks}
        onTaskClick={setSelectedTask}
        page={currentPage}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
      {isModalOpen && <TaskDetailModal onClose={clearSelectedTask} />}
    </div>
  );
};

export default OversightHub;
