import React, { useState } from 'react';
import './ModelManagement.css';

function ModelManagement() {
  const [models] = useState([
    {
      id: 1,
      name: 'GPT-4',
      provider: 'OpenAI',
      version: '4.0',
      status: 'Active',
      accuracy: 94.2,
      latency: '245ms',
      usage: 8540,
    },
    {
      id: 2,
      name: 'Claude 3',
      provider: 'Anthropic',
      version: '3.0',
      status: 'Active',
      accuracy: 92.8,
      latency: '312ms',
      usage: 6230,
    },
    {
      id: 3,
      name: 'GPT-3.5',
      provider: 'OpenAI',
      version: '3.5',
      status: 'Active',
      accuracy: 88.5,
      latency: '89ms',
      usage: 12450,
    },
    {
      id: 4,
      name: 'Local Model',
      provider: 'Custom',
      version: '1.0',
      status: 'Inactive',
      accuracy: 85.2,
      latency: '45ms',
      usage: 2340,
    },
  ]);

  return (
    <div className="model-management-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Model Management</h1>
        <p className="dashboard-subtitle">
          Deploy and manage AI models for various tasks
        </p>
      </div>

      {/* Model Cards */}
      <div className="models-grid">
        {models.map((model) => (
          <div key={model.id} className="model-card">
            <div className="model-header">
              <div className="model-info">
                <h3 className="model-name">{model.name}</h3>
                <p className="model-provider">{model.provider}</p>
              </div>
              <span
                className={`status-badge status-${model.status.toLowerCase()}`}
              >
                {model.status}
              </span>
            </div>

            <div className="model-version">
              <span className="version-label">Version:</span>
              <span className="version-value">{model.version}</span>
            </div>

            <div className="model-metrics">
              <div className="metric">
                <span className="metric-label">Accuracy</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${model.accuracy}%` }}
                  ></div>
                </div>
                <span className="metric-value">{model.accuracy}%</span>
              </div>

              <div className="metric">
                <span className="metric-label">Latency</span>
                <span className="metric-value metric-latency">
                  {model.latency}
                </span>
              </div>

              <div className="metric">
                <span className="metric-label">Requests</span>
                <span className="metric-value">
                  {model.usage.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="model-actions">
              <button className="btn-action btn-deploy">Deploy</button>
              <button className="btn-action btn-config">Configure</button>
              <button className="btn-action btn-monitor">Monitor</button>
            </div>
          </div>
        ))}
      </div>

      {/* Model Comparison */}
      <div className="model-comparison">
        <h2 className="section-title">📊 Model Comparison</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Provider</th>
                <th>Accuracy</th>
                <th>Latency</th>
                <th>Cost/1K Calls</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id}>
                  <td className="model-col">
                    <strong>{model.name}</strong>
                  </td>
                  <td>{model.provider}</td>
                  <td>
                    <span className="accuracy-badge">{model.accuracy}%</span>
                  </td>
                  <td>{model.latency}</td>
                  <td>${(Math.random() * 50 + 10).toFixed(2)}</td>
                  <td>
                    <span
                      className={`status-badge status-${model.status.toLowerCase()}`}
                    >
                      {model.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Settings */}
      <div className="model-settings">
        <h2 className="section-title">⚙️ Default Model Settings</h2>
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="default-model">Default Model:</label>
            <select id="default-model" className="form-control">
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fallback-model">Fallback Model:</label>
            <select id="fallback-model" className="form-control">
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="max-latency">Max Latency (ms):</label>
            <input
              id="max-latency"
              type="number"
              placeholder="1000"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="timeout">Timeout (seconds):</label>
            <input
              id="timeout"
              type="number"
              placeholder="30"
              className="form-control"
            />
          </div>

          <button className="btn-save">💾 Save Settings</button>
        </div>
      </div>
    </div>
  );
}

export default ModelManagement;
