import React from 'react';
import useTasks from '../hooks/useTasks';
import useStore from '../store/useStore';

const ContentQueue = () => {
  const { loading } = useTasks();
  const tasks = useStore((state) => state.tasks);

  if (loading) return <p>Loading content queue...</p>;

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
