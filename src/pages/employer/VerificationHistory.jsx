import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import { fetchMyVerificationHistory } from '../../lib/api.js';
// No backend endpoint yet; show only empty state (no mock data)

const nav = [
  { to: '/employer/verify', label: 'Verify Certificate' },
  { to: '/employer/history', label: 'Verification History' },
  { to: '/employer/profile', label: 'Profile' },
];

export default function VerificationHistory() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchMyVerificationHistory();
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

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
              {loading ? (
                <tr><td className="px-3 py-2" colSpan={3}>Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td className="px-3 py-2" colSpan={3}>No verifications yet.</td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-3 py-2 font-mono">{r.uniqueId}</td>
                    <td className="px-3 py-2">{r.verifiedAt?.replace('T',' ').slice(0,19)}</td>
                    <td className="px-3 py-2">{r.valid ? 'Valid' : 'Invalid'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
