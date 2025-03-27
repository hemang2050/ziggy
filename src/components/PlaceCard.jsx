import React from 'react';
import { Star, MapPin, DollarSign } from 'lucide-react';

export const PlaceCard = ({ place }) => {
  // Safely get price with default value
  const getPrice = () => {
    if (place?.price == null) return 0;
    return typeof place.price === 'number' 
      ? place.price 
      : parseFloat(place.price) || 0;
  };

  // Safely get rating with default value
  const getRating = () => {
    if (place?.rating == null) return 0;
    return typeof place.rating === 'number' 
      ? place.rating 
      : parseFloat(place.rating) || 0;
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={`${index < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
        fill={index < Math.round(rating) ? '#f5c42f' : 'none'}
      />
    ));
  };

  // Safely get amenities with default empty array
  const getAmenities = () => {
    return place?.amenities || [];
  };

  // Generate amenities tags
  const renderAmenities = (amenities) => {
    const displayAmenities = amenities.slice(0, 3);
    return displayAmenities.map((amenity, index) => (
      <span 
        key={index} 
        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full mr-1 mb-1"
      >
        {amenity}
      </span>
    ));
  };

  // Safely get reviews with default value
  const getReviews = () => {
    if (place?.reviews == null) return 0;
    return typeof place.reviews === 'number' 
      ? place.reviews 
      : parseInt(place.reviews) || 0;
  };

  // Fallback image
  const getImage = () => {
    return place?.image || 'https://via.placeholder.com/400x300?text=Hotel+Image';
  };

  // Fallback name
  const getName = () => {
    return place?.name || 'Unnamed Hotel';
  };

  // Fallback location
  const getLocation = () => {
    return place?.location || 'Location Not Available';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl group">
      <div className="relative">
        <img 
          src={getImage()} 
          alt={getName()} 
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute top-3 right-3 bg-white/80 rounded-full px-3 py-1 flex items-center">
          <DollarSign size={16} className="text-green-600 mr-1" />
          <span className="font-semibold text-green-700">
            {getPrice().toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {getName()}
            </h3>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin size={16} className="mr-2 text-gray-400" />
              <span className="text-sm">{getLocation()}</span>
            </div>
          </div>
          
          <div className="flex">
            {renderStars(getRating())}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap">
            {renderAmenities(getAmenities())}
            {getAmenities().length > 3 && (
              <span className="text-xs text-gray-500 ml-2">
                +{getAmenities().length - 3} more
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            {getReviews()} reviews
          </div>
        </div>
        
        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};