import React from 'react';

export default function Dropdown({ label, options = [], value, onChange, className }) {
  const id = React.useId();
  return (
    <label htmlFor={id} className={`block text-sm ${className || ''}`}>
      {label && <div className="mb-1 font-medium">{label}</div>}
      <select
        id={id}
        className="input bg-white"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
