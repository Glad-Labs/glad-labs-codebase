/**
 * TaskManagement - Refactored orchestrator component
 *
 * Composed of:
 * - useTaskData hook (data fetching, pagination, sorting)
 * - TaskFilters component (sort/filter UI)
 * - TaskTable component (table rendering)
 * - TaskActions component (dialogs for approve/reject/delete)
 * - ResultPreviewPanel (detail view)
 * - CreateTaskModal (create new tasks)
 *
 * This component provides the main interface for task management,
 * coordinating between extracted components while maintaining all
 * original functionality in a much cleaner architecture.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Tabs, Tab } from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';
import { useTaskData } from '../../hooks/useTaskData';
import TaskFilters from './TaskFilters';
import TaskTable from './TaskTable';
import TaskActions from './TaskActions';
import CreateTaskModal from './CreateTaskModal';
import ResultPreviewPanel from './ResultPreviewPanel';
import {
  approveTask,
  rejectTask,
  deleteContentTask,
} from '../../services/taskService';

/**
 * TaskManagement - Comprehensive task queue and management interface
 *
 * Features:
 * - View all tasks in queue with pagination
 * - Create, edit, delete tasks
 * - Approve/reject tasks with feedback
 * - Filter by status and sort by multiple fields
 * - View task details in preview panel
 * - Bulk task management
 */
