import React from 'react';
import clsx from 'clsx';

export default function Button({ as: Comp = 'button', variant = 'primary', className, children, ...props }) {
  const base = 'btn';
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'transition hover:opacity-70',
  };
  return (
    <Comp className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </Comp>
  );
}
