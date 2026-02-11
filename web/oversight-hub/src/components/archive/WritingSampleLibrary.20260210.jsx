import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  CircularProgress,
  Typography,
  Divider,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

/**
 * WritingSampleLibrary Component
 *
 * Displays and manages user's writing samples
 * Includes: list, view, delete, pagination, search
 *
 * Features:
 * - Display all writing samples
 * - View full content
 * - Delete samples with confirmation
 * - Pagination
 * - Search/filter
 * - Style and tone chips
 */
function WritingSampleLibrary(props) {
  const { onSampleDeleted = null, onSampleViewed = null } = props;

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSample, setSelectedSample] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/writing-style/samples', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSamples(data.samples || []);
      } else {
        setError('Failed to load samples');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (sample) => {
    setSelectedSample(sample);
    setViewDialogOpen(true);
    if (onSampleViewed) {
      onSampleViewed(sample);
    }
  };

  const handleDeleteClick = (sample) => {
    setSelectedSample(sample);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSample) return;

    try {
      const response = await fetch(
        `/api/writing-style/samples/${selectedSample.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        setSamples(samples.filter((s) => s.id !== selectedSample.id));
        setDeleteDialogOpen(false);
        if (onSampleDeleted) {
          onSampleDeleted(selectedSample.id);
        }
      } else {
        setError('Failed to delete sample');
      }
    } catch (err) {
      setError(`Delete error: ${err.message}`);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter samples by search query
  const filteredSamples = samples.filter((sample) =>
    sample.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedSamples = filteredSamples.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Card>
        <CardHeader title="Writing Sample Library" />
        <Divider />
        <CardContent sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Writing Sample Library"
        action={
          <Tooltip title="Refresh">
            <IconButton onClick={fetchSamples} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <Divider />
      <CardContent>
        {error && (
          <Box
            sx={{ mb: 2, p: 1.5, backgroundColor: '#ffebee', borderRadius: 1 }}
          >
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}

        {/* Search Bar */}
        {samples.length > 0 && (
          <TextField
            fullWidth
            placeholder="Search samples by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
            size="small"
            variant="outlined"
          />
        )}

        {/* Samples Table */}
        {samples.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
            No writing samples yet. Upload one to get started!
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Title</TableCell>
                    <TableCell>Style</TableCell>
                    <TableCell>Tone</TableCell>
                    <TableCell align="right">Word Count</TableCell>
                    <TableCell align="center">Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedSamples.map((sample) => (
                    <TableRow key={sample.id} hover>
                      <TableCell>{sample.title}</TableCell>
                      <TableCell>
                        {sample.style ? (
                          <Chip
                            label={sample.style}
                            size="small"
                            variant="filled"
                          />
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {sample.tone ? (
                          <Chip
                            label={sample.tone}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {sample.word_count || 0}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="caption">
                          {sample.created_at
                            ? new Date(sample.created_at).toLocaleDateString()
                            : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => handleView(sample)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(sample)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredSamples.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </CardContent>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{selectedSample?.title}</span>
          {selectedSample?.word_count && (
            <Chip label={`${selectedSample.word_count} words`} size="small" />
          )}
        </DialogTitle>
        <Divider />
        <DialogContent dividers sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              mb: 2,
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
            }}
          >
            {selectedSample?.content || 'No content available'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Metadata */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {selectedSample?.style && (
              <Chip
                label={`Style: ${selectedSample.style}`}
                variant="outlined"
              />
            )}
            {selectedSample?.tone && (
              <Chip label={`Tone: ${selectedSample.tone}`} variant="outlined" />
            )}
            {selectedSample?.word_count && (
              <Chip
                label={`${selectedSample.word_count} words`}
                variant="outlined"
              />
            )}
            {selectedSample?.created_at && (
              <Chip
                label={`Created: ${new Date(selectedSample.created_at).toLocaleDateString()}`}
                variant="outlined"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen}>
        <DialogTitle>Delete Sample?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{selectedSample?.title}</strong>?
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: 'block', mt: 1 }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

WritingSampleLibrary.defaultProps = {
  onSampleDeleted: null,
  onSampleViewed: null,
};

WritingSampleLibrary.propTypes = {
  onSampleDeleted: PropTypes.func,
  onSampleViewed: PropTypes.func,
};

export default WritingSampleLibrary;