const TaskManagement = () => {
  // Get auth state from Zustand store via useAuth hook
  const { loading: authLoading } = useAuth();

  // Task management state
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 = Manual, 1 = Poindexter
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Filters and sorting
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Use custom hook for data management
  const {
    tasks,
    allTasks,
    total,
    loading,
    error: dataError,
    isFetching,
    fetchTasks,
  } = useTaskData(page, limit, sortBy, sortDirection);

  // Handle any data errors
  useEffect(() => {
    if (dataError) {
      setError(dataError);
    }
  }, [dataError]);

  // Don't fetch tasks until auth is ready
  useEffect(() => {
    if (!authLoading) {
      fetchTasks();
    }
  }, [authLoading, fetchTasks]);

  /**
   * Filter and get tasks for display
   */
  const getFilteredTasks = () => {
    if (!tasks || tasks.length === 0) return [];

    let filtered = [...tasks];

    // Filter by status if selected
    if (statusFilter) {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Filter by pipeline (manual vs poindexter)
    if (activeTab === 0) {
      filtered = filtered.filter(
        (t) => !t.pipeline_type || t.pipeline_type === 'manual'
      );
    } else {
      filtered = filtered.filter((t) => t.pipeline_type === 'poindexter');
    }

    return filtered;
  };

  /**
   * Calculate task statistics
   */
  const getTaskStats = () => {
    if (!allTasks || allTasks.length === 0) {
      return { total: 0, completed: 0, inProgress: 0, failed: 0 };
    }

    let pipelineTasks = allTasks;
    if (activeTab === 0) {
      pipelineTasks = pipelineTasks.filter(
        (t) => !t.pipeline_type || t.pipeline_type === 'manual'
      );
    } else {
      pipelineTasks = pipelineTasks.filter(
        (t) => t.pipeline_type === 'poindexter'
      );
    }

    return {
      total: pipelineTasks.length,
      completed: pipelineTasks.filter((t) => t.status === 'completed').length,
      inProgress: pipelineTasks.filter((t) =>
        ['queued', 'in_progress', 'pending_review'].includes(t.status)
      ).length,
      failed: pipelineTasks.filter((t) =>
        ['failed', 'cancelled'].includes(t.status)
      ).length,
    };
  };

  /**
   * Handle task approval
   */
  const handleApprove = async (taskId, feedback = '') => {
    try {
      setError(null);
      await approveTask(taskId, feedback || '');

      // Refresh task list
      await fetchTasks();

      // Close detail view
      setSelectedTask(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error approving task: ${errorMessage}`);
      throw err;
    }
  };

  /**
   * Handle task rejection
   */
  const handleReject = async (taskId, reason = '') => {
    try {
      setError(null);
      await rejectTask(taskId, reason || '');

      // Refresh task list
      await fetchTasks();

      // Close detail view
      setSelectedTask(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error rejecting task: ${errorMessage}`);
      throw err;
    }
  };

  /**
   * Handle task deletion
   */
  const handleDeleteTask = async (taskId) => {
    try {
      setError(null);
      await deleteContentTask(taskId);

      // Refresh task list
      await fetchTasks();

      // Close detail view
      setSelectedTask(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error deleting task: ${errorMessage}`);
      throw err;
    }
  };

  /**
   * Handle select all tasks on current page
   */
  const handleSelectAll = (checked) => {
    if (checked) {
      const pageTaskIds = getFilteredTasks().map((t) => t.id);
      setSelectedTasks(pageTaskIds);
    } else {
      setSelectedTasks([]);
    }
  };

  /**
   * Handle select individual task
   */
  const handleSelectOne = (taskId, checked) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    }
  };

  const filteredTasks = getFilteredTasks();
  const stats = getTaskStats();

  return (
    <Box sx={{ p: 3 }}>
      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: 1.5,
            color: '#ff6b6b',
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>{error}</Typography>
        </Alert>
      )}

      {/* Pipeline Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, value) => {
          setActiveTab(value);
          setPage(1);
          setSelectedTasks([]);
        }}
        sx={{ mb: 3, borderBottom: '1px solid rgba(0, 217, 255, 0.2)' }}
      >
        <Tab label="Manual Pipeline" />
        <Tab label="Poindexter Pipeline" />
      </Tabs>

      {/* Summary Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          { label: 'Total Tasks', value: stats.total, color: '#00d4ff' },
          { label: 'Completed', value: stats.completed, color: '#4CAF50' },
          { label: 'In Progress', value: stats.inProgress, color: '#2196F3' },
          { label: 'Failed', value: stats.failed, color: '#F44336' },
        ].map((stat) => (
          <Box
            key={stat.label}
            sx={{
              backgroundColor: `rgba(${
                stat.color === '#00d4ff'
                  ? '0, 212, 255'
                  : stat.color === '#4CAF50'
                    ? '76, 175, 80'
                    : stat.color === '#2196F3'
                      ? '33, 150, 243'
                      : '244, 67, 54'
              }, 0.1)`,
              border: `1px solid rgba(${
                stat.color === '#00d4ff'
                  ? '0, 212, 255'
                  : stat.color === '#4CAF50'
                    ? '76, 175, 80'
                    : stat.color === '#2196F3'
                      ? '33, 150, 243'
                      : '244, 67, 54'
              }, 0.3)`,
              borderRadius: 1,
              p: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{ color: stat.color, fontWeight: 700, fontSize: '1.5rem' }}
            >
              {stat.value}
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateModal(true)}
          sx={{
            textTransform: 'none',
            backgroundColor: '#00d4ff',
            color: '#000',
            fontWeight: 600,
          }}
        >
          Create Task
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => fetchTasks()}
          disabled={isFetching}
          sx={{
            textTransform: 'none',
            color: '#00d4ff',
            borderColor: '#00d4ff',
            fontWeight: 600,
          }}
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {/* Filters */}
      <TaskFilters
        sortBy={sortBy}
        sortDirection={sortDirection}
        statusFilter={statusFilter}
        onSortChange={(field) => setSortBy(field)}
        onDirectionChange={(direction) => setSortDirection(direction)}
        onStatusChange={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        onResetFilters={() => {
          setSortBy('created_at');
          setSortDirection('desc');
          setStatusFilter('');
          setPage(1);
        }}
      />

      {/* Task Table */}
      <TaskTable
        tasks={filteredTasks}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        selectedTasks={selectedTasks}
        onSelectTask={(task) => {
          setSelectedTask(task);
        }}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onEditTask={(task) => {
          setSelectedTask(task);
        }}
        onDeleteTask={(taskId) => {
          handleDeleteTask(taskId);
        }}
      />

      {/* Task Actions Dialogs */}
      {selectedTask && (
        <TaskActions
          selectedTask={selectedTask}
          isLoading={false}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDeleteTask}
          onClose={() => {
            setSelectedTask(null);
          }}
        />
      )}

      {/* Detail Panel */}
      {selectedTask && (
        <ResultPreviewPanel
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onApprove={(feedback) => handleApprove(selectedTask.id, feedback)}
          onReject={(reason) => handleReject(selectedTask.id, reason)}
        />
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          open={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            fetchTasks();
          }}
        />
      )}
    </Box>
  );
};

export default TaskManagement;
