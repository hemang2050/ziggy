import React from 'react';

export const Itinerary = ({ itinerary }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Itinerary</h2>
      {itinerary.map((item, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{item.place}</h3>
          <p className="text-gray-600">{item.date}</p>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

