import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../components/EventCard';
import './HomePage.css';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setFeaturedEvents(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title fade-in-up">
            Discover Amazing <span className="gradient-text">Events</span>
          </h1>
          <p className="hero-subtitle">
            Find and book tickets for the best events in your city. 
            From concerts to conferences, we've got you covered.
          </p>
          <div className="hero-buttons">
            <Link to="/events" className="hero-btn-primary">Explore Events →</Link>
            <Link to="/register" className="hero-btn-secondary">Join Now →</Link>
          </div>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Why Choose <span className="gradient-text">EventHub?</span></h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎟️</div>
            <h3>Easy Booking</h3>
            <p>Book tickets in minutes with our simple checkout process</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>Your payments are safe and secure with Stripe integration</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Access your tickets anytime, anywhere on any device</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Best Prices</h3>
            <p>Get the best deals and early bird discounts</p>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      <div className="featured-events">
        <h2 className="section-title">Featured <span className="gradient-text">Events</span></h2>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="events-grid">
            {featuredEvents.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;