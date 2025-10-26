/**
 * Dashboard.jsx
 *
 * Main dashboard component orchestrating:
 * - MetricsDisplay: Real-time task metrics with auto-refresh
 * - TaskCreationModal: Create new blog post tasks
 * - TaskList: Recent/active tasks
 * - Authentication guard: Redirects unauthenticated users to /login
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import useStore from '../store/useStore';
import useTasks from '../hooks/useTasks';
import TaskCreationModal from '../components/TaskCreationModal';
import MetricsDisplay from '../components/MetricsDisplay';

/**
 * Dashboard Component
 *
 * - Requires authentication (redirects to /login if not authenticated)
 * - Combines metrics display and task creation
 * - Auto-refreshes metrics every 30 seconds
 * - Manages TaskCreationModal open/close state
 */
function Dashboard() {
  const navigate = useNavigate();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);
  const tasks = useStore((state) => state.tasks);
  const setSelectedTask = useStore((state) => state.setSelectedTask);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch tasks from API
  useTasks();

  // Authentication guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle task created
  const handleTaskCreated = () => {
    setModalOpen(false);
    // Refresh metrics by closing modal - MetricsDisplay will auto-refresh
  };

  // If not authenticated, show loading (will redirect)
  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Redirecting to login...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Dashboard Header */}
      <Paper elevation={0} sx={{ mb: 4, p: 3, bgcolor: 'background.default' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Welcome back, {user?.email || 'User'}! Monitor your AI-powered
              content generation pipeline.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            size="large"
            sx={{ minWidth: 160 }}
          >
            Create Task
          </Button>
        </Box>
      </Paper>

      {/* Metrics Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase' }}
        >
          Metrics Overview
        </Typography>
        <MetricsDisplay refreshInterval={30000} />
      </Box>

      {/* Recent Tasks Section */}
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase' }}
        >
          Recent Tasks ({tasks.length})
        </Typography>
        {tasks && tasks.length > 0 ? (
          <Grid container spacing={2}>
            {tasks.slice(0, 6).map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id || task.title}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => setSelectedTask(task)}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {task.title || task.name || 'Untitled Task'}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Status:{' '}
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            task.status === 'completed'
                              ? 'success.main'
                              : task.status === 'failed'
                                ? 'error.main'
                                : 'warning.main',
                        }}
                      >
                        {task.status || 'pending'}
                      </Typography>
                    </Typography>
                  </Box>
                  {task.priority && (
                    <Typography variant="body2" color="textSecondary">
                      Priority: {task.priority}
                    </Typography>
                  )}
                  {task.dueDate && (
                    <Typography variant="body2" color="textSecondary">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            No tasks yet. Click "Create Task" to get started!
          </Alert>
        )}
      </Box>

      {/* Task Creation Modal */}
      <TaskCreationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </Container>
  );
}

export default Dashboard;
