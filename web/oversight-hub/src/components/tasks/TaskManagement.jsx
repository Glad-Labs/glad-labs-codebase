import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Alert,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import { getAuthToken } from '../../services/authService';
import { bulkUpdateTasks } from '../../services/cofounderAgentClient';
import { AuthContext } from '../../context/AuthContext';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import CreateTaskModal from './CreateTaskModal';
import ResultPreviewPanel from './ResultPreviewPanel';

/**
 * TaskManagement - Comprehensive task queue and management interface
 *
 * Features:
 * - View all tasks in queue
 * - Create, edit, delete tasks
 * - Bulk actions (pause, resume, cancel)
 * - Filter by status, priority, agent
 * - View task run history
 * - Manual intervention controls
 */
const TaskManagement = () => {
  // Get auth context
  const authContext = useContext(AuthContext);
  const authLoading = authContext?.loading || false;

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState(0); // 0 = Manual, 1 = Poindexter

  /**
   * Fetch full content task from /api/content/tasks endpoint
   * Gets complete task data with content, excerpt, images
   * ✅ REFACTORED: Changed from /api/content/blog-posts/tasks/{id} to /api/content/tasks/{id}
   * Now supports all task types: blog_post, social_media, email, newsletter
   */
  const fetchContentTaskStatus = async (taskId) => {
    try {
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // ✅ UPDATED ENDPOINT: /api/content/tasks/{taskId}
      // Returns: { task_id, status, progress, result, error, created_at, task_type }
      // Content is nested in result.content, result.article_title, etc.
      const response = await fetch(
        `http://localhost:8000/api/content/tasks/${taskId}`,
        {
          headers,
          signal: AbortSignal.timeout(5000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const result = data.result || {};

        console.log('✅ Content task status fetched:', {
          taskId: data.task_id || taskId,
          status: data.status,
          hasResult: !!result,
          hasContent: !!result.content,
          contentLength: result.content?.length || 0,
        });

        return {
          status: data.status || 'completed',
          task_id: data.task_id || taskId,
          // Extract from result object (nested structure from backend)
          title: result.title || result.article_title || result.topic || '',
          content:
            result.content || result.generated_content || result.article || '',
          excerpt: result.excerpt || result.summary || '',
          featured_image_url: result.featured_image_url || null,
          featured_image_data: result.featured_image_data || null,
          // Config fields
          style: result.style || '',
          tone: result.tone || '',
          target_length: result.target_length || 0,
          // Metadata
          tags: result.tags || [],
          task_metadata: result.task_metadata || data.progress || {},
          strapi_id: result.strapi_id || result.strapi_post_id || null,
          strapi_url: result.strapi_url || result.published_url || null,
          // Error handling
          error_message: data.error || result.error || '',
          // Additional data
          progress: data.progress || {},
        };
      } else {
        console.warn(`Failed to fetch content task: ${response.statusText}`);
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch content task:', error);
      return null;
    }
  };

  /**
   * Fetch tasks from backend with authorization
   * Fetches from /api/content/tasks which shows all content generation tasks
   * Supports filtering by task_type (blog_post, social_media, email, newsletter)
   */
  const fetchTasks = async () => {
    // Guard: prevent concurrent requests
    if (isFetching) {
      console.log('⏳ TaskManagement: Request already in flight, skipping...');
      return;
    }

    try {
      setError(null);
      setIsFetching(true);
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // ✅ FIXED: Use /api/tasks endpoint which returns {"tasks": [...], "total": ..., "offset": ..., "limit": ...}
      // Increased timeout from 5s to 15s to account for backend processing
      // Load only latest 10 tasks on initial load for better performance
      const response = await fetch(
        'http://localhost:8000/api/tasks?limit=10&offset=0',
        {
          headers,
          signal: AbortSignal.timeout(15000),
        }
      );

      if (response.ok) {
        let data = await response.json();
        console.log('✅ TaskManagement: API Response received:', data);

        // The response has 'tasks' array
        let apiTasks = data.tasks || [];
        console.log(
          '✅ TaskManagement: Tasks from API:',
          apiTasks.length,
          'items'
        );

        // Tasks are already in correct format from API, no transformation needed
        setTasks(apiTasks);
        console.log(
          '✅ TaskManagement: State updated with',
          apiTasks.length,
          'tasks'
        );
      } else {
        setError(`Failed to fetch tasks: ${response.statusText}`);
        console.error('Failed to fetch tasks:', response.statusText);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setError(`Unable to load tasks: ${errorMessage}`);
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  /**
   * Delete task (uses content endpoint to delete tasks of any type)
   * Supports: blog_post, social_media, email, newsletter
   */
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setError(null);
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // ✅ REFACTORED: Use /api/content/tasks/{id} endpoint (replaces /api/content/blog-posts/drafts/{id})
      const response = await fetch(
        `http://localhost:8000/api/content/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (response.ok) {
        fetchTasks();
      } else {
        setError(`Failed to delete task: ${response.statusText}`);
        console.error('Failed to delete task:', response.statusText);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setError(`Error deleting task: ${errorMessage}`);
      console.error('Failed to delete task:', error);
    }
  };

  /**
   * Bulk action handler with authorization
   */
  const handleBulkAction = async (action) => {
    if (selectedTasks.length === 0) return;

    try {
      setError(null);

      // ✅ Use API client instead of hardcoded fetch
      const result = await bulkUpdateTasks(selectedTasks, action);

      // ✅ Validate response
      if (!result) {
        throw new Error('Invalid response from bulk update');
      }

      console.log(`✅ Bulk ${action} completed:`, result);
      setSelectedTasks([]);

      // ✅ Refresh task list to show updated statuses
      fetchTasks();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setError(`Error performing bulk action: ${errorMessage}`);
      console.error('Failed to perform bulk action:', error);
    }
  };

  /**
   * Get all tasks - unified view without filtering
   */
  const getFilteredTasks = () => {
    if (!tasks) return [];

    // Return all tasks sorted by creation date (newest first)
    // Unified view - no filtering by status/priority/agent
    return tasks.sort((a, b) => {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  };

  /**
   * Get tasks filtered by pipeline
   * Manual Pipeline: User-created tasks (pipeline_type = 'manual' or undefined)
   * Poindexter Pipeline: AI-created tasks (pipeline_type = 'poindexter')
   */
  const getTasksByPipeline = () => {
    const filteredTasks = getFilteredTasks();

    if (activeTab === 0) {
      // Manual Pipeline - user-created tasks
      return filteredTasks.filter(
        (t) => !t.pipeline_type || t.pipeline_type === 'manual'
      );
    } else {
      // Poindexter Pipeline - AI-created tasks
      return filteredTasks.filter((t) => t.pipeline_type === 'poindexter');
    }
  };

  /**
   * Calculate summary statistics for current pipeline
   */
  const getTaskStats = () => {
    const pipelineTasks = getTasksByPipeline();
    if (!pipelineTasks)
      return { total: 0, completed: 0, inProgress: 0, failed: 0 };

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
   * Get status chip color
   */
  const getStatusColor = (status) => {
    const colors = {
      queued: 'default',
      in_progress: 'primary',
      pending_review: 'warning',
      completed: 'success',
      failed: 'error',
      cancelled: 'default',
    };
    return colors[status] || 'default';
  };

  /**
   * Get priority chip color
   */
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'default',
      medium: 'info',
      high: 'warning',
      urgent: 'error',
    };
    return colors[priority] || 'default';
  };

  /**
   * Handle table header click for sorting
   */
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle direction if clicking same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field - sort ascending by default
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  /**
   * Sort tasks based on current sortBy and sortDirection
   */
  const getSortedTasks = (tasksToSort) => {
    const sorted = [...tasksToSort].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle dates
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }

      // Handle strings
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return sorted;
  };

  useEffect(() => {
    // Don't fetch tasks until auth is ready (token initialized)
    if (authLoading) {
      console.log('⏳ TaskManagement: Waiting for auth to initialize...');
      return;
    }

    console.log('✅ TaskManagement: Auth ready, fetching tasks...');
    fetchTasks();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  const filteredTasks = getTasksByPipeline();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{
          borderBottom: '2px solid rgba(0, 212, 255, 0.1)',
          pb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: '#00d4ff',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            📋 Task Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#888', fontSize: '0.9rem' }}
          >
            Manage manual and AI-generated tasks across your workflow
          </Typography>
        </Box>
      </Box>

      {/* Pipeline Tabs */}
      <Box sx={{ mb: 2, borderBottom: '1px solid rgba(0, 212, 255, 0.2)' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#00d4ff',
              height: 3,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                👤 Manual Pipeline
                <Chip
                  label={
                    tasks.filter(
                      (t) => !t.pipeline_type || t.pipeline_type === 'manual'
                    ).length
                  }
                  size="small"
                  sx={{
                    backgroundColor:
                      activeTab === 0
                        ? 'rgba(0, 212, 255, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)',
                    color: activeTab === 0 ? '#00d4ff' : '#888',
                    height: 20,
                    minWidth: 30,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              color: activeTab === 0 ? '#00d4ff' : '#888',
              fontWeight: activeTab === 0 ? 700 : 600,
              fontSize: '1rem',
              '&:hover': { color: '#00d4ff' },
            }}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🤖 Poindexter Pipeline
                <Chip
                  label={
                    tasks.filter((t) => t.pipeline_type === 'poindexter').length
                  }
                  size="small"
                  sx={{
                    backgroundColor:
                      activeTab === 1
                        ? 'rgba(0, 212, 255, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)',
                    color: activeTab === 1 ? '#00d4ff' : '#888',
                    height: 20,
                    minWidth: 30,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            }
            sx={{
              textTransform: 'none',
              color: activeTab === 1 ? '#00d4ff' : '#888',
              fontWeight: activeTab === 1 ? 700 : 600,
              fontSize: '1rem',
              '&:hover': { color: '#00d4ff' },
            }}
          />
        </Tabs>
      </Box>

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
            '& .MuiAlert-icon': {
              color: '#ff6b6b',
            },
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>{error}</Typography>
        </Alert>
      )}

      {/* Summary Stats - Compact */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr 1fr',
          },
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#00d4ff', fontWeight: 700 }}
          >
            {getTaskStats().total}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#888', fontSize: '0.7rem' }}
          >
            Total Tasks
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#4CAF50', fontWeight: 700 }}
          >
            {getTaskStats().completed}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#888', fontSize: '0.7rem' }}
          >
            Completed
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#2196F3', fontWeight: 700 }}
          >
            {getTaskStats().inProgress}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#888', fontSize: '0.7rem' }}
          >
            In Progress
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#F44336', fontWeight: 700 }}
          >
            {getTaskStats().failed}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#888', fontSize: '0.7rem' }}
          >
            Failed
          </Typography>
        </Box>
      </Box>

      {/* Create Task and Refresh Buttons - Positioned above table */}
      <Box
        sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-start' }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateModal(true)}
          sx={{
            textTransform: 'none',
            backgroundColor: '#00d4ff',
            color: '#000',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#00f0ff',
            },
          }}
        >
          Create Task
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchTasks}
          sx={{
            textTransform: 'none',
            color: '#00d4ff',
            borderColor: '#00d4ff',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#00f0ff',
              color: '#00f0ff',
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Bulk Operations Toolbar - Shows when tasks are selected */}
      {selectedTasks.length > 0 && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: 1,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontWeight: 600, color: '#00d4ff' }}>
            {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}{' '}
            selected
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              startIcon={<PlayIcon />}
              onClick={() => handleBulkAction('resume')}
              sx={{
                textTransform: 'none',
                backgroundColor: '#4CAF50',
                color: '#fff',
                '&:hover': { backgroundColor: '#66BB6A' },
              }}
            >
              Resume
            </Button>
            <Button
              size="small"
              startIcon={<PauseIcon />}
              onClick={() => handleBulkAction('pause')}
              sx={{
                textTransform: 'none',
                backgroundColor: '#FF9800',
                color: '#fff',
                '&:hover': { backgroundColor: '#FFB74D' },
              }}
            >
              Pause
            </Button>
            <Button
              size="small"
              startIcon={<StopIcon />}
              onClick={() =>
                window.confirm('Cancel selected tasks?') &&
                handleBulkAction('cancel')
              }
              sx={{
                textTransform: 'none',
                backgroundColor: '#f44336',
                color: '#fff',
                '&:hover': { backgroundColor: '#EF5350' },
              }}
            >
              Cancel
            </Button>
            <Tooltip title="Export selected tasks as JSON">
              <Button
                size="small"
                onClick={() => {
                  const tasksToExport = getSortedTasks(filteredTasks).filter(
                    (t) => selectedTasks.includes(t.id)
                  );
                  const dataStr = JSON.stringify(tasksToExport, null, 2);
                  const dataBlob = new Blob([dataStr], {
                    type: 'application/json',
                  });
                  const url = URL.createObjectURL(dataBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `tasks_${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#2196F3',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#42A5F5' },
                }}
              >
                Export
              </Button>
            </Tooltip>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() =>
                window.confirm('Delete selected tasks?') &&
                handleBulkAction('delete')
              }
              sx={{
                textTransform: 'none',
                backgroundColor: '#9C27B0',
                color: '#fff',
                '&:hover': { backgroundColor: '#BA68C8' },
              }}
            >
              Delete
            </Button>
            <Button
              size="small"
              onClick={() => setSelectedTasks([])}
              sx={{
                textTransform: 'none',
                backgroundColor: '#666',
                color: '#fff',
                '&:hover': { backgroundColor: '#888' },
              }}
            >
              Deselect All
            </Button>
          </Box>
        </Box>
      )}

      {/* Task Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    selectedTasks.length ===
                      getSortedTasks(filteredTasks).length &&
                    getSortedTasks(filteredTasks).length > 0
                  }
                  indeterminate={
                    selectedTasks.length > 0 &&
                    selectedTasks.length < getSortedTasks(filteredTasks).length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTasks(
                        getSortedTasks(filteredTasks).map((t) => t.id)
                      );
                    } else {
                      setSelectedTasks([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell
                onClick={() => handleSort('title')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: sortBy === 'title' ? 700 : 600,
                  color: sortBy === 'title' ? '#00d4ff' : 'inherit',
                  userSelect: 'none',
                }}
              >
                Task{' '}
                {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell
                onClick={() => handleSort('type')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: sortBy === 'type' ? 700 : 600,
                  color: sortBy === 'type' ? '#00d4ff' : 'inherit',
                  userSelect: 'none',
                }}
              >
                Type{' '}
                {sortBy === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell
                onClick={() => handleSort('status')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: sortBy === 'status' ? 700 : 600,
                  color: sortBy === 'status' ? '#00d4ff' : 'inherit',
                  userSelect: 'none',
                }}
              >
                Status{' '}
                {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell
                onClick={() => handleSort('approval_status')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: sortBy === 'approval_status' ? 700 : 600,
                  color: sortBy === 'approval_status' ? '#00d4ff' : 'inherit',
                  userSelect: 'none',
                }}
              >
                Approval{' '}
                {sortBy === 'approval_status' &&
                  (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell
                onClick={() => handleSort('quality_score')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: sortBy === 'quality_score' ? 700 : 600,
                  color: sortBy === 'quality_score' ? '#00d4ff' : 'inherit',
                  userSelect: 'none',
                }}
              >
                Quality{' '}
                {sortBy === 'quality_score' &&
                  (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell
                onClick={() => handleSort('created_at')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: sortBy === 'created_at' ? 700 : 600,
                  color: sortBy === 'created_at' ? '#00d4ff' : 'inherit',
                  userSelect: 'none',
                }}
              >
                Created{' '}
                {sortBy === 'created_at' &&
                  (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedTasks(filteredTasks).length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" py={4}>
                    No tasks found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              getSortedTasks(filteredTasks).map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks([...selectedTasks, task.id]);
                        } else {
                          setSelectedTasks(
                            selectedTasks.filter((id) => id !== task.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {task.title || task.task_name || 'Untitled'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.description || task.topic}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.task_type || task.type || 'general'}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status || 'queued'}
                      size="small"
                      color={getStatusColor(task.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.approval_status || 'pending'}
                      size="small"
                      variant={
                        task.approval_status === 'approved'
                          ? 'filled'
                          : task.approval_status === 'rejected'
                            ? 'filled'
                            : 'outlined'
                      }
                      sx={{
                        backgroundColor:
                          task.approval_status === 'approved'
                            ? 'rgba(76, 175, 80, 0.3)'
                            : task.approval_status === 'rejected'
                              ? 'rgba(244, 67, 54, 0.3)'
                              : 'transparent',
                        color:
                          task.approval_status === 'approved'
                            ? '#4CAF50'
                            : task.approval_status === 'rejected'
                              ? '#F44336'
                              : '#FFC107',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {task.quality_score ? (
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color:
                            task.quality_score >= 85
                              ? '#4CAF50'
                              : task.quality_score >= 70
                                ? '#2196F3'
                                : '#FFC107',
                        }}
                      >
                        {task.quality_score}/100
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(task.created_at).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={async () => {
                          // ✅ FIXED: Fetch full task details from /api/tasks/{id}
                          // This endpoint includes task_metadata with content, quality_score, etc.
                          try {
                            const token = getAuthToken();
                            const headers = {
                              'Content-Type': 'application/json',
                            };
                            if (token) {
                              headers['Authorization'] = `Bearer ${token}`;
                            }

                            const response = await fetch(
                              `http://localhost:8000/api/tasks/${task.id}`,
                              {
                                headers,
                                signal: AbortSignal.timeout(5000),
                              }
                            );

                            if (response.ok) {
                              const fullTask = await response.json();
                              console.log(
                                '✅ Full task data fetched:',
                                fullTask
                              );

                              // Task response includes task_metadata from convert_db_row_to_dict()
                              setSelectedTask(fullTask);
                            } else {
                              console.warn(
                                'Failed to fetch full task, using list data'
                              );
                              setSelectedTask(task);
                            }
                          } catch (error) {
                            console.warn(
                              'Error fetching full task:',
                              error,
                              'using list data'
                            );
                            setSelectedTask(task);
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={(newTaskData) => {
          setShowCreateModal(false);

          // ✅ CRITICAL FIX: Always refresh tasks immediately after creation
          // This ensures newly created tasks appear in the list right away
          // Instead of waiting for auto-refresh (10 seconds)
          // Also add optimistic UI update if data is available

          if (newTaskData) {
            // Create a task object from the response
            const newTask = {
              id:
                newTaskData.task_id ||
                newTaskData.id ||
                'new-task-' + Date.now(),
              title: newTaskData.topic || 'New Task',
              description: newTaskData.description || '',
              status: newTaskData.status || 'in_progress',
              priority: 'normal',
              agent: newTaskData.agent_id || 'Content Generator',
              created_at: new Date().toISOString(),
              ...newTaskData, // Include all returned data
            };

            // Add to beginning of tasks list (optimistic update)
            setTasks([newTask, ...tasks]);

            // Force immediate refresh from backend to ensure consistency
            // This catches any tasks created server-side that weren't in the response
            setTimeout(() => {
              console.log(
                '🔄 TaskManagement: Refreshing after task creation...'
              );
              fetchTasks();
            }, 500);
          } else {
            // Fall back to fetching all tasks
            console.log(
              '🔄 TaskManagement: No data returned, fetching all tasks...'
            );
            fetchTasks();
          }
        }}
      />

      {/* Result Preview Dialog Modal */}
      <Dialog
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#1a1a1a',
            backgroundImage:
              'linear-gradient(135deg, #1a1a1a 0%, #262626 100%)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#00d4ff',
            fontWeight: 600,
          }}
        >
          ✓ Task Result Preview
          <IconButton
            onClick={() => setSelectedTask(null)}
            size="small"
            sx={{
              color: '#888',
              '&:hover': {
                color: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            backgroundColor: 'rgba(26, 26, 26, 0.5)',
            py: 2,
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          {selectedTask && (
            <ResultPreviewPanel
              task={selectedTask}
              onApprove={async (updatedTask) => {
                setIsPublishing(true);
                setError(null);
                try {
                  // ✅ REFACTORED: Use /api/content/tasks/{id}/approve endpoint
                  // Replaces /api/content/blog-posts/drafts/{id}/publish
                  // Supports all task types with type-specific routing
                  const token = getAuthToken();
                  const headers = {
                    'Content-Type': 'application/json',
                  };
                  if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                  }

                  const response = await fetch(
                    `http://localhost:8000/api/content/tasks/${selectedTask.id}/approve`,
                    {
                      method: 'POST',
                      headers,
                      body: JSON.stringify({
                        approved: true,
                        human_feedback:
                          updatedTask.feedback || 'Approved in oversight hub',
                        reviewer_id: updatedTask.reviewer_id || 'admin',
                      }),
                    }
                  );
                  if (response.ok) {
                    // ✅ Update local task status to 'published' and approval_status to 'approved' before closing
                    setTasks(
                      tasks.map((t) =>
                        t.id === selectedTask.id
                          ? {
                              ...t,
                              status: 'published',
                              approval_status: 'approved',
                            }
                          : t
                      )
                    );
                    // ✅ Close dialog and show success
                    setSelectedTask(null);
                    setError(null);
                    // Fetch full task list to sync with backend
                    setTimeout(() => fetchTasks(), 500);
                  } else {
                    const errorData = await response.json().catch(() => ({}));
                    setError(
                      `Failed to publish: ${errorData.detail || errorData.message || response.statusText}`
                    );
                    console.error('Failed to publish:', response.statusText);
                  }
                } catch (error) {
                  const errorMessage =
                    error instanceof Error ? error.message : 'Unknown error';
                  setError(`Error publishing task: ${errorMessage}`);
                  console.error('Failed to publish:', error);
                } finally {
                  setIsPublishing(false);
                }
              }}
              onReject={async (rejectedTask) => {
                setIsPublishing(true);
                setError(null);
                try {
                  // ✅ Send rejection to backend
                  const token = getAuthToken();
                  const headers = {
                    'Content-Type': 'application/json',
                  };
                  if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                  }

                  const response = await fetch(
                    `http://localhost:8000/api/content/tasks/${selectedTask.id}/approve`,
                    {
                      method: 'POST',
                      headers,
                      body: JSON.stringify({
                        approved: false,
                        human_feedback:
                          rejectedTask.rejection_reason ||
                          'Rejected in oversight hub',
                        reviewer_id: rejectedTask.reviewer_id || 'admin',
                      }),
                    }
                  );
                  if (response.ok) {
                    // ✅ Update local task status to 'rejected' and approval_status to 'rejected' before closing
                    setTasks(
                      tasks.map((t) =>
                        t.id === selectedTask.id
                          ? {
                              ...t,
                              status: 'rejected',
                              approval_status: 'rejected',
                            }
                          : t
                      )
                    );
                    // ✅ Close dialog
                    setSelectedTask(null);
                    setError(null);
                    // Fetch full task list to sync with backend
                    setTimeout(() => fetchTasks(), 500);
                  } else {
                    const errorData = await response.json().catch(() => ({}));
                    setError(
                      `Failed to reject: ${errorData.detail || errorData.message || response.statusText}`
                    );
                    console.error('Failed to reject:', response.statusText);
                  }
                } catch (error) {
                  const errorMessage =
                    error instanceof Error ? error.message : 'Unknown error';
                  setError(`Error rejecting task: ${errorMessage}`);
                  console.error('Failed to reject:', error);
                } finally {
                  setIsPublishing(false);
                }
              }}
              isLoading={isPublishing}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TaskManagement;
