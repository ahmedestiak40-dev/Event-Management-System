import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="colorful-navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">✨ EventHub</span>
          <span className="logo-dot">🎪</span>
        </Link>
        
        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/events" className="nav-link">🎟️ Events</Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'organizer' && (
                <Link to="/create-event" className="nav-link">✨ Create Event</Link>
              )}
              <Link to="/my-bookings" className="nav-link">📋 My Bookings</Link>
              <div className="nav-dropdown">
                <button className="nav-user-btn">
                  🌟 Hello, {user?.name}
                </button>
                <div className="dropdown-content">
                  <button onClick={handleLogout} className="dropdown-item">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">🔑 Login</Link>
              <Link to="/register" className="nav-btn-primary">✨ Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;