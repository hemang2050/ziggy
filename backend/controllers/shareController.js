export const shareItinerary = async (req, res) => {
    try {
      const { email, itineraryId } = req.body;
  
      // Normally you'd send an actual email.
      // For now just simulate.
      console.log(`Sharing itinerary ${itineraryId} with ${email}`);
  
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sharing itinerary:', error);
      res.status(500).json({ message: 'Failed to share itinerary' });
    }
  };
  