import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchJSONPlaceholderUserById, fetchCodeBridgeUserById } from '../services/api';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      setError(null);

      const rawId = String(id).replace('cb-', '');

      // 1. Try CodeBridge Backend first
      try {
        const backendUser = await fetchCodeBridgeUserById(rawId);
        if (backendUser) {
          setUser({
            id: backendUser.id,
            name: backendUser.full_name,
            username: backendUser.role === 'admin' ? 'admin' : 'student',
            email: backendUser.email,
            role: backendUser.role,
            created_at: backendUser.created_at,
          });
          setSource('CodeBridge Database User');
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallthrough to JSONPlaceholder check
      }

      // 2. Try JSONPlaceholder
      try {
        const jsonUser = await fetchJSONPlaceholderUserById(rawId);
        if (jsonUser) {
          setUser(jsonUser);
          setSource('JSONPlaceholder External User');
          setLoading(false);
          return;
        }
      } catch (err) {
        // Both failed
      }

      setError(`User with ID "${id}" was not found.`);
      setLoading(false);
    }

    if (id) {
      loadUser();
    }
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container" id="user-detail-page" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/users" className="btn btn-outline btn-sm" id="back-to-users-link">
          &larr; Back to Users List
        </Link>
      </div>

      {loading && (
        <div className="state-box" id="user-detail-loading">
          <p>Searching user profile #{id}...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box" id="user-detail-error">
          <p style={{ color: '#b54d35', fontWeight: 'bold' }}>{error}</p>
          <button onClick={() => navigate('/users')} className="btn btn-primary btn-sm mt-3">
            Return to User Directory
          </button>
        </div>
      )}

      {!loading && !error && user && (
        <div className="card" id="single-user-view" style={{ padding: '36px' }}>
          <span className="eyebrow">{source} (ID: {user.id})</span>
          <h1 style={{ fontSize: '2.4rem', margin: '10px 0 6px' }}>{user.name}</h1>
          <span className="user-username">@{user.username || 'user'}</span>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #c8d0c5', display: 'grid', gap: '14px', fontSize: '1.05rem' }}>
            <p><strong>Email Address:</strong> {user.email}</p>
            {user.role && <p><strong>Account Role:</strong> <span style={{ textTransform: 'capitalize', color: '#b54d35', fontWeight: 'bold' }}>{user.role}</span></p>}
            {user.created_at && <p><strong>Registration Date:</strong> {formatDate(user.created_at)}</p>}
            {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
            {user.website && (
              <p>
                <strong>Website:</strong>{' '}
                <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer">
                  {user.website}
                </a>
              </p>
            )}
            {user.company && <p><strong>Company / Organization:</strong> {user.company.name}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
