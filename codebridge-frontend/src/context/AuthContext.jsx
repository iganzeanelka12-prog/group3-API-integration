import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('codebridge_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('codebridge_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Validate token on mount if present
  useEffect(() => {
    if (token && !user) {
      setLoading(true);
      fetchUserProfile(token)
        .then((data) => {
          setUser(data.user);
          localStorage.setItem('codebridge_user', JSON.stringify(data.user));
        })
        .catch(() => {
          // Token invalid or expired
          logout();
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('codebridge_token', newToken);
    localStorage.setItem('codebridge_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('codebridge_token');
    localStorage.removeItem('codebridge_user');
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
