import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Chip,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';
import {
  CheckCircle as PassIcon,
  Error as FailIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

/**
 * ConstraintComplianceDisplay
 *
 * Displays word count and writing style constraint compliance metrics.
 * Shows:
 * - Word count actual vs target with progress bar
 * - Tolerance percentage
 * - Writing style applied
 * - Strict mode status
 * - Violation messages if any
 *
 * Props:
 *   - compliance: Object with compliance metrics from backend
 *   - phaseBreakdown: Optional array of per-phase compliance data
 */
const ConstraintComplianceDisplay = ({
  compliance = null,
  phaseBreakdown = null,
}) => {
  if (!compliance) {
    return null;
  }

  const getStatusIcon = (isCompliant) => {
    return isCompliant ? (
      <CheckCircle sx={{ color: '#4ade80', mr: 1 }} />
    ) : (
      <FailIcon sx={{ color: '#ef4444', mr: 1 }} />
    );
  };

  const getStatusColor = (isCompliant) => {
    return isCompliant ? 'success' : 'error';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= -10 && percentage <= 10) return 'success';
    if (percentage >= -20 && percentage <= 20) return 'warning';
    return 'error';
  };

  const wordCountPercentage = compliance.word_count_target
    ? (compliance.word_count_actual / compliance.word_count_target) * 100
    : 0;

  return (
    <Box sx={{ mt: 3 }}>
      {/* Main Compliance Card */}
      <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getStatusIcon(compliance.word_count_within_tolerance)}
              <Typography variant="h6" sx={{ color: '#e2e8f0' }}>
                Constraint Compliance
              </Typography>
            </Box>
          }
          sx={{
            bgcolor: compliance.word_count_within_tolerance
              ? '#0f766e'
              : '#7c2d12',
            borderBottom: '1px solid #334155',
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Word Count Section */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ color: '#cbd5e1', mb: 1, fontWeight: 600 }}
              >
                📊 Word Count
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography sx={{ color: '#94a3b8' }}>
                    {compliance.word_count_actual} /{' '}
                    {compliance.word_count_target} words
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        getProgressColor(compliance.word_count_percentage) ===
                        'success'
                          ? '#4ade80'
                          : getProgressColor(
                                compliance.word_count_percentage
                              ) === 'warning'
                            ? '#facc15'
                            : '#ef4444',
                      fontWeight: 600,
                    }}
                  >
                    {compliance.word_count_percentage > 0 ? '+' : ''}
                    {compliance.word_count_percentage.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(wordCountPercentage, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#334155',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        getProgressColor(compliance.word_count_percentage) ===
                        'success'
                          ? '#4ade80'
                          : getProgressColor(
                                compliance.word_count_percentage
                              ) === 'warning'
                            ? '#facc15'
                            : '#ef4444',
                    },
                  }}
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={
                      compliance.word_count_within_tolerance
                        ? '✅ Within Tolerance'
                        : '❌ Out of Tolerance'
                    }
                    color={
                      compliance.word_count_within_tolerance
                        ? 'success'
                        : 'error'
                    }
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Grid>

            {/* Writing Style Section */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                sx={{ color: '#cbd5e1', mb: 1, fontWeight: 600 }}
              >
                🎨 Writing Style
              </Typography>
              <Typography sx={{ color: '#94a3b8', ml: 2 }}>
                {compliance.writing_style}
              </Typography>
            </Grid>

            {/* Strict Mode Section */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                sx={{ color: '#cbd5e1', mb: 1, fontWeight: 600 }}
              >
                🔒 Strict Mode
              </Typography>
              <Chip
                label={compliance.strict_mode_enforced ? 'Enabled' : 'Disabled'}
                variant="outlined"
                color={compliance.strict_mode_enforced ? 'warning' : 'default'}
                icon={
                  compliance.strict_mode_enforced ? <WarningIcon /> : undefined
                }
                sx={{ ml: 2 }}
              />
            </Grid>

            {/* Violation Message */}
            {compliance.violation_message && (
              <Grid item xs={12}>
                <Alert
                  severity="warning"
                  sx={{ bgcolor: '#7c2d12', borderColor: '#ea580c' }}
                >
                  {compliance.violation_message}
                </Alert>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Phase Breakdown (if provided) */}
      {phaseBreakdown && phaseBreakdown.length > 0 && (
        <Card sx={{ mt: 2, bgcolor: '#1e293b', border: '1px solid #334155' }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ color: '#e2e8f0' }}>
                📈 Per-Phase Breakdown
              </Typography>
            }
            sx={{ bgcolor: '#0f766e', borderBottom: '1px solid #334155' }}
          />
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ bgcolor: '#1e293b' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#0f766e' }}>
                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                      Phase
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: '#e2e8f0', fontWeight: 600 }}
                    >
                      Actual / Target
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: '#e2e8f0', fontWeight: 600 }}
                    >
                      Variance
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: '#e2e8f0', fontWeight: 600 }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {phaseBreakdown.map((phase) => (
                    <TableRow
                      key={phase.phase_name}
                      sx={{
                        bgcolor: '#0f172a',
                        '&:hover': { bgcolor: '#1e293b' },
                      }}
                    >
                      <TableCell
                        sx={{ color: '#cbd5e1', textTransform: 'capitalize' }}
                      >
                        {phase.phase_name}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#cbd5e1' }}>
                        {phase.word_count_actual} / {phase.word_count_target}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: phase.word_count_within_tolerance
                            ? '#4ade80'
                            : '#ef4444',
                          fontWeight: 600,
                        }}
                      >
                        {phase.word_count_percentage > 0 ? '+' : ''}
                        {phase.word_count_percentage.toFixed(1)}%
                      </TableCell>
                      <TableCell align="center">
                        {phase.word_count_within_tolerance ? (
                          <Chip
                            label="✅"
                            size="small"
                            variant="outlined"
                            color="success"
                          />
                        ) : (
                          <Chip
                            label="❌"
                            size="small"
                            variant="outlined"
                            color="error"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ConstraintComplianceDisplay;
