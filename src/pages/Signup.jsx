// Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import email_icon from '../assets/mail.png';
import name_icon from '../assets/user.png';
import password_icon from '../assets/padlock.png';

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      setSuccessMessage('Signup successful! Please check your email to confirm your account.');
      setFormData({ name: '', email: '', password: '' });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMessage}</div>}

        {!successMessage && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex items-center bg-gray-100 p-2 rounded">
              <img src={name_icon} alt="name" className="w-6 h-6 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent outline-none w-full"
                required
              />
            </div>

            <div className="flex items-center bg-gray-100 p-2 rounded">
              <img src={email_icon} alt="email" className="w-6 h-6 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent outline-none w-full"
                required
              />
            </div>

            <div className="flex items-center bg-gray-100 p-2 rounded">
              <img src={password_icon} alt="password" className="w-6 h-6 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent outline-none w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

