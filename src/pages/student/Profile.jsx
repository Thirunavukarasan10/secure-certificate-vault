import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const nav = [
  { to: '/student/certificates', label: 'My Certificates' },
  { to: '/student/downloads', label: 'Download History' },
  { to: '/student/profile', label: 'Profile' },
];

export default function Profile() {
  const { user } = useAuth();
  const profile = { name: user?.name || user?.identifier, rollNo: user?.identifier, email: user?.identifier, role: 'Student' };
  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Profile</h2>
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-black/60">Name</div>
              <div className="text-sm">{profile.name}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-black/60">Role</div>
              <div className="text-sm">{profile.role}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-black/60">Roll No</div>
              <div className="text-sm">{profile.rollNo}</div>
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
