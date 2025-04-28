import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Plane, Building, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const Itinerary = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedBookings, setGroupedBookings] = useState({});
  const [expandedLocations, setExpandedLocations] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('currentUserToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch bookings');

        const data = await response.json();
        setBookings(data);

        const grouped = groupBookingsByLocation(data);
        setGroupedBookings(grouped);

        const initialExpanded = {};
        Object.keys(grouped).forEach(location => {
          initialExpanded[location] = true;
        });
        setExpandedLocations(initialExpanded);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const groupBookingsByLocation = (bookingsData) => {
    const grouped = {};
    bookingsData.forEach(booking => {
      booking.accommodations?.forEach(accommodation => {
        const location = accommodation.accommodationCity || 'Unknown Location';
        if (!grouped[location]) grouped[location] = { accommodations: [], flights: [] };
        grouped[location].accommodations.push({
          ...accommodation,
          bookingId: booking._id,
          bookingDate: booking.createdAt,
          price: accommodation.accommodationPrice
        });
      });

      if (booking.flights && booking.flights.length > 0) {
        const firstDestination = booking.flights[0]?.toDestination || 'Unknown Location';
        if (!grouped[firstDestination]) grouped[firstDestination] = { accommodations: [], flights: [] };
        booking.flights.forEach(flight => {
          grouped[firstDestination].flights.push({
            ...flight,
            bookingId: booking._id,
            bookingDate: booking.createdAt,
            price: flight.flightPrice
          });
        });
      }
    });
    return grouped;
  };

  const toggleLocation = (location) => {
    setExpandedLocations(prev => ({ ...prev, [location]: !prev[location] }));
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (loading) return <div className="flex justify-center items-center h-screen">Loading your itineraries...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">Error: {error}</div>;

  if (Object.keys(groupedBookings).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">My Itineraries</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lg mb-4">You don't have any bookings yet.</p>
            <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium">Start Planning Your Trip</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Itineraries</h1>

        {Object.entries(groupedBookings).map(([location, locationBookings]) => (
          <div key={location} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <MapPin className="mr-2" />
                <h2 className="text-xl font-bold">{location}</h2>
              </div>
              <button
                onClick={() => toggleLocation(location)}
                className="p-1 rounded-full hover:bg-blue-700 transition"
              >
                {expandedLocations[location] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>

            {expandedLocations[location] && (
              <div className="p-4">
                {locationBookings.accommodations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Building className="mr-2" /> Accommodations
                    </h3>
                    <div className="space-y-4">
                      {locationBookings.accommodations.map((accommodation, idx) => (
                        <div key={idx} className="border rounded-lg p-4 hover:shadow-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold">{accommodation.accommodationHostName}</h4>
                              <p className="text-gray-600 text-sm">{accommodation.accommodationAddress}</p>
                              <div className="flex items-center mt-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{formatDate(accommodation.accommodationStartDate)} - {formatDate(accommodation.accommodationEndDate)}</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-700"><strong>Type:</strong> {accommodation.accommodationType}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">${parseFloat(accommodation.price).toFixed(2)}</p>
                              <p className="text-xs text-gray-500">Booked on {formatDate(accommodation.bookingDate)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {locationBookings.flights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Plane className="mr-2" /> Flights
                    </h3>
                    <div className="space-y-4">
                      {locationBookings.flights.map((flight, idx) => (
                        <div key={idx} className="border rounded-lg p-4 hover:shadow-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold">{flight.flightBrand} - {flight.flightNumber}</h4>
                              <div className="flex items-center mt-2">
                                <div className="text-center">
                                  <p className="font-medium">{flight.fromDestination}</p>
                                  <p className="text-sm text-gray-600">{formatTime(flight.departTime)}</p>
                                </div>
                                <ArrowRight className="mx-3" />
                                <div className="text-center">
                                  <p className="font-medium">{flight.toDestination}</p>
                                  <p className="text-sm text-gray-600">{formatTime(flight.arriveTime)}</p>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-gray-700"><strong>Class:</strong> {flight.flightClass}</p>
                              {flight.seatNumber !== "TBD" && <p className="text-sm text-gray-700"><strong>Seat:</strong> {flight.seatNumber}</p>}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">${parseFloat(flight.price).toFixed(2)}</p>
                              <p className="text-xs text-gray-500">Booked on {formatDate(flight.bookingDate)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

      </div>
      <Footer />
    </div>
  );
};

export default Itinerary;