import React, { useState, useEffect, useCallback } from 'react';
import { getTasks } from '../../services/taskService';
import TaskItem from './TaskItem';
import CreateTaskModal from './CreateTaskModal';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

const TaskQueue = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError(
        'Failed to load tasks. Please ensure you are connected to the database and refresh the page.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskCreated = () => {
    fetchTasks(); // Refetch tasks when a new one is created
    setIsModalOpen(false);
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
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-cyan-400">Content Task Queue</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          New Task
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Topic
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Created At
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default TaskQueue;
