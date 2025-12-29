import React, { useState, useEffect } from 'react';
import './ModelManagement.css';

function ModelManagement() {
  // Mock models for fallback
  const FALLBACK_MODELS = [
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
  ];

  // State management
  const [models] = useState(FALLBACK_MODELS);
  const [ollamaModels, setOllamaModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [testPrompt, setTestPrompt] = useState('What is AI?');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('models'); // models, test, comparison

  // Fetch Ollama models on component mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (!response.ok) throw new Error('Failed to fetch Ollama models');

        const data = await response.json();
        const modelsArray = data.models || [];

        setOllamaModels(modelsArray);
        if (modelsArray.length > 0 && !selectedModel) {
          setSelectedModel(modelsArray[0].name);
        }
      } catch (error) {
        console.error('Error fetching Ollama models:', error);
        // Fall back to empty array
        setOllamaModels([]);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runModelTest = async () => {
    if (!selectedModel || !testPrompt.trim()) {
      setTestError('Please select a model and enter a prompt');
      return;
    }

    setTestLoading(true);
    setTestError(null);
    const startTime = Date.now();

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: testPrompt,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens,
          },
        }),
      });

      if (!response.ok) throw new Error('Model test failed');

      const data = await response.json();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const result = {
        model: selectedModel,
        prompt: testPrompt,
        response: data.response || '',
        responseTime,
        tokensGenerated: data.eval_count || 0,
        timestamp: new Date().toLocaleTimeString(),
        temperature,
        maxTokens,
      };

      setTestResult(result);
      setTestHistory([result, ...testHistory.slice(0, 9)]); // Keep last 10
    } catch (error) {
      console.error('Error running test:', error);
      setTestError(`Test failed: ${error.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="model-management-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Model Management & Testing</h1>
        <p className="dashboard-subtitle">
          Deploy, test, and compare AI models with real-time performance metrics
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="model-tabs">
        <button
          className={`tab-btn ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          📊 Models
        </button>
        <button
          className={`tab-btn ${activeTab === 'test' ? 'active' : ''}`}
          onClick={() => setActiveTab('test')}
        >
          🧪 Test Models
        </button>
        <button
          className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          📈 Test History
        </button>
      </div>

      {/* Models Tab */}
      {activeTab === 'models' && (
        <>
          {/* Ollama Models Section */}
          {ollamaModels.length > 0 && (
            <div className="ollama-models-section">
              <h2 className="section-title">🚀 Local Ollama Models</h2>
              <div className="models-grid">
                {ollamaModels.map((model) => (
                  <div key={model.name} className="model-card ollama-model">
                    <div className="model-header">
                      <div className="model-info">
                        <h3 className="model-name">{model.name}</h3>
                        <p className="model-provider">Ollama (Local)</p>
                      </div>
                      <span className="status-badge status-active">Local</span>
                    </div>

                    <div className="model-version">
                      <span className="version-label">Size:</span>
                      <span className="version-value">
                        {(model.size / (1024 * 1024 * 1024)).toFixed(1)}GB
                      </span>
                    </div>

                    <div className="model-metrics">
                      <div className="metric">
                        <span className="metric-label">Model</span>
                        <span className="metric-value">{model.model}</span>
                      </div>
                    </div>

                    <div className="model-actions">
                      <button
                        className="btn-action btn-deploy"
                        onClick={() => setSelectedModel(model.name)}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cloud Models Section */}
          <div className="cloud-models-section">
            <h2 className="section-title">☁️ Cloud AI Models</h2>
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
                        <span className="accuracy-badge">
                          {model.accuracy}%
                        </span>
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
        </>
      )}

      {/* Test Models Tab */}
      {activeTab === 'test' && (
        <div className="model-testing-section">
          <h2 className="section-title">🧪 Test Individual Models</h2>

          <div className="test-container">
            {/* Test Controls */}
            <div className="test-controls">
              <div className="control-group">
                <label htmlFor="model-select">Model:</label>
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={testLoading}
                >
                  <option value="">Select a model...</option>
                  {ollamaModels.map((model) => (
                    <option key={model.name} value={model.name}>
                      {model.name} (Ollama)
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="test-prompt">Prompt:</label>
                <textarea
                  id="test-prompt"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Enter a test prompt..."
                  disabled={testLoading}
                  rows="4"
                />
              </div>

              <div className="control-row">
                <div className="control-group">
                  <label htmlFor="temperature">
                    Temperature: {temperature.toFixed(1)}
                  </label>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    disabled={testLoading}
                  />
                </div>

                <div className="control-group">
                  <label htmlFor="max-tokens">Max Tokens:</label>
                  <input
                    id="max-tokens"
                    type="number"
                    min="50"
                    max="2000"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    disabled={testLoading}
                  />
                </div>
              </div>

              {testError && <div className="error-message">❌ {testError}</div>}

              <button
                className="btn-test-model"
                onClick={runModelTest}
                disabled={testLoading || !selectedModel}
              >
                {testLoading ? '⏳ Testing...' : '🚀 Run Test'}
              </button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className="test-result">
                <h3>Test Result for {testResult.model}</h3>
                <div className="result-metrics">
                  <div className="metric-box">
                    <span className="metric-name">Response Time:</span>
                    <span className="metric-value">
                      {testResult.responseTime}ms
                    </span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-name">Tokens Generated:</span>
                    <span className="metric-value">
                      {testResult.tokensGenerated}
                    </span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-name">Temperature:</span>
                    <span className="metric-value">
                      {testResult.temperature}
                    </span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-name">Timestamp:</span>
                    <span className="metric-value">{testResult.timestamp}</span>
                  </div>
                </div>
                <div className="result-text">
                  <strong>Response:</strong>
                  <p>{testResult.response}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test History Tab */}
      {activeTab === 'comparison' && (
        <div className="test-history-section">
          <h2 className="section-title">📈 Test History & Comparison</h2>

          {testHistory.length === 0 ? (
            <div className="empty-state">
              <p>
                No test history yet. Run some model tests to see results here.
              </p>
            </div>
          ) : (
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Prompt (Preview)</th>
                    <th>Response Time</th>
                    <th>Tokens</th>
                    <th>Temperature</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {testHistory.map((result, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{result.model}</strong>
                      </td>
                      <td className="prompt-preview">
                        {result.prompt.substring(0, 50)}...
                      </td>
                      <td className={result.responseTime > 5000 ? 'slow' : ''}>
                        {result.responseTime}ms
                      </td>
                      <td>{result.tokensGenerated}</td>
                      <td>{result.temperature}</td>
                      <td>{result.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
