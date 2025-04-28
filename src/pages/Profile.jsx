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
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  

  useEffect(() => {
    const loadUserData = () => {
      const userId = sessionStorage.getItem('currentUserId');
      const userEmail = sessionStorage.getItem('currentUserEmail');
      const fullName = sessionStorage.getItem('currentUserName');
      const firstName = fullName ? fullName.split(' ')[0] : '';

      if (!userId || !userEmail) {
        navigate('/login');
        return;
      }

      setUserData({
        name: firstName,
        email: userEmail,
        phone: "",
        address: "",
        avatar: "",
      });

      setIsLoading(false);
    };

    loadUserData();
  }, [navigate]);

  const handleSave = () => {
    const userId = sessionStorage.getItem('currentUserId');
    if (!userId) return;

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
          <div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={userData.address}
                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
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
          </div>
        );
      case 'bookings':
      case 'payment':
      case 'settings':
        return (
          <div className="text-center text-gray-400 text-sm py-10">
            Coming soon 🚀
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
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-20 h-20 rounded-full mb-3 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-blue-500" />
                  </div>
                )}
                <h2 className="font-semibold">{userData.name}</h2>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <User size={20} className="mr-3" /> Profile
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center px-3 py-2 rounded-lg ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Clock size={20} className="mr-3" /> Bookings
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center px-3 py-2 rounded-lg ${activeTab === 'payment' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <CreditCard size={20} className="mr-3" /> Payment
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Settings size={20} className="mr-3" /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <LogOut size={20} className="mr-3" /> Log Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
