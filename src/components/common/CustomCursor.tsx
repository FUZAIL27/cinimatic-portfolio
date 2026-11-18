import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, textarea, select, .interactive-card');
      const projectCard = target.closest('[data-cursor-text]');

      if (projectCard) {
        setIsHovered(true);
        setHoverText(projectCard.getAttribute('data-cursor-text') || 'EXPLORE');
      } else if (interactive) {
        setIsHovered(true);
        setHoverText('');
      } else {
        setIsHovered(false);
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer Glow Ring */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/60 transition-all duration-150 ease-out flex items-center justify-center ${
          isHovered
            ? hoverText
              ? 'w-24 h-24 bg-cyan-950/60 backdrop-blur-sm border-cyan-400 scale-100 shadow-[0_0_25px_rgba(6,182,212,0.5)]'
              : 'w-12 h-12 bg-cyan-500/10 border-cyan-300 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            : 'w-8 h-8 border-cyan-500/40 scale-100'
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      >
        {hoverText && (
          <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase font-bold text-center px-1">
            {hoverText}
          </span>
        )}
      </div>

      {/* Center glowing dot */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 transition-transform duration-75 ease-out ${
          isHovered && hoverText ? 'opacity-0' : 'w-1.5 h-1.5 shadow-[0_0_10px_#06b6d4]'
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
    </div>
  );
};
