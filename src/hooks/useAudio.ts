import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();

      // Master gain
      const masterGain = audioCtxRef.current.createGain();
      masterGain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
      masterGain.connect(audioCtxRef.current.destination);
      oscGainRef.current = masterGain;

      // Low pass filter for warm ambient sound
      const filter = audioCtxRef.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, audioCtxRef.current.currentTime);
      filter.connect(masterGain);
      filterRef.current = filter;

      // Ambient drone chord (C minor 9: C, G, Eb, Bb)
      const freqs = [65.41, 98.0, 155.56, 233.08];
      freqs.forEach((freq, idx) => {
        const osc = audioCtxRef.current!.createOscillator();
        const oscGain = audioCtxRef.current!.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtxRef.current!.currentTime);
        oscGain.gain.setValueAtTime(0.25, audioCtxRef.current!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
      });
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      initAudio();
      setIsPlaying(true);
      return;
    }

    if (audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
      setIsPlaying(false);
    } else {
      audioCtxRef.current.resume();
      setIsPlaying(true);
    }
  }, [initAudio]);

  const playBlip = useCallback((freq = 580) => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtxRef.current.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.08);
    } catch {
      // Audio not permitted or suspended
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return { isPlaying, toggleAudio, playBlip };
}
