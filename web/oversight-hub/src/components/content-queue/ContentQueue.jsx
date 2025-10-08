import React from 'react';
import { useTasks } from '../../features/tasks/useTasks';

const ContentQueue = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) return <p>Loading content queue...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Content Task Queue</h2>
      {/* This will be built out into a more detailed component */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.topic} - <strong>{task.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentQueue;
