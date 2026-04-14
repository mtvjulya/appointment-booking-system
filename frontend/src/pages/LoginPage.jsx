import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || '/services';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      if (data.requiresVerification) {
        navigate('/verify', {
          state: {
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
            redirectTo: redirectTo,
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="mygovid-page">      
      
      <div className="mygovid-card">
        <div className="mygovid-header">
          <h1>MyGovID</h1>
          <p>
            Your single login for government services in Ireland
          </p>
        </div>
        <h2 style={{ marginBottom: '1.5rem' }}>Sign in</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Continue
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <a href="/register" style={{ color: 'var(--gov-link)' }}>
            Create a MyGovID account
          </a>
        </div>

        <p className="mygovid-footer">
          This is a prototype. Not affiliated with the Irish Government.
        </p>
      </div>

      
    </div>
  );
}

export default LoginPage;