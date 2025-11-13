import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../store/useStore';
import { getAuthToken } from '../../services/authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setStoreTasks = useStore((state) => state.setTasks);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 2; // Reduced from 3 to speed up failure detection
    let loadingTimeout = null;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Set a timeout for the overall loading process (10 seconds max)
        // This prevents the UI from hanging indefinitely
        loadingTimeout = setTimeout(() => {
          if (isMounted) {
            console.warn('⏱️ Tasks fetch timeout - taking too long');
            setError(
              'Tasks fetch timeout - backend may not be responding. Check http://localhost:8000/docs'
            );
            setLoading(false);
          }
        }, 10000);

        const response = await axios.get(`${API_URL}/api/tasks`, {
          timeout: 8000, // Reduced from 120000 (2 min) to 8 seconds per request
          headers,
        });

        if (loadingTimeout) clearTimeout(loadingTimeout);

        if (isMounted) {
          const tasksData = Array.isArray(response.data)
            ? response.data
            : response.data.tasks ||
              response.data.results ||
              response.data.data ||
              [];

          setTasks(tasksData);
          setStoreTasks(tasksData);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (loadingTimeout) clearTimeout(loadingTimeout);

        if (isMounted) {
          console.error('❌ Error fetching tasks:', err.message, {
            retryCount,
            maxRetries,
          });

          // Check if this is an auth error
          if (err.response?.status === 401) {
            setError('Not authenticated. Please login first.');
            setLoading(false);
            return;
          }

          // Retry logic for non-auth errors
          if (retryCount < maxRetries && err.code !== 'ECONNABORTED') {
            retryCount++;
            const retryDelay = 1000 * retryCount;
            console.log(
              `⏳ Retrying tasks fetch in ${retryDelay}ms (attempt ${retryCount}/${maxRetries})`
            );
            setTimeout(fetchTasks, retryDelay);
          } else {
            setError(`Failed to fetch tasks: ${err.message}`);
            setLoading(false);
          }
        }
      }
    };

    fetchTasks();

    return () => {
      isMounted = false;
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [setStoreTasks]);

  return { tasks, loading, error };
};
