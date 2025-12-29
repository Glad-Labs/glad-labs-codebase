/**
 * LayoutWrapper.jsx
 *
 * Persistent layout component that wraps all pages
 * Provides:
 * - Navigation header with menu
 * - Chat panel at bottom
 * - Consistent styling across all pages
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as cofounderAgentClient from '../services/cofounderAgentClient';
import '../OversightHub.css';

const LayoutWrapper = ({ children }) => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'system', text: 'Poindexter ready. How can I help?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState('conversation');
  const [selectedModel, setSelectedModel] = useState('ollama-mistral');
  const [selectedAgent, setSelectedAgent] = useState('orchestrator');
  const [chatHeight, setChatHeight] = useState(
    parseInt(localStorage.getItem('chatHeight') || '300', 10)
  );
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [availableOllamaModels, setAvailableOllamaModels] = useState([]);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigationItems = [
    { label: 'Dashboard', icon: '📊', path: 'dashboard' },
    { label: 'Tasks', icon: '✅', path: 'tasks' },
    { label: 'Execution', icon: '⚙️', path: 'execution' },
    { label: 'Content', icon: '📝', path: 'content' },
    { label: 'Social', icon: '📱', path: 'social' },
    { label: 'AI & Training', icon: '🧠', path: 'training' },
    { label: 'Analytics', icon: '📈', path: 'analytics' },
    { label: 'Costs', icon: '💰', path: 'costs' },
    { label: 'Settings', icon: '⚙️', path: 'settings' },
  ];

  const models = [
    {
      id: 'ollama-mistral',
      name: 'Ollama Mistral',
      icon: '🏠',
      provider: 'ollama',
    },
    { id: 'openai-gpt4', name: 'OpenAI GPT-4', icon: '🔴', provider: 'openai' },
    {
      id: 'claude-opus',
      name: 'Claude Opus',
      icon: '⭐',
      provider: 'anthropic',
    },
    { id: 'gemini-pro', name: 'Google Gemini', icon: '✨', provider: 'google' },
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

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

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
          const models = data.models || ['llama2', 'mistral'];
          setAvailableOllamaModels(models);
          setOllamaConnected(data.connected ?? true);
        }
      } catch (error) {
        setAvailableOllamaModels(['llama2', 'mistral']);
        setOllamaConnected(false);
      }
      const savedModel =
        localStorage.getItem('selectedOllamaModel') || 'mistral';
      setSelectedOllamaModel(savedModel);
    };
    initializeModels();
  }, []);

  const handleNavigate = (page) => {
    setNavMenuOpen(false);
    const routeMap = {
      dashboard: '/',
      tasks: '/tasks',
      execution: '/execution',
      content: '/content',
      social: '/social',
      training: '/training',
      analytics: '/analytics',
      costs: '/costs',
      settings: '/settings',
    };
    navigate(routeMap[page] || '/');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput; // Store before clearing
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: userMessage,
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      // ✅ Use API client instead of hardcoded fetch
      const response = await cofounderAgentClient.sendChatMessage(
        userMessage,
        selectedModel,
        selectedAgent || 'default'
      );

      // ✅ Validate response
      if (!response || !response.response) {
        throw new Error('Invalid response: missing response field');
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'ai',
          text: response.response,
          model: response.model,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'ai',
          text: '❌ Error: Could not get response',
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setChatMessages([
      { id: 1, sender: 'system', text: 'Poindexter ready. How can I help?' },
    ]);
  };

  const handleChatHeightChange = (e) => {
    const newHeight = parseInt(e.clientY, 10);
    if (newHeight > 100 && newHeight < window.innerHeight - 200) {
      setChatHeight(newHeight);
      localStorage.setItem('chatHeight', newHeight.toString());
    }
  };

  return (
    <div className="oversight-hub-container">
      {/* Header with Navigation */}
      <header className="oversight-header">
        <div className="header-top">
          <button
            className="nav-menu-btn"
            onClick={() => setNavMenuOpen(!navMenuOpen)}
          >
            ☰
          </button>
          <h1>🎛️ Oversight Hub</h1>
        </div>
        <div className="header-status">
          {ollamaConnected ? '🟢 Ollama Ready' : '🔴 Ollama Offline'}
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

      {/* Main Content Area */}
      <div className="oversight-hub-layout">
        <div className="main-panel">{children}</div>

        {/* Chat Panel */}
        <div
          className="chat-panel"
          style={{
            height: `${chatHeight}px`,
          }}
        >
          <div className="chat-header">
            <span>💬 Poindexter Assistant</span>
            <div className="chat-mode-toggle">
              <button
                className={`mode-btn ${chatMode === 'conversation' ? 'active' : ''}`}
                onClick={() => setChatMode('conversation')}
              >
                💭 Conversation
              </button>
              <button
                className={`mode-btn ${chatMode === 'agent' ? 'active' : ''}`}
                onClick={() => setChatMode('agent')}
              >
                🔄 Agent
              </button>
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.icon} {m.name}
                </option>
              ))}
            </select>
            {chatMode === 'agent' && (
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`message message-${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  {msg.error && (
                    <div className="message-error">⚠️ {msg.text}</div>
                  )}
                  {!msg.error && <p>{msg.text}</p>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message message-ai">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input-area">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSendMessage();
                }
              }}
              placeholder="Ask Poindexter..."
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isLoading}
            >
              📤
            </button>
            <button onClick={handleClearHistory}>🗑️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper;
