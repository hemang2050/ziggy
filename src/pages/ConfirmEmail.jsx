import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await axios.post(`${apiUrl}/api/auth/confirm-email`, { token });

        if (response.data.message) {
          setStatus('success');
          setMessage(response.data.message);
          setTimeout(() => {
            navigate('/login');
          }, 3000); // Redirect to login after 3 sec
        } else {
          setStatus('error');
          setMessage('Unexpected response. Please try again later.');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Something went wrong.');
      }
    };

    if (token) {
      confirmEmail();
    } else {
      setStatus('error');
      setMessage('Invalid or missing token.');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="loader mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Confirming your email...</h2>
            <p className="text-gray-500">Please wait</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h2 className="text-xl font-bold text-green-600 mb-2">Email confirmed!</h2>
            <p className="text-gray-500">{message}</p>
            <p className="text-gray-400 mt-4 text-sm">Redirecting to login...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-500">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;