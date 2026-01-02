/**
 * useTaskData - Custom hook for task data fetching and management
 *
 * Handles:
 * - Fetching tasks from backend with pagination
 * - Managing task list state
 * - Auto-refresh functionality
 * - KPI calculation from all tasks
 */

import { useState, useEffect, useRef, useCallback } from 'react';
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

  const fetchTasks = useCallback(async () => {
    // Guard: prevent concurrent requests
    if (isFetchingRef.current) {
      console.log('⏳ useTaskData: Request already in flight, skipping...');
      return;
    }

    try {
      setError(null);
      setIsFetching(true);
      isFetchingRef.current = true;

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Fetch the current page from the backend with proper pagination
      const data = await getTasks(offset, limit, {
        sortBy,
        sortDirection,
      });

      console.log('✅ useTaskData: API Response received:', {
        length: data?.length || 0,
        offset,
        limit,
        sortBy,
        sortDirection,
      });

      // The response is an array of task objects
      let apiTasks = data || [];
      let totalCount = apiTasks.length;

      // If we got fewer tasks than requested, we're on the last page
      // To get accurate total count, we need to query the backend for it
      // For now, estimate based on fetched tasks
      if (apiTasks.length > 0) {
        // If we got the full limit, there might be more pages
        // If we got less, this is the last page
        console.log(
          '✅ useTaskData: Loaded',
          apiTasks.length,
          'tasks for page',
          page
        );
      }

      // Set tasks directly (already paginated from backend)
      setTasks(apiTasks);

      // Set total - if this fetch returned fewer items than limit,
      // we can calculate approximate total
      if (apiTasks.length < limit) {
        totalCount = offset + apiTasks.length;
      } else {
        // If we got exactly limit items, there might be more
        // We'll use limit as minimum total and let pagination handle discovery
        totalCount = Math.max(offset + limit + 1, limit);
      }

      setTotal(totalCount);

      console.log(
        '✅ useTaskData: Displaying page',
        page,
        'with',
        apiTasks.length,
        'tasks, estimated total:',
        totalCount
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
  }, [page, limit, sortBy, sortDirection]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, page, limit, sortBy, sortDirection]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchTasks]);

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
