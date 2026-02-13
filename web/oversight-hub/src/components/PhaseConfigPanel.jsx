import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Stack,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { Trash2 } from 'lucide-react';

const PhaseConfigPanel = ({ nodeId, phase, onUpdate, onRemove }) => {
  const [config, setConfig] = useState(phase || {});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onUpdate(nodeId, config);
    setIsDirty(false);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove phase "${config.name}"?`)) {
      onRemove(nodeId);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">
        Phase: {config.name}
      </Typography>

      <Divider />

      <Stack spacing={2}>
        {/* Agent Selection */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Agent
          </Typography>
          <TextField
            value={config.agent || config.name}
            onChange={(e) => handleChange('agent', e.target.value)}
            fullWidth
            size="small"
            helperText="Which agent should handle this phase"
          />
        </Box>

        {/* Description */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Description
          </Typography>
          <TextField
            value={config.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            rows={2}
            size="small"
            placeholder="Phase description"
          />
        </Box>

        <Divider />

        {/* Timeout */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Timeout: {config.timeout_seconds || 300}s
          </Typography>
          <Slider
            value={config.timeout_seconds || 300}
            onChange={(_, value) => handleChange('timeout_seconds', value)}
            min={10}
            max={3600}
            step={10}
            marks={[
              { value: 60, label: '1m' },
              { value: 300, label: '5m' },
              { value: 600, label: '10m' },
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${(v / 60).toFixed(1)}m`}
          />
        </Box>

        {/* Max Retries */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Max Retries: {config.max_retries || 3}
          </Typography>
          <Slider
            value={config.max_retries || 3}
            onChange={(_, value) => handleChange('max_retries', value)}
            min={0}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Quality Threshold (if applicable) */}
        {config.name?.includes('assess') && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Quality Threshold: {(config.quality_threshold || 0.7).toFixed(2)}
            </Typography>
            <Slider
              value={config.quality_threshold || 0.7}
              onChange={(_, value) => handleChange('quality_threshold', value)}
              min={0}
              max={1}
              step={0.05}
              marks={[
                { value: 0.5, label: '0.5' },
                { value: 0.7, label: '0.7' },
                { value: 0.9, label: '0.9' },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => v.toFixed(2)}
            />
          </Box>
        )}

        <Divider />

        {/* Toggles */}
        <FormControlLabel
          control={
            <Switch
              checked={config.skip_on_error || false}
              onChange={(e) => handleChange('skip_on_error', e.target.checked)}
            />
          }
          label="Skip if previous phase fails"
        />

        <FormControlLabel
          control={
            <Switch
              checked={config.required !== false}
              onChange={(e) => handleChange('required', e.target.checked)}
            />
          }
          label="Phase is required (workflow fails if this fails)"
        />

        <Divider />

        {/* Actions */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            onClick={handleSave}
            disabled={!isDirty}
            fullWidth
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Trash2 size={16} />}
            onClick={handleRemove}
          >
            Remove
          </Button>
        </Stack>

        {isDirty && (
          <Alert severity="info" sx={{ py: 1 }}>
            You have unsaved changes
          </Alert>
        )}
      </Stack>
    </Stack>
  );
};

export default PhaseConfigPanel;
