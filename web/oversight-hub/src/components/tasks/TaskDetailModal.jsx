import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
} from '@mui/material';
import useStore from '../../store/useStore';
import {
  StatusAuditTrail,
  StatusTimeline,
  ValidationFailureUI,
  StatusDashboardMetrics,
} from './StatusComponents.jsx';

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
  const { selectedTask, setSelectedTask } = useStore();
  const [tabValue, setTabValue] = useState(0);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState('');
  const [reviewerId, setReviewerId] = useState('oversight_hub_user');
  const [imageSource, setImageSource] = useState('pexels');
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [imageGenerating, setImageGenerating] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle image generation
  const handleGenerateImage = useCallback(
    async (source) => {
      setImageGenerating(true);
      try {
        const token = localStorage.getItem('authToken');
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `http://localhost:8000/api/content/tasks/${selectedTask.id}/generate-image`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              source: source || imageSource,
              topic: selectedTask.topic,
              content_summary:
                selectedTask.task_metadata?.content?.substring(0, 500) || '',
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Image generation failed: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.image_url) {
          setSelectedImageUrl(result.image_url);
          alert('✅ Image generated successfully!');
        }
      } catch (error) {
        console.error('❌ Image generation error:', error);
        alert(`❌ Error generating image: ${error.message}`);
      } finally {
        setImageGenerating(false);
      }
    },
    [selectedTask, imageSource]
  );

  // Handle task approval/publishing
  const handleApproveTask = useCallback(
    async (updatedTask) => {
      setApprovalLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Call the approval endpoint with state-managed values
        const response = await fetch(
          `http://localhost:8000/api/content/tasks/${selectedTask.id}/approve`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              approved: true,
              human_feedback: approvalFeedback || 'Approved from oversight hub',
              reviewer_id: reviewerId,
              featured_image_url: updatedTask.featured_image_url,
              image_source: imageSource,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Approval failed: ${response.statusText}`);
        }

        const result = await response.json();
        alert(
          `✅ Task approved and published!\n\nURL: ${result.published_url || 'Success'}`
        );
        // Reset form state
        setApprovalFeedback('');
        setReviewerId('oversight_hub_user');
        setImageSource('pexels');
        setSelectedImageUrl('');
        setSelectedTask(null);
        onClose();
      } catch (error) {
        console.error('❌ Approval error:', error);
        alert(`❌ Error approving task: ${error.message}`);
      } finally {
        setApprovalLoading(false);
      }
    },
    [
      selectedTask,
      approvalFeedback,
      reviewerId,
      imageSource,
      selectedImageUrl,
      setSelectedTask,
      onClose,
    ]
  );

  const handleRejectTask = useCallback(
    async (feedback) => {
      setApprovalLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `http://localhost:8000/api/content/tasks/${selectedTask.id}/approve`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              approved: false,
              human_feedback: feedback || 'Rejected from oversight hub',
              reviewer_id: reviewerId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Rejection failed: ${response.statusText}`);
        }

        alert('✅ Task rejected successfully');
        // Reset form state
        setApprovalFeedback('');
        setReviewerId('oversight_hub_user');
        setImageSource('pexels');
        setSelectedImageUrl('');
        setSelectedTask(null);
        onClose();
      } catch (error) {
        console.error('❌ Rejection error:', error);
        alert(`❌ Error rejecting task: ${error.message}`);
      } finally {
        setApprovalLoading(false);
      }
    },
    [selectedTask, reviewerId, setSelectedTask, onClose]
  );

  // Return null after all hooks have been called
  if (!selectedTask) return null;

  return (
    <Dialog
      open={!!selectedTask}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      SlotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        },
      }}
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          backgroundColor: '#1a1a1a',
          color: '#e0e0e0',
          backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #242424 100%)',
        },
      }}
    >
      <DialogTitle
        sx={{
          color: '#00d9ff',
          borderBottom: '1px solid #333',
          fontWeight: 'bold',
        }}
      >
        Task Details:{' '}
        {selectedTask.topic || selectedTask.task_name || 'Untitled'}
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#0f0f0f', borderColor: '#333' }}>
        <Box sx={{ borderBottom: 1, borderColor: '#333', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="task details tabs"
            sx={{
              '& .MuiTab-root': {
                color: '#999',
                '&.Mui-selected': {
                  color: '#00d9ff',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00d9ff',
              },
            }}
          >
            <Tab label="Content & Approval" id="taskdetail-tab-0" />
            <Tab label="Timeline" id="taskdetail-tab-1" />
            <Tab label="History" id="taskdetail-tab-2" />
            <Tab label="Validation" id="taskdetail-tab-3" />
            <Tab label="Metrics" id="taskdetail-tab-4" />
          </Tabs>
        </Box>

        {/* Tab 0: Content & Approval */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Content Title */}
            {selectedTask.topic && (
              <Box sx={{ mb: 2 }}>
                <h2
                  style={{
                    margin: '0 0 8px 0',
                    color: '#00d9ff',
                    fontSize: '24px',
                  }}
                >
                  {selectedTask.topic}
                </h2>
                <small style={{ color: '#999' }}>ID: {selectedTask.id}</small>
              </Box>
            )}

            {/* Content Preview */}
            <Box>
              <h3 style={{ marginTop: 0, color: '#e0e0e0' }}>
                📝 Content Preview
              </h3>
              {selectedTask.task_metadata?.content ? (
                <Box
                  sx={{
                    backgroundColor: '#0f0f0f',
                    padding: 2,
                    borderRadius: 1,
                    maxHeight: '500px',
                    overflowY: 'auto',
                    border: '1px solid #333',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#e0e0e0',
                  }}
                >
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      margin: 0,
                    }}
                  >
                    {selectedTask.task_metadata.content}
                  </pre>
                </Box>
              ) : (
                <p style={{ color: '#999', fontStyle: 'italic' }}>
                  No content available for preview
                </p>
              )}
            </Box>

            {/* Featured Image */}
            {(selectedTask.task_metadata?.featured_image_url ||
              selectedImageUrl) && (
              <Box>
                <h3 style={{ marginTop: 0, color: '#e0e0e0' }}>
                  🖼️ Featured Image
                </h3>
                <Box
                  component="img"
                  src={
                    selectedImageUrl ||
                    selectedTask.task_metadata?.featured_image_url
                  }
                  alt="Featured"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: 1,
                    border: '1px solid #333',
                  }}
                />
              </Box>
            )}

            {/* Image Selection (for awaiting_approval) */}
            {(selectedTask.status === 'awaiting_approval' ||
              selectedTask.status === 'rejected') && (
              <Box
                sx={{
                  background:
                    'linear-gradient(135deg, #1a2a3a 0%, #1a2a1a 100%)',
                  padding: 2,
                  borderRadius: 1,
                  border: '1px solid #00d9ff',
                }}
              >
                <h3 style={{ marginTop: 0, color: '#00d9ff' }}>
                  🎨 Image Management
                </h3>
                <Box sx={{ mb: 2 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 'bold',
                      color: '#e0e0e0',
                    }}
                  >
                    Image Source:
                  </label>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={
                        imageSource === 'pexels' ? 'contained' : 'outlined'
                      }
                      onClick={() => setImageSource('pexels')}
                      size="small"
                      sx={{
                        color: imageSource === 'pexels' ? '#fff' : '#00d9ff',
                        backgroundColor:
                          imageSource === 'pexels' ? '#00d9ff' : 'transparent',
                        borderColor: '#00d9ff',
                        '&:hover': {
                          backgroundColor:
                            imageSource === 'pexels'
                              ? '#00c2d4'
                              : 'rgba(0, 217, 255, 0.1)',
                        },
                      }}
                    >
                      📷 Pexels
                    </Button>
                    <Button
                      variant={
                        imageSource === 'sdxl' ? 'contained' : 'outlined'
                      }
                      onClick={() => setImageSource('sdxl')}
                      size="small"
                      sx={{
                        color: imageSource === 'sdxl' ? '#fff' : '#00d9ff',
                        backgroundColor:
                          imageSource === 'sdxl' ? '#00d9ff' : 'transparent',
                        borderColor: '#00d9ff',
                        '&:hover': {
                          backgroundColor:
                            imageSource === 'sdxl'
                              ? '#00c2d4'
                              : 'rgba(0, 217, 255, 0.1)',
                        },
                      }}
                    >
                      🤖 SDXL
                    </Button>
                  </Box>
                </Box>

                {/* Image URL Input */}
                <TextField
                  fullWidth
                  size="small"
                  label="Image URL (or generate below)"
                  value={selectedImageUrl}
                  onChange={(e) => setSelectedImageUrl(e.target.value)}
                  placeholder="https://..."
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#0f0f0f',
                      borderColor: '#333',
                      color: '#e0e0e0',
                      '&:hover fieldset': {
                        borderColor: '#00d9ff',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#666',
                      opacity: 1,
                    },
                    '& .MuiInputLabel-root': {
                      color: '#999',
                    },
                  }}
                />

                {/* Image Generation Buttons */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleGenerateImage(imageSource)}
                    disabled={imageGenerating}
                    sx={{
                      backgroundColor: '#00d9ff',
                      color: '#000',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#00c2d4' },
                      '&:disabled': { backgroundColor: '#666', color: '#999' },
                    }}
                  >
                    {imageGenerating ? '⟳ Generating...' : '✨ Generate Image'}
                  </Button>
                  {selectedImageUrl && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleGenerateImage(imageSource)}
                      disabled={imageGenerating}
                      sx={{
                        borderColor: '#00d9ff',
                        color: '#00d9ff',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 217, 255, 0.1)',
                          borderColor: '#00d9ff',
                        },
                      }}
                    >
                      🔄 Retry
                    </Button>
                  )}
                </Box>

                <small
                  style={{ display: 'block', marginTop: '8px', color: '#999' }}
                >
                  {imageSource === 'pexels'
                    ? '✓ Will search Pexels for relevant images'
                    : '✓ Will generate with SDXL based on content'}
                </small>
              </Box>
            )}

            {/* Task Metadata */}
            {(selectedTask.category ||
              selectedTask.style ||
              selectedTask.target_audience) && (
              <Box
                sx={{
                  background:
                    'linear-gradient(135deg, #1a1a1a 0%, #242424 100%)',
                  padding: 2,
                  borderRadius: 1,
                  border: '1px solid #333',
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: '12px',
                    color: '#e0e0e0',
                  }}
                >
                  📋 Details
                </h3>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 2,
                    fontSize: '13px',
                    color: '#e0e0e0',
                  }}
                >
                  {selectedTask.category && (
                    <Box>
                      <strong style={{ color: '#00d9ff' }}>Category:</strong>
                      <br />
                      <span style={{ color: '#999' }}>
                        {selectedTask.category}
                      </span>
                    </Box>
                  )}
                  {selectedTask.style && (
                    <Box>
                      <strong style={{ color: '#00d9ff' }}>Style:</strong>
                      <br />
                      <span style={{ color: '#999' }}>
                        {selectedTask.style}
                      </span>
                    </Box>
                  )}
                  {selectedTask.target_audience && (
                    <Box>
                      <strong style={{ color: '#00d9ff' }}>Audience:</strong>
                      <br />
                      <span style={{ color: '#999' }}>
                        {selectedTask.target_audience}
                      </span>
                    </Box>
                  )}
                  {selectedTask.metadata?.word_count && (
                    <Box>
                      <strong style={{ color: '#00d9ff' }}>Word Count:</strong>
                      <br />
                      <span style={{ color: '#999' }}>
                        {selectedTask.metadata.word_count} words
                      </span>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* Approval Section */}
            {(selectedTask.status === 'awaiting_approval' ||
              selectedTask.status === 'rejected') && (
              <Box
                sx={{
                  backgroundColor: '#f0fff4',
                  padding: 2,
                  borderRadius: 1,
                  border: '1px solid #86efac',
                }}
              >
                <h3 style={{ marginTop: 0 }}>✅ Review & Approve</h3>

                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Reviewer ID"
                    size="small"
                    value={reviewerId}
                    onChange={(e) => setReviewerId(e.target.value)}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    label="Approval Notes / Feedback"
                    placeholder="Add any notes about this task (optional)"
                    value={approvalFeedback}
                    onChange={(e) => setApprovalFeedback(e.target.value)}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: '#10b981',
                      '&:hover': { backgroundColor: '#059669' },
                    }}
                    onClick={() =>
                      handleApproveTask({
                        ...selectedTask,
                        featured_image_url:
                          selectedImageUrl ||
                          selectedTask.task_metadata?.featured_image_url,
                      })
                    }
                    disabled={approvalLoading}
                  >
                    {approvalLoading
                      ? '⟳ Publishing...'
                      : '✅ Approve & Publish'}
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={() => handleRejectTask(approvalFeedback)}
                    disabled={approvalLoading}
                  >
                    {approvalLoading ? '⟳ Processing...' : '❌ Reject'}
                  </Button>
                </Box>
              </Box>
            )}

            {!['awaiting_approval', 'rejected'].includes(
              selectedTask.status
            ) && (
              <Box
                sx={{
                  backgroundColor: '#fef3c7',
                  padding: 2,
                  borderRadius: 1,
                  border: '1px solid #fcd34d',
                }}
              >
                <p style={{ margin: 0 }}>
                  ℹ️ This task is not pending approval (Status:{' '}
                  <strong>{selectedTask.status}</strong>)
                </p>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Tab 1: Timeline */}
        <TabPanel value={tabValue} index={1}>
          <StatusTimeline
            currentStatus={selectedTask.status}
            statusHistory={selectedTask.statusHistory || []}
            compact={false}
          />
        </TabPanel>

        {/* Tab 2: History */}
        <TabPanel value={tabValue} index={2}>
          <StatusAuditTrail taskId={selectedTask.id} limit={100} />
        </TabPanel>

        {/* Tab 3: Validation Failures */}
        <TabPanel value={tabValue} index={3}>
          <ValidationFailureUI taskId={selectedTask.id} limit={50} />
        </TabPanel>

        {/* Tab 4: Metrics */}
        <TabPanel value={tabValue} index={4}>
          <StatusDashboardMetrics
            statusHistory={selectedTask.statusHistory || [selectedTask.status]}
            compact={false}
          />
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
