import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
// No backend endpoint yet; show only empty state (no mock rows)

const nav = [
  { to: '/student/certificates', label: 'My Certificates' },
  { to: '/student/downloads', label: 'Download History' },
  { to: '/student/profile', label: 'Profile' },
];

export default function DownloadHistory() {
  const rows = [];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Download History</h2>
        <div className="overflow-hidden rounded-lg border border-black/10">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Unique ID</th>
                <th className="px-3 py-2 text-left font-medium">Date</th>
                <th className="px-3 py-2 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td className="px-3 py-2" colSpan={3}>No downloads yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
