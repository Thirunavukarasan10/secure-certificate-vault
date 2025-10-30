import React from 'react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../lib/api.js';

export default function PublicVerify() {
  const { uniqueId } = useParams();
  const [state, setState] = React.useState({ loading: true, result: null, cert: null });

  React.useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        const res = await fetch(`${BASE_URL}/verify/${encodeURIComponent(uniqueId)}`);
        const data = await res.json().catch(() => null);
        if (!mounted) return;
        if (data?.valid) {
          const cert = data.certificate;
          setState({ loading: false, result: { status: 'Valid', holder: cert.studentRollNo, course: cert.certificateName, year: cert.issuedDate }, cert });
        } else {
          setState({ loading: false, result: { status: 'Invalid' }, cert: null });
        }
      } catch {
        if (!mounted) return;
        setState({ loading: false, result: { status: 'Invalid' }, cert: null });
      }
    }
    run();
    return () => { mounted = false; };
  }, [uniqueId]);

  const handleDownload = async () => {
    if (!state?.cert?.certificateUrl) return;
    const fileUrl = `${BASE_URL.replace('/api','')}${state.cert.certificateUrl}`;
    try {
      const encoded = encodeURI(fileUrl);
      const res = await fetch(encoded, { credentials: 'include' });
      if (!res.ok) throw new Error('Download failed');
      const contentType = res.headers.get('content-type') || '';
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const raw = (encoded.split('/')?.pop() || `${uniqueId}`).split('?')[0];
      const extFromType = contentType.includes('png') ? '.png' : contentType.includes('jpeg') ? '.jpg' : contentType.includes('pdf') ? '.pdf' : '';
      const hasExt = /\.[a-zA-Z0-9]{2,5}$/.test(decodeURIComponent(raw));
      const fname = hasExt ? decodeURIComponent(raw) : `${uniqueId}${extFromType || '.png'}`;
      a.href = url;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (e) {
      console.error('Verify download error', e);
      toast.error('Direct download failed. Opening in new tab...');
      try { window.open(encodeURI(fileUrl), '_blank', 'noopener'); } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">Certificate Verification</h1>
        <Card title={`Unique ID: ${uniqueId}`}>
          {state.loading ? (
            <div>Verifying...</div>
          ) : (
            <>
              <div className="grid gap-2 md:grid-cols-4">
                <div><div className="text-xs text-black/60">Status</div><div className="text-sm font-semibold">{state.result.status}</div></div>
                {state.result.status === 'Valid' && (
                  <>
                    <div><div className="text-xs text-black/60">Holder</div><div className="text-sm">{state.result.holder}</div></div>
                    <div><div className="text-xs text-black/60">Course</div><div className="text-sm">{state.result.course}</div></div>
                    <div><div className="text-xs text-black/60">Issued</div><div className="text-sm">{state.result.year}</div></div>
                  </>
                )}
              </div>
              {state.result.status === 'Valid' && (
                <div className="mt-4">
                  <Button onClick={handleDownload}>Download Certificate</Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}


