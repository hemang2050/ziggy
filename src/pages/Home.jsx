import React from 'react';
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import { SearchBar } from '../components/SearchBar';
import { PlaceCard } from '../components/PlaceCard';
import homebg from '../assets/homebg.jpg'; // Importing the background image
import { Promotions } from '../components/Promotions';
import { featuredDestinations, deals, travelIdeas } from '../hotelData'; // Import the mock data

export const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Hero Section with Background Image */}
        <div
          className="relative py-24 min-h-[500px] bg-cover bg-center flex items-center" 
          style={{ backgroundImage: `url(${homebg})` }}
        >
          {/* Darker overlay for better text readability */}
          <div className="absolute inset-0  bg-opacity-60"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Find Deals on Hotels, Homes, and More</h1>
              <p className="text-xl text-white drop-shadow-lg">From cozy country homes to funky city apartments</p>
            </div>
            
            {/* Search Container - Wider and centered */}
            <div className="max-w-4xl mx-auto bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
              <SearchBar />
            </div>
          </div>
        </div>

        <Promotions />

        {/* Featured Destinations */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Destinations</h2>
            <a 
              href="#" 
              className="text-blue-600 hover:underline cursor-pointer"
            >View all</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination, index) => (
              <PlaceCard 
                key={index} 
                place={destination} 
                className="cursor-pointer hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>

        {/* Deals and Offers with Blue Background */}
        <div className="bg-blue-50 py-12 ">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Deals and Offers</h2>
              <a 
                href="#" 
                className="text-blue-600 hover:underline cursor-pointer"
              >View all deals</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer ">
  {deals.map((deal, index) => (
    <PlaceCard 
      key={index} 
      place={{ 
        name: deal.title, 
        image: deal.image, 
        description: deal.description,
        price: deal.newPrice  // <-- Pass the newPrice here!
      }}
      className="hover:scale-105 transition-transform"
    />
  ))}
</div>

          </div>
        </div>

        {/* Travel Ideas Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Travel Ideas</h2>
            <a 
              href="#" 
              className="text-blue-600 hover:underline cursor-pointer"
            >More inspiration</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelIdeas.map((idea, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              >
                <img 
                  src={idea.image} 
                  alt={idea.title} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{idea.title}</h3>
                  <p className="text-gray-600 mb-4">{idea.description}</p>
                  <a 
                    href={idea.readMoreLink} 
                    className="text-blue-600 hover:underline cursor-pointer"
                  >Read more</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Plan your perfect trip in just a few easy steps.
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Each step now has a hover effect and cursor change */}
                <div className="text-center cursor-pointer hover:bg-blue-50 p-4 rounded-lg transition-colors">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7 7 7-7" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">Search for your destination</h3>
                  <p className="mt-2 text-base text-gray-500">Find the perfect place for your next trip.</p>
                </div>

                <div className="text-center cursor-pointer hover:bg-blue-50 p-4 rounded-lg transition-colors">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7 7 7-7" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">Select your travel dates</h3>
                  <p className="mt-2 text-base text-gray-500">Choose the best time for your vacation.</p>
                </div>

                <div className="text-center cursor-pointer hover:bg-blue-50 p-4 rounded-lg transition-colors">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7 7 7-7" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">Book and pack</h3>
                  <p className="mt-2 text-base text-gray-500">Reserve your spot and get ready for an adventure!</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};