import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Home} from './pages/Home';
import {SearchResults} from './pages/SearchResults';
import {ItineraryPage} from './pages/ItineraryPage';
import {BookingPage} from './pages/BookingPage';
import {Profile} from './pages/Profile';
import './App.css';

const App = () => {
  console.log("Home Page");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/results" element={<SearchResults />} />
      </Routes>
    </Router>
  );
};

export default App;