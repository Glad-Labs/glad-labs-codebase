/**
 * NaturalLanguageInput.jsx
 *
 * Form for entering natural language requests
 * Allows users to specify:
 * - Business objective (natural language)
 * - Business metrics (optional metrics to optimize for)
 * - Preferences (tools, output format, etc.)
 */

import React, { useState } from 'react';

function NaturalLanguageInput({ onSubmit, loading, tools, onReset }) {
  const [request, setRequest] = useState('');
  const [businessMetrics, setBusinessMetrics] = useState({
    targetAudience: '',
    budget: '',
    timeframe: '',
    successMetrics: '',
  });
  const [preferences, setPreferences] = useState({
    allowedTools: [],
    outputFormat: 'markdown',
    approvalRequired: true,
    maxIterations: 3,
  });

  const [requestError, setRequestError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setRequestError('');

    // Validate request
    if (!request.trim()) {
      setRequestError('Please enter a business objective');
      return;
    }

    if (request.trim().length < 20) {
      setRequestError('Please provide more detail (at least 20 characters)');
      return;
    }

    // Submit
    onSubmit(request, businessMetrics, preferences);
  };

  const handleToolToggle = (toolId) => {
    setPreferences((prev) => ({
      ...prev,
      allowedTools: prev.allowedTools.includes(toolId)
        ? prev.allowedTools.filter((t) => t !== toolId)
        : [...prev.allowedTools, toolId],
    }));
  };

  return (
    <div className="natural-language-input">
      <form onSubmit={handleSubmit}>
        {/* Main Request */}
        <div className="form-section">
          <label htmlFor="request" className="form-label">
            <span className="label-text">What should the AI do?</span>
            <span className="label-hint">
              Describe your business objective or task
            </span>
          </label>
          <textarea
            id="request"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Example: Generate 5 blog posts about AI trends for our tech blog, optimize for SEO, target audience is enterprise CTO/VPs..."
            className="request-textarea"
            disabled={loading}
            rows="6"
          />
          {requestError && <span className="error-text">{requestError}</span>}
          <span className="character-count">{request.length} characters</span>
        </div>

        {/* Business Metrics */}
        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Business Metrics (Optional)</span>
            <span className="label-hint">
              Help the AI optimize for your goals
            </span>
          </label>
          <div className="metrics-grid">
            <input
              type="text"
              placeholder="Target audience"
              value={businessMetrics.targetAudience}
              onChange={(e) =>
                setBusinessMetrics((prev) => ({
                  ...prev,
                  targetAudience: e.target.value,
                }))
              }
              disabled={loading}
              className="metric-input"
            />
            <input
              type="text"
              placeholder="Budget or cost constraints"
              value={businessMetrics.budget}
              onChange={(e) =>
                setBusinessMetrics((prev) => ({
                  ...prev,
                  budget: e.target.value,
                }))
              }
              disabled={loading}
              className="metric-input"
            />
            <input
              type="text"
              placeholder="Timeframe (e.g., 2 weeks)"
              value={businessMetrics.timeframe}
              onChange={(e) =>
                setBusinessMetrics((prev) => ({
                  ...prev,
                  timeframe: e.target.value,
                }))
              }
              disabled={loading}
              className="metric-input"
            />
            <input
              type="text"
              placeholder="Success metrics (e.g., 1M impressions)"
              value={businessMetrics.successMetrics}
              onChange={(e) =>
                setBusinessMetrics((prev) => ({
                  ...prev,
                  successMetrics: e.target.value,
                }))
              }
              disabled={loading}
              className="metric-input"
            />
          </div>
        </div>

        {/* Tool Selection */}
        {tools.length > 0 && (
          <div className="form-section">
            <label className="form-label">
              <span className="label-text">Available Tools</span>
              <span className="label-hint">
                Select which tools the AI can use
              </span>
            </label>
            <div className="tools-grid">
              {tools.map((tool) => (
                <label key={tool.id} className="tool-checkbox">
                  <input
                    type="checkbox"
                    checked={preferences.allowedTools.includes(tool.id)}
                    onChange={() => handleToolToggle(tool.id)}
                    disabled={loading}
                  />
                  <span className="tool-name">{tool.name}</span>
                  <span className="tool-description">{tool.description}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Output Format */}
        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Output Format</span>
          </label>
          <div className="format-options">
            {['markdown', 'html', 'json', 'pdf'].map((format) => (
              <label key={format} className="format-radio">
                <input
                  type="radio"
                  name="outputFormat"
                  value={format}
                  checked={preferences.outputFormat === format}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      outputFormat: e.target.value,
                    }))
                  }
                  disabled={loading}
                />
                <span>{format.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Advanced Options</span>
          </label>
          <div className="advanced-options">
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={preferences.approvalRequired}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    approvalRequired: e.target.checked,
                  }))
                }
                disabled={loading}
              />
              <span>Require manual approval before publishing</span>
            </label>
            <div className="max-iterations">
              <label>Max refinement iterations:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={preferences.maxIterations}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    maxIterations: parseInt(e.target.value),
                  }))
                }
                disabled={loading}
                className="iteration-input"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ Processing...' : '🚀 Submit Request'}
          </button>
          <button
            type="button"
            className="btn-reset"
            onClick={onReset}
            disabled={loading}
          >
            ↺ Reset Form
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="info-box">
        <h4>💡 How It Works</h4>
        <ul>
          <li>Describe your business objective in natural language</li>
          <li>
            The AI orchestrator plans execution and selects appropriate agents
          </li>
          <li>Real-time monitoring shows progress through each phase</li>
          <li>Review results and approve before publishing to live systems</li>
          <li>Training data is collected to improve future orchestrations</li>
        </ul>
      </div>
    </div>
  );
}

export default NaturalLanguageInput;
