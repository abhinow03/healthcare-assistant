import React from 'react';

function Header() {
  return (
    <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
        <img 
          src="/doctor-avatar.png" 
          alt="Dr. AI" 
          className="w-10 h-10 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>'
          }}
        />
      </div>
      <div>
        <h1 className="text-xl font-semibold">Healthcare Assistant</h1>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-500 text-sm">Online</span>
        </div>
      </div>
    </div>
  );
}

export default Header; 