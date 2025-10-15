import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Dropdown from '../components/Dropdown.jsx';
import { ROLES, ROLE_OPTIONS, ROUTE_DEFAULTS } from '../utils/constants.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth() {
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'register' ? 'register' : 'login';
  const [role, setRole] = React.useState(ROLE_OPTIONS[0].value);
  const [form, setForm] = React.useState({});
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { role, ...form };
    if (mode === 'login') login(data);
    else register(data);
    toast.success(`${mode === 'login' ? 'Logged in' : 'Registered'} successfully`);
    setTimeout(() => navigate(ROUTE_DEFAULTS[role]), 400);
  };

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <Toaster position="top-right" />
      <main className="mx-auto max-w-xl px-4 py-10 animate-slide-up">
        <div className="mb-6 flex items-center gap-2 text-sm">
          <button
            onClick={() => setParams({ mode: 'login' })}
            className={`rounded-md px-3 py-1 ${mode === 'login' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
          >Login</button>
          <button
            onClick={() => setParams({ mode: 'register' })}
            className={`rounded-md px-3 py-1 ${mode === 'register' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
          >Register</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Dropdown label="Role" options={ROLE_OPTIONS} value={role} onChange={setRole} />

          {mode === 'login' ? (
            <>
              <Input label="Email / Roll No" placeholder="Enter your email or roll no" onChange={onChange('identifier')} required />
              <Input label="Password" type="password" placeholder="••••••••" onChange={onChange('password')} required />
            </>
          ) : (
            <>
              {role === ROLES.STUDENT && (
                <>
                  <Input label="Roll No" placeholder="e.g. 22CS123" onChange={onChange('rollNo')} required />
                  <Input label="Name" placeholder="Your full name" onChange={onChange('name')} required />
                  <Input label="Email" type="email" placeholder="you@example.com" onChange={onChange('email')} required />
                  <Input label="Password" type="password" placeholder="Create a password" onChange={onChange('password')} required />
                </>
              )}
              {role === ROLES.ADMIN && (
                <>
                  <Input label="Department" placeholder="e.g. Computer Science" onChange={onChange('department')} required />
                  <Input label="Email" type="email" placeholder="you@example.com" onChange={onChange('email')} required />
                  <Input label="Password" type="password" placeholder="Create a password" onChange={onChange('password')} required />
                </>
              )}
              {role === ROLES.EMPLOYER && (
                <>
                  <Input label="Organization" placeholder="Company name" onChange={onChange('organization')} required />
                  <Input label="Email" type="email" placeholder="you@example.com" onChange={onChange('email')} required />
                  <Input label="Password" type="password" placeholder="Create a password" onChange={onChange('password')} required />
                </>
              )}
            </>
          )}

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full">
              {mode === 'login' ? 'Login' : 'Create account'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
