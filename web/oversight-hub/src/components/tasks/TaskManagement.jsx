import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    agent: 'content',
    priority: 'medium',
    parameters: {},
  });

  /**
   * Fetch tasks from backend
   */
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/tasks', {
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create new task
   */
  const handleCreateTask = async () => {
    try {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setCreateDialogOpen(false);
        setNewTask({
          title: '',
          description: '',
          agent: 'content',
          priority: 'medium',
          parameters: {},
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  /**
   * Update existing task
   */
  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  /**
   * Delete task
   */
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  /**
   * Bulk action handler
   */
  const handleBulkAction = async (action) => {
    if (selectedTasks.length === 0) return;

    try {
      const response = await fetch('http://localhost:8000/tasks/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_ids: selectedTasks,
          action: action,
        }),
      });

      if (response.ok) {
        setSelectedTasks([]);
        fetchTasks();
      }
    } catch (error) {
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
        mb={3}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Task Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tasks.length} total tasks • {selectedTasks.length} selected
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchTasks}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Task
          </Button>
        </Box>
      </Box>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''}{' '}
              selected
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                size="small"
                startIcon={<PlayIcon />}
                onClick={() => handleBulkAction('resume')}
              >
                Resume
              </Button>
              <Button
                size="small"
                startIcon={<PauseIcon />}
                onClick={() => handleBulkAction('pause')}
              >
                Pause
              </Button>
              <Button
                size="small"
                startIcon={<StopIcon />}
                onClick={() => handleBulkAction('cancel')}
              >
                Cancel
              </Button>
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleBulkAction('delete')}
                color="error"
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
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
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
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
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              label="Priority"
              onChange={(e) => setFilterPriority(e.target.value)}
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
            <InputLabel>Agent</InputLabel>
            <Select
              value={filterAgent}
              label="Agent"
              onChange={(e) => setFilterAgent(e.target.value)}
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
                        onClick={() => {
                          setEditingTask(task);
                          setNewTask(task);
                          setCreateDialogOpen(true);
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

      {/* Create/Edit Task Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setEditingTask(null);
          setNewTask({
            title: '',
            description: '',
            agent: 'content',
            priority: 'medium',
            parameters: {},
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Agent</InputLabel>
              <Select
                value={newTask.agent}
                label="Agent"
                onChange={(e) =>
                  setNewTask({ ...newTask, agent: e.target.value })
                }
              >
                <MenuItem value="content">Content Agent</MenuItem>
                <MenuItem value="financial">Financial Agent</MenuItem>
                <MenuItem value="compliance">Compliance Agent</MenuItem>
                <MenuItem value="market_insight">Market Insight Agent</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateDialogOpen(false);
              setEditingTask(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTask}
            variant="contained"
            disabled={!newTask.title}
          >
            {editingTask ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManagement;
