import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, FileText, Sparkles, Terminal, Film, Bot } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { useExperienceMode } from '../../context/ExperienceModeContext';
import { AIVoicePlayer } from './AIVoicePlayer';

interface NavbarProps {
  activeSectionId: string;
  onNavigate: (id: string) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenEasterEgg: () => void;
  onOpenResume: () => void;
  onOpenExperienceMode?: () => void;
  activeMode?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSectionId,
  onNavigate,
  isAudioPlaying,
  onToggleAudio,
  onOpenEasterEgg,
  onOpenResume,
  onOpenExperienceMode,
  activeMode,
}) => {
  const { setMode } = useExperienceMode();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [easterEggClicks, setEasterEggClicks] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    const nextCount = easterEggClicks + 1;
    if (nextCount >= 5) {
      setEasterEggClicks(0);
      onOpenEasterEgg();
    } else {
      setEasterEggClicks(nextCount);
      onNavigate('hero');
    }
  };

  const navLinks = [
    { id: 'about', label: 'ABOUT' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'ai', label: 'AI CORE' },
    { id: 'education', label: 'EDUCATION' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-2.5 bg-[#030712]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl'
            : 'py-3.5 bg-[#030712]/90 backdrop-blur-xl border-b border-white/10 shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Monogram */}
          <button
            onClick={handleLogoClick}
            className="group flex items-center gap-3 text-left focus:outline-none"
            aria-label="Fuzail Ahmed Home"
            title="Click 5 times for Developer Easter Egg"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-400/30 flex items-center justify-center font-heading font-black text-white text-base tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:border-cyan-400 group-hover:scale-105 transition-all duration-300">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                {PORTFOLIO_DATA.profile.initials}
              </span>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="hidden lg:block text-left">
              <span className="font-heading font-bold text-white tracking-wide text-xs block group-hover:text-cyan-300 transition-colors">
                FUZAIL AHMED
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase font-semibold block">
                PORTFOLIO
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 rounded-full px-3 py-1.5 bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-lg">
            {navLinks.map((link) => {
              const isActive = activeSectionId === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'text-cyan-300 font-bold bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Sound, Resume, Easter Egg & Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-full border transition-all duration-300 focus:outline-none ${
                isAudioPlaying
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 bg-slate-900/60'
              }`}
              aria-label={isAudioPlaying ? 'Mute ambient audio' : 'Play ambient audio'}
              title={isAudioPlaying ? 'Mute ambient sound' : 'Enable ambient sci-fi sound'}
            >
              {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Quick Play Voice Control in Navbar */}
            <AIVoicePlayer compact className="hidden sm:inline-flex" />

            {/* Quick Developer Console Trigger */}
            <button
              onClick={onOpenEasterEgg}
              className="hidden lg:flex p-2 rounded-full border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 bg-slate-900/60 transition-all focus:outline-none"
              title="Open Developer Console (Hotkey: F)"
              aria-label="Open Developer Console"
            >
              <Terminal size={16} />
            </button>

            {/* Experience Mode Trigger */}
            {onOpenExperienceMode && (
              <button
                onClick={onOpenExperienceMode}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider text-cyan-300 bg-slate-900/80 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all transform hover:-translate-y-0.5 focus:outline-none"
                title="Switch 3D Visual Experience Mode"
              >
                <Sparkles size={13} className="text-cyan-400 animate-spin-slow" />
                <span className="hidden xl:inline text-slate-300">MODE:</span>
                <span className="text-white font-bold">{activeMode ? activeMode.toUpperCase() : 'CINEMATIC'}</span>
              </button>
            )}

            {/* Watch / Replay Cinematic Intro (when in Cinematic mode) */}
            {(!activeMode || activeMode === 'cinematic') && (
              <>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.dispatchEvent(new CustomEvent('replay-cinematic-intro'));
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-red-300 bg-red-950/30 border border-red-500/40 hover:border-red-400 hover:bg-red-900/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all transform hover:-translate-y-0.5 focus:outline-none"
                  title="Watch Spider-Man & Fuzail Meeting Cinematic Intro"
                >
                  <Film size={13} className="text-red-400 animate-pulse" />
                  <span>CINEMATIC INTRO</span>
                </button>

                <button
                  onClick={() => {
                    setMode('professional');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('replay-robot-intro'));
                    }, 400);
                  }}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-cyan-300 bg-cyan-950/30 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-900/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all transform hover:-translate-y-0.5 focus:outline-none"
                  title="Experience Fuzail Ahmed's AI Robot Assistant Introduction"
                >
                  <Bot size={13} className="text-cyan-400" />
                  <span>AI ROBOT INTRO</span>
                </button>
              </>
            )}

            {/* Watch / Replay AI Robot Intro (when in Professional mode) */}
            {activeMode === 'professional' && (
              <>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.dispatchEvent(new CustomEvent('replay-robot-intro'));
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-cyan-300 bg-cyan-950/40 border border-cyan-400/50 hover:border-cyan-300 hover:bg-cyan-900/40 shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all transform hover:-translate-y-0.5 focus:outline-none"
                  title="Replay Fuzail Ahmed's AI Robot Introduction"
                >
                  <Bot size={13} className="text-cyan-400 animate-pulse" />
                  <span>AI ROBOT INTRO</span>
                </button>

                <button
                  onClick={() => {
                    setMode('cinematic');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('replay-cinematic-intro'));
                    }, 400);
                  }}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-red-300 bg-red-950/30 border border-red-500/40 hover:border-red-400 hover:bg-red-900/40 shadow-[0_0_15px_rgba(239,68,68,0.25)] transition-all transform hover:-translate-y-0.5 focus:outline-none"
                  title="Switch to Spider-Man Cinematic Mode"
                >
                  <Film size={13} className="text-red-400" />
                  <span>SPIDER-MAN INTRO</span>
                </button>
              </>
            )}

            {/* Resume Button */}
            <button
              onClick={onOpenResume}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all transform hover:-translate-y-0.5 focus:outline-none"
            >
              <FileText size={13} />
              <span>RESUME</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-800 text-slate-200 hover:text-white bg-slate-900/70 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#030712]/95 backdrop-blur-2xl flex flex-col justify-between p-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-bold text-white text-sm">
                FA
              </div>
              <span className="font-heading font-bold text-white tracking-wide text-sm">FUZAIL AHMED</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-3 py-8">
            {navLinks.map((link) => {
              const isActive = activeSectionId === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left text-lg font-heading font-medium tracking-wide py-2.5 px-4 rounded-xl transition-all ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/10 border-l-4 border-cyan-400 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
            {/* Quick Play Voice Control in Mobile Menu */}
            <div className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30">
              <span className="text-xs font-mono text-cyan-300 font-semibold">AI VOICE INTRO</span>
              <AIVoicePlayer compact />
            </div>

            {/* Cinematic Spider-Man Intro Trigger */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (activeMode !== 'cinematic') {
                  setMode('cinematic');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('replay-cinematic-intro'));
                }, 300);
              }}
              className="w-full py-2.5 rounded-xl font-mono text-xs font-bold text-center text-red-300 border border-red-500/40 bg-red-950/30 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
            >
              <Film size={14} className="text-red-400" />
              <span>WATCH SPIDER-MAN CINEMATIC INTRO</span>
            </button>

            {/* AI Robot Introduction Trigger */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (activeMode !== 'professional') {
                  setMode('professional');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('replay-robot-intro'));
                }, 300);
              }}
              className="w-full py-2.5 rounded-xl font-mono text-xs font-bold text-center text-cyan-300 border border-cyan-400/40 bg-cyan-950/40 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            >
              <Bot size={14} className="text-cyan-400 animate-pulse" />
              <span>WATCH AI ROBOT ASSISTANT INTRO</span>
            </button>
            {onOpenExperienceMode && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenExperienceMode();
                }}
                className="w-full py-2.5 rounded-xl font-mono text-xs text-center text-cyan-300 border border-cyan-500/40 bg-cyan-950/30 flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-cyan-400" />
                <span>EXPERIENCE MODE: {activeMode ? activeMode.toUpperCase() : 'CINEMATIC'}</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="w-full py-3 rounded-xl font-heading font-semibold text-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg flex items-center justify-center gap-2"
            >
              <FileText size={16} />
              DOWNLOAD / VIEW RESUME
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEasterEgg();
              }}
              className="w-full py-2.5 rounded-xl font-mono text-xs text-center text-cyan-400 border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              SECRET DEVELOPER LAYER
            </button>
          </div>
        </div>
      )}
    </>
  );
};
