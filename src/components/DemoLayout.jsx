import React from 'react';
import DemoNavbar from './DemoNavbar.jsx';

export default function DemoLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DemoNavbar />
      {children}
    </div>
  );
}

