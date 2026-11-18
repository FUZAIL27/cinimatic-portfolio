import React from 'react';
import { X, ExternalLink, CheckCircle2, Cpu, Layers, Target, Sparkles, ShieldCheck } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import type { ProjectItem } from '../../data/portfolioData';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712] border border-cyan-500/30 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.25)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-violet-500 to-blue-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-all focus:outline-none"
          aria-label="Close project modal"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto space-y-8">
          {/* Project Title & Category */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-cyan-400 font-bold text-sm tracking-wider px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                PROJECT {project.number}
              </span>
              <span className="text-xs font-mono tracking-widest text-violet-400 uppercase">
                {project.category}
              </span>
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
              {project.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-medium">
              {project.subtitle}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {project.isPrivate ? (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-mono flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-amber-400 shrink-0" />
                <span>Professional Enterprise ERP Experience • Internal Private System (Company Confidential)</span>
              </div>
            ) : (
              <>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    <span>EXPLORE LIVE PRODUCTION</span>
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <GithubIcon size={16} />
                    <span>SOURCE REPOSITORY</span>
                  </a>
                )}
              </>
            )}
          </div>

          {/* Technology Badges */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <Cpu size={14} className="text-cyan-400" />
              Technology Architecture
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-cyan-300 border border-slate-700/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-rose-500/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-heading font-bold text-base">
                <Target size={18} />
                <span>The Challenge / Problem</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.details.problem}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-base">
                <Sparkles size={18} />
                <span>Engineered Solution</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.details.solution}
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-cyan-400" />
              Key Capabilities &amp; Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.details.features.map((feat, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-200">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise ERP Modules Breakdown */}
          {project.modules && project.modules.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Layers size={14} />
                Enterprise ERP Modules &amp; Workflow Responsibilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 space-y-2 hover:border-cyan-500/40 transition-colors"
                  >
                    <h4 className="font-heading font-bold text-white text-sm text-cyan-300">
                      {mod.title}
                    </h4>
                    <ul className="space-y-1">
                      {mod.items.map((item, iIdx) => (
                        <li key={iIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture & Contribution */}
          <div className="space-y-6 pt-2">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
              <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                <Layers size={16} className="text-cyan-400" />
                System Architecture
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.details.architecture}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-violet-500/20 space-y-2">
              <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-violet-400" />
                Personal Contribution
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.details.contribution}
              </p>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
            >
              ← RETURN TO PROJECT GALLERY
            </button>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              ESC to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
