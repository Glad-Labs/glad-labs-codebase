import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import useStore from '../../store/useStore';
import ErrorDetailPanel from './ErrorDetailPanel';
import ConstraintComplianceDisplay from './ConstraintComplianceDisplay';
import {
  StatusAuditTrail,
  StatusTimeline,
  ValidationFailureUI,
  StatusDashboardMetrics,
} from './StatusComponents';
import { unifiedStatusService } from '../../services/unifiedStatusService';

const renderStatus = (status) => (
  <span
    className={`status-badge status-${status?.toLowerCase().replace(' ', '-')}`}
  >
    {status || 'Unknown'}
  </span>
);

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>⚠️ {message}</p>
  </div>
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`taskdetail-tabpanel-${index}`}
      aria-labelledby={`taskdetail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const TaskDetailModal = ({ onClose }) => {
  const { selectedTask } = useStore();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!selectedTask) return null;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog
      open={!!selectedTask}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        Task Details:{' '}
        {selectedTask.topic || selectedTask.task_name || 'Untitled'}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="task details tabs"
          >
            <Tab label="Overview" id="taskdetail-tab-0" />
            <Tab label="Timeline" id="taskdetail-tab-1" />
            <Tab label="History" id="taskdetail-tab-2" />
            <Tab label="Validation" id="taskdetail-tab-3" />
            <Tab label="Metrics" id="taskdetail-tab-4" />
          </Tabs>
        </Box>

        {/* Tab 0: Overview */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ space: 2 }}>
            <Box sx={{ mb: 2 }}>
              <strong>Status:</strong> {renderStatus(selectedTask.status)}
            </Box>

            <Box sx={{ mb: 2 }}>
              <strong>ID:</strong> {selectedTask.id}
            </Box>

            {selectedTask.category && (
              <Box sx={{ mb: 2 }}>
                <strong>Category:</strong> {selectedTask.category}
              </Box>
            )}

            {selectedTask.target_audience && (
              <Box sx={{ mb: 2 }}>
                <strong>Target Audience:</strong> {selectedTask.target_audience}
              </Box>
            )}

            {(selectedTask.style || selectedTask.metadata?.style) && (
              <Box sx={{ mb: 2 }}>
                <strong>Style:</strong>{' '}
                {selectedTask.style || selectedTask.metadata?.style || 'N/A'}
              </Box>
            )}

            {(selectedTask.tone || selectedTask.metadata?.tone) && (
              <Box sx={{ mb: 2 }}>
                <strong>Tone:</strong>{' '}
                {selectedTask.tone || selectedTask.metadata?.tone || 'N/A'}
              </Box>
            )}

            {(selectedTask.target_length ||
              selectedTask.metadata?.word_count) && (
              <Box sx={{ mb: 2 }}>
                <strong>Target Length:</strong>{' '}
                {selectedTask.target_length ||
                  selectedTask.metadata?.word_count ||
                  'N/A'}{' '}
                words
              </Box>
            )}

            {selectedTask.publishedUrl && (
              <Box sx={{ mb: 2 }}>
                <strong>Published URL:</strong>{' '}
                <a
                  href={selectedTask.publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2' }}
                >
                  {selectedTask.publishedUrl}
                </a>
              </Box>
            )}

            {selectedTask.constraint_compliance && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <ConstraintComplianceDisplay
                  compliance={selectedTask.constraint_compliance}
                  phaseBreakdown={selectedTask.task_metadata?.phase_compliance}
                />
              </Box>
            )}

            {selectedTask.status === 'failed' && (
              <Box sx={{ mt: 2 }}>
                <ErrorDetailPanel task={selectedTask} />
              </Box>
            )}

            {selectedTask.error &&
              !['failed'].includes(selectedTask.status) && (
                <Box sx={{ mt: 2 }}>
                  <ErrorMessage message={selectedTask.error} />
                </Box>
              )}
          </Box>
        </TabPanel>

        {/* Tab 1: Timeline */}
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <CircularProgress />
          ) : (
            <StatusTimeline
              currentStatus={selectedTask.status}
              statusHistory={selectedTask.statusHistory || []}
              compact={false}
            />
          )}
        </TabPanel>

        {/* Tab 2: History */}
        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            <StatusAuditTrail taskId={selectedTask.id} limit={100} />
          )}
        </TabPanel>

        {/* Tab 3: Validation Failures */}
        <TabPanel value={tabValue} index={3}>
          {loading ? (
            <CircularProgress />
          ) : (
            <ValidationFailureUI taskId={selectedTask.id} limit={50} />
          )}
        </TabPanel>

        {/* Tab 4: Metrics */}
        <TabPanel value={tabValue} index={4}>
          {loading ? (
            <CircularProgress />
          ) : (
            <StatusDashboardMetrics
              statusHistory={
                selectedTask.statusHistory || [selectedTask.status]
              }
              compact={false}
            />
          )}
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailModal;
