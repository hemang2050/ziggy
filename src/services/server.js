import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';

// Middleware to get and cache the access token
let accessToken = null;
let tokenExpiry = 0;

async function getAmadeusToken() {
  const now = Date.now();
  
  // Return cached token if it's still valid
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: '3TQbQFHub9lQNPzTTpr4W4kem4wRoHqu',
        client_secret: 'F5J7dCCkpwbuPrzq'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    // Set expiry 5 minutes before actual expiry to be safe
    tokenExpiry = now + (response.data.expires_in * 1000) - 300000;
    
    return accessToken;
  } catch (error) {
    console.error('Token error:', error.response?.data || error.message);
    throw new Error('Failed to get Amadeus token');
  }
}

// Hotel search endpoint
app.get('/api/hotels', async (req, res) => {
  try {
    const token = await getAmadeusToken();
    
    // Validate required parameters
    if (!req.query.cityCode || !req.query.checkInDate || !req.query.checkOutDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // First get city coordinates
    const locationResponse = await axios.get(`${AMADEUS_BASE_URL}/v1/reference-data/locations`, {
      params: {
        subType: 'CITY',
        keyword: req.query.cityCode,
        'page[limit]': 1
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!locationResponse.data.data || locationResponse.data.data.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const city = locationResponse.data.data[0];
    const latitude = city.geoCode?.latitude;
    const longitude = city.geoCode?.longitude;

    if (!latitude || !longitude) {
      return res.status(404).json({ error: 'Could not determine city coordinates' });
    }

    // Then search hotels
    const hotelResponse = await axios.get(`${AMADEUS_BASE_URL}/v2/shopping/hotel-offers`, {
      params: {
        cityCode: req.query.cityCode,
        latitude,
        longitude,
        radius: 20,
        radiusUnit: 'KM',
        checkInDate: req.query.checkInDate,
        checkOutDate: req.query.checkOutDate,
        adults: req.query.adults || 1,
        roomQuantity: 1,
        paymentPolicy: 'NONE',
        includeClosed: false,
        bestRateOnly: true,
        view: 'FULL',
        sort: 'DISTANCE'
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    res.json(hotelResponse.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch hotels',
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
