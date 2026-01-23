/**
 * TaskMetadataDisplay - Display task metadata in grid format
 * 
 * Features:
 * - Category
 * - Writing style
 * - Target audience
 * - Word count
 * - SEO metadata (keywords, title, description)
 * - Quality metrics
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Paper } from '@mui/material';

/**
 * Helper to get quality score badge color and label
 */
const getQualityBadge = (score) => {
  if (typeof score !== 'number') return { label: 'N/A', color: '#666' };
  if (score >= 4.5) return { label: 'Excellent', color: '#4ade80' };
  if (score >= 3.5) return { label: 'Good', color: '#22c55e' };
  if (score >= 2.5) return { label: 'Fair', color: '#eab308' };
  return { label: 'Poor', color: '#ef4444' };
};

const TaskMetadataDisplay = ({ task }) => {
  if (!task) return null;

  const extractedMetadata = task.extracted_metadata || {};
  const seoData = task.seo_keywords || {};
  const qualityBadge = getQualityBadge(task.quality_score);

  const metadataItems = [
    {
      label: 'Category',
      value: extractedMetadata.category || 'Not specified',
    },
    {
      label: 'Style',
      value: extractedMetadata.writing_style || 'Not specified',
    },
    {
      label: 'Target Audience',
      value: extractedMetadata.target_audience || 'Not specified',
    },
    {
      label: 'Word Count',
      value: extractedMetadata.word_count
        ? `${extractedMetadata.word_count} words`
        : 'Not specified',
    },
    {
      label: 'Quality Score',
      value: task.quality_score
        ? `${task.quality_score.toFixed(2)}/5.0 (${qualityBadge.label})`
        : 'Not rated',
      color: qualityBadge.color,
    },
  ];

  return (
    <Box>
      <h3
        style={{
          margin: '0 0 12px 0',
          color: '#00d9ff',
          fontSize: '1rem',
        }}
      >
        📊 Metadata & Metrics
      </h3>

      <Grid container spacing={1.5}>
        {metadataItems.map((item, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Paper
              sx={{
                padding: '12px',
                backgroundColor: 'rgba(15, 15, 15, 0.5)',
                borderRadius: '4px',
                border: '1px solid rgba(0, 217, 255, 0.2)',
              }}
            >
              <p
                style={{
                  margin: '0 0 6px 0',
                  color: '#999',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  margin: 0,
                  color: item.color || '#e0e0e0',
                  fontSize: '0.95rem',
                  fontWeight: item.color ? 'bold' : 'normal',
                }}
              >
                {item.value}
              </p>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* SEO Metadata Section */}
      {(seoData.keywords || seoData.title || seoData.description) && (
        <Box sx={{ marginTop: 2 }}>
          <h4
            style={{
              margin: '0 0 12px 0',
              color: '#a78bfa',
              fontSize: '0.95rem',
            }}
          >
            🔍 SEO Metadata
          </h4>

          {seoData.title && (
            <Box
              sx={{
                marginBottom: '12px',
                padding: '10px',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                borderRadius: '4px',
                borderLeft: '3px solid #a78bfa',
              }}
            >
              <p
                style={{
                  margin: '0 0 4px 0',
                  color: '#a78bfa',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                SEO Title
              </p>
              <p style={{ margin: 0, color: '#e0e0e0', fontSize: '0.9rem' }}>
                {seoData.title}
              </p>
            </Box>
          )}

          {seoData.description && (
            <Box
              sx={{
                marginBottom: '12px',
                padding: '10px',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                borderRadius: '4px',
                borderLeft: '3px solid #a78bfa',
              }}
            >
              <p
                style={{
                  margin: '0 0 4px 0',
                  color: '#a78bfa',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                SEO Description
              </p>
              <p style={{ margin: 0, color: '#e0e0e0', fontSize: '0.9rem' }}>
                {seoData.description}
              </p>
            </Box>
          )}

          {seoData.keywords && (
            <Box
              sx={{
                padding: '10px',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                borderRadius: '4px',
                borderLeft: '3px solid #a78bfa',
              }}
            >
              <p
                style={{
                  margin: '0 0 8px 0',
                  color: '#a78bfa',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                Keywords
              </p>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Array.isArray(seoData.keywords)
                  ? seoData.keywords.map((kw, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          backgroundColor: 'rgba(167, 139, 250, 0.2)',
                          borderRadius: '3px',
                          border: '1px solid rgba(167, 139, 250, 0.4)',
                          color: '#d8b4fe',
                          fontSize: '0.85rem',
                        }}
                      >
                        {kw}
                      </Box>
                    ))
                  : (
                      <p
                        style={{
                          margin: 0,
                          color: '#d8b4fe',
                          fontSize: '0.85rem',
                        }}
                      >
                        {seoData.keywords}
                      </p>
                    )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

TaskMetadataDisplay.propTypes = {
  task: PropTypes.shape({
    extracted_metadata: PropTypes.object,
    seo_keywords: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    quality_score: PropTypes.number,
  }),
};

export default TaskMetadataDisplay;
