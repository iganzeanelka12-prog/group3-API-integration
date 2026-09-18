import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchJSONPlaceholderPostById, fetchJSONPlaceholderUserById } from '../services/api';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPostData() {
      setLoading(true);
      setError(null);
      try {
        const postData = await fetchJSONPlaceholderPostById(id);
        setPost(postData);

        if (postData.userId) {
          const userData = await fetchJSONPlaceholderUserById(postData.userId);
          setAuthor(userData);
        }
      } catch (err) {
        setError(err.message || `Failed to fetch post #${id}`);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPostData();
    }
  }, [id]);

  return (
    <div className="container" id="post-detail-page" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/posts" className="btn btn-outline btn-sm" id="back-to-posts-link">
          &larr; Back to Posts
        </Link>
      </div>

      {loading && (
        <div className="state-box" id="post-detail-loading">
          <p>Fetching post #{id}...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box" id="post-detail-error">
          <p style={{ color: '#b54d35', fontWeight: 'bold' }}>{error}</p>
          <button onClick={() => navigate('/posts')} className="btn btn-primary btn-sm mt-3">
            Return to Posts List
          </button>
        </div>
      )}

      {!loading && !error && post && (
        <div className="card" id="single-post-view" style={{ padding: '36px' }}>
          <span className="eyebrow">PART D &mdash; Post Details (ID: {post.id})</span>
          <h1 style={{ fontSize: '2.4rem', textTransform: 'capitalize', margin: '12px 0 20px' }}>
            {post.title}
          </h1>

          <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#1d2b2a', margin: '24px 0', borderTop: '1px solid #c8d0c5', borderBottom: '1px solid #c8d0c5', padding: '24px 0' }}>
            <p>{post.body}</p>
          </div>

          {author && (
            <div style={{ background: '#fafbf8', padding: '20px', border: '1px solid #c8d0c5' }}>
              <p className="eyebrow">Author Information</p>
              <h4 style={{ margin: '4px 0' }}>{author.name} (@{author.username})</h4>
              <p style={{ fontSize: '0.9rem', color: '#586563', margin: 0 }}>
                {author.email} &bull; {author.website} {author.company ? `&bull; ${author.company.name}` : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
