import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import { getCertificatesByStudentId } from '../../utils/demoStorage.js';
import { useAuth } from '../../context/AuthContext.jsx';

const nav = [
  { to: '/student/certificates', label: 'My Certificates' },
  { to: '/student/downloads', label: 'Download History' },
  { to: '/student/profile', label: 'Profile' },
];

export default function MyCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCertificates();
    
    // Refresh every 2 seconds to catch new uploads
    const interval = setInterval(loadCertificates, 2000);
    return () => clearInterval(interval);
  }, [user?.identifier]);

  const loadCertificates = () => {
    try {
      setLoading(true);
      if (!user?.identifier) {
        setMessage('Not logged in');
        setCertificates([]);
        setLoading(false);
        return;
      }

      const studentCerts = getCertificatesByStudentId(user.identifier);
      
      if (Array.isArray(studentCerts)) {
        setCertificates(studentCerts);
        if (studentCerts.length === 0) {
          setMessage('No certificates found. Certificates will appear here once they are issued.');
        } else {
          setMessage('');
        }
      } else {
        setCertificates([]);
        setMessage('No certificates found');
      }
    } catch (e) {
      console.error('Error loading certificates:', e);
      setMessage('Failed to load certificates');
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const handleDownloadClick = (cert) => {
    // Mock download - in real app, this would download the actual file
    toast.success(`Downloading ${cert.certificateTitle}...`);
    // Simulate download
    setTimeout(() => {
      toast.success('Download complete!');
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={nav} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h2>
          
          {/* Certificates Section */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">My Certificates</h3>
            {certificates.length > 0 && (
              <span className="text-sm text-gray-500">
                {certificates.length} certificate{certificates.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading && certificates.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : (
            <>
              {message && certificates.length === 0 && (
                <Card className="mb-4">
                  <div className="text-sm text-gray-600">{message}</div>
                </Card>
              )}
              
              {certificates.length === 0 ? (
                <Card className="py-12 text-center">
                  <div className="text-gray-500">
                    No certificates found. Certificates will appear here once they are issued.
                  </div>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {certificates.map((cert) => {
                    const uniqueId = cert.uniqueId || cert.id;
                    const qrUrl =
                      cert.qrUrl ||
                      cert.verificationUrl ||
                      `https://securevault.verifier/verify?certId=${uniqueId}`;
                    
                    return (
                      <Card
                        key={uniqueId}
                        className="transition-all duration-300 hover:shadow-lg"
                        title={cert.certificateTitle}
                        actions={
                          <Button variant="outline" onClick={() => handleDownloadClick(cert)}>
                            Download
                          </Button>
                        }
                      >
                        <div className="space-y-4">
                          {/* Certificate Details */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Unique ID</span>
                              <span className="rounded bg-blue-50 px-2 py-1 text-xs font-mono text-blue-700">{uniqueId}</span>
                            </div>
                            {(cert.uploadDate || cert.timestamp || cert.issuedDate) && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Issued Date</span>
                                <span className="text-xs text-gray-700">
                                  {formatDate(cert.uploadDate || cert.timestamp || cert.issuedDate)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Department</span>
                              <span className="text-xs text-gray-700">{cert.department}</span>
                            </div>
                          </div>

                          {/* QR Code Section */}
                          <div className="border-t pt-4">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 text-center">QR Code</div>
                            <div className="flex items-center justify-center mb-4">
                              <div className="rounded border-2 border-blue-300 bg-white p-3">
                                <QRCodeCanvas value={qrUrl} size={120} />
                              </div>
                            </div>
                            <p className="text-xs text-center text-gray-500">
                              Scan to verify certificate
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
