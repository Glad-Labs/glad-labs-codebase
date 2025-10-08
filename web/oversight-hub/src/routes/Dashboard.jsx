import React from 'react';
import { mockTasks } from '../data/mockTasks';
import useStore from '../store/useStore';

function Dashboard() {
  const setSelectedTask = useStore((state) => state.setSelectedTask);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 border rounded-lg shadow-sm cursor-pointer hover:shadow-md"
            onClick={() => setSelectedTask(task)}
          >
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p className="text-sm text-gray-500">Status: {task.status}</p>
            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
            <p className="text-sm text-gray-500">Due Date: {task.dueDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
