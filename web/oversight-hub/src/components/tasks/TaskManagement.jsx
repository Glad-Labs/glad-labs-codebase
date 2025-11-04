import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { getAuthToken } from '../../services/authService';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import CreateTaskModal from './CreateTaskModal';
import TaskQueueView from './TaskQueueView';
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
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAgent, setFilterAgent] = useState('all');
  const [currentTab, setCurrentTab] = useState(0); // 0: Active, 1: Completed, 2: Failed
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch tasks from backend with authorization
   */
  const fetchTasks = async () => {
    try {
      setError(null);
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8000/api/tasks', {
        headers,
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
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
    }
  };

  /**
   * Delete task (uses PATCH with cancelled status instead of DELETE)
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

      const response = await fetch(
        `http://localhost:8000/api/tasks/${taskId}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status: 'cancelled' }),
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
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8000/api/tasks/bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          task_ids: selectedTasks,
          action: action,
        }),
      });

      if (response.ok) {
        setSelectedTasks([]);
        fetchTasks();
      } else {
        setError(`Bulk action failed: ${response.statusText}`);
        console.error('Bulk action failed:', response.statusText);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setError(`Error performing bulk action: ${errorMessage}`);
      console.error('Failed to perform bulk action:', error);
    }
  };

  /**
   * Filter tasks based on criteria
   */
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by tab (status groups)
    if (currentTab === 0) {
      filtered = filtered.filter((t) =>
        ['queued', 'in_progress', 'pending_review'].includes(t.status)
      );
    } else if (currentTab === 1) {
      filtered = filtered.filter((t) => t.status === 'completed');
    } else if (currentTab === 2) {
      filtered = filtered.filter((t) =>
        ['failed', 'cancelled'].includes(t.status)
      );
    }

    // Filter by specific status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    // Filter by agent
    if (filterAgent !== 'all') {
      filtered = filtered.filter((t) => t.agent === filterAgent);
    }

    return filtered;
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

  useEffect(() => {
    fetchTasks();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredTasks = getFilteredTasks();

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
        mb={4}
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
          <Typography variant="body2" color="text.secondary">
            {tasks.length} total tasks • {selectedTasks.length} selected
          </Typography>
        </Box>
        <Box display="flex" gap={1.5}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchTasks}
            sx={{
              textTransform: 'none',
              borderColor: '#00d4ff',
              color: '#00d4ff',
              '&:hover': {
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderColor: '#00d4ff',
              },
            }}
          >
            Refresh
          </Button>
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
            + Create Task
          </Button>
        </Box>
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

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: 1.5,
            color: '#00d4ff',
            '& .MuiAlert-icon': {
              color: '#00d4ff',
            },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            <Typography sx={{ fontWeight: 600 }}>
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''}{' '}
              selected
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                size="small"
                startIcon={<PlayIcon />}
                onClick={() => handleBulkAction('resume')}
                sx={{
                  textTransform: 'none',
                  color: '#00d4ff',
                  borderColor: '#00d4ff',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
                variant="outlined"
              >
                Resume
              </Button>
              <Button
                size="small"
                startIcon={<PauseIcon />}
                onClick={() => handleBulkAction('pause')}
                sx={{
                  textTransform: 'none',
                  color: '#ffaa00',
                  borderColor: '#ffaa00',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 170, 0, 0.1)',
                  },
                }}
                variant="outlined"
              >
                Pause
              </Button>
              <Button
                size="small"
                startIcon={<StopIcon />}
                onClick={() => handleBulkAction('cancel')}
                sx={{
                  textTransform: 'none',
                  color: '#ff6b6b',
                  borderColor: '#ff6b6b',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  },
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleBulkAction('delete')}
                sx={{
                  textTransform: 'none',
                  color: '#ff6b6b',
                  borderColor: '#ff6b6b',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  },
                }}
                variant="outlined"
                color="error"
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(e, v) => setCurrentTab(v)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'rgba(255, 255, 255, 0.6)',
              '&.Mui-selected': {
                color: '#00d4ff',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#00d4ff',
            },
          }}
        >
          <Tab
            label="Active Tasks"
            icon={<AssignmentIcon />}
            iconPosition="start"
          />
          <Tab
            label="Completed"
            icon={<CheckCircleIcon />}
            iconPosition="start"
          />
          <Tab label="Failed" icon={<StopIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel
              sx={{
                color: 'rgba(255, 255, 255, 0.6) !important',
                '&.Mui-focused': {
                  color: '#00d4ff !important',
                },
              }}
            >
              Status
            </InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 212, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 212, 255, 0.4)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00d4ff',
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="queued">Queued</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="pending_review">Pending Review</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel
              sx={{
                color: 'rgba(255, 255, 255, 0.6) !important',
                '&.Mui-focused': {
                  color: '#00d4ff !important',
                },
              }}
            >
              Priority
            </InputLabel>
            <Select
              value={filterPriority}
              label="Priority"
              onChange={(e) => setFilterPriority(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 212, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 212, 255, 0.4)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00d4ff',
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel
              sx={{
                color: 'rgba(255, 255, 255, 0.6) !important',
                '&.Mui-focused': {
                  color: '#00d4ff !important',
                },
              }}
            >
              Agent
            </InputLabel>
            <Select
              value={filterAgent}
              label="Agent"
              onChange={(e) => setFilterAgent(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 212, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 212, 255, 0.4)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00d4ff',
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="content">Content Agent</MenuItem>
              <MenuItem value="financial">Financial Agent</MenuItem>
              <MenuItem value="compliance">Compliance Agent</MenuItem>
              <MenuItem value="market_insight">Market Insight Agent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Task Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    selectedTasks.length === filteredTasks.length &&
                    filteredTasks.length > 0
                  }
                  indeterminate={
                    selectedTasks.length > 0 &&
                    selectedTasks.length < filteredTasks.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTasks(filteredTasks.map((t) => t.id));
                    } else {
                      setSelectedTasks([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" py={4}>
                    No tasks found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
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
                      {task.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={task.agent} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      size="small"
                      color={getStatusColor(task.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      size="small"
                      color={getPriorityColor(task.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(task.created_at).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedTask(task)}
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
        onTaskCreated={() => {
          setShowCreateModal(false);
          fetchTasks();
        }}
      />

      {/* Result Preview Panel */}
      {selectedTask && (
        <Box
          sx={{
            mt: 4,
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#00d4ff', fontWeight: 600 }}>
              ✓ Task Result Preview
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              Review and approve task result before publishing
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: 'rgba(26, 26, 26, 0.8)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: 1.5,
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <ResultPreviewPanel
              task={selectedTask}
              onApprove={async (updatedTask) => {
                setIsPublishing(true);
                setError(null);
                try {
                  const response = await fetch(
                    `http://localhost:8000/api/tasks/${selectedTask.id}/publish`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updatedTask),
                    }
                  );
                  if (response.ok) {
                    setSelectedTask(null);
                    fetchTasks();
                  } else {
                    const errorData = await response.json().catch(() => ({}));
                    setError(
                      `Failed to publish: ${errorData.message || response.statusText}`
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
              onReject={() => setSelectedTask(null)}
              isLoading={isPublishing}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TaskManagement;
