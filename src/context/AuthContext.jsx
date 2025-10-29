import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sav_user';
const TOKEN_KEY = 'token';

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

  const login = (authData) => {
    // authData: { token, role, userId, identifier, name }
    try {
      if (authData?.token) localStorage.setItem(TOKEN_KEY, authData.token);
      const mappedRole = authData?.role === 'HOD' ? 'admin' : (authData?.role === 'EMPLOYER' ? 'employer' : 'student');
      const nextUser = {
        id: authData?.userId,
        role: mappedRole,
        identifier: authData?.identifier,
        name: authData?.name,
      };
      setUser(nextUser);
      return true;
    } catch {
      return false;
    }
  };

  const register = () => true;

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setUser(null);
  };

  const value = useMemo(() => ({ user, isAuthenticated: !!localStorage.getItem(TOKEN_KEY), role: user?.role, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}