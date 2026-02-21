import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays,
    isBefore, startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import './CalendarBooking.css';
const CalendarBooking = ({ expert, initialBookedSlots }) => {

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [bookedSlots, setBookedSlots] = useState(initialBookedSlots || []);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState('');

    
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    useEffect(() => {
        
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const socket = io(BACKEND_URL);

        
        socket.emit('joinExpertRoom', expert._id);

        
        socket.on('slotBooked', (payload) => {
            
            
            setBookedSlots(prev => [...prev, payload]);
        });

        return () => {
            socket.disconnect();
        };
    }, [expert._id]);

    
    const renderHeader = () => {
        return (
            <div className="calendar-header">
                <button className="btn-icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronLeft size={20} />
                </button>
                <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
                <button className="btn-icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(currentMonth);
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="calendar-day-name" key={i}>
                    {format(addDays(startDate, i), 'EEE')}
                </div>
            );
        }
        return <div className="calendar-days-row">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';
        const today = startOfDay(new Date());

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;

                
                const isPast = isBefore(day, today);
                const dayOfWeek = day.getDay(); 
                const isAvailableDay = expert.availability.days.includes(dayOfWeek);
                const isDisabled = isPast || !isAvailableDay;
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                days.push(
                    <div
                        className={`calendar-cell ${!isSameMonth(day, monthStart) ? 'disabled-bg' : ''} ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                        key={day}
                        onClick={() => {
                            if (!isDisabled) {
                                setSelectedDate(cloneDay);
                                setSelectedSlot(null);
                                setSuccess(false);
                                setError(null);
                            }
                        }}
                    >
                        <span className="cell-number">{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div className="calendar-row" key={day}>{days}</div>);
            days = [];
        }
        return <div className="calendar-body">{rows}</div>;
    };

    
    const generateTimeSlots = () => {
        if (!selectedDate) return [];

        const slots = [];
        const { startHour, endHour } = expert.availability;
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        
        for (let i = startHour; i < endHour; i++) {
            const slotStr = `${i.toString().padStart(2, '0')}:00-${(i + 1).toString().padStart(2, '0')}:00`;

            
            const isBooked = bookedSlots.some(b => b.date === dateStr && b.timeSlot === slotStr);

            slots.push({
                id: slotStr,
                label: slotStr,
                isBooked
            });
        }
        return slots;
    };

    const handleBookingSubmit = async () => {
        if (!guestName.trim() || !guestEmail.trim()) {
            setError("Name and Email are required to complete booking.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const payload = {
                expert: expert._id,
                name: guestName.trim(),
                email: guestEmail.trim(),
                phone: guestPhone.trim(),
                date: format(selectedDate, 'yyyy-MM-dd'),
                timeSlot: selectedSlot
            };
            if (notes.trim()) {
                payload.notes = notes.trim();
            }

            const { data } = await api.post('/bookings', payload);
            if (data.success) {
                setSuccess(true);
                
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book slot');
        } finally {
            setLoading(false);
        }
    };

    const slots = selectedDate ? generateTimeSlots() : [];

    return (
        <div className="calendar-booking-container">
            {success ? (
                <div className="success-state animate-fade-in">
                    <CheckCircle2 size={48} className="success-icon" />
                    <h3>Booking Confirmed!</h3>
                    <p>Your session with {expert.name} on {format(selectedDate, 'MMM do')} at {selectedSlot} has been scheduled.</p>
                    <button className="btn-primary mt-4" onClick={() => setSuccess(false)}>Book Another</button>
                </div>
            ) : (
                <>
                    <div className="calendar-wrapper">
                        {renderHeader()}
                        {renderDays()}
                        {renderCells()}
                    </div>

                    {selectedDate && (
                        <div className="slots-wrapper animate-fade-in">
                            <h4>Available Slots for {format(selectedDate, 'MMM do')}</h4>
                            {slots.length === 0 ? (
                                <p className="no-slots">No slots available for this day.</p>
                            ) : (
                                <div className="slots-grid">
                                    {slots.map(slot => (
                                        <button
                                            key={slot.id}
                                            className={`slot-btn ${slot.isBooked ? 'booked' : ''} ${selectedSlot === slot.id ? 'selected' : ''}`}
                                            disabled={slot.isBooked}
                                            onClick={() => setSelectedSlot(slot.id)}
                                        >
                                            {slot.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {error && <div className="booking-error-msg">{error}</div>}

                    {selectedSlot && !success && (
                        <div className="booking-form-section animate-fade-in">
                            <h4 className="guest-info-heading">Your Details</h4>
                            <div className="guest-info-grid">
                                <input
                                    type="text"
                                    className="guest-input"
                                    placeholder="Full Name *"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    className="guest-input"
                                    placeholder="Email Address *"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="tel"
                                    className="guest-input full-width"
                                    placeholder="Phone Number (optional)"
                                    value={guestPhone}
                                    onChange={(e) => setGuestPhone(e.target.value)}
                                />
                            </div>
                            <textarea
                                className="notes-textarea"
                                placeholder="Add optional notes for the expert..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                            <button
                                className="btn-primary submit-booking-btn"
                                onClick={handleBookingSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Confirming...' : `Confirm Booking for ${selectedSlot}`}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CalendarBooking;
