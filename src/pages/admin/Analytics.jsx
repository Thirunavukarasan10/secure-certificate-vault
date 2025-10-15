import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function Analytics() {
  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Analytics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Total Certificates">
            <div className="text-3xl font-bold">1,248</div>
          </Card>
          <Card title="Monthly Uploads">
            <div className="text-3xl font-bold">86</div>
          </Card>
          <Card title="Verifications">
            <div className="text-3xl font-bold">421</div>
          </Card>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card title="Uploads Over Time">
            <div className="h-48 w-full bg-gray-100" />
          </Card>
          <Card title="Verifications Over Time">
            <div className="h-48 w-full bg-gray-100" />
          </Card>
        </div>
      </main>
    </div>
  );
}
