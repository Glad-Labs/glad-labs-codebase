import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from './features/tasks/useTasks';
import useStore from './store/useStore';
import TaskList from './components/tasks/TaskList';
import TaskDetailModal from './components/tasks/TaskDetailModal';
import TaskManagement from './components/tasks/TaskManagement';
import CostMetricsDashboard from './components/CostMetricsDashboard';
import SocialContentPage from './components/pages/SocialContentPage';
import ContentManagementPage from './components/pages/ContentManagementPage';
import AnalyticsPage from './components/pages/AnalyticsPage';
import ModelsPage from './components/pages/ModelsPage';
import ApprovalQueue from './components/ApprovalQueue';
import './OversightHub.css';

const OversightHub = () => {
  const { loading, error } = useTasks();
  const tasks = useStore((state) => state.tasks);
  const { setSelectedTask, clearSelectedTask, selectedTask } = useStore();
  const chatEndRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'system', text: 'Poindexter ready. How can I help?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [chatMode, setChatMode] = useState('conversation'); // 'conversation' or 'agent'
  const [selectedModel, setSelectedModel] = useState('ollama-llama2'); // Default model - lightweight
  const [selectedAgent, setSelectedAgent] = useState('orchestrator'); // Agent selection
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [chatHeight, setChatHeight] = useState(
    parseInt(localStorage.getItem('chatHeight') || '300', 10)
  ); // Resizable chat height
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [availableOllamaModels, setAvailableOllamaModels] = useState([]); // Ollama models list
  const [selectedOllamaModel, setSelectedOllamaModel] = useState(null); // Currently selected Ollama model

  const navigationItems = [
    { label: 'Dashboard', icon: '📊', path: 'dashboard' },
    { label: 'Tasks', icon: '✅', path: 'tasks' },
    { label: 'Approvals', icon: '📋', path: 'approvals' },
    { label: 'Models', icon: '🤖', path: 'models' },
    { label: 'Social', icon: '📱', path: 'social' },
    { label: 'Content', icon: '📝', path: 'content' },
    { label: 'Costs', icon: '💰', path: 'costs' },
    { label: 'Analytics', icon: '📈', path: 'analytics' },
    { label: 'Settings', icon: '⚙️', path: 'settings' },
  ];

  // eslint-disable-next-line no-unused-vars
  const models = [
    { id: 'ollama', name: 'Ollama (Local)', icon: '🏠' },
    { id: 'openai', name: 'OpenAI GPT-4', icon: '🔴' },
    { id: 'claude', name: 'Claude', icon: '⭐' },
    { id: 'gemini', name: 'Gemini', icon: '✨' },
  ];

  // Available agents for delegation
  // eslint-disable-next-line no-unused-vars
  const agents = [
    {
      id: 'content',
      name: '📝 Content Agent',
      description: 'Generate and manage content',
    },
    {
      id: 'financial',
      name: '📊 Financial Agent',
      description: 'Business metrics & analysis',
    },
    {
      id: 'market',
      name: '🔍 Market Insight Agent',
      description: 'Market analysis & trends',
    },
    {
      id: 'compliance',
      name: '✓ Compliance Agent',
      description: 'Legal & regulatory checks',
    },
    {
      id: 'orchestrator',
      name: '🧠 Co-Founder Orchestrator',
      description: 'Multi-agent orchestration',
    },
  ];

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Handle chat panel resize - persist height to localStorage
  const chatPanelRef = useRef(null);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newHeight = entry.contentRect.height;
        if (newHeight > 150) {
          setChatHeight(newHeight);
          localStorage.setItem('chatHeight', Math.round(newHeight).toString());
        }
      }
    });

    if (chatPanelRef.current) {
      observer.observe(chatPanelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Initialize by fetching available Ollama models (fast, non-blocking)
  useEffect(() => {
    const initializeModels = async () => {
      try {
        // Fetch available models from backend (fast endpoint, 2s timeout)
        const response = await fetch(
          'http://localhost:8000/api/ollama/models',
          {
            signal: AbortSignal.timeout(3000), // 3s total timeout
          }
        );

        if (response.ok) {
          const data = await response.json();
          const models = data.models || ['llama2', 'neural-chat', 'mistral'];

          setAvailableOllamaModels(models);
          setOllamaConnected(data.connected ?? true);

          console.log(
            `[Ollama] Found ${models.length} models: ${models.join(', ')}`
          );
        } else {
          // Fallback to defaults if endpoint fails
          console.log('[Ollama] Backend endpoint failed, using defaults');
          setAvailableOllamaModels(['llama2', 'neural-chat', 'mistral']);
          setOllamaConnected(false);
        }
      } catch (error) {
        // Timeout or other error - use defaults without blocking
        console.log(
          `[Ollama] Initialization error (expected if Ollama offline): ${error.message}`
        );
        setAvailableOllamaModels(['llama2', 'neural-chat', 'mistral']);
        setOllamaConnected(false);
      }

      // Use saved model or default to llama2
      const savedModel =
        localStorage.getItem('selectedOllamaModel') || 'llama2';
      setSelectedOllamaModel(savedModel);
      console.log(`[Ollama] Using model: ${savedModel}`);
    };

    initializeModels();
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setNavMenuOpen(false); // Close menu after navigation
  };

  const handleOllamaModelChange = (newModel) => {
    // No validation needed - just set the model locally
    // Backend will use it when chat request is made
    console.log(`[Ollama] Changed model to: ${newModel}`);
    setSelectedOllamaModel(newModel);
    localStorage.setItem('selectedOllamaModel', newModel);

    setChatMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'system',
        text: `✅ Model changed to: ${newModel}`,
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: chatInput,
    };

    setChatMessages([...chatMessages, newMessage]);
    const userMessage = chatInput;
    setChatInput('');

    // Send to backend with model selection
    try {
      console.log(
        `[Chat] Sending message with selectedModel: ${selectedModel}, chatMode: ${chatMode}, selectedAgent: ${selectedAgent}`
      );

      // Debug: log the exact payload
      const payload = {
        message: userMessage,
        model: selectedModel,
        conversationId: 'default',
      };
      console.log('[Chat] Payload being sent:', JSON.stringify(payload));

      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Chat] Backend response received:', data);
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: 'ai',
            text: data.response || 'Processing complete ✓',
          },
        ]);
      } else {
        // Log the error response for debugging
        const errorText = await response.text();
        console.warn(
          `[Chat] Backend returned ${response.status}: ${errorText}`
        );

        // Graceful fallback - show demo response with model name
        setTimeout(() => {
          setChatMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: 'ai',
              text: `[${selectedModel} - Demo Mode] Your message was processed. Backend endpoint is preparing... ✓`,
            },
          ]);
        }, 300);
      }
    } catch (err) {
      console.error('[Chat] Connection error:', err.message);

      // Show friendly error message
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: 'ai',
            text: `🤖 [${selectedModel}] Demo response: Processing your request... Backend is starting up. Try again in a moment! ✓`,
          },
        ]);
      }, 300);
    }
  };

  // Calculate metrics from tasks
  const metrics = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    failed: tasks.filter((t) => t.status === 'failed').length,
  };

  if (loading) {
    // DEBUG: Show what's happening
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const tokenStatus = token
      ? `✓ Token found (${token.substring(0, 20)}...)`
      : '✗ No token in localStorage';

    return (
      <div className="oversight-hub">
        <header>
          <h1>🧪 Dexter's Lab</h1>
        </header>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>
            Loading system status...
          </div>
          <div
            style={{
              fontSize: '0.9rem',
              color: '#666',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            <div>Debug Info:</div>
            <div
              style={{
                fontSize: '0.8rem',
                marginTop: '0.5rem',
                fontFamily: 'monospace',
                color: '#999',
              }}
            >
              {tokenStatus}
            </div>
            <div
              style={{ fontSize: '0.75rem', marginTop: '1rem', color: '#aaa' }}
            >
              If this takes &gt; 10 seconds, check:
              <div>1. Backend running? http://localhost:8000/docs</div>
              <div>2. Network tab for /api/tasks request</div>
              <div>3. Press F12 → Console for errors</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oversight-hub">
        <header>
          <h1>🧪 Dexter's Lab</h1>
        </header>
        <div
          className="error-message"
          style={{ margin: '2rem', whiteSpace: 'pre-wrap' }}
        >
          <div
            style={{
              color: '#ff006e',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            ❌ {error}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '1rem' }}>
            <div>Troubleshooting:</div>
            <div style={{ marginLeft: '1rem', fontSize: '0.85rem' }}>
              <div>
                1. Is backend running? Check:{' '}
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  http://localhost:8000/docs
                </a>
              </div>
              <div>
                2. Is the token valid? Open DevTools (F12) → Application →
                localStorage → check 'auth_token'
              </div>
              <div>3. Try: Hard refresh (Ctrl+Shift+R) and login again</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="oversight-hub">
      <header>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flex: 1,
          }}
        >
          <h1>🧪 Dexter's Lab</h1>
          <button
            className="nav-menu-btn"
            onClick={() => setNavMenuOpen(!navMenuOpen)}
            title="Navigation menu"
          >
            ☰
          </button>
          {/* Ollama status indicator */}
          {ollamaConnected ? (
            <div
              style={{
                fontSize: '0.8rem',
                color: '#00d926',
                marginLeft: '1rem',
              }}
            >
              🟢 Ollama Ready
            </div>
          ) : (
            <div
              style={{
                fontSize: '0.8rem',
                color: '#ff006e',
                marginLeft: '1rem',
              }}
            >
              🔴 Ollama Offline
            </div>
          )}
        </div>
      </header>

      {/* Navigation Menu Dropdown - Now persistent on navigation */}
      {navMenuOpen && (
        <div className="nav-menu-dropdown">
          <div className="nav-menu-header">Navigation</div>
          {navigationItems.map((item) => (
            <button
              key={item.path}
              className={`nav-menu-item ${currentPage === item.path ? 'active' : ''}`}
              onClick={() => handleNavigate(item.path)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color:
                  currentPage === item.path
                    ? 'var(--accent-primary)'
                    : 'var(--text-primary)',
                borderLeft:
                  currentPage === item.path
                    ? '3px solid var(--accent-primary)'
                    : '3px solid transparent',
              }}
            >
              <span className="nav-menu-icon">{item.icon}</span>
              <span className="nav-menu-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="oversight-hub-layout">
        {/* Main Content Panel */}
        <div className="main-panel">
          {currentPage === 'dashboard' && (
            <>
              {/* Metrics Dashboard */}
              <div className="metrics-section">
                <div className="metric-card">
                  <div className="metric-label">Total Tasks</div>
                  <div className="metric-value">{metrics.total}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Completed</div>
                  <div
                    className="metric-value"
                    style={{ color: 'var(--accent-success)' }}
                  >
                    {metrics.completed}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Pending</div>
                  <div
                    className="metric-value"
                    style={{ color: 'var(--accent-warning)' }}
                  >
                    {metrics.pending}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Failed</div>
                  <div
                    className="metric-value"
                    style={{ color: 'var(--accent-danger)' }}
                  >
                    {metrics.failed}
                  </div>
                </div>
              </div>

              {/* Task List Section */}
              <div className="task-list-section">
                <h2 className="section-title">📋 Task Queue</h2>
                {tasks.length > 0 ? (
                  <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'var(--text-tertiary)',
                      padding: '2rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    No tasks. Create one to get started.
                  </div>
                )}
              </div>
            </>
          )}

          {currentPage === 'tasks' && <TaskManagement />}

          {currentPage === 'approvals' && <ApprovalQueue />}

          {currentPage === 'models' && <ModelsPage />}

          {currentPage === 'social' && <SocialContentPage />}

          {currentPage === 'content' && <ContentManagementPage />}

          {currentPage === 'costs' && <CostMetricsDashboard />}

          {currentPage === 'analytics' && <AnalyticsPage />}

          {currentPage === 'settings' && (
            <div style={{ padding: '2rem' }}>
              <h2>⚙️ Settings</h2>

              {ollamaConnected && availableOllamaModels.length > 0 ? (
                <div
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    marginTop: '1rem',
                    border: '1px solid var(--border-secondary)',
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold',
                        color: 'var(--text-primary)',
                      }}
                    >
                      🤖 Select Ollama Model
                    </label>
                    <select
                      value={selectedOllamaModel || ''}
                      onChange={(e) => handleOllamaModelChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                      }}
                    >
                      {availableOllamaModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        marginTop: '0.5rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Currently selected:{' '}
                      <strong>{selectedOllamaModel || 'None'}</strong>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'rgba(0, 217, 38, 0.1)',
                      padding: '1rem',
                      borderRadius: '0.375rem',
                      marginTop: '1rem',
                      border: '1px solid rgba(0, 217, 38, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 'bold',
                        color: '#00d926',
                        marginBottom: '0.5rem',
                      }}
                    >
                      ✅ Ollama Connected
                    </div>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <div>
                        Available models: {availableOllamaModels.length}
                      </div>
                      <div
                        style={{
                          marginTop: '0.5rem',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                        }}
                      >
                        {availableOllamaModels.map((model, idx) => (
                          <div key={idx}>• {model}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 100, 100, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    marginTop: '1rem',
                    border: '1px solid rgba(255, 100, 100, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: '#ff6464',
                      marginBottom: '0.5rem',
                    }}
                  >
                    ⚠️ Ollama Not Available
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Please start Ollama to see available models. Run:{' '}
                    <code>ollama serve</code>
                  </div>
                </div>
              )}

              <div
                style={{
                  marginTop: '2rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-secondary)',
                }}
              >
                <h3 style={{ marginBottom: '1rem' }}>Other Settings</h3>
                <div
                  style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                >
                  Theme, API keys, and other settings coming soon...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Panel at Bottom - RESIZABLE VERTICALLY */}
        <div
          ref={chatPanelRef}
          className="chat-panel"
          style={{
            height: `${chatHeight}px`,
            transition: 'height 0.1s ease-out',
          }}
        >
          {/* Drag Handle for Resizing */}
          <div className="chat-resize-handle" title="Drag to resize chat panel">
            <div className="drag-indicator">⋮⋮</div>
          </div>
          <div className="chat-header">
            <span>💬 Poindexter Assistant</span>

            {/* Chat Mode Toggle */}
            <div className="chat-mode-toggle">
              <button
                className={`mode-btn ${chatMode === 'conversation' ? 'active' : 'inactive'}`}
                onClick={() => setChatMode('conversation')}
                title="Regular conversation mode"
              >
                💬 Conversation
              </button>
              <button
                className={`mode-btn ${chatMode === 'agent' ? 'active' : 'inactive'}`}
                onClick={() => setChatMode('agent')}
                title="Agent mode - execute multi-step commands"
              >
                🤖 Agent
              </button>
            </div>

            {/* Model Selector - shows individual models if Ollama available */}
            <select
              className="model-selector-chat"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              title="Select AI model"
            >
              {ollamaConnected && availableOllamaModels.length > 0 ? (
                // Show individual Ollama models
                <>
                  <optgroup label="🏠 Ollama (Local)">
                    {availableOllamaModels.map((model) => (
                      <option key={`ollama-${model}`} value={`ollama-${model}`}>
                        {model}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="☁️ Cloud Models">
                    <option value="openai">🔴 OpenAI GPT-4</option>
                    <option value="claude">⭐ Claude 3</option>
                    <option value="gemini">✨ Gemini</option>
                  </optgroup>
                </>
              ) : (
                // Show generic model options if Ollama not available
                <>
                  <option value="openai">🔴 OpenAI GPT-4</option>
                  <option value="claude">⭐ Claude 3</option>
                  <option value="gemini">✨ Gemini</option>
                  <option value="ollama" disabled>
                    🏠 Ollama (Unavailable)
                  </option>
                </>
              )}
            </select>

            {/* Agent Selector - only show in Agent mode */}
            {chatMode === 'agent' && (
              <select
                className="agent-selector-chat"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                title="Select which agent handles this task"
              >
                {agents.map((agent) => (
                  <option
                    key={agent.id}
                    value={agent.id}
                    title={agent.description}
                  >
                    {agent.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="chat-content">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  padding: '0.5rem 0',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    maxWidth: '70%',
                    padding: '0.75rem 1rem',
                    borderRadius: '4px',
                    backgroundColor:
                      msg.sender === 'user'
                        ? 'var(--accent-primary)'
                        : 'var(--bg-tertiary)',
                    color:
                      msg.sender === 'user'
                        ? 'var(--bg-primary)'
                        : 'var(--text-primary)',
                    border:
                      msg.sender === 'user'
                        ? 'none'
                        : `1px solid var(--border-secondary)`,
                    fontSize: '0.9rem',
                    wordWrap: 'break-word',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask Poindexter..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="chat-send-btn" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>

      {selectedTask && <TaskDetailModal onClose={clearSelectedTask} />}
    </div>
  );
};

export default OversightHub;
