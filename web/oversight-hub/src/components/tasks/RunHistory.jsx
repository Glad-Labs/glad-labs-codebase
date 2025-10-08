import React from 'react';
import { formatTimestamp } from '../../lib/date';

const RunHistory = ({ runs }) => (
  <div className="run-history">
    <h3>Run History</h3>
    {runs.length === 0 ? (
      <p>No runs found for this task.</p>
    ) : (
      <ul>
        {runs.map((run) => (
          <li key={run.id}>
            <strong>{formatTimestamp(run.startTime)}:</strong> {run.status}
            {run.error && <p className="run-error">Error: {run.error}</p>}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RunHistory;
