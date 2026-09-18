import React, { useState, useEffect } from 'react';
import { fetchJSONPlaceholderPosts } from '../services/api';
import PostCard from '../components/PostCard';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJSONPlaceholderPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
    } else {
      const term = searchTerm.toLowerCase();
      const results = posts.filter((post) =>
        post.title.toLowerCase().includes(term)
      );
      setFilteredPosts(results);
    }
  }, [searchTerm, posts]);

  return (
    <div className="container" id="posts-page">
      <div style={{ marginBottom: '32px' }}>
        <p className="eyebrow">PARTS B &amp; C &mdash; Posts &amp; Search</p>
        <h1>Articles &amp; Posts</h1>
        <p className="subtitle">
          Real-time title filtering powered by React state.
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          id="post-search-input"
          className="search-input"
          placeholder="Search posts by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="btn btn-outline btn-sm"
          >
            Clear
          </button>
        )}
      </div>

      {loading && (
        <div className="state-box" id="posts-loading">
          <p>Loading posts...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box" id="posts-error">
          <p style={{ color: '#b54d35', fontWeight: 'bold' }}>{error}</p>
          <button onClick={loadPosts} className="btn btn-primary btn-sm">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredPosts.length === 0 && (
        <div className="state-box" id="posts-empty">
          <p>No posts match "{searchTerm}".</p>
        </div>
      )}

      {!loading && !error && filteredPosts.length > 0 && (
        <div className="grid grid-3" id="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
