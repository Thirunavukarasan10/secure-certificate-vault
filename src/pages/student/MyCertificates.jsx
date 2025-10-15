import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import QRPlaceholder from '../../components/QRPlaceholder.jsx';

const nav = [
  { to: '/student/certificates', label: 'My Certificates' },
  { to: '/student/downloads', label: 'Download History' },
  { to: '/student/profile', label: 'Profile' },
];

export default function MyCertificates() {
  const certificates = [
    { id: 'CERT-2023-0001', title: 'Bachelor of Science - Semester 1' },
    { id: 'CERT-2023-0002', title: 'Bachelor of Science - Semester 2' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">My Certificates</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c) => (
            <Card
              key={c.id}
              title={c.title}
              actions={<Button variant="outline">Download</Button>}
            >
              <div className="flex items-center gap-4">
                <QRPlaceholder />
                <div>
                  <div className="text-xs uppercase tracking-wide text-black/60">Unique ID</div>
                  <div className="font-mono text-sm">{c.id}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
