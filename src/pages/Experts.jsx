import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Filter, Star, Clock, SearchX } from 'lucide-react';
import Spinner from '../components/Spinner';
import api from '../services/api';
import './Experts.css';

const Experts = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ['All', 'Medical', 'Legal', 'Tech', 'Finance', 'Education'];

    useEffect(() => {
        fetchExperts();
    }, [searchQuery, category, page]);

    const fetchExperts = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({
                page,
                limit: 8,
                ...(searchQuery && { search: searchQuery }),
                ...(category && category !== 'All' && { category })
            }).toString();

            const { data } = await api.get(`/experts?${query}`);
            if (data.success) {
                setExperts(data.data);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch experts', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container experts-container animate-fade-in">
            <div className="experts-header">
                <h1>{searchQuery ? `Results for "${searchQuery}"` : "Find Your Expert"}</h1>
                <p>Book premium sessions with industry-leading professionals.</p>
            </div>

            <div className="experts-controls-minimal">
                <div className="filters glass-panel">
                    <Filter size={18} className="filter-icon" />
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <Spinner size="large" text="Finding experts..." />
            ) : (
                <>
                    <div className="experts-grid">
                        {experts.length > 0 ? experts.map((expert) => (
                            <Link to={`/experts/${expert._id}`} key={expert._id} className="expert-card glass-panel">
                                <div className="expert-image-wrapper">
                                    <img src={expert.imageUrl} alt={expert.name} className="expert-image" loading="lazy" />
                                    <div className="expert-category-badge">{expert.category}</div>
                                </div>
                                <div className="expert-info">
                                    <h3>{expert.name}</h3>
                                    <div className="expert-meta">
                                        <span className="meta-item">
                                            <Star size={14} className="star-icon" /> {expert.rating.toFixed(1)}
                                        </span>
                                        <span className="meta-item">
                                            <Clock size={14} /> {expert.experience} yrs exp.
                                        </span>
                                    </div>
                                    <p className="expert-bio">{expert.bio.length > 60 ? expert.bio.substring(0, 60) + '...' : expert.bio}</p>
                                </div>
                            </Link>
                        )) : (
                            <div className="empty-state glass-panel">
                                <SearchX size={56} className="empty-icon" />
                                <h3>No experts found.</h3>
                                <p>We couldn't find any professionals matching your current search criteria. Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>

                    {experts.length > 0 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-pagination"
                            >
                                Previous
                            </button>
                            <span className="page-indicator">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="btn-pagination"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Experts;
