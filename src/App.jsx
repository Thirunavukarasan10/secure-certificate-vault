import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Error404 from './pages/Error404.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ROLES, ROUTE_DEFAULTS } from './utils/constants.js';

// Student
import StudentCerts from './pages/student/MyCertificates.jsx';
import StudentDownloads from './pages/student/DownloadHistory.jsx';
import StudentProfile from './pages/student/Profile.jsx';

// Admin
import AdminUpload from './pages/admin/UploadCertificate.jsx';
import AdminManage from './pages/admin/ManageCertificates.jsx';
import AdminAnalytics from './pages/admin/Analytics.jsx';
import AdminProfile from './pages/admin/Profile.jsx';

// Employer
import Verify from './pages/employer/VerifyCertificate.jsx';
import VerifyHistory from './pages/employer/VerificationHistory.jsx';
import EmployerProfile from './pages/employer/Profile.jsx';

import { useAuth } from './context/AuthContext.jsx';

function RoleRedirect() {
  const { role } = useAuth();
  if (!role) return <Navigate to="/auth" replace />;
  return <Navigate to={ROUTE_DEFAULTS[role]} replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}> 
          <Route path="/dashboard" element={<RoleRedirect />} />
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute allow={[ROLES.STUDENT]} />}> 
          <Route path="/student/certificates" element={<StudentCerts />} />
          <Route path="/student/downloads" element={<StudentDownloads />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allow={[ROLES.ADMIN]} />}> 
          <Route path="/admin/upload" element={<AdminUpload />} />
          <Route path="/admin/manage" element={<AdminManage />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* Employer */}
        <Route element={<ProtectedRoute allow={[ROLES.EMPLOYER]} />}> 
          <Route path="/employer/verify" element={<Verify />} />
          <Route path="/employer/history" element={<VerifyHistory />} />
          <Route path="/employer/profile" element={<EmployerProfile />} />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}
