import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from './features/tasks/useTasks';
import useStore from './store/useStore';
import TaskList from './components/tasks/TaskList';
import TaskDetailModal from './components/tasks/TaskDetailModal';
import TaskManagement from './components/tasks/TaskManagement';
import BlogPostCreator from './components/BlogPostCreator';
import ContentQueue from './components/content-queue/ContentQueue';
import SystemHealthDashboard from './components/dashboard/SystemHealthDashboard';
import CostMetricsDashboard from './components/CostMetricsDashboard';
import SocialMediaManagement from './components/social/SocialMediaManagement';
import Marketing from './components/marketing/Marketing';
import Financials from './components/financials/Financials';
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
  const [selectedModel, setSelectedModel] = useState('ollama'); // Model selection
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [showOllamaWarning, setShowOllamaWarning] = useState(false);
  const [availableOllamaModels, setAvailableOllamaModels] = useState([]); // Ollama models list
  const [selectedOllamaModel, setSelectedOllamaModel] = useState(null); // Currently selected Ollama model

  const navigationItems = [
    { label: 'Dashboard', icon: '📊', path: 'dashboard' },
    { label: 'Tasks', icon: '✅', path: 'tasks' },
    { label: 'Models', icon: '🤖', path: 'models' },
    { label: 'Social', icon: '📱', path: 'social' },
    { label: 'Content', icon: '📝', path: 'content' },
    { label: 'Costs', icon: '💰', path: 'costs' },
    { label: 'Analytics', icon: '📈', path: 'analytics' },
    { label: 'Settings', icon: '⚙️', path: 'settings' },
  ];

  const models = [
    { id: 'ollama', name: 'Ollama (Local)', icon: '🏠' },
    { id: 'openai', name: 'OpenAI GPT-4', icon: '🔴' },
    { id: 'claude', name: 'Claude', icon: '⭐' },
    { id: 'gemini', name: 'Gemini', icon: '✨' },
  ];

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Check Ollama connection on component mount
  useEffect(() => {
    const checkOllama = async () => {
      try {
        console.log('[Ollama] Checking connection...');
        const response = await fetch(
          'http://localhost:8000/api/ollama/health',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('[Ollama] Health check response:', data);
          setOllamaStatus(data);

          // Store available models
          if (data.models && data.models.length > 0) {
            setAvailableOllamaModels(data.models);
            // Load selected model from localStorage or use first available
            const savedModel = localStorage.getItem('selectedOllamaModel');
            const modelToUse =
              savedModel && data.models.includes(savedModel)
                ? savedModel
                : data.models[0];
            setSelectedOllamaModel(modelToUse);
            console.log(`[Ollama] Set default model to: ${modelToUse}`);
          }

          if (data.connected) {
            setOllamaConnected(true);
            console.log(
              `[Ollama] ✅ Connected! Found ${data.models?.length || 0} models`
            );

            // Warm up Ollama if connected (inline to avoid dependency issues)
            setTimeout(async () => {
              const modelToWarmup = data.models?.[0];
              try {
                console.log(
                  `[Ollama] Starting warm-up for model: ${modelToWarmup}`
                );
                const warmupResponse = await fetch(
                  'http://localhost:8000/api/ollama/warmup',
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: modelToWarmup }),
                  }
                );

                if (warmupResponse.ok) {
                  const warmupData = await warmupResponse.json();
                  console.log('[Ollama] Warm-up complete:', warmupData.message);
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      sender: 'system',
                      text: `🔥 ${warmupData.message}`,
                    },
                  ]);
                }
              } catch (err) {
                console.warn(`[Ollama] Warm-up skipped:`, err.message);
              }
            }, 1000);
          } else {
            setOllamaConnected(false);
            setShowOllamaWarning(true);
            console.warn('[Ollama] ⚠️ Not connected:', data.message);
          }
        } else {
          console.warn(
            `[Ollama] Health check failed with status ${response.status}`
          );
          setOllamaConnected(false);
          setShowOllamaWarning(true);
        }
      } catch (err) {
        console.error('[Ollama] Connection check error:', err.message);
        setOllamaConnected(false);
        setShowOllamaWarning(true);
      }
    };

    checkOllama();
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setNavMenuOpen(false); // Close menu after navigation
  };

  const handleOllamaModelChange = async (newModel) => {
    try {
      console.log(`[Ollama] Attempting to select model: ${newModel}`);

      // Validate model with backend
      const response = await fetch(
        'http://localhost:8000/api/ollama/select-model',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: newModel }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedOllamaModel(newModel);
          localStorage.setItem('selectedOllamaModel', newModel);
          console.log(`[Ollama] ✅ Model changed to: ${newModel}`);

          setChatMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: 'system',
              text: `✅ ${data.message}`,
            },
          ]);
        } else {
          console.warn(`[Ollama] ⚠️ ${data.message}`);
          setChatMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: 'system',
              text: `⚠️ ${data.message}`,
            },
          ]);
        }
      }
    } catch (err) {
      console.error('[Ollama] Model selection error:', err.message);
    }
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
        `[Chat] Sending message to backend with model: ${selectedModel}`
      );
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel,
          conversationId: 'default',
        }),
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

      {/* Ollama warning notification */}
      {showOllamaWarning && ollamaStatus && !ollamaConnected && (
        <div
          style={{
            backgroundColor: 'rgba(255, 100, 100, 0.2)',
            border: '1px solid #ff6464',
            borderRadius: '0.5rem',
            padding: '1rem',
            margin: '1rem',
            color: '#ffaa00',
            fontSize: '0.9rem',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ⚠️ Ollama Connection Issue
          </div>
          <div>{ollamaStatus.message}</div>
          <div
            style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}
          >
            💡 To start Ollama: Open Terminal and run <code>ollama serve</code>
          </div>
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

          {currentPage === 'models' && (
            <div style={{ padding: '2rem' }}>
              <h2>🤖 Model Configuration</h2>
              <SystemHealthDashboard
                ollamaStatus={ollamaStatus}
                ollamaConnected={ollamaConnected}
              />
            </div>
          )}

          {currentPage === 'social' && <SocialMediaManagement />}

          {currentPage === 'content' && <BlogPostCreator />}

          {currentPage === 'costs' && <CostMetricsDashboard />}

          {currentPage === 'analytics' && <Marketing />}

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

        {/* Chat Panel at Bottom */}
        <div className="chat-panel">
          <div className="chat-header">
            <span>💬 Poindexter Assistant</span>
            <select
              className="model-selector"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.icon} {model.name}
                </option>
              ))}
            </select>
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
