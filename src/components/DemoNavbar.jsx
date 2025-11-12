import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function DemoNavbar() {
  const location = useLocation();

  const navItems = [
    { path: '/demo', label: 'Home', icon: '🏠' },
    { path: '/demo/admin', label: 'Admin', icon: '🟩', color: 'green' },
    { path: '/demo/student', label: 'Student', icon: '🟦', color: 'blue' },
    { path: '/demo/analytics', label: 'Analytics', icon: '🟪', color: 'purple' },
  ];

  return (
    <nav className="bg-white shadow-md border-b-2 border-gray-200">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/demo" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-500 text-white font-bold text-xl">
              S
            </div>
            <span className="text-xl font-bold text-gray-900">
              Secure Vault Demo
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const colorClasses = {
                green: isActive
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'hover:bg-green-50 text-gray-700',
                blue: isActive
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'hover:bg-blue-50 text-gray-700',
                purple: isActive
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'hover:bg-purple-50 text-gray-700',
                default: isActive
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : 'hover:bg-gray-50 text-gray-700',
              };

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-2 ${
                    colorClasses[item.color] || colorClasses.default
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

