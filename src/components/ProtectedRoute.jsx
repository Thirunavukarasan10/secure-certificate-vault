import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ allow }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (allow && allow.length > 0 && !allow.includes(role)) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
