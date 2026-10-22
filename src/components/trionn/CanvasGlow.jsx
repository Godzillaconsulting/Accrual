import React, { useEffect, useRef } from 'react';

export default function CanvasGlow() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable completely on mobile/touch devices to save CPU and battery
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isRunning = false;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const render = () => {
      const dx = targetX - mouseX;
      const dy = targetY - mouseY;

      mouseX += dx * 0.08;
      mouseY += dy * 0.08;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        Math.max(width, height) * 0.35
      );

      gradient.addColorStop(0, 'rgba(0, 229, 255, 0.06)');
      gradient.addColorStop(0.5, 'rgba(0, 208, 176, 0.015)');
      gradient.addColorStop(1, 'rgba(4, 5, 8, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Stop looping if mouse is settled to save CPU
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initial render
    isRunning = true;
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 hidden md:block"
      style={{ opacity: 0.95 }}
    />
  );
}
