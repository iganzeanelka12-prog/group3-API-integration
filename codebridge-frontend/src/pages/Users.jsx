import React, { useState, useEffect } from 'react';
import { fetchJSONPlaceholderUsers, fetchCodeBridgeUsers } from '../services/api';
import UserCard from '../components/UserCard';

export default function Users() {
  const [codebridgeUsers, setCodebridgeUsers] = useState([]);
  const [jsonUsers, setJsonUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('codebridge'); // 'codebridge' or 'jsonplaceholder'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const [realUsers, placeholderUsers] = await Promise.all([
        fetchCodeBridgeUsers().catch(() => []),
        fetchJSONPlaceholderUsers().catch(() => []),
      ]);

      // Normalize real CodeBridge users to UserCard format
      const normalizedRealUsers = realUsers.map((u) => ({
        id: `cb-${u.id}`,
        name: u.full_name,
        username: u.role === 'admin' ? 'admin' : 'student',
        email: u.email,
        phone: 'Registered Student Account',
        website: 'codebridge.edu',
        company: { name: `Registered User #${u.id}` },
        isRealBackendUser: true,
        created_at: u.created_at,
      }));

      setCodebridgeUsers(normalizedRealUsers);
      setJsonUsers(placeholderUsers);
    } catch (err) {
      setError(err.message || 'Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  const displayedUsers = activeTab === 'codebridge' ? codebridgeUsers : jsonUsers;

  return (
    <div className="container" id="users-page">
      <div style={{ marginBottom: '28px' }}>
        <p className="eyebrow">User Directory</p>
        <h1>Registered Users &amp; Profiles</h1>
        <p className="subtitle">
          Displaying real CodeBridge registered/logged-in users and external API data.
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', borderBottom: '1px solid #c8d0c5', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('codebridge')}
          className={`btn ${activeTab === 'codebridge' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          id="tab-codebridge-users"
        >
          Real Registered Users ({codebridgeUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('jsonplaceholder')}
          className={`btn ${activeTab === 'jsonplaceholder' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          id="tab-json-users"
        >
          JSONPlaceholder Users ({jsonUsers.length})
        </button>
      </div>

      {loading && (
        <div className="state-box" id="users-loading">
          <p>Fetching user records...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box" id="users-error">
          <p style={{ color: '#b54d35', fontWeight: 'bold' }}>{error}</p>
          <button onClick={loadAllUsers} className="btn btn-primary btn-sm mt-3">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && displayedUsers.length === 0 && (
        <div className="state-box" id="users-empty">
          <p>No registered users found yet in the database.</p>
          <p style={{ fontSize: '0.9rem', color: '#586563' }}>
            Register a new student account to see them appear here live!
          </p>
        </div>
      )}

      {!loading && !error && displayedUsers.length > 0 && (
        <div className="grid grid-3" id="users-grid">
          {displayedUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
