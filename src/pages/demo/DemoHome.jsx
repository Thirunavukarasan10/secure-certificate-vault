import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card.jsx';

export default function DemoHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Secure Academic Certificate Vault
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Frontend-Only Demo - Experience the full certificate management system
            without backend dependencies
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {/* Admin Dashboard */}
          <Link to="/demo/admin">
            <Card className="bg-white shadow-lg rounded-xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-green-100 p-4">
                    <svg
                      className="h-12 w-12 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-green-800 mb-2">
                  Admin Dashboard
                </h2>
                <p className="text-gray-600 mb-4">
                  Upload certificates, generate unique IDs, and create QR codes
                </p>
                <ul className="text-sm text-left text-gray-500 space-y-1">
                  <li>• Upload form with validation</li>
                  <li>• Auto-generate certificate IDs</li>
                  <li>• QR code generation</li>
                  <li>• Certificate management table</li>
                </ul>
              </div>
            </Card>
          </Link>

          {/* Student Dashboard */}
          <Link to="/demo/student">
            <Card className="bg-white shadow-lg rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-blue-100 p-4">
                    <svg
                      className="h-12 w-12 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-2">
                  Student Dashboard
                </h2>
                <p className="text-gray-600 mb-4">
                  View and download your certificates with QR codes
                </p>
                <ul className="text-sm text-left text-gray-500 space-y-1">
                  <li>• Simple Student ID login</li>
                  <li>• View all certificates</li>
                  <li>• QR code display</li>
                  <li>• Download functionality</li>
                </ul>
              </div>
            </Card>
          </Link>

          {/* Analytics Dashboard */}
          <Link to="/demo/analytics">
            <Card className="bg-white shadow-lg rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-purple-100 p-4">
                    <svg
                      className="h-12 w-12 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-purple-800 mb-2">
                  Analytics Dashboard
                </h2>
                <p className="text-gray-600 mb-4">
                  Real-time statistics and visualizations
                </p>
                <ul className="text-sm text-left text-gray-500 space-y-1">
                  <li>• Total certificates count</li>
                  <li>• Department distribution chart</li>
                  <li>• Recent activity feed</li>
                  <li>• Real-time updates</li>
                </ul>
              </div>
            </Card>
          </Link>
        </div>

        {/* Info Section */}
        <Card className="bg-white shadow-lg rounded-xl border-2 border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How to Use This Demo
          </h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <span className="font-bold text-green-600">1.</span>
              <div>
                <strong>Start with Admin Dashboard:</strong> Upload certificates
                by filling in student details and selecting a file. Each upload
                generates a unique certificate ID (CERT-&lt;STUDENTID&gt;-&lt;RANDOM4DIGIT&gt;)
                and a QR code.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <div>
                <strong>View in Student Dashboard:</strong> Enter the Student ID
                you used when uploading. You'll see all certificates for that
                student with QR codes and download options.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-purple-600">3.</span>
              <div>
                <strong>Check Analytics:</strong> The Analytics Dashboard shows
                real-time statistics, department distribution charts, and recent
                activity. It updates automatically as you upload more certificates.
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a frontend-only demo. All data is
                stored in your browser's localStorage and will persist until you
                clear your browser data.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

