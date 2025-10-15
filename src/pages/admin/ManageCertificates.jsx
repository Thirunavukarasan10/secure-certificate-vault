import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import { Pencil, Trash2 } from 'lucide-react';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function ManageCertificates() {
  const items = [
    { id: 'CERT-2023-0001', title: 'Alex Student - BSc - 2023' },
    { id: 'CERT-2023-0002', title: 'Jamie Learner - BSc - 2023' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Manage Certificates</h2>
        <div className="space-y-3">
          {items.map((it) => (
            <Card
              key={it.id}
              title={it.title}
              actions={
                <div className="flex gap-2">
                  <button className="rounded-md border border-black/20 p-2 hover:bg-black/5"><Pencil size={16} /></button>
                  <button className="rounded-md border border-black/20 p-2 hover:bg-black/5"><Trash2 size={16} /></button>
                </div>
              }
            >
              <div className="text-sm text-black/70">ID: {it.id}</div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
