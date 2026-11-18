import React, { useState, useEffect } from 'react';
import { FastForward, Volume2, VolumeX, RotateCcw, Bot, Play, Pause, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { robotAudio, type RobotDialogueItem } from '../../utils/robotAudio';
import { fuzailVoiceManager, type PlaybackState } from '../../utils/fuzailVoiceManager';

interface RobotIntroOverlayProps {
  currentSegment: RobotDialogueItem | null;
  currentIndex: number;
  totalSegments: number;
  isActive: boolean;
  isWakingUp: boolean;
  onSkip: () => void;
  onReplay: () => void;
  onStartExperience: () => void;
  hasStartedExperience: boolean;
  onEnterPortfolio?: () => void;
}

export const RobotIntroOverlay: React.FC<RobotIntroOverlayProps> = ({
  currentSegment,
  currentIndex,
  totalSegments,
  isActive,
  isWakingUp,
  onSkip,
  onReplay,
  onStartExperience,
  hasStartedExperience,
  onEnterPortfolio,
}) => {
  const [isMuted, setIsMuted] = useState(fuzailVoiceManager.getIsMuted());
  const [playbackState, setPlaybackState] = useState<PlaybackState>(fuzailVoiceManager.getPlaybackState());
  const [volume, setVolumeState] = useState(fuzailVoiceManager.getVolume());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleEnter = onEnterPortfolio || onSkip;

  useEffect(() => {
    const unsub = fuzailVoiceManager.subscribe((st) => {
      setPlaybackState(st);
      setIsMuted(fuzailVoiceManager.getIsMuted());
    });
    return () => unsub();
  }, []);

  const handleToggleMute = () => {
    const muted = robotAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleTogglePlayPause = () => {
    if (playbackState.isPaused) {
      fuzailVoiceManager.resume();
    } else {
      fuzailVoiceManager.pause();
    }
  };

  if (!isActive) return null;

  // Calculate percentage [0 -> 100]
  const progressPct =
    isWakingUp
      ? 5
      : Math.min(100, Math.max(0, ((currentIndex + 1) / totalSegments) * 100));

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none flex flex-col justify-between overflow-hidden">
      {/* ========================================================
       * 0. AUDIO UNLOCK / CINEMATIC START EXPERIENCE MODAL
       * ======================================================== */}
      {!hasStartedExperience && (
        <div className="absolute inset-0 z-50 bg-[#020611]/92 backdrop-blur-2xl flex flex-col items-center justify-center pointer-events-auto p-4 animate-in fade-in duration-500">
          <div className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-950/95 border border-cyan-500/40 shadow-[0_0_80px_rgba(6,182,212,0.3)] text-center space-y-6">
            {/* Glowing Tactical Corner Accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl shadow-[0_0_12px_#06b6d4]" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl shadow-[0_0_12px_#06b6d4]" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl shadow-[0_0_12px_#06b6d4]" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl shadow-[0_0_12px_#06b6d4]" />

            {/* Cinematic Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest shadow-md">
              <Bot size={13} className="text-cyan-400 animate-pulse" />
              <span>HOLLYWOOD CINEMATIC EXPERIENCE</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight leading-tight">
                FUZAIL AHMED <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  AI ROBOT INTRODUCTION
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
                Realistic masculine adult humanoid robot in a premium futuristic black cinematic suit with metallic shoulder and chest armour, glowing AR visor and expressive blue illuminated eyes.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={onStartExperience}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_35px_rgba(6,182,212,0.55)] transform hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Play size={16} fill="white" />
                <span>START CINEMATIC INTRO</span>
              </button>

              <button
                onClick={handleEnter}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-cyan-400/30 hover:border-cyan-400/60 text-slate-200 hover:text-white font-mono text-xs font-semibold tracking-wider transition-all"
              >
                <span>ENTER PORTFOLIO</span>
                <ArrowRight size={14} className="text-cyan-400" />
              </button>
            </div>

            <p className="text-[10px] font-mono text-slate-400">
              Authentic Indian English voice identity • Real-time Web Audio lip-sync
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
       * 1. TOP FUTURISTIC HUD LETTERBOX BAR
       * ======================================================== */}
      <div className="w-full h-12 sm:h-16 bg-black/90 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 pointer-events-auto backdrop-blur-md">
        {/* Left Status Tag */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_#06b6d4] shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="hidden sm:inline text-[10px] sm:text-[11px] font-mono tracking-widest text-cyan-300 font-bold uppercase truncate">
              CINEMATIC AI ROBOT // ONLINE
            </span>
            <span className="sm:hidden text-[10px] font-mono tracking-widest text-cyan-300 font-bold uppercase">
              AI ROBOT
            </span>
            <span className="hidden sm:inline text-[9px] font-mono text-slate-400">
              FUZAIL AHMED • SOFTWARE DEVELOPER • CHENNAI, INDIA
            </span>
          </div>
        </div>

        {/* Right Controls: Enter Portfolio, Play/Pause, Replay, Volume, Skip */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Enter Portfolio Button */}
          <button
            onClick={handleEnter}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-mono font-bold tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all transform hover:scale-105 active:scale-95"
            title="Enter Portfolio Landing Page Directly"
          >
            <span>ENTER PORTFOLIO</span>
            <ArrowRight size={13} className="text-cyan-400" />
          </button>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={handleTogglePlayPause}
            className="p-1.5 sm:p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title={playbackState.isPaused ? 'Resume voice playback' : 'Pause voice playback'}
            aria-label="Toggle Play Pause"
          >
            {playbackState.isLoading ? (
              <Loader2 size={15} className="animate-spin text-cyan-400" />
            ) : playbackState.isPaused ? (
              <Play size={15} className="text-emerald-400 fill-emerald-400" />
            ) : (
              <Pause size={15} className="text-cyan-400 fill-cyan-400" />
            )}
          </button>

          {/* Replay Button */}
          <button
            onClick={onReplay}
            className="p-1.5 sm:p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Replay Cinematic Introduction"
            aria-label="Replay Introduction"
          >
            <RotateCcw size={15} className="text-cyan-400" />
          </button>

          {/* Volume Control & Mute with Hover Slider */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={handleToggleMute}
              className="p-1.5 sm:p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute voice and SFX' : 'Mute voice and SFX'}
              aria-label="Toggle Audio"
            >
              {isMuted ? <VolumeX size={15} className="text-red-400" /> : <Volume2 size={15} className="text-cyan-400" />}
            </button>

            {showVolumeSlider && (
              <div className="absolute right-0 top-full mt-2 p-2.5 bg-slate-950/95 border border-cyan-500/40 rounded-xl shadow-2xl z-50 flex items-center gap-2 backdrop-blur-xl animate-in fade-in duration-200">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    fuzailVoiceManager.setVolume(v);
                    setVolumeState(v);
                    if (isMuted && v > 0) fuzailVoiceManager.toggleMute();
                  }}
                  className="w-20 accent-cyan-400 h-1 cursor-pointer"
                />
                <span className="text-[10px] font-mono text-cyan-300 w-7 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Skip Intro Button */}
          <button
            onClick={onSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 text-white text-xs font-mono font-bold tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform hover:scale-105 active:scale-95"
            aria-label="Skip Introduction"
          >
            <span>SKIP</span>
            <FastForward size={13} />
          </button>
        </div>
      </div>

      {/* Center Buffer */}
      <div className="flex-1 w-full" />

      {/* ========================================================
       * 2. SUBTITLE & SPEECH CAPTION CARD
       * ======================================================== */}
      <div className="w-full flex flex-col items-center pb-2 px-4 pointer-events-auto">
        {/* Waking Up State Announcement */}
        {isWakingUp && (
          <div className="mb-4 px-4 py-2 rounded-full bg-slate-950/90 border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2 animate-pulse">
            <Sparkles size={14} className="text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
              [Dramatic Cinematic Reveal // Lights Activating]
            </span>
          </div>
        )}

        {/* Spoken Dialogue Caption Card */}
        {currentSegment && !isWakingUp && (
          <div className="mb-4 max-w-xl sm:max-w-2xl w-full p-4 sm:p-5 rounded-2xl bg-slate-950/95 border border-cyan-400/50 backdrop-blur-2xl shadow-[0_20px_50px_rgba(6,182,212,0.35)] flex items-start sm:items-center gap-3.5 sm:gap-4 animate-in fade-in duration-300">
            {/* Robot Avatar Icon */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-600/30 via-blue-600/30 to-slate-900 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.7)] flex items-center justify-center shrink-0">
              <Bot size={22} className="text-cyan-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            </div>

            {/* Content & Live Waveform */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    FUZAIL AHMED
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 truncate">
                    AUTHENTIC VOICE IDENTITY • CHENNAI, INDIA
                  </span>
                </div>

                {/* Animated Speech Equalizer */}
                <div className="flex items-center gap-0.5 h-3.5 shrink-0 ml-2">
                  <span className="w-0.5 h-full bg-cyan-400 animate-pulse" />
                  <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse delay-75" />
                  <span className="w-0.5 h-3.5 bg-sky-300 animate-pulse delay-150" />
                  <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-200" />
                  <span className="w-0.5 h-3 bg-sky-300 animate-pulse delay-100" />
                </div>
              </div>

              {/* Subtitle Line */}
              <p className="text-sm sm:text-base font-heading font-medium text-white leading-snug drop-shadow-sm mt-0.5">
                "{currentSegment.subtitle}"
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
         * 3. BOTTOM TIMELINE & PROGRESS BAR
         * ======================================================== */}
        <div className="w-full h-10 sm:h-12 bg-black/90 border-t border-white/10 flex items-center justify-between px-4 sm:px-10 backdrop-blur-md">
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">
            {isWakingUp
              ? 'CINEMATIC INITIALIZATION SEQUENCE...'
              : `SCENE: ${currentIndex + 1} OF ${totalSegments} • ${currentSegment?.action.toUpperCase() || 'PRESENTING'}`}
          </span>

          {/* Progress Rail */}
          <div className="w-36 sm:w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-4">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 transition-all duration-300 ease-out shadow-[0_0_8px_#06b6d4]"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">
            {isWakingUp ? '0%' : `${Math.round(progressPct)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
