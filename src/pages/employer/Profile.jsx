import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const nav = [
  { to: '/employer/verify', label: 'Verify Certificate' },
  { to: '/employer/history', label: 'Verification History' },
  { to: '/employer/profile', label: 'Profile' },
];

export default function Profile() {
  const { user } = useAuth();
  const profile = { organization: user?.identifier?.split('@')?.[1] || '—', email: user?.identifier, role: 'Verifier' };
  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Profile</h2>
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-black/60">Organization</div>
              <div className="text-sm">{profile.organization}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-black/60">Role</div>
              <div className="text-sm">{profile.role}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-black/60">Email</div>
              <div className="text-sm">{profile.email}</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
