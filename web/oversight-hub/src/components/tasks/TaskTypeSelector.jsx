/**
 * TaskTypeSelector.jsx
 *
 * Component for selecting task type
 * Displays all available task types with descriptions and emojis
 * Used in CreateTaskModal
 *
 * Props:
 * - taskTypes: Object with task type definitions
 * - selectedType: Currently selected task type
 * - onSelect: Callback when task type is selected
 */

import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';

const TaskTypeSelector = ({ taskTypes, selectedType, onSelect }) => {
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select Task Type
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(taskTypes).map(([key, taskType]) => (
          <Grid
            key={key}
            sx={{
              width: '100%',
              '@media (min-width: 600px)': {
                width: 'calc(50% - 8px)',
              },
            }}
          >
            <Button
              fullWidth
              variant={selectedType === key ? 'contained' : 'outlined'}
              color={selectedType === key ? 'primary' : 'inherit'}
              onClick={() => onSelect(key)}
              sx={{
                p: 2,
                textAlign: 'left',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor:
                    selectedType === key ? 'primary.main' : 'action.hover',
                },
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', mb: 0.5 }}
                >
                  {taskType.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', opacity: 0.8 }}
                >
                  {taskType.description}
                </Typography>
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskTypeSelector;
