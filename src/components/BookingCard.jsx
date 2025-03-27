import React from 'react';

export const BookingCard = ({ booking }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">{booking.type}</h3>
      <p className="text-gray-600">{booking.details}</p>
      <p className="text-gray-600">{booking.date}</p>
      <button className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        View Details
      </button>
    </div>
  );
};
