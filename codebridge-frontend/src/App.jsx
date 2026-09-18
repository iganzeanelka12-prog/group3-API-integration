import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

import Home from './pages/Home';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Courses from './pages/Courses';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/courses" element={<Courses onShowToast={showToast} />} />
              
              {/* Auth Routes */}
              <Route path="/register" element={<Register onShowToast={showToast} />} />
              <Route path="/login" element={<Login onShowToast={showToast} />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard onShowToast={showToast} />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Toast Notification */}
          <Toast toast={toast} onClose={closeToast} />
        </div>
      </Router>
    </AuthProvider>
  );
}
