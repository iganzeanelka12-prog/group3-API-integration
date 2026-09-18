import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const { id, title, body } = post;

  return (
    <div className="card post-card" id={`post-card-${id}`}>
      <span className="card-label">Article #{id}</span>
      <h3>{title}</h3>
      <p className="post-body">{body}</p>

      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <Link to={`/posts/${id}`} className="btn btn-outline btn-sm" id={`view-post-${id}`}>
          Read Post &rarr;
        </Link>
      </div>
    </div>
  );
}
