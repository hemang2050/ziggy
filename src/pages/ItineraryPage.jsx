import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Star, MapPin, Plane, Building, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ShareButton } from '../components/ShareButton';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Map = ({ latitude, longitude, name, zoom = 15 }) => {
  if (!latitude || !longitude) return null;

  const position = [latitude, longitude];

  return (
    <div className="h-64 w-full rounded-md overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={defaultIcon}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export const ItineraryPage = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [expandedItinerary, setExpandedItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = sessionStorage.getItem('currentUserToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch bookings');

        const data = await response.json();
        organizeItineraries(data);
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const normalizeCityName = (input) => {
    if (!input) return 'Unknown';

    // First try to extract city from full address
    let city = extractCityFromAddress(input);
    
    // Handle airport codes
    const airportMap = {
      'MIA': 'Miami', 'JFK': 'New York', 'LGA': 'New York', 'EWR': 'New York',
      'LAX': 'Los Angeles', 'SFO': 'San Francisco', 'ORD': 'Chicago', 'ATL': 'Atlanta',
      'FLL': 'Fort Lauderdale', 'DFW': 'Dallas', 'DEN': 'Denver', 'SEA': 'Seattle',
      'IND': 'Indianapolis', 'BOS': 'Boston', 'PHL': 'Philadelphia'
    };

    if (input && input.length === 3 && /^[A-Z]+$/.test(input)) {
      return airportMap[input] || input;
    }

    // Common city name variations
    const cityMappings = {
      'miami beach': 'Miami',
      'south beach': 'Miami',
      'fort lauderdale': 'Fort Lauderdale',
      'ft lauderdale': 'Fort Lauderdale',
      'ft. lauderdale': 'Fort Lauderdale',
      'new york city': 'New York',
      'nyc': 'New York',
      'manhattan': 'New York',
      'brooklyn': 'New York',
      'la': 'Los Angeles',
      'los angeles': 'Los Angeles',
      'hollywood': 'Los Angeles',
      'sf': 'San Francisco',
      'san francisco': 'San Francisco',
      'chicago': 'Chicago',
      'downtown chicago': 'Chicago',
      'indy': 'Indianapolis'
    };

    const normalizedCity = city.toLowerCase();
    return cityMappings[normalizedCity] || capitalizeFirstLetter(city);
  };

  const extractCityFromAddress = (address) => {
    if (!address) return 'Unknown';
    
    const parts = address.split(',').map(part => part.trim());
    
    if (parts.length >= 2) {
      let city = parts[1];
      city = city.split(' ')[0];
      return city;
    }
    
    return parts[0];
  };

  const capitalizeFirstLetter = (word) => {
    if (!word) return '';
    return word.split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const organizeItineraries = (bookingsData) => {
    if (!bookingsData || bookingsData.length === 0) {
      setItineraries([]);
      return;
    }

    const cityMap = {};
    const flightMap = {};

    bookingsData.forEach(booking => {
      booking.flights.forEach(flight => {
        const fromCity = normalizeCityName(flight.departAirport);
        const toCity = normalizeCityName(flight.toDestination || flight.arriveAirport);
        
        const routeKey = `${fromCity}-${toCity}`;
        
        if (!flightMap[routeKey]) {
          flightMap[routeKey] = {
            outbound: {
              departureCity: fromCity,
              arrivalCity: toCity,
              departureTime: flight.departTime
            },
            flights: []
          };
        }
        
        flightMap[routeKey].flights.push({
          type: 'Flight',
          airline: flight.flightBrand,
          departureAirport: flight.departAirport,
          departureCity: fromCity,
          arrivalAirport: flight.arriveAirport,
          arrivalCity: toCity,
          departureTime: flight.departTime,
          arrivalTime: flight.arriveTime,
          isReturn: false
        });
      });
    });

    Object.keys(flightMap).forEach(route => {
      const [from, to] = route.split('-');
      const returnRouteKey = `${to}-${from}`;
      
      if (flightMap[returnRouteKey]) {
        flightMap[returnRouteKey].flights.forEach(flight => {
          flight.isReturn = true;
          
          const outboundDeparture = new Date(flightMap[route].outbound.departureTime);
          const returnDeparture = new Date(flight.departureTime);
          
          if (returnDeparture > outboundDeparture) {
            flight.isReturn = true;
          }
        });
      }
    });

    for (const route in flightMap) {
      const [from, to] = route.split('-');
      const flights = flightMap[route].flights;
      
      flights.forEach(flight => {
        let cityForFlight;
        
        if (flight.isReturn) {
          cityForFlight = flight.departureCity;
        } else {
          cityForFlight = flight.arrivalCity;
        }
        
        if (!cityMap[cityForFlight]) {
          cityMap[cityForFlight] = createNewCityTrip(cityForFlight);
        }
        
        cityMap[cityForFlight].bookings.push(flight);
      });
    }

    bookingsData.forEach(booking => {
      booking.accommodations.forEach(hotel => {
        let hotelCity = normalizeCityName(hotel.accommodationAddress);
        let foundExistingCity = false;
        
        if (cityMap[hotelCity]) {
          foundExistingCity = true;
        } else {
          for (const city in cityMap) {
            if (hotelCity.includes(city) || city.includes(hotelCity)) {
              hotelCity = city;
              foundExistingCity = true;
              break;
            }
          }
        }

        if (!foundExistingCity) {
          cityMap[hotelCity] = createNewCityTrip(hotelCity);
        }

        cityMap[hotelCity].bookings.push({
          type: 'Hotel',
          name: hotel.accommodationHostName,
          location: hotel.accommodationAddress,
          checkinDate: hotel.accommodationStartDate,
          checkoutDate: hotel.accommodationEndDate,
          accommodationLatitude: hotel.accommodationLatitude,
          accommodationLongitude: hotel.accommodationLongitude,
          guests: 2
        });
      });
    });

    const cityTrips = Object.values(cityMap);

    cityTrips.forEach(trip => {
      const allDates = [];

      trip.bookings.forEach(item => {
        if (item.type === 'Flight') {
          if (item.departureTime) allDates.push(new Date(item.departureTime));
          if (item.arrivalTime) allDates.push(new Date(item.arrivalTime));
        } else if (item.type === 'Hotel') {
          if (item.checkinDate) allDates.push(new Date(item.checkinDate));
          if (item.checkoutDate) allDates.push(new Date(item.checkoutDate));
        }
      });

      const validDates = allDates.filter(d => !isNaN(d));
      if (validDates.length) {
        trip.startDate = new Date(Math.min(...validDates));
        trip.endDate = new Date(Math.max(...validDates));
      }

      trip.bookings.sort((a, b) => {
        const getDate = (item) => {
          if (item.type === 'Hotel') return new Date(item.checkinDate);
          return new Date(item.departureTime); 
        };
        return getDate(a) - getDate(b);
      });
    });

    cityTrips.sort((a, b) => {
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return a.startDate - b.startDate;
    });

    setItineraries(cityTrips);
  };

  const createNewCityTrip = (city) => ({
    id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    city,
    bookings: [],
    startDate: null,
    endDate: null,
    rating: 0
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleExpandItinerary = (id) => {
    setExpandedItinerary(expandedItinerary === id ? null : id);
  };

  const handleBookMore = () => {
    navigate('/');
  };

  const handleRateTrip = (tripId, rating) => {
    setItineraries(prev =>
      prev.map(trip => trip.id === tripId ? { ...trip, rating } : trip)
    );
  };

  const StarRating = ({ rating, onRate, editable = true }) => (
    <div className="flex items-center mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={editable ? () => onRate(star) : undefined}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} ${editable ? 'cursor-pointer' : ''}`}
        />
      ))}
    </div>
  );

  const getIconForBookingType = (type) => {
    switch (type) {
      case 'Flight':
        return <Plane className="h-4 w-4 mr-2 text-blue-500" />;
      case 'Hotel':
        return <Building className="h-4 w-4 mr-2 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Itineraries</h1>
          <div className="flex space-x-2">
    <button
      onClick={handleBookMore}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      Plan a Trip
    </button>
  </div>
</div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader">Loading...</div>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">You don't have any itineraries yet.</p>
              <button
                onClick={handleBookMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Book Now
              </button>
            </div>
          ) : (
            itineraries.map((trip) => (
              <div key={trip.id} className="border-b border-gray-200 last:border-b-0">
                <div
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleExpandItinerary(trip.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-lg">{trip.city}</h3>
                        <div className="flex items-center">
                        <ShareButton itineraries={itineraries} className="cursor-pointer"/>
                          {expandedItinerary === trip.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 ml-2" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 ml-2" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <span className="mr-2">{trip.bookings.length} bookings</span>
                        ({trip.bookings.filter(b => b.type === 'Flight').length} flights, 
                        {trip.bookings.filter(b => b.type === 'Hotel').length} accommodations)
                      </div>
                      <StarRating rating={trip.rating} onRate={(rating) => handleRateTrip(trip.id, rating)} editable />
                    </div>
                  </div>
                </div>

                {expandedItinerary === trip.id && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-4">
                    {trip.bookings.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-md p-4 shadow-sm">
                        <div className="flex items-center mb-2">
                          {getIconForBookingType(item.type)}
                          <span className="font-medium text-gray-800">
                            {item.type === 'Flight' && item.isReturn ? 'Return Flight' : item.type}
                          </span>
                        </div>
                        
                        {item.type === 'Flight' ? (
                          <>
                            <p className="font-medium text-gray-700">{item.airline}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div>
                                <p className="text-sm font-medium">{item.departureAirport}</p>
                                <p className="text-xs text-gray-500">{item.departureCity}</p>
                                <p className="text-xs text-gray-400">
                                  {formatDate(item.departureTime)} {formatTime(item.departureTime)}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                              <div className="text-right">
                                <p className="text-sm font-medium">{item.arrivalAirport}</p>
                                <p className="text-xs text-gray-500">{item.arrivalCity}</p>
                                <p className="text-xs text-gray-400">
                                  {formatDate(item.arrivalTime)} {formatTime(item.arrivalTime)}
                                </p>
                              </div>
                            </div>
                            {item.isReturn && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-xs text-blue-600 font-medium">Return flight to complete your trip</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-700">{item.name}</p>
                              <p className="text-sm text-gray-500 mt-1">{item.location}</p>
                              <div className="flex items-center mt-2 text-sm">
                                <span className="text-gray-600">Check-in:</span>
                                <span className="ml-2 text-gray-800">{formatDate(item.checkinDate)}</span>
                              </div>
                              <div className="flex items-center mt-1 text-sm">
                                <span className="text-gray-600">Check-out:</span>
                                <span className="ml-2 text-gray-800">{formatDate(item.checkoutDate)}</span>
                              </div>
                            </div>
                            <div>
                              <Map 
                                latitude={item.accommodationLatitude} 
                                longitude={item.accommodationLongitude} 
                                name={item.name}
                              />
                              
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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