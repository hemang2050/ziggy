import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Wifi, 
  Utensils, 
  Dumbbell, 
  Bath, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import { mockReviews, additionalImages } from '../hotelData';

export const HotelDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    amenities: false,
    rooms: false,
    reviews: false
  });

  // Mock additional images and reviews
  

  useEffect(() => {
    // Check if hotel data was passed through navigation state
    if (location.state && location.state.hotelData) {
      setHotel(location.state.hotelData);
      setLoading(false);
    } else {
      // If no data passed, you might want to fetch hotel details by ID
      console.log('Fetching hotel details for ID:', id);
      // Placeholder for actual API call
      setLoading(false);
    }
  }, [location.state, id]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === additionalImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? additionalImages.length - 1 : prev - 1
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!hotel) {
    return <div className="text-center py-12">Hotel not found</div>;
  }

  // Combine hotel images with fallback images
  const images = hotel.hotel.media && hotel.hotel.media.length > 0 
    ? hotel.hotel.media.map(media => media.uri)
    : additionalImages;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 bg-white/75 rounded-full p-2 hover:bg-white"
      >
        <ArrowLeft />
      </button>

      {/* Image Gallery */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={images[currentImageIndex]} 
          alt={`${hotel.hotel.name} - Image ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={prevImage} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/75 rounded-full p-2 hover:bg-white"
        >
          <ChevronLeft />
        </button>
        <button 
          onClick={nextImage} 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/75 rounded-full p-2 hover:bg-white"
        >
          <ChevronRight />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Hotel Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{hotel.hotel.name}</h1>
            <div className="flex items-center mt-2 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={20} 
                  fill={i < Math.round(hotel.hotel.rating) ? 'currentColor' : 'none'}
                />
              ))}
              <span className="text-gray-600 ml-2">
                {hotel.hotel.rating.toFixed(1)} ({mockReviews.length} reviews)
              </span>
            </div>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin size={18} className="mr-2" />
              {hotel.hotel.address.cityName}
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${hotel.offers[0].price.total}/night
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="p-6 space-y-6">
        {/* Description Section */}
        <div className="border-b pb-6">
          <button 
            onClick={() => toggleSection('description')} 
            className="w-full flex justify-between items-center"
          >
            <h2 className="text-xl font-semibold">Description</h2>
            {expandedSections.description ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSections.description && (
            <p className="mt-4 text-gray-600">
              {hotel.hotel.name} offers a luxurious stay in the heart of {hotel.hotel.address.cityName}. 
              Combining modern comfort with exceptional service, our hotel provides an unforgettable 
              experience for both leisure and business travelers. With state-of-the-art amenities and 
              a prime location, we ensure your stay is both comfortable and memorable.
            </p>
          )}
        </div>

        {/* Amenities Section */}
        <div className="border-b pb-6">
          <button 
            onClick={() => toggleSection('amenities')} 
            className="w-full flex justify-between items-center"
          >
            <h2 className="text-xl font-semibold">Amenities</h2>
            {expandedSections.amenities ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSections.amenities && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {hotel.hotel.amenities.map((amenity) => {
                const amenityIcons = {
                  'WiFi': <Wifi className="text-blue-500" />,
                  'Restaurant': <Utensils className="text-green-500" />,
                  'Gym': <Dumbbell className="text-red-500" />,
                  'Spa': <Bath className="text-purple-500" />
                };
                return (
                  <div key={amenity} className="flex items-center space-x-2">
                    {amenityIcons[amenity] || <span className="w-5 h-5 bg-gray-200 rounded-full" />}
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div>
          <button 
            onClick={() => toggleSection('reviews')} 
            className="w-full flex justify-between items-center"
          >
            <h2 className="text-xl font-semibold">Guest Reviews</h2>
            {expandedSections.reviews ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSections.reviews && (
            <div className="mt-4 space-y-4">
              {mockReviews.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <h3 className="font-medium mr-2">{review.name}</h3>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{review.text}</p>
                  {review.pros && (
                    <div className="flex flex-wrap gap-2">
                      {review.pros.map((pro) => (
                        <span 
                          key={pro} 
                          className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded"
                        >
                          {pro}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Book Now Button */}
      <div className="p-6 bg-gray-50 border-t">
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Book Now - ${hotel.offers[0].price.total}/night
        </button>
      </div>
    </div>
  );
};
