import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../../components/Card.jsx';
import {
  getAllCertificates,
  getCertificatesByDepartment,
  getRecentActivity,
  getUniqueStudentCount,
  getUploadsOverTime,
} from '../../utils/demoStorage.js';

export default function AnalyticsDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [uploadsOverTime, setUploadsOverTime] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    loadData();
    
    // Refresh data every 2 seconds to show real-time updates
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const certs = getAllCertificates();
    setCertificates(certs);
    
    const deptData = getCertificatesByDepartment();
    setDepartmentData(deptData);
    
    const recent = getRecentActivity(5);
    setRecentActivity(recent);
    
    const timeData = getUploadsOverTime();
    setUploadsOverTime(timeData);
    
    const uniqueStudents = getUniqueStudentCount();
    setTotalStudents(uniqueStudents);
  };

  const totalCertificates = certificates.length;
  const totalDepartments = departmentData.length;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Prepare chart data
  const chartData = departmentData.map((dept) => ({
    name: dept.department.length > 15 
      ? dept.department.substring(0, 15) + '...' 
      : dept.department,
    fullName: dept.department,
    count: dept.count,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-purple-700">
            Insights and statistics for certificate management
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg rounded-xl border-2 border-purple-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-purple-100">
                  Total Certificates Uploaded
                </div>
                <div className="text-4xl font-bold">{totalCertificates}</div>
                <div className="mt-2 text-sm text-purple-100">
                  All uploaded certificates
                </div>
              </div>
              <div className="rounded-full bg-white/20 p-3">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg rounded-xl border-2 border-indigo-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-100">
                  Total Students
                </div>
                <div className="text-4xl font-bold">{totalStudents}</div>
                <div className="mt-2 text-sm text-indigo-100">
                  Unique student IDs
                </div>
              </div>
              <div className="rounded-full bg-white/20 p-3">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg rounded-xl border-2 border-pink-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-pink-100">
                  Departments
                </div>
                <div className="text-4xl font-bold">{totalDepartments}</div>
                <div className="mt-2 text-sm text-pink-100">
                  Active departments
                </div>
              </div>
              <div className="rounded-full bg-white/20 p-3">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          {/* Uploads by Department - Bar Chart */}
          <Card className="bg-white shadow-lg rounded-xl border-2 border-purple-200">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">
              Uploads by Department
            </h2>
            {chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available. Upload certificates to see statistics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => [
                      value,
                      'Certificates',
                    ]}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.fullName;
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#9333ea"
                    name="Certificates"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Uploads Over Time - Line Chart */}
          <Card className="bg-white shadow-lg rounded-xl border-2 border-purple-200">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">
              Uploads Over Time
            </h2>
            {uploadsOverTime.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available. Upload certificates to see statistics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={uploadsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, 'Certificates']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#9333ea"
                    strokeWidth={2}
                    name="Certificates"
                    dot={{ fill: '#9333ea', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-lg rounded-xl border-2 border-purple-200">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">
              Recent Activity
            </h2>
            {recentActivity.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                No recent activity
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((cert, index) => (
                  <div
                    key={cert.uniqueId || cert.id || index}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {cert.certificateTitle}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {cert.studentName} •{' '}
                        <span className="font-mono text-purple-600">
                          {cert.uniqueId || cert.id}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 ml-4">
                      {formatDate(cert.uploadDate || cert.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Department Distribution Table */}
        {departmentData.length > 0 && (
          <Card className="bg-white shadow-lg rounded-xl border-2 border-purple-200">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">
              Department Distribution
            </h2>
            <div className="space-y-3">
              {departmentData
                .sort((a, b) => b.count - a.count)
                .map((dept, index) => {
                  const maxCount = Math.max(
                    ...departmentData.map((d) => d.count),
                    1
                  );
                  const percentage = (dept.count / maxCount) * 100;
                  return (
                    <div key={dept.department}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">
                          {dept.department}
                        </span>
                        <span className="text-gray-600 font-semibold">
                          {dept.count}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

