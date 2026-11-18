import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Bot, Volume2 } from 'lucide-react';
import { fuzailVoiceManager } from '../../utils/fuzailVoiceManager';

interface RobotWelcomeHeroProps {
  className?: string;
}

export const RobotWelcomeHero: React.FC<RobotWelcomeHeroProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHoloText, setShowHoloText] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sync with 3D Robot animation events from StructureEnvironment
  useEffect(() => {
    const handleWaveStart = () => {
      setIsWaving(true);
      setShowHoloText(true);
    };

    const handleWaveEnd = () => {
      setIsWaving(false);
      // Keep badge visible for 4.5 seconds after wave finishes, then fade gracefully
      const timer = setTimeout(() => {
        setShowHoloText(false);
      }, 4500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('fuzail_robot_wave_started', handleWaveStart);
    window.addEventListener('fuzail_robot_wave_ended', handleWaveEnd);

    // Initial show if robot is already in wave phase
    const initialTimer = setTimeout(() => {
      setShowHoloText(true);
    }, 3800);

    return () => {
      window.removeEventListener('fuzail_robot_wave_started', handleWaveStart);
      window.removeEventListener('fuzail_robot_wave_ended', handleWaveEnd);
      clearTimeout(initialTimer);
    };
  }, []);

  const handleTriggerInteraction = useCallback(() => {
    // Trigger 3D robot wave gesture in WebGL environment
    window.dispatchEvent(new CustomEvent('fuzail_robot_trigger_wave'));
    // Play Fuzail's natural AI voice intro greeting
    fuzailVoiceManager.playAIVoiceIntro();
    setShowHoloText(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[480px] select-none ${className}`}
      style={{
        contain: 'layout paint',
        isolation: 'isolate',
      }}
    >
      {/* ========================================================
       * FLOATING CYAN NEON HOLOGRAPHIC WELCOME SIGN
       * Exact styling from reference images:
       * - Bright electric cyan double neon frame
       * - Angled futuristic corner brackets
       * - "HEY! WELCOME" in bold glowing neon typography
       * - "I'm Fuzail Ahmed" subtitle
       * ======================================================== */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-4 z-30 transition-all duration-700 pointer-events-auto cursor-pointer ${
          showHoloText ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
        onClick={handleTriggerInteraction}
        title="Click to replay welcome greeting"
      >
        <div className="relative px-5 py-3 rounded-2xl bg-black/85 border-2 border-[#00e5ff] backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.65)] hover:shadow-[0_0_50px_rgba(0,229,255,0.9)] transition-all">
          {/* Angled Sci-Fi White Corner Brackets */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white rounded-tl" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white rounded-tr" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white rounded-bl" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white rounded-br" />

          {/* Top Status Header */}
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-[#00e5ff]/20">
            <div className="flex items-center gap-1.5">
              <Bot size={12} className="text-[#00e5ff] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e5ff] uppercase">
                AI ASSISTANT
              </span>
            </div>
            <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ONLINE
            </span>
          </div>

          {/* Main Display Headline & Subtitle */}
          <div className="text-center sm:text-left py-1.5">
            <h2 className="font-heading font-black text-base sm:text-lg text-white tracking-wider drop-shadow-[0_0_15px_rgba(0,229,255,1)] leading-tight">
              HEY! WELCOME
            </h2>
            <p className="text-xs font-mono font-semibold text-cyan-200 tracking-tight mt-0.5">
              I'm Fuzail Ahmed
            </p>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="flex items-center justify-between text-[9px] font-mono text-white/70 pt-1 border-t border-white/10 mt-0.5">
            <span className="text-[#ff8a1f] font-semibold">NATURAL AI VOICE</span>
            <span className="text-[#00e5ff] flex items-center gap-1 hover:text-white transition-colors">
              <Volume2 size={10} />
              CLICK TO LISTEN
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
       * TRANSPARENT 3D ROBOT INTERACTIVE VIEWPORT
       * Overlays the 3D full-body robot standing on its glowing cyber stage.
       * Zero 2D images blocking the scene!
       * ======================================================== */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleTriggerInteraction}
        className="relative w-full aspect-[4/5] min-h-[460px] flex items-center justify-center cursor-pointer pointer-events-auto rounded-3xl transition-all duration-300"
        title="Click to interact with 3D AI Robot"
      >
        {/* Subtle Cybernetic Target Reticles on Hover */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-3xl ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 border border-[#00e5ff]/25 rounded-3xl shadow-[inset_0_0_30px_rgba(0,229,255,0.06)]" />
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00e5ff] rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00e5ff] rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00e5ff] rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00e5ff] rounded-br-lg" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-950/85 border border-[#00e5ff]/40 backdrop-blur-md shadow-lg text-[10px] font-mono text-cyan-300 tracking-wider uppercase font-semibold flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>CLICK TO REPLAY GREETING</span>
          </div>
        </div>

        {/* Dynamic status pill during active waving */}
        {isWaving && (
          <div className="absolute -bottom-2 right-4 pointer-events-none px-3 py-1 rounded-full bg-emerald-950/85 border border-emerald-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(52,211,153,0.3)] text-[10px] font-mono text-emerald-300 tracking-wider uppercase font-semibold flex items-center gap-1.5 animate-bounce">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>GREETING ACTIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};
