import React, { useState, useEffect } from 'react';
import { FastForward, Volume2, VolumeX, Sparkles, Play, Pause, RotateCcw, Loader2 } from 'lucide-react';
import fuzailAvatar from '../../assets/images/fuzail-face.jpg';
import { cinematicAudio, CINEMATIC_DIALOGUES, type SpeechSegment } from '../../utils/cinematicAudio';
import { fuzailVoiceManager, type PlaybackState } from '../../utils/fuzailVoiceManager';

interface CinematicIntroOverlayProps {
  elapsedTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onSkip: () => void;
  onToggleAudio?: () => void;
}

export const CinematicIntroOverlay: React.FC<CinematicIntroOverlayProps> = ({
  elapsedTime,
  totalDuration,
  isPlaying,
  onSkip,
  onToggleAudio,
}) => {
  const [hasStartedExperience, setHasStartedExperience] = useState(false);
  const [isMuted, setIsMuted] = useState(fuzailVoiceManager.getIsMuted());
  const [playbackState, setPlaybackState] = useState<PlaybackState>(fuzailVoiceManager.getPlaybackState());
  const [volume, setVolumeState] = useState(fuzailVoiceManager.getVolume());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Sync state with centralized voice manager
  useEffect(() => {
    const unsub = fuzailVoiceManager.subscribe((st) => {
      setPlaybackState(st);
      setIsMuted(fuzailVoiceManager.getIsMuted());
    });
    return () => unsub();
  }, []);

  // Sync audio timeline with elapsed time
  useEffect(() => {
    if (isPlaying && hasStartedExperience) {
      cinematicAudio.updateTimeline(elapsedTime);
    }
  }, [elapsedTime, isPlaying, hasStartedExperience]);

  // Handle start experience button click (unlocks browser AudioContext & speech)
  const handleStartExperience = async () => {
    (window as any).__cinematicIntroStarted = true;
    await cinematicAudio.unlock();
    cinematicAudio.startAmbientScore();
    setHasStartedExperience(true);
  };

  const handleToggleMute = () => {
    const muted = cinematicAudio.toggleMute();
    setIsMuted(muted);
    onToggleAudio?.();
  };

  const handleTogglePlayPause = () => {
    if (playbackState.isPaused) {
      fuzailVoiceManager.resume();
    } else {
      fuzailVoiceManager.pause();
    }
  };

  const handleReplay = () => {
    (window as any).__cinematicIntroStarted = true;
    setHasStartedExperience(true);
    window.dispatchEvent(new CustomEvent('replay-cinematic-intro'));
  };

  if (!isPlaying) return null;

  // Active dialogue line
  const activeLine: SpeechSegment | undefined = CINEMATIC_DIALOGUES.find(
    (d) => elapsedTime >= d.startTime && elapsedTime <= d.endTime
  );

  // Progress percentage [0 -> 100]
  const progressPct = Math.min(100, Math.max(0, (elapsedTime / totalDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none flex flex-col justify-between overflow-hidden">
      {/* ========================================================
       * 0. START CINEMATIC EXPERIENCE MODAL (Solves Browser Audio Restrictions)
       * ======================================================== */}
      {!hasStartedExperience && (
        <div className="absolute inset-0 z-50 bg-[#030712]/90 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto p-4 animate-in fade-in duration-500">
          <div className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-950/95 border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.35)] text-center space-y-6">
            {/* Glowing Corner Accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[10px] font-mono text-red-300 font-bold uppercase tracking-widest shadow-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>SPIDER-MAN CINEMATIC OPENING</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                FUZAIL AHMED <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                  DIGITAL UNIVERSE
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Experience an interactive 3D superhero introduction featuring Spider-Man with authentic voice and city web-swinging.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStartExperience}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 via-pink-600 to-cyan-500 hover:from-red-500 hover:to-cyan-400 text-white font-mono font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_30px_rgba(239,68,68,0.5)] transform hover:scale-105 active:scale-95 transition-all"
              >
                <Play size={16} fill="white" />
                <span>START EXPERIENCE (WITH SOUND)</span>
              </button>

              <button
                onClick={onSkip}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white font-mono font-medium text-xs tracking-wider transition-all"
              >
                SKIP INTRO
              </button>
            </div>

            <p className="text-[10px] font-mono text-slate-500">
              Audio enabled • Headphones recommended for optimal 3D experience
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
       * 1. TOP CINEMATIC LETTERBOX BAR
       * ======================================================== */}
      <div className="w-full h-12 sm:h-16 bg-black/95 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 pointer-events-auto backdrop-blur-md">
        {/* Left Telemetry Tag */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#ef4444] shrink-0" />
          <span className="hidden sm:inline text-[10px] sm:text-[11px] font-mono tracking-widest text-cyan-300 font-bold uppercase truncate">
            CINEMATIC PROLOGUE // FUZAIL AHMED × SPIDER-MAN
          </span>
          <span className="sm:hidden text-[10px] font-mono tracking-widest text-cyan-300 font-bold uppercase">
            CINEMATIC
          </span>
        </div>

        {/* Right Controls: Play/Pause, Replay, Volume, Voice Studio, Skip */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
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
            onClick={handleReplay}
            className="p-1.5 sm:p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Replay from start"
            aria-label="Replay"
          >
            <RotateCcw size={15} className="text-violet-400" />
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
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600/80 to-cyan-600/80 hover:from-red-500 hover:to-cyan-500 border border-white/20 text-white text-xs font-mono font-bold tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 active:scale-95"
            aria-label="Skip Cinematic Introduction"
          >
            <span>SKIP</span>
            <FastForward size={13} />
          </button>
        </div>
      </div>

      {/* ========================================================
       * 2. SCENE 1 TITLE CARD (0.0s - 3.0s: City Establishing Shot)
       * ======================================================== */}
      {elapsedTime < 3.0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in duration-700">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest shadow-lg">
              <Sparkles size={11} className="text-cyan-400 animate-spin-slow" />
              <span>SUPERHERO CHRONICLES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-widest uppercase drop-shadow-[0_0_35px_rgba(0,229,255,0.6)]">
              ENTERING FUZAIL'S <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                DIGITAL WORLD
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-400 tracking-wider">
              NEW YORK SKYLINE // TWILIGHT SUNSET
            </p>
          </div>
        </div>
      )}

      {/* Center buffer space */}
      {elapsedTime >= 3.0 && <div className="flex-1 w-full" />}

      {/* ========================================================
       * 3. BOTTOM CINEMATIC SUBTITLE & LETTERBOX BAR
       * ======================================================== */}
      <div className="w-full flex flex-col items-center pb-2">
        {/* Dynamic Voice Subtitle Box */}
        {activeLine && (
          <div className="mb-4 max-w-lg sm:max-w-xl mx-4 p-3.5 sm:p-4 rounded-2xl bg-slate-950/95 border border-cyan-400/50 backdrop-blur-xl shadow-[0_15px_45px_rgba(6,182,212,0.45)] flex items-center gap-3.5 animate-slide-up pointer-events-auto">
            {/* Speaker Avatar Icon */}
            {activeLine.speaker === 'fuzail' ? (
              <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)] shrink-0">
                <img
                  src={fuzailAvatar}
                  alt="Fuzail Ahmed"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-blue-700 flex items-center justify-center text-xl border-2 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.7)] shrink-0">
                <span>🕷️</span>
                {/* Voice speaking pulsing dot */}
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              </div>
            )}

            {/* Speaker Name & Animated Audio Wave + Spoken Text */}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                      activeLine.speaker === 'fuzail'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'bg-red-500/20 text-red-300 border border-red-400/40'
                    }`}
                  >
                    {activeLine.speakerName}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {activeLine.speaker === 'fuzail' ? 'DEVELOPER' : 'SUPERHERO GUIDE'}
                  </span>
                </div>

                {/* Simulated Audio Waveform Bar */}
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-cyan-400 animate-pulse" />
                  <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-75" />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-pulse delay-150" />
                  <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-200" />
                  <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse delay-100" />
                </div>
              </div>

              <p className="text-sm sm:text-base font-heading font-medium text-white mt-1 drop-shadow-sm leading-snug">
                "{activeLine.text}"
              </p>
            </div>
          </div>
        )}

        {/* Bottom Letterbox Bar with Progress Rail */}
        <div className="w-full h-10 sm:h-12 bg-black/95 border-t border-white/5 flex items-center justify-between px-6 sm:px-12 backdrop-blur-md">
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">
            {elapsedTime < 3.0
              ? 'SCENE 1: CITY OPENING'
              : elapsedTime < 5.5
              ? 'SCENE 2: SPIDER-MAN ARRIVAL'
              : elapsedTime < 26.0
              ? 'SCENE 3: FUZAIL AHMED WELCOME SPEECH'
              : elapsedTime < 34.0
              ? 'SCENE 4: PHYSICAL HAND TOUCH INTERACTION'
              : 'SCENE 5: PORTFOLIO REVEAL'}
          </span>

          {/* Intro Timeline Progress Rail */}
          <div className="w-40 sm:w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-cyan-400 to-violet-500 transition-all duration-100 ease-linear shadow-[0_0_8px_#00e5ff]"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <span className="text-[10px] font-mono text-cyan-400">
            {elapsedTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
          </span>
        </div>
      </div>
    </div>
  );
};
