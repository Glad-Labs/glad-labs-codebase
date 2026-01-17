import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  LinearProgress,
  TextField,
  Typography,
  Grid,
  Alert,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/**
 * WritingSampleUpload Component
 *
 * Allows users to upload writing samples (TXT, CSV, JSON)
 * Includes file selection, metadata entry, and upload progress
 *
 * Features:
 * - Drag-and-drop file selection
 * - Click-to-select files
 * - Form fields for title, style, tone
 * - Upload progress indicator
 * - Error/success messages
 */
function WritingSampleUpload(props) {
  const { onUploadSuccess = null } = props;
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('');
  const [tone, setTone] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Style options (matching backend)
  const styleOptions = [
    { value: 'technical', label: 'Technical' },
    { value: 'narrative', label: 'Narrative' },
    { value: 'listicle', label: 'Listicle' },
    { value: 'educational', label: 'Educational' },
    { value: 'thought-leadership', label: 'Thought-leadership' },
  ];

  // Tone options
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'conversational', label: 'Conversational' },
  ];

  // Handle file selection via file input
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  // Handle drag over
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  // Validate file type
  const validateAndSetFile = (selectedFile) => {
    const validExtensions = ['.txt', '.csv', '.json'];
    const fileExtension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf('.'))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setMessage({
        type: 'error',
        text: 'Invalid file type. Please use TXT, CSV, or JSON files.',
      });
      return;
    }

    setFile(selectedFile);
    setMessage(null);

    // Auto-fill title if empty
    if (!title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setTitle(fileName);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (style) formData.append('style', style);
    if (tone) formData.append('tone', tone);

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + Math.random() * 30;
          return prev;
        });
      }, 200);

      const response = await fetch('/api/writing-style/samples/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      clearInterval(progressInterval);

      if (response.ok) {
        const result = await response.json();
        setProgress(100);
        setMessage({
          type: 'success',
          text: `✓ Sample uploaded successfully! ID: ${result.id}`,
        });

        // Reset form
        setTimeout(() => {
          setFile(null);
          setTitle('');
          setStyle('');
          setTone('');
          setProgress(0);

          // Call success callback
          if (onUploadSuccess) {
            onUploadSuccess(result);
          }
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({
          type: 'error',
          text: error.detail || 'Upload failed. Please try again.',
        });
        setProgress(0);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Upload error: ${error.message}`,
      });
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Upload Writing Sample"
        subheader="Upload TXT, CSV, or JSON files (max 5MB)"
        avatar={<CloudUploadIcon />}
      />
      <Divider />
      <CardContent>
        {/* File Drop Zone */}
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            mb: 3,
            p: 3,
            border: '2px dashed',
            borderColor: dragActive ? 'primary.main' : '#ccc',
            borderRadius: 1,
            backgroundColor: dragActive ? 'action.hover' : 'background.paper',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <input
            type="file"
            id="sample-upload-input"
            hidden
            onChange={handleFileSelect}
            accept=".txt,.csv,.json"
          />
          <label
            htmlFor="sample-upload-input"
            style={{
              cursor: 'pointer',
              display: 'block',
              width: '100%',
            }}
          >
            <CloudUploadIcon
              sx={{
                fontSize: 48,
                color: dragActive ? 'primary.main' : '#999',
                mb: 1,
                transition: 'color 0.3s ease',
              }}
            />
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {file ? file.name : 'Click or drag file here'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Supported: TXT, CSV, JSON (max 5MB, 100-50,000 chars)
            </Typography>
          </label>
        </Box>

        {/* Form Fields */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Sample Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Technical Blog Post Example"
              helperText="Auto-filled from filename if empty"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Writing Style</InputLabel>
              <Select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                label="Writing Style"
              >
                <MenuItem value="">
                  <em>Auto-detect (optional)</em>
                </MenuItem>
                {styleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Optional - auto-detected if not selected
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tone</InputLabel>
              <Select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                label="Tone"
              >
                <MenuItem value="">
                  <em>Auto-detect (optional)</em>
                </MenuItem>
                {toneOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Optional - auto-detected if not selected
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">
                Uploading... {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        {/* Messages */}
        {message && (
          <Alert
            severity={message.type}
            sx={{ mb: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        {/* Upload Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          startIcon={
            uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
          }
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            fontSize: '1rem',
          }}
        >
          {uploading
            ? `Uploading... ${Math.round(progress)}%`
            : 'Upload Sample'}
        </Button>

        {/* File Info */}
        {file && (
          <Box
            sx={{ mt: 2, p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1 }}
          >
            <Typography variant="caption" display="block">
              <strong>File:</strong> {file.name}
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Type:</strong> {file.type || 'text/plain'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

WritingSampleUpload.defaultProps = {
  onUploadSuccess: null,
};

WritingSampleUpload.propTypes = {
  onUploadSuccess: PropTypes.func,
};

export default WritingSampleUpload;
