import React, { useState, useRef, useCallback } from 'react';
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

const CommandPane = () => {
  const { selectedTask } = useStore();
  const isResizing = useRef(false);
  const [messages, setMessages] = useState([
    {
      message:
        "Hello! I'm the GLAD Labs AI Co-Founder. How can I assist you today?",
      sentTime: 'just now',
      sender: 'AI',
      direction: 'incoming',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

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
    if (!selectedTask) {
      alert('Please select a task before sending a command.');
      return;
    }

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
        body: JSON.stringify({ command: message, task: selectedTask }),
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

  return (
    <div className="command-pane">
      <div
        className="resize-handle command-pane-resize-handle"
        onMouseDown={startResize}
      />
      {selectedTask ? (
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{selectedTask.title}</h2>
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
      ) : (
        <div className="p-4 border-b">
          <p>Select a task to see the details here.</p>
        </div>
      )}
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
            placeholder="Type your command here..."
            onSend={handleSend}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default CommandPane;
