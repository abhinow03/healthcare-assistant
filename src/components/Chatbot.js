import React, { useState } from 'react';

export default function Chatbot() {
    const [userInput, setUserInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        
        // Add your chatbot logic here
        console.log("User message:", userInput);
        setUserInput('');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Your existing chat display area */}
            
            {/* Add this typing box at the bottom */}
            <div className="border-t border-gray-200 px-4 py-2 bg-white">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!userInput.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
} 