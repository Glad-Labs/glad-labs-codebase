/**
 * Dashboard.jsx
 *
 * Main dashboard - consolidated layout with TaskManagement as primary interface
 * Displays:
 * - Header with navigation toggle
 * - Full task management UI (TaskManagement component)
 * - Chat panel for Poindexter assistant
 * 
 * Replaces the previous OversightHub-based dashboard that had:
 * - Non-interactive metrics cards
 * - Duplicate Dashboard + Tasks tabs
 * Now provides seamless TaskManagement interface with chat support.
 */

import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import TaskManagement from '../components/tasks/TaskManagement';
import TaskDetailModal from '../components/tasks/TaskDetailModal';
import '../OversightHub.css';

const Dashboard = () => {
  const { clearSelectedTask, selectedTask } = useStore();
  const chatEndRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'system', text: 'Poindexter ready. How can I help?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [chatMode, setChatMode] = useState('conversation');
  const [selectedModel, setSelectedModel] = useState('ollama-llama2');
  const [selectedAgent, setSelectedAgent] = useState('orchestrator');
  const [chatHeight, setChatHeight] = useState(
    parseInt(localStorage.getItem('chatHeight') || '300', 10)
  );
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [availableOllamaModels, setAvailableOllamaModels] = useState([]);

  const navigationItems = [
    { label: 'Dashboard', icon: '📊', path: 'dashboard' },
    { label: 'Approvals', icon: '📋', path: 'approvals' },
    { label: 'Models', icon: '🤖', path: 'models' },
    { label: 'Social', icon: '📱', path: 'social' },
    { label: 'Content', icon: '📝', path: 'content' },
    { label: 'Costs', icon: '💰', path: 'costs' },
    { label: 'Analytics', icon: '📈', path: 'analytics' },
    { label: 'Settings', icon: '⚙️', path: 'settings' },
  ];

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

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Chat panel resize - proper drag handling
  const chatPanelRef = useRef(null);
  const dragStartRef = useRef(null);

  const handleMouseDown = (e) => {
    console.log('✅ Chat Resize: Mouse down on drag handle at Y:', e.clientY);
    dragStartRef.current = {
      startY: e.clientY,
      startHeight: chatHeight,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragStartRef.current) return;

      const deltaY = e.clientY - dragStartRef.current.startY;
      const newHeight = dragStartRef.current.startHeight + deltaY;
      
      console.log('🔄 Chat Resize: Moving - deltaY:', deltaY, 'newHeight:', newHeight);

      // Keep height between 150px and 600px
      if (newHeight >= 150 && newHeight <= 600) {
        setChatHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      if (dragStartRef.current) {
        console.log('✅ Chat Resize: Mouse up - saving height:', chatHeight);
        localStorage.setItem('chatHeight', Math.round(chatHeight).toString());
        dragStartRef.current = null;
      }
    };

    if (dragStartRef.current) {
      console.log('📌 Chat Resize: Attaching event listeners');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        console.log('🧹 Chat Resize: Removing event listeners');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [chatHeight]);

  // Initialize Ollama models
  useEffect(() => {
    const initializeModels = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/ollama/models',
          {
            signal: AbortSignal.timeout(3000),
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
          console.log('[Ollama] Backend endpoint failed, using defaults');
          setAvailableOllamaModels(['llama2', 'neural-chat', 'mistral']);
          setOllamaConnected(false);
        }
      } catch (error) {
        console.log(
          `[Ollama] Initialization error (expected if Ollama offline): ${error.message}`
        );
        setAvailableOllamaModels(['llama2', 'neural-chat', 'mistral']);
        setOllamaConnected(false);
      }

      const savedModel =
        localStorage.getItem('selectedOllamaModel') || 'llama2';
      console.log(`[Ollama] Using model: ${savedModel}`);
    };

    initializeModels();
  }, []);

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

    // For now, just echo back. Can integrate with actual backend later.
    const systemReply = {
      id: chatMessages.length + 2,
      sender: 'system',
      text: `Received: "${userMessage}". Backend integration coming soon.`,
    };

    setChatMessages((prev) => [...prev, systemReply]);
  };

  return (
    <div className="oversight-hub-container">
      {/* Header */}
      <header className="oversight-header">
        <div className="header-left">
          <button
            className="nav-toggle-btn"
            onClick={() => setNavMenuOpen(!navMenuOpen)}
            title="Toggle navigation menu"
          >
            ☰
          </button>
          <div className="header-title">
            <h1>🎛️ Oversight Hub</h1>
          </div>
        </div>
        <div className="header-right">
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

      {/* Navigation Menu */}
      {navMenuOpen && (
        <div className="nav-menu-dropdown">
          <div className="nav-menu-header">Navigation</div>
          {navigationItems.map((item) => (
            <button
              key={item.path}
              className="nav-menu-item"
              onClick={() => setNavMenuOpen(false)}
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
                color: 'var(--text-primary)',
                borderLeft: '3px solid var(--border-secondary)',
              }}
            >
              <span className="nav-menu-icon">{item.icon}</span>
              <span className="nav-menu-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="oversight-hub-layout">
        {/* Main Content - TaskManagement */}
        <div className="main-panel">
          <TaskManagement />
        </div>

        {/* Chat Panel */}
        <div
          ref={chatPanelRef}
          className="chat-panel"
          style={{
            height: `${chatHeight}px`,
            transition: dragStartRef.current ? 'none' : 'height 0.1s ease-out',
          }}
        >
          <div
            className="chat-resize-handle"
            title="Drag to resize chat panel"
            onMouseDown={handleMouseDown}
          >
            <div className="drag-indicator">⋮⋮</div>
          </div>
          <div className="chat-header">
            <span>💬 Poindexter Assistant</span>

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

            <select
              className="model-selector-chat"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              title="Select AI model"
            >
              {ollamaConnected && availableOllamaModels.length > 0 ? (
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

      {selectedTask && <TaskDetailModal task={selectedTask} onClose={clearSelectedTask} />}
    </div>
  );
};

export default Dashboard;
