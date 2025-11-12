import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import { getVerificationHistory } from '../../utils/demoStorage.js';

const nav = [
  { to: '/employer/verify', label: 'Verify Certificate' },
  { to: '/employer/history', label: 'Verification History' },
  { to: '/employer/profile', label: 'Profile' },
];

export default function VerificationHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
    
    // Refresh every 2 seconds to catch new verifications
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadHistory = () => {
    try {
      setLoading(true);
      const data = getVerificationHistory();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading verification history:', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString.replace('T', ' ').slice(0, 19);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={nav} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Verification History
            </h2>
            <div className="text-sm text-gray-500">
              {rows.length} verification{rows.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading && rows.length === 0 ? (
            <Card className="py-12 text-center">
              <div className="text-gray-500">Loading verification history...</div>
            </Card>
          ) : rows.length === 0 ? (
            <Card className="py-12 text-center">
              <div className="text-gray-500">
                No verifications yet. Verify a certificate to see history here.
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">
                        Unique ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Certificate Details
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Verified At
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rows.map((r) => (
                      <tr
                        key={r.id}
                        className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-xs">
                          {r.uniqueId}
                        </td>
                        <td className="px-4 py-3">
                          {r.certificate ? (
                            <div>
                              <div className="font-medium text-gray-900">
                                {r.certificate.certificateTitle}
                              </div>
                              <div className="text-xs text-gray-500">
                                {r.certificate.studentName} • {r.certificate.studentId}
                              </div>
                              <div className="text-xs text-gray-400">
                                {r.certificate.department}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatDateTime(r.verifiedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              r.valid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {r.valid ? (
                              <>
                                <svg
                                  className="mr-1 h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Valid
                              </>
                            ) : (
                              <>
                                <svg
                                  className="mr-1 h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Invalid
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
