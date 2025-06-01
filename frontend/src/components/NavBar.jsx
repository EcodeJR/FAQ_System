import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => {
    return location.pathname === path;
  };

return (
    <nav className="p-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div>
            <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-black'>FAQ's</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <Link 
              to="/" 
              className={`transition-colors ${
                isActive('/') 
                  ? 'text-green-600 font-medium' 
                  : 'hover:text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/chat" 
              className={`transition-colors ${
                isActive('/chat') 
                  ? 'text-green-600 font-medium' 
                  : 'hover:text-gray-600'
              }`}
            >
              Chat
            </Link>
            <Link 
              to="/courses" 
              className={`transition-colors ${
                isActive('/courses') 
                  ? 'text-green-600 font-medium' 
                  : 'hover:text-gray-600'
              }`}
            >
              Courses
            </Link>
            <Link 
              to="/faqs" 
              className={`transition-colors ${
                isActive('/faqs') 
                  ? 'text-green-600 font-medium' 
                  : 'hover:text-gray-600'
              }`}
            >
              FAQs
            </Link>
            {user?.role === 'admin' && (
              <Link 
              to="/admin" 
              className={`transition-colors ${
                isActive('/admin') 
                  ? 'text-green-600 font-medium' 
                  : 'hover:text-gray-600'
              }`}
            >
              Admin Panel
            </Link>
            )}
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex space-x-4">
            {!user ? (
              <>
                <Link to="/signup" className="hover:text-gray-600">Sign Up</Link>
                <Link to="/login" className="hover:text-gray-600">Login</Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-semibold">
                Hello 👋, {user?.username}
              </span>
            
                <button 
                  onClick={logout} 
                  className="text-red-600 font-bold hover:text-red-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link 
                to="/" 
                className={`block py-2 px-4 rounded transition-colors ${
                  isActive('/') 
                    ? 'bg-green-50 text-green-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={toggleMenu}
              >
                Home
              </Link>
            <Link 
                to="/chat" 
                className={`block py-2 px-4 rounded transition-colors ${
                  isActive('/chat') 
                    ? 'bg-green-50 text-green-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={toggleMenu}
              >
                Chat
              </Link>
            <Link 
                to="/courses" 
                className={`block py-2 px-4 rounded transition-colors ${
                  isActive('/courses') 
                    ? 'bg-green-50 text-green-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={toggleMenu}
              >
                Courses
              </Link>
            <Link 
                to="/faqs" 
                className={`block py-2 px-4 rounded transition-colors ${
                  isActive('/faqs') 
                    ? 'bg-green-50 text-green-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={toggleMenu}
              >
                FAQs
              </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`block py-2 px-4 rounded transition-colors ${
                  isActive('/admin') 
                    ? 'bg-green-50 text-green-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={toggleMenu}
              >
                Admin Panel
              </Link>
            )}
            {!user ? (
              <>
                <Link 
                  to="/signup" 
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-around space-x-2 w-full">
                <span className="text-gray-700 font-semibold">
                  Hello 👋, {user?.username}
                </span>
            
                <button 
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="text-left py-2 px-4 text-red-600 hover:bg-gray-200 rounded font-bold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}






