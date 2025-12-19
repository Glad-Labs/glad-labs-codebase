import React, { useState } from 'react';
import {
  Box,
  Container,
  Button,
  TextField,
  Paper,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import LangGraphStreamProgress from '../components/LangGraphStreamProgress';

export default function LangGraphTestPage() {
  const [requestId, setRequestId] = useState(null);
  const [blogTopic, setBlogTopic] = useState('Python Testing Best Practices');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleCreateBlog = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/content/langgraph/blog-posts',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: blogTopic,
            keywords: ['testing', 'automation', 'best-practices'],
            audience: 'developers',
            tone: 'technical',
            word_count: 1500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create blog: ${response.statusText}`);
      }

      const data = await response.json();
      setRequestId(data.request_id);
    } catch (err) {
      console.error('Error creating blog:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (result) => {
    console.log('Blog generation complete:', result);
    setSuccessMessage('Blog created successfully!');
    setTimeout(() => {
      setRequestId(null);
      setBlogTopic('');
    }, 2000);
  };

  const handleError = (error) => {
    console.error('Error during generation:', error);
    setError(`Error: ${error}`);
  };

  const handleReset = () => {
    setRequestId(null);
    setError(null);
    setSuccessMessage(null);
    setBlogTopic('Python Testing Best Practices');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          LangGraph Blog Generator
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Test the LangGraph workflow engine with real-time progress streaming
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {/* Input Section */}
      {!requestId && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Blog Topic"
              value={blogTopic}
              onChange={(e) => setBlogTopic(e.target.value)}
              variant="outlined"
              placeholder="Enter blog topic..."
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Keywords (comma-separated)"
              defaultValue="testing, automation, best-practices"
              variant="outlined"
              disabled={loading}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleCreateBlog}
                disabled={!blogTopic.trim() || loading}
                sx={{ flex: 1 }}
              >
                {loading ? 'Creating...' : 'Create Blog Post'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Progress Section */}
      {requestId && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Processing: {blogTopic}
          </Typography>
          <LangGraphStreamProgress
            requestId={requestId}
            onComplete={handleComplete}
            onError={handleError}
          />
        </Paper>
      )}

      {/* Info Section */}
      <Paper sx={{ p: 3, mt: 4, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          How It Works
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>1. Enter a Blog Topic</strong> - Provide the subject for
            blog generation
          </Typography>
          <Typography variant="body2">
            <strong>2. Click Create</strong> - Sends request to FastAPI backend
          </Typography>
          <Typography variant="body2">
            <strong>3. Real-Time Progress</strong> - Watch the 6-phase workflow:
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography variant="caption">
              • Research (15%) → Outline (30%) → Draft (50%) → Quality Check
              (70%) → Finalization (100%)
            </Typography>
          </Box>
          <Typography variant="body2">
            <strong>4. Automatic Refinement</strong> - Quality assessment loops
            up to 3 times
          </Typography>
          <Typography variant="body2">
            <strong>5. Completion</strong> - Final blog post and metadata
            generated
          </Typography>
        </Stack>
      </Paper>

      {/* Technical Info */}
      <Paper sx={{ p: 3, mt: 4, backgroundColor: '#f0f4ff' }}>
        <Typography variant="h6" gutterBottom>
          Technical Details
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Backend:</strong> FastAPI + LangGraph
          </Typography>
          <Typography variant="body2">
            <strong>Streaming:</strong> WebSocket for real-time progress
          </Typography>
          <Typography variant="body2">
            <strong>HTTP Endpoint:</strong> POST
            /api/content/langgraph/blog-posts
          </Typography>
          <Typography variant="body2">
            <strong>WebSocket:</strong>{' '}
            ws://localhost:8000/api/content/langgraph/ws/blog-posts/
            {'{request_id}'}
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
