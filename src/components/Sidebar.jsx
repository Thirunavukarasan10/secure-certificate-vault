import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

function NavItem({ to, label, icon: Icon }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
        active ? 'bg-black text-white' : 'hover:bg-black/5'
      }`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </Link>
  );
}

export default function Sidebar({ items }) {
  const { logout } = useAuth();
  
  // Separate profile items from other nav items
  const profileItems = items.filter(item => 
    item.label.toLowerCase().includes('profile')
  );
  const navItems = items.filter(item => 
    !item.label.toLowerCase().includes('profile')
  );
  
  // Find the profile route (usually the last item or one with 'profile' in label)
  const profileItem = profileItems.length > 0 
    ? profileItems[0] 
    : items.find(item => item.label.toLowerCase().includes('profile')) || items[items.length - 1];
  
  return (
    <aside className="flex flex-col h-screen w-full max-w-[230px] border-r border-black/10 bg-white">
      <div className="p-4">
        <div className="mb-6 text-sm font-semibold tracking-tight">Dashboard</div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>
      </div>
      
      {/* Bottom Section - Profile and Logout */}
      <div className="mt-auto p-4 border-t border-black/10 space-y-1">
        {profileItem && (
          <NavItem 
            to={profileItem.to} 
            label={profileItem.label} 
            icon={User}
          />
        )}
        <button 
          onClick={logout} 
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black transition-colors"
        >
          <LogOut size={16} /> 
          Logout
        </button>
      </div>
    </aside>
  );
}
