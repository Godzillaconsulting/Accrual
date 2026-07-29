import React, { useState, useEffect } from 'react';

export default function TrionnPreloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Only run preloader once per session if desired, or every load
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setDone(true);
            setTimeout(() => setGone(true), 800);
          }, 200);
          return 100;
        }
        return prev + 4;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  if (gone) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col pointer-events-none overflow-hidden">
      {/* 10 Silver/Dark curtain belts with staggered retraction */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: 'linear-gradient(90deg, #090B10 0%, #151922 50%, #090B10 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
            transformOrigin: 'center top',
            transform: done ? 'scaleY(0)' : 'scaleY(1)',
            transition: `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 35}ms`,
          }}
        />
      ))}

      {/* Center brand & progress counter */}
      <div
        className="fixed inset-0 z-[100000] flex flex-col items-center justify-center pointer-events-none"
        style={{
          opacity: done ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
        }}
      >
        <div className="relative flex flex-col items-center justify-center p-8 rounded-xl bg-[#040508]/80 border border-[#00E5FF]/20 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#00E5FF] animate-ping" />
            <span className="font-mono text-xl tracking-[0.25em] font-black text-white uppercase">
              ACCRUAL <span className="text-[#00E5FF]">OS</span>
            </span>
          </div>

          <div className="w-48 bg-white/10 h-1 rounded-full overflow-hidden mb-3">
            <div
              className="bg-[#00E5FF] h-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="font-mono text-xs text-[#00E5FF] tracking-widest font-semibold">
            {String(progress).padStart(3, '0')}% SYSTEM INITIALIZED
          </div>
        </div>
      </div>
    </div>
  );
}
