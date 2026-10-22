import React from 'react';

// Lightweight, performant static noise - Zero SVG feTurbulence overhead
export default function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-[9998] opacity-[0.025] hidden sm:block"
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    />
  );
}
