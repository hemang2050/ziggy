import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo Section - Keeping this on the left */}
          <div className="flex-shrink-0 mr-auto">
            <Link to="/" className="text-white font-bold text-xl md:text-2xl flex items-center space-x-2 hover:text-yellow-200 transition duration-300">
              <svg className="h-6 w-6 text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9-9 9-9-9z" />
              </svg>
              <span>Ziggy</span>
            </Link>
          </div>

          {/* Desktop Navigation Links - Moving to the right */}
          <div className="hidden sm:flex items-center justify-end space-x-6 md:space-x-8 lg:space-x-10 ml-8 md:ml-16">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 px-1 py-2 rounded-md transition duration-300 text-base lg:text-lg font-medium"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="text-white hover:text-yellow-300 px-1 py-2 rounded-md transition duration-300 text-base lg:text-lg font-medium"
            >
              Explore
            </Link>
            <Link
              to="/itinerary"
              className="text-white hover:text-yellow-300 px-1 py-2 rounded-md transition duration-300 text-base lg:text-lg font-medium"
            >
              Itinerary
            </Link>
          </div>

          {/* User Section - Moving slightly to the right */}
          <div className="hidden sm:flex items-center space-x-3 md:space-x-4 ml-8 md:ml-16 ">
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-blue-600 hover:cursor-pointer"
              >
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-5 w-5 md:h-6 md:w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/bookings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Bookings
                  </Link>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add sign out logic here
                    }}
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
            <Link
              to="/login"
              className="text-white bg-yellow-500 hover:bg-yellow-600 py-2 px-4 rounded-md text-sm md:text-base font-medium transition duration-300 shadow-sm"
            >
              Sign in
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="sm:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-blue-600 p-2 rounded-md"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-6 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/explore"
            className="block px-6 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Explore
          </Link>
          <Link
            to="/itinerary"
            className="block px-6 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Itinerary
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 ">
          <div className="flex items-center px-6">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ">
                <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">Guest User</div>
              <div className="text-sm font-medium text-gray-500">guest@example.com</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              to="/profile"
              className="block px-6 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Your Profile
            </Link>
            <Link
              to="/bookings"
              className="block px-6 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Your Bookings
            </Link>
            <a
              href="#"
              className="block px-6 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                // Add sign out logic here
              }}
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
