import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Sidebar from '../../components/Sidebar.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import toast from 'react-hot-toast';
import {
  getAllCertificates,
  saveCertificate,
  generateCertificateId,
} from '../../utils/demoStorage.js';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function UploadCertificate() {
  const [form, setForm] = useState({
    studentId: '',
    studentName: '',
    department: '',
    certificateTitle: '',
  });
  const [file, setFile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [uploadedCert, setUploadedCert] = useState(null);
  const fileInputRef = React.useRef(null);

  // Load certificates on mount
  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = () => {
    const certs = getAllCertificates();
    setCertificates(certs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.studentId || !form.studentName || !form.department || !form.certificateTitle) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!file) {
      toast.error('Please select a certificate file');
      return;
    }

    try {
      // Generate unique certificate ID
      const uniqueId = generateCertificateId(form.studentId);
      
      // Generate QR URL
      const qrUrl = `https://securevault.verifier/verify?certId=${uniqueId}`;

      // Create certificate object matching exact specification
      const certificate = {
        studentId: form.studentId,
        studentName: form.studentName,
        department: form.department,
        certificateTitle: form.certificateTitle,
        uniqueId,
        qrUrl,
        fileName: file ? file.name : 'demo-file.pdf',
      };

      // Save to localStorage
      const savedCert = saveCertificate(certificate);
      setUploadedCert(savedCert);
      
      // Reload certificates list
      loadCertificates();

      // Show success toast
      toast.success('✅ Certificate uploaded successfully!', {
        duration: 5000,
      });

      // Reset form
      setForm({
        studentId: '',
        studentName: '',
        department: '',
        certificateTitle: '',
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload certificate');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const qrUrl = uploadedCert
    ? (uploadedCert.qrUrl || uploadedCert.verificationUrl)
    : null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={nav} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Upload Certificate</h2>
          
          <Card className="mb-6 transition-all duration-300 hover:shadow-lg">
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <Input 
                label="Student ID" 
                placeholder="e.g. 22CS123" 
                required 
                value={form.studentId} 
                onChange={(e) => setForm(f => ({ ...f, studentId: e.target.value }))} 
              />
              <Input 
                label="Student Name" 
                placeholder="Full name" 
                required 
                value={form.studentName} 
                onChange={(e) => setForm(f => ({ ...f, studentName: e.target.value }))} 
              />
              <Input 
                label="Department" 
                placeholder="e.g. Computer Science" 
                required 
                value={form.department} 
                onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} 
              />
              <Input 
                label="Certificate Title" 
                placeholder="e.g. Degree Certificate" 
                required 
                value={form.certificateTitle} 
                onChange={(e) => setForm(f => ({ ...f, certificateTitle: e.target.value }))} 
              />
              <label className="block text-sm md:col-span-2">
                <div className="mb-1 font-medium">Certificate File</div>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  className="input" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  accept=".pdf,.png,.jpg,.jpeg"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Accepted formats: PDF, PNG, JPG, JPEG</p>
              </label>
              <div className="md:col-span-2">
                <Button type="submit" variant="primary" className="w-full md:w-auto">
                  Upload Certificate
                </Button>
              </div>
            </form>
          </Card>

          {/* Upload Success Section */}
          {uploadedCert && (
            <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-green-800">Certificate Uploaded Successfully!</h3>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Certificate Details */}
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Unique Certificate ID</div>
                    <div className="mt-1 rounded bg-white px-3 py-2 font-mono text-lg font-bold text-green-600 shadow-sm">
                      {uploadedCert.uniqueId}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Format: CERT-&lt;STUDENTID&gt;-&lt;RANDOM4DIGIT&gt;</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Student Name</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">{uploadedCert.studentName}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Student ID</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">{uploadedCert.studentId}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Department</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">{uploadedCert.department}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Certificate Title</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">{uploadedCert.certificateTitle}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Uploaded At</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(uploadedCert.uploadDate || uploadedCert.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div>
                    <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">QR Code</div>
                    <div className="rounded-lg border-4 border-green-500 bg-white p-4 shadow-lg">
                      {qrUrl && <QRCodeCanvas value={qrUrl} size={192} />}
                    </div>
                    <p className="mt-2 text-center text-xs text-gray-500">QR code links to verification URL</p>
                  </div>
                  
                  <div className="w-full rounded bg-white p-3 text-center shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Verification URL</div>
                    <div className="mt-1 break-all text-xs text-green-600">
                      {qrUrl}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setUploadedCert(null);
                  }}
                >
                  Upload Another Certificate
                </Button>
              </div>
            </Card>
          )}

          {/* Certificates Table */}
          <Card className="bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              All Uploaded Certificates ({certificates.length})
            </h2>

            {certificates.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                No certificates uploaded yet. Upload your first certificate above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Certificate Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Unique ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Student Info
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                        QR Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Uploaded
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {certificates.map((cert) => {
                      const certQrUrl = cert.qrUrl || cert.verificationUrl || `https://securevault.verifier/verify?certId=${cert.uniqueId || cert.id}`;
                      return (
                        <tr
                          key={cert.uniqueId || cert.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {cert.certificateTitle}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                              {cert.uniqueId || cert.id}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div>{cert.studentName}</div>
                            <div className="text-xs text-gray-500">
                              {cert.studentId}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {cert.department}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              <div className="rounded border-2 border-green-300 bg-white p-2">
                                <QRCodeCanvas value={certQrUrl} size={64} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {formatDate(cert.uploadDate || cert.timestamp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
