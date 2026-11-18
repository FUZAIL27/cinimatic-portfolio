import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, CornerDownLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<Array<{ cmd: string; out: string | React.ReactNode }>>([
    {
      cmd: 'init',
      out: (
        <div>
          <p className="text-cyan-300 font-bold mb-1">Hey 👋 You found the hidden layer.</p>
          <p className="text-slate-400 text-xs">
            Welcome to Fuzail Ahmed's internal developer console. Type{' '}
            <span className="text-cyan-400 font-bold">help</span> to view available commands or press ESC to exit.
          </p>
        </div>
      ),
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#8b5cf6', '#3b82f6'],
        });
      } catch {}
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim().toLowerCase();
    if (!trimmed) return;

    let response: React.ReactNode = '';

    switch (trimmed) {
      case 'help':
        response = (
          <div className="space-y-1 text-xs">
            <p className="text-cyan-400 font-semibold">Available Commands:</p>
            <p><span className="text-violet-400">whoami</span> - Display developer profile and summary</p>
            <p><span className="text-violet-400">skills</span> - List all verified technical proficiencies</p>
            <p><span className="text-violet-400">projects</span> - Display production project links</p>
            <p><span className="text-violet-400">contact</span> - Show direct contact coordinates</p>
            <p><span className="text-violet-400">confetti</span> - Trigger celebratory particle burst</p>
            <p><span className="text-violet-400">clear</span> - Clear console history</p>
            <p><span className="text-violet-400">exit</span> - Close the hidden layer</p>
          </div>
        );
        break;

      case 'whoami':
        response = (
          <div className="text-xs space-y-1">
            <p className="text-white font-bold">{PORTFOLIO_DATA.profile.name} - {PORTFOLIO_DATA.profile.title}</p>
            <p className="text-slate-400">Experience: Tech Solution – Dammam Branch, Saudi Arabia (Sept 2025 – Present) • CodSoft (July 2024 – Aug 2024)</p>
            <p className="text-slate-400">Education: BCA (University of Madras, 2022-2025) • Online MCA (2025-2027)</p>
            <p className="text-cyan-400">Location: {PORTFOLIO_DATA.profile.location}</p>
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="text-xs space-y-1">
            <p className="text-cyan-400 font-bold">Primary Engineering Stack:</p>
            <p className="text-slate-300">Frontend: Angular, PrimeNG, React, TypeScript, JavaScript, Tailwind, Bootstrap, HTML5/CSS3</p>
            <p className="text-slate-300">Backend: Java, Spring Boot, Microservices, REST APIs, JDBC, Hibernate/JPA, Node.js</p>
            <p className="text-slate-300">Database &amp; Tools: MySQL, PostgreSQL, MongoDB, Docker, Git, GitHub, Postman</p>
            <p className="text-slate-300">AI: AI APIs (Claude, OpenAI, Gemini), Prompt Engineering, Generative AI</p>
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="text-xs space-y-1">
            {PORTFOLIO_DATA.projects.map((p) => (
              <p key={p.id}>
                <span className="text-cyan-400 font-bold">{p.number} {p.title}:</span>{' '}
                {p.isPrivate ? (
                  <span className="text-amber-400 font-mono">Enterprise ERP (Private / Confidential)</span>
                ) : (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-cyan-300">
                    {p.liveUrl}
                  </a>
                )}
              </p>
            ))}
          </div>
        );
        break;

      case 'contact':
        response = (
          <div className="text-xs space-y-1">
            <p className="text-slate-300">Email: <span className="text-cyan-400">{PORTFOLIO_DATA.profile.email}</span></p>
            <p className="text-slate-300">LinkedIn: <a href={PORTFOLIO_DATA.profile.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 underline">{PORTFOLIO_DATA.profile.linkedin}</a></p>
            <p className="text-slate-300">GitHub: <a href={PORTFOLIO_DATA.profile.github} target="_blank" rel="noreferrer" className="text-blue-400 underline">{PORTFOLIO_DATA.profile.github}</a></p>
          </div>
        );
        break;

      case 'confetti':
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch {}
        response = <p className="text-emerald-400 text-xs">✨ Confetti dispatched into 3D viewport!</p>;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        response = (
          <p className="text-rose-400 text-xs">
            command not found: '{trimmed}'. Type <span className="text-cyan-400 font-bold">help</span> for recognized commands.
          </p>
        );
    }

    setHistory((prev) => [...prev, { cmd: inputVal, out: response }]);
    setInputVal('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col font-mono text-sm max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-2 ml-3 text-xs text-slate-400">
              <TerminalIcon size={14} className="text-cyan-400" />
              <span>fuzail@terminal: ~ (hidden layer)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button onClick={onClose} className="p-1 hover:text-white rounded focus:outline-none">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Output Stream */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-slate-200">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.cmd !== 'init' && (
                <div className="flex items-center gap-2 text-cyan-400 text-xs">
                  <span>❯</span>
                  <span className="text-white font-semibold">{item.cmd}</span>
                </div>
              )}
              <div className="pl-4 text-slate-300">{item.out}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 border-t border-slate-800">
          <span className="text-cyan-400 text-sm">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help', 'whoami', 'skills', 'projects'..."
            className="flex-1 bg-transparent text-white focus:outline-none text-xs sm:text-sm placeholder:text-slate-600"
            autoFocus
          />
          <button type="submit" className="p-1 text-cyan-400 hover:text-cyan-300 focus:outline-none">
            <CornerDownLeft size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
