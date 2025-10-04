import React from 'react';

const MetricsList = ({ metrics, loading }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Content Metrics</h2>
    {loading ? <p>Loading metrics...</p> : (
      <ul>
        {metrics.length > 0 ? metrics.map(metric => (
          <li key={metric.id} className="p-2 border-b border-gray-700">{metric.name}: <span className="text-blue-400">{metric.value}</span></li>
        )) : <p>No content metrics available.</p>}
      </ul>
    )}
  </div>
);

export default MetricsList;
