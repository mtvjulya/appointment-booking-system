import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
console.log(user);
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="https://www.gov.ie/" className="header-logo">
          goveeeeee.ie
        </Link>

        <nav className="header-nav">
          <Link to="/" className="header-link">
            Home
          </Link>
          <Link to="/services" className="header-link">
            Services
          </Link>

          {user ? (
            <>
              <Link to="/my-appointments" className="header-link">
                My Appointments
              </Link>
              <span className="header-user">{user.name}</span>
              <button onClick={logout} className="header-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="header-login">
              Login with MyGovID
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;