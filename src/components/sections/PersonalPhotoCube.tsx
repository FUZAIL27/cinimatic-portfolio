import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Rotate3d, Sparkles, UserCheck, LayoutGrid, Layers } from 'lucide-react';
import style1 from '../../assets/images/fuzail-style-1.jpg';
import style2 from '../../assets/images/fuzail-style-2.jpg';
import style3 from '../../assets/images/fuzail-style-3.jpg';
import style4 from '../../assets/images/fuzail-style-4.jpg';
import style5 from '../../assets/images/fuzail-style-5.jpg';

interface PortraitItem {
  id: number;
  number: string;
  portraitImg: string;
  fullImg: string;
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  gradient: string;
  objectPosition: string;
}

const PORTRAITS: PortraitItem[] = [
  {
    id: 0,
    number: '01',
    portraitImg: style1,
    fullImg: style1,
    title: 'NAVY FORMAL',
    subtitle: 'Enterprise Architecture & Leadership',
    tag: 'Java & Spring Boot',
    color: '#168BFF', // Electric Blue
    gradient: 'from-blue-950/70 via-slate-950/95 to-blue-900/50',
    objectPosition: 'center top',
  },
  {
    id: 1,
    number: '02',
    portraitImg: style2,
    fullImg: style2,
    title: 'EXECUTIVE SUIT',
    subtitle: 'Scalable Business & ERP Systems',
    tag: 'Enterprise ERP',
    color: '#8B5CF6', // Purple
    gradient: 'from-violet-950/70 via-slate-950/95 to-purple-900/50',
    objectPosition: 'center top',
  },
  {
    id: 2,
    number: '03',
    portraitImg: style3,
    fullImg: style3,
    title: 'SMART CASUAL',
    subtitle: 'Modern Full Stack & Reactive UI',
    tag: 'React & TypeScript',
    color: '#00E5FF', // Cyan
    gradient: 'from-cyan-950/70 via-slate-950/95 to-teal-900/50',
    objectPosition: 'center top',
  },
  {
    id: 3,
    number: '04',
    portraitImg: style4,
    fullImg: style4,
    title: 'CLASSIC BLACK',
    subtitle: 'Mission-Critical Reliability & Microservices',
    tag: 'MySQL & PostgreSQL',
    color: '#10B981', // Emerald / Cyan
    gradient: 'from-emerald-950/70 via-slate-950/95 to-slate-900/50',
    objectPosition: 'center top',
  },
  {
    id: 4,
    number: '05',
    portraitImg: style5,
    fullImg: style5,
    title: 'MODERN CREATIVE',
    subtitle: 'AI Innovation & Cloud Engineering',
    tag: 'AI APIs & Docker',
    color: '#FF4FA3', // Pink / Magenta
    gradient: 'from-pink-950/70 via-slate-950/95 to-rose-900/50',
    objectPosition: 'center top',
  },
];

