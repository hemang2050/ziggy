import React, { useState } from 'react';
import axios from 'axios';
import { Share2, X, Send } from 'lucide-react';

export const ShareButton = ({ itineraries }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const buildShareableItinerary = () => {
    return itineraries.map(trip => ({
      city: trip.city,
      startDate: trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A',
      endDate: trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'N/A',
      bookings: trip.bookings.map(booking => ({
        type: booking.type,
        name: booking.name || booking.airline,
        location: booking.location || `${booking.departureCity} ➔ ${booking.arrivalCity}`,
      })),
    }));
  };

  const handleShare = async () => {
    if (!itineraries || itineraries.length === 0) {
      setMessage('No itineraries available to share.');
      return;
    }
    if (!email) {
      setMessage('Please enter an email address.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('http://localhost:5001/api/email/share', {
        email,
        itinerary: buildShareableItinerary(),
      });

      setMessage(response.data.message || 'Itinerary shared successfully!');
      setEmail('');
      setTimeout(() => {
        setModalOpen(false);
        setMessage('');
      }, 1500);
    } catch (error) {
      console.error('Error sharing itinerary:', error.response?.data || error.message);
      setMessage('Failed to share itinerary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Share Floating Button */}
      <button
        onClick={() => setModalOpen(true)}
        title="Share Itinerary"
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-all"
      >
        <Share2 className="h-5 w-5" />
      </button>

      {/* Share Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl w-96 max-w-full animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Share Your Itinerary</h2>

            <input
              type="email"
              placeholder="Recipient's Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              onClick={handleShare}
              disabled={loading}
              className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Sending...' : 'Send'}
            </button>

            {message && (
              <p className="text-center text-sm mt-4 text-gray-600">{message}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};