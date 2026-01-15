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

      // Fetch ALL tasks first (with high limit) for accurate KPI stats
      // Then use pagination for display
      const allTasksData = await getTasks(0, 1000, {
        sortBy,
        sortDirection,
      });

      console.log('✅ useTaskData: Fetched all tasks:', {
        length: allTasksData?.length || 0,
        sortBy,
        sortDirection,
      });

      // Store all tasks for KPI calculation
      let fetchedAllTasks = allTasksData || [];
      setAllTasks(fetchedAllTasks);
      setTotal(fetchedAllTasks.length);

      // For display, use the current page
      const offset = (page - 1) * limit;
      const paginatedTasks = fetchedAllTasks.slice(offset, offset + limit);

      console.log(
        '✅ useTaskData: Displaying page',
        page,
        'with',
        paginatedTasks.length,
        'tasks, total:',
        fetchedAllTasks.length
      );

      setTasks(paginatedTasks);
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

  // Note: Auto-refresh disabled (was causing modal scrolling)
  // Users can manually refresh with the Refresh button
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchTasks();
  //   }, 30000);
  //   return () => clearInterval(interval);
  // }, [fetchTasks]);

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