export const PersonalPhotoCube: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'portrait' | 'full'>('portrait');
  
  // Track whether the user explicitly clicked a mode tab button
  const userManuallyChangedMode = useRef(false);

  // Default to 'cube' on mobile & tablet devices (< 1024px), 'lookbook' on desktop
  const [displayMode, setDisplayMode] = useState<'cube' | 'lookbook'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024 ? 'cube' : 'lookbook';
    }
    return 'lookbook';
  });

  // Responsive device check: ensure mobile and tab devices default to 'cube'
  useEffect(() => {
    const handleDeviceCheck = () => {
      if (userManuallyChangedMode.current) return;
      const isMobileOrTablet = window.innerWidth < 1024;
      setDisplayMode(isMobileOrTablet ? 'cube' : 'lookbook');
    };

    handleDeviceCheck();
    window.addEventListener('resize', handleDeviceCheck);
    return () => window.removeEventListener('resize', handleDeviceCheck);
  }, []);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);

  // Transition to specific portrait index
  const goToIndex = useCallback((newIdx: number) => {
    const normalized = ((newIdx % PORTRAITS.length) + PORTRAITS.length) % PORTRAITS.length;
    setActiveIndex(normalized);
  }, []);

  const nextPortrait = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const prevPortrait = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  // Auto-rotation every 4.5 seconds in cube mode when not interacting
  useEffect(() => {
    if (isHovered || isDragging || displayMode !== 'cube') return;

    const timer = setInterval(() => {
      nextPortrait();
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered, isDragging, displayMode, nextPortrait]);

  // Mouse move parallax / 3D tilt tracking for cube
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    setTilt({
      x: -normY * 6, // subtle pitch
      y: normX * 6,  // subtle yaw
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isDragging) {
      setTilt({ x: 0, y: 0 });
    }
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX.current;
      if (Math.abs(deltaX) > 40) {
        if (deltaX > 0) {
          prevPortrait();
        } else {
          nextPortrait();
        }
        setIsDragging(false);
      }
    },
    [isDragging, prevPortrait, nextPortrait]
  );

  const handleWindowMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    } else {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, handleWindowMouseMove, handleWindowMouseUp]);

  // Touch Swipe handlers for mobile
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length !== 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 35) {
      if (deltaX > 0) {
        prevPortrait();
      } else {
        nextPortrait();
      }
    }
  };

  const currentPortrait = PORTRAITS[activeIndex];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full rounded-3xl p-5 bg-gradient-to-br from-slate-900/95 via-slate-950 to-violet-950/40 border border-violet-500/30 shadow-[0_25px_70px_rgba(139,92,246,0.35)] backdrop-blur-2xl flex flex-col items-center select-none transition-all duration-500 ${
        displayMode === 'lookbook' ? 'max-w-xl' : 'max-w-md'
      }`}
    >
      {/* Top Header Badge & Mode Toggles */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 px-1 pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <Rotate3d size={15} className="text-cyan-400 animate-spin-slow" />
          <span className="text-[11px] font-mono text-violet-300 font-bold tracking-wider">
            PERSPECTIVES // 5 STYLES
          </span>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5">
          {/* Display Mode: Lookbook Gallery vs 3D Stage */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/50 border border-white/10">
            <button
              type="button"
              onClick={() => {
                userManuallyChangedMode.current = true;
                setDisplayMode('lookbook');
              }}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                displayMode === 'lookbook'
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="View all 5 styles side by side"
            >
              <LayoutGrid size={11} />
              <span>5 STYLES</span>
            </button>
            <button
              type="button"
              onClick={() => {
                userManuallyChangedMode.current = true;
                setDisplayMode('cube');
              }}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                displayMode === 'cube'
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="3D rotating perspective stage"
            >
              <Layers size={11} />
              <span>3D CUBE</span>
            </button>
          </div>

          {/* Portrait Framing Toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/50 border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'portrait' ? 'full' : 'portrait')}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold text-slate-300 hover:text-cyan-300 transition-colors"
              title="Toggle between bust portrait and full look"
            >
              {viewMode === 'portrait' ? 'BUST' : 'FULL'}
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <span>CHENNAI, INDIA</span>
        </div>
      </div>

      {/* MODE A: 5-STYLE LOOKBOOK STRIP (Matching User Screenshot 1) */}
      {displayMode === 'lookbook' && (
        <div className="w-full flex flex-col items-center">
          {/* 5-Column Side-by-Side Gallery */}
          <div className="w-full grid grid-cols-5 gap-2 sm:gap-2.5 py-2">
            {PORTRAITS.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => goToIndex(idx)}
                  className={`group relative flex flex-col items-center rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)] scale-105 z-20'
                      : 'border border-white/10 hover:border-white/30 opacity-75 hover:opacity-100 hover:scale-[1.02] z-10'
                  }`}
                  style={{ height: '360px' }}
                >
                  {/* Card Background Ambient Glow */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: isSelected
                        ? `linear-gradient(to bottom, ${item.color}30, #030712 90%)`
                        : '#0b1120',
                    }}
                  />

                  {/* Complete Portrait Image Frame: Head, face, hair, and suit 100% visible */}
                  <div className="relative w-full h-full flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={viewMode === 'portrait' ? item.portraitImg : item.fullImg}
                      alt={`Fuzail Ahmed - ${item.title}`}
                      className="w-full h-full object-contain filter contrast-[1.03] transition-transform duration-500 group-hover:scale-105"
                      style={{
                        objectPosition: 'center top',
                      }}
                      draggable={false}
                      loading="eager"
                    />

                    {/* Gradient overlay at bottom of card */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    {/* Style number badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md backdrop-blur-md"
                        style={{
                          backgroundColor: isSelected ? item.color : '#0f172a',
                          color: isSelected ? '#ffffff' : item.color,
                        }}
                      >
                        {item.number}
                      </span>
                    </div>

                    {/* Title label on hover or when selected */}
                    <div className="absolute bottom-2 inset-x-1.5 text-center z-10">
                      <p className="text-[10px] font-heading font-black text-white truncate drop-shadow-md">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE B: 3D ROTATING PERSPECTIVE CUBE (Matching User Screenshot 2 with Guaranteed Face Visibility) */}
      {displayMode === 'cube' && (
        <div
          className="relative w-full flex items-center justify-center overflow-visible py-2 cursor-grab active:cursor-grabbing"
          style={{ perspective: '1200px', height: '450px' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient Color Glow behind stage */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className="w-72 h-72 rounded-full blur-3xl transition-colors duration-700 opacity-25"
              style={{ backgroundColor: currentPortrait.color }}
            />
            <div className="w-64 h-64 rounded-full bg-purple-600/20 blur-3xl transform translate-x-10" />
          </div>

          {/* 3D Rotating Panels Container */}
          <div
            style={{
              width: '280px',
              height: '430px',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
            className="relative"
          >
            {PORTRAITS.map((item, idx) => {
              let diff = idx - activeIndex;
              if (diff > 2) diff -= 5;
              if (diff < -2) diff += 5;

              const isFront = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;

              let transform = 'translateZ(-300px) scale(0.6)';
              let opacity = 0;
              let zIndex = 0;
              let pointerEvents: 'auto' | 'none' = 'none';

              if (isFront) {
                transform = 'translateZ(0px) rotateY(0deg) scale(1)';
                opacity = 1;
                zIndex = 30;
                pointerEvents = 'auto';
              } else if (isRight) {
                transform = 'translateX(140px) translateZ(-120px) rotateY(-36deg) scale(0.85)';
                opacity = 0.45;
                zIndex = 10;
              } else if (isLeft) {
                transform = 'translateX(-140px) translateZ(-120px) rotateY(36deg) scale(0.85)';
                opacity = 0.45;
                zIndex = 10;
              }

              return (
                <div
                  key={item.id}
                  style={{
                    width: '280px',
                    height: '430px',
                    transform,
                    opacity,
                    zIndex,
                    pointerEvents,
                    transition: 'all 0.85s cubic-bezier(0.25, 1, 0.5, 1)',
                    transformStyle: 'preserve-3d',
                  }}
                  className={`absolute top-0 left-0 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl ${
                    isFront
                      ? 'border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)]'
                      : 'border border-white/10 brightness-75'
                  }`}
                >
                  {/* Background Ambient Glass Texture */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} backdrop-blur-md`} />

                  {/* Ambient Blurred Portrait in background */}
                  <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                    <img
                      src={viewMode === 'portrait' ? item.portraitImg : item.fullImg}
                      alt=""
                      className="w-full h-full object-cover filter blur-xl scale-125"
                      aria-hidden="true"
                    />
                  </div>

                  {/* THE PORTRAIT: 100% Complete Face, Hair, Headroom & Shoulders Visible */}
                  <div className="relative w-full h-full flex flex-col items-center justify-start p-3 z-10">
                    {/* Style Badge at top */}
                    <div className="w-full flex items-center justify-between px-2 py-1 mb-1">
                      <span
                        className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-md"
                        style={{
                          backgroundColor: `${item.color}25`,
                          color: item.color,
                          border: `1px solid ${item.color}50`,
                        }}
                      >
                        STYLE {item.number}
                      </span>
                      <span className="text-[9px] font-mono text-cyan-300 font-semibold tracking-wider">
                        {viewMode === 'portrait' ? 'PORTRAIT' : 'FULL FIGURE'}
                      </span>
                    </div>

                    {/* Generous Photo Frame with Headroom: Zero Cropping, Full Facial Visibility */}
                    <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950/60 border border-white/10 p-1">
                      <img
                        src={viewMode === 'portrait' ? item.portraitImg : item.fullImg}
                        alt={`Fuzail Ahmed - ${item.title}`}
                        className="w-full h-full object-contain filter contrast-[1.03] transition-all duration-300"
                        style={{
                          objectPosition: 'center top',
                        }}
                        draggable={false}
                        loading="eager"
                      />

                      {/* Glass reflections */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none rounded-2xl" />
                    </div>

                    {/* Bottom Sub-HUD Inside Card */}
                    <div className="w-full mt-2 p-2 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md flex items-center justify-between">
                      <div>
                        <p className="text-xs font-heading font-black text-white tracking-wide">
                          {item.title}
                        </p>
                        <p className="text-[9px] font-mono text-cyan-300">
                          {item.tag}
                        </p>
                      </div>
                      <UserCheck size={14} className="text-cyan-400" />
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Active Caption Bar */}
      <div className="w-full px-3 py-2.5 mt-2 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md flex items-center justify-between shadow-lg">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${currentPortrait.color}20`,
                color: currentPortrait.color,
                border: `1px solid ${currentPortrait.color}40`,
              }}
            >
              STYLE {currentPortrait.number}
            </span>
            <span className="text-xs sm:text-sm font-heading font-bold text-white">
              {currentPortrait.title}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">
            {currentPortrait.subtitle}
          </p>
        </div>

        {/* 01 / 05 Counter */}
        <div className="text-right pl-3 border-l border-white/10">
          <span className="text-sm font-mono font-black text-cyan-400">
            {currentPortrait.number}
          </span>
          <span className="text-xs font-mono text-slate-500"> / 05</span>
        </div>
      </div>

      {/* Navigation Controls & Pagination */}
      <div className="w-full flex items-center justify-between mt-3 px-1">
        {/* Prev Button */}
        <button
          onClick={prevPortrait}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-cyan-950 border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all shadow-md active:scale-95"
          aria-label="Previous portrait style"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {PORTRAITS.map((item, i) => (
            <button
              key={item.id}
              onClick={() => goToIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-7 bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                  : 'w-2.5 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Jump to style ${i + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextPortrait}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-cyan-950 border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all shadow-md active:scale-95"
          aria-label="Next portrait style"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Subtle Interaction Hint */}
      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-slate-400 tracking-widest uppercase">
        <Sparkles size={12} className="text-cyan-400" />
        <span>{displayMode === 'lookbook' ? 'CLICK ANY STYLE TO EXPLORE DETAILS' : 'DRAG OR CLICK TO EXPLORE 5 PERSPECTIVES'}</span>
      </div>

      {/* Preserved Domain Cards */}
      <div className="grid grid-cols-3 gap-2 mt-4 w-full text-center">
        <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-cyan-400/30 transition-colors">
          <span className="text-[11px] font-mono font-bold text-cyan-300 block">JAVA</span>
          <span className="text-[9px] text-slate-400">Spring Boot</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-violet-400/30 transition-colors">
          <span className="text-[11px] font-mono font-bold text-violet-300 block">ANGULAR</span>
          <span className="text-[9px] text-slate-400">PrimeNG &amp; TS</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-emerald-400/30 transition-colors">
          <span className="text-[11px] font-mono font-bold text-emerald-300 block">ERP</span>
          <span className="text-[9px] text-slate-400">Enterprise Systems</span>
        </div>
      </div>
    </div>
  );
};
