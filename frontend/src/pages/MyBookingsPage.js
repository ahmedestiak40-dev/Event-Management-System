import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
        fetchBookings();
        alert('Booking cancelled successfully');
      } catch (error) {
        alert('Error cancelling booking: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading your bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Bookings Yet</h2>
        <p className="text-gray-600">You haven't made any bookings yet. Start exploring events!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{booking.event.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div className="text-gray-600">
                    📅 {new Date(booking.event.date).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600">
                    ⏰ {booking.event.time}
                  </div>
                  <div className="text-gray-600">
                    📍 {booking.event.location}
                  </div>
                  <div className="text-gray-600">
                    🎟️ {booking.tickets} ticket(s)
                  </div>
                  <div className="text-gray-600">
                    💰 Total: ${booking.totalAmount}
                  </div>
                  <div className="text-gray-600">
                    🏷️ Status: 
                    <span className={`ml-1 font-semibold ${
                      booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              {booking.paymentStatus === 'pending' && (
                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;