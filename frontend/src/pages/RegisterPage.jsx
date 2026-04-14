import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await api.post('/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        passwordHash: form.password,
        role: 'USER',
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="mygovid-page">
        
        <div className="mygovid-card text-center">
          <div className="mygovid-header">
            <h1>MyGovID</h1>
            <p>Your single login for government services in Ireland</p>
          </div>
          <div className="success-icon">✓</div>
          <h2 style={{ marginBottom: '0.75rem' }}>Account created</h2>
          <p className="section-desc">
            Your MyGovID account has been created successfully. You can now sign in.
          </p>
          <button className="btn-primary btn-full" onClick={() => navigate('/login')}>
            Sign in
          </button>
          <p className="mygovid-footer">
          This is a prototype. Not affiliated with the Irish Government.
        </p>
        </div>

        
      </div>
    );
  }

  return (
    <div className="mygovid-page">
     

      <div className="mygovid-card">
        <div className="mygovid-header">
          <h1>MyGovID</h1>
          <p>Create your account for government services in Ireland</p>
        </div>
        <h2 style={{ marginBottom: '1.5rem' }}>Create an account</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. 083 123 4567"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
            <p className="file-note">Must be at least 8 characters</p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Create account
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: 'var(--gieds-font-size-200)' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'var(--gov-link)' }}>
            Sign in
          </a>
        </div>
        <p className="mygovid-footer">
          This is a prototype. Not affiliated with the Irish Government.
        </p>
      </div>

      
    </div>
  );
}

export default RegisterPage;
