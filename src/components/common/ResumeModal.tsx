import React from 'react';
import { X, Download, Printer, MapPin, Briefcase, GraduationCap, Award, Phone, Mail, FolderGit2, Cpu } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow popups to view/print the resume.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fuzail Ahmed - Resume</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.45; color: #0f172a; max-width: 820px; margin: 20px auto; padding: 0 20px; font-size: 13px; }
          h1 { margin: 0 0 4px 0; color: #0f172a; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
          .subtitle { font-size: 15px; color: #0284c7; font-weight: 700; margin-bottom: 8px; }
          .contact { font-size: 12px; color: #475569; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1px solid #cbd5e1; }
          .contact a { color: #0284c7; text-decoration: none; }
          h2 { font-size: 15px; color: #0369a1; border-bottom: 1.5px solid #0284c7; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; }
          .item-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 13.5px; margin-top: 8px; color: #0f172a; }
          .item-date { color: #0284c7; font-weight: 600; font-size: 12px; }
          .item-sub { color: #475569; font-size: 12px; font-style: italic; margin-bottom: 4px; }
          ul { margin-top: 4px; margin-bottom: 8px; padding-left: 18px; }
          li { font-size: 12.5px; margin-bottom: 3px; color: #1e293b; }
          .tech-list { font-size: 12px; background: #f8fafc; padding: 10px 14px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 8px; }
          .tech-list p { margin: 3px 0; }
          .project-entry { margin-bottom: 8px; }
          .project-link { font-size: 11.5px; color: #0284c7; text-decoration: none; }
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; padding: 12px 18px; border-radius: 8px;">
          <span style="font-size: 13px; color: #334155; font-weight: 600;">Print-optimized view ready. Save as PDF or print.</span>
          <div style="display: flex; gap: 10px;">
            <a href="/Fuzail_Ahmed_Resume.pdf" download="Fuzail_Ahmed_Resume.pdf" style="padding: 8px 16px; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; text-decoration: none; font-size: 12px;">Download .PDF Directly</a>
            <button onclick="window.print()" style="padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px;">Print / Save via Browser</button>
          </div>
        </div>

        <h1>${PORTFOLIO_DATA.profile.name.toUpperCase()}</h1>
        <div class="subtitle">${PORTFOLIO_DATA.profile.title}</div>
        <div class="contact">
          ${PORTFOLIO_DATA.profile.location} | Phone: +91 9840843264 | Email: <a href="mailto:${PORTFOLIO_DATA.profile.email}">${PORTFOLIO_DATA.profile.email}</a> | LinkedIn: <a href="${PORTFOLIO_DATA.profile.linkedin}" target="_blank">linkedin.com/in/fuzail-ahmed27</a> | GitHub: <a href="${PORTFOLIO_DATA.profile.github}" target="_blank">github.com/FUZAIL27</a>
        </div>

        <h2>Professional Summary</h2>
        <p style="font-size: 12.5px; color: #1e293b; line-height: 1.5; margin: 4px 0;">${PORTFOLIO_DATA.profile.shortBio}</p>

        <h2>Work Experience</h2>
        ${PORTFOLIO_DATA.experience
          .map(
            (exp) => `
          <div class="item-header">
            <span>${exp.company} — ${exp.role}</span>
            <span class="item-date">${exp.period}</span>
          </div>
          <div class="item-sub">${exp.location} | ${exp.domains.join(' • ')}</div>
          <ul>
            ${exp.highlights.map((h) => `<li>${h}</li>`).join('')}
          </ul>
        `
          )
          .join('')}

        <h2>Technical Skills</h2>
        <div class="tech-list">
          <p><strong>Backend Development:</strong> Java, Spring Boot, Microservices, REST APIs, JDBC, Hibernate/JPA, Node.js, Express.js</p>
          <p><strong>Frontend Development:</strong> Angular, React, TypeScript, JavaScript (ES6+), PrimeNG, HTML5, CSS3, Tailwind CSS, Bootstrap</p>
          <p><strong>Databases & Storage:</strong> MySQL, PostgreSQL, MongoDB, Relational Schema Design, Indexing, ACID Transactions</p>
          <p><strong>Enterprise & DevOps:</strong> Git, GitHub, Docker, Postman, VS Code, Linux/Bash, ERP Business Workflow Implementation</p>
          <p><strong>AI & Intelligence:</strong> AI APIs (Claude, OpenAI, Gemini), Prompt Engineering, Generative AI Application Integration</p>
        </div>

        <h2>Key Projects</h2>
        ${PORTFOLIO_DATA.projects
          .map(
            (p) => `
          <div class="project-entry">
            <div class="item-header">
              <span>${p.title}</span>
              <span class="item-date">${p.category}</span>
            </div>
            <div class="item-sub">
              Tech Stack: ${p.tech.join(', ')}
              ${p.isPrivate ? ' | <em>Professional Enterprise ERP Experience (Company Confidential)</em>' : p.liveUrl ? ` | <a href="${p.liveUrl}" target="_blank" class="project-link">${p.liveUrl}</a>` : ''}
            </div>
            <p style="font-size: 12px; margin: 2px 0 6px 0; color: #334155;">${p.description}</p>
          </div>
        `
          )
          .join('')}

        <h2>Education</h2>
        ${PORTFOLIO_DATA.education
          .map(
            (edu) => `
          <div class="item-header">
            <span>${edu.degree}</span>
            <span class="item-date">${edu.period}</span>
          </div>
          <div class="item-sub">${edu.field} — ${edu.institution} (${edu.status})</div>
        `
          )
          .join('')}

        <h2>Key Certifications</h2>
        <ul>
          ${PORTFOLIO_DATA.certifications.map((c) => `<li><strong>${c.title}</strong> — ${c.issuer} (Verified)</li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-950 border border-cyan-500/30 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.3)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/60">
          <div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
              CURRICULUM VITAE
            </h2>
            <p className="text-xs font-mono text-cyan-400">
              FUZAIL AHMED • JAVA FULL STACK &amp; ENTERPRISE ERP DEVELOPER
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href="/Fuzail_Ahmed_Resume.pdf"
              download="Fuzail_Ahmed_Resume.pdf"
              className="btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
              title="Download compiled PDF file directly"
            >
              <Download size={14} />
              <span>DOWNLOAD PDF</span>
            </a>

            <button
              onClick={handleDownload}
              className="btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5 hidden sm:inline-flex"
              title="Open printable HTML preview"
            >
              <Printer size={14} />
              <span>PRINT / PREVIEW</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Close resume modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Resume Content View */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-8 text-sm text-slate-300">
          {/* Top Info Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/40 border border-white/5">
            <div className="space-y-1">
              <h3 className="font-heading font-black text-xl text-white">
                {PORTFOLIO_DATA.profile.name}
              </h3>
              <p className="text-xs text-cyan-300 font-semibold">
                {PORTFOLIO_DATA.profile.title}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-cyan-400" />
                  {PORTFOLIO_DATA.profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-emerald-400" />
                  +91 9840843264
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-violet-400" />
                  {PORTFOLIO_DATA.profile.email}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={PORTFOLIO_DATA.profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <LinkedinIcon size={13} />
                <span>LinkedIn</span>
              </a>
              <a
                href={PORTFOLIO_DATA.profile.github}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <GithubIcon size={13} />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
              Professional Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-900/30 border border-white/5">
              {PORTFOLIO_DATA.profile.shortBio}
            </p>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 flex items-center gap-2 font-bold">
              <Briefcase size={14} />
              Professional Experience
            </h4>

            <div className="space-y-4">
              {PORTFOLIO_DATA.experience.map((exp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h5 className="font-heading font-bold text-white text-base">
                        {exp.role} — <span className="text-violet-400">{exp.company}</span>
                      </h5>
                      <p className="text-xs text-slate-400">{exp.location}</p>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
                      {exp.period}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.domains.map((d, dIdx) => (
                      <span key={dIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                        {d}
                      </span>
                    ))}
                  </div>

                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 pt-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-white/5 text-xs font-mono text-slate-400 flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-500">Stack:</span>
                    {exp.technologies.map((t) => (
                      <span key={t} className="text-[11px] text-cyan-300 bg-slate-800/80 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills Grid */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 flex items-center gap-2 font-bold">
              <Cpu size={14} />
              Technical Proficiencies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
                <span className="font-bold text-white block text-xs">Backend:</span>
                <p className="text-slate-300">Java, Spring Boot, Microservices, REST APIs, JDBC, Hibernate/JPA, Node.js, Express.js</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
                <span className="font-bold text-white block text-xs">Frontend:</span>
                <p className="text-slate-300">Angular, React, TypeScript, JavaScript (ES6+), PrimeNG, HTML5, CSS3, Tailwind CSS, Bootstrap</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
                <span className="font-bold text-white block text-xs">Databases:</span>
                <p className="text-slate-300">MySQL, PostgreSQL, MongoDB, Schema Design, Indexing, ACID Transactions</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
                <span className="font-bold text-white block text-xs">Enterprise &amp; Tools:</span>
                <p className="text-slate-300">Git, GitHub, Docker, Postman, VS Code, Linux/Bash, ERP Workflows</p>
              </div>
            </div>
          </div>

          {/* Featured Projects Highlight */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 flex items-center gap-2 font-bold">
              <FolderGit2 size={14} />
              Enterprise &amp; Featured Projects
            </h4>
            <div className="space-y-2.5">
              {PORTFOLIO_DATA.projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl bg-slate-900/30 border border-white/5 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white text-xs sm:text-sm">{proj.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{proj.category}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                  <p className="text-[11px] font-mono text-slate-400 pt-1">
                    <span className="text-slate-500">Stack: </span>
                    {proj.tech.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 flex items-center gap-2 font-bold">
              <GraduationCap size={14} />
              Education
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PORTFOLIO_DATA.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/30 border border-white/5 space-y-1">
                  <span className="text-xs font-mono text-violet-400">{edu.period}</span>
                  <h5 className="font-bold text-white text-sm">{edu.degree}</h5>
                  <p className="text-xs text-slate-300">{edu.institution}</p>
                  <p className="text-[11px] text-slate-500">{edu.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications preview */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 flex items-center gap-2 font-bold">
              <Award size={14} />
              Key Certifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {PORTFOLIO_DATA.certifications.map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg bg-slate-900/40 border border-white/5 flex justify-between items-center">
                  <span className="text-slate-200">{c.title}</span>
                  <span className="font-mono text-[10px] text-cyan-400">{c.issuer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom direct download CTA */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-heading font-bold text-white text-sm block">
                Looking for the full PDF file?
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Updated with verified Tech Solution ERP experience &amp; verified project links.
              </span>
            </div>
            <a
              href="/Fuzail_Ahmed_Resume.pdf"
              download="Fuzail_Ahmed_Resume.pdf"
              className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Download size={14} />
              <span>DOWNLOAD RESUME PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
