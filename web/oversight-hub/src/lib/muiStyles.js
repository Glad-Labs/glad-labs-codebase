/**
 * muiStyles.js - Centralized MUI sx style definitions
 *
 * This file contains reusable style objects for consistent theming
 * across the oversight-hub application. All colors, spacing, and
 * layouts are defined here to ensure consistency and easy theming.
 */

// Color palette
const colors = {
  primary: '#00d9ff',
  primaryLight: 'rgba(0, 217, 255, 0.1)',
  primaryDark: 'rgba(0, 217, 255, 0.03)',

  status: {
    pending: '#FF9800', // warning
    in_progress: '#2196F3', // info
    inProgress: '#2196F3', // alias for snake_case
    awaiting_approval: '#FF9800', // amber
    awaitingApproval: '#FF9800', // alias
    approved: '#4CAF50', // success
    rejected: '#F44336', // error
    completed: '#4CAF50', // success
    failed: '#F44336', // error
    published: '#4CAF50', // success
    on_hold: '#9C27B0', // purple
    onHold: '#9C27B0', // alias
    cancelled: '#9E9E9E', // gray
  },

  phase: {
    research: '#3498db',
    draft: '#e74c3c',
    assess: '#f39c12',
    refine: '#27ae60',
    finalize: '#9b59b6',
    other: '#95a5a6',
  },

  model: {
    ollama: '#27ae60',
    'gpt-3.5': '#3498db',
    'gpt-4': '#e74c3c',
    claude: '#f39c12',
  },

  background: {
    default: '#121212',
    paper: '#1e1e1e',
    light: '#2a2a2a',
  },

  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
  },
};

// Common spacing values
const spacing = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
};

// Filter bar styles
const filterBox = {
  display: 'flex',
  gap: '16px',
  mb: '16px',
  p: '12px 16px',
  backgroundColor: 'rgba(0, 217, 255, 0.03)',
  borderRadius: '6px',
  border: '1px solid rgba(0, 217, 255, 0.1)',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  '& .MuiFormControl-root': {
    margin: 0,
    marginTop: '8px',
  },
};

// Table header styles
const tableHeaderRow = {
  backgroundColor: colors.primaryLight,
};

// Loading container styles
const loadingContainer = {
  display: 'flex',
  justifyContent: 'center',
  p: spacing.lg * 8, // 4
};

// Empty state styles
const emptyState = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  py: spacing.xl * 8, // 5
  px: spacing.lg * 8, // 4
  color: colors.text.secondary,
};

// Dialog styles
const dialog = {
  content: {
    backgroundColor: colors.background.paper,
  },
  title: {
    color: colors.text.primary,
  },
  text: {
    color: colors.text.secondary,
  },
};

// Form control styles
const formControl = {
  small: {
    minWidth: 150,
  },
};

// Compact select styles (for minimal padding with better UX)
const compactSelect = {
  '& .MuiOutlinedInput-root': {
    height: '32px',
    minHeight: '32px',
    padding: '0 8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 217, 255, 0.1)',
      borderColor: 'rgba(0, 217, 255, 0.4)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(0, 217, 255, 0.08)',
      borderColor: 'rgba(0, 217, 255, 0.6)',
      boxShadow: 'inset 0 0 0 1px rgba(0, 217, 255, 0.3)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '6px 8px !important',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    color: '#fff',
    cursor: 'pointer',
  },
  '& .MuiSelect-icon': {
    right: '6px',
    color: 'rgba(0, 217, 255, 0.7)',
    fontSize: '1.2rem',
  },
  '& .MuiFormLabel-root': {
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    color: 'rgba(0, 217, 255, 0.7)',
    transform: 'translate(0, -1.5px) scale(1)',
    top: '-12px',
    left: '2px',
    backgroundColor: '#121212',
    padding: '0 4px',
    '&.Mui-focused': {
      color: 'rgba(0, 217, 255, 0.9)',
    },
  },
  minWidth: '120px',
  '& .MuiMenu-paper': {
    backgroundColor: '#1e1e1e',
    border: '1px solid rgba(0, 217, 255, 0.2)',
  },
};

// Button styles
const button = {
  reset: {
    ml: 'auto',
  },
  primary: {
    backgroundColor: colors.primary,
    color: '#000',
    '&:hover': {
      backgroundColor: 'rgba(0, 217, 255, 0.8)',
    },
  },
};

// Card/Paper styles
const card = {
  default: {
    backgroundColor: colors.background.paper,
    borderRadius: 1,
    p: spacing.lg * 8, // 4
  },
  elevated: {
    backgroundColor: colors.background.paper,
    borderRadius: 1,
    p: spacing.lg * 8, // 4
    boxShadow: 3,
  },
};

// Typography styles
const typography = {
  header: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: colors.text.primary,
    mb: spacing.md * 8, // 2
  },
  subheader: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: colors.text.primary,
    mb: spacing.md * 8, // 2
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.text.secondary,
  },
};

// Flex utilities
const flex = {
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  between: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
};

// Stat card styles for dashboard metrics
const statCard = {
  default: (color) => ({
    backgroundColor: `rgba(${hexToRgb(color)}, 0.1)`,
    border: `1px solid rgba(${hexToRgb(color)}, 0.3)`,
    borderRadius: 1,
    p: spacing.md * 8, // 2
    textAlign: 'center',
  }),
  value: (color) => ({
    color,
    fontWeight: 700,
    fontSize: '1.5rem',
  }),
  label: {
    color: '#888',
    fontSize: '0.85rem',
  },
};

// Helper function to convert hex color to RGB for rgba
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '100, 100, 100';
};

// Export all styles
export const muiStyles = {
  colors,
  spacing,
  filterBox,
  tableHeaderRow,
  loadingContainer,
  emptyState,
  dialog,
  formControl,
  button,
  card,
  typography,
  flex,
  statCard,
  compactSelect,
};

// Export individual utilities for convenience
export {
  colors,
  spacing,
  filterBox,
  tableHeaderRow,
  loadingContainer,
  emptyState,
  dialog,
  formControl,
  button,
  card,
  typography,
  flex,
  statCard,
  compactSelect,
  hexToRgb,
};

// Status color getter utility
export const getStatusColor = (status) => {
  if (!status) return colors.status.pending;

  // Try direct lookup first (snake_case or camelCase)
  if (colors.status[status]) {
    return colors.status[status];
  }

  // Try converting snake_case to camelCase
  const camelCase = status
    .split('_')
    .map((word, idx) =>
      idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');

  if (colors.status[camelCase]) {
    return colors.status[camelCase];
  }

  return colors.status.pending;
};

// Phase color getter utility
export const getPhaseColor = (phase) => {
  return colors.phase[phase.toLowerCase()] || colors.phase.other;
};

// Model color getter utility
export const getModelColor = (model) => {
  return colors.model[model.toLowerCase()] || colors.model.ollama;
};
