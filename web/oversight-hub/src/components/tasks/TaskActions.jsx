/**
 * TaskActions - Dialogs for task approval, rejection, and deletion
 *
 * Manages:
 * - Approve task dialog (with feedback field)
 * - Reject task dialog (with reason field)
 * - Delete confirmation dialog
 * 
 * Integrates with unifiedStatusService for all status operations.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { unifiedStatusService } from '../../services/unifiedStatusService';

const TaskActions = ({
  selectedTask = null,
  isLoading = false,
  onApprove,
  onReject,
  onDelete,
  onClose,
}) => {
  const [dialogType, setDialogType] = useState(null); // 'approve', 'reject', 'delete', null
  const [feedback, setFeedback] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [validationWarning, setValidationWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseDialog = () => {
    setDialogType(null);
    setFeedback('');
    setReason('');
    setError('');
    setValidationWarning('');
  };

  const handleApproveSubmit = async () => {
    if (!selectedTask?.id) {
      setError('Task ID is missing');
      return;
    }

    try {
      setError('');
      setValidationWarning('');
      setIsSubmitting(true);

      // Use unified service
      const result = await unifiedStatusService.approve(
        selectedTask.id,
        feedback
      );

      // Show validation warnings if any
      if (result.validation_details?.warnings?.length > 0) {
        setValidationWarning(
          'Warnings: ' + result.validation_details.warnings.join(', ')
        );
      }

      // Call legacy callback if provided
      if (onApprove) {
        await onApprove(selectedTask.id, feedback);
      }

      handleCloseDialog();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to approve task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    if (!selectedTask?.id) {
      setError('Task ID is missing');
      return;
    }

    try {
      setError('');
      setValidationWarning('');
      setIsSubmitting(true);

      // Use unified service
      const result = await unifiedStatusService.reject(selectedTask.id, reason);

      // Show validation warnings if any
      if (result.validation_details?.warnings?.length > 0) {
        setValidationWarning(
          'Warnings: ' + result.validation_details.warnings.join(', ')
        );
      }

      // Call legacy callback if provided
      if (onReject) {
        await onReject(selectedTask.id, reason);
      }

      handleCloseDialog();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reject task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedTask?.id) {
      setError('Task ID is missing');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      // Call legacy callback if provided
      if (onDelete) {
        await onDelete(selectedTask.id);
      }

      handleCloseDialog();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hidden triggers for dialogs - opened by parent component */}
      {/* The dialogs are controlled by dialogType state */}

      {/* Approval Dialog */}
      <Dialog
        open={dialogType === 'approve'}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Task</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {validationWarning && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {validationWarning}
            </Alert>
          )}
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to approve this task?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Feedback (optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add any feedback or notes..."
            disabled={isLoading || isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApproveSubmit}
            variant="contained"
            color="success"
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? (
              <CircularProgress size={20} />
            ) : (
              'Approve'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog
        open={dialogType === 'reject'}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Task</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {validationWarning && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {validationWarning}
            </Alert>
          )}
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejecting this task.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you're rejecting this task..."
            disabled={isLoading || isSubmitting}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectSubmit}
            variant="contained"
            color="error"
            disabled={isLoading || isSubmitting || !reason.trim()}
          >
            {isLoading || isSubmitting ? (
              <CircularProgress size={20} />
            ) : (
              'Reject'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogType === 'delete'}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSubmit}
            variant="contained"
            color="error"
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? (
              <CircularProgress size={20} />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Export methods for dialog state management
TaskActions.openApproveDialog = (setDialogType) => setDialogType('approve');
TaskActions.openRejectDialog = (setDialogType) => setDialogType('reject');
TaskActions.openDeleteDialog = (setDialogType) => setDialogType('delete');

TaskActions.propTypes = {
  selectedTask: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TaskActions;
