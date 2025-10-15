import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

export default function Error404() {
  return (
    <div className="grid min-h-screen place-items-center bg-white text-center text-black">
      <div className="px-6">
        <div className="text-sm uppercase tracking-widest text-black/50">404</div>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-black/70">The page you are looking for does not exist.</p>
        <div className="mt-6">
          <Button as={Link} to="/" variant="primary">Go Home</Button>
        </div>
      </div>
    </div>
  );
}
