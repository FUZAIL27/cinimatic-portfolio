import React from 'react';
import { FolderGit2, ExternalLink, ArrowUpRight, Eye } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { PORTFOLIO_DATA, type ProjectItem } from '../../data/portfolioData';
import profileImg from '../../assets/images/fuzail-profile.jpg';

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onSelectProject }) => {
  return (
    <section
      id="projects"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 z-10 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto pointer-events-auto space-y-16">
        {/* Section Header with Author Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <FolderGit2 size={13} />
              <span>05 // PRODUCTION BUILDS</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              FEATURED <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">PROJECT WORLDS.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              Each application is engineered with production-grade architecture, scalable state management, and real-world utility. Click any card to inspect full system architecture.
            </p>
          </div>

          {/* Project Section Profile Badge */}
          <div className="flex items-center gap-3 p-2.5 pr-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-cyan-400/30 shrink-0">
              <img
                src={profileImg}
                alt="Fuzail Ahmed standing in sharp tailored suit"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div>
              <span className="text-xs font-heading font-bold text-white block">
                Fuzail Ahmed
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Lead Engineer • Verified
              </span>
            </div>
          </div>
        </div>

        {/* 4 Floating Project Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PORTFOLIO_DATA.projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              data-cursor-text="EXPLORE"
              className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/70 via-slate-950/80 to-slate-900/60 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(6,182,212,0.2)] cursor-pointer flex flex-col justify-between"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-6">
                {/* Top Bar: Number + Category + Inspection Trigger */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-black text-2xl text-cyan-400/80 group-hover:text-cyan-300">
                      {proj.number}
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-white/5">
                      {proj.category}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-slate-800/80 group-hover:bg-cyan-500 text-slate-300 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md">
                    <ArrowUpRight size={18} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Project Title & Subtitle */}
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-white group-hover:text-cyan-300 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-violet-400">
                    {proj.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {proj.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800/60 text-slate-300 border border-white/5 group-hover:border-cyan-500/20 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10 text-xs font-mono">
                <span className="text-cyan-400 flex items-center gap-1.5 font-semibold">
                  <Eye size={14} />
                  <span>Click to view Architecture &amp; Details</span>
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {proj.isPrivate ? (
                    <span
                      className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-mono tracking-wide"
                      title="Professional Enterprise ERP Experience (Company Confidential)"
                    >
                      Enterprise ERP (Private)
                    </span>
                  ) : (
                    <>
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500 hover:text-white text-slate-300 transition-colors"
                          title="Live Demo"
                          aria-label={`Open ${proj.title} Live Demo`}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-violet-600 hover:text-white text-slate-300 transition-colors"
                          title="GitHub Repository"
                          aria-label={`Open ${proj.title} GitHub Repo`}
                        >
                          <GithubIcon size={16} />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
