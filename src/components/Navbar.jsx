import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';

export default function Navbar() {
  const location = useLocation();
  const onAuthPage = location.pathname.startsWith('/auth');
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-semibold tracking-tight">Secure Academic Certificate Vault</Link>
        <nav className="flex items-center gap-2">
          {!onAuthPage && (
            <>
              <Button as={Link} to="/auth?mode=login" variant="outline">Login</Button>
              <Button as={Link} to="/auth?mode=register" variant="primary">Register</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
