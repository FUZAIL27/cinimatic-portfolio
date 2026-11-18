import React, { useEffect } from 'react';
import { useExperienceMode } from '../../context/ExperienceModeContext';
import {
  EXPERIENCE_MODES,
  type ExperienceMode,
} from '../../data/experienceModes';
import { Sparkles, Bot, Layers, Terminal, Film, X, Check, ArrowRight } from 'lucide-react';

interface ExperienceModeSelectorProps {
  onAudioBlip?: (freq?: number) => void;
}

export const ExperienceModeSelector: React.FC<ExperienceModeSelectorProps> = ({ onAudioBlip }) => {
  const { activeMode, setMode, isSelectorOpen, setIsSelectorOpen, toggleSelector } =
    useExperienceMode();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSelectorOpen) {
        setIsSelectorOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelectorOpen, setIsSelectorOpen]);

  const getModeIcon = (id: ExperienceMode, size = 18) => {
    switch (id) {
      case 'professional':
        return <Bot size={size} />;
      case 'structure':
        return <Layers size={size} />;
      case 'developer':
        return <Terminal size={size} />;
      case 'cinematic':
      default:
        return <Film size={size} />;
    }
  };

  const handleSelect = (mode: ExperienceMode) => {
    if (onAudioBlip) onAudioBlip(780);
    setMode(mode);
  };

  return (
    <>
      {/* 1. Floating Experience Mode Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 sm:bottom-7 sm:right-7">
        <button
          onClick={() => {
            if (onAudioBlip) onAudioBlip(640);
            toggleSelector();
          }}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/85 border border-cyan-500/40 hover:border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
          title="Switch 3D Visual Experience Mode"
          aria-label="Open Experience Mode Selector"
        >
          {/* Ambient Glow Aura */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />

          <div className="relative flex items-center gap-2">
            <span className="p-1 rounded-full bg-cyan-500/20 text-cyan-300 group-hover:rotate-12 transition-transform">
              {getModeIcon(activeMode, 15)}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase leading-none">
                EXPERIENCE MODE
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 leading-tight">
                {activeMode.toUpperCase()}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse ml-0.5" />
          </div>
        </button>
      </div>

      {/* 2. Glassmorphic Experience Mode Modal Popup */}
      {isSelectorOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setIsSelectorOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl my-auto rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950 to-slate-900/90 border border-cyan-500/30 shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-5 sm:p-8 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <Sparkles size={18} className="text-cyan-400 animate-spin-slow" />
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                    VISUAL JOURNEY SELECTOR
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide">
                  EXPERIENCE MODE
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Choose your visual 3D environment. All portfolio sections, projects, and personal
                  details remain fully synchronized and interactive.
                </p>
              </div>

              <button
                onClick={() => setIsSelectorOpen(false)}
                className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/50 hover:bg-white/5 transition-all focus:outline-none"
                aria-label="Close selector"
              >
                <X size={20} />
              </button>
            </div>

            {/* 4 Selectable Preview Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXPERIENCE_MODES.map((mode) => {
                const isActive = activeMode === mode.id;

                return (
                  <div
                    key={mode.id}
                    onClick={() => handleSelect(mode.id)}
                    className={`group relative rounded-2xl p-5 border cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                      isActive
                        ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.35)] scale-[1.01]'
                        : 'bg-slate-950/60 border-white/10 hover:border-cyan-500/50 hover:bg-slate-900/50 hover:shadow-xl'
                    }`}
                  >
                    {/* Background Radial Glow */}
                    <div
                      className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40"
                      style={{ backgroundColor: mode.accentColor }}
                    />

                    <div>
                      {/* Top Badges & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${mode.accentColor}20`,
                            color: mode.accentColor,
                            border: `1px solid ${mode.accentColor}40`,
                          }}
                        >
                          {mode.badge}
                        </span>

                        {isActive ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            <Check size={11} />
                            <span>ACTIVE</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-300 transition-colors">
                            CLICK TO ACTIVATE
                          </span>
                        )}
                      </div>

                      {/* Mode Graphic Preview Window */}
                      <div
                        className={`relative w-full h-28 rounded-xl mb-3.5 overflow-hidden border border-white/10 flex items-center justify-center bg-gradient-to-br ${mode.previewGradient}`}
                      >
                        {/* Ambient decorative graphic elements */}
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                        {mode.id === 'cinematic' && (
                          <div className="relative flex flex-col items-center text-center px-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-1.5 group-hover:scale-110 transition-transform">
                              <Film size={24} />
                            </div>
                            <span className="text-[10px] font-mono text-blue-200 tracking-wider">
                              3D SPIDER-MAN & CITY CANYON
                            </span>
                          </div>
                        )}

                        {mode.id === 'professional' && (
                          <div className="relative flex flex-col items-center text-center px-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] mb-1.5 group-hover:scale-110 transition-transform">
                              <Bot size={24} />
                            </div>
                            <span className="text-[10px] font-mono text-cyan-200 tracking-wider">
                              AI ROBOT INTRO &amp; ENTERPRISE GUIDE
                            </span>
                          </div>
                        )}

                        {mode.id === 'structure' && (
                          <div className="relative flex flex-col items-center text-center px-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-1.5 group-hover:scale-110 transition-transform">
                              <Layers size={24} />
                            </div>
                            <span className="text-[10px] font-mono text-emerald-200 tracking-wider">
                              WIREFRAME ARCHITECTURE BLUEPRINT
                            </span>
                          </div>
                        )}

                        {mode.id === 'developer' && (
                          <div className="relative flex flex-col items-center text-center px-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-1.5 group-hover:scale-110 transition-transform">
                              <Terminal size={24} />
                            </div>
                            <span className="text-[10px] font-mono text-purple-200 tracking-wider">
                              FLOATING CODE PANELS & TERMINALS
                            </span>
                          </div>
                        )}

                        {/* Corner accents */}
                        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/30" />
                        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/30" />
                      </div>

                      {/* Title & Tagline */}
                      <div className="flex items-center gap-2">
                        <span style={{ color: mode.accentColor }}>{getModeIcon(mode.id, 16)}</span>
                        <h3 className="text-base font-heading font-bold text-white tracking-wide">
                          {mode.name} Mode
                        </h3>
                      </div>
                      <p className="text-[11px] font-mono text-cyan-300 mt-0.5">{mode.tagline}</p>

                      {/* Description */}
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {mode.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">
                        {isActive ? 'Currently Active' : 'Switch Mode'}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-mono font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        <span>{isActive ? 'SELECTED' : 'SELECT'}</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer Tip */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Scroll position & section navigation are 100% preserved.</span>
              </div>
              <span className="text-slate-500">Press ESC or click outside to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
