import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useLangGraphStream } from '../hooks/useLangGraphStream';

/**
 * LangGraph Stream Progress Component
 *
 * Displays real-time progress of blog creation using LangGraph pipeline
 *
 * Props:
 *   - requestId: String - The request ID to stream from
 *   - onComplete: Function(result) - Callback when pipeline completes
 *   - onError: Function(error) - Callback on error
 */
function LangGraphStreamProgress({ requestId, onComplete, onError }) {
  const progress = useLangGraphStream(requestId);

  // Handle completion
  React.useEffect(() => {
    if (progress.status === 'completed' && onComplete) {
      onComplete({
        requestId,
        quality: progress.quality,
        refinements: progress.refinements,
      });
    }
  }, [
    progress.status,
    progress.quality,
    progress.refinements,
    requestId,
    onComplete,
  ]);

  // Handle errors
  React.useEffect(() => {
    if (progress.status === 'error' && onError) {
      onError(progress.error);
    }
  }, [progress.status, progress.error, onError]);

  if (progress.status === 'error') {
    return (
      <Alert severity="error" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon />
          <div>
            <Typography variant="subtitle1">Pipeline Failed</Typography>
            <Typography variant="body2">{progress.error}</Typography>
          </div>
        </Box>
      </Alert>
    );
  }

  const currentPhaseIndex = progress.phases.findIndex(
    (p) =>
      p.name.toLowerCase().replace(/\s/g, '') ===
      progress.phase.toLowerCase().replace(/\s/g, '')
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Progress Stepper */}
      <Stepper activeStep={currentPhaseIndex} sx={{ my: 2 }}>
        {progress.phases.map((phase, idx) => (
          <Step key={idx} completed={phase.completed}>
            <StepLabel>
              {phase.completed && (
                <CheckCircleIcon sx={{ color: 'success.main' }} />
              )}
              {phase.name}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Linear Progress Bar */}
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            {progress.phase === 'pending' ? 'Starting...' : progress.phase}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {progress.progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress.progress}
          sx={{ height: 8, borderRadius: 1 }}
        />
      </Box>

      {/* Quality Score Card */}
      {progress.quality > 0 && (
        <Card sx={{ my: 2, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="subtitle2">Quality Assessment</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {progress.quality}/100
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2">Refinements</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {progress.refinements}
                </Typography>
              </Box>
              {progress.status === 'in_progress' && (
                <CircularProgress size={24} />
              )}
              {progress.status === 'completed' && (
                <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Content Preview */}
      {progress.content && (
        <Card sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Current Preview
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#666', maxHeight: 200, overflow: 'auto' }}
            >
              {progress.content}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Completion Message */}
      {progress.status === 'completed' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon />
            <Typography>
              Pipeline completed successfully! Quality score: {progress.quality}
              /100
            </Typography>
          </Box>
        </Alert>
      )}
    </Box>
  );
}

export default LangGraphStreamProgress;
