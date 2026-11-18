import React from 'react';
import { User, Globe, Code, Brain, Database } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { PersonalPhotoCube } from './PersonalPhotoCube';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 z-10 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto pointer-events-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-violet-500/30 text-xs font-mono text-violet-300">
            <User size={13} />
            <span>02 // PHILOSOPHY &amp; IDENTITY</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            ENGINEERING IDEAS <br />
            INTO <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent">DIGITAL EXPERIENCES.</span>
          </h2>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Premium 3D Rotating Photo Cube Experience */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <PersonalPhotoCube />
          </div>

          {/* Right Column: Bio, Capabilities, Languages & Stats */}
          <div className="lg:col-span-7 space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                {PORTFOLIO_DATA.profile.shortBio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                    <Code size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">Java Full Stack Architecture</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Spring Boot microservices, Angular, React &amp; REST APIs</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 shrink-0 mt-0.5">
                    <Brain size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">Enterprise ERP Solutions</h4>
                    <p className="text-xs text-slate-400 mt-0.5">SCM, BOM, Work Orders, HRM, CRM &amp; CMS workflows</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                    <Database size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">Enterprise Data Stores</h4>
                    <p className="text-xs text-slate-400 mt-0.5">MySQL &amp; PostgreSQL with ACID transactional integrity</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0 mt-0.5">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">Spoken Languages</h4>
                    <p className="text-xs text-slate-400 mt-0.5">English, Tamil, Urdu, Hindi (Fluent communication)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PORTFOLIO_DATA.profile.stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/70 border border-white/5 backdrop-blur-md text-center hover:border-cyan-400/30 transition-all duration-300"
                >
                  <span className="font-heading font-black text-3xl sm:text-4xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent block">
                    {stat.value}
                  </span>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
