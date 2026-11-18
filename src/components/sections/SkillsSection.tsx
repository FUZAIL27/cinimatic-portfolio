import React, { useState } from 'react';
import { Cpu, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA, type SkillItem } from '../../data/portfolioData';

export const SkillsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'AI'];

  const filteredSkills =
    selectedCategory === 'All'
      ? PORTFOLIO_DATA.skills
      : PORTFOLIO_DATA.skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section
      id="skills"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 z-10 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto pointer-events-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Cpu size={13} />
              <span>03 // 3D TECHNOLOGY UNIVERSE</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              THE <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">ENGINEERING STACK.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl">
              Orbiting around an enterprise core: Java, Spring Boot microservices, Angular, PrimeNG, React, and relational MySQL data stores.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium tracking-wide transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Central Ecosystem Orbit Highlights Banner */}
        <div className="relative rounded-3xl p-6 bg-gradient-to-r from-cyan-950/30 via-slate-950/60 to-violet-950/30 border border-cyan-500/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex flex-col items-center justify-center text-cyan-300 font-heading font-black text-xs text-center p-1 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span>FULL</span>
              <span>STACK</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                ORBITAL NUCLEUS
              </span>
              <h3 className="font-heading font-bold text-lg text-white">
                Java Full Stack &amp; Enterprise ERP
              </h3>
              <p className="text-xs text-slate-400">
                Java Spring Boot • Angular • PrimeNG • React • MySQL • Docker
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Interactive 3D Galaxy Running in Background</span>
          </div>
        </div>

        {/* Technology Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              onClick={() => setActiveSkill(skill)}
              className="group p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 border border-white/5 hover:border-cyan-400/40 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg cursor-pointer relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: skill.color }}
              />

              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </span>
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border"
                  style={{
                    color: skill.color,
                    borderColor: `${skill.color}40`,
                    backgroundColor: `${skill.color}15`,
                  }}
                >
                  {skill.category}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed min-h-[38px]">
                {skill.description}
              </p>

              {/* Competency Level Bar */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Mastery</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:scale-x-105"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color,
                        boxShadow: `0 0 10px ${skill.color}`,
                      }}
                    />
                  </div>
                  <span className="text-slate-300 font-semibold">{skill.level}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Skill Quick Detail Modal */}
        {activeSkill && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setActiveSkill(null)}
          >
            <div
              className="w-full max-w-md bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: activeSkill.color, boxShadow: `0 0 10px ${activeSkill.color}` }}
                  />
                  <h4 className="font-heading font-bold text-white text-lg">{activeSkill.name}</h4>
                </div>
                <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                  {activeSkill.category}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeSkill.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Technical Proficiency:</span>
                  <span className="text-cyan-300 font-bold">{activeSkill.level}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${activeSkill.level}%`, backgroundColor: activeSkill.color }}
                  />
                </div>
              </div>

              <button
                onClick={() => setActiveSkill(null)}
                className="w-full py-2.5 rounded-xl font-mono text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-white/10 transition-colors"
              >
                CLOSE INSPECTION
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
