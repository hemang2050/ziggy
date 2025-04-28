import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Star, CreditCard, Calendar, Users, Plane, Clock } from 'lucide-react';
import { mockHotels } from '../hotelData';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const Checkout = ({ bookings, setBookings }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationHook = useLocation();
  const selectedFlight = locationHook.state?.selectedFlight || null;

  const hotelId = searchParams.get('hotelId');
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '1';
  const location = searchParams.get('location') || '';
  const numberOfRooms = parseInt(searchParams.get('rooms')) || 1;

  const [hotel, setHotel] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (selectedFlight) {
      const price = parseFloat(selectedFlight?.price?.total || 0);
      setTotalAmount(price + 35);
      setLoading(false);
      return;
    }

    if (hotelId) {
      const foundHotel = mockHotels.find(h => h.hotel.hotelId === hotelId);
      if (foundHotel) {
        setHotel(foundHotel);
        const pricePerNight = foundHotel?.offers?.[0]?.price?.total ? parseFloat(foundHotel.offers[0].price.total) : 0;
        const nights = calculateNights(checkIn, checkOut);
        if (pricePerNight > 0 && nights > 0) {
          setTotalAmount((pricePerNight * nights + 85) * numberOfRooms);
        }
      }
    }
    setLoading(false);
  }, [hotelId, checkIn, checkOut, selectedFlight, numberOfRooms]);

  useEffect(() => {
    const token = sessionStorage.getItem('currentUserToken');
    if (!token) {
      alert('You must be logged in to proceed to checkout!');
      navigate('/login');
    }
  }, [navigate]);
  

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const formatDuration = (duration) => {
    if (!duration) return '';
    let formatted = duration.replace('PT', '');
    
    if (duration.includes('H')) {
      formatted = formatted.replace('H', 'h ');
    }
    if (duration.includes('M')) {
      formatted = formatted.replace('M', 'm');
    } else if (formatted.endsWith('h ')) {
      formatted = formatted.trim();
    }
    
    return formatted;
  };

  const generateBackendPayload = (hotel, selectedFlight, checkIn, checkOut, formData, totalAmount, location) => {
    const userId = sessionStorage.getItem('currentUserId');
  
    let payload = {
      user: userId,
      price: parseFloat(totalAmount.toFixed(2)),
      accommodations: [],
      flights: []
    };
  
    // Add hotel accommodation if present
    if (hotel) {
      payload.accommodations.push({
        accommodationAddress: hotel.hotel.address?.lines?.[0] || `${hotel.hotel.name}, ${location}`,
        accommodationCity: location,
        accommodationStartDate: checkIn,
        accommodationEndDate: checkOut,
        accommodationHostName: hotel.hotel.name,
        accommodationType: "HOTEL",
        accommodationPrice: parseFloat(hotel.offers?.[0]?.price?.total || "0"),
        accommodationLatitude: hotel.hotel.latitude || null,
        accommodationLongitude: hotel.hotel.longitude || null,
      });
    }
  
    // Add flight data if present
    if (selectedFlight) {
      const outbound = selectedFlight.itineraries[0];
      const outboundDeparture = outbound.segments[0].departure;
      const outboundArrival = outbound.segments[outbound.segments.length - 1].arrival;
  
      payload.flights.push({
        holderName: formData.fullName,
        flightNumber: outbound.segments[0].carrierCode + outbound.segments[0].number,
        flightBrand: Array.isArray(selectedFlight.validatingAirlineCodes) 
          ? selectedFlight.validatingAirlineCodes[0]
          : (selectedFlight.validatingAirlineCodes || 'Unknown Airline'),
        flightClass: "Economy",
        planeType: outbound.segments[0].aircraft?.code || "Unknown",
        departAirport: outboundDeparture.iataCode,
        departTime: outboundDeparture.at,
        fromDestination: outboundDeparture.iataCode,
        arriveAirport: outboundArrival.iataCode,
        arriveTime: outboundArrival.at,
        toDestination: outboundArrival.iataCode,
        gateNumber: "TBD",
        seatNumber: "TBD",
        flightPrice: selectedFlight.itineraries.length > 1 
          ? parseFloat(selectedFlight.price.total) / 2 
          : parseFloat(selectedFlight.price.total)
      });
  
      if (selectedFlight.itineraries.length > 1) {
        const returnFlight = selectedFlight.itineraries[1];
        const returnDeparture = returnFlight.segments[0].departure;
        const returnArrival = returnFlight.segments[returnFlight.segments.length - 1].arrival;
  
        payload.flights.push({
          holderName: formData.fullName,
          flightNumber: returnFlight.segments[0].carrierCode + returnFlight.segments[0].number,
          flightBrand: Array.isArray(selectedFlight.validatingAirlineCodes) 
            ? selectedFlight.validatingAirlineCodes[0]
            : (selectedFlight.validatingAirlineCodes || 'Unknown Airline'),
          flightClass: "Economy",
          planeType: returnFlight.segments[0].aircraft?.code || "Unknown",
          departAirport: returnDeparture.iataCode,
          departTime: returnDeparture.at,
          fromDestination: returnDeparture.iataCode,
          arriveAirport: returnArrival.iataCode,
          arriveTime: returnArrival.at,
          toDestination: returnArrival.iataCode,
          gateNumber: "TBD",
          seatNumber: "TBD",
          flightPrice: parseFloat(selectedFlight.price.total) / 2
        });
      }
    }
  
    return payload;
  };
  

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
  
    const backendPayload = generateBackendPayload(
      hotel,
      selectedFlight,
      checkIn,
      checkOut,
      formData,
      totalAmount,
      location
    );
  
    try {
      const token = sessionStorage.getItem('currentUserToken');
      if (!token) {
        alert('Please login first to complete booking.');
        navigate('/login');
        return;
      }
  
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // send token in header
        },
        body: JSON.stringify(backendPayload),
      });
  
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create booking');
      }
  
      const savedBooking = await response.json();
      console.log('Booking saved to backend:', savedBooking);
  
      // (Optionally) You can also update local bookings if needed
  
      navigate('/confirmation');
  
    } catch (error) {
      console.error('Booking Error:', error.message);
      alert(error.message);
    }
  };
  

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleConfirmPayment} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Guest Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <input name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="p-2 border rounded-md" />
              <input name="email" required value={formData.email} onChange={handleInputChange} placeholder="Email" className="p-2 border rounded-md" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment</h2>
            <div className="grid grid-cols-1 gap-4">
              <input name="cardNumber" required value={formData.cardNumber} onChange={handleInputChange} placeholder="Card Number" className="p-2 border rounded-md" />
              <input name="expiryDate" required value={formData.expiryDate} onChange={handleInputChange} placeholder="Expiry (MM/YY)" className="p-2 border rounded-md" />
              <input name="cvv" required value={formData.cvv} onChange={handleInputChange} placeholder="CVV" className="p-2 border rounded-md" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
            Confirm Payment
          </button>
        </form>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {selectedFlight ? (
              <div className="space-y-4">
                <div className="flex items-center mb-4 text-blue-600 font-semibold">
                  <Plane className="mr-2" /> Flight Booking
                </div>
                
                {/* Outbound Flight */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Outbound Flight</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{selectedFlight.itineraries[0].segments[0].departure.iataCode} → {selectedFlight.itineraries[0].segments.slice(-1)[0].arrival.iataCode}</p>
                      <p className="text-sm text-gray-600">{formatTime(selectedFlight.itineraries[0].segments[0].departure.at)}</p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDuration(selectedFlight.itineraries[0].duration)}</span>
                      </div>
                      <div className="w-24 h-px bg-gray-300 my-1"></div>
                      <p className="text-xs text-gray-500">{selectedFlight.itineraries[0].segments.length > 1 ? `${selectedFlight.itineraries[0].segments.length - 1} stop(s)` : 'Direct'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatTime(selectedFlight.itineraries[0].segments.slice(-1)[0].arrival.at)}</p>
                      <p className="text-sm text-gray-600">{selectedFlight.itineraries[0].segments.slice(-1)[0].arrival.iataCode}</p>
                    </div>
                  </div>
                </div>

                {/* Return Flight if exists */}
                {selectedFlight.itineraries[1] && (
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Return Flight</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{selectedFlight.itineraries[1].segments[0].departure.iataCode} → {selectedFlight.itineraries[1].segments.slice(-1)[0].arrival.iataCode}</p>
                        <p className="text-sm text-gray-600">{formatTime(selectedFlight.itineraries[1].segments[0].departure.at)}</p>
                      </div>
                      <div className="text-center flex flex-col items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{formatDuration(selectedFlight.itineraries[1].duration)}</span>
                        </div>
                        <div className="w-24 h-px bg-gray-300 my-1"></div>
                        <p className="text-xs text-gray-500">{selectedFlight.itineraries[1].segments.length > 1 ? `${selectedFlight.itineraries[1].segments.length - 1} stop(s)` : 'Direct'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatTime(selectedFlight.itineraries[1].segments.slice(-1)[0].arrival.at)}</p>
                        <p className="text-sm text-gray-600">{selectedFlight.itineraries[1].segments.slice(-1)[0].arrival.iataCode}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p><strong>Airline:</strong> {Array.isArray(selectedFlight.validatingAirlineCodes) 
                    ? selectedFlight.validatingAirlineCodes[0]
                    : (selectedFlight.validatingAirlineCodes || 'Multiple Airlines')}</p>
                  <p><strong>Total:</strong> ${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            ) : hotel ? (
              <div>
                <p><strong>Hotel:</strong> {hotel.hotel.name}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Guests:</strong> {guests}</p>
                <p><strong>Check-in:</strong> {checkIn}</p>
                <p><strong>Check-out:</strong> {checkOut}</p>
                <p><strong>Rooms:</strong> {numberOfRooms}</p>
                <p><strong>Total:</strong> ${totalAmount.toFixed(2)}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};