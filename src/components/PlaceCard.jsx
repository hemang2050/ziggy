import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PlaceCard = ({ place, onDetailsClick }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    // Navigate to hotel details page
    navigate(`/hotel/${place.id}`, { 
      state: { 
        hotelData: {
          hotel: {
            hotelId: place.id,
            name: place.name,
            rating: place.rating,
            address: { cityName: place.location },
            media: [{ uri: place.image }],
            amenities: place.amenities
          },
          offers: [{
            price: { total: place.price }
          }]
        } 
      } 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={place.image} 
          alt={place.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/75 px-2 py-1 rounded-full text-sm font-medium">
          ${place.price ? Number(place.price).toFixed(2) : "N/A"}


        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{place.name}</h3>
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                fill={i < Math.round(place.rating) ? 'currentColor' : 'none'}
              />
            ))}
            <span className="text-gray-600 ml-1 text-sm">({place.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin size={16} className="mr-2" />
          <span className="text-sm">{place.location}</span>
        </div>
        
        {place.amenities && place.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {place.amenities.slice(0, 3).map((amenity) => (
              <span 
                key={amenity} 
                className="bg-gray-100 text-xs px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
        
        <button 
          onClick={handleDetailsClick}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};