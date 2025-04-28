// frontend/src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Validate token presence
    if (!token) {
      setMessage('Invalid or missing reset token');
      setIsError(true);
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    // Password validation
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsError(true);
      return;
    }

    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/reset-password`;
      console.log('Sending request to:', apiUrl); // Debug line

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      console.error('Reset password error:', err);
      setMessage(err.message || 'An error occurred during password reset');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Reset your password</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your new password below</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 shadow rounded-xl">
        {message && (
          <div className={`mb-4 p-3 rounded-lg border ${
            isError 
              ? 'bg-red-50 text-red-800 border-red-200' 
              : 'bg-green-50 text-green-800 border-green-200'
          }`}>
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleReset}>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new password"
              disabled={!token || loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm new password"
              disabled={!token || loading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!token || loading}
              className={`w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition ${(!token || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;