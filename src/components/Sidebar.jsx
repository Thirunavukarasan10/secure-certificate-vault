import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

function NavItem({ to, label }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`block rounded-md px-3 py-2 text-sm ${
        active ? 'bg-black text-white' : 'hover:bg-black/5'
      }`}
    >
      {label}
    </Link>
  );
}

export default function Sidebar({ items }) {
  const { logout } = useAuth();
  return (
    <aside className="h-full w-full max-w-[230px] border-r border-black/10 p-4">
      <div className="mb-6 text-sm font-semibold tracking-tight">Dashboard</div>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavItem key={item.to} to={item.to} label={item.label} />
        ))}
      </nav>
      <button onClick={logout} className="mt-6 inline-flex items-center gap-2 text-sm text-black/70 hover:text-black">
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}
