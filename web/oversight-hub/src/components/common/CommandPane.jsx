import React, { useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './CommandPane.css';

const COFOUNDER_API_URL = 'http://localhost:8000/command';

const CommandPane = () => {
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
        body: JSON.stringify({ command: message }),
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
