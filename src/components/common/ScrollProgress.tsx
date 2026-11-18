import React from 'react';
import { SECTIONS, type SectionInfo } from '../../hooks/useScrollProgress';

interface ScrollProgressProps {
  progress: number;
  activeSection: SectionInfo;
  onNavigate: (id: string) => void;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ progress, activeSection, onNavigate }) => {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3 select-none pointer-events-auto">
      {/* Visual background indicator rail */}
      <div className="relative flex flex-col items-end gap-4 py-2">
        {SECTIONS.map((sec) => {
          const isActive = activeSection.id === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onNavigate(sec.id)}
              className="group flex items-center gap-3 text-right focus:outline-none transition-all duration-300"
              aria-label={`Jump to ${sec.label}`}
            >
              {/* Tooltip / Label */}
              <span
                className={`text-[11px] font-mono tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-cyan-400 font-bold opacity-100 translate-x-0'
                    : 'text-slate-500 opacity-40 group-hover:opacity-90 group-hover:text-slate-300 translate-x-1'
                }`}
              >
                {sec.number} {sec.label}
              </span>

              {/* Progress Pip / Bar */}
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-6 h-1.5 bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                    : 'w-2 h-1 bg-slate-700 group-hover:bg-slate-400 group-hover:w-3'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Percentage pill at the bottom */}
      <div className="mt-2 text-[10px] font-mono text-cyan-400/80 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
};
