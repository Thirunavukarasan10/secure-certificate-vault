import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import {
  getAllCertificates,
  getCertificatesByDepartment,
  getRecentActivity,
  getUniqueStudentCount,
  getUploadsOverTime,
} from '../../utils/demoStorage.js';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function Analytics() {
  const [certs, setCerts] = useState([]);
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
    const certsData = getAllCertificates();
    setCerts(Array.isArray(certsData) ? certsData : []);
    
    const deptData = getCertificatesByDepartment();
    setDepartmentData(deptData);
    
    const recent = getRecentActivity(5);
    setRecentActivity(recent);
    
    const timeData = getUploadsOverTime();
    setUploadsOverTime(timeData);
    
    const uniqueStudents = getUniqueStudentCount();
    setTotalStudents(uniqueStudents);
  };

  // Aggregate certificates by month
  const byMonth = React.useMemo(() => {
    const counts = new Map();
    for (const c of certs) {
      const dateStr = c.uploadDate || c.timestamp || c.issuedDate;
      if (!dateStr) continue;
      try {
        const date = new Date(dateStr);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        counts.set(monthKey, (counts.get(monthKey) || 0) + 1);
      } catch {
        // Skip invalid dates
      }
    }
    const arr = Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => ({
        month: key,
        count: value,
        label: new Date(key + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      }));
    return arr;
  }, [certs]);

  // Calculate metrics
  const totalCertificates = certs.length;
  const monthsTracked = byMonth.length;
  const maxUploads = byMonth.reduce((max, item) => Math.max(max, item.count), 0) || 1;

  // Calculate percentage change
  const uploadsChange = byMonth.length > 1 
    ? Math.round(((byMonth[byMonth.length - 1].count - byMonth[0].count) / Math.max(byMonth[0].count, 1)) * 100)
    : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={nav} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Analytics</h2>

          {/* Key Metrics */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                    Total Certificates
                  </div>
                  <div className="text-4xl font-bold">{totalCertificates.toLocaleString()}</div>
                  {uploadsChange !== 0 && (
                    <div className="mt-2 flex items-center text-sm">
                      {uploadsChange > 0 ? (
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      ) : (
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      )}
                      <span>{Math.abs(uploadsChange)}%</span>
                    </div>
                  )}
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-100">
                    Months Tracked (Uploads)
                  </div>
                  <div className="text-4xl font-bold">{monthsTracked}</div>
                  <div className="mt-2 text-sm text-green-100">
                    {byMonth.length > 0 ? `Since ${byMonth[0].label}` : 'No data'}
                  </div>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-purple-100">
                    Total Students
                  </div>
                  <div className="text-4xl font-bold">{totalStudents.toLocaleString()}</div>
                  <div className="mt-2 text-sm text-purple-100">
                    Unique student IDs
                  </div>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Uploads Over Time - Line Chart */}
            <Card className="transition-all duration-300 hover:shadow-lg" title="Uploads Over Time">
              <div className="h-64 w-full p-4">
                {byMonth.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No upload data available
                  </div>
                ) : (
                  <div className="relative h-full w-full">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-gray-500">
                      {[maxUploads, Math.floor(maxUploads * 0.75), Math.floor(maxUploads * 0.5), Math.floor(maxUploads * 0.25), 0].map((val) => (
                        <span key={val}>{val}</span>
                      ))}
                    </div>
                    
                    {/* Chart area */}
                    <div className="ml-8 h-full">
                      <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((y) => (
                          <line
                            key={y}
                            x1="0"
                            y1={y * 180}
                            x2="100%"
                            y2={y * 180}
                            stroke="#E5E7EB"
                            strokeWidth="1"
                          />
                        ))}
                        
                        {/* Area fill */}
                        {byMonth.length > 0 && (
                          <path
                            d={`M 0 ${180} ${byMonth.map((item, i) => 
                              `L ${(i / (byMonth.length - 1 || 1)) * 380} ${180 - (item.count / maxUploads) * 160}`
                            ).join(' ')} L ${380} ${180} Z`}
                            fill="url(#uploadGradient)"
                          />
                        )}
                        
                        {/* Line */}
                        {byMonth.length > 0 && (
                          <polyline
                            points={byMonth.map((item, i) => 
                              `${(i / (byMonth.length - 1 || 1)) * 380},${180 - (item.count / maxUploads) * 160}`
                            ).join(' ')}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                        
                        {/* Data points */}
                        {byMonth.map((item, i) => {
                          const x = (i / (byMonth.length - 1 || 1)) * 380;
                          const y = 180 - (item.count / maxUploads) * 160;
                          return (
                            <g key={item.month}>
                              <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#3B82F6"
                                stroke="white"
                                strokeWidth="2"
                              />
                              <text
                                x={x}
                                y={y - 8}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#3B82F6"
                                fontWeight="bold"
                              >
                                {item.count}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* X-axis labels */}
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        {byMonth.map((item, i) => (
                          <span key={item.month} className="transform -rotate-45 origin-left" style={{ width: `${100 / byMonth.length}%` }}>
                            {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Department Distribution - Bar Chart */}
            <Card className="transition-all duration-300 hover:shadow-lg" title="Department Distribution">
              <div className="h-64 w-full p-4">
                {departmentData.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No department data available
                  </div>
                ) : (
                  <div className="relative h-full w-full">
                    <div className="ml-8 h-full">
                      <div className="flex h-full items-end justify-between gap-2">
                        {departmentData
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 5)
                          .map((dept, index) => {
                            const maxCount = Math.max(...departmentData.map(d => d.count), 1);
                            const height = (dept.count / maxCount) * 100;
                            return (
                              <div key={dept.department} className="flex-1 flex flex-col items-center">
                                <div className="relative w-full" style={{ height: '180px' }}>
                                  <div
                                    className="w-full rounded-t transition-all duration-500 hover:opacity-80"
                                    style={{
                                      height: `${height}%`,
                                      background: `linear-gradient(to top, 
                                        rgba(139, 92, 246, 0.9) ${100 - height}%, 
                                        rgba(167, 139, 250, 0.7) 100%)`,
                                      minHeight: height > 0 ? '4px' : '0',
                                    }}
                                    title={`${dept.department}: ${dept.count} certificates`}
                                  >
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-purple-700">
                                      {dept.count > 0 && dept.count}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 transform -rotate-45 origin-center whitespace-nowrap">
                                  {dept.department.length > 10 ? dept.department.substring(0, 10) + '...' : dept.department}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Additional Statistics */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="transition-all duration-300 hover:shadow-lg" title="Recent Activity">
              <div className="space-y-3">
                {recentActivity.map((cert, index) => (
                  <div key={cert.uniqueId || cert.id || index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{cert.certificateTitle}</div>
                      <div className="text-xs text-gray-500">
                        {cert.studentName} • {cert.uniqueId || cert.id}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {(cert.uploadDate || cert.timestamp || cert.issuedDate) 
                        ? new Date(cert.uploadDate || cert.timestamp || cert.issuedDate).toLocaleDateString() 
                        : '—'}
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="py-4 text-center text-sm text-gray-500">No recent activity</div>
                )}
              </div>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg" title="Department Distribution">
              <div className="space-y-3">
                {departmentData.length > 0 ? (
                  departmentData
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((dept) => {
                      const maxCount = Math.max(...departmentData.map(d => d.count), 1);
                      return (
                        <div key={dept.department}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-900">{dept.department}</span>
                            <span className="text-gray-600">{dept.count}</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                              style={{ width: `${(dept.count / maxCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="py-4 text-center text-sm text-gray-500">No department data</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
