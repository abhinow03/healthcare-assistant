import React from 'react';
import { useChat } from '../context/ChatContext';

function QuickActions() {
  const { addMessage, isTyping } = useChat();
  
  const quickQuestions = [
    "What are common cold symptoms?",
    "How can I manage stress?",
    "Tell me about healthy eating habits",
    "What's the recommended daily water intake?"
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {quickQuestions.map((question, index) => (
        <button
          key={index}
          onClick={() => !isTyping && addMessage(question)}
          disabled={isTyping}
          className={`bg-green-600 hover:bg-green-700 rounded-full px-4 py-2 text-sm transition-all transform 
            ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 hover:shadow-lg'}`}
        >
          {question}
        </button>
      ))}
    </div>
  );
}

export default QuickActions; 