import React, { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'init' | 'particles' | 'initials' | 'title' | 'ready'>('init');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 6) + 3;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress < 20) {
      setPhase('init');
    } else if (progress < 50) {
      setPhase('particles');
    } else if (progress < 80) {
      setPhase('initials');
    } else if (progress < 100) {
      setPhase('title');
    } else {
      setPhase('ready');
    }
  }, [progress]);

  return (
    <aside
      aria-label="Loading Screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] text-white transition-opacity duration-700 select-none overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      {/* Thin Cinematic Light Trails */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[20%] -left-full w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[laserTrail_3s_infinite_linear]" />
        <div className="absolute top-[45%] -left-full w-full h-[1px] bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-[laserTrail_4s_infinite_linear_1s]" />
        <div className="absolute top-[75%] -left-full w-full h-[1px] bg-gradient-to-r from-transparent via-sky-300 to-transparent animate-[laserTrail_3.5s_infinite_linear_0.5s]" />
      </div>

      {/* Floating Micro Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/60 blur-[0.5px] animate-pulse"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 19) % 100}%`,
              left: `${(i * 27) % 100}%`,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.2)}s`,
            }}
          />
        ))}
      </div>

      {/* Center Reveal Element */}
      <div className="relative flex flex-col items-center z-10">
        {/* Glowing Geometric Box with FA */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900/80 border border-cyan-400/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.35)] mb-8 transform transition-all duration-500 hover:scale-105">
          {/* Pulsing corner accents */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

          {/* Initials FA */}
          <span
            className={`font-heading font-black text-4xl sm:text-5xl tracking-wider transition-all duration-500 ${
              progress >= 30
                ? 'opacity-100 scale-100 bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent'
                : 'opacity-0 scale-75'
            }`}
          >
            {PORTFOLIO_DATA.profile.initials}
          </span>
        </div>

        {/* Text Sequence: FUZAIL AHMED -> FULL STACK DEVELOPER */}
        <div className="text-center h-16 flex flex-col justify-center">
          <h2
            className={`font-heading font-bold text-xl sm:text-2xl tracking-[0.25em] text-white uppercase transition-all duration-500 ${
              progress >= 55 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {PORTFOLIO_DATA.profile.name}
          </h2>

          <p
            className={`font-mono text-xs sm:text-sm tracking-[0.3em] text-cyan-400 uppercase mt-1 transition-all duration-500 ${
              progress >= 75 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {PORTFOLIO_DATA.profile.title}
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-64 sm:w-80 h-1 bg-slate-800/80 rounded-full mt-8 overflow-hidden relative border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-150 ease-out rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Phase Label */}
        <div className="flex items-center justify-between w-64 sm:w-80 mt-3 text-[11px] font-mono text-slate-400">
          <span className="tracking-widest uppercase">
            {phase === 'init' && 'SYSTEM INITIALIZING'}
            {phase === 'particles' && 'SYNCHRONIZING 3D WORLD'}
            {phase === 'initials' && 'COMPOSING ASSETS'}
            {phase === 'title' && 'CALIBRATING ENVIRONMENT'}
            {phase === 'ready' && 'EXPERIENCE READY'}
          </span>
          <span className="text-cyan-400 font-semibold">{progress}%</span>
        </div>
      </div>
    </aside>
  );
};
