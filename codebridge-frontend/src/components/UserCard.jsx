import React from 'react';
import { Link } from 'react-router-dom';

export default function UserCard({ user }) {
  const { id, name, username, email, phone, website, company } = user;
  const formattedWebsite = website ? (website.startsWith('http') ? website : `https://${website}`) : '#';

  return (
    <div className="card user-card" id={`user-card-${id}`}>
      <span className="card-label">User Profile #{id}</span>
      <h3>{name}</h3>
      <span className="user-username">@{username}</span>

      <div className="user-details mb-3">
        <p><strong>Email:</strong> {email}</p>
        {phone && <p><strong>Phone:</strong> {phone}</p>}
        {website && (
          <p>
            <strong>Website:</strong>{' '}
            <a href={formattedWebsite} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </p>
        )}
        {company && <p><strong>Organization:</strong> {company.name}</p>}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #c8d0c5' }}>
        <Link to={`/users/${id}`} className="btn btn-outline btn-sm" id={`view-user-${id}`}>
          View Profile &rarr;
        </Link>
      </div>
    </div>
  );
}
