import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Clock3 } from 'lucide-react';
import Spinner from '../components/Spinner';
import api from '../services/api';
import './MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [hasFetched, setHasFetched] = useState(false);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        
    }, []);

    const fetchBookings = async (targetEmail) => {
        if (!targetEmail) return;
        try {
            setLoading(true);
            setFetchError('');
            const { data } = await api.get(`/bookings?email=${targetEmail}`);
            if (data.success) {
                setBookings(data.data);
                setHasFetched(true);
            }
        } catch (error) {
            console.error('Failed to fetch bookings');
            setFetchError('Failed to find bookings for this email.');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const { data } = await api.patch(`/bookings/${id}/status`, { status });
            if (data.success) {
                setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
            }
        } catch (error) {
            console.error('Failed to update status', error.response?.data?.message);
            alert(error.response?.data?.message || 'Error updating status');
        }
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        fetchBookings(email.trim());
    };

    if (!hasFetched && !loading) {
        return (
            <div className="container bookings-container animate-fade-in">
                <div className="bookings-header">
                    <h1>My Bookings</h1>
                    <p>Enter your email address to view and manage your expert sessions.</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="email-gateway-form glass-panel">
                    <div className="gateway-icon-circle">
                        <Calendar className="gateway-header-icon" />
                    </div>
                    <h3>Find Your Bookings</h3>
                    <p className="gateway-subtext">Enter your email address to securely access your scheduled expert sessions.</p>
                    {fetchError && <p className="error-text">{fetchError}</p>}
                    <div className="gateway-input-wrapper">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="gateway-input"
                            required
                        />
                        <button type="submit" className="btn-primary gateway-submit-btn">
                            View Bookings
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="container bookings-container animate-fade-in">
            <div className="bookings-header">
                <h1>My Bookings</h1>
                <div className="bookings-subtitle">
                    <p>Showing sessions for <strong>{email}</strong></p>
                    <button
                        className="change-email-link"
                        onClick={() => { setHasFetched(false); setBookings([]); }}
                    >
                        Change email
                    </button>
                </div>
            </div>

            {loading ? (
                <Spinner size="large" text="Finding your bookings..." />
            ) : bookings.length === 0 ? (
                <div className="empty-state glass-panel">
                    <Calendar size={48} className="empty-icon" />
                    <h3>No bookings yet</h3>
                    <p>You haven't scheduled any expert sessions.</p>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <div key={booking._id} className={`booking-card glass-panel status-${booking.status.toLowerCase()}`}>
                            <div className="booking-info">
                                <h3>Session with {booking.expert?.name || 'Unknown Expert'}</h3>
                                <span className="booking-category">{booking.expert?.category || 'General'}</span>

                                <div className="booking-datetime">
                                    <span className="datetime-item">
                                        <Calendar size={16} /> {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="datetime-item">
                                        <Clock size={16} /> {booking.timeSlot}
                                    </span>
                                </div>
                                {booking.notes && (
                                    <div className="booking-notes-display">
                                        <strong>Notes:</strong> {booking.notes}
                                    </div>
                                )}
                            </div>

                            <div className="booking-actions">
                                <div className="status-indicator">
                                    {booking.status === 'Confirmed' && <CheckCircle size={18} className="status-icon" color="var(--success)" />}
                                    {booking.status === 'Completed' && <CheckCircle size={18} className="status-icon" color="var(--accent-primary)" />}
                                    {booking.status === 'Pending' && <Clock3 size={18} className="status-icon" color="var(--warning)" />}
                                    <span className={`status-text ${booking.status.toLowerCase()}`}>{booking.status}</span>
                                </div>

                                {}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
