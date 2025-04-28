import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trash2, Building, Plane, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const BookingPage = ({ bookings = [], setBookings = () => {} }) => {
  const navigate = useNavigate();
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return '';
    }
  };

  const handleExpandBooking = (id) => {
    setExpandedBooking(prev => prev === id ? null : id);
  };

  const handleRemoveBooking = async (id) => {
    if (window.confirm('Are you sure you want to remove this booking from your itinerary?')) {
      try {
        const token = sessionStorage.getItem('currentUserToken');
        if (!token) {
          navigate('/login');
          return;
        }
  
        const response = await fetch(`http://localhost:5001/api/bookings/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete booking from server');
        }
  
        const updated = bookings.filter(booking => booking._id !== id);
        setBookings(updated);
  
        alert('Booking successfully deleted!');
      } catch (error) {
        console.error('Error deleting booking:', error.message);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };
  
 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('currentUserToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5001/api/bookings`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch bookings');

        const data = await response.json();
        console.log('Bookings in MyBookings Page:', data);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, setBookings]);

  const handleBookMore = () => {
    navigate('/');
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(booking => {
        if (filter === 'hotel') {
          return booking.accommodations && booking.accommodations.length > 0;
        } else if (filter === 'flight') {
          return booking.flights && booking.flights.length > 0;
        }
        return true;
      });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <button
            onClick={handleBookMore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Book More
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-2">
              {['all', 'hotel', 'flight'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === type ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type === 'all' ? 'All Bookings' : type === 'hotel' ? 'Hotels' : 'Flights'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader">Loading...</div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No bookings found.</p>
              <button
                onClick={handleBookMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Book Now
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="border-b border-gray-200 last:border-b-0">
                <div
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleExpandBooking(booking._id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                      Booking - ${booking.price}
                    </h3>
                    {expandedBooking === booking._id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedBooking === booking._id && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="space-y-4">
                      {/* Flights */}
                      {booking.flights && booking.flights.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Flights</h4>
                          {booking.flights.map((flight, idx) => (
                            <div key={idx} className="border p-3 rounded mb-3">
                              <div className="flex justify-between">
                                <span><Plane className="inline h-4 w-4 mr-1" /> {flight.fromDestination} → {flight.toDestination}</span>
                                <span>{flight.flightBrand}</span>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Departure: {formatDate(flight.departTime)} | Arrival: {formatDate(flight.arriveTime)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Hotels */}
                      {booking.accommodations && booking.accommodations.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Accommodations</h4>
                          {booking.accommodations.map((hotel, idx) => (
                            <div key={idx} className="border p-3 rounded mb-3">
                              <div><Building className="inline h-4 w-4 mr-1" /> {hotel.accommodationHostName}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                {hotel.accommodationAddress}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(hotel.accommodationStartDate)} → {formatDate(hotel.accommodationEndDate)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <div className="mt-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBooking(booking._id);
                        }}
                        className="text-red-500 hover:text-red-700 flex items-center text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
