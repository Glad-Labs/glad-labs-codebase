import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useRuns = (taskId) => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) {
      return;
    }

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchRuns = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/api/tasks/${taskId}/runs`,
          {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (isMounted) {
          const runsData = Array.isArray(response.data)
            ? response.data
            : response.data.results || response.data.data || [];

          setRuns(runsData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          if (retryCount < maxRetries && err.code !== 'ECONNABORTED') {
            retryCount++;
            console.warn(
              `Failed to fetch runs (attempt ${retryCount}/${maxRetries}):`,
              err.message
            );
            setTimeout(fetchRuns, 2000 * retryCount);
          } else {
            setError(`Failed to fetch runs: ${err.message}`);
            console.error('Error fetching runs:', err);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRuns();

    return () => {
      isMounted = false;
    };
  }, [taskId]);

  return { runs, loading, error };
};
