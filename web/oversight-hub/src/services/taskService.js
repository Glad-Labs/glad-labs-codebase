/**
 * Task Service - Uses FastAPI backend (PostgreSQL)
 *
 * This service communicates with the Co-Founder Agent backend API
 * which stores tasks in PostgreSQL database.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_TIMEOUT = 30000; // 30 seconds

/**
 * Fetch all tasks from the backend API
 * Uses database-level pagination for performance
 */
export const getTasks = async (offset = 0, limit = 20, filters = {}) => {
  try {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
      ...(filters.status && { status: filters.status }),
      ...(filters.category && { category: filters.category }),
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data = await response.json();
      return data.tasks || [];
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(`Could not fetch tasks from backend: ${error.message}`);
  }
};

/**
 * Creates a new task via the backend API
 */
export const createTask = async (taskData) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(taskData),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail?.message ||
            `Failed to create task: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.id; // Return task ID
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error(`Could not create task: ${error.message}`);
  }
};

/**
 * Update task status via the backend API
 */
export const updateTask = async (taskId, updates) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(updates),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error(`Could not update task: ${error.message}`);
  }
};
