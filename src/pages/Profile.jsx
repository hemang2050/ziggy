import React, { useState, useEffect } from 'react';
import { User, CreditCard, Clock, Settings, LogOut } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "", // no default image
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      const userId = sessionStorage.getItem('currentUserId');
      const userEmail = sessionStorage.getItem('currentUserEmail');

      if (!userId || !userEmail) {
        navigate('/login');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(user => user.id === userId);

      if (currentUser) {
        setUserData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || "",
          avatar: currentUser.avatar || "",
        });
      } else {
        setUserData({
          name: userEmail.split('@')[0],
          email: userEmail,
          phone: "",
          address: "",
          avatar: "",
        });
      }

      setIsLoading(false);
    };

    loadUserData();
  }, [navigate]);

  const handleSave = () => {
    const userId = sessionStorage.getItem('currentUserId');
    if (!userId) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, ...userData };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));

    if (userData.email !== sessionStorage.getItem('currentUserEmail')) {
      sessionStorage.setItem('currentUserEmail', userData.email);
    }

    setIsEditing(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentUserId');
    sessionStorage.removeItem('currentUserEmail');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-700"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {['name', 'email', 'phone', 'address'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={userData[field]}
                    onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        );

      case 'bookings':
        return (
          <div className="text-center text-gray-500">
            No bookings available yet.
          </div>
        );

      case 'payment':
        return (
          <div className="text-center text-gray-500">
            No payment methods added yet.
          </div>
        );

      case 'settings':
        return (
          <div className="text-center text-gray-500">
            No settings available yet.
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center mb-6">
                <img
                  src={userData.avatar || '/default-avatar.png'}
                  alt={userData.name}
                  className="w-20 h-20 rounded-full mb-3 object-cover"
                />
                <h2 className="font-semibold">{userData.name}</h2>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>

              <nav className="space-y-1">
                {[
                  { key: 'profile', icon: User, label: 'Profile' },
                  { key: 'bookings', icon: Clock, label: 'Bookings' },
                  { key: 'payment', icon: CreditCard, label: 'Payment' },
                  { key: 'settings', icon: Settings, label: 'Settings' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg ${
                      activeTab === tab.key ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={20} className="mr-3" />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <LogOut size={20} className="mr-3" />
                  Log Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};