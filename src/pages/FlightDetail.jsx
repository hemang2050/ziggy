// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { Plane } from 'lucide-react';
// import { searchFlights } from '../services/amadeus';

// export const FlightDetail = () => {
//   const [searchParams] = useSearchParams();
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedFlight, setSelectedFlight] = useState(null);

//   const originCode = searchParams.get('originCode') || '';
//   const destinationCode = searchParams.get('destinationCode') || '';
//   const departureDate = searchParams.get('departureDate') || '';

//   useEffect(() => {
//     const fetchResults = async () => {
//       setLoading(true);
//       try {
//         const flightsData = await searchFlights(originCode, destinationCode, departureDate);
//         setResults(flightsData || []);
//       } catch (err) {
//         console.error('Error fetching flights:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchResults();
//   }, [originCode, destinationCode, departureDate]);

//   const handleSelectFlight = (flight) => {
//     setSelectedFlight(flight);
//   };

//   const handleConfirmBooking = () => {
//     // Simulate the booking process (replace with actual API request)
//     console.log('Booking confirmed:', selectedFlight);
//     // For now, store the selected flight in local state or context
//     localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>Flight Results</h2>
//       {results.map((flight, index) => (
//         <div key={index}>
//           <div>
//             <Plane size={24} />
//             <div>{flight?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode} → {flight?.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode}</div>
//             <div>${flight?.price?.total || '0.00'}</div>
//             <button onClick={() => handleSelectFlight(flight)}>Select this flight</button>
//           </div>
//         </div>
//       ))}

//       {selectedFlight && (
//         <div>
//           <h3>Selected Flight:</h3>
//           <div>{selectedFlight?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode} → {selectedFlight?.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode}</div>
//           <div>Price: ${selectedFlight?.price?.total || '0.00'}</div>
//           <button onClick={handleConfirmBooking}>Confirm Booking</button>
//         </div>
//       )}
//     </div>
//   );
// };
