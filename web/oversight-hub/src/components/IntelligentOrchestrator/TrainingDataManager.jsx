/**
 * TrainingDataManager.jsx
 *
 * Interface for exporting and managing training data
 * Allows users to:
 * - Download training data in various formats (JSONL, CSV)
 * - Preview training data
 * - Manage data retention
 * - View statistics
 */

import React, { useState, useEffect } from 'react';
import { exportOrchestratorTrainingData } from '../../services/cofounderAgentClient';

function TrainingDataManager({ taskId, onReset }) {
  const [exportFormat, setExportFormat] = useState('jsonl');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch training data stats on mount
  useEffect(() => {
    if (taskId) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const fetchStats = async () => {
    try {
      // Get a preview of the training data
      const data = await exportOrchestratorTrainingData(taskId, 'json', true);
      if (data && data.training_data) {
        setStats({
          total_records: data.training_data.length,
          timestamp: data.timestamp,
          task_id: data.task_id,
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Export data
      const data = await exportOrchestratorTrainingData(taskId, exportFormat);

      // Create blob and download
      let blob, filename;
      if (exportFormat === 'jsonl') {
        blob = new Blob([data.data], { type: 'application/jsonl' });
        filename = `training-data-${taskId}.jsonl`;
      } else if (exportFormat === 'csv') {
        blob = new Blob([data.data], { type: 'text/csv' });
        filename = `training-data-${taskId}.csv`;
      } else {
        blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json',
        });
        filename = `training-data-${taskId}.json`;
      }

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError(err.message || 'Failed to export training data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="training-data-manager">
      {/* Header */}
      <div className="training-header">
        <h2>🎓 Training Data Export</h2>
        <p className="training-subtitle">
          Export orchestration data for analysis and model fine-tuning
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="training-stats">
          <div className="stat-item">
            <span className="stat-label">Total Records</span>
            <span className="stat-value">{stats.total_records}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Task ID</span>
            <span className="stat-value">{stats.task_id}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Recorded At</span>
            <span className="stat-value">
              {new Date(stats.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Format Selection */}
      <div className="format-selection">
        <label className="form-label">
          <span className="label-text">Export Format</span>
          <span className="label-hint">Choose your preferred format</span>
        </label>
        <div className="format-options-grid">
          {[
            {
              id: 'jsonl',
              name: 'JSONL',
              description: 'Newline-delimited JSON (best for ML pipelines)',
              icon: '📋',
            },
            {
              id: 'json',
              name: 'JSON',
              description: 'Formatted JSON (human-readable)',
              icon: '🔤',
            },
            {
              id: 'csv',
              name: 'CSV',
              description: 'Comma-separated values (for spreadsheets)',
              icon: '📊',
            },
          ].map((format) => (
            <label key={format.id} className="format-option">
              <input
                type="radio"
                name="exportFormat"
                value={format.id}
                checked={exportFormat === format.id}
                onChange={(e) => setExportFormat(e.target.value)}
                disabled={loading}
              />
              <div className="option-content">
                <span className="option-icon">{format.icon}</span>
                <div className="option-text">
                  <span className="option-name">{format.name}</span>
                  <span className="option-desc">{format.description}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* What is Included */}
      <div className="data-contents">
        <h3>📦 What&apos;s Included</h3>
        <div className="contents-list">
          <div className="content-item">
            <span className="content-icon">✓</span>
            <span className="content-text">
              Original user request and context
            </span>
          </div>
          <div className="content-item">
            <span className="content-icon">✓</span>
            <span className="content-text">Agent decisions and reasoning</span>
          </div>
          <div className="content-item">
            <span className="content-icon">✓</span>
            <span className="content-text">
              Generated outputs at each phase
            </span>
          </div>
          <div className="content-item">
            <span className="content-icon">✓</span>
            <span className="content-text">Quality assessments and scores</span>
          </div>
          <div className="content-item">
            <span className="content-icon">✓</span>
            <span className="content-text">
              Refinement feedback and iterations
            </span>
          </div>
          <div className="content-item">
            <span className="content-icon">✓</span>
            <span className="content-text">Final approved results</span>
          </div>
          <div className="content-item">
            <span className="content-icon">✓</span>
            <span className="content-text">Execution metrics and timings</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
        </div>
      )}
      {success && (
        <div className="success-message">
          <span>✅ Training data exported successfully!</span>
        </div>
      )}

      {/* Export Button */}
      <div className="export-actions">
        <button
          className="btn-export"
          onClick={handleExport}
          disabled={loading}
        >
          {loading
            ? '⏳ Exporting...'
            : `📥 Export as ${exportFormat.toUpperCase()}`}
        </button>
        <button className="btn-complete" onClick={onReset} disabled={loading}>
          ✨ Complete
        </button>
      </div>

      {/* Usage Examples */}
      <div className="usage-examples">
        <h3>🔧 Usage Examples</h3>
        <div className="examples-tabs">
          <div className="example-section">
            <h4>Python - Load JSONL Data</h4>
            <pre className="code-block">
              {`import jsonlines

with jsonlines.open('training-data.jsonl') as reader:
    for obj in reader:
        print(obj['request'])
        print(obj['response'])`}
            </pre>
          </div>
          <div className="example-section">
            <h4>Pandas - Load CSV Data</h4>
            <pre className="code-block">
              {`import pandas as pd

df = pd.read_csv('training-data.csv')
print(df.head())
print(df.describe())`}
            </pre>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="privacy-notice">
        <h4>🔒 Privacy & Security</h4>
        <p>
          Training data is encrypted at rest and can be deleted at any time.
          This data helps improve the orchestrator's performance for all users.
          No personally identifiable information is retained unless explicitly
          provided in your request.
        </p>
      </div>
    </div>
  );
}

export default TrainingDataManager;
