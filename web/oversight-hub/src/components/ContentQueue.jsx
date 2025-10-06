import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const ContentQueue = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'content-tasks'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
