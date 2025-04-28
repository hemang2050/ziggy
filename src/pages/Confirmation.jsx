import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plane, Building } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const ConfirmationPage = () => {
  const navigate = useNavigate();

  const handleViewItinerary = () => {
    navigate('/itineraries');
  };

  const handleBookMore = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center justify-center">
          <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Successful!</h1>
          <p className="text-gray-600 mb-8">
            Your booking has been confirmed. You can view your itinerary or book more adventures!
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={handleViewItinerary}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <Plane className="h-5 w-5 mr-2" />
              View My Itinerary
            </button>

            <button
              onClick={handleBookMore}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <Building className="h-5 w-5 mr-2" />
              Book More
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
