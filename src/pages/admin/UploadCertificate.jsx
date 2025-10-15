import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import toast from 'react-hot-toast';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function UploadCertificate() {
  const onSubmit = (e) => {
    e.preventDefault();
    toast.success('Certificate uploaded (mock)');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Upload Certificate</h2>
        <Card>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Input label="Roll No" placeholder="e.g. 22CS123" required />
            <Input label="Course" placeholder="e.g. BSc" required />
            <Input label="Year" placeholder="e.g. 2024" required />
            <label className="block text-sm md:col-span-2">
              <div className="mb-1 font-medium">File Upload</div>
              <input type="file" className="input" />
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
