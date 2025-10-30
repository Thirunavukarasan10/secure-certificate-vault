import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import QRPlaceholder from '../../components/QRPlaceholder.jsx';
import { verifyCertificateById, BASE_URL } from '../../lib/api.js';

const nav = [
  { to: '/employer/verify', label: 'Verify Certificate' },
  { to: '/employer/history', label: 'Verification History' },
  { to: '/employer/profile', label: 'Profile' },
];

export default function VerifyCertificate() {
  const [id, setId] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [cert, setCert] = React.useState(null);
  const [qrSrc, setQrSrc] = React.useState(null);

  const onVerify = async (e) => {
    e.preventDefault();
    try {
      const data = await verifyCertificateById(id);
      if (data?.valid) {
        const c = data.certificate;
        setCert(c);
        setResult({ status: 'Valid', holder: c.studentRollNo, course: c.certificateName, year: c.issuedDate });
        const path = c?.qrCodeUrl || c?.qrCodePath || '';
        if (path) {
          const base = BASE_URL.replace('/api','');
          const full = path.startsWith('http') ? path : `${base}${path}`;
          setQrSrc(full);
        } else {
          setQrSrc(null);
        }
      } else {
        setCert(null);
        setResult({ status: 'Invalid' });
        setQrSrc(null);
      }
    } catch {
      setCert(null);
      setResult({ status: 'Invalid' });
      setQrSrc(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Verify Certificate</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Scan QR">
            {result?.status === 'Valid' ? (
              qrSrc ? (
                <img
                  alt="Certificate QR"
                  className="h-40 w-40 rounded border object-contain bg-white"
                  src={qrSrc}
                  onError={() => setQrSrc(null)}
                />
              ) : (
                <QRPlaceholder size={160} value={`${window.location.origin}/verify/${encodeURIComponent(id)}`} />
              )
            ) : (
              <QRPlaceholder size={160} />
            )}
          </Card>
          <Card className="md:col-span-2" title="Enter Unique ID">
            <form onSubmit={onVerify} className="flex flex-col gap-3 md:flex-row">
              <Input placeholder="e.g. CERT-2023-0001" onChange={(e) => setId(e.target.value)} value={id} required className="flex-1" />
              <Button type="submit" className="md:w-auto">Verify</Button>
            </form>
          </Card>
        </div>
        {result && (
          <Card className="mt-4" title="Result">
            <div className="grid gap-2 md:grid-cols-4">
              <div><div className="text-xs text-black/60">Status</div><div className="text-sm font-semibold">{result.status}</div></div>
              {result.status === 'Valid' && (
                <>
                  <div><div className="text-xs text-black/60">Holder</div><div className="text-sm">{result.holder}</div></div>
                  <div><div className="text-xs text-black/60">Course</div><div className="text-sm">{result.course}</div></div>
                  <div><div className="text-xs text-black/60">Year</div><div className="text-sm">{result.year}</div></div>
                </>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
