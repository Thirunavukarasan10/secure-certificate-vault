import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
// No backend endpoint yet; show only empty state (no mock rows)

const nav = [
  { to: '/student/certificates', label: 'My Certificates' },
  { to: '/student/downloads', label: 'Download History' },
  { to: '/student/profile', label: 'Profile' },
];

export default function DownloadHistory() {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    try {
      const key = 'sav_downloads';
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    }
  }, []);

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
              {rows.length === 0 ? (
                <tr><td className="px-3 py-2" colSpan={3}>No downloads yet.</td></tr>
              ) : (
                rows.map((r, idx) => (
                  <tr key={idx} className="odd:bg-black/5">
                    <td className="px-3 py-2 font-mono text-sm">{r.uniqueId}</td>
                    <td className="px-3 py-2 text-sm">{new Date(r.date).toLocaleString()}</td>
                    <td className="px-3 py-2 text-sm">
                      <a className="text-blue-600 underline" href={r.url} target="_blank" rel="noreferrer">Open</a>
                    </td>
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
