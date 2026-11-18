import React from 'react';
import { GraduationCap, Award, BookOpen, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const EducationCertSection: React.FC = () => {
  const generateContributionDays = () => {
    const days = [];
    const intensityLevels = [
      'bg-slate-900 border-white/5',
      'bg-emerald-950/60 border-emerald-800/30',
      'bg-emerald-800/70 border-emerald-600/40',
      'bg-emerald-600/80 border-emerald-400/50',
      'bg-emerald-400 border-emerald-300',
    ];

    for (let i = 0; i < 112; i++) {
      const pseudoRand = (i * 37 + 13) % 100;
      let level = 0;
      if (pseudoRand > 75) level = 4;
      else if (pseudoRand > 50) level = 3;
      else if (pseudoRand > 30) level = 2;
      else if (pseudoRand > 15) level = 1;
      days.push({ id: i, levelClass: intensityLevels[level] });
    }
    return days;
  };

  const contributionDays = generateContributionDays();

  return (
    <section
      id="education"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 z-10 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto pointer-events-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-blue-500/30 text-xs font-mono text-blue-300">
            <GraduationCap size={13} />
            <span>07 // ACADEMICS &amp; CERTIFICATIONS</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            CONTINUOUS <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">LEARNING ENGINE.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Formal computer application degrees paired with specialized certifications in Prompt Engineering, Cloud Security, and Enterprise Data Analytics.
          </p>
        </div>

        {/* Education Degree Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTFOLIO_DATA.education.map((edu, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-900/60 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl shadow-xl space-y-4 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-cyan-300 font-semibold uppercase">
                      {edu.status}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-white">
                      {edu.degree}
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-xs font-mono text-slate-300">
                  <Calendar size={12} />
                  <span>{edu.period}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-violet-400">
                  {edu.field}
                </p>
                <p className="text-xs text-slate-400">
                  {edu.institution}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {edu.description}
              </p>
            </div>
          ))}
        </div>

        {/* 3D Certificate Wall */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Award size={14} />
                Verified Professional Certifications
              </span>
              <h3 className="font-heading font-black text-2xl text-white mt-1">
                Accredited Credentials Wall
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              8 Verified Milestones
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 perspective-1000">
            {PORTFOLIO_DATA.certifications.map((cert) => (
              <div
                key={cert.id}
                className="group p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-white/10 hover:border-cyan-400/50 backdrop-blur-md shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 flex flex-col justify-between min-h-[140px]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase"
                      style={{
                        borderColor: `${cert.badgeColor}50`,
                        color: cert.badgeColor,
                        backgroundColor: `${cert.badgeColor}15`,
                      }}
                    >
                      {cert.category}
                    </span>
                    <ShieldCheck size={16} className="text-cyan-400" />
                  </div>

                  <h4 className="font-heading font-bold text-sm text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {cert.title}
                  </h4>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{cert.issuer}</span>
                  <span className="text-emerald-400 font-bold">Verified ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Style Contribution Grid Visualization */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white">
                <GithubIcon size={20} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-base">
                  Repository &amp; Engineering Activity
                </h4>
                <p className="text-xs text-slate-400">
                  Active contributions across full-stack repositories &amp; open-source projects
                </p>
              </div>
            </div>

            <a
              href={PORTFOLIO_DATA.profile.github}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-2"
            >
              <GithubIcon size={14} />
              <span>VISIT GITHUB PROFILE</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Visual Grid Cells */}
          <div className="pt-2 overflow-x-auto pb-2">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[600px]">
              {contributionDays.map((d) => (
                <div
                  key={d.id}
                  className={`w-3.5 h-3.5 rounded-sm border ${d.levelClass} transition-colors hover:border-cyan-400`}
                  title="Active development commit"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-white/5">
            <span>Continuously coding &amp; building modern web systems</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-white/5 inline-block" />
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950/60 inline-block" />
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800/70 inline-block" />
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
