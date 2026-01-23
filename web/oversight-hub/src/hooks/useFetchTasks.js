/**
 * useFetchTasks - Custom hook for task fetching with auto-refresh
 * 
 * Eliminates duplication between TaskManagement component's:
 * - fetchTasksWrapper (in useEffect)
 * - fetchTasks (standalone function)
 * 
 * Features:
 * - Centralized task fetching logic
 * - Auto-refresh every 30 seconds
 * - Consistent error handling
 * - Proper loading state management
 * - Integration with Zustand store
 */

import { useState, useCallback, useEffect } from 'react';
import useStore from '../store/useStore';
import { getTasks } from '../services/cofounderAgentClient';

/**
 * Hook for fetching tasks with pagination and auto-refresh
 * 
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {number} autoRefreshInterval - Auto-refresh interval in ms (0 = disabled, default 30000)
 * @returns {object} { tasks, total, loading, error, refetch }
 */
export const useFetchTasks = (page = 1, limit = 10, autoRefreshInterval = 30000) => {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setTasks: setStoreTasks } = useStore();

  // Core fetch function
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔵 useFetchTasks: Fetching tasks...');
      const offset = (page - 1) * limit;
      const response = await getTasks(limit, offset);

      console.log('🟢 useFetchTasks: Response received:', response);

      if (response && response.tasks && Array.isArray(response.tasks)) {
        console.log('✅ useFetchTasks: Setting tasks to state:', response.tasks.length, 'tasks');
        setTasks(response.tasks);
        setTotal(response.total || response.tasks.length);
        setStoreTasks(response.tasks);
      } else {
        console.warn('❌ useFetchTasks: Unexpected response format:', response);
        setError('Invalid response format from server');
        setTasks([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('❌ useFetchTasks: Error fetching tasks:', err);
      setError(`Failed to fetch tasks: ${err.message}`);
      setTasks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, setStoreTasks]);

  // Auto-refresh effect
  useEffect(() => {
    // Fetch immediately on mount or when page/limit changes
    fetchTasks();

    // Set up auto-refresh if interval > 0
    if (autoRefreshInterval > 0) {
      const interval = setInterval(fetchTasks, autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchTasks, autoRefreshInterval]);

  return {
    tasks,
    total,
    loading,
    error,
    refetch: fetchTasks,
  };
};

export default useFetchTasks;
