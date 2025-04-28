import mongoose from 'mongoose';

const accommodationSchema = new mongoose.Schema({
    accommodationAddress: { type: String, required: true },
    accommodationStartDate: { type: String, required: true },
    accommodationEndDate: { type: String, required: true },
    accommodationHostName: { type: String, required: true },
    accommodationType: { type: String, required: true },
    accommodationPrice: { type: Number, required: true },
    accommodationCity: { type: String, required: true },
    accommodationLatitude: { type: Number },  // newly added
    accommodationLongitude: { type: Number }, // newly added
  });
  

const flightSchema = new mongoose.Schema({
  holderName: { type: String, required: true },
  flightNumber: { type: String, required: true },
  flightBrand: { type: String, required: true },
  flightClass: { type: String, default: 'Economy' },
  planeType: { type: String, default: 'Unknown' },
  departAirport: { type: String, required: true },
  departTime: { type: String, required: true },
  fromDestination: { type: String, required: true },
  arriveAirport: { type: String, required: true },
  arriveTime: { type: String, required: true },
  toDestination: { type: String, required: true },
  gateNumber: { type: String, default: 'TBD' },
  seatNumber: { type: String, default: 'TBD' },
  flightPrice: { type: Number, required: true },
});

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    accommodations: [accommodationSchema],
    flights: [flightSchema],
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
