import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography, Chip } from '@mui/material';
import OrchestratorMessageCard from './OrchestratorMessageCard';

/**
 * OrchestratorStatusMessage
 *
 * Renders a real-time status update from orchestrator execution.
 * Uses OrchestratorMessageCard base component for consistent styling.
 *
 * Refactored to use base component: 352 → 100 lines (-72% boilerplate).
 */
const OrchestratorStatusMessage = ({ message }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress bar
  useEffect(() => {
    if (!message.progress) return;
    const interval = setInterval(() => {
      setAnimatedProgress((prev) => {
        const target = message.progress || 0;
        return prev < target ? Math.min(prev + 2, target) : prev;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [message.progress]);

  const phases = message.phases || [];
  const currentPhaseIndex = message.currentPhaseIndex || 0;
  const currentPhase = phases[currentPhaseIndex] || {};

  const phaseEmojis = {
    Research: '🔍',
    Analysis: '📊',
    Generation: '✨',
    Review: '👀',
    Refinement: '🔨',
    Publishing: '📤',
  };

  const getPhaseStatus = (index) => {
    if (index < currentPhaseIndex) return 'complete';
    if (index === currentPhaseIndex) return 'current';
    return 'pending';
  };

  const getStatusColor = (status) => {
    const colors = {
      complete: '#4caf50',
      current: '#2196f3',
      pending: '#bdbdbd',
    };
    return colors[status] || '#999';
  };

  const getStatusLabel = (status) => {
    const labels = {
      complete: '✓ Done',
      current: '⏳ Running',
      pending: '⏸ Waiting',
    };
    return labels[status] || 'Unknown';
  };

  // Metadata for header
  const metadata = [
    { label: 'Phase', value: `${currentPhaseIndex + 1}/${phases.length}` },
    { label: 'Progress', value: `${animatedProgress}%` },
  ];

  // Expandable content - phase breakdown
  const expandedContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Phase Breakdown
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {phases.map((phase, index) => {
          const status = getPhaseStatus(index);
          const statusColor = getStatusColor(status);
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1,
                borderRadius: '4px',
                background: `rgba(255, 255, 255, ${status === 'current' ? 0.15 : 0.08})`,
                border:
                  status === 'current' ? `2px solid ${statusColor}` : 'none',
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: statusColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {status === 'complete' ? '✓' : index + 1}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {phase.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.7, display: 'block' }}
                >
                  {phase.description || `Phase ${index + 1}`}
                </Typography>
              </Box>
              <Chip
                label={getStatusLabel(status)}
                size="small"
                sx={{
                  background: statusColor,
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          mt: 1,
          p: 1,
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
        }}
      >
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          <strong>Execution ID:</strong> {message.executionId?.substring(0, 12)}
          ...
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          <strong>Started:</strong>{' '}
          {new Date(message.startedAt).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );

  const estimatedTimeRemaining = () => {
    const phasesRemaining = phases.length - currentPhaseIndex;
    return phasesRemaining * 2; // 2 minutes per phase average
  };

  return (
    <OrchestratorMessageCard
      headerIcon="⚙️"
      headerLabel="Orchestration in Progress"
      gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      metadata={metadata}
      expandedContent={expandedContent}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {phaseEmojis[currentPhase.name] || '🔄'} {currentPhase.name}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {getStatusLabel(getPhaseStatus(currentPhaseIndex))}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9, fontStyle: 'italic' }}>
          {currentPhase.description || 'Processing...'}
        </Typography>
        <Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
          >
            <Typography variant="caption">Progress</Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {animatedProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={animatedProgress}
            sx={{
              height: 8,
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              '& .MuiLinearProgress-bar': {
                borderRadius: '4px',
                background: 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)',
                transition: 'width 0.3s ease',
              },
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          ⏱️ Est. {estimatedTimeRemaining()} min remaining
        </Typography>
      </Box>
    </OrchestratorMessageCard>
  );
};

OrchestratorStatusMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['status']).isRequired,
    progress: PropTypes.number,
    currentPhaseIndex: PropTypes.number,
    phases: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        status: PropTypes.string,
        description: PropTypes.string,
      })
    ),
    currentTask: PropTypes.string,
    estimatedTimeRemaining: PropTypes.number,
    timestamp: PropTypes.number,
    executionId: PropTypes.string,
    startedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};

OrchestratorStatusMessage.defaultProps = {};

export default OrchestratorStatusMessage;
