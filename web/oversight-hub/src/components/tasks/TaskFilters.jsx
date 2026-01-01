/**
 * TaskFilters - Task filtering and sorting controls
 *
 * Allows users to:
 * - Sort by different fields
 * - Change sort direction
 * - Filter by status
 * - Reset filters
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

const TaskFilters = ({
  sortBy = 'created_at',
  sortDirection = 'desc',
  statusFilter = '',
  onSortChange,
  onDirectionChange,
  onStatusChange,
  onResetFilters,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 2,
        p: 2,
        backgroundColor: 'rgba(0, 217, 255, 0.03)',
        borderRadius: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="created_at">Created Date</MenuItem>
          <MenuItem value="status">Status</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="task_type">Task Type</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Direction</InputLabel>
        <Select
          value={sortDirection}
          onChange={(e) => onDirectionChange(e.target.value)}
          label="Direction"
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          label="Status"
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="published">Published</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        size="small"
        startIcon={<ClearIcon />}
        onClick={onResetFilters}
        sx={{ ml: 'auto' }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default TaskFilters;

TaskFilters.propTypes = {
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  statusFilter: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
  onDirectionChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};

TaskFilters.defaultProps = {
  sortBy: 'created_at',
  sortDirection: 'desc',
  statusFilter: '',
};
