import { useState, useEffect } from 'react';
import useStore from '../store/useStore';

/**
 * Fetch tasks from PostgreSQL backend API (replacing Firebase Firestore)
 * Polls every 5 seconds for updates when authenticated
 *
 * @returns {Object} { loading, error } - Loading and error states
 */

// Helper: Fetch with timeout
const fetchWithTimeout = (url, options = {}, timeoutMs = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
};

const useTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setTasks = useStore((state) => state.setTasks);
  const accessToken = useStore((state) => state.accessToken);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // In development, allow tasks to load even without auth token
    // In production, require authentication
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!accessToken && !isDevelopment) {
      setLoading(false);
      setTasks([]);
      return;
    }

    let isMounted = true;
    let pollTimeout;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const headers = {
          'Content-Type': 'application/json',
        };

        // Add auth header if token exists
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        const response = await fetchWithTimeout(
          `${apiUrl}/api/tasks`,
          {
            method: 'GET',
            headers,
          },
          5000
        ); // 5 second timeout

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid - in dev mode, just show empty list
            if (isDevelopment) {
              setTasks([]);
              setError(null);
            } else {
              throw new Error('Authentication failed. Please login again.');
            }
          } else {
            throw new Error(`HTTP ${response.status}: Failed to fetch tasks`);
          }
        } else {
          const data = await response.json();
          if (isMounted) {
            setTasks(data.tasks || []);
            setError(null);
          }
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
