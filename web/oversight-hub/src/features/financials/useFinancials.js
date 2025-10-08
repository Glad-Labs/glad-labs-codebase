import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const useFinancials = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'financials'), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const entriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(entriesData);
        setLoading(false);
      },
      (err) => {
        setError('Failed to fetch financial data. Please check Firestore connection and permissions.');
        setLoading(false);
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, []);

  return { entries, loading, error };
};
