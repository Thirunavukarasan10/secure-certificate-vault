import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import {
  getCertificateByUniqueId,
  saveVerification,
} from '../../utils/demoStorage.js';

const nav = [
  { to: '/employer/verify', label: 'Verify Certificate' },
  { to: '/employer/history', label: 'Verification History' },
  { to: '/employer/profile', label: 'Profile' },
];

export default function VerifyCertificate() {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState(null);
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const onVerify = (e) => {
    e.preventDefault();
    if (!certId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setCert(null);

      // Find certificate in localStorage
      const foundCert = getCertificateByUniqueId(certId.trim());

      if (foundCert) {
        // Certificate found - valid
        setCert(foundCert);
        setResult({
          status: 'Valid',
          message: 'Certificate is authentic and verified.',
        });

        // Save to verification history
        saveVerification(certId.trim(), true, foundCert);
        toast.success('Certificate verified successfully!');
      } else {
        // Certificate not found - invalid
        setCert(null);
        setResult({
          status: 'Invalid',
          message: 'No record found for this certificate ID.',
        });

        // Save invalid verification to history
        saveVerification(certId.trim(), false, null);
        toast.error('Certificate not found');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setCert(null);
      setResult({
        status: 'Invalid',
        message: 'Failed to verify certificate. Please try again.',
      });
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = () => {
    // Placeholder for QR scanner functionality
    toast.info('QR scanner feature coming soon. Please enter the certificate ID manually.');
  };

  const qrUrl = cert
    ? cert.qrUrl || cert.verificationUrl || `https://securevault.verifier/verify?certId=${cert.uniqueId || cert.id}`
    : null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={nav} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Verify Certificate
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* QR Code Display Section */}
            <Card
              className="transition-all duration-300 hover:shadow-lg"
              title="QR Code"
            >
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                {result?.status === 'Valid' && cert && qrUrl ? (
                  <>
                    <div className="rounded-lg border-4 border-green-500 bg-white p-4 shadow-lg">
                      <QRCodeCanvas value={qrUrl} size={192} />
                    </div>
                    <p className="text-sm text-green-600 font-semibold">
                      Verified Certificate
                    </p>
                  </>
                ) : result?.status === 'Valid' && cert ? (
                  <>
                    <div className="rounded-lg border-4 border-green-500 bg-white p-4 shadow-lg">
                      <QRCodeCanvas
                        value={`https://securevault.verifier/verify?certId=${encodeURIComponent(
                          cert.uniqueId || cert.id
                        )}`}
                        size={192}
                      />
                    </div>
                    <p className="text-sm text-green-600 font-semibold">
                      Verified Certificate
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                          />
                        </svg>
                        <p className="mt-2 text-xs text-gray-500">
                          Enter Certificate ID to verify
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleQRScan}
                      variant="outline"
                      className="w-full"
                    >
                      Scan QR Code
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Certificate ID Input Section */}
            <Card
              className="transition-all duration-300 hover:shadow-lg"
              title="Enter Certificate ID"
            >
              <form onSubmit={onVerify} className="space-y-4">
                <Input
                  placeholder="e.g. CERT-22CS123-1234"
                  onChange={(e) => setCertId(e.target.value)}
                  value={certId}
                  required
                  className="w-full"
                  label="Unique Certificate ID"
                  hint="Enter the unique certificate ID or scan the QR code"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Certificate'}
                </Button>
              </form>

              {result && (
                <div
                  className={`mt-6 rounded-lg border-2 p-4 ${
                    result.status === 'Valid'
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.status === 'Valid' ? (
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    <div>
                      <div
                        className={`font-semibold ${
                          result.status === 'Valid'
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}
                      >
                        {result.status === 'Valid'
                          ? 'Certificate Verified'
                          : 'No Record Found'}
                      </div>
                      <div
                        className={`text-sm ${
                          result.status === 'Valid'
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}
                      >
                        {result.message}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Certificate Details Section */}
          {result?.status === 'Valid' && cert && (
            <Card
              className="mt-6 transition-all duration-300 hover:shadow-lg"
              title="Certificate Details"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Certificate Title
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {cert.certificateTitle}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Student Name
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {cert.studentName}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Student ID
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {cert.studentId}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Department
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {cert.department}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Unique Certificate ID
                  </div>
                  <div className="mt-1 font-mono text-sm font-medium text-blue-600">
                    {cert.uniqueId || cert.id}
                  </div>
                </div>
                {(cert.uploadDate || cert.timestamp || cert.issuedDate) && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Issued Date
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(
                        cert.uploadDate || cert.timestamp || cert.issuedDate
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
