import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyCourses, dropCourse } from '../services/api';

export default function Dashboard({ onShowToast }) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [droppingId, setDroppingId] = useState(null);

  const loadStudentDashboard = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyCourses(token);
      setEnrolledCourses(data.courses || []);
    } catch (err) {
      setError(err.message || 'Failed to load enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentDashboard();
  }, [token]);

  const handleDropCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to drop "${courseTitle}"?`)) {
      return;
    }

    setDroppingId(courseId);
    try {
      await dropCourse(courseId, token);
      if (onShowToast) {
        onShowToast(`Dropped "${courseTitle}" successfully`, 'success');
      }
      setEnrolledCourses((prev) => prev.filter((c) => Number(c.id) !== Number(courseId)));
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.message || 'Failed to drop course', 'error');
      }
    } finally {
      setDroppingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    if (onShowToast) {
      onShowToast('Logged out successfully', 'info');
    }
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));
  };

  return (
    <div className="container" id="dashboard-page">
      {/* Student Banner */}
      <div className="banner" id="student-profile-card" style={{ marginBottom: '36px' }}>
        <div>
          <span className="banner-label">Student Portal</span>
          <h2>{user?.full_name || 'Student Name'}</h2>
          <p style={{ margin: '4px 0 0', color: '#586563', fontSize: '1rem' }}>
            {user?.email || 'student@example.com'}
          </p>
        </div>

        <button onClick={handleLogout} type="button" id="dashboard-logout-btn">
          Log Out
        </button>
      </div>

      {/* Enrolled Courses Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <span className="eyebrow">My Learning</span>
            <h2>Enrolled Courses ({enrolledCourses.length})</h2>
          </div>

          <Link to="/courses" className="btn btn-primary btn-sm" id="explore-more-courses-btn">
            Explore More Courses
          </Link>
        </div>

        {loading && (
          <div className="state-box" id="dashboard-loading">
            <p>Loading your enrolled courses...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-box" id="dashboard-error">
            <p style={{ color: '#b54d35', fontWeight: 'bold' }}>{error}</p>
            <button onClick={loadStudentDashboard} className="btn btn-primary btn-sm mt-3">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && enrolledCourses.length === 0 && (
          <div className="state-box" id="dashboard-empty">
            <p>You have not enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-outline btn-sm mt-3">
              Browse Course Catalog
            </Link>
          </div>
        )}

        {!loading && !error && enrolledCourses.length > 0 && (
          <div className="grid grid-2" id="enrolled-courses-grid">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="card" id={`enrolled-course-${course.id}`}>
                <span className="course-category">{course.category}</span>
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #c8d0c5' }}>
                  <span style={{ fontSize: '0.85rem', color: '#586563' }}>
                    Enrolled: <strong>{formatDate(course.enrolled_at)}</strong>
                  </span>
                  <span className="course-price">{formatPrice(course.price)}</span>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleDropCourse(course.id, course.title)}
                    disabled={droppingId === course.id}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#dc2626', color: '#dc2626' }}
                    id={`drop-course-btn-${course.id}`}
                  >
                    {droppingId === course.id ? 'Dropping...' : 'Drop Course'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
