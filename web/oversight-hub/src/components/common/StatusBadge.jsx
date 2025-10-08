import React from 'react';

const StatusBadge = ({ status }) => (
  <span
    className={`status-badge status-${status?.toLowerCase().replace(' ', '-')}`}
  >
    {status || 'Unknown'}
  </span>
);

export default StatusBadge;
