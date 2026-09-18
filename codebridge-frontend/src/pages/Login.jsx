import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login({ onShowToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = res.data;
      login(token, user);

      if (onShowToast) {
        onShowToast(`Welcome back, ${user.full_name}!`, 'success');
      }

      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Invalid email or password');
      if (onShowToast) {
        onShowToast(err.message || 'Login failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '42px' }} id="login-page">
        <p className="eyebrow">Welcome back</p>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>Log in to CodeBridge</h1>
        <p className="subtitle" style={{ fontSize: '1rem', marginBottom: '24px' }}>
          Continue building the skills that move you forward.
        </p>

        {serverError && (
          <div style={{ color: '#b54d35', fontWeight: 'bold', marginBottom: '16px' }} id="login-error-alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} id="login-form" style={{ display: 'grid', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. alex@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full mt-3" id="login-submit-btn">
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#586563' }}>
          New to CodeBridge?{' '}
          <Link to="/register" style={{ color: '#b54d35', fontWeight: 'bold' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
