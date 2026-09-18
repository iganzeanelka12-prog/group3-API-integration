// API service helpers for JSONPlaceholder and CodeBridge Backend

const JSONPLACEHOLDER_BASE = 'https://jsonplaceholder.typicode.com';
const CODEBRIDGE_BASE = 'http://localhost:3000/api';

/**
 * JSONPlaceholder APIs
 */
export async function fetchJSONPlaceholderUsers() {
  const res = await fetch(`${JSONPLACEHOLDER_BASE}/users`);
  if (!res.ok) {
    throw new Error(`Failed to fetch users (Status: ${res.status})`);
  }
  return res.json();
}

export async function fetchJSONPlaceholderPosts() {
  const res = await fetch(`${JSONPLACEHOLDER_BASE}/posts`);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts (Status: ${res.status})`);
  }
  return res.json();
}

export async function fetchJSONPlaceholderPostById(id) {
  const res = await fetch(`${JSONPLACEHOLDER_BASE}/posts/${id}`);
  if (!res.ok) {
    throw new Error(`Post not found (Status: ${res.status})`);
  }
  return res.json();
}

export async function fetchJSONPlaceholderUserById(id) {
  const res = await fetch(`${JSONPLACEHOLDER_BASE}/users/${id}`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

/**
 * CodeBridge Backend APIs
 */
export async function registerUser({ full_name, email, password }) {
  const res = await fetch(`${CODEBRIDGE_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${CODEBRIDGE_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data; // returns { success: true, data: { token, user, message } }
}

export async function fetchUserProfile(token) {
  const res = await fetch(`${CODEBRIDGE_BASE}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch user profile');
  }
  return data.data; // { user }
}

export async function fetchCodeBridgeUsers() {
  const res = await fetch(`${CODEBRIDGE_BASE}/auth/users`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch CodeBridge registered users');
  }
  return data.data.users; // array of users { id, full_name, email, role, created_at }
}

export async function fetchCodeBridgeUserById(id) {
  const res = await fetch(`${CODEBRIDGE_BASE}/auth/users/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'User not found in CodeBridge database');
  }
  return data.data.user;
}

export async function fetchCourses({ search = '', category = '', page = 1, limit = 6, sort = '', order = 'asc' } = {}) {
  const params = new URLSearchParams();
  const searchVal = search || category;
  if (searchVal) params.append('search', searchVal);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (sort) params.append('sort', sort);
  if (order) params.append('order', order);

  const queryString = params.toString();
  const url = `${CODEBRIDGE_BASE}/courses${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch courses');
  }
  return data.data; // { courses, pagination }
}

export async function fetchCourseById(id) {
  const res = await fetch(`${CODEBRIDGE_BASE}/courses/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Course not found');
  }
  return data.data.course;
}

export async function enrollInCourse(courseId, token) {
  const res = await fetch(`${CODEBRIDGE_BASE}/enrollments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ course_id: Number(courseId) }),
  });

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Enrollment failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function fetchMyCourses(token) {
  const res = await fetch(`${CODEBRIDGE_BASE}/enrollments/my-courses`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Failed to fetch enrolled courses');
    error.status = res.status;
    throw error;
  }
  return data.data; // { count, courses }
}

export async function dropCourse(courseId, token) {
  const res = await fetch(`${CODEBRIDGE_BASE}/enrollments/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to drop course');
  }
  return data;
}
