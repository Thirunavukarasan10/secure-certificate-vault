import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import toast from 'react-hot-toast';
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
              {certificates.map((c) => {
                const downloadUrl = `${BASE_URL.replace('/api','')}${c.certificateUrl}`;
                const qrUrl = `${window.location.origin}/verify/${encodeURIComponent(c.uniqueId)}`;
                const onDownload = () => {
                  try {
                    const key = 'sav_downloads';
                    const prev = JSON.parse(localStorage.getItem(key) || '[]');
                    const entry = { uniqueId: c.uniqueId, date: new Date().toISOString(), url: downloadUrl };
                    localStorage.setItem(key, JSON.stringify([entry, ...prev].slice(0, 100)));
                  } catch {}
                };
                const handleDownloadClick = async (e) => {
                  e.preventDefault();
                  onDownload();
                  try {
                    const encodedUrl = encodeURI(downloadUrl);
                    const res = await fetch(encodedUrl, { credentials: 'include', mode: 'cors', cache: 'no-store' });
                    if (!res.ok) throw new Error('Download failed');
                    const contentType = res.headers.get('content-type') || '';
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    const rawName = (encodedUrl.split('/')?.pop() || `${c.uniqueId}`).split('?')[0];
                    const extFromType = contentType.includes('png') ? '.png' : contentType.includes('jpeg') ? '.jpg' : contentType.includes('pdf') ? '.pdf' : '';
                    const hasExt = /\.[a-zA-Z0-9]{2,5}$/.test(decodeURIComponent(rawName));
                    const fileName = hasExt ? decodeURIComponent(rawName) : `${c.uniqueId}${extFromType || '.png'}`;
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    toast.success('Download started');
                  } catch (err) {
                    console.error('Download error', err);
                    toast.error('Direct download failed. Opening in new tab...');
                    try { window.open(encodeURI(downloadUrl), '_blank', 'noopener'); } catch {}
                  }
                };
                return (
                  <Card
                    key={c.uniqueId}
                    title={c.certificateName}
                    actions={
                      <Button variant="outline" onClick={handleDownloadClick}>Download</Button>
                    }
                  >
                    <div className="flex items-center gap-4">
                      <QRPlaceholder value={qrUrl} />
                      <div>
                        <div className="text-xs uppercase tracking-wide text-black/60">Unique ID</div>
                        <div className="font-mono text-sm">{c.uniqueId}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
