import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollInCourse } from '../services/api';

export default function CourseCard({ course, enrolledIds = [], onEnrollSuccess, onShowToast }) {
  const { id, title, description, category, price } = course;
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const isEnrolled = enrolledIds.includes(Number(id));

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      if (onShowToast) {
        onShowToast('Please log in or register to enroll in courses.', 'warning');
      }
      navigate('/login', { state: { from: { pathname: '/courses' } } });
      return;
    }

    setLoading(true);
    try {
      const res = await enrollInCourse(id, token);
      if (onShowToast) {
        onShowToast(res.message || 'Successfully enrolled in course!', 'success');
      }
      if (onEnrollSuccess) {
        onEnrollSuccess(id);
      }
    } catch (err) {
      let msg = err.message || 'Enrollment failed';
      if (err.status === 401) {
        msg = 'Session expired or unauthorized. Please log in again.';
        navigate('/login');
      } else if (err.status === 409) {
        msg = 'You are already enrolled in this course.';
      } else if (err.status === 404) {
        msg = 'Course not found or no longer available.';
      } else if (err.status === 500) {
        msg = 'Server error occurred during enrollment.';
      }

      if (onShowToast) {
        onShowToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card course-card" id={`course-card-${id}`}>
      <div>
        <span className="course-category">{category}</span>
        <h3>{title}</h3>
        <p className="course-description">{description}</p>
      </div>

      <div className="course-meta">
        <span className="course-price">{formatPrice(price)}</span>

        {isEnrolled ? (
          <button className="btn btn-outline btn-sm" disabled id={`enroll-btn-${id}`}>
            Enrolled
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={loading}
            className="btn btn-primary btn-sm"
            id={`enroll-btn-${id}`}
          >
            {loading ? 'Enrolling...' : 'Enroll Now'}
          </button>
        )}
      </div>
    </div>
  );
}
