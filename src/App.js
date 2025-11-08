import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import QuickActions from './components/QuickActions';
import MessageInput from './components/MessageInput';
import Settings from './components/Settings';
import EditProfile from './components/EditProfile';
import HealthDashboard from './components/HealthDashboard';
import Navigation from './components/Navigation';
import { ChatProvider } from './context/ChatContext';

// Default profile data
const defaultProfile = {
  name: 'Guest User',
  email: '',
  gender: 'male',
  age: '',
  exerciseFrequency: 'moderate',
  smoking: 'no',
  diabetes: 'no',
  emergencyContacts: [{ name: '', phone: '' }]
};

function App() {
  const [currentPage, setCurrentPage] = useState('chat');
  const [userProfile, setUserProfile] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(!userProfile);

  // Load user profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setShowEditProfile(false);
    }
  }, []);

  const handleSaveProfile = (profileData) => {
    setUserProfile(profileData);
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    setShowEditProfile(false);
    setCurrentPage('chat');
  };

  const renderPage = () => {
    if (showEditProfile) {
      return (
        <EditProfile
          onSave={handleSaveProfile}
          initialData={userProfile}
          onBack={() => setShowEditProfile(false)}
        />
      );
    }

    switch (currentPage) {
      case 'chat':
        return (
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-1 overflow-y-auto">
              <ChatInterface />
            </div>
            <div className="p-4 border-t border-gray-700">
              <QuickActions />
              <MessageInput />
            </div>
          </div>
        );
      case 'health':
        return <HealthDashboard userProfile={userProfile} />;
      case 'profile':
        return (
          <div className="p-4">
            <div className="max-w-2xl mx-auto bg-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-white">{userProfile?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white">{userProfile?.email || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Age</label>
                    <p className="text-white">{userProfile?.age || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Gender</label>
                    <p className="text-white">{userProfile?.gender || 'Not set'}</p>
                  </div>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <h3 className="text-lg font-semibold mb-3">Health Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Exercise Frequency</label>
                      <p className="text-white">{userProfile?.exerciseFrequency || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Smoking</label>
                      <p className="text-white">{userProfile?.smoking || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Diabetes</label>
                      <p className="text-white">{userProfile?.diabetes || 'Not set'}</p>
                    </div>
                  </div>
                </div>
                {userProfile?.emergencyContacts?.length > 0 && (
                  <div className="border-t border-gray-600 pt-4">
                    <h3 className="text-lg font-semibold mb-3">Emergency Contacts</h3>
                    <div className="space-y-3">
                      {userProfile.emergencyContacts.map((contact, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded-lg">
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-gray-400">{contact.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <Settings
            onBack={() => setCurrentPage('chat')}
            onEditProfile={() => setShowEditProfile(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ChatProvider userProfile={userProfile}>
      <div className="flex flex-col h-screen bg-gray-800 text-white">
        <div className="flex flex-col flex-1 pb-16"> {/* Add pb-16 to leave space for nav bar */}
          {renderPage()}
        </div>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </ChatProvider>
  );
}

export default App;
