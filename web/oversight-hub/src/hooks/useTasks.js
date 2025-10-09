import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import useStore from '../store/useStore';

const useTasks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setTasks = useStore((state) => state.setTasks);

  useEffect(() => {
    const q = query(collection(db, 'content-tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
        setLoading(false);
      },
      (err) => {
        setError('Failed to fetch tasks. Please check Firestore connection and permissions.');
        setLoading(false);
        console.error(err);
      }
    );
    return () => unsubscribe();
  }, [setTasks]);

  return { loading, error };
};

export default useTasks;
