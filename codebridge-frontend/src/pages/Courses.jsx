import React, { useState, useEffect } from 'react';
import { fetchCourses, fetchMyCourses } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';

export default function Courses({ onShowToast }) {
  const { isAuthenticated, token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMyEnrollments = async () => {
    if (isAuthenticated && token) {
      try {
        const res = await fetchMyCourses(token);
        const ids = (res.courses || []).map((c) => Number(c.id));
        setEnrolledIds(ids);
      } catch (err) {
        console.error('Failed to load enrollments', err);
      }
    } else {
      setEnrolledIds([]);
    }
  };

  const loadCoursesData = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const sort = sortOrder ? 'price' : '';
      const order = sortOrder === 'desc' ? 'desc' : 'asc';
      const searchVal = category || search;

      const data = await fetchCourses({
        search: searchVal,
        page: pageNumber,
        limit: 6,
        sort,
        order,
      });

      setCourses(data.courses || []);
      setPagination(data.pagination || { page: pageNumber, total: data.courses.length, total_pages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoursesData(1);
    loadMyEnrollments();
  }, [search, category, sortOrder, isAuthenticated, token]);

  const handleEnrollSuccess = (enrolledCourseId) => {
    setEnrolledIds((prev) => [...prev, Number(enrolledCourseId)]);
  };

  const handlePrevPage = () => {
    if (pagination.has_prev) loadCoursesData(pagination.page - 1);
  };

  const handleNextPage = () => {
    if (pagination.has_next) loadCoursesData(pagination.page + 1);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setSortOrder('');
  };

  return (
    <div className="container" id="courses-page">
      <div style={{ marginBottom: '32px' }}>
        <p className="eyebrow">CodeBridge Catalog</p>
        <h1>Explore Available Courses</h1>
        <p className="subtitle">
          Live courses fetched dynamically from <code>GET /api/courses</code>
        </p>
      </div>

      {/* Controls / Filter Bar */}
      <div className="search-box">
        <input
          type="text"
          id="course-search-input"
          className="search-input"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          id="category-select"
          className="form-input form-select"
          style={{ width: '180px' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Database">Database</option>
          <option value="Full Stack">Full Stack</option>
        </select>

        <select
          id="sort-price-select"
          className="form-input form-select"
          style={{ width: '160px' }}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>

        {(search || category || sortOrder) && (
          <button onClick={resetFilters} className="btn btn-outline btn-sm">
            Reset
          </button>
        )}
      </div>

      {loading && (
        <div className="state-box" id="courses-loading">
          <p>Loading course catalog...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box" id="courses-error">
          <p style={{ color: '#b54d35', fontWeight: 'bold' }}>{error}</p>
          <button onClick={() => loadCoursesData(1)} className="btn btn-primary btn-sm mt-3">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="state-box" id="courses-empty">
          <p>No courses match your filter criteria.</p>
          <button onClick={resetFilters} className="btn btn-outline btn-sm mt-3">
            Clear Filters
          </button>
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <>
          <div className="grid grid-3" id="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                enrolledIds={enrolledIds}
                onEnrollSuccess={handleEnrollSuccess}
                onShowToast={onShowToast}
              />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '36px' }}>
            <span style={{ fontSize: '0.9rem', color: '#586563' }}>
              Page {pagination.page} of {pagination.total_pages} ({pagination.total} courses total)
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handlePrevPage}
                disabled={!pagination.has_prev || loading}
                className="btn btn-outline btn-sm"
                id="pagination-prev"
              >
                &larr; Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!pagination.has_next || loading}
                className="btn btn-outline btn-sm"
                id="pagination-next"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
