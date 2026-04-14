import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="page-content">
      <div className="hero-banner">
        <div className="container">
          <h1 className="hero-title">Appointment Booking Service</h1>
          <p className="hero-subtitle">
            Book, manage, and cancel appointments with Irish government services — all in one place.
          </p>         
        </div>
      </div>

      <div className="container">
        <div className="grid-list" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="card card-green-left">
            <h3 className="heading-green">Book an Appointment</h3>
            <p>Browse available government services and book an appointment at a time and location that suits you.</p>
            <Link to="/services" className="link-green">View services</Link>
          </div>

          <div className="card card-green-left">
            <h3 className="heading-green">Manage Appointments</h3>
            <p>View your upcoming appointments, check details, or cancel if your plans change.</p>
            {user ? (
              <Link to="/my-appointments" className="link-green">My appointments</Link>
            ) : (
              <Link to="/login" className="link-green">Sign in to view</Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomePage;