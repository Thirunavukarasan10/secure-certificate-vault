import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import Card from '../../components/Card.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { getCertificatesByStudentId } from '../../utils/demoStorage.js';

export default function StudentDashboard() {
  const [studentId, setStudentId] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if student ID is in localStorage (simple persistence)
  useEffect(() => {
    const savedStudentId = localStorage.getItem('demo_student_id');
    if (savedStudentId) {
      setStudentId(savedStudentId);
      handleLogin(savedStudentId, false);
    }
  }, []);

  const handleLogin = (id = studentId, showToast = true) => {
    if (!id || id.trim() === '') {
      if (showToast) toast.error('Please enter a Student ID');
      return;
    }

    setLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      const studentCerts = getCertificatesByStudentId(id.trim());
      
      if (studentCerts.length === 0) {
        if (showToast) {
          toast.error(`No certificates found for Student ID: ${id}`);
        }
        setIsLoggedIn(false);
        setCertificates([]);
      } else {
        setIsLoggedIn(true);
        setCertificates(studentCerts);
        localStorage.setItem('demo_student_id', id.trim());
        if (showToast) {
          toast.success(`Found ${studentCerts.length} certificate(s)!`);
        }
      }
      
      setLoading(false);
    }, 300);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentId('');
    setCertificates([]);
    localStorage.removeItem('demo_student_id');
    toast.success('Logged out successfully');
  };

  const handleDownload = (cert) => {
    // Mock download - in real app, this would download the actual file
    toast.success(`Downloading ${cert.certificateTitle}...`);
    // Simulate download
    setTimeout(() => {
      toast.success('Download complete!');
    }, 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            Student Dashboard
          </h1>
          <p className="text-blue-700">
            View and download your academic certificates
          </p>
        </div>

        {/* Login Section */}
        {!isLoggedIn ? (
          <Card className="bg-white shadow-lg rounded-xl border-2 border-blue-200 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              Student Login
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <Input
                label="Student ID"
                placeholder="e.g. 22CS123"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View Certificates'}
              </Button>
            </form>
            <p className="mt-4 text-xs text-gray-500 text-center">
              Enter a Student ID that has certificates uploaded by an admin
            </p>
          </Card>
        ) : (
          <>
            {/* Welcome Section */}
            <Card className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Welcome, {certificates[0]?.studentName || 'Student'}!
                  </h2>
                  <p className="text-blue-100">
                    Student ID: {studentId} • {certificates.length} certificate
                    {certificates.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Logout
                </Button>
              </div>
            </Card>

            {/* Certificates Grid */}
            {certificates.length === 0 ? (
              <Card className="bg-white shadow-lg rounded-xl border-2 border-blue-200">
                <div className="py-12 text-center text-gray-500">
                  No certificates found for this Student ID.
                </div>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {certificates.map((cert) => {
                  const qrUrl =
                    cert.qrUrl ||
                    cert.verificationUrl ||
                    `https://securevault.verifier/verify?certId=${cert.uniqueId || cert.id}`;
                  return (
                    <Card
                      key={cert.uniqueId || cert.id}
                      className="bg-white shadow-lg rounded-xl border-2 border-blue-200 transition-all duration-300 hover:shadow-xl hover:scale-105"
                    >
                      <div className="space-y-4">
                        {/* Certificate Title */}
                        <div>
                          <h3 className="text-lg font-semibold text-blue-800 mb-1">
                            {cert.certificateTitle}
                          </h3>
                          <div className="text-xs text-gray-500">
                            {formatDate(cert.uploadDate || cert.timestamp)}
                          </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Unique ID
                            </span>
                            <span className="rounded bg-blue-50 px-2 py-1 text-xs font-mono text-blue-700">
                              {cert.uniqueId || cert.id}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Department
                            </span>
                            <span className="text-xs text-gray-700">
                              {cert.department}
                            </span>
                          </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="border-t pt-4">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 text-center">
                            QR Code
                          </div>
                          <div className="flex items-center justify-center mb-4">
                            <div className="rounded border-2 border-blue-300 bg-white p-3">
                              <QRCodeCanvas value={qrUrl} size={120} />
                            </div>
                          </div>
                          <p className="text-xs text-center text-gray-500 mb-4">
                            Scan to verify certificate
                          </p>
                        </div>

                        {/* Download Button */}
                        <Button
                          variant="primary"
                          onClick={() => handleDownload(cert)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                        >
                          Download Certificate
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

