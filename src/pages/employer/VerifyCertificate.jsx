import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import QRPlaceholder from '../../components/QRPlaceholder.jsx';
import { verifyCertificateById } from '../../lib/api.js';

const nav = [
  { to: '/employer/verify', label: 'Verify Certificate' },
  { to: '/employer/history', label: 'Verification History' },
  { to: '/employer/profile', label: 'Profile' },
];

export default function VerifyCertificate() {
  const [id, setId] = React.useState('');
  const [result, setResult] = React.useState(null);

  const onVerify = async (e) => {
    e.preventDefault();
    try {
      const data = await verifyCertificateById(id);
      if (data?.valid) {
        const cert = data.certificate;
        setResult({ status: 'Valid', holder: cert.studentRollNo, course: cert.certificateName, year: cert.issuedDate });
      } else {
        setResult({ status: 'Invalid' });
      }
    } catch {
      setResult({ status: 'Invalid' });
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Verify Certificate</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Scan QR">
            <QRPlaceholder size={160} />
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
