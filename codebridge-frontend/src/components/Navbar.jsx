import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <Link to="/" className="brand" id="brand-link">
        Code<span className="brand-accent">Bridge</span> Platform
      </Link>

      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} id="nav-home">
          Home
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')} id="nav-users">
          Users
        </NavLink>
        <NavLink to="/posts" className={({ isActive }) => (isActive ? 'active' : '')} id="nav-posts">
          Posts
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => (isActive ? 'active' : '')} id="nav-courses">
          Courses
        </NavLink>
        <NavLink to="/programs" className={({ isActive }) => (isActive ? 'active' : '')} id="nav-programs">
          Programs
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')} id="nav-dashboard">
            Dashboard
          </NavLink>
        )}
      </nav>

      <div className="header-actions">
        {isAuthenticated ? (
          <>
            <span className="user-badge">{user?.full_name || 'Student'}</span>
            <button onClick={handleLogout} className="header-button" id="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" id="nav-login">
              Login
            </Link>
            <Link to="/register" className="header-button" id="nav-register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
