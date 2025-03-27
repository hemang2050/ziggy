import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Plane, Building, Star, Clock, DollarSign, X, Menu } from 'lucide-react';
import { PlaceCard } from '../components/PlaceCard';
import { Map } from '../components/Map';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { searchFlights, searchHotels } from '../services/amadeus';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [showMap, setShowMap] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [searchType, setSearchType] = useState('hotels'); // 'hotels' or 'flights'
  const [showFilters, setShowFilters] = useState(false); // For mobile filter toggle
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    amenities: [],
    airlines: [],
    maxDuration: 24, // hours
  });

  const location = searchParams.get('location') || '';
  const destination = searchParams.get('destination') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const departureDate = searchParams.get('departureDate') || checkIn;
  const returnDate = searchParams.get('returnDate') || checkOut;
  const guests = searchParams.get('guests') || '1';
  const originCode = searchParams.get('originCode') || '';
  const destinationCode = searchParams.get('destinationCode') || '';
  const cityCode = searchParams.get('cityCode') || '';
  const searchTypeParam = searchParams.get('searchType') || 'hotels';

  useEffect(() => {
    setSearchType(searchTypeParam);
  }, [searchTypeParam]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching results for:', {
        searchType,
        originCode,
        destinationCode,
        cityCode,
        checkIn,
        checkOut,
        departureDate,
        returnDate
      });

      try {
        if (searchType === 'flights' && originCode && destinationCode && departureDate) {
          const flightsData = await searchFlights(
            originCode,
            destinationCode,
            departureDate,
            returnDate,
            parseInt(guests)
          );
          setResults(flightsData || []);
          console.log('Flights data received:', flightsData);
        } else if (searchType === 'hotels' && cityCode && checkIn && checkOut) {
          const hotelsData = await searchHotels(
            cityCode,
            checkIn,
            checkOut
          );
          console.log('Hotels data received:', hotelsData);
          setResults(hotelsData || []);
        } else {
          // Log which parameters are missing
          console.log('Missing parameters for search:');
          if (searchType === 'hotels') {
            if (!cityCode) console.log('- Missing cityCode');
            if (!checkIn) console.log('- Missing checkIn');
            if (!checkOut) console.log('- Missing checkOut');
          } else {
            if (!originCode) console.log('- Missing originCode');
            if (!destinationCode) console.log('- Missing destinationCode');
            if (!departureDate) console.log('- Missing departureDate');
          }
          
          console.log('Using mock data due to missing parameters');
          setResults(mockPlaces);
        }
      } catch (err) {
        setError(`Failed to fetch results: ${err.message}`);
        console.error('Search results error:', err);
        // Don't automatically fall back to mock data on API errors
        // This helps with debugging API integration issues
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchType, originCode, destinationCode, cityCode, departureDate, returnDate, checkIn, checkOut, guests]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const applyFilters = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return [];

    return items.filter((item) => {
      if (searchType === 'hotels') {
        // Get price safely with null checking
        const price = item?.offers?.[0]?.price?.total ? parseFloat(item.offers[0].price.total) : 0;
        const rating = item?.hotel?.rating || 0;
        const hotelAmenities = item?.hotel?.amenities || [];

        return (
          price >= filters.priceRange[0] &&
          price <= filters.priceRange[1] &&
          rating >= filters.rating &&
          (filters.amenities.length === 0 || filters.amenities.some((amenity) => hotelAmenities.includes(amenity)))
        );
      } else if (searchType === 'flights') {
        // Get price safely
        const price = item?.price?.total ? parseFloat(item.price.total) : 0;
        
        // Handle both single airline code or array of codes
        let airlines = [];
        if (item?.validatingAirlineCodes) {
          airlines = Array.isArray(item.validatingAirlineCodes) 
            ? item.validatingAirlineCodes 
            : [item.validatingAirlineCodes];
        }

        // Extract duration in hours from PT2H30M format
        const getDurationHours = (duration) => {
          if (!duration) return 0;
          const hours = duration.match(/(\d+)H/);
          const minutes = duration.match(/(\d+)M/);
          return (hours ? parseInt(hours[1]) : 0) + (minutes ? parseInt(minutes[1]) / 60 : 0);
        };

        const flightDuration = getDurationHours(item?.itineraries?.[0]?.duration);

        return (
          price >= filters.priceRange[0] &&
          price <= filters.priceRange[1] &&
          flightDuration <= filters.maxDuration &&
          (filters.airlines.length === 0 || filters.airlines.some(airline => airlines.includes(airline)))
        );
      }

      return true;
    });
  };

  const sortResults = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return [];

    const sortedItems = [...items];

    if (searchType === 'hotels') {
      switch (sortBy) {
        case 'price':
          return sortedItems.sort((a, b) => {
            const priceA = a?.offers?.[0]?.price?.total ? parseFloat(a.offers[0].price.total) : 0;
            const priceB = b?.offers?.[0]?.price?.total ? parseFloat(b.offers[0].price.total) : 0;
            return priceA - priceB;
          });
        case 'rating':
          return sortedItems.sort((a, b) => {
            const ratingA = a?.hotel?.rating || 0;
            const ratingB = b?.hotel?.rating || 0;
            return ratingB - ratingA;
          });
        default:
          return sortedItems;
      }
    } else if (searchType === 'flights') {
      switch (sortBy) {
        case 'price':
          return sortedItems.sort((a, b) => {
            const priceA = a?.price?.total ? parseFloat(a.price.total) : 0;
            const priceB = b?.price?.total ? parseFloat(b.price.total) : 0;
            return priceA - priceB;
          });
        case 'duration':
          return sortedItems.sort((a, b) => {
            const durationA = a?.itineraries?.[0]?.duration || 'PT0H';
            const durationB = b?.itineraries?.[0]?.duration || 'PT0H';

            // Convert PT2H30M format to minutes for comparison
            const getMinutes = (duration) => {
              const hours = duration.match(/(\d+)H/);
              const minutes = duration.match(/(\d+)M/);
              return (hours ? parseInt(hours[1]) * 60 : 0) + (minutes ? parseInt(minutes[1]) : 0);
            };

            return getMinutes(durationA) - getMinutes(durationB);
          });
        default:
          return sortedItems;
      }
    }

    return sortedItems;
  };

  // Format duration from PT2H30M to 2h 30m
  const formatDuration = (duration) => {
    if (!duration) return '';
    let formatted = duration.replace('PT', '');
    
    // Handle cases where H or M might be missing
    if (duration.includes('H')) {
      formatted = formatted.replace('H', 'h ');
    }
    if (duration.includes('M')) {
      formatted = formatted.replace('M', 'm');
    } else if (formatted.endsWith('h ')) {
      // If there's no minutes component, clean up the trailing space
      formatted = formatted.trim();
    }
    
    return formatted;
  };

  // Format date to display time only
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return '';
    }
  };

  const renderFlightResults = () => {
    const filteredFlights = applyFilters(results);
    const sortedFlights = sortResults(filteredFlights);

    if (loading) return <div className="flex justify-center py-12"><div className="loader">Loading...</div></div>;

    if (error) return <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>;

    if (!sortedFlights || sortedFlights.length === 0)
      return <div className="text-center py-12 text-gray-500">No flights found matching your criteria.</div>;

    return (
      <div className="space-y-6">
        {sortedFlights.map((flight, index) => (
          <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4">
              <div className="flex items-center mb-3 md:mb-0">
                <Plane className="mr-3 text-blue-500" size={24} />
                <div>
                  <div className="text-xl font-semibold">
                    {flight?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || 'N/A'} →{' '}
                    {
                      flight?.itineraries?.[0]?.segments?.[
                        (flight?.itineraries?.[0]?.segments?.length || 1) - 1
                      ]?.arrival?.iataCode || 'N/A'
                    }
                  </div>
                  <div className="text-sm text-gray-500">
                    {
                      Array.isArray(flight?.validatingAirlineCodes) 
                        ? flight.validatingAirlineCodes[0]
                        : (flight?.validatingAirlineCodes || 'Multiple Airlines')
                    }
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${flight?.price?.total ? parseFloat(flight.price.total).toFixed(2) : '0.00'}
              </div>
            </div>

            {flight?.itineraries?.map((itinerary, itinIndex) => (
              <div key={itinIndex} className="mb-4">
                <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  {itinIndex === 0 ? 'Outbound' : 'Return'}{' '}
                  <Clock size={16} className="ml-2 mr-1" />{' '}
                  {formatDuration(itinerary?.duration || '')}
                </div>

                <div className="space-y-3">
                  {itinerary?.segments?.map((segment, segIndex) => (
                    <div key={segIndex} className="flex flex-col md:flex-row md:items-center border-l-2 border-blue-200 pl-3">
                      <div className="md:w-24 md:text-right md:pr-4 mb-2 md:mb-0">
                        <div className="font-semibold">{formatTime(segment?.departure?.at || '')}</div>
                        <div className="text-sm text-gray-500">{segment?.departure?.iataCode || ''}</div>
                      </div>

                      <div className="flex-1 py-2 md:px-4 hidden md:block">
                        <div className="h-0.5 bg-gray-200 relative">
                          <div className="absolute w-full text-xs text-gray-500 text-center -mt-3">
                            {formatDuration(segment?.duration || '')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile duration indicator */}
                      <div className="md:hidden text-xs text-gray-500 mb-2">
                        Duration: {formatDuration(segment?.duration || '')}
                      </div>

                      <div className="md:w-24 md:pl-4">
                        <div className="font-semibold">{formatTime(segment?.arrival?.at || '')}</div>
                        <div className="text-sm text-gray-500">{segment?.arrival?.iataCode || ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
              Select this flight
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderHotelResults = () => {
    // Make sure we're working with an array regardless of API response structure
    let processedResults = results;
    
    // If the results is not an array, check if it's within data property
    if (results && !Array.isArray(results)) {
      console.log('Results is not an array, trying to extract from data property');
      processedResults = results.data || results.hotelOffers || [];
    }
    
    const filteredHotels = applyFilters(processedResults);
    const sortedHotels = sortResults(filteredHotels);
  
    console.log('Filtered and sorted hotels:', sortedHotels);
  
    if (loading) return <div className="flex justify-center py-12"><div className="loader">Loading...</div></div>;
  
    if (error) return <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>;
  
    if (!sortedHotels || sortedHotels.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No hotels found matching your criteria.
          {cityCode && checkIn && checkOut && (
            <div className="mt-2 text-sm">
              Search parameters: {cityCode}, {checkIn} to {checkOut}
            </div>
          )}
        </div>
      );
    }
  
    if (showMap) {
      // Convert hotel data to format expected by Map component
      const mapPlaces = sortedHotels.map((hotel) => {
        const offer = hotel.offers?.[0] || {};
        const hotelData = hotel.hotel || {};
        
        return {
          id: hotelData.hotelId || `hotel-${Math.random().toString(36).substring(2, 11)}`,
          name: hotelData.name || 'Unknown Hotel',
          image: hotelData.media?.[0]?.uri || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
          rating: hotelData.rating || 0,
          reviews: hotelData.reviewCount || Math.floor(Math.random() * 100) + 10,
          price: offer.price?.total ? parseFloat(offer.price.total) : 0,
          location: hotelData.address?.cityName || '',
          latitude: parseFloat(hotelData.latitude || hotelData.geoCode?.latitude || 0),
          longitude: parseFloat(hotelData.longitude || hotelData.geoCode?.longitude || 0),
          amenities: hotelData.amenities || [],
        };
      });
  
      return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-96 md:h-full">
          <Map places={mapPlaces} />
        </div>
      );
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sortedHotels.map((hotel) => {
          const offer = hotel.offers?.[0] || {};
          const hotelData = hotel.hotel || {};
          
          // Convert hotel data to format expected by PlaceCard
          const placeData = {
            id: hotelData.hotelId || `hotel-${Math.random().toString(36).substring(2, 11)}`,
            name: hotelData.name || 'Unknown Hotel',
            image: hotelData.media?.[0]?.uri || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            rating: hotelData.rating || 0,
            reviews: hotelData.reviewCount || Math.floor(Math.random() * 100) + 10,
            price: offer.price?.total ? parseFloat(offer.price.total) : 0,
            location: hotelData.address?.cityName || '',
            amenities: hotelData.amenities || [],
          };
  
          return <PlaceCard key={placeData.id} place={placeData} />;
        })}
      </div>
    );
  };

  // Render filters based on search type
  const renderFilters = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <SlidersHorizontal size={20} className="mr-2" />
            Filters
          </h3>
          {/* Close button for mobile filters */}
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 p-2"
            onClick={() => setShowFilters(false)}
            aria-label="Close filters"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-2">Price Range</h4>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Conditional filters based on search type */}
          {searchType === 'hotels' ? (
            <>
              {/* Rating */}
              <div>
                <h4 className="font-medium mb-2">Rating</h4>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleFilterChange('rating', i + 1)}
                      className={`p-1 ${
                        i < filters.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-medium mb-2">Amenities</h4>
                <div className="space-y-2">
                  {['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'WiFi'].map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          const newAmenities = e.target.checked
                            ? [...filters.amenities, amenity]
                            : filters.amenities.filter((a) => a !== amenity);
                          handleFilterChange('amenities', newAmenities);
                        }}
                      />
                      <span className="ml-2">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Max Duration (for flights) */}
              <div>
                <h4 className="font-medium mb-2">Max Duration</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={filters.maxDuration}
                    onChange={(e) => handleFilterChange('maxDuration', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>1h</span>
                    <span>{filters.maxDuration}h</span>
                  </div>
                </div>
              </div>

              {/* Airlines */}
              <div>
                <h4 className="font-medium mb-2">Airlines</h4>
                <div className="space-y-2">
                  {['AA', 'UA', 'DL', 'BA', 'LH'].map((airline) => (
                    <label key={airline} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600"
                        checked={filters.airlines.includes(airline)}
                        onChange={(e) => {
                          const newAirlines = e.target.checked
                            ? [...filters.airlines, airline]
                            : filters.airlines.filter((a) => a !== airline);
                          handleFilterChange('airlines', newAirlines);
                        }}
                      />
                      <span className="ml-2">{airline}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Sort By */}
          <div>
            <h4 className="font-medium mb-2">Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="price">Price (Lowest first)</option>
              {searchType === 'hotels' ? (
                <option value="rating">Rating (Highest first)</option>
              ) : (
                <option value="duration">Duration (Shortest first)</option>
              )}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Search Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchType === 'hotels' ? location : `${location} to ${destination}`}
                  placeholder={searchType === 'hotels' ? 'Where are you staying?' : 'Where are you flying?'}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setSearchType('hotels')}
                className={`px-3 sm:px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center ${
                  searchType === 'hotels' ? 'bg-blue-50 border-blue-300 text-blue-600' : ''
                }`}
              >
                <Building size={18} className="mr-1 sm:mr-2" />
                <span className="text-sm sm:text-base">Hotels</span>
              </button>
              <button
                onClick={() => setSearchType('flights')}
                className={`px-3 sm:px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center ${
                  searchType === 'flights' ? 'bg-blue-50 border-blue-300 text-blue-600' : ''
                }`}
              >
                <Plane size={18} className="mr-1 sm:mr-2" />
                <span className="text-sm sm:text-base">Flights</span>
              </button>
              {searchType === 'hotels' && (
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="px-3 sm:px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                  {showMap ? 'Show List' : 'Show Map'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setShowFilters(true)} 
            className="w-full py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-center space-x-2"
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Main content layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden flex justify-end">
              <div className="w-80 h-full bg-gray-50 p-4 overflow-y-auto animate-slide-in">
                {renderFilters()}
              </div>
            </div>
          )}

          {/* Desktop Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            {renderFilters()}
          </div>

          {/* Results */}
          <div className="flex-1">
            {searchType === 'hotels' ? renderHotelResults() : renderFlightResults()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


