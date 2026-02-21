import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, ArrowLeft } from 'lucide-react';
import CalendarBooking from '../components/CalendarBooking';
import Spinner from '../components/Spinner';
import api from '../services/api';
import './ExpertDetail.css';

const ExpertDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expert, setExpert] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExpertDetails();
    }, [id]);

    const fetchExpertDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/experts/${id}`);
            if (data.success) {
                setExpert(data.data);
                setBookedSlots(data.bookedSlots);
            }
        } catch (error) {
            console.error('Failed to fetch expert details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner size="large" text="Loading expert profile..." />;
    if (!expert) return <div className="container empty-state animate-fade-in">Expert not found.</div>;

    return (
        <div className="container expert-detail-container animate-fade-in">
            <button className="btn-back" onClick={() => navigate('/experts')}>
                <ArrowLeft size={18} /> Back to Experts
            </button>

            <div className="expert-detail-layout">
                <div className="expert-profile glass-panel">
                    <div className="profile-image-container">
                        <img src={expert.imageUrl} alt={expert.name} className="profile-image" />
                        <div className="profile-category">{expert.category}</div>
                    </div>

                    <div className="profile-info">
                        <h1>{expert.name}</h1>
                        <div className="profile-meta">
                            <span className="meta-badge"><Star size={16} fill="var(--warning)" color="var(--warning)" /> {expert.rating.toFixed(1)} Rating</span>
                            <span className="meta-badge"><Clock size={16} /> {expert.experience} Years Exp.</span>
                        </div>

                        <div className="profile-bio">
                            <h3>About</h3>
                            <p>{expert.bio}</p>
                        </div>

                        <div className="profile-schedule">
                            <h3>Availability</h3>
                            <p>Works {expert.availability.days.length} days a week</p>
                            <p>Hours: {expert.availability.startHour}:00 - {expert.availability.endHour}:00</p>
                        </div>
                    </div>
                </div>

                <div className="booking-section glass-panel">
                    <div className="booking-header">
                        <h2>Book a Session</h2>
                        <p>Select an available date and time slot.</p>
                    </div>

                    <CalendarBooking expert={expert} initialBookedSlots={bookedSlots} />
                </div>
            </div>
        </div>
    );
};

export default ExpertDetail;
