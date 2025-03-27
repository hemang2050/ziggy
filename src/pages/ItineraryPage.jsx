import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const ItineraryPage = () => {
  const itinerary = [
    {
      place: 'Las Vegas',
      date: '2023-10-01',
      description: 'Explore the Strip.',
      flight: {
        airline: 'Delta Airlines',
        flightNumber: 'DL123',
        departure: '2023-09-30, 10:00 AM',
        arrival: '2023-09-30, 12:30 PM',
      },
      hotel: {
        name: 'The Venetian Resort',
        checkIn: '2023-10-01',
        checkOut: '2023-10-03',
        roomType: 'Luxury Suite',
      },
    },
    {
      place: 'Grand Canyon',
      date: '2023-10-02',
      description: 'Hike and enjoy the views.',
      flight: {
        airline: 'American Airlines',
        flightNumber: 'AA456',
        departure: '2023-10-02, 07:00 AM',
        arrival: '2023-10-02, 09:00 AM',
      },
      hotel: {
        name: 'Grand Canyon Lodge',
        checkIn: '2023-10-02',
        checkOut: '2023-10-04',
        roomType: 'Standard Room',
      },
    },
  ];

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your Itinerary</h2>

          {itinerary.length === 0 ? (
            <p className="text-gray-600">No itinerary available. Please add your travel details.</p>
          ) : (
            <div className="space-y-6">
              {itinerary.map((item, index) => (
                <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-semibold text-blue-600">{item.place}</h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                  <p className="mt-2 text-gray-700">{item.description}</p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Flight Details</h4>
                      <p className="text-gray-700">Airline: {item.flight.airline}</p>
                      <p className="text-gray-700">Flight No: {item.flight.flightNumber}</p>
                      <p className="text-gray-700">Departure: {item.flight.departure}</p>
                      <p className="text-gray-700">Arrival: {item.flight.arrival}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800">Hotel Details</h4>
                      <p className="text-gray-700">Hotel: {item.hotel.name}</p>
                      <p className="text-gray-700">Check-in: {item.hotel.checkIn}</p>
                      <p className="text-gray-700">Check-out: {item.hotel.checkOut}</p>
                      <p className="text-gray-700">Room Type: {item.hotel.roomType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};
