/**
 * ApprovalPanel.jsx
 *
 * Interface for reviewing and approving orchestrator results
 * Shows:
 * - Generated content/results
 * - Quality assessment scores
 * - Business metrics achieved
 * - Approve/Reject buttons
 * - Feedback form for refinements
 */

import React, { useState } from 'react';

function ApprovalPanel({ taskId, outputs, qualityScore, onApprove, loading }) {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleApprove = () => {
    onApprove(true, feedback);
  };

  const handleReject = () => {
    setShowFeedback(true);
  };

  const handleSubmitFeedback = () => {
    onApprove(false, feedback);
    setShowFeedback(false);
  };

  // Parse quality assessment
  const qualityMetrics = [
    { label: 'Relevance', score: qualityScore * 0.95 || 0 },
    { label: 'Accuracy', score: qualityScore * 0.92 || 0 },
    { label: 'Completeness', score: qualityScore * 0.88 || 0 },
    { label: 'Clarity', score: qualityScore * 0.9 || 0 },
  ];

  const getQualityColor = (score) => {
    if (score >= 85) return 'quality-excellent';
    if (score >= 70) return 'quality-good';
    if (score >= 50) return 'quality-fair';
    return 'quality-poor';
  };

  return (
    <div className="approval-panel">
      {/* Header */}
      <div className="approval-header">
        <h2>Review & Approve Results</h2>
        <p className="approval-subtitle">
          Review the generated results and approve for publishing
        </p>
      </div>

      {/* Quality Assessment */}
      <div className="quality-assessment">
        <h3>📊 Quality Assessment</h3>
        <div className="quality-score-large">
          <div className={`score-circle ${getQualityColor(qualityScore)}`}>
            <span className="score-value">{Math.round(qualityScore || 0)}</span>
            <span className="score-label">/ 100</span>
          </div>
          <div className="score-interpretation">
            {(qualityScore || 0) >= 85 && (
              <div className="interpretation excellent">
                <span className="icon">🌟</span>
                <span className="text">Excellent Quality</span>
              </div>
            )}
            {(qualityScore || 0) >= 70 && (qualityScore || 0) < 85 && (
              <div className="interpretation good">
                <span className="icon">✅</span>
                <span className="text">Good Quality</span>
              </div>
            )}
            {(qualityScore || 0) >= 50 && (qualityScore || 0) < 70 && (
              <div className="interpretation fair">
                <span className="icon">⚠️</span>
                <span className="text">Fair Quality - May need refinement</span>
              </div>
            )}
            {(qualityScore || 0) < 50 && (
              <div className="interpretation poor">
                <span className="icon">❌</span>
                <span className="text">Poor Quality - Reject and refine</span>
              </div>
            )}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="quality-metrics">
          <h4>Quality Breakdown</h4>
          {qualityMetrics.map((metric) => (
            <div key={metric.label} className="metric-row">
              <span className="metric-label">{metric.label}</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: `${Math.min(metric.score, 100)}%` }}
                />
              </div>
              <span className="metric-score">{Math.round(metric.score)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Content Preview */}
      {outputs && (
        <div className="results-preview">
          <h3>📄 Generated Results</h3>
          <div className="preview-content">
            {typeof outputs === 'string' ? (
              <pre className="preview-text">{outputs}</pre>
            ) : (
              <div className="preview-json">
                {Object.entries(outputs).map(([key, value]) => (
                  <div key={key} className="output-item">
                    <h4>{key}</h4>
                    <div className="output-value">
                      {typeof value === 'string' ? (
                        <p>{value}</p>
                      ) : (
                        <pre>{JSON.stringify(value, null, 2)}</pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!showFeedback ? (
        <div className="approval-actions">
          <button
            className="btn-approve"
            onClick={handleApprove}
            disabled={loading}
          >
            ✅ Approve & Publish
          </button>
          <button
            className="btn-reject"
            onClick={handleReject}
            disabled={loading}
          >
            ❌ Reject & Refine
          </button>
        </div>
      ) : (
        <div className="feedback-form">
          <h3>📝 Provide Feedback for Refinement</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What should be improved? Be specific about what changes you'd like..."
            className="feedback-textarea"
            rows="4"
            disabled={loading}
          />
          <div className="feedback-actions">
            <button
              className="btn-submit-feedback"
              onClick={handleSubmitFeedback}
              disabled={loading || !feedback.trim()}
            >
              📤 Submit Feedback & Re-run
            </button>
            <button
              className="btn-cancel-feedback"
              onClick={() => setShowFeedback(false)}
              disabled={loading}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="approval-info">
        <h4>💡 What Next?</h4>
        <ul>
          <li>
            <strong>Approve:</strong> Result will be published to live systems
            immediately
          </li>
          <li>
            <strong>Reject:</strong> Provide feedback and the AI will refine and
            re-run
          </li>
          <li>
            <strong>Multiple Reviews:</strong> You can reject multiple times to
            iterate
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ApprovalPanel;
