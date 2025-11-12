import React from 'react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import toast from 'react-hot-toast';
import { useParams, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../lib/api.js';

export default function PublicVerify() {
  const { uniqueId: uniqueIdFromPath } = useParams();
  const [searchParams] = useSearchParams();
  const certIdFromQuery = searchParams.get('certId');
  
  // Use certId from query parameter if available, otherwise use path parameter
  const uniqueId = certIdFromQuery || uniqueIdFromPath;
  
  const [state, setState] = React.useState({ loading: true, result: null, cert: null });

  React.useEffect(() => {
    if (!uniqueId) {
      setState({ loading: false, result: { status: 'Invalid', message: 'Certificate ID not provided' }, cert: null });
      return;
    }

    let mounted = true;
    async function run() {
      try {
        const res = await fetch(`${BASE_URL}/verify/${encodeURIComponent(uniqueId)}`);
        const data = await res.json().catch(() => null);
        if (!mounted) return;
        if (data?.valid && data?.certificate) {
          const cert = data.certificate;
          setState({ 
            loading: false, 
            result: { 
              status: 'Valid', 
              message: 'Certificate is authentic and verified.',
              holder: cert.studentName,
              course: cert.certificateTitle,
              year: cert.issuedDate 
            }, 
            cert 
          });
        } else {
          setState({ 
            loading: false, 
            result: { 
              status: 'Invalid', 
              message: data?.message || 'No record found for this certificate ID.'
            }, 
            cert: null 
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        if (!mounted) return;
        setState({ 
          loading: false, 
          result: { 
            status: 'Invalid', 
            message: 'Failed to verify certificate. Please try again.'
          }, 
          cert: null 
        });
      }
    }
    run();
    return () => { mounted = false; };
  }, [uniqueId]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Certificate Verification</h1>
          <p className="mt-2 text-sm text-gray-500">Verify the authenticity of academic certificates</p>
        </div>
        
        <Card className="transition-all duration-300 hover:shadow-lg">
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Certificate ID</div>
            <div className="mt-1 font-mono text-lg font-bold text-blue-600">{uniqueId || '—'}</div>
          </div>
          
          {state.loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Verifying certificate...</div>
            </div>
          ) : (
            <>
              <div className={`mb-4 rounded-lg border-2 p-4 ${
                state.result.status === 'Valid' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-center gap-3">
                  {state.result.status === 'Valid' ? (
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div>
                    <div className={`text-lg font-semibold ${
                      state.result.status === 'Valid' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {state.result.status === 'Valid' ? 'Certificate Verified' : 'No Record Found'}
                    </div>
                    <div className={`text-sm ${
                      state.result.status === 'Valid' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {state.result.message}
                    </div>
                  </div>
                </div>
              </div>

              {state.result.status === 'Valid' && state.cert && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Student Name</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">{state.cert.studentName}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Student ID</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">{state.cert.studentId}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Department</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">{state.cert.department}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Certificate Title</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">{state.cert.certificateTitle}</div>
                    </div>
                    {state.cert.issuedDate && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Issued Date</div>
                        <div className="mt-1 text-sm font-medium text-gray-900">{formatDate(state.cert.issuedDate)}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Unique Certificate ID</div>
                      <div className="mt-1 font-mono text-sm font-medium text-blue-600">{state.cert.uniqueId}</div>
                    </div>
                  </div>
                  
                  {state.cert.certificateUrl && (
                    <div className="border-t pt-4">
                      <Button onClick={handleDownload} variant="primary" className="w-full md:w-auto">
                        Download Certificate
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
