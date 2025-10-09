import React from 'react';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString();
};

const renderStatus = (status) => (
  <span
    className={`status-badge status-${status?.toLowerCase().replace(' ', '-')}`}
  >
    {status || 'Unknown'}
  </span>
);

const TaskList = ({ tasks, onTaskClick }) => (
  <div className="task-list">
    <h2>Content Task Queue</h2>
    <table>
      <thead>
        <tr>
          <th>Topic</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Primary Keyword</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} onClick={() => onTaskClick(task)}>
            <td>{task.topic}</td>
            <td>{renderStatus(task.status)}</td>
            <td>{formatTimestamp(task.createdAt)}</td>
            <td>{task.primary_keyword}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TaskList;
