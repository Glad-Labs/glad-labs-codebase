import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import '../CommandPane.css';

import useStore from '../../store/useStore';

const COFOUNDER_API_URL = 'http://localhost:8000/command';

// Available AI Models
const AI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4 (Advanced)' },
  { id: 'gpt-3.5', name: 'GPT-3.5 (Fast)' },
  { id: 'claude-3', name: 'Claude 3 (Balanced)' },
  { id: 'local', name: 'Local Model' },
];

const CommandPane = () => {
  const { selectedTask, tasks, theme } = useStore();
  const isResizing = useRef(false);
  const [messages, setMessages] = useState([
    {
      message:
        "Hello! I'm the GLAD Labs AI Co-Founder. How can I assist you today? I can help you delegate tasks, analyze data, or provide strategic insights.",
      sentTime: 'just now',
      sender: 'AI',
      direction: 'incoming',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [showContext, setShowContext] = useState(false);
  const [delegateMode, setDelegateMode] = useState(false);

  const startResize = useCallback((e) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleResize = useCallback((e) => {
    if (!isResizing.current) return;

    const containerRect = document
      .querySelector('.oversight-hub-layout')
      .getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;

    if (newWidth >= 300 && newWidth <= 600) {
      document.documentElement.style.setProperty(
        '--command-pane-width',
        `${newWidth}px`
      );
    }
  }, []);

  const stopResize = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleResize]);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch(COFOUNDER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: message,
          task: selectedTask || null,
          model: selectedModel,
          context: {
            currentPage: window.location.pathname,
            selectedTaskId: selectedTask?.id || null,
            totalTasks: tasks?.length || 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiMessage = {
        message: data.response,
        direction: 'incoming',
        sender: 'AI',
      };
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending command:', error);
      const errorMessage = {
        message:
          'Sorry, I encountered an error. Please check the console for details.',
        direction: 'incoming',
        sender: 'AI',
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDelegateTask = () => {
    if (!delegateMode) {
      setDelegateMode(true);
      const delegateMessage = {
        message:
          "I'm ready to help delegate tasks. What would you like me to handle?",
        direction: 'incoming',
        sender: 'AI',
      };
      setMessages([...messages, delegateMessage]);
    } else {
      setDelegateMode(false);
    }
  };

  return (
    <div className="command-pane">
      <div
        className="resize-handle command-pane-resize-handle"
        onMouseDown={startResize}
      />

      {/* Header with Model Selector and Context */}
      <div className="command-pane-header">
        <div className="command-pane-top">
          <h2 className="command-pane-title">AI Co-Founder</h2>
          <button
            className="context-toggle-btn"
            onClick={() => setShowContext(!showContext)}
            title="Toggle context information"
          >
            {showContext ? '✕' : '⊕'} Context
          </button>
        </div>

        {/* Model Selector */}
        <div className="model-selector">
          <label htmlFor="ai-model" className="model-label">
            Model:
          </label>
          <select
            id="ai-model"
            className="model-dropdown"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {AI_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Task Delegation Button */}
        <button
          className={`delegate-btn ${delegateMode ? 'active' : ''}`}
          onClick={handleDelegateTask}
          title="Delegate tasks to AI Co-Founder"
        >
          📋 Delegate Task
        </button>
      </div>

      {/* Context Panel */}
      {showContext && (
        <div className="context-panel">
          <h3 className="context-title">Current Context</h3>
          <div className="context-item">
            <span className="context-label">Current Page:</span>
            <span className="context-value">
              {window.location.pathname || '/'}
            </span>
          </div>
          {selectedTask && (
            <>
              <div className="context-item">
                <span className="context-label">Active Task:</span>
                <span className="context-value">{selectedTask.title}</span>
              </div>
              <div className="context-item">
                <span className="context-label">Status:</span>
                <span
                  className={`status-badge status-${selectedTask.status?.toLowerCase()}`}
                >
                  {selectedTask.status}
                </span>
              </div>
            </>
          )}
          <div className="context-item">
            <span className="context-label">Total Tasks:</span>
            <span className="context-value">{tasks?.length || 0}</span>
          </div>
          <div className="context-item">
            <span className="context-label">AI Model:</span>
            <span className="context-value">
              {AI_MODELS.find((m) => m.id === selectedModel)?.name}
            </span>
          </div>
        </div>
      )}

      {/* Optional: Selected Task Display */}
      {selectedTask && (
        <div
          className="p-4 border-b"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {selectedTask.title}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Status: {selectedTask.status}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Priority: {selectedTask.priority}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Due Date: {selectedTask.dueDate}
          </p>
        </div>
      )}

      {/* Chat Container */}
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={
              isTyping ? <TypingIndicator content="AI is thinking..." /> : null
            }
          >
            {messages.map((message, i) => (
              <Message key={i} model={message} />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Ask for help, delegate tasks, or request analysis..."
            onSend={handleSend}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default CommandPane;
