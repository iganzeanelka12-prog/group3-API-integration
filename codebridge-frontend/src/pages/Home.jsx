import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container">
      <section className="welcome-section mb-5">
        <p className="eyebrow">CodeBridge Academy</p>
        <h1>Turn curiosity into working code.</h1>
        <p className="subtitle slogan ">
          A hands-on React.js application integrated with the CodeBridge REST API and JSONPlaceholder.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <Link to="/courses" className="btn btn-primary">
            Browse Catalog
          </Link>
          <Link to="/register" className="btn btn-outline">
            Create Account
          </Link>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="banner">
        <div>
          <p className="banner-label">Start where you are</p>
          <h2>Build real applications with dynamic API data.</h2>
        </div>
        <Link to="/courses" className="btn btn-primary">
          Explore Courses
        </Link>
      </section>

      {/* Overview Grid */}
      <section style={{ marginTop: '54px' }}>
        <div className="section-heading mb-4">
          <p className="eyebrow">Practical Modules</p>
          <h2>Assignment Requirements Overview</h2>
        </div>

        <div className="grid grid-3">
          <div className="card">
            <span className="card-label">PART A</span>
            <h3>JSONPlaceholder Users</h3>
            <p className="course-description">
              Fetches and displays live user records with state management, reusable <code>UserCard</code>, loading states, and error handling.
            </p>
            <Link to="/users" className="btn btn-outline btn-sm">
              View Users &rarr;
            </Link>
          </div>

          <div className="card">
            <span className="card-label">PARTS B, C & D</span>
            <h3>Posts & Real-Time Search</h3>
            <p className="course-description">
              Displays posts using <code>PostCard</code>, includes dynamic title search without page reloads, and views single posts via <code>useParams()</code>.
            </p>
            <Link to="/posts" className="btn btn-outline btn-sm">
              Search Posts &rarr;
            </Link>
          </div>

          <div className="card">
            <span className="card-label">PARTS E &ndash; L</span>
            <h3>CodeBridge API & Auth</h3>
            <p className="course-description">
              Full student registration, JWT authentication login, course catalog fetching, category filters, price sorting, pagination, and enrollments.
            </p>
            <Link to="/courses" className="btn btn-outline btn-sm">
              Course Catalog &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
