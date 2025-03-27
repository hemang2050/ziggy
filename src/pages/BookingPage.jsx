import React from 'react';
import {Header} from '../components/Header';
import {BookingCard} from '../components/BookingCard';
import {Footer} from '../components/Footer';

export const BookingPage = () => {
  const bookings = [
    { type: 'Flight', details: 'Las Vegas to New York', date: '2023-10-01' },
    { type: 'Hotel', details: 'Luxury Suite at Bellagio', date: '2023-10-01' },
  ];

  return (
    <div>
      <Header />
      <main className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <BookingCard key={index} booking={booking} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

