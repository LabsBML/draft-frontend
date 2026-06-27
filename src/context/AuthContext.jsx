// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // ← CRITICAL: Prevents premature route kicks

  useEffect(() => {
    // 1. On initial mount, hydrate the state from localStorage
    const savedToken = localStorage.getItem('cp_token');
    const savedUserId = localStorage.getItem('cp_user_id');

    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUserId(savedUserId);
    }
    
    // 2. Hydration complete, lift the gate
    setLoading(false);
  }, []);

  const login = (accessToken, id) => {
    localStorage.setItem('cp_token', accessToken);
    localStorage.setItem('cp_user_id', id);
    setToken(accessToken);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user_id');
    setToken(null);
    setUserId(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, userId, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);