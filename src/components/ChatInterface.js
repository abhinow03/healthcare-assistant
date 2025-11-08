import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';

function ChatInterface() {
  const { messages, isTyping } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${
            message.sender === 'user' 
              ? 'ml-auto bg-green-600' 
              : 'bg-gray-700'
          } rounded-lg p-4 max-w-[80%] animate-fade-in`}
        >
          <p className="text-white whitespace-pre-wrap">{message.text}</p>
          <span className="text-xs text-gray-300 mt-2 block">{message.timestamp}</span>
        </div>
      ))}
      {isTyping && (
        <div className="bg-gray-700 rounded-lg p-4 max-w-[80%] animate-pulse">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatInterface; 