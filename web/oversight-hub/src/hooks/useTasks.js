import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import useStore from '../store/useStore';

const useTasks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setTasks = useStore((state) => state.setTasks);

  useEffect(() => {
    // Check if db is initialized
    if (!db) {
      setError(
        'Firestore database not initialized. Please check your Firebase configuration.'
      );
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'content-tasks'),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const tasksData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksData);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error('Firestore error:', err);
          setError(
            `Failed to fetch tasks: ${err.message || 'Unknown error'}. ` +
              'Please check Firestore connection and permissions.'
          );
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up Firestore listener:', err);
      setError(`Error setting up task listener: ${err.message}`);
      setLoading(false);
    }
  }, [setTasks]);

  return { loading, error };
};

export default useTasks;
