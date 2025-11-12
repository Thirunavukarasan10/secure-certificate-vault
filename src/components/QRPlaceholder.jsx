import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRPlaceholder({ size = 96, value }) {
  if (value) {
    return (
      <div style={{ background: 'white', padding: 4 }}>
        <QRCodeCanvas value={value} size={size} style={{ height: size, width: size }} />
      </div>
    );
  }
  return (
    <div
      className="grid place-items-center border border-dashed border-black/30 bg-white"
      style={{ width: size, height: size }}
    >
      <div className="text-[10px] uppercase tracking-wider text-black/50">QR</div>
    </div>
  );
}
