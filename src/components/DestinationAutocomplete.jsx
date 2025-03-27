import React, { useState, useEffect, useRef } from 'react';
import { Map, Plane } from 'lucide-react';
import { searchLocations } from '../services/amadeus';

const DestinationAutocomplete = ({ value, onChange, placeholder, icon: Icon = Map, isOrigin = false }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Debounce the search to avoid too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue && inputValue.length >= 2) {
        fetchSuggestions(inputValue);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);
  
  const fetchSuggestions = async (query) => {
    if (query.length < 2) return;
    
    setIsLoading(true);
    try {
      const locations = await searchLocations(query);
      
      // Filter locations based on whether this is origin or destination input
      // For origin we might prefer airports, for destination cities
      const filteredLocations = isOrigin
        ? locations
        : locations;
      
      setSuggestions(filteredLocations);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    
    // Arrow Down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow Up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
    // Enter
    else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      selectDestination(suggestions[highlightedIndex]);
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const selectDestination = (location) => {
    setInputValue(location.displayName);
    setSelectedLocation(location);
    onChange(location); // Pass the full location object to parent
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <Icon className="text-gray-500 mr-3" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Enter a destination"}
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
        />
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((location, index) => (
            <div
              key={location.id}
              className={`p-3 cursor-pointer border-b border-gray-100 hover:bg-blue-50 ${
                index === highlightedIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => selectDestination(location)}
            >
              <div className="flex items-center">
                {location.subType === 'AIRPORT' ? (
                  <Plane size={16} className="mr-2 text-gray-500" />
                ) : (
                  <Map size={16} className="mr-2 text-gray-500" />
                )}
                <div>
                  <div className="font-medium">{location.name} {location.iataCode && `(${location.iataCode})`}</div>
                  <div className="text-xs text-gray-500">
                    {location.address?.cityName && location.address.cityName !== location.name 
                      ? `${location.address.cityName}, ` 
                      : ''}
                    {location.address?.countryName || ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationAutocomplete;