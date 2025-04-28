export const saveTripRating = async (req, res) => {
    try {
      const { tripId } = req.params;
      const { rating } = req.body;
  
      // Normally, you'd update the database here.
      // For now, just log to console for demo.
      console.log(`Saving rating ${rating} for trip ${tripId}`);
  
      res.status(200).json({ message: 'Rating saved successfully!' });
    } catch (error) {
      console.error('Error saving trip rating:', error);
      res.status(500).json({ message: 'Failed to save rating' });
    }
  };
  