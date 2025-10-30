import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import React from 'react';
import { getMyProfile } from '../../services/userService.js';
import toast from 'react-hot-toast';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState({ name: user?.identifier?.split('@')?.[0] || 'Admin', department: '—', email: user?.identifier, role: 'Admin (HOD)' });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMyProfile();
        if (!mounted) return;
        setProfile({
          name: data?.fullName || data?.name || profile.name,
          department: data?.department || '—',
          email: data?.email || profile.email,
          role: data?.role === 'HOD' ? 'Admin (HOD)' : (data?.role || profile.role),
        });
      } catch (e) {
        toast.error('Failed to load profile');
      }
    })();
    return () => { mounted = false; };
  }, []);
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
              <div className="text-xs uppercase tracking-wide text-black/60">Department</div>
              <div className="text-sm">{profile.department}</div>
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
