import React from 'react';
import StatusBadge from './StatusBadge';
import { formatTimestamp } from '../utils/helpers';

const TaskList = ({ tasks, loading }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Active Tasks</h2>
    {loading ? (
      <p>Loading tasks...</p>
    ) : (
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li
              key={task.id}
              className="p-3 mb-2 bg-gray-700 rounded-md border-l-4 border-cyan-500"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{task.taskName}</span>
                <StatusBadge status={task.status} />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Last Updated: {formatTimestamp(task.updatedAt)}
              </div>
            </li>
          ))
        ) : (
          <p>No active tasks.</p>
        )}
      </ul>
    )}
  </div>
);

export default TaskList;
