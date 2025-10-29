import React from 'react';

export default function Card({ title, children, className, actions }) {
  return (
    <div className={`card p-4 ${className || ''}`}>
      {(title || actions) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h3 className="text-base font-semibold">{title}</h3>}
          {actions}
        </div>
      )}
      <div className="text-sm">
        {children}
      </div>
    </div>
  );
}
