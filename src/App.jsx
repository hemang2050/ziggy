import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { ItineraryPage } from './pages/ItineraryPage';
import { BookingPage } from './pages/BookingPage';
import { Profile } from './pages/Profile';
import { HotelDetail } from './pages/HotelDetail';
import { Checkout } from './pages/Checkout'; // Added CheckoutPage route
// import { FlightDetail } from './pages/FlightDetail'; // Added FlightDetail route
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ConfirmationPage } from './pages/Confirmation';
import { ConfirmEmail } from './pages/ConfirmEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { useState } from 'react';
import './App.css';

const App = () => {
  const [bookings, setBookings] = useState([]);
  console.log("Home Page");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        {/* <Route path="/flight/:id" element={<FlightDetail />} /> Added Flight Detail route */}
        <Route path="/itineraries" element={<ItineraryPage bookings={bookings} />} />
        <Route path="/bookings" element={<BookingPage bookings={bookings} setBookings={setBookings} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout bookings={bookings} setBookings={setBookings} />} />
        <Route path="/confirmation" element={<ConfirmationPage bookings={bookings} />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        import { ConfirmEmail } from './pages/ConfirmEmail';

<Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
