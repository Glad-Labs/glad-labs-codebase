/**
 * SettingsManager.jsx
 *
 * Complete React component for managing application settings with:
 * - Role-based access control (Admin, Editor, Viewer, Guest)
 * - List view with filters (category, environment, search)
 * - Create/Edit forms with validation
 * - Delete confirmation dialogs
 * - Audit history viewer
 * - Encryption indicators
 * - Bulk operations
 * - Export functionality
 *
 * API Integration: Connects to backend Settings API endpoints
 * - GET /api/settings - List with pagination
 * - GET /api/settings/:id - Get single setting
 * - POST /api/settings - Create new
 * - PUT /api/settings/:id - Update
 * - DELETE /api/settings/:id - Delete
 * - GET /api/settings/:id/history - Audit trail
 *
 * @component
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Alert,
  Switch,
  FormControlLabel,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import './SettingsManager.css';

/**
 * API Service for Settings Management
 * Handles all HTTP communication with the backend
 */
const settingsAPI = {
  /**
   * Get paginated list of settings
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (0-indexed)
   * @param {number} params.per_page - Items per page (1-100)
   * @param {string} params.category - Filter by category
   * @param {string} params.environment - Filter by environment
   * @param {string} params.search - Search term
   * @returns {Promise<Object>}
   */
  listSettings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/settings?${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  /**
   * Get single setting by ID
   * @param {string} id - Setting ID
   * @returns {Promise<Object>}
   */
  getSetting: async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/settings/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch setting');
    return response.json();
  },

  /**
   * Create new setting
   * @param {Object} setting - Setting data
   * @returns {Promise<Object>}
   */
  createSetting: async (setting) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/settings`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setting),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create setting');
    }
    return response.json();
  },

  /**
   * Update existing setting
   * @param {string} id - Setting ID
   * @param {Object} setting - Updated setting data
   * @returns {Promise<Object>}
   */
  updateSetting: async (id, setting) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/settings/${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setting),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update setting');
    }
    return response.json();
  },

  /**
   * Delete setting
   * @param {string} id - Setting ID
   * @returns {Promise<void>}
   */
  deleteSetting: async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/settings/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) throw new Error('Failed to delete setting');
  },

  /**
   * Get audit history for a setting
   * @param {string} id - Setting ID
   * @param {number} limit - Limit number of records (1-500)
   * @returns {Promise<Object>}
   */
  getHistory: async (id, limit = 50) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/settings/${id}/history?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },

  /**
   * Export settings
   * @param {string} format - Export format: 'json', 'yaml', or 'csv'
   * @param {boolean} includeSecrets - Include secret values in export
   * @returns {Promise<Blob>}
   */
  exportSettings: async (format = 'json', includeSecrets = false) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/settings/export/all?format=${format}&include_secrets=${includeSecrets}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) throw new Error('Failed to export settings');
    return response.blob();
  },
};

/**
 * Role constants for permission checking
 */
const ROLE_PERMISSIONS = {
  ADMIN: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT', 'AUDIT'],
  EDITOR: ['CREATE', 'READ', 'UPDATE', 'AUDIT'],
  VIEWER: ['READ', 'AUDIT'],
  GUEST: [],
};

/**
 * Categories available for settings
 */
const SETTING_CATEGORIES = [
  'database',
  'authentication',
  'api',
  'notifications',
  'system',
  'integration',
  'security',
  'performance',
];

/**
 * Environments available for settings
 */
const ENVIRONMENTS = ['development', 'staging', 'production', 'all'];

/**
 * Data types for settings
 */
const DATA_TYPES = ['string', 'integer', 'boolean', 'json', 'secret'];

/**
 * SettingsManager Component
 * Main component for managing application settings
 */
function SettingsManager({ userRole = 'VIEWER' }) {
  // State management
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [filterCategory, setFilterCategory] = useState('');
  const [filterEnvironment, setFilterEnvironment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);

  // Form data
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    data_type: 'string',
    category: 'system',
    environment: 'production',
    description: '',
    is_encrypted: false,
    is_read_only: false,
    tags: '',
  });

  // History data
  const [settingHistory, setSettingHistory] = useState([]);

  // Visibility toggles for secret values
  const [visibleSecrets, setVisibleSecrets] = useState({});

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  /**
   * Check if user has permission for action
   */
  const canPerformAction = useCallback(
    (action) => {
      return ROLE_PERMISSIONS[userRole]?.includes(action) || false;
    },
    [userRole]
  );

  /**
   * Load settings from backend
   */
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsAPI.listSettings({
        page: page + 1,
        per_page: rowsPerPage,
        category: filterCategory || undefined,
        environment: filterEnvironment || undefined,
        search: searchTerm || undefined,
      });
      setSettings(data.items || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load settings');
      console.error('Settings load error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterCategory, filterEnvironment, searchTerm]);

  /**
   * Initial load and reload on filter changes
   */
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /**
   * Handle page change
   */
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Handle rows per page change
   */
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Handle create button click
   */
  const handleCreateClick = () => {
    setFormData({
      key: '',
      value: '',
      data_type: 'string',
      category: 'system',
      environment: 'production',
      description: '',
      is_encrypted: false,
      is_read_only: false,
      tags: '',
    });
    setOpenCreateDialog(true);
  };

  /**
   * Handle edit button click
   */
  const handleEditClick = (setting) => {
    setSelectedSetting(setting);
    setFormData({
      key: setting.key,
      value: setting.value || '',
      data_type: setting.data_type,
      category: setting.category,
      environment: setting.environment,
      description: setting.description || '',
      is_encrypted: setting.is_encrypted,
      is_read_only: setting.is_read_only,
      tags: (setting.tags || []).join(', '),
    });
    setOpenEditDialog(true);
  };

  /**
   * Handle delete button click
   */
  const handleDeleteClick = (setting) => {
    setSelectedSetting(setting);
    setOpenDeleteDialog(true);
  };

  /**
   * Handle history button click
   */
  const handleHistoryClick = async (setting) => {
    try {
      setSelectedSetting(setting);
      setLoading(true);
      const data = await settingsAPI.getHistory(setting.id, 50);
      setSettingHistory(data.items || []);
      setOpenHistoryDialog(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form field change
   */
  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Handle create/update form submit
   */
  const handleFormSubmit = async () => {
    try {
      if (!formData.key || !formData.value) {
        setError('Key and value are required');
        return;
      }

      const submitData = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (selectedSetting) {
        // Update existing
        const updated = await settingsAPI.updateSetting(
          selectedSetting.id,
          submitData
        );
        setSuccessMessage(`Setting "${updated.key}" updated successfully`);
        setOpenEditDialog(false);
      } else {
        // Create new
        const created = await settingsAPI.createSetting(submitData);
        setSuccessMessage(`Setting "${created.key}" created successfully`);
        setOpenCreateDialog(false);
      }

      setSnackbarOpen(true);
      loadSettings();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async () => {
    try {
      await settingsAPI.deleteSetting(selectedSetting.id);
      setSuccessMessage(
        `Setting "${selectedSetting.key}" deleted successfully`
      );
      setOpenDeleteDialog(false);
      setSnackbarOpen(true);
      loadSettings();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handle export
   */
  const handleExport = async (format) => {
    try {
      const blob = await settingsAPI.exportSettings(format, false);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-export.${format === 'json' ? 'json' : format === 'yaml' ? 'yaml' : 'csv'}`;
      a.click();
      setSuccessMessage('Settings exported successfully');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Toggle secret visibility
   */
  const toggleSecretVisibility = (id) => {
    setVisibleSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /**
   * Format displayed value
   */
  const formatValue = (setting) => {
    if (!setting.value) return '';
    if (setting.is_encrypted && !visibleSecrets[setting.id]) {
      return `${setting.value.substring(0, 10)}...`;
    }
    if (setting.data_type === 'json') {
      try {
        return JSON.stringify(JSON.parse(setting.value), null, 2).substring(
          0,
          50
        );
      } catch {
        return setting.value.substring(0, 50);
      }
    }
    return setting.value.substring(0, 50);
  };

  return (
    <Box className="settings-manager" sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Settings Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh settings">
            <IconButton onClick={loadSettings} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {canPerformAction('EXPORT') && (
            <>
              <Tooltip title="Export as JSON">
                <IconButton onClick={() => handleExport('json')}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export as YAML">
                <IconButton onClick={() => handleExport('yaml')}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          {canPerformAction('CREATE') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
            >
              New Setting
            </Button>
          )}
        </Box>
      </Box>

      {/* Role indicator */}
      <Chip
        label={`Role: ${userRole}`}
        color="primary"
        variant="outlined"
        sx={{ mb: 2 }}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                variant="outlined"
                size="small"
                placeholder="Search by key..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setPage(0);
                  }}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {SETTING_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>Environment</InputLabel>
                <Select
                  value={filterEnvironment}
                  onChange={(e) => {
                    setFilterEnvironment(e.target.value);
                    setPage(0);
                  }}
                  label="Environment"
                >
                  <MenuItem value="">All Environments</MenuItem>
                  {ENVIRONMENTS.map((env) => (
                    <MenuItem key={env} value={env}>
                      {env}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                  setFilterEnvironment('');
                  setPage(0);
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Settings Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>
                    <strong>Key</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Value</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Environment</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {settings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No settings found
                    </TableCell>
                  </TableRow>
                ) : (
                  settings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {setting.is_read_only && (
                            <Tooltip title="Read-only">
                              <LockIcon fontSize="small" />
                            </Tooltip>
                          )}
                          <code>{setting.key}</code>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <code>{formatValue(setting)}</code>
                          {setting.is_encrypted && (
                            <Tooltip title="Encrypted value">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  toggleSecretVisibility(setting.id)
                                }
                              >
                                {visibleSecrets[setting.id] ? (
                                  <VisibilityIcon fontSize="small" />
                                ) : (
                                  <VisibilityOffIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={setting.data_type} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={setting.category}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={setting.environment}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {canPerformAction('AUDIT') && (
                            <Tooltip title="View history">
                              <IconButton
                                size="small"
                                onClick={() => handleHistoryClick(setting)}
                              >
                                <HistoryIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {canPerformAction('UPDATE') &&
                            !setting.is_read_only && (
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(setting)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          {canPerformAction('DELETE') && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(setting)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        )}
      </TableContainer>

      {/* Create Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Setting</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Key"
                name="key"
                value={formData.key}
                onChange={handleFormChange}
                placeholder="e.g., database.max_connections"
                helperText="Unique identifier for this setting (e.g., db.max_conns)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Value"
                name="value"
                value={formData.value}
                onChange={handleFormChange}
                placeholder="Setting value"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Data Type</InputLabel>
                <Select
                  name="data_type"
                  value={formData.data_type}
                  onChange={handleFormChange}
                  label="Data Type"
                >
                  {DATA_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  label="Category"
                >
                  {SETTING_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Environment</InputLabel>
                <Select
                  name="environment"
                  value={formData.environment}
                  onChange={handleFormChange}
                  label="Environment"
                >
                  {ENVIRONMENTS.map((env) => (
                    <MenuItem key={env} value={env}>
                      {env}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleFormChange}
                placeholder="tag1, tag2, tag3"
                helperText="Comma-separated tags"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="What is this setting for?"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_encrypted"
                    checked={formData.is_encrypted}
                    onChange={handleFormChange}
                  />
                }
                label="Encrypt value"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_read_only"
                    checked={formData.is_read_only}
                    onChange={handleFormChange}
                  />
                }
                label="Read-only"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Setting: {selectedSetting?.key}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Key"
                name="key"
                value={formData.key}
                onChange={handleFormChange}
                disabled
                helperText="Keys cannot be modified"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Value"
                name="value"
                value={formData.value}
                onChange={handleFormChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Data Type</InputLabel>
                <Select
                  name="data_type"
                  value={formData.data_type}
                  onChange={handleFormChange}
                  label="Data Type"
                >
                  {DATA_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  label="Category"
                >
                  {SETTING_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Environment</InputLabel>
                <Select
                  name="environment"
                  value={formData.environment}
                  onChange={handleFormChange}
                  label="Environment"
                >
                  {ENVIRONMENTS.map((env) => (
                    <MenuItem key={env} value={env}>
                      {env}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleFormChange}
                placeholder="tag1, tag2, tag3"
                helperText="Comma-separated tags"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_encrypted"
                    checked={formData.is_encrypted}
                    onChange={handleFormChange}
                  />
                }
                label="Encrypt value"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_read_only"
                    checked={formData.is_read_only}
                    onChange={handleFormChange}
                  />
                }
                label="Read-only"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Setting?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the setting{' '}
            <strong>{selectedSetting?.key}</strong>?
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={openHistoryDialog}
        onClose={() => setOpenHistoryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Audit History: {selectedSetting?.key}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {settingHistory.length === 0 ? (
            <Typography>No history available</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>
                      <strong>Timestamp</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Action</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Changed By</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Change</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {settingHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(entry.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip label={entry.action} size="small" />
                      </TableCell>
                      <TableCell>{entry.changed_by_email}</TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {entry.change_description}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistoryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SettingsManager;
