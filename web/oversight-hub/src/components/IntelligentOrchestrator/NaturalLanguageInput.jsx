/**
 * NaturalLanguageInput.jsx
 *
 * Form for entering natural language requests
 * Allows users to specify:
 * - Business objective (natural language)
 * - Business metrics (optional metrics to optimize for)
 * - Preferences (tools, output format, etc.)
 * - Model selection (which AI model to use)
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { modelService } from '../../services/modelService';

function NaturalLanguageInput({ onSubmit, loading, tools, onReset }) {
  // Mode toggle: 'conversation' (chat-only) vs 'agent' (intent recognition + execution)
  // Conversation: User asks/talks, LLM responds (traditional Q&A)
  // Agent: User describes intent, system recognizes and executes (automatic task creation)
  const [mode, setMode] = useState('conversation');
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
    selectedModel: 'ollama-mistral', // Default model
  });
  const [requestError, setRequestError] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [modelsByProvider, setModelsByProvider] = useState({
    ollama: [],
    openai: [],
    anthropic: [],
    google: [],
  });

  // Load available models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await modelService.getAvailableModels();
        setAvailableModels(models);
        const grouped = modelService.groupModelsByProvider(models);
        setModelsByProvider(grouped);
      } catch (error) {
        console.warn('Error loading models:', error);
        const defaults = modelService.getDefaultModels();
        setAvailableModels(defaults);
        const grouped = modelService.groupModelsByProvider(defaults);
        setModelsByProvider(grouped);
      }
    };
    loadModels();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRequestError('');

    // Validate request
    if (!request.trim()) {
      setRequestError('Please enter a message');
      return;
    }

    if (request.trim().length < 5) {
      setRequestError('Please provide more detail (at least 5 characters)');
      return;
    }

    // Submit with mode information
    onSubmit(request, businessMetrics, {
      ...preferences,
      mode, // 'conversation' or 'agent'
    });
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
      {/* Mode Toggle: Conversation vs Agent */}
      <div className="mode-toggle-section">
        <label className="form-label">
          <span className="label-text">Poindexter Mode</span>
        </label>
        <div className="mode-buttons">
          <button
            type="button"
            className={`mode-button ${mode === 'conversation' ? 'active' : ''}`}
            onClick={() => setMode('conversation')}
            disabled={loading}
            title="Conversation: Chat with Poindexter, receive responses"
          >
            💬 Conversation
          </button>
          <button
            type="button"
            className={`mode-button ${mode === 'agent' ? 'active' : ''}`}
            onClick={() => setMode('agent')}
            disabled={loading}
            title="Agent: Describe intent, system recognizes and executes tasks automatically"
          >
            🤖 Agent Mode
          </button>
        </div>
        <div className="mode-description">
          {mode === 'conversation' ? (
            <p>
              <strong>Conversation Mode:</strong> Ask questions, discuss ideas,
              get insights. Poindexter will respond with analysis and
              recommendations. Best for exploratory conversations.
            </p>
          ) : (
            <p>
              <strong>Agent Mode:</strong> Describe what you need done, and
              Poindexter will recognize your intent and automatically execute
              the appropriate actions. Best for task creation and automation.
            </p>
          )}
        </div>
      </div>

      {/* Model Selection */}
      <div className="model-selection-section">
        <label className="form-label">
          <span className="label-text">AI Model</span>
          <span className="label-hint">Select which AI model to use</span>
        </label>
        <select
          value={preferences.selectedModel}
          onChange={(e) =>
            setPreferences((prev) => ({
              ...prev,
              selectedModel: e.target.value,
            }))
          }
          disabled={loading}
          className="model-selector-input"
        >
          <option value="">-- Select Model --</option>

          {/* Ollama Models */}
          {modelsByProvider.ollama && modelsByProvider.ollama.length > 0 && (
            <optgroup label="🖥️  Ollama (Local)">
              {modelsByProvider.ollama.map((m) => (
                <option
                  key={modelService.getModelValue(m)}
                  value={modelService.getModelValue(m)}
                >
                  {modelService.formatModelDisplayName(m.name || m.displayName)}
                </option>
              ))}
            </optgroup>
          )}

          {/* OpenAI Models */}
          {modelsByProvider.openai && modelsByProvider.openai.length > 0 && (
            <optgroup label="⚡ OpenAI">
              {modelsByProvider.openai.map((m) => (
                <option
                  key={modelService.getModelValue(m)}
                  value={modelService.getModelValue(m)}
                >
                  {m.displayName || modelService.formatModelDisplayName(m.name)}
                </option>
              ))}
            </optgroup>
          )}

          {/* Anthropic Models */}
          {modelsByProvider.anthropic &&
            modelsByProvider.anthropic.length > 0 && (
              <optgroup label="🧠 Anthropic">
                {modelsByProvider.anthropic.map((m) => (
                  <option
                    key={modelService.getModelValue(m)}
                    value={modelService.getModelValue(m)}
                  >
                    {m.displayName ||
                      modelService.formatModelDisplayName(m.name)}
                  </option>
                ))}
              </optgroup>
            )}

          {/* Google Models */}
          {modelsByProvider.google && modelsByProvider.google.length > 0 && (
            <optgroup label="☁️ Google">
              {modelsByProvider.google.map((m) => (
                <option
                  key={modelService.getModelValue(m)}
                  value={modelService.getModelValue(m)}
                >
                  {m.displayName || modelService.formatModelDisplayName(m.name)}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

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
            {loading
              ? '⏳ Processing...'
              : mode === 'agent'
                ? '🤖 Execute Task'
                : '💬 Send Message'}
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

NaturalLanguageInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  tools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  onReset: PropTypes.func.isRequired,
};

export default NaturalLanguageInput;
