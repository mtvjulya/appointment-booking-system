import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function VerifyPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const userData = location.state;

  if (!userData) {
    return (
      <div className="page-content">
        <div className="container">
          <p>No login session found. <a href="/login">Go to login</a></p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/verify', {
        userId: userData.userId,
        code: code,
      });

      login({
        userId: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      });

      navigate(userData.redirectTo || '/services');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    }
  };

  return (
    <div className="mygovid-page">
     

      <div className="mygovid-card">
        <div className="mygovid-header">
          <h1>MyGovID</h1>
          <p>Verify your identity</p>
        </div>
        <h2 style={{ marginBottom: '0.5rem' }}>Enter verification code</h2>
        <p className="section-desc text-small">
          We've sent a 6-digit code to your phone.
        </p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Verification code</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 123456"
              maxLength={6}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Verify and sign in
          </button>
        </form>

        <p style={{ marginTop: '1rem', color: 'var(--gov-grey)', fontSize: '0.75rem', textAlign: 'center' }}>
          Demo: enter any 6-digit code (e.g. 123456)
        </p>
      </div>
    </div>
  );
}

export default VerifyPage;