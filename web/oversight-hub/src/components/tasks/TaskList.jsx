import React from 'react';
import { formatTimestamp } from '../../lib/date';
import StatusBadge from '../common/StatusBadge';

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
            <td>
              <StatusBadge status={task.status} />
            </td>
            <td>{formatTimestamp(task.createdAt)}</td>
            <td>{task.primary_keyword}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TaskList;
