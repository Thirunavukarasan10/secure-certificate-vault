import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import QRPlaceholder from '../../components/QRPlaceholder.jsx';
import { fetchAllCertificates, BASE_URL } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const nav = [
  { to: '/student/certificates', label: 'My Certificates' },
  { to: '/student/downloads', label: 'Download History' },
  { to: '/student/profile', label: 'Profile' },
];

export default function MyCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchAllCertificates();
        if (!mounted) return;
        if (Array.isArray(data)) setCertificates(data);
        else if (data?.message) setMessage(data.message);
      } catch (e) {
        setMessage('Failed to load certificates');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">My Certificates</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {message && <div className="text-sm text-black/70">{message}</div>}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((c) => (
                <Card
                  key={c.uniqueId}
                  title={c.certificateName}
                  actions={
                    <a href={`${BASE_URL.replace('/api','')}${c.certificateUrl}`} target="_blank" rel="noreferrer">
                      <Button variant="outline">Download</Button>
                    </a>
                  }
                >
                  <div className="flex items-center gap-4">
                    <QRPlaceholder />
                    <div>
                      <div className="text-xs uppercase tracking-wide text-black/60">Unique ID</div>
                      <div className="font-mono text-sm">{c.uniqueId}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
