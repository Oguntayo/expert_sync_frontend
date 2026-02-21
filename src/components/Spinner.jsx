import './Spinner.css';

const Spinner = ({ size = 'medium', text = 'Loading...' }) => {
    return (
        <div className={`spinner-container ${size}`}>
            <div className="spinner-ring"></div>
            {text && <span className="spinner-text">{text}</span>}
        </div>
    );
};

export default Spinner;
