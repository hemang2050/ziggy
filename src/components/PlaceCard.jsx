import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Heart, Calendar } from 'lucide-react';

export const PlaceCard = ({ place }) => {
  const [searchParams] = useSearchParams();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Get the current search parameters to pass them along
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '1';
  const location = searchParams.get('location') || '';
  const rooms = searchParams.get('rooms') || '1';
  
  // Format price safely, handling cases where price might be a string or undefined
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return typeof numPrice === 'number' && !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  // Handle favorite button click without navigating
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full flex flex-col">
        <div className="relative">
          <img
            src={place.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
            alt={place.name}
            className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full shadow hover:shadow-md hover:bg-opacity-100 transition-all focus:outline-none z-10"
          >
            <Heart 
              size={18} 
              className={`${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-400'} transition-colors`} 
            />
          </button>
          
          {place.rating && (
            <div className="absolute top-3 left-3 flex items-center bg-white bg-opacity-90 backdrop-blur-sm rounded-full py-1 px-3 shadow">
              <Star size={14} className="text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium">{typeof place.rating === 'number' ? place.rating.toFixed(1) : place.rating}</span>
            </div>
          )}
          
          {/* Property type badge */}
          {place.type && (
            <div className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs font-medium py-1 px-2 rounded">
              {place.type}
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-3">
            <h3 className="font-bold text-gray-800 text-lg truncate">{place.name}</h3>
            
          </div>
          
          {/* Amenities preview */}
          {place.amenities && place.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {place.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
                {place.amenities.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    +{place.amenities.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-auto">
            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
              <div>
                <span className="font-bold text-lg text-gray-800">${formatPrice(place.price)}</span>
                <span className="text-gray-500 text-sm ml-1">/ night{parseInt(rooms) > 1 ? ' / room' : ''}</span>
              </div>
              
              <Link 
                to={`/hotel/${place.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&rooms=${rooms}&location=${encodeURIComponent(location)}`}
                className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow transform ${isHovered ? 'scale-105' : ''}`}
              >
                <Calendar size={16} className="mr-1" />
                Book now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;