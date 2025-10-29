import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import { fetchAllCertificates } from '../../lib/api.js';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function Analytics() {
  const [certs, setCerts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchAllCertificates();
        if (mounted) setCerts(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const byMonth = React.useMemo(() => {
    const counts = new Map();
    for (const c of certs) {
      const d = (c.issuedDate || '').slice(0,7); // YYYY-MM
      if (!d) continue;
      counts.set(d, (counts.get(d) || 0) + 1);
    }
    const arr = Array.from(counts.entries()).sort((a,b) => a[0].localeCompare(b[0]));
    return arr;
  }, [certs]);

  const maxVal = byMonth.reduce((m, [,v]) => Math.max(m, v), 0) || 1;
  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Analytics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Total Certificates">
            <div className="text-3xl font-bold">{loading ? '...' : certs.length}</div>
          </Card>
          <Card title="Monthly Uploads">
            <div className="text-3xl font-bold">—</div>
          </Card>
          <Card title="Verifications">
            <div className="text-3xl font-bold">—</div>
          </Card>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card title="Uploads Over Time">
            <div className="h-48 w-full bg-gray-100 p-4">
              {loading ? 'Loading...' : (
                <div className="flex h-full items-end gap-3">
                  {byMonth.length === 0 ? (
                    <div className="text-sm text-black/70">No data</div>
                  ) : byMonth.map(([label, value]) => (
                    <div key={label} className="flex flex-col items-center">
                      <div className="mb-1 text-xs">{value}</div>
                      <div className="w-6 bg-black" style={{ height: `${(value/maxVal)*100}%` }} />
                      <div className="mt-1 text-[10px] text-black/70">{label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
          <Card title="Verifications Over Time">
            <div className="h-48 w-full bg-gray-100" />
          </Card>
        </div>
      </main>
    </div>
  );
}
