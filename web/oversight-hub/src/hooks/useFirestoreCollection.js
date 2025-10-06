import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const useFirestoreCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const q = query(
        collection(db, collectionName),
        orderBy('updatedAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(items);
          setLoading(false);
        },
        (err) => {
          console.error(`Error listening to ${collectionName}:`, err);
          setError(
            `Failed to load ${collectionName}. Please check console for details.`
          );
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Firestore query error:', err);
      setError('An error occurred while setting up the data listener.');
      setLoading(false);
    }
  }, [collectionName]);

  return { data, loading, error };
};

export default useFirestoreCollection;
