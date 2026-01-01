/**
 * useTaskData - Custom hook for task data fetching and management
 *
 * Handles:
 * - Fetching tasks from backend with pagination
 * - Managing task list state
 * - Auto-refresh functionality
 * - KPI calculation from all tasks
 */

import { useState, useEffect, useRef } from 'react';
import { getTasks } from '../services/taskService';

export function useTaskData(
  page = 1,
  limit = 10,
  sortBy = 'created_at',
  sortDirection = 'desc'
) {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // Store ALL tasks for KPI calculation
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const isFetchingRef = useRef(false); // Prevent concurrent requests

  const fetchTasks = async () => {
    // Guard: prevent concurrent requests
    if (isFetchingRef.current) {
      console.log('⏳ useTaskData: Request already in flight, skipping...');
      return;
    }

    try {
      setError(null);
      setIsFetching(true);
      isFetchingRef.current = true;

      // Fetch with a reasonable high limit (100) to get more tasks in one request for KPI
      // This way KPI stats are more representative, while still paginating for display
      const data = await getTasks(0, 100, {
        sortBy,
        sortDirection,
      });

      console.log('✅ useTaskData: API Response received:', {
        length: data?.length || 0,
        sortBy,
        sortDirection,
      });

      // The response is an array of task objects
      let apiTasks = data || [];
      let totalCount = apiTasks.length;

      console.log('✅ useTaskData: Loaded', apiTasks.length, 'total tasks');

      // Store ALL tasks for KPI calculation (this is the full dataset)
      setAllTasks(apiTasks);

      // For pagination display, show the appropriate page
      const startIndex = (page - 1) * limit;
      const paginatedTasks = apiTasks.slice(startIndex, startIndex + limit);
      setTasks(paginatedTasks);
      setTotal(totalCount);

      console.log(
        '✅ useTaskData: Displaying page',
        page,
        'with',
        paginatedTasks.length,
        'tasks'
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Unable to load tasks: ${errorMessage}`);
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
      setIsFetching(false);
      isFetchingRef.current = false;
    }
  };

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchTasks();
  }, [page, limit, sortBy, sortDirection]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    tasks,
    allTasks,
    total,
    loading,
    error,
    isFetching,
    fetchTasks,
    setTasks,
    setAllTasks,
  };
}
