import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Calendar, Users, Search } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            navigate(`/?search=${encodeURIComponent(trimmed)}`);
        } else {
            navigate(`/`);
        }
    };

    return (
        <nav className="navbar glass-panel">
            <div className="container nav-content">
                <Link to="/" className="nav-brand">
                    <Users className="brand-icon" />
                    <span className="brand-text">ExpertSync</span>
                </Link>

                <form className="nav-search-form" onSubmit={handleSearchSubmit}>
                    <div className="nav-search-container">
                        <Search className="nav-search-icon" size={18} />
                        <input
                            type="text"
                            className="nav-search-input"
                            placeholder="Search by name or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="nav-search-btn">Search</button>
                    </div>
                </form>

                <div className="nav-links">
                    <Link to="/my-bookings" className="nav-link">
                        <Calendar className="nav-icon" size={18} />
                        <span className="nav-link-text">My Bookings</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
