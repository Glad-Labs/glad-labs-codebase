/**
 * Task Service - Uses FastAPI backend (PostgreSQL)
 *
 * This service communicates with the Co-Founder Agent backend API
 * which stores tasks in PostgreSQL database.
 *
 * All functions use the centralized makeRequest() API client from cofounderAgentClient.js
 * This ensures consistent auth, timeout handling, and error management across the app.
 */

import { makeRequest } from './cofounderAgentClient';

const API_TIMEOUT = 30000; // 30 seconds

/**
 * Fetch all tasks from the backend API
 * Uses database-level pagination for performance
 *
 * @param {number} offset - Pagination offset
 * @param {number} limit - Number of tasks to return
 * @param {object} filters - Optional filters (status, category, etc.)
 * @returns {Promise<Array>} Array of task objects
 * @throws {Error} If API call fails
 */
export const getTasks = async (offset = 0, limit = 20, filters = {}) => {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    ...(filters.status && { status: filters.status }),
    ...(filters.category && { category: filters.category }),
  });

  const result = await makeRequest(`/api/tasks?${params}`, 'GET', null, false, null, API_TIMEOUT);

  if (result.error) {
    throw new Error(`Could not fetch tasks: ${result.error}`);
  }

  return result.tasks || [];
};

/**
 * Get a single task by ID
 *
 * @param {string} taskId - Task ID to fetch
 * @returns {Promise<object>} Task object
 * @throws {Error} If task not found or API fails
 */
export const getTask = async (taskId) => {
  const result = await makeRequest(`/api/tasks/${taskId}`, 'GET', null, false, null, API_TIMEOUT);

  if (result.error) {
    throw new Error(`Could not fetch task: ${result.error}`);
  }

  return result;
};

/**
 * Creates a new task via the Service Layer API
 *
 * Routes through unified service backend:
 * POST /api/services/tasks/actions/create_task
 *
 * Supports both:
 * - Manual creation (CreateTaskModal) → taskService.js → Service Layer
 * - NLP creation (Agent) → nlp_intent_recognizer → Service Layer
 *
 * @param {object} taskData - Task data to create
 * @returns {Promise<string>} Created task ID
 * @throws {Error} If creation fails
 */
export const createTask = async (taskData) => {
  // Service layer expects action request format: {params, context}
  const serviceRequest = {
    params: taskData,
    context: {
      source: 'manual_form',
      timestamp: new Date().toISOString(),
    },
  };

  const result = await makeRequest(
    '/api/services/tasks/actions/create_task',
    'POST',
    serviceRequest,
    false,
    null,
    API_TIMEOUT
  );

  if (result.error) {
    throw new Error(`Could not create task: ${result.error}`);
  }

  // Service layer returns ActionResult with .data property
  return result.data?.id || result.id || result;
};

/**
 * Update task status via the backend API
 *
 * @param {string} taskId - Task ID to update
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated task object
 * @throws {Error} If update fails
 */
export const updateTask = async (taskId, updates) => {
  const result = await makeRequest(`/api/tasks/${taskId}`, 'PATCH', updates, false, null, API_TIMEOUT);

  if (result.error) {
    throw new Error(`Could not update task: ${result.error}`);
  }

  return result;
};

/**
 * Approve a task
 *
 * @param {string} taskId - Task ID to approve
 * @param {string} feedback - Optional approval feedback
 * @returns {Promise<object>} Updated task object
 * @throws {Error} If approval fails
 */
export const approveTask = async (taskId, feedback = '') => {
  const result = await makeRequest(
    `/api/tasks/${taskId}/approve`,
    'POST',
    { feedback },
    false,
    null,
    API_TIMEOUT
  );

  if (result.error) {
    throw new Error(`Could not approve task: ${result.error}`);
  }

  return result;
};

/**
 * Reject a task
 *
 * @param {string} taskId - Task ID to reject
 * @param {string} reason - Rejection reason
 * @returns {Promise<object>} Updated task object
 * @throws {Error} If rejection fails
 */
export const rejectTask = async (taskId, reason = '') => {
  const result = await makeRequest(
    `/api/tasks/${taskId}/reject`,
    'POST',
    { reason },
    false,
    null,
    API_TIMEOUT
  );

  if (result.error) {
    throw new Error(`Could not reject task: ${result.error}`);
  }

  return result;
};

/**
 * Delete a task
 *
 * @param {string} taskId - Task ID to delete
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails
 */
export const deleteTask = async (taskId) => {
  const result = await makeRequest(`/api/tasks/${taskId}`, 'DELETE', null, false, null, API_TIMEOUT);

  if (result.error) {
    throw new Error(`Could not delete task: ${result.error}`);
  }

  return result;
};

/**
 * Fetch content task by ID
 * Returns detailed task info with generated content and metadata
 *
 * @param {string} taskId - Content task ID
 * @returns {Promise<object>} Task object with content
 * @throws {Error} If task not found
 */
export const getContentTask = async (taskId) => {
  const result = await makeRequest(
    `/api/content/tasks/${taskId}`,
    'GET',
    null,
    false,
    null,
    API_TIMEOUT
  );

  if (result.error) {
    throw new Error(`Could not fetch content task: ${result.error}`);
  }

  return result;
};

/**
 * Delete content task
 *
 * @param {string} taskId - Content task ID
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails
 */
export const deleteContentTask = async (taskId) => {
  const result = await makeRequest(
    `/api/content/tasks/${taskId}`,
    'DELETE',
    null,
    false,
    null,
    API_TIMEOUT
  );

  if (result.error) {
    throw new Error(`Could not delete content task: ${result.error}`);
  }

  return result;
};
