import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Input from '../../components/Input.jsx';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import {
  getAllCertificates,
  deleteCertificateByUniqueId,
} from '../../utils/demoStorage.js';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadCertificates();
    
    // Refresh every 2 seconds to catch new uploads
    const interval = setInterval(loadCertificates, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadCertificates = () => {
    try {
      setLoading(true);
      const data = getAllCertificates();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load certificates:', error);
      toast.error('Failed to load certificates');
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (uniqueId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    try {
      setDeleteLoading(uniqueId);
      deleteCertificateByUniqueId(uniqueId);
      setCertificates(certificates.filter(c => (c.uniqueId || c.id) !== uniqueId));
      toast.success('Certificate deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete certificate');
    } finally {
      setDeleteLoading(null);
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

  // Get unique departments for filter
  const departments = React.useMemo(() => {
    const depts = new Set();
    certificates.forEach(cert => {
      if (cert.department) {
        depts.add(cert.department);
      }
    });
    return Array.from(depts).sort();
  }, [certificates]);

  // Filter certificates
  const filteredCertificates = React.useMemo(() => {
    return certificates.filter(cert => {
      const matchesSearch = searchTerm === '' || 
        cert.certificateTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cert.uniqueId || cert.id)?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = filterDepartment === '' || cert.department === filterDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [certificates, searchTerm, filterDepartment]);

  const qrUrl = (uniqueId) => {
    const id = uniqueId || '';
    return `https://securevault.verifier/verify?certId=${encodeURIComponent(id)}`;
  };

  if (loading && certificates.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar items={nav} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading certificates...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={nav} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Manage Certificates</h2>
            <div className="text-sm text-gray-500">
              {filteredCertificates.length} of {certificates.length} certificate{certificates.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-6 bg-white transition-all duration-300 hover:shadow-lg">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Search"
                placeholder="Search by certificate title, student name, ID, or unique ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div>
                <label className="block text-sm">
                  <div className="mb-1 font-medium">Filter by Department</div>
                  <select
                    className="input w-full"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {(searchTerm || filterDepartment) && (
              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDepartment('');
                  }}
                  className="text-sm"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </Card>

          {/* Certificates List */}
          {filteredCertificates.length === 0 ? (
            <Card className="py-12 text-center">
              <div className="text-gray-500">
                {certificates.length === 0 
                  ? 'No certificates found. Upload certificates to get started.'
                  : 'No certificates match your search criteria.'}
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCertificates.map((cert) => {
                const uniqueId = cert.uniqueId || cert.id;
                const certQrUrl = cert.qrUrl || cert.verificationUrl || qrUrl(uniqueId);
                
                return (
                  <Card
                    key={uniqueId}
                    className="transition-all duration-300 hover:shadow-lg"
                    title={cert.certificateTitle}
                    actions={
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(uniqueId)}
                        disabled={deleteLoading === uniqueId}
                        className="text-red-600 hover:text-red-700"
                      >
                        {deleteLoading === uniqueId ? 'Deleting...' : 'Delete'}
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
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Student Name</span>
                          <span className="text-xs font-medium text-gray-900">{cert.studentName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Student ID</span>
                          <span className="text-xs font-medium text-gray-900">{cert.studentId}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Department</span>
                          <span className="text-xs font-medium text-gray-900">{cert.department}</span>
                        </div>
                        {(cert.uploadDate || cert.timestamp || cert.issuedDate) && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Uploaded Date</span>
                            <span className="text-xs font-medium text-gray-900">
                              {formatDate(cert.uploadDate || cert.timestamp || cert.issuedDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* QR Code Section */}
                      <div className="border-t pt-4">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 text-center">QR Code</div>
                        <div className="flex items-center justify-center">
                          <div className="rounded border-2 border-blue-300 bg-white p-2">
                            <QRCodeCanvas value={certQrUrl} size={96} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
