import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Search, Map, Calendar, Users, Plane, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DestinationAutocomplete from './DestinationAutocomplete';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('hotels'); // 'hotels' or 'flights'
  const [destination, setDestination] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  // Flight specific states
  const [origin, setOrigin] = useState(null);
  const [tripType, setTripType] = useState('roundTrip'); // 'roundTrip' or 'oneWay'
  const [travelClass, setTravelClass] = useState('economy');

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('searchType', searchType);

      if (searchType === 'hotels') {
        if (!destination || !destination.iataCode || !checkInDate || !checkOutDate) {
          alert('Please select a destination and dates');
          setIsSearching(false);
          return;
        }

        // Add hotel search params
        searchParams.append('location', destination.displayName);
        searchParams.append('cityCode', destination.iataCode);
        searchParams.append('checkIn', formatDate(checkInDate));
        searchParams.append('checkOut', formatDate(checkOutDate));
        searchParams.append('guests', travelers);
        searchParams.append('rooms', rooms);
      } else {
        if (!origin || !destination || !origin.iataCode || !destination.iataCode || !checkInDate) {
          alert('Please select origin, destination, and departure date');
          setIsSearching(false);
          return;
        }

        // Add flight search params
        searchParams.append('location', origin.displayName);
        searchParams.append('destination', destination.displayName);
        searchParams.append('originCode', origin.iataCode);
        searchParams.append('destinationCode', destination.iataCode);
        searchParams.append('departureDate', formatDate(checkInDate));

        if (tripType === 'roundTrip' && checkOutDate) {
          searchParams.append('returnDate', formatDate(checkOutDate));
        }

        searchParams.append('guests', travelers);
        searchParams.append('travelClass', travelClass);
      }

      // Navigate to the search results page
      navigate(`/results?${searchParams.toString()}`);
    } catch (error) {
      console.error('Error during search:', error);
      alert('An error occurred during search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Helper function to format date for API (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden ">
      {/* Tab Selector */}
      <div className="flex border-b ">
        <button
          onClick={() => setSearchType('hotels')}
          className={`flex items-center px-6 py-4 text-sm font-medium hover:cursor-pointer ${
            searchType === 'hotels'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Building size={18} className="mr-2" />
          Hotels & Stays
        </button>
        <button
          onClick={() => setSearchType('flights')}
          className={`flex items-center px-6 py-4 text-sm font-medium hover:cursor-pointer ${
            searchType === 'flights'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Plane size={18} className="mr-2" />
          Flights
        </button>
      </div>

      {/* Search Forms */}
      <div className="p-6">
        {searchType === 'hotels' ? (
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Destination Input */}
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <DestinationAutocomplete
                value={destination ? destination.displayName : ''}
                onChange={setDestination}
                placeholder="Where are you going?"
                icon={Map}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <Calendar className="text-gray-500 mr-3" size={20} />
                <DatePicker
                  selected={checkInDate}
                  onChange={(date) => setCheckInDate(date)}
                  placeholderText="Check-in date"
                  className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
                  minDate={new Date()}
                />
              </div>

              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <Calendar className="text-gray-500 mr-3" size={20} />
                <DatePicker
                  selected={checkOutDate}
                  onChange={(date) => setCheckOutDate(date)}
                  placeholderText="Check-out date"
                  className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
                  minDate={checkInDate || new Date()}
                />
              </div>
            </div>

            {/* Travelers and Rooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <Users className="text-gray-500 mr-3" size={20} />
                <div className="w-full">
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                    className="w-full bg-transparent focus:outline-none text-gray-700"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Traveler' : 'Travelers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <Building className="text-gray-500 mr-3" size={20} />
                <div className="w-full">
                  <select
                    value={rooms}
                    onChange={(e) => setRooms(parseInt(e.target.value))}
                    className="w-full bg-transparent focus:outline-none text-gray-700"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Room' : 'Rooms'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={isSearching}
              className={`w-full mt-6 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center ${
                isSearching ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} className="mr-2" />
                  Search Hotels
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Trip Type */}
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="roundTrip"
                  checked={tripType === 'roundTrip'}
                  onChange={() => setTripType('roundTrip')}
                  className="mr-2"
                />
                Round-trip
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="oneWay"
                  checked={tripType === 'oneWay'}
                  onChange={() => setTripType('oneWay')}
                  className="mr-2"
                />
                One-way
              </label>
            </div>

            {/* Origin & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <DestinationAutocomplete
                  value={origin ? origin.displayName : ''}
                  onChange={setOrigin}
                  placeholder="From where?"
                  icon={Plane}
                  isOrigin={true}
                />
              </div>

              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <DestinationAutocomplete
                  value={destination ? destination.displayName : ''}
                  onChange={setDestination}
                  placeholder="To where?"
                  icon={Plane}
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <Calendar className="text-gray-500 mr-3" size={20} />
                <DatePicker
                  selected={checkInDate}
                  onChange={(date) => setCheckInDate(date)}
                  placeholderText="Departure date"
                  className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
                  minDate={new Date()}
                />
              </div>

              {tripType === 'roundTrip' && (
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <Calendar className="text-gray-500 mr-3" size={20} />
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    placeholderText="Return date"
                    className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
                    minDate={checkInDate || new Date()}
                  />
                </div>
              )}
            </div>

            {/* Travelers & Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <Users className="text-gray-500 mr-3" size={20} />
                <div className="w-full">
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                    className="w-full bg-transparent focus:outline-none text-gray-700"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <Plane className="text-gray-500 mr-3" size={20} />
                <div className="w-full">
                  <select
                    value={travelClass}
                    onChange={(e) => setTravelClass(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-gray-700"
                  >
                    <option value="economy">Economy</option>
                    <option value="premiumEconomy">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={isSearching}
              className={`w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center ${
                isSearching ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} className="mr-2" />
                  Search Flights
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
