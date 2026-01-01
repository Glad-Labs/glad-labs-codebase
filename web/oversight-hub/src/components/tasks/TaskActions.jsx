/**
 * TaskActions - Dialogs for task approval, rejection, and deletion
 *
 * Manages:
 * - Approve task dialog (with feedback field)
 * - Reject task dialog (with reason field)
 * - Delete confirmation dialog
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
} from '@mui/material';

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

  const handleCloseDialog = () => {
    setDialogType(null);
    setFeedback('');
    setReason('');
    setError('');
  };

  const handleApproveSubmit = async () => {
    try {
      setError('');
      await onApprove(selectedTask.id, feedback);
      handleCloseDialog();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to approve task');
    }
  };

  const handleRejectSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    try {
      setError('');
      await onReject(selectedTask.id, reason);
      handleCloseDialog();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reject task');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setError('');
      await onDelete(selectedTask.id);
      handleCloseDialog();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  return (
    <>
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
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleApproveSubmit}
            variant="contained"
            color="success"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Approve'}
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
            disabled={isLoading}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleRejectSubmit}
            variant="contained"
            color="error"
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Reject'}
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
          <Button onClick={handleCloseDialog} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSubmit}
            variant="contained"
            color="error"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

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

TaskActions.defaultProps = {
  selectedTask: null,
  isLoading: false,
};

export default TaskActions;
