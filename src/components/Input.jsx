import React from 'react';
import clsx from 'clsx';

export default function Input({ label, hint, className, inputClassName, ...props }) {
  const id = React.useId();
  return (
    <label htmlFor={id} className={clsx('block text-sm', className)}>
      {label && <div className="mb-1 font-medium">{label}</div>}
      <input id={id} className={clsx('input', inputClassName)} {...props} />
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </label>
  );
}
