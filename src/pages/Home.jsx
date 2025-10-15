import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Button from '../components/Button.jsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 animate-fade-in">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">Secure Academic Certificate Vault</h1>
          <p className="mt-4 max-w-2xl text-base text-black/70 md:text-lg">
            A minimal, modern dashboard to store, manage, and verify academic certificates with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/auth?mode=login" variant="primary">Login</Button>
            <Button as={Link} to="/auth?mode=register" variant="outline">Register</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
