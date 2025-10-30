import React from 'react';
import Card from './Card.jsx';
import Button from './Button.jsx';
import { getMyProfile, updateMyProfile } from '../services/userService.js';
import toast from 'react-hot-toast';
import { Mail, Phone, Calendar, MapPin, User, ShieldCheck, BadgeCheck } from 'lucide-react';

function Avatar({ name = '' }) {
  const initials = (name || '?')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="grid h-16 w-16 place-items-center rounded-full bg-blue-600 text-white shadow-md">
      <span className="text-xl font-semibold">{initials}</span>
    </div>
  );
}

export default function ProfileView() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ phoneNumber: '', address: '', gender: '', dateOfBirth: '' });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMyProfile();
        if (!mounted) return;
        setProfile(data || {});
        setForm({
          phoneNumber: data?.phoneNumber || '',
          address: data?.address || '',
          gender: data?.gender || '',
          dateOfBirth: data?.dateOfBirth || '',
        });
      } catch (e) {
        toast.error('Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const validate = () => {
    // phoneNumber: allow 10-15 digits (with optional +, space, dash)
    if (form.phoneNumber) {
      const normalized = form.phoneNumber.replace(/[^\d]/g, '');
      if (normalized.length < 10 || normalized.length > 15) return 'Invalid phone number';
    }
    if (form.dateOfBirth) {
      const d = new Date(form.dateOfBirth);
      const now = new Date();
      if (Number.isNaN(d.getTime())) return 'Invalid date of birth';
      if (d > now) return 'Date of birth cannot be in the future';
    }
    if (form.address && form.address.length > 500) return 'Address too long (max 500)';
    return null;
  };

  const onSave = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    try {
      setSaving(true);
      const payload = { phoneNumber: form.phoneNumber, address: form.address, gender: form.gender, dateOfBirth: form.dateOfBirth };
      const updated = await updateMyProfile(payload);
      toast.success('Profile updated');
      setProfile((p) => ({ ...p, ...updated }));
      setEditing(false);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || 'Update failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const infoRow = (Icon, label, value, extraRight) => (
    <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-black/5 hover:shadow-md transition">
      <div className="mt-0.5 text-blue-600"><Icon size={18} /></div>
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-wide text-black/60">{label}</div>
        <div className="text-sm font-medium text-black">{value || '—'}</div>
      </div>
      {extraRight}
    </div>
  );

  if (loading) return <div>Loading...</div>;

  const roleLabel = profile?.roleDisplay || profile?.role || '—';
  const createdAt = profile?.createdAt;
  const department = profile?.department || (roleLabel?.toLowerCase?.() === 'student' ? profile?.department : profile?.department);
  const rollNo = profile?.rollNo;

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white shadow">
        <div className="flex items-center gap-4">
          <Avatar name={profile?.name} />
          <div className="flex-1">
            <div className="text-lg font-semibold">{profile?.name || 'User'}</div>
            <div className="mt-0.5 text-xs opacity-90">{roleLabel}</div>
          </div>
          <Button variant="outline" className="bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20" onClick={() => setEditing(true)}>Edit Profile</Button>
        </div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          {infoRow(Mail, 'Email', (
            <div className="flex items-center gap-2">
              <span>{profile?.email || '—'}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-200">
                <ShieldCheck size={12} /> Verified
              </span>
            </div>
          ))}
          {infoRow(User, 'Department', department)}
          {infoRow(Phone, 'Phone', profile?.phoneNumber)}
          {infoRow(Calendar, 'Date of Birth', profile?.dateOfBirth)}
          {infoRow(MapPin, 'Address', profile?.address)}
          {infoRow(User, 'Gender', profile?.gender)}
          {infoRow(BadgeCheck, 'Account Created', createdAt)}
          {infoRow(User, 'Role', roleLabel)}
          {rollNo ? infoRow(User, 'Roll No', rollNo) : null}
        </div>
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 text-lg font-semibold">Edit Profile</div>
            <div className="grid gap-3">
              <label className="text-sm">
                <div className="mb-1 font-medium">Phone</div>
                <input className="input" value={form.phoneNumber} onChange={(e)=>setForm(f=>({...f, phoneNumber:e.target.value}))} />
              </label>
              <label className="text-sm">
                <div className="mb-1 font-medium">Address</div>
                <input className="input" value={form.address} onChange={(e)=>setForm(f=>({...f, address:e.target.value}))} />
              </label>
              <label className="text-sm">
                <div className="mb-1 font-medium">Gender</div>
                <select className="input" value={form.gender} onChange={(e)=>setForm(f=>({...f, gender:e.target.value}))}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="text-sm">
                <div className="mb-1 font-medium">Date of Birth</div>
                <input type="date" className="input" value={form.dateOfBirth} onChange={(e)=>setForm(f=>({...f, dateOfBirth:e.target.value}))} />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={()=>setEditing(false)}>Cancel</Button>
              <Button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


