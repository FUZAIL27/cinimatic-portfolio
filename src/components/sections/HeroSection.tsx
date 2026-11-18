import React, { useRef, useState, useEffect } from 'react';
import {
  Code2,
  Sparkles,
  ArrowRight,
  FileText,
  Send,
  Download,
  UserCheck,
  Bot,
} from 'lucide-react';
import heroImg from '../../assets/images/fuzail-hero.webp';
import faceImg from '../../assets/images/fuzail-face.jpg';
import { HolographicArchitecture } from './HolographicArchitecture';
import './FluxoraStructure.css';
import { useExperienceMode } from '../../context/ExperienceModeContext';
import { AIVoicePlayer } from '../common/AIVoicePlayer';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onOpenResume: () => void;
  onContactClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onOpenResume,
  onContactClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const { activeMode, setMode } = useExperienceMode();
  const [selectedPhoto, setSelectedPhoto] = useState<'cube' | 'portrait'>('cube');
  const [touchState, setTouchState] = useState<{ isTouching: boolean; intensity: number }>({
    isTouching: false,
    intensity: 0,
  });

  // Listen to 3D Spider-Man touch events dispatched from Three.js
  useEffect(() => {
    const handleTouch = (e: Event) => {
      const custom = e as CustomEvent<{ isTouching: boolean; intensity: number }>;
      if (custom.detail) {
        setTouchState(custom.detail);
      }
    };
    window.addEventListener('spiderman-photo-touch', handleTouch);
    return () => window.removeEventListener('spiderman-photo-touch', handleTouch);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-start lg:justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-28 pb-16 z-10 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto pointer-events-auto">
        {activeMode === 'cinematic' ? (
          /* ========================================================
           * CINEMATIC MODE — RESPONSIVE MULTI-DEVICE ARCHITECTURE:
           * DESKTOP (lg+): 3-Column Layout (Left Info, Center Spider-Man, Right Photo)
           * MOBILE & TABLET (<lg): Clean Vertical Composition with Dedicated
           * Unobscured Spider-Man Walking Viewport & Head-to-Toe Visibility
           * ======================================================== */
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-6 items-center w-full">
            {/* Top Identity Header: Mobile & Tablet ONLY (Ensures zero text overlap with Spider-Man) */}
            <div className="w-full text-center space-y-2 lg:hidden">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-cyan-300 uppercase font-semibold">
                  JAVA FULL STACK DEVELOPER
                </span>
              </div>
              <div className="space-y-0.5">
                <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tighter text-white leading-none">
                  FUZAIL <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">AHMED</span>
                </h1>
                <p className="font-heading font-bold text-base sm:text-xl tracking-tight text-cyan-300">
                  FULL STACK DEVELOPER
                </p>
              </div>
            </div>

            {/* 1. DEDICATED 3D SPIDER-MAN VIEWPORT: Order 1 on mobile/tablet, Center (Col 2) on Desktop */}
            <div className="order-1 lg:order-2 w-full lg:col-span-4 flex flex-col justify-between items-center min-h-[380px] xs:min-h-[420px] sm:min-h-[460px] lg:min-h-[560px] pointer-events-none relative">
              {/* Top Center: Minimal Superhero Alliance Telemetry Pill */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 border border-red-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.25)] pointer-events-auto flex-wrap justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#ef4444]" />
                <span className="text-[10px] sm:text-[11px] font-mono text-white font-bold uppercase tracking-wider">
                  SPIDER-MAN ONLINE
                </span>

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('replay-cinematic-intro'))}
                  className="ml-1 sm:ml-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600/40 to-cyan-600/40 hover:from-red-600 hover:to-cyan-600 border border-white/20 text-[10px] font-mono text-white font-bold tracking-wider flex items-center gap-1 transition-all hover:scale-105 active:scale-95 shadow-md"
                  title="Replay Spider-Man and Fuzail Ahmed rooftop handshake sequence"
                >
                  <Sparkles size={11} className="text-cyan-300" />
                  <span>▶ REPLAY</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('spiderman-shoot-web'))}
                  className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600/70 to-rose-600/70 hover:from-red-600 hover:to-rose-500 border border-red-400/50 text-[10px] font-mono text-white font-bold tracking-wider flex items-center gap-1 transition-all hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                  title="Shoot high-velocity web strand (or press Space / W key)"
                >
                  <span className="text-xs">🕸️</span>
                  <span>SHOOT WEB</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('professional');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('replay-robot-intro'));
                    }, 400);
                  }}
                  className="px-2.5 py-1 rounded-full bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 font-bold tracking-wider flex items-center gap-1 transition-all hover:scale-105 active:scale-95 shadow-md"
                  title="Switch to AI Robot Assistant Introduction"
                >
                  <Bot size={11} className="text-cyan-400 animate-pulse" />
                  <span>ROBOT INTRO</span>
                </button>
              </div>

              {/* Center Space: 100% COMPLETELY OPEN & TRANSPARENT for large 3D Spider-Man walking stage */}
              <div className="flex-1 w-full" />

              {/* Bottom Center: Interactive Rooftop Scroll Prompt */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/75 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-300 pointer-events-auto shadow-lg">
                <span className="text-cyan-400 font-bold uppercase">ROOFTOP SUMMIT</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-200">SCROLL TO SWING ↓</span>
              </div>
            </div>

            {/* 2. DEVELOPER INTRO & CTAs: Order 2 on mobile/tablet, Left (Col 1) on Desktop */}
            <div className="order-2 lg:order-1 w-full lg:col-span-4 space-y-4 text-left">
              {/* Desktop Headline & Badge (shown only on lg+ where it occupies column 1) */}
              <div className="hidden lg:block space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-cyan-300 uppercase font-semibold">
                    JAVA FULL STACK DEVELOPER
                  </span>
                </div>

                <div className="space-y-1">
                  <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-5xl xl:text-6xl tracking-tighter text-white leading-none">
                    FUZAIL <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">AHMED</span>
                  </h1>
                  <p className="font-heading font-bold text-lg sm:text-2xl tracking-tight text-cyan-300">
                    FULL STACK DEVELOPER
                  </p>
                </div>
              </div>

              {/* Professional Introduction */}
              <p className="text-xs sm:text-sm font-heading font-medium text-slate-300 tracking-tight leading-relaxed max-w-md">
                Building scalable enterprise architectures, reactive web applications, and mission-critical ERP solutions with <span className="text-cyan-400 font-semibold">Code</span>, <span className="text-violet-400 font-semibold">AI</span> &amp; <span className="text-sky-400 font-semibold">Creativity</span>.
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                  Java • Spring Boot
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-blue-950/60 text-sky-300 border border-blue-800/60">
                  Angular • PrimeNG
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-violet-950/60 text-violet-300 border border-violet-800/60">
                  React • TypeScript
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                  Node.js • MySQL
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-800/60">
                  Microservices • Docker
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onExploreProjects}
                  className="btn-primary text-xs sm:text-sm px-4 py-2"
                >
                  <span>VIEW PROJECTS</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={onOpenResume}
                  className="btn-secondary text-xs sm:text-sm px-4 py-2"
                >
                  <FileText size={15} className="text-cyan-400" />
                  <span>RESUME</span>
                </button>

                <button
                  type="button"
                  onClick={onContactClick}
                  className="btn-secondary text-xs sm:text-sm px-4 py-2"
                >
                  <Send size={15} className="text-violet-400" />
                  <span>CONTACT</span>
                </button>
              </div>

              {/* Friendly Natural Male AI Voice Introduction Player */}
              <div className="pt-2">
                <AIVoicePlayer />
              </div>
            </div>

            {/* 3. RIGHT COLUMN: FUZAIL AHMED REAL PERSONAL PHOTOGRAPH: Order 3 on all screens */}
            <div className="order-3 lg:order-3 w-full lg:col-span-4 flex flex-col items-center lg:items-end">
              <div
                onMouseEnter={() => {
                  (window as any).__spidermanPhotoHover = true;
                }}
                onMouseLeave={() => {
                  (window as any).__spidermanPhotoHover = false;
                }}
                className={`relative w-full max-w-[288px] xs:max-w-[330px] sm:max-w-[370px] rounded-3xl p-3 sm:p-3.5 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-cyan-950/50 border-2 transition-all duration-300 shadow-2xl group cursor-pointer ${
                touchState.isTouching
                  ? 'border-cyan-300 shadow-[0_0_60px_rgba(6,182,212,0.85)] scale-[1.02]'
                  : 'border-cyan-500/40 shadow-[0_20px_50px_rgba(6,182,212,0.25)] hover:border-cyan-400/70'
              }`}>
                {/* Glowing Cybernetic Corner Brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl shadow-[0_0_10px_#06b6d4]" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl shadow-[0_0_10px_#06b6d4]" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl shadow-[0_0_10px_#06b6d4]" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl shadow-[0_0_10px_#06b6d4]" />

                {/* Top Telemetry Header & Photo Selector Tabs */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <UserCheck size={13} className={touchState.isTouching ? 'text-cyan-300 animate-pulse' : 'text-cyan-400'} />
                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      {touchState.isTouching ? '⚡ NEURAL ALLIANCE ONLINE' : 'VERIFIED 100% REAL'}
                    </span>
                  </div>

                  {/* Photo Mode Switcher & Touch Trigger */}
                  <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-cyan-500/30">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto('cube');
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                        selectedPhoto === 'cube'
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_#06b6d4]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Holographic Cube Portrait"
                    >
                      CUBE
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto('portrait');
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                        selectedPhoto === 'portrait'
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_#06b6d4]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Developer Portrait"
                    >
                      PORTRAIT
                    </button>
                  </div>
                </div>

                {/* Portrait Image Frame - Complete face and photo fully visible without unwanted cropping */}
                <div className="relative rounded-2xl overflow-hidden aspect-[838/945] bg-slate-950/90 border border-white/15 shadow-inner flex items-center justify-center">
                  <img
                    src={selectedPhoto === 'cube' ? heroImg : faceImg}
                    alt="Fuzail Ahmed - Java Full Stack Developer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                  {/* Glass Reflection Sheen & Contact Pulse Sheen */}
                  {touchState.isTouching && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none -skew-x-12 animate-pulse" />
                      <div className="absolute inset-0 border-2 border-cyan-400/60 shadow-[inset_0_0_20px_rgba(6,182,212,0.4)] pointer-events-none rounded-2xl" />
                    </>
                  )}
                </div>

                {/* Card Footer: Identity & Organization (Matches Screenshot) */}
                <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-md flex items-center justify-between shadow-lg">
                  <div className="text-left">
                    <span className="font-heading font-black text-white text-xs tracking-wider block">
                      FUZAIL AHMED
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Tech Solution • Dammam Branch
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30">
                    JAVA &amp; FULL STACK
                  </span>
                </div>

                {/* Physical Contact Border Reaction */}
                {touchState.isTouching && (
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <span className="absolute -left-2 -top-2 w-8 h-8 rounded-full bg-cyan-400/40 animate-ping" />
                    <div className="w-3 h-12 rounded-full bg-gradient-to-b from-cyan-400 via-sky-300 to-cyan-500 shadow-[0_0_20px_#00e5ff] animate-pulse" />
                  </div>
                )}

                {/* Floating Skill Badges */}
                <div className="absolute -right-2 top-1/3 px-2 py-0.5 rounded-xl bg-slate-900/95 border border-cyan-400/60 backdrop-blur-md shadow-lg text-[9px] font-mono text-cyan-300 font-bold flex items-center gap-1 pointer-events-none">
                  <Code2 size={10} className="text-cyan-400" />
                  <span>React • Angular</span>
                </div>

                <div className="absolute -right-2 bottom-16 px-2 py-0.5 rounded-xl bg-slate-900/95 border border-violet-400/60 backdrop-blur-md shadow-lg text-[9px] font-mono text-violet-300 font-bold flex items-center gap-1 pointer-events-none">
                  <Sparkles size={10} className="text-violet-400" />
                  <span>Java • Spring</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeMode === 'structure' ? (
          /* ========================================================
           * STRUCTURE MODE — ULTRA-HD 4K MASTER ARCHITECTURAL PORTFOLIO:
           * Perfectly structured, clean, symmetrical, and fully responsive layout.
           * LEFT: Professional Developer Profile Card with unified margins & hierarchy.
           * RIGHT: Holographic System Architecture Pipeline + Natural AI Voice Panel.
           * ======================================================== */
          <div className="w-full my-auto py-4 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center w-full">
              {/* ========================================================
               * LEFT COLUMN — DEVELOPER PROFILE COCKPIT
               * Transparent glassmorphism revealing the 3D environment,
               * consistent margins, visual hierarchy & glowing tech elements
               * ======================================================== */}
              <div className="lg:col-span-6 xl:col-span-6 relative rounded-2xl p-5 sm:p-6 bg-slate-950/25 hover:bg-slate-950/35 border border-[#00e5ff]/35 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex flex-col justify-center space-y-5 text-left z-20 w-full pointer-events-auto transition-all">
                {/* Cybernetic Corner Brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400/60 rounded-tl-xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400/60 rounded-tr-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400/60 rounded-bl-xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400/60 rounded-br-xl pointer-events-none" />

                {/* Top Telemetry Header Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-white uppercase">
                      DEVELOPER COCKPIT
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-300">
                    <span className="text-white/40 font-mono">ROLE:</span>
                    <span className="text-[#00e5ff] font-semibold">ENTERPRISE LEAD</span>
                  </div>
                </div>

                {/* 1. Large Bold Headline & Identity */}
                <div className="space-y-1">
                  <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-white tracking-tight leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
                    FUZAIL AHMED
                  </h1>
                  <p className="font-heading font-black text-2xl sm:text-3xl lg:text-3xl xl:text-4xl tracking-tight text-[#00e5ff] drop-shadow-[0_0_30px_rgba(0,229,255,0.7)] leading-tight">
                    FULL STACK DEVELOPER
                  </p>
                </div>

                {/* 2. Professional Mission Statement */}
                <p className="text-xs sm:text-sm lg:text-base text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                  Building scalable enterprise architectures, reactive web applications, and mission-critical ERP solutions with{' '}
                  <span className="text-[#00e5ff] font-semibold">Code</span>,{' '}
                  <span className="text-[#ff5500] font-semibold">AI</span> &amp;{' '}
                  <span className="text-violet-400 font-semibold">Creativity</span>.
                </p>

                {/* 3. 3x3 Core Technology Stack Grid with Icons (Translucent Glass) */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full">
                    {[
                      {
                        name: 'Java',
                        color: '#ff8a1f',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <path d="M4 19c3 1.5 8 1.5 11 0M4 22c4 1 9 1 13 0M17 11a4 4 0 010 8h-2" stroke="#ff8a1f" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M6 10c0 4 2 8 8 8s7-4 7-8H6z" fill="#ff5500" fillOpacity="0.25" stroke="#ff8a1f" strokeWidth="1.8" />
                            <path d="M10 2c0 2-2 3-2 5M14 2c0 2-2 3-2 5" stroke="#ff8a1f" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        ),
                      },
                      {
                        name: 'Spring Boot',
                        color: '#34d399',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <path d="M6 18C6 10 12 4 19 4c0 7-6 13-13 14z" fill="#10b981" fillOpacity="0.25" stroke="#34d399" strokeWidth="1.8" />
                            <path d="M6 18c3-3 7-5 13-14M6 18l-3 3" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        ),
                      },
                      {
                        name: 'Angular',
                        color: '#f87171',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <path d="M12 2L3 5l2 12 7 5 7-5 2-12-9-3z" fill="#ef4444" fillOpacity="0.25" stroke="#f87171" strokeWidth="1.8" />
                            <path d="M12 6L8 16h2l1-2.5h2l1 2.5h2L12 6zm-1 6l1-3 1 3h-2z" fill="#f87171" />
                          </svg>
                        ),
                      },
                      {
                        name: 'React',
                        color: '#00e5ff',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <circle cx="12" cy="12" r="2.2" fill="#00e5ff" />
                            <ellipse cx="12" cy="12" rx="8.5" ry="3.2" stroke="#00e5ff" strokeWidth="1.5" transform="rotate(0 12 12)" />
                            <ellipse cx="12" cy="12" rx="8.5" ry="3.2" stroke="#00e5ff" strokeWidth="1.5" transform="rotate(60 12 12)" />
                            <ellipse cx="12" cy="12" rx="8.5" ry="3.2" stroke="#00e5ff" strokeWidth="1.5" transform="rotate(120 12 12)" />
                          </svg>
                        ),
                      },
                      {
                        name: 'TypeScript',
                        color: '#60a5fa',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <rect x="2" y="2" width="20" height="20" rx="4" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="1.8" />
                            <path d="M6 9h6M9 9v9M14 15.5c.7.6 1.6 1 2.5 1 1 0 1.5-.5 1.5-1.1 0-1.7-3-1-3-3 0-1.2.9-2.1 2.5-2.1.8 0 1.6.3 2.2.8M15 10.3l-.7 1.4" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      },
                      {
                        name: 'Node.js',
                        color: '#4ade80',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <path d="M12 2l8 4.6v9.2L12 20.4l-8-4.6V6.6L12 2z" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="1.8" />
                            <path d="M12 7v10M7 9.5l5 3 5-3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        ),
                      },
                      {
                        name: 'MySQL',
                        color: '#38bdf8',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <path d="M4 6c0-2.2 3.6-4 8-4s8 1.8 8 4-3.6 4-8 4-8-1.8-8-4z" stroke="#38bdf8" strokeWidth="1.6" />
                            <path d="M4 6v6c0 2.2 3.6 4 8 4s8-1.8 8-4V6" stroke="#38bdf8" strokeWidth="1.6" />
                            <path d="M4 12v6c0 2.2 3.6 4 8 4s8-1.8 8-4v-6" stroke="#38bdf8" strokeWidth="1.6" />
                          </svg>
                        ),
                      },
                      {
                        name: 'Microservices',
                        color: '#c084fc',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <path d="M12 2L4 6.5v9L12 20l8-4.5v-9L12 2z" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="1.8" />
                            <path d="M12 11l8-4.5M12 11v9M12 11L4 6.5" stroke="#c084fc" strokeWidth="1.5" />
                          </svg>
                        ),
                      },
                      {
                        name: 'Docker',
                        color: '#22d3ee',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <rect x="6" y="9" width="3" height="3" rx="0.5" fill="#22d3ee" />
                            <rect x="10" y="9" width="3" height="3" rx="0.5" fill="#22d3ee" />
                            <rect x="14" y="9" width="3" height="3" rx="0.5" fill="#22d3ee" />
                            <rect x="10" y="5" width="3" height="3" rx="0.5" fill="#22d3ee" />
                            <path d="M3 13c1 0 2 .5 3 .5s2-.5 3-.5 2 .5 3 .5 2-.5 3-.5 2 .5 3 .5 2-.5 3-.5c.5 3-2 6-8 6-5 0-7.5-2.5-7-5.5z" stroke="#22d3ee" strokeWidth="1.5" fill="#22d3ee" fillOpacity="0.25" />
                          </svg>
                        ),
                      },
                    ].map((tech) => (
                      <div
                        key={tech.name}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-950/20 hover:bg-slate-900/40 border border-white/15 hover:border-cyan-400/50 backdrop-blur-md transition-all duration-200 group hover:scale-[1.02] cursor-default shadow-sm"
                      >
                        <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-black/25 border border-white/10">
                          {tech.icon}
                        </div>
                        <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-100 group-hover:text-white truncate drop-shadow-sm">
                          {tech.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Action CTA Buttons (View Projects, Resume, Contact) */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* VIEW PROJECTS */}
                  <button
                    type="button"
                    onClick={onExploreProjects}
                    className="group inline-flex items-center justify-between gap-3 px-5 sm:px-6 h-12 rounded-full bg-gradient-to-r from-[#ff4500] via-[#ff6000] to-[#ff8a1f] text-white font-heading font-black text-xs sm:text-sm tracking-wider shadow-[0_10px_30px_rgba(255,69,0,0.5)] hover:shadow-[0_15px_40px_rgba(255,69,0,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    <span>VIEW PROJECTS</span>
                    <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#ff5500] shadow-sm group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </span>
                  </button>

                  {/* RESUME */}
                  <button
                    type="button"
                    onClick={onOpenResume}
                    className="group inline-flex items-center gap-2 px-5 sm:px-6 h-12 rounded-full bg-slate-950/25 hover:bg-slate-900/50 text-white font-heading font-black text-xs sm:text-sm tracking-wider border-2 border-white/20 hover:border-cyan-400/70 backdrop-blur-md shadow-lg hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] transition-all duration-300 active:scale-95"
                  >
                    <span>RESUME</span>
                    <Download size={15} className="text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                  </button>

                  {/* CONTACT */}
                  <button
                    type="button"
                    onClick={onContactClick}
                    className="group inline-flex items-center gap-2 px-5 sm:px-6 h-12 rounded-full bg-slate-950/25 hover:bg-slate-900/50 text-white font-heading font-black text-xs sm:text-sm tracking-wider border-2 border-white/20 hover:border-[#ff5500]/70 backdrop-blur-md shadow-lg hover:shadow-[0_0_25px_rgba(255,85,0,0.3)] transition-all duration-300 active:scale-95"
                  >
                    <span>CONTACT</span>
                    <Send size={15} className="text-[#ff8a1f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* ========================================================
               * RIGHT COLUMN — HOLOGRAPHIC ARCHITECTURE & AI VOICE PANEL
               * Natural symmetry with glassmorphism depth and live audio
               * ======================================================== */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between space-y-5 z-20 w-full h-full">
                <HolographicArchitecture />
                <AIVoicePlayer className="w-full max-w-none" />
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
           * STANDARD MODES (PROFESSIONAL, STRUCTURE, DEVELOPER):
           * Typography on Left, 3D Tilt Card on Right
           * ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Status Badge */}
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase font-semibold">
                  JAVA FULL STACK DEVELOPER • TECH SOLUTION
                </span>
                {activeMode === 'professional' && (
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('replay-robot-intro'))}
                    className="ml-2 px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-300 hover:bg-cyan-900/90 hover:text-white transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    title="Replay Fuzail Ahmed's AI Robot Introduction"
                  >
                    <Bot size={11} className="text-cyan-400 animate-pulse" />
                    <span>▶ REPLAY ROBOT INTRO</span>
                  </button>
                )}
              </div>

              {/* Display Name */}
              <div className="space-y-1">
                <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-white leading-none">
                  FUZAIL <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">AHMED</span>
                </h1>
                <p className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight text-cyan-300">
                  FULL STACK DEVELOPER
                </p>
              </div>

              {/* Primary Tagline */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-medium text-slate-200 tracking-tight leading-snug max-w-2xl">
                BUILDING DIGITAL EXPERIENCES <br className="hidden sm:inline" />
                WITH <span className="text-cyan-400 font-semibold">CODE</span>, <span className="text-violet-400 font-semibold">AI</span> &amp; <span className="text-sky-400 font-semibold">CREATIVITY</span>.
              </h2>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950/50 text-cyan-300 border border-cyan-800/60">
                  Java • Spring Boot
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-950/50 text-sky-300 border border-blue-800/60">
                  Angular • PrimeNG
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-violet-950/50 text-violet-300 border border-violet-800/60">
                  React • TypeScript
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-800/60">
                  MySQL • REST APIs
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-fuchsia-950/50 text-fuchsia-300 border border-fuchsia-800/60">
                  Microservices • Docker
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={onExploreProjects}
                  className="btn-primary"
                >
                  <span>VIEW PROJECTS</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onOpenResume}
                  className="btn-secondary"
                >
                  <FileText size={16} className="text-cyan-400" />
                  <span>DOWNLOAD RESUME</span>
                </button>

                <button
                  onClick={onContactClick}
                  className="btn-secondary"
                >
                  <Send size={16} className="text-violet-400" />
                  <span>CONTACT ME</span>
                </button>
              </div>
            </div>

            {/* Right Column: 3D Tilt Card */}
            <div className="lg:col-span-5 flex justify-center items-center perspective-1000 min-h-[500px]">
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative w-full max-w-[340px] sm:max-w-[390px] md:max-w-[430px] rounded-3xl p-3.5 sm:p-4 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-cyan-950/50 border-2 border-cyan-400/40 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(6,182,212,0.45)] group transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(6,182,212,0.6)]"
              >
                {/* Top Bar with HUD badges */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_#06b6d4]" />
                    <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      ID: FUZAIL-DEV-3D
                    </span>
                  </div>
                  
                  <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                    VERIFIED 100%
                  </span>
                </div>

                {/* Portrait Image Frame */}
                <div className="relative rounded-2xl overflow-hidden aspect-[838/945] bg-slate-950 border border-white/15 shadow-2xl">
                  <img
                    src={heroImg}
                    alt="Fuzail Ahmed - Java Full Stack Developer"
                    className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

                  {/* Glowing Corner Accents */}
                  <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-cyan-400/80 rounded-tl-md" />
                  <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-violet-400/80 rounded-tr-md" />

                  {/* Bottom Holographic HUD Info */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-md shadow-lg">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-heading font-black text-white tracking-wide">
                        FUZAIL AHMED
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        JAVA &amp; FULL STACK
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                      Tech Solution • Enterprise ERP Architecture
                    </p>
                  </div>
                </div>

                {/* Floating 3D Tech Badge 1: Frontend (Top Right) */}
                <div
                  style={{ transform: 'translateZ(42px)' }}
                  className="absolute -top-3 -right-3 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-cyan-400/60 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.45)] flex items-center gap-1.5 text-xs font-mono text-cyan-300 pointer-events-none"
                >
                  <Sparkles size={13} className="text-cyan-400 animate-spin-slow" />
                  <span className="font-bold">React • Angular</span>
                </div>

                {/* Floating 3D Tech Badge 2: Backend & Microservices (Bottom Left) */}
                <div
                  style={{ transform: 'translateZ(36px)' }}
                  className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-violet-400/60 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.45)] flex items-center gap-1.5 text-xs font-mono text-violet-300 pointer-events-none"
                >
                  <Code2 size={13} className="text-violet-400" />
                  <span className="font-bold">Java • Spring Boot</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Explore Prompt */}
      <div className="mt-8 flex flex-col items-center gap-2 pointer-events-auto">
        <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
          SCROLL TO EXPLORE 3D WORLD
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-slate-600 flex items-start justify-center p-1">
          <div className="w-1.5 h-2 bg-cyan-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
