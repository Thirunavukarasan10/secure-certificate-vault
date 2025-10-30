import React from 'react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES, ROUTE_DEFAULTS } from '../utils/constants.js';

export default function SimpleLogin() {
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginUser({ identifier, password });
      const data = res?.data;
      if (data?.token && data?.role) {
        login({ token: data.token, role: data.role, userId: data.userId, identifier: data.identifier, name: data.name });
        const mappedRole = data.role === 'HOD' ? ROLES.ADMIN : (data.role === 'EMPLOYER' ? ROLES.EMPLOYER : ROLES.STUDENT);
        toast.success('Logged in successfully', { duration: 2000 });
        navigate(ROUTE_DEFAULTS[mappedRole]);
      } else {
        toast.error(data?.message || 'Invalid credentials');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Request failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-white text-black p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-4 text-center text-lg font-semibold">Secure Vault Login</div>
        <div className="space-y-3">
          <Input label="Email or Roll No" placeholder="Enter identifier" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} required />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <div className="mt-4">
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
        </div>
      </form>
    </div>
  );
}


