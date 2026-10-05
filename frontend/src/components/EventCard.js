import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Music: '#ff6b6b',
      Conference: '#4ecdc4',
      Workshop: '#45b7d1',
      Sports: '#96ceb4',
      Art: '#f3a683',
      Food: '#f7d794'
    };
    return colors[category] || '#667eea';
  };

  return (
    <Link to={`/events/${event._id}`} className="event-card-link">
      <div className="colorful-event-card">
        <div className="card-image">
          <div className="card-overlay"></div>
          <div className="card-category" style={{ background: getCategoryColor(event.category) }}>
            {event.category}
          </div>
          <div className="card-price">${event.price}</div>
        </div>
        <div className="card-content">
          <h3 className="card-title">{event.title}</h3>
          <div className="card-location">
            <span className="icon">📍</span> {event.location}
          </div>
          <div className="card-date">
            <span className="icon">📅</span> {formatDate(event.date)} at {event.time}
          </div>
          <div className="card-seats">
            <div className="seats-bar">
              <div 
                className="seats-fill" 
                style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}
              ></div>
            </div>
            <span className="seats-text">{event.availableSeats} seats left</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;