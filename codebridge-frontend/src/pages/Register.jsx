import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register({ onShowToast }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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
    const { full_name, email, password, confirmPassword } = formData;

    if (!full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (full_name.trim().length < 3) {
      newErrors.full_name = 'Full name must be at least 3 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!hasMinLength) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!hasUppercase) {
      newErrors.password = 'Password must contain at least one uppercase letter (A-Z)';
    } else if (!hasNumber) {
      newErrors.password = 'Password must contain at least one number (0-9)';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await registerUser({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (onShowToast) {
        onShowToast('Registration successful! Please log in.', 'success');
      }

      navigate('/login');
    } catch (err) {
      setServerError(err.message || 'Registration failed');
      if (onShowToast) {
        onShowToast(err.message || 'Registration failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '42px' }} id="register-page">
        <p className="eyebrow">Start your journey</p>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>Create your account</h1>
        <p className="subtitle" style={{ fontSize: '1rem', marginBottom: '24px' }}>
          Join CodeBridge Academy to discover and enroll in courses.
        </p>

        {serverError && (
          <div style={{ color: '#b54d35', fontWeight: 'bold', marginBottom: '16px' }} id="register-error-alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} id="register-form" style={{ display: 'grid', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className="form-input"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
            />
            {errors.full_name && <span className="error-text">{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full mt-3" id="register-submit-btn">
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#586563' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#b54d35', fontWeight: 'bold' }}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
