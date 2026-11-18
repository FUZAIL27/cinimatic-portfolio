import React from 'react';
import { ArrowUp, Mail, Sparkles, Send, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

interface ThankYouSectionProps {
  onScrollToTop: () => void;
}

export const ThankYouSection: React.FC<ThankYouSectionProps> = ({ onScrollToTop }) => {
  return (
    <section
      id="thank-you"
      className="relative min-h-[90vh] flex flex-col justify-center items-center py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden z-10 pointer-events-auto"
    >
      {/* Cinematic Ambient Glow & Spotlights */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/70 to-[#02050c]/95 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-violet-600/10 to-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto space-y-8 z-10">
        {/* Mission Completed Telemetry Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/85 border border-cyan-400/40 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
            SPIDER-MAN ALLIANCE // MISSION COMPLETE
          </span>
          <Sparkles size={13} className="text-violet-400" />
        </div>

        {/* 1. EXACT REQUIRED HEADLINE */}
        <div className="space-y-4">
          <h2 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tighter text-white uppercase leading-none">
            THANK YOU FOR YOUR{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              TIME
            </span>
          </h2>

          {/* 2. EXACT REQUIRED PARAGRAPHS */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <p className="font-heading font-semibold text-lg sm:text-2xl text-slate-100 tracking-tight leading-relaxed">
              I appreciate you taking the time to explore my portfolio.
            </p>
            <p className="font-sans text-sm sm:text-lg text-cyan-300 font-medium tracking-wide">
              Let's connect and build something amazing together.
            </p>
          </div>
        </div>

        {/* Professional Identity Card */}
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/30 border border-cyan-400/50 flex items-center justify-center font-heading font-black text-white text-base shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              {PORTFOLIO_DATA.profile.initials}
            </span>
          </div>

          <div className="text-left">
            <h3 className="font-heading font-black text-white text-base tracking-wide leading-tight">
              {PORTFOLIO_DATA.profile.name.toUpperCase()}
            </h3>
            <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest leading-normal">
              {PORTFOLIO_DATA.profile.title} • TECH SOLUTION
            </p>
          </div>
        </div>

        {/* Social & Contact Direct Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={PORTFOLIO_DATA.profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-slate-200 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/40 text-xs sm:text-sm font-mono font-semibold transition-all shadow-md group"
          >
            <LinkedinIcon size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>LINKEDIN</span>
            <ExternalLink size={12} className="text-slate-500 group-hover:text-cyan-300" />
          </a>

          <a
            href={PORTFOLIO_DATA.profile.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-violet-500/30 text-slate-200 hover:text-white hover:border-violet-400 hover:bg-violet-950/40 text-xs sm:text-sm font-mono font-semibold transition-all shadow-md group"
          >
            <GithubIcon size={16} className="text-violet-400 group-hover:scale-110 transition-transform" />
            <span>GITHUB</span>
            <ExternalLink size={12} className="text-slate-500 group-hover:text-violet-300" />
          </a>

          <a
            href={`mailto:${PORTFOLIO_DATA.profile.email}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-blue-500/30 text-slate-200 hover:text-white hover:border-blue-400 hover:bg-blue-950/40 text-xs sm:text-sm font-mono font-semibold transition-all shadow-md group"
          >
            <Mail size={16} className="text-sky-400 group-hover:scale-110 transition-transform" />
            <span>EMAIL ME</span>
            <Send size={12} className="text-slate-500 group-hover:text-sky-300" />
          </a>
        </div>

        {/* 3. PROMINENT "BACK TO TOP" CTA BUTTON */}
        <div className="pt-4">
          <button
            onClick={onScrollToTop}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-heading font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
            aria-label="Back to Top"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>BACK TO TOP</span>
            <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
