import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

function MessageInput() {
  const [message, setMessage] = useState('');
  const { addMessage, isTyping } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      addMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Ask about your health..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isTyping}
        className={`w-full bg-gray-700 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all
          ${isTyping ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
          ${message.trim() ? 'pr-12' : 'pr-4'}
        `}
      />
      {message.trim() && (
        <button 
          type="submit"
          disabled={isTyping}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 
            ${isTyping 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-green-500 hover:text-green-400 hover:scale-110'
            } transition-all`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 transform transition-transform ${isTyping ? '' : 'group-hover:rotate-45'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
            />
          </svg>
        </button>
      )}
    </form>
  );
}

export default MessageInput; 