// src/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import email_icon from '../assets/mail.png';
import password_icon from '../assets/padlock.png';
import travel_icon from '../assets/travel.png';
import plane_icon from '../assets/plane.png';
import bed_icon from '../assets/bed.png';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      sessionStorage.setItem('currentUserId', data.userId);
      sessionStorage.setItem('currentUserEmail', data.email);
      sessionStorage.setItem('currentUserToken', data.token);
      sessionStorage.setItem('currentUserName', data.name);

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center p-8">
        <div className="flex items-center mb-6">
          <span className="text-yellow-400 text-3xl mr-3">◇</span>
          <span className="font-bold text-3xl">Ziggy</span>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center bg-white rounded-md px-4 py-3">
              <img src={email_icon} alt="email" className="w-6 h-6 mr-4" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white text-black outline-none"
                required
              />
            </div>

            <div className="flex items-center bg-white rounded-md px-4 py-3">
              <img src={password_icon} alt="password" className="w-6 h-6 mr-4" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white text-black outline-none"
                required
              />
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-yellow-300 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {error && <div className="text-red-300 text-center text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 rounded transition"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-sm text-white">New here?</span>
            <Link to="/signup" className="ml-2 text-yellow-300 hover:underline text-sm">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12">
        <div className="flex flex-col gap-10">
          <div className="flex items-center space-x-4">
            <img src={bed_icon} alt="bed" className="w-16 h-16" />
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Affordable Lodgings</h3>
              <p className="text-sm text-gray-500">Find local accommodations with the best rates.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <img src={plane_icon} alt="plane" className="w-16 h-16" />
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Available Flights</h3>
              <p className="text-sm text-gray-500">Get the best flights and hotels in one place.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <img src={travel_icon} alt="travel" className="w-16 h-16" />
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Satisfaction Guarantee</h3>
              <p className="text-sm text-gray-500">Verified ratings from other travelers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

