import React from 'react';
import useStore from '../store/useStore';
import useTasks from '../hooks/useTasks';

function Dashboard() {
  useTasks(); // This will fetch tasks and put them in the store
  const tasks = useStore((state) => state.tasks);
  const setSelectedTask = useStore((state) => state.setSelectedTask);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Monitor and manage your tasks and operations
        </p>
      </div>
      <div className="dashboard-grid">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="task-card"
            onClick={() => setSelectedTask(task)}
          >
            <h2 className="task-title">{task.title}</h2>
            <div className="task-meta">
              <p className="task-status">Status: {task.status}</p>
              <p className="task-priority">Priority: {task.priority}</p>
              <p className="task-due-date">Due Date: {task.dueDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
