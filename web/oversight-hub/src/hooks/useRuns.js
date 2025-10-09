import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const useRuns = (taskId) => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) {
      setRuns([]);
      setLoading(false);
      return;
    }

    const runsQuery = query(
      collection(db, `content-tasks/${taskId}/runs`),
      orderBy('startTime', 'desc')
    );

    const unsubscribe = onSnapshot(runsQuery, (querySnapshot) => {
      const runsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRuns(runsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [taskId]);

  return { runs, loading };
};

export default useRuns;
