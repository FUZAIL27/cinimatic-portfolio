import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Square, Sparkles, Loader2 } from 'lucide-react';
import { fuzailVoiceManager, type PlaybackState, FUZAIL_SCRIPTS } from '../../utils/fuzailVoiceManager';

interface AIVoicePlayerProps {
  className?: string;
  compact?: boolean;
}

export const AIVoicePlayer: React.FC<AIVoicePlayerProps> = ({
  className = '',
  compact = false,
}) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(fuzailVoiceManager.getPlaybackState());
  const [audioLevel, setAudioLevel] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);

  // Subscribe to playback state changes
  useEffect(() => {
    const unsub = fuzailVoiceManager.subscribe((st) => {
      setPlaybackState(st);
    });
    return () => unsub();
  }, []);

  // Poll audio level when speaking for equalizer animation
  useEffect(() => {
    let animId: number;
    const updateMeter = () => {
      if (playbackState.isPlaying && !playbackState.isPaused) {
        setAudioLevel(fuzailVoiceManager.getAudioLevel());
      } else {
        setAudioLevel(0);
      }
      animId = requestAnimationFrame(updateMeter);
    };
    animId = requestAnimationFrame(updateMeter);
    return () => cancelAnimationFrame(animId);
  }, [playbackState.isPlaying, playbackState.isPaused]);

  const isSpeaking = playbackState.isPlaying && !playbackState.isPaused;
  const isPaused = playbackState.isPaused;
  const isStopped = !playbackState.isPlaying && !playbackState.isPaused;
  const isLoading = playbackState.isLoading;

  const handlePlay = async () => {
    await fuzailVoiceManager.playAIVoiceIntro();
  };

  const handlePause = () => {
    fuzailVoiceManager.pause();
  };

  const handleResume = () => {
    fuzailVoiceManager.resume();
  };

  const handleStop = () => {
    fuzailVoiceManager.stopAllVoice();
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 p-1 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-lg backdrop-blur-md ${className}`}>
        {isStopped ? (
          <button
            type="button"
            onClick={handlePlay}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 active:scale-95"
            title="Play Friendly Natural-sounding Male AI Voice Introduction"
          >
            {isLoading ? (
              <Loader2 size={13} className="animate-spin text-white" />
            ) : (
              <Volume2 size={14} className="text-white" />
            )}
            <span>PLAY VOICE</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 px-1">
            {isPaused ? (
              <button
                type="button"
                onClick={handleResume}
                className="p-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 transition-all"
                title="Resume voice"
              >
                <Play size={13} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="p-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 transition-all"
                title="Pause voice"
              >
                <Pause size={13} fill="currentColor" />
              </button>
            )}

            <button
              type="button"
              onClick={handleStop}
              className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-300 transition-all"
              title="Stop voice"
            >
              <Square size={12} fill="currentColor" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full max-w-lg rounded-2xl p-3.5 sm:p-4 bg-slate-950/25 hover:bg-slate-950/35 border transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.4)] backdrop-blur-md pointer-events-auto ${
        isSpeaking
          ? 'border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.35)]'
          : isPaused
          ? 'border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
          : 'border-cyan-500/35 hover:border-cyan-400/55 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
      } ${className}`}
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400/60 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400/60 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400/60 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400/60 rounded-br-xl" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 shadow-sm">
            <Volume2 size={13} className={isSpeaking ? 'text-cyan-400 animate-pulse' : 'text-cyan-300'} />
            {isSpeaking && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
              NATURAL AI VOICE
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              FUZAIL AHMED • INDIAN ENGLISH
            </span>
          </div>
        </div>

        {/* Live Audio Equalizer Waveform */}
        <div className="flex items-center gap-0.5 h-3.5 px-2 py-0.5 rounded-md bg-slate-950/40 border border-white/10 backdrop-blur-sm">
          <span
            className="w-0.5 bg-cyan-400 rounded-full transition-all duration-75"
            style={{ height: isSpeaking ? `${Math.max(4, (audioLevel + 0.2) * 14)}px` : '4px' }}
          />
          <span
            className="w-0.5 bg-cyan-300 rounded-full transition-all duration-75"
            style={{ height: isSpeaking ? `${Math.max(4, (audioLevel + 0.4) * 14)}px` : '6px' }}
          />
          <span
            className="w-0.5 bg-sky-400 rounded-full transition-all duration-75"
            style={{ height: isSpeaking ? `${Math.max(4, (audioLevel + 0.6) * 14)}px` : '8px' }}
          />
          <span
            className="w-0.5 bg-cyan-300 rounded-full transition-all duration-75"
            style={{ height: isSpeaking ? `${Math.max(4, (audioLevel + 0.3) * 14)}px` : '5px' }}
          />
          <span
            className="w-0.5 bg-cyan-400 rounded-full transition-all duration-75"
            style={{ height: isSpeaking ? `${Math.max(4, (audioLevel + 0.5) * 14)}px` : '4px' }}
          />
        </div>
      </div>

      {/* Control Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Primary Play / Pause / Resume Controls */}
        <div className="flex items-center gap-1.5">
          {isStopped && (
            <button
              type="button"
              onClick={handlePlay}
              disabled={isLoading}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 active:scale-95"
              title="Play Voice Introduction (Warm, confident, Indian-English accent)"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <Volume2 size={14} className="text-white" />
              )}
              <span>PLAY VOICE</span>
            </button>
          )}

          {isSpeaking && (
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-300 hover:text-white font-mono text-xs font-semibold tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              title="Pause voice introduction"
            >
              <Pause size={13} fill="currentColor" />
              <span>PAUSE</span>
            </button>
          )}

          {isPaused && (
            <button
              type="button"
              onClick={handleResume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-400/50 text-emerald-300 hover:text-white font-mono text-xs font-semibold tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              title="Resume voice introduction"
            >
              <Play size={13} fill="currentColor" />
              <span>RESUME</span>
            </button>
          )}

          {/* Stop Control (Visible whenever playing or paused) */}
          {!isStopped && (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-red-500/40 text-red-300 hover:text-white font-mono text-xs font-semibold tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              title="Stop voice introduction and reset"
            >
              <Square size={12} fill="currentColor" />
              <span>STOP</span>
            </button>
          )}
        </div>

        {/* Status Text & Subtitle Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">
            {isSpeaking ? (
              <span className="text-cyan-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                SPEAKING...
              </span>
            ) : isPaused ? (
              <span className="text-amber-300 font-semibold">PAUSED</span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles size={11} className="text-cyan-400" />
                CLICK TO LISTEN
              </span>
            )}
          </span>

          <button
            type="button"
            onClick={() => setShowSubtitles((prev) => !prev)}
            className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950/70 text-slate-400 hover:text-cyan-300 border border-white/5 transition-colors"
            title="Toggle subtitle text"
          >
            {showSubtitles ? 'HIDE TEXT' : 'SHOW TEXT'}
          </button>
        </div>
      </div>

      {/* Spoken Dialogue Text Card */}
      {showSubtitles && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/30 backdrop-blur-md border border-white/10 text-left">
          <p className="text-[11px] sm:text-xs font-heading font-medium text-slate-200 leading-relaxed italic">
            "{FUZAIL_SCRIPTS.full}"
          </p>
        </div>
      )}
    </div>
  );
};

