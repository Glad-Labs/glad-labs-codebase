import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Typography,
  Grid,
} from '@mui/material';
import { getAuthToken } from '../../services/authService';

/**
 * BlogPostCreator - Create blog posts through the AI pipeline
 * Generates content, SEO metadata, images, and publishes to Strapi
 */
const BlogPostCreator = ({ onBlogPostCreated, onError }) => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('technical');
  const [tone, setTone] = useState('professional');
  const [targetLength, setTargetLength] = useState(1500);
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [generateImage, setGenerateImage] = useState(true);
  const [useEnhanced, setUseEnhanced] = useState(true);
  const [publishMode, setPublishMode] = useState('draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!topic.trim()) {
      setError('Please enter a blog post topic');
      return;
    }

    try {
      setLoading(true);

      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload = {
        topic,
        style,
        tone,
        target_length: parseInt(targetLength),
        tags: tags ? tags.split(',').map((t) => t.trim()) : [],
        categories: categories
          ? categories.split(',').map((c) => c.trim())
          : [],
        generate_featured_image: generateImage,
        enhanced: useEnhanced,
        publish_mode: publishMode,
        target_environment: 'production',
      };

      console.log('📝 Creating blog post with payload:', payload);

      const response = await fetch('http://localhost:8000/api/content/tasks', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          task_type: 'blog_post',
          ...payload,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            `Failed to create blog post: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('✅ Blog post task created:', data);

      setSuccess(
        `✅ Blog post creation started! Task ID: ${data.task_id}\n\nPolling URL: ${data.polling_url}`
      );

      // Clear form
      setTopic('');
      setTags('');
      setCategories('');

      // Notify parent component
      if (onBlogPostCreated) {
        onBlogPostCreated(data);
      }
    } catch (err) {
      console.error('❌ Error creating blog post:', err);
      setError(err.message);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          ✍️ Create Blog Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Topic Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Blog Post Topic"
                placeholder="e.g., How AI is transforming business automation"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
                required
              />
            </Grid>

            {/* Style Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Content Style</InputLabel>
                <Select
                  value={style}
                  label="Content Style"
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="narrative">Narrative</MenuItem>
                  <MenuItem value="listicle">Listicle</MenuItem>
                  <MenuItem value="educational">Educational</MenuItem>
                  <MenuItem value="thought-leadership">
                    Thought Leadership
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Tone Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={tone}
                  label="Tone"
                  onChange={(e) => setTone(e.target.value)}
                >
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="inspirational">Inspirational</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Target Length */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Target Word Count"
                value={targetLength}
                onChange={(e) => setTargetLength(e.target.value)}
                disabled={loading}
                inputProps={{ min: '200', max: '5000' }}
              />
            </Grid>

            {/* Publish Mode */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Publish Mode</InputLabel>
                <Select
                  value={publishMode}
                  label="Publish Mode"
                  onChange={(e) => setPublishMode(e.target.value)}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="publish">Publish Immediately</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Tags Input */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tags"
                placeholder="ai, automation, business (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={loading}
              />
            </Grid>

            {/* Categories Input */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Categories"
                placeholder="Technology, Business (comma-separated)"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                disabled={loading}
              />
            </Grid>

            {/* Checkboxes */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={generateImage}
                    onChange={(e) => setGenerateImage(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Generate Featured Image (Pexels)"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useEnhanced}
                    onChange={(e) => setUseEnhanced(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Use SEO Enhancement Pipeline"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !topic.trim()}
                sx={{
                  background:
                    'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
                    Creating Blog Post...
                  </>
                ) : (
                  '✍️ Create Blog Post'
                )}
              </Button>
            </Grid>

            {/* Info Text */}
            <Grid item xs={12}>
              <Typography
                variant="caption"
                sx={{ color: '#999', display: 'block', mt: 1 }}
              >
                💡 Your blog post will be generated using AI, optimized for SEO,
                and saved to Strapi. You can check the progress using the task
                ID.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogPostCreator;
