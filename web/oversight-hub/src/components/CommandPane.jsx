import React, { useState } from 'react';
import './CommandPane.css';

const CommandPane = () => {
  const [messages, setMessages] = useState([
    {
      text: 'Welcome to the GLAD Labs Command Center. How can I assist you?',
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { text: input, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const apiUrl =
          process.env.REACT_APP_ORCHESTRATOR_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error('Failed to get a response from the orchestrator.');
        }

        const data = await response.json();
        setMessages((prev) => [...prev, { text: data.response, sender: 'ai' }]);
      } catch (error) {
        console.error('Error communicating with orchestrator:', error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I'm having trouble connecting to the Orchestrator Agent.",
            sender: 'ai',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="command-pane">
      <div className="message-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message ai typing-indicator">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Chat with your AI Business Assistant..."
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? 'Waiting...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default CommandPane;
