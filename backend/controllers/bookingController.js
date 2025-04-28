import Booking from '../models/Booking.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { price, accommodations, flights } = req.body;

    const booking = new Booking({
        user: req.user,
        // `protect` middleware puts user in req.user
      price,
      accommodations,
      flights,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all bookings for the logged-in user
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a booking by ID
export const deleteBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      if (booking.user.toString() !== req.user) {
        return res.status(401).json({ message: 'Not authorized to delete this booking' });
      }
  
      await booking.deleteOne(); // Delete booking
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
//
