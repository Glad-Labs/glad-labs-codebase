/**
 * TaskCreationModal.jsx
 *
 * Modal component for creating new blog post tasks
 * - Form inputs for blog topic, keyword, audience, category
 * - Integration with cofounderAgentClient.createBlogPost()
 * - Real-time task polling with progress updates
 * - Success/error handling with user feedback
 *
 * @component
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  LinearProgress,
  Alert,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import useFormValidation from '../hooks/useFormValidation';
import {
  createBlogPost,
  pollTaskStatus,
} from '../services/cofounderAgentClient';

/**
 * Task creation steps
 */
const STEPS = ['Create Task', 'Execution', 'Complete'];

/**
 * TaskCreationModal Component
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Callback when modal closes
 * @param {Function} props.onTaskCreated - Callback after task created
 */
export default function TaskCreationModal({ open, onClose, onTaskCreated }) {
  // Form state and validation using custom hook
  const form = useFormValidation({
    initialValues: {
      topic: '',
      primaryKeyword: '',
      targetAudience: '',
      category: 'technology',
    },
    onSubmit: handleSubmit,
  });

  // UI state
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [taskProgress, setTaskProgress] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Get authentication state from AuthContext
  const { isAuthenticated } = useAuth();

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.values.topic.trim()) {
      form.setFieldError('topic', 'Blog topic is required');
      return;
    }
    if (!form.values.primaryKeyword.trim()) {
      form.setFieldError('primaryKeyword', 'Primary keyword is required');
      return;
    }
    if (!form.values.targetAudience.trim()) {
      form.setFieldError('targetAudience', 'Target audience is required');
      return;
    }

    if (!isAuthenticated) {
      form.setGeneralError('You must be logged in to create tasks');
      return;
    }

    try {
      setLoading(true);
      setStep(0); // Create Task step

      // Create the blog post task
      const response = await createBlogPost(
        form.values.topic,
        form.values.primaryKeyword,
        form.values.targetAudience,
        form.values.category
      );

      if (!response.id) {
        throw new Error('Failed to create task - no task ID returned');
      }

      setTaskId(response.id);
      setTaskProgress({
        status: 'pending',
        progress: 0,
      });

      // Move to execution step
      setStep(1);

      // Start polling for task status
      await pollTaskStatus(response.id, (task) => {
        setTaskProgress(task);
        // Calculate progress percentage based on status
        const statusProgress = {
          pending: 10,
          in_progress: 50,
          completed: 100,
          failed: 0,
        };
        setProgressPercentage(statusProgress[task.status] || 0);
      });

      // Task completed
      setSuccess(true);
      setStep(2);

      // Callback
      if (onTaskCreated) {
        onTaskCreated(response);
      }
    } catch (err) {
      console.error('❌ Task creation error:', err);
      // Extract detailed error message for display
      let errorMessage = 'Failed to create task';
      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.response) {
        // Include backend response details
        console.error('Backend response:', err.response);
        if (typeof err.response === 'string') {
          errorMessage = err.response;
        } else if (typeof err.response === 'object') {
          errorMessage =
            err.response.message ||
            JSON.stringify(err.response).substring(0, 200);
        }
      }
      console.error('📋 Final error message:', errorMessage);
      form.setGeneralError(errorMessage);
      setStep(0);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (loading) {
      return; // Don't allow closing while loading
    }

    // Reset form
    form.reset();
    setStep(0);
    setSuccess(false);
    setTaskId(null);
    setTaskProgress(null);
    setProgressPercentage(0);

    onClose();
  };

  /**
   * Handle retry after error
   */
  const handleRetry = () => {
    form.clearErrors();
    setSuccess(false);
    setStep(0);
    setTaskProgress(null);
    setProgressPercentage(0);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>Create Blog Post Task</DialogTitle>

      <DialogContent>
        {/* Stepper */}
        <Box sx={{ mb: 3, mt: 2 }}>
          <Stepper activeStep={step}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Error Alert */}
        {form.errors.general && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => form.clearErrors()}
          >
            {form.errors.general}
          </Alert>
        )}

        {/* Step 0: Create Task Form */}
        {step === 0 && !success && (
          <Box
            component="form"
            onSubmit={form.handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Blog Topic"
              fullWidth
              {...form.getFieldProps('topic')}
              placeholder="e.g., The Future of AI in Healthcare"
              disabled={loading}
              required
              error={!!form.errors.topic}
              helperText={form.errors.topic}
            />

            <TextField
              label="Primary Keyword"
              fullWidth
              {...form.getFieldProps('primaryKeyword')}
              placeholder="e.g., AI healthcare trends"
              disabled={loading}
              required
              error={!!form.errors.primaryKeyword}
              helperText={form.errors.primaryKeyword}
            />

            <TextField
              label="Target Audience"
              fullWidth
              {...form.getFieldProps('targetAudience')}
              placeholder="e.g., Healthcare professionals"
              disabled={loading}
              required
              error={!!form.errors.targetAudience}
              helperText={form.errors.targetAudience}
            />

            <TextField
              label="Category"
              fullWidth
              select
              {...form.getFieldProps('category')}
              disabled={loading}
              SelectProps={{
                native: true,
              }}
            >
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </TextField>

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                Create Task
              </Button>
            </DialogActions>
          </Box>
        )}

        {/* Step 1: Task Execution */}
        {step === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Task ID: <strong>{taskId}</strong>
            </Typography>

            {taskProgress && (
              <>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Status: <strong>{taskProgress.status.toUpperCase()}</strong>
                  </Typography>
                </Box>

                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {progressPercentage}%
                  </Typography>
                </Box>

                {taskProgress.metadata && (
                  <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Metadata:</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: 150,
                        overflow: 'auto',
                        mt: 1,
                      }}
                    >
                      {JSON.stringify(taskProgress.metadata, null, 2)}
                    </Typography>
                  </Paper>
                )}
              </>
            )}

            {!taskProgress && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            )}

            <Typography variant="caption" color="text.secondary" align="center">
              Task is processing. Please wait...
            </Typography>
          </Box>
        )}

        {/* Step 2: Success */}
        {step === 2 && success && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              align: 'center',
              py: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
            </Box>

            <Typography variant="h6" align="center">
              Task Created Successfully!
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center">
              Your blog post task has been created and executed.
            </Typography>

            {taskProgress?.result && (
              <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Result:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 200,
                    overflow: 'auto',
                    mt: 1,
                  }}
                >
                  {JSON.stringify(taskProgress.result, null, 2)}
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      {!loading && success && (
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Done
          </Button>
        </DialogActions>
      )}

      {!loading && form.errors.general && (
        <DialogActions>
          <Button onClick={handleRetry} variant="contained" color="primary">
            Retry
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
