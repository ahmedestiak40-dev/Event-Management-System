import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

const CheckoutForm = ({ eventId, tickets, totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        eventId,
        tickets
      });

      const { clientSecret } = response.data;

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4">
        <CardElement />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${totalAmount}`}
      </button>
    </form>
  );
};

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowPayment(true);
  };

  if (!event) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const totalAmount = event.price * tickets;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                {event.category}
              </span>
              <span className="text-gray-500">Organized by {event.organizer?.name}</span>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <span className="text-gray-600 w-24">📅 Date:</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-24">⏰ Time:</span>
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-24">📍 Location:</span>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-24">🏢 Venue:</span>
                <span>{event.venue}</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">About this event</h3>
              <p className="text-gray-700">{event.description}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-purple-600">${event.price}</div>
              <div className="text-gray-500">per ticket</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Number of Tickets</label>
              <input
                type="number"
                min="1"
                max={event.availableSeats}
                value={tickets}
                onChange={(e) => setTickets(Math.min(event.availableSeats, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="text-sm text-gray-500 mt-1">
                {event.availableSeats} seats available
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${totalAmount}</span>
              </div>
            </div>

            {!showPayment ? (
              <button
                onClick={handleBooking}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Book Now
              </button>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  eventId={event._id}
                  tickets={tickets}
                  totalAmount={totalAmount}
                  onSuccess={() => {
                    alert('Booking successful! Check your email for confirmation.');
                    navigate('/my-bookings');
                  }}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;