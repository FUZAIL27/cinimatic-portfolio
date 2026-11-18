import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const ExperienceSection: React.FC = () => {

  return (
    <section
      id="experience"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 z-10 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto pointer-events-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Briefcase size={13} />
            <span>04 // CAREER TRAJECTORY</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            ENTERPRISE <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">EXPERIENCE.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Engineering scalable business workflows, mission-critical ERP modules, and high-throughput microservices.
          </p>
        </div>

        {/* 3D-Style Glowing Vertical Timeline Container */}
        <div className="relative pl-6 sm:pl-10 border-l-2 border-cyan-500/30 space-y-12">
          {PORTFOLIO_DATA.experience.map((exp, expIdx) => (
            <div key={expIdx} className="relative space-y-8">
              {/* Milestone Point Glowing Orb */}
              <div
                className={`absolute -left-[31px] sm:-left-[47px] top-6 w-8 h-8 rounded-full bg-slate-950 border-2 ${
                  expIdx === 0
                    ? 'border-cyan-400 shadow-[0_0_20px_#06b6d4]'
                    : 'border-violet-400 shadow-[0_0_20px_#8b5cf6]'
                } flex items-center justify-center`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    expIdx === 0 ? 'bg-cyan-400 animate-ping' : 'bg-violet-400'
                  }`}
                />
              </div>

              {/* Main Experience Card */}
              <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-slate-900/70 border border-cyan-500/30 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(6,182,212,0.2)] space-y-8">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-1">
                      {expIdx === 0 ? 'CURRENT ROLE // PRODUCTION WORK' : 'INTERNSHIP // VERIFIED FOUNDATION'}
                    </span>
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
                      {exp.role}
                    </h3>
                    <h4 className="text-lg text-violet-400 font-medium">
                      {exp.company}
                    </h4>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 text-xs font-mono text-slate-400">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                      <Calendar size={13} />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-violet-400" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Enterprise Domain Pills */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Layers size={14} className="text-cyan-400" />
                    {expIdx === 0 ? 'Enterprise ERP Modules & Domains' : 'Core Domains & Specializations'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {exp.domains.map((domain) => (
                      <span
                        key={domain}
                        className="px-3.5 py-1 rounded-xl text-xs font-mono font-medium bg-slate-800/80 text-cyan-200 border border-white/5"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Core Responsibilities & Engineering Highlights */}
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    Verified Engineering Highlights &amp; Impact
                  </span>
                  <div className="space-y-3">
                    {exp.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex items-start gap-3 hover:border-cyan-500/30 transition-colors"
                      >
                        <ChevronRight size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-200 leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies Applied */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 mr-2">Applied Stack:</span>
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 bg-slate-800/60 border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
