/**
 * TaskContentPreview - Content display section
 * 
 * Displays:
 * - Task topic/title
 * - Generated content preview
 * - Featured image
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const TaskContentPreview = ({ task }) => {
  if (!task) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Content Title */}
      {task.topic && (
        <Box sx={{ mb: 2 }}>
          <h2
            style={{
              margin: '0 0 8px 0',
              color: '#00d9ff',
              fontSize: '24px',
            }}
          >
            {task.topic}
          </h2>
          <small style={{ color: '#999' }}>ID: {task.id}</small>
        </Box>
      )}

      {/* Content Preview */}
      <Box>
        <h3 style={{ marginTop: 0, color: '#e0e0e0' }}>
          📝 Content Preview
        </h3>
        {task.task_metadata?.content ? (
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
              {task.task_metadata.content}
            </pre>
          </Box>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>
            No content available for preview
          </p>
        )}
      </Box>

      {/* Featured Image */}
      {task.task_metadata?.featured_image_url && (
        <Box>
          <h3 style={{ marginTop: 0, color: '#e0e0e0' }}>
            🖼️ Featured Image
          </h3>
          <Box
            component="img"
            src={task.task_metadata.featured_image_url}
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
    </Box>
  );
};

TaskContentPreview.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    topic: PropTypes.string,
    task_metadata: PropTypes.shape({
      content: PropTypes.string,
      featured_image_url: PropTypes.string,
    }),
  }),
};

export default TaskContentPreview;
