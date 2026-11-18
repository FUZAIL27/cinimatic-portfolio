import React, { useState } from 'react';
import { Send, Mail, CheckCircle2, MessageSquare, AlertCircle, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import confetti from 'canvas-confetti';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import profileImg from '../../assets/images/fuzail-profile.jpg';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#06b6d4', '#8b5cf6', '#3b82f6'],
        });
      } catch {}

      const mailtoUrl = `mailto:${PORTFOLIO_DATA.profile.email}?subject=${encodeURIComponent(
        formData.subject || `Portfolio Inquiry from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;

      window.open(mailtoUrl, '_blank');

      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 z-10 pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto pointer-events-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <MessageSquare size={13} />
            <span>08 // INITIATE DIALOGUE</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-6xl text-white tracking-tight leading-tight">
            LET'S BUILD <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">SOMETHING MEANINGFUL.</span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="font-heading font-bold text-lg text-white">
              FUZAIL AHMED
            </span>
            <span className="text-xs font-mono text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
              FULL STACK DEVELOPER
            </span>
          </div>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl">
            Let's turn ideas into scalable digital experiences. Open for high-impact full-stack development, enterprise consulting, and AI integrations.
          </p>
        </div>

        {/* 2-Column Contact Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Coordinates & Social Connect */}
          <div className="lg:col-span-5 space-y-6">
            {/* Real Personal Portrait Card */}
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-xl shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-md shrink-0">
                <img
                  src={profileImg}
                  alt="Fuzail Ahmed - Full Stack Developer"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-white text-base">
                  Fuzail Ahmed
                </h4>
                <p className="text-xs font-mono text-cyan-400">
                  Full Stack Developer • Chennai, India
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Tech Solution • MERN &amp; Java Full Stack
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
              <h3 className="font-heading font-bold text-xl text-white">
                Direct Coordinates
              </h3>

              {/* Email Card with Copy Button */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      ELECTRONIC MAIL
                    </span>
                    <a
                      href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                      className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                    >
                      {PORTFOLIO_DATA.profile.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>

              {/* LinkedIn Button */}
              <a
                href={PORTFOLIO_DATA.profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/20 hover:border-blue-400/50 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                    <LinkedinIcon size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      PROFESSIONAL NETWORK
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                      linkedin.com/in/fuzail-ahmed27
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400">CONNECT ↗</span>
              </a>

              {/* GitHub Button */}
              <a
                href={PORTFOLIO_DATA.profile.github}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-950/80 border border-violet-500/20 hover:border-violet-400/50 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                    <GithubIcon size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      SOURCE CODE &amp; REPOSITORIES
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                      github.com/FUZAIL27
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-violet-400">EXPLORE ↗</span>
              </a>
            </div>

            {/* Quick Status Note */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-slate-900/40 border border-white/5 backdrop-blur-md">
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Immediate Availability</span>
              </span>
              <p className="text-xs text-slate-300">
                Responses typically delivered within 24 hours. Based in Chennai, India (UTC +5:30).
              </p>
            </div>
          </div>

          {/* Right Column: Floating Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-8 sm:p-10 rounded-3xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl space-y-6"
            >
              <h3 className="font-heading font-black text-2xl text-white">
                Transmit a Message
              </h3>

              {submitStatus === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>Message prepared! Your local email client will open to send, or copy my email directly.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3">
                  <AlertCircle size={18} className="text-rose-400 shrink-0" />
                  <span>Please fill in your name, email address, and message.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Subject / Project Topic</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Enterprise Full Stack Project / Opportunity"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your vision, requirements, or inquiry..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} />
                <span>{isSubmitting ? 'DISPATCHING...' : 'DISPATCH MESSAGE'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
