import React, { useState } from 'react';

function Settings({ onBack, onEditProfile }) {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [healthReminders, setHealthReminders] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Preferences */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
              <span>Dark Mode</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-green-500' : 'bg-gray-500'}`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : ''}`}
                />
              </button>
            </div>
            {/* Language Selection */}
            <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
              <span>Language</span>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-gray-800 text-white rounded px-2 py-1 border border-gray-600"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="hi">Hindi</option>
                {/* Add more languages as needed */}
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
            <span>Health Reminders</span>
            <button
              onClick={() => setHealthReminders(!healthReminders)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${healthReminders ? 'bg-green-500' : 'bg-gray-500'}`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${healthReminders ? 'translate-x-6' : ''}`}
              />
            </button>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Privacy</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <span>Data Export</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-red-500">
              <span>Delete Account</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Support</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <span>Contact Us</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <span>About</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings; 