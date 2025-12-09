/**
 * ChatPage.jsx
 *
 * Dedicated Chat interface page for Oversight Hub
 * Extracted from OversightHub.jsx chat panel
 *
 * Features:
 * - Multi-model chat support (OpenAI, Claude, Ollama, Gemini)
 * - Conversation history
 * - Model selection
 * - Real-time responses
 */

import React, { useState, useEffect, useRef } from 'react';
import useStore from '../../store/useStore';
import cofounderAgentClient from '../../services/cofounderAgentClient';
import './ChatPage.css';

const ChatPage = () => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'system', text: 'Poindexter ready. How can I help?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai-gpt4');
  const [selectedAgent, setSelectedAgent] = useState('orchestrator');
  const [chatMode, setChatMode] = useState('conversation');
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [availableOllamaModels, setAvailableOllamaModels] = useState([]);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const conversationIdRef = useRef('default');

  // Available models from backend
  const models = [
    { id: 'openai-gpt4', name: 'OpenAI GPT-4', icon: '🔴', provider: 'openai' },
    {
      id: 'openai-gpt35',
      name: 'OpenAI GPT-3.5',
      icon: '🔴',
      provider: 'openai',
    },
    {
      id: 'claude-opus',
      name: 'Claude Opus',
      icon: '⭐',
      provider: 'anthropic',
    },
    {
      id: 'claude-sonnet',
      name: 'Claude Sonnet',
      icon: '⭐',
      provider: 'anthropic',
    },
    { id: 'gemini-pro', name: 'Google Gemini', icon: '✨', provider: 'google' },
    {
      id: 'ollama-mistral',
      name: 'Ollama Mistral',
      icon: '🏠',
      provider: 'ollama',
    },
    {
      id: 'ollama-llama2',
      name: 'Ollama Llama 2',
      icon: '🏠',
      provider: 'ollama',
    },
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

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Initialize Ollama models on mount
  useEffect(() => {
    const initializeModels = async () => {
      try {
        const modelsData = await cofounderAgentClient.getAvailableModels();
        setAvailableOllamaModels(
          modelsData.models || ['llama2', 'neural-chat', 'mistral']
        );
        setOllamaConnected(true);
      } catch (err) {
        console.warn('Could not fetch available models:', err.message);
        setAvailableOllamaModels(['llama2', 'neural-chat', 'mistral']);
        setOllamaConnected(false);
      }

      const savedModel =
        localStorage.getItem('selectedOllamaModel') || 'llama2';
      setSelectedOllamaModel(savedModel);
    };

    initializeModels();
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user message
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: chatInput,
    };

    setChatMessages([...chatMessages, newMessage]);
    const userMessage = chatInput;
    setChatInput('');
    setIsLoading(true);

    try {
      console.log('[Chat] Sending message:', {
        message: userMessage,
        model: selectedModel,
        mode: chatMode,
        agent: selectedAgent,
      });

      const data = await cofounderAgentClient.sendChatMessage(
        userMessage,
        selectedModel,
        conversationIdRef.current
      );

      console.log('[Chat] Response:', data);

      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'ai',
          text: data.response || 'Processing complete ✓',
          model: selectedModel,
          timestamp: new Date(),
        },
      ]);

      // Store conversation ID for continued conversation
      if (data.conversation_id) {
        conversationIdRef.current = data.conversation_id;
      }
    } catch (err) {
      console.error('[Chat] Error:', err);

      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'ai',
          text: `[Connection Error] ${err.message}`,
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear chat history?')) {
      setChatMessages([
        { id: 1, sender: 'system', text: 'Poindexter ready. How can I help?' },
      ]);
      conversationIdRef.current = 'default';
    }
  };

  const handleModelChange = (newModel) => {
    setSelectedModel(newModel);
    localStorage.setItem('selectedModel', newModel);

    // Save Ollama model selection if applicable
    if (newModel.startsWith('ollama-')) {
      const modelName = newModel.replace('ollama-', '');
      localStorage.setItem('selectedOllamaModel', modelName);
      setSelectedOllamaModel(modelName);
    }
  };

  const getModelIcon = (modelId) => {
    const model = models.find((m) => m.id === modelId);
    return model?.icon || '🤖';
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>💬 Chat Assistant</h2>
        <div className="chat-controls">
          <div className="control-group">
            <label>Mode:</label>
            <div className="button-group">
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
                🔄 Agent Delegation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-main">
          {/* Messages Display */}
          <div className="messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`message message-${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'user' ? '👤' : getModelIcon(selectedModel)}
                </div>
                <div className="message-content">
                  {msg.error && (
                    <div className="message-error">⚠️ {msg.text}</div>
                  )}
                  {!msg.error && <p>{msg.text}</p>}
                  {msg.timestamp && (
                    <div className="message-time">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message message-ai">
                <div className="message-avatar">
                  {getModelIcon(selectedModel)}
                </div>
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

          {/* Message Input */}
          <div className="chat-input-area">
            <div className="input-controls">
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="model-selector"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.icon} {model.name}
                  </option>
                ))}
              </select>

              {chatMode === 'agent' && (
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="agent-selector"
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="input-box">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message... (Shift+Enter for new line)"
                className="chat-input"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isLoading}
                className="send-btn"
              >
                {isLoading ? '⏳' : '📤'}
              </button>
              <button
                onClick={handleClearHistory}
                className="clear-btn"
                title="Clear history"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar with model/agent info */}
        <div className="chat-sidebar">
          <div className="sidebar-section">
            <h3>📊 Current Model</h3>
            <div className="model-info">
              <div className="model-name">
                {getModelIcon(selectedModel)}{' '}
                {models.find((m) => m.id === selectedModel)?.name}
              </div>
              <div className="model-provider">
                {models.find((m) => m.id === selectedModel)?.provider}
              </div>
            </div>
          </div>

          {chatMode === 'agent' && (
            <div className="sidebar-section">
              <h3>🔄 Selected Agent</h3>
              <div className="agent-info">
                <div className="agent-name">
                  {agents.find((a) => a.id === selectedAgent)?.name}
                </div>
                <div className="agent-description">
                  {agents.find((a) => a.id === selectedAgent)?.description}
                </div>
              </div>
            </div>
          )}

          {ollamaConnected && (
            <div className="sidebar-section">
              <h3>🏠 Ollama Models</h3>
              <div className="models-list">
                {availableOllamaModels.map((model) => (
                  <div key={model} className="model-item">
                    • {model}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-section">
            <h3>💡 Tips</h3>
            <ul className="tips-list">
              <li>Use different models for different tasks</li>
              <li>Agent mode delegates to specialized agents</li>
              <li>Conversation history is preserved</li>
              <li>Ollama models run locally</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
