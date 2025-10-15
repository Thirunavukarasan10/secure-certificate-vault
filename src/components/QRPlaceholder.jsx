import React from 'react';

export default function QRPlaceholder({ size = 96 }) {
  return (
    <div
      className="grid place-items-center border border-dashed border-black/30 bg-white"
      style={{ width: size, height: size }}
    >
      <div className="text-[10px] uppercase tracking-wider text-black/50">QR</div>
    </div>
  );
}
