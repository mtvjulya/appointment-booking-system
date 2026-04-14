import {Link} from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-title">gov.ie</p>
 
        <div className="footer-links">
          <Link to="/about" className="link-green">
            About Appointment Booking system
          </Link>
          <Link to="/accessibility" className="link-green">
            Accessibility
          </Link>
          <Link to="/services" className="link-green">
            Services
          </Link>
        </div>
 
        <hr className="separator" />
 
        <p className="footer-text">
          This is a prototype booking system for educational purposes.
          It is not affiliated with the Irish Government.
        </p>
        <p className="footer-text" style={{ marginTop: '0.5rem' }}>
          2026 Appointment Booking system for Government Services — Diploma Project of Yulia Reutova
        </p>
      </div>
    </footer>
  );
}

 
export default Footer;