import transporter from '../config/emailConfig.js';


export const shareItinerary = async (req, res) => {
    try {
      const { email, itinerary } = req.body;

      console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Exists ✅' : 'Missing ❌');
  
      if (!itinerary || itinerary.length === 0) {
        return res.status(400).json({ message: 'No itinerary provided' });
      }
  
      // Build email content for multiple trips
      const htmlContent = itinerary.map(trip => `
        <h2>${trip.city}</h2>
        <p><strong>Dates:</strong> ${trip.startDate} - ${trip.endDate}</p>
        <p><strong>Bookings:</strong></p>
        <ul>
          ${trip.bookings.map(booking => `
            <li>
              <strong>${booking.type}:</strong> ${booking.name} <br/>
              <strong>Details:</strong> ${booking.location}
            </li>
          `).join('')}
        </ul>
        <hr/>
      `).join(''); // join all trips
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Travel Itinerary`,
        html: `
          <div>
            <h1>Shared Itineraries</h1>
            ${htmlContent}
          </div>
        `
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Itinerary shared successfully via email!' });
    } catch (error) {
      console.error('Error sharing itinerary:', error);
      res.status(500).json({ message: 'Failed to share itinerary' });
    }
  };