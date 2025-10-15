import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';

const nav = [
  { to: '/employer/verify', label: 'Verify Certificate' },
  { to: '/employer/history', label: 'Verification History' },
  { to: '/employer/profile', label: 'Profile' },
];

export default function VerificationHistory() {
  const rows = [
    { id: 'CERT-2023-0001', date: '2024-03-12', status: 'Valid' },
    { id: 'CERT-2023-0003', date: '2024-06-01', status: 'Invalid' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Verification History</h2>
        <div className="overflow-hidden rounded-lg border border-black/10">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Unique ID</th>
                <th className="px-3 py-2 text-left font-medium">Date</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-3 py-2 font-mono">{r.id}</td>
                  <td className="px-3 py-2">{r.date}</td>
                  <td className="px-3 py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
