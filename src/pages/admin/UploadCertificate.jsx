import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import toast from 'react-hot-toast';
import { adminUploadCertificate } from '../../lib/api.js';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function UploadCertificate() {
  const [form, setForm] = React.useState({ rollNo: '', course: '', year: '' });
  const [file, setFile] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!file) { toast.error('Please select a file'); return; }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('studentRollNo', form.rollNo);
      fd.append('certName', form.course || 'Certificate');
      // No department input here; keep layout. Use a default.
      fd.append('department', 'General');
      const data = await adminUploadCertificate(fd);
      toast.success(`Uploaded. ID: ${data?.uniqueId || 'N/A'}`, { duration: 2000 });
      // reset form after success
      setForm({ rollNo: '', course: '', year: '' });
      setFile(null);
      try { if (fileInputRef.current) fileInputRef.current.value = ''; } catch {}
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 403 ? 'You do not have permission to upload. Please login as Admin (HOD).' : (err?.response?.data?.error || err?.message || 'Upload failed');
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Upload Certificate</h2>
        <Card>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Input label="Roll No" placeholder="e.g. 22CS123" required value={form.rollNo} onChange={(e)=>setForm(f=>({...f, rollNo:e.target.value}))} />
            <Input label="Course" placeholder="e.g. BSc" required value={form.course} onChange={(e)=>setForm(f=>({...f, course:e.target.value}))} />
            <Input label="Year" placeholder="e.g. 2024" required value={form.year} onChange={(e)=>setForm(f=>({...f, year:e.target.value}))} />
            <label className="block text-sm md:col-span-2">
              <div className="mb-1 font-medium">File Upload</div>
            <input ref={fileInputRef} type="file" className="input" onChange={(e)=> setFile(e.target.files?.[0] || null)} />
            </label>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full md:w-auto">Upload</Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
