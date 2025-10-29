import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Card from '../../components/Card.jsx';
import { Pencil, Trash2, Save } from 'lucide-react';
import { fetchAllCertificates, deleteCertificateByUniqueId, updateCertificateByUniqueId } from '../../lib/api.js';
import toast from 'react-hot-toast';

const nav = [
  { to: '/admin/upload', label: 'Upload Certificate' },
  { to: '/admin/manage', label: 'Manage Certificates' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function ManageCertificates() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchAllCertificates();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Failed to load certificates');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onDelete = async (uniqueId) => {
    try {
      await deleteCertificateByUniqueId(uniqueId);
      setItems((list) => list.filter((c) => c.uniqueId !== uniqueId));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const onEdit = (it) => {
    setEditId(it.uniqueId);
    setEditForm({
      certificateName: it.certificateName,
      studentRollNo: it.studentRollNo,
      department: it.department,
      issuedDate: it.issuedDate,
    });
  };

  const onSave = async () => {
    try {
      const { certificate } = await updateCertificateByUniqueId(editId, editForm);
      setItems((list) => list.map((c) => c.uniqueId === editId ? { ...c, ...certificate } : c));
      setEditId(null);
      toast.success('Updated');
    } catch (e) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar items={nav} />
      <main className="flex-1 p-6">
        <h2 className="mb-4 text-xl font-bold">Manage Certificates</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-3">
            {items.length === 0 && <div className="text-sm text-black/70">No certificates yet.</div>}
            {items.map((it) => (
              <Card
                key={it.uniqueId}
                title={editId === it.uniqueId ? '' : `${it.studentRollNo} - ${it.certificateName} - ${it.issuedDate}`}
                actions={
                  <div className="flex gap-2">
                    {editId === it.uniqueId ? (
                      <button onClick={onSave} className="rounded-md border border-black/20 p-2 hover:bg-black/5" title="Save"><Save size={16} /></button>
                    ) : (
                      <button onClick={() => onEdit(it)} className="rounded-md border border-black/20 p-2 hover:bg-black/5" title="Edit"><Pencil size={16} /></button>
                    )}
                    <button onClick={() => onDelete(it.uniqueId)} className="rounded-md border border-black/20 p-2 hover:bg-black/5" title="Delete"><Trash2 size={16} /></button>
                  </div>
                }
              >
                {editId === it.uniqueId ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-sm"><div className="mb-1 font-medium">Certificate Name</div><input className="input" value={editForm.certificateName || ''} onChange={(e)=>setEditForm(f=>({...f, certificateName:e.target.value}))} /></label>
                    <label className="block text-sm"><div className="mb-1 font-medium">Student Roll No</div><input className="input" value={editForm.studentRollNo || ''} onChange={(e)=>setEditForm(f=>({...f, studentRollNo:e.target.value}))} /></label>
                    <label className="block text-sm"><div className="mb-1 font-medium">Department</div><input className="input" value={editForm.department || ''} onChange={(e)=>setEditForm(f=>({...f, department:e.target.value}))} /></label>
                    <label className="block text-sm"><div className="mb-1 font-medium">Issued Date</div><input className="input" value={editForm.issuedDate || ''} onChange={(e)=>setEditForm(f=>({...f, issuedDate:e.target.value}))} placeholder="YYYY-MM-DD" /></label>
                    <div className="text-sm text-black/70 md:col-span-2">ID: <span className="font-mono">{it.uniqueId}</span></div>
                  </div>
                ) : (
                  <div className="text-sm text-black/70">ID: <span className="font-mono">{it.uniqueId}</span></div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
