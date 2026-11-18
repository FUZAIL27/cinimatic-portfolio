import React from 'react';
import { ArrowUp, Mail, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

interface FooterSectionProps {
  onScrollToTop: () => void;
  onOpenEasterEgg: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onScrollToTop, onOpenEasterEgg }) => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#02050c]/90 backdrop-blur-2xl py-16 px-4 sm:px-6 lg:px-8 pointer-events-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Cosmic Exit Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
          <div className="flex items-center gap-5 text-center md:text-left">
            {/* Glowing Monogram Orb */}
            <div
              onClick={onOpenEasterEgg}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-violet-600/30 border border-cyan-400/50 flex items-center justify-center font-heading font-black text-2xl text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer group hover:scale-105 transition-all"
              title="Click for hidden developer console"
            >
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                {PORTFOLIO_DATA.profile.initials}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide">
                {PORTFOLIO_DATA.profile.name.toUpperCase()}
              </h2>
              <p className="font-mono text-xs text-cyan-400 uppercase tracking-widest">
                {PORTFOLIO_DATA.profile.title} • CHENNAI, INDIA
              </p>
            </div>
          </div>

          {/* Social Links & Back to Top */}
          <div className="flex items-center gap-4">
            <a
              href={PORTFOLIO_DATA.profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/50 hover:bg-slate-850 transition-all shadow-md"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>

            <a
              href={PORTFOLIO_DATA.profile.github}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-violet-400/50 hover:bg-slate-850 transition-all shadow-md"
              aria-label="GitHub"
            >
              <GithubIcon size={18} />
            </a>

            <a
              href={`mailto:${PORTFOLIO_DATA.profile.email}`}
              className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-blue-400/50 hover:bg-slate-850 transition-all shadow-md"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>

            <button
              onClick={onScrollToTop}
              className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all focus:outline-none"
              title="Return to top"
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Easter Egg hint */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>
            © {new Date().getFullYear()} {PORTFOLIO_DATA.profile.name}. Designed &amp; Engineered with React, Three.js &amp; AI.
          </p>

          <button
            onClick={onOpenEasterEgg}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none"
          >
            <Terminal size={13} />
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 text-[10px]">F</kbd> for hidden terminal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
