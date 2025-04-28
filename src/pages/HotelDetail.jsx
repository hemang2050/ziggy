import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowLeft } from 'lucide-react';
import { mockHotels, additionalImages } from '../hotelData';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get the search parameters
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '1';
  const location = searchParams.get('location') || '';
  const rooms = parseInt(searchParams.get('rooms')) || 1; // Get rooms from search params
  
  const [hotel, setHotel] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the hotel in mockHotels using the ID
    const foundHotel = mockHotels.find(h => h.hotel.hotelId === id);
    
    if (foundHotel) {
      setHotel(foundHotel);
    }
    
    setLoading(false);
  }, [id]);

  const nextImage = () => {
    if (additionalImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % additionalImages.length);
    }
  };
  
  const prevImage = () => {
    if (additionalImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + additionalImages.length) % additionalImages.length);
    }
  };

  const handleBookNow = () => {
    // Navigate to checkout with all necessary data in URL parameters
    navigate(`/checkout?hotelId=${id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&rooms=${rooms}&location=${encodeURIComponent(location)}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Hotel Not Found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft size={20} className="mr-2" />
          Go Back to Search
        </button>
      </div>
    );
  }

  const hotelData = hotel.hotel || {};
  const offer = hotel.offers?.[0] || {};
  const pricePerNight = offer.price?.total ? parseFloat(offer.price.total) : 0;
  
  // Calculate number of nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  
  const nights = calculateNights();
  
  // Calculate the total price for all rooms and nights
  const totalRoomPrice = pricePerNight * nights * rooms;
  const cleaningFee = 50.00 * rooms; // Applying cleaning fee per room
  const serviceFee = 35.00 * rooms; // Applying service fee per room
  const totalPrice = totalRoomPrice + cleaningFee + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Search Results
        </button>

        {/* Hotel name and rating */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{hotelData.name}</h1>
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, index) => (
                <Star 
                  key={index} 
                  size={18} 
                  fill={index < hotelData.rating ? "currentColor" : "none"}
                  stroke={index < hotelData.rating ? "currentColor" : "currentColor"} 
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">{hotelData.rating} stars</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{hotelData.address?.cityName || location}</span>
          </div>
        </div>

        {/* Image gallery */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-96">
            <img 
              src={hotelData.media?.[0]?.uri || additionalImages[currentImageIndex] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
              alt={hotelData.name} 
              className="w-full h-full object-cover"
            />
            
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Thumbnail images - optional enhancement */}
          {/* <div className="flex p-2 overflow-x-auto">
            {additionalImages.slice(0, 5).map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-24 h-16 flex-shrink-0 mx-1 cursor-pointer rounded-md overflow-hidden ${
                  currentImageIndex === idx ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img src={img} alt={`${hotelData.name} view ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div> */}
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hotel details */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">About this hotel</h2>
              <p className="text-gray-700 mb-4">
                {hotelData.description || 
                  `Experience luxury and comfort at ${hotelData.name}, perfectly located in the heart of ${hotelData.address?.cityName || location}. 
                  Our hotel offers modern amenities, spacious rooms, and exceptional service to make your stay memorable.`}
              </p>
              
              {/* Amenities */}
              {hotelData.amenities && hotelData.amenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {hotelData.amenities.slice(0, 8).map((amenity, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="mr-2">•</span> {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

           
          </div>
          
          {/* Booking panel */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold text-green-600">${pricePerNight.toFixed(2)}</span>
                  <span className="text-gray-500"> / night{rooms > 1 ? ' / room' : ''}</span>
                </div>
                <div className="flex items-center text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="ml-1 text-gray-700">{hotelData.rating}</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Check-in</div>
                    <div className="font-medium">{checkIn || 'Select date'}</div>
                  </div>
                  <div className="border-l pl-4">
                    <div className="text-sm text-gray-500">Check-out</div>
                    <div className="font-medium">{checkOut || 'Select date'}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Guests</div>
                    <div className="font-medium">{guests} guests</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Rooms</div>
                    <div className="font-medium">{rooms} {rooms === 1 ? 'room' : 'rooms'}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>${pricePerNight.toFixed(2)} × {nights} nights × {rooms} {rooms === 1 ? 'room' : 'rooms'}</span>
                  <span>${totalRoomPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Cleaning fee {rooms > 1 ? `(${rooms} rooms)` : ''}</span>
                  <span>${cleaningFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Service fee {rooms > 1 ? `(${rooms} rooms)` : ''}</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleBookNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HotelDetail;