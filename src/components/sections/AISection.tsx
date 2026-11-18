import React, { useState, useEffect } from 'react';
import { Cpu, Terminal, Sparkles, User, Database, Layers, Zap, Copy, Check } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const AISection: React.FC = () => {
  const [typedCode, setTypedCode] = useState('');
  const [activePipelineIdx, setActivePipelineIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const fullCode = PORTFOLIO_DATA.profile.codeSnippet;

  // Animated typing effect for simulated code editor
  useEffect(() => {
    let currentIdx = 0;
    const timer = setInterval(() => {
      setTypedCode(fullCode.slice(0, currentIdx));
      currentIdx++;
      if (currentIdx > fullCode.length) {
        clearInterval(timer);
      }
    }, 28);
    return () => clearInterval(timer);
  }, [fullCode]);

  // Pulse through the AI pipeline nodes
  useEffect(() => {
    const pipelineTimer = setInterval(() => {
      setActivePipelineIdx((prev) => (prev + 1) % PORTFOLIO_DATA.aiPipeline.nodes.length);
    }, 2200);
    return () => clearInterval(pipelineTimer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPipelineIcon = (iconName: string) => {
    switch (iconName) {
      case 'User': return <User size={18} />;
      case 'Terminal': return <Terminal size={18} />;
      case 'Cpu': return <Cpu size={18} />;
      case 'Database': return <Database size={18} />;
      case 'Layers': return <Layers size={18} />;
      case 'Zap': return <Zap size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  return (
    <section
      id="ai"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 z-10 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto pointer-events-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-fuchsia-500/30 text-xs font-mono text-fuchsia-300">
            <Sparkles size={13} />
            <span>06 // INTELLIGENCE ARCHITECTURE</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            BUILDING <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">WITH AI.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Bridging foundational LLMs, structured prompts, vector context, and enterprise full-stack runtimes into production products.
          </p>
        </div>

        {/* AI Intelligence Pipeline Visual: USER -> PROMPT -> AI -> DATA -> APPLICATION -> RESULT */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-fuchsia-950/20 border border-fuchsia-500/25 backdrop-blur-xl shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-fuchsia-400 uppercase">
                {PORTFOLIO_DATA.aiPipeline.title}
              </span>
              <h3 className="font-heading font-bold text-xl text-white mt-1">
                {PORTFOLIO_DATA.aiPipeline.subtitle}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Pipeline Stream Active</span>
            </div>
          </div>

          {/* Node Flow Chain */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PORTFOLIO_DATA.aiPipeline.nodes.map((node, idx) => {
              const isActive = activePipelineIdx === idx;
              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col justify-between min-h-[140px] relative ${
                    isActive
                      ? 'bg-gradient-to-b from-fuchsia-950/70 to-slate-900 border-fuchsia-400 shadow-[0_0_25px_rgba(236,72,153,0.35)] scale-105'
                      : 'bg-slate-900/40 border-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        isActive ? 'text-fuchsia-300 bg-fuchsia-500/20' : 'text-slate-400 bg-slate-800/40'
                      }`}
                    >
                      {getPipelineIcon(node.icon)}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-sm text-white tracking-wide">
                      {node.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-1">
                      {node.desc}
                    </p>
                  </div>

                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-fuchsia-400 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column: Simulated Animated Code Editor & Terminal Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Simulated Code Editor */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-950 border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-3">
                  fuzail-developer.ts
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy Code"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Code Body with Syntax Coloring */}
            <div className="p-6 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto flex-1">
              <pre className="text-cyan-300 font-mono leading-relaxed whitespace-pre-wrap">
                {typedCode}
                <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
              </pre>
            </div>
          </div>

          {/* Terminal-Style Simulated Execution Panel */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-950/90 border border-violet-500/30 overflow-hidden shadow-2xl flex flex-col justify-between p-6 font-mono text-xs space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-slate-400">
                <Terminal size={14} className="text-violet-400" />
                <span className="font-semibold text-white">dev-environment ~ bash</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <p className="text-slate-400">
                  <span className="text-cyan-400">➜</span> <span className="text-violet-400">repo</span> <span className="text-white">$ git status</span>
                </p>
                <p className="text-emerald-400 pl-4">
                  On branch main • Your branch is up to date with 'origin/main'.
                </p>

                <p className="text-slate-400 pt-2">
                  <span className="text-cyan-400">➜</span> <span className="text-violet-400">repo</span> <span className="text-white">$ npm run build</span>
                </p>
                <p className="text-slate-400 pl-4">
                  vite v8.3.5 building for production...<br />
                  <span className="text-emerald-400">✓ 156 modules transformed.</span><br />
                  dist/index.html &amp; assets compiled (0 errors)
                </p>

                <p className="text-slate-400 pt-2">
                  <span className="text-cyan-400">➜</span> <span className="text-violet-400">repo</span> <span className="text-white">$ git push origin main</span>
                </p>
                <p className="text-cyan-400 pl-4">
                  Everything up-to-date. Deployed to Vercel production edge.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider block">
                INTELLIGENT AI PRODUCTS
              </span>
              <p className="text-xs text-slate-300">
                AI Presentation Generator &amp; Doc-AI active on live URLs with generative inference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
