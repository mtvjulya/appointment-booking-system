import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded admin password (в production лучше использовать backend)
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password === ADMIN_PASSWORD) {
      // Сохраняем токен авторизации в localStorage
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', Date.now().toString());
      navigate('/admin');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <h1>Admin Login</h1>
              <p className="text-grey">Enter your password to access the admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <p className="error-message">{error}</p>}

              <div className="form-group">
                <label htmlFor="password">Password <span style={{color: 'var(--gov-error)'}}>*</span></label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Please enter admin password"
                  required
                  autoFocus
                  className={error ? 'input-error' : ''}
                />
              </div>

              <button type="submit" className="btn-primary btn-full-width">
                Login
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
