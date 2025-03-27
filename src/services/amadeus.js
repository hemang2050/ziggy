// src/services/amadeus.js
import { mockHotels } from "../hotelData";

// WARNING: In a production application, you should NEVER store API credentials in client-side code
// These should be stored securely on a backend server
const CLIENT_ID = '3TQbQFHub9lQNPzTTpr4W4kem4wRoHqu';
const CLIENT_SECRET = 'F5J7dCCkpwbuPrzq';
const BASE_URL = 'https://test.api.amadeus.com'; // Use 'https://api.amadeus.com' for production

// Cache for the access token to avoid requesting a new token for every API call
let tokenCache = {
  token: null,
  expiresAt: 0
};

// Function to get the access token with caching
const getAmadeusToken = async () => {
  // Check if we have a valid cached token
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the token
    tokenCache = {
      token: data.access_token,
      // Convert expires_in (seconds) to milliseconds and subtract a minute for safety
      expiresAt: now + (data.expires_in * 1000) - 60000
    };
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting Amadeus token:', error);
    throw error;
  }
};

// Helper function to make authenticated API requests
const callAmadeusApi = async (endpoint, params = {}) => {
    try {
      const token = await getAmadeusToken();
      
      // Create URLSearchParams correctly
      const queryParams = new URLSearchParams();
      
      // Handle nested parameters (like page[limit])
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'object') {
            // Handle nested objects (like page: {limit: 1})
            for (const [subKey, subValue] of Object.entries(value)) {
              queryParams.append(`${key}[${subKey}]`, subValue);
            }
          } else {
            queryParams.append(key, value);
          }
        }
      }
      
      const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`Amadeus API error (${response.status}): ${JSON.stringify(responseData)}`);
      }
      
      return responseData;
    } catch (error) {
      console.error(`Error calling Amadeus API at ${endpoint}:`, error);
      throw error;
    }
  };

// Function to search for locations (cities, airports)
export const searchLocations = async (keyword) => {
  if (!keyword || keyword.trim().length < 2) {
    return [];
  }
  
  // Process the keyword to ensure it meets Amadeus API requirements
  let processedKeyword = keyword;
  
  // If the keyword contains an IATA code in parentheses, extract it
  const iataCodeMatch = keyword.match(/\(([A-Z]{3})\)/);
  if (iataCodeMatch) {
    // Use the 3-letter IATA code directly
    processedKeyword = iataCodeMatch[1];
  } else {
    // Otherwise, simplify the keyword
    // Remove any parentheses, commas, and limit length
    processedKeyword = keyword
      .replace(/\([^)]*\)/g, '')  // Remove anything in parentheses
      .replace(/,/g, '')          // Remove commas
      .trim();
      
    // Limit to first three characters if still too long
    if (processedKeyword.length > 10) {
      processedKeyword = processedKeyword.substring(0, 3);
    }
  }
  
  try {
    const result = await callAmadeusApi('/v1/reference-data/locations', {
      keyword: processedKeyword,
      'subType': 'CITY,AIRPORT',
      'page[limit]': 10
    });
    
    return result.data.map(location => ({
      id: location.id,
      name: location.name,
      iataCode: location.iataCode,
      subType: location.subType,
      address: {
        cityName: location.address?.cityName,
        countryName: location.address?.countryName
      },
      displayName: `${location.name}${location.iataCode ? ` (${location.iataCode})` : ''}, ${location.address?.countryName || ''}`
    }));
  } catch (error) {
    console.error('Error fetching locations from Amadeus:', error);
    throw error; // Propagate the error so it can be handled by the component
  }
};

// Function to get detailed information about a city
export const getCityInfo = async (cityCode) => {
  if (!cityCode) return null;
  
  try {
    const result = await callAmadeusApi(`/v1/reference-data/locations/pois`, {
      cityCode
    });
    
    return result.data;
  } catch (error) {
    console.error('Error fetching city info from Amadeus:', error);
    throw error;
  }
};

// Function to search for hotels in a city
export const searchHotels = async (cityCode, checkInDate, checkOutDate) => {
    console.log('Using mock hotel data for development');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data with some randomization
    return {
      data: mockHotels.map(hotel => ({
        ...hotel,
        offers: [{
          price: {
            ...hotel.offers[0].price,
            total: (parseFloat(hotel.offers[0].price.total) * (0.9 + Math.random() * 0.2)).toFixed(2)
          }
        }]
      }))
    };
  };

// Function to search for flights
export const searchFlights = async (originCode, destinationCode, departureDate, returnDate, adults = 1) => {
  // Validate required parameters
  if (!originCode || !destinationCode || !departureDate) {
    throw new Error('Missing required parameters for flight search');
  }
  
  // Extract IATA codes if full location strings are provided
  const getIATACode = (input) => {
    if (!input) return '';
    // If input is already a 3-letter code
    if (/^[A-Z]{3}$/.test(input)) return input;
    // Try to extract code from string like "City Name (ABC)"
    const match = input.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : input;
  };
  
  const originIATA = getIATACode(originCode);
  const destinationIATA = getIATACode(destinationCode);
  
  // Build parameters object
  const params = {
    originLocationCode: originIATA,
    destinationLocationCode: destinationIATA,
    departureDate,
    adults,
    max: 10
  };
  
  // Only add returnDate if it has a value to prevent API errors
  if (returnDate && returnDate.trim() !== '') {
    params.returnDate = returnDate;
  }
  
  try {
    const result = await callAmadeusApi('/v2/shopping/flight-offers', params);
    return result.data;
  } catch (error) {
    console.error('Error fetching flights from Amadeus:', error);
    throw error;
  }
};

export default {
  searchLocations,
  getCityInfo,
  searchHotels,
  searchFlights
};