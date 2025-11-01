import { useState, useEffect } from 'react';
import useStore from '../store/useStore';

/**
 * Fetch tasks from PostgreSQL backend API (replacing Firebase Firestore)
 * Polls every 5 seconds for updates when authenticated
 *
 * @returns {Object} { loading, error } - Loading and error states
 */
const useTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setTasks = useStore((state) => state.setTasks);
  const accessToken = useStore((state) => state.accessToken);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Don't fetch if not authenticated
    if (!accessToken) {
      setLoading(false);
      setTasks([]);
      return;
    }

    let isMounted = true;
    let pollTimeout;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/tasks`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            throw new Error('Authentication failed. Please login again.');
          }
          throw new Error(`HTTP ${response.status}: Failed to fetch tasks`);
        }

        const data = await response.json();
        if (isMounted) {
          setTasks(data.tasks || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        if (isMounted) {
          setError(err.message);
          setTasks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Fetch immediately
    fetchTasks();

    // Poll every 30 seconds for updates (reduced from 5s to prevent excessive reloads)
    const pollTasks = () => {
      pollTimeout = setTimeout(() => {
        if (isMounted) {
          fetchTasks().then(() => {
            if (isMounted) {
              pollTasks();
            }
          });
        }
      }, 30000); // 30 seconds instead of 5 seconds
    };

    pollTasks();

    return () => {
      isMounted = false;
      if (pollTimeout) {
        clearTimeout(pollTimeout);
      }
    };
  }, [setTasks, accessToken, apiUrl]);

  return { loading, error };
};

export default useTasks;
