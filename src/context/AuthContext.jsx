import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sav_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
  }, [user]);

  const login = (payload) => {
    // payload: { role, identifier, name, email }
    setUser({
      id: `${payload.role}-${Date.now()}`,
      role: payload.role,
      name: payload.name || 'User',
      email: payload.email || 'user@example.com',
      extra: payload.extra || {},
    });
    return true;
  };

  const register = (payload) => {
    // For mock UI, same as login
    setUser({
      id: `${payload.role}-${Date.now()}`,
      role: payload.role,
      name: payload.name || 'User',
      email: payload.email || 'user@example.com',
      extra: payload.extra || {},
    });
    return true;
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, isAuthenticated: !!user, role: user?.role, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
