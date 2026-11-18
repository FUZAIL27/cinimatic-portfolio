/**
 * CENTRALIZED FUZAIL AHMED VOICE & AUDIO MANAGER
 * One unified audio system powering both Spider-Man and the AI Robot.
 *
 * Characteristics:
 * - Natural Indian English accent (en-IN).
 * - Young adult male voice, warm, confident, friendly & professional.
 * - 100% client-side voice system with high-fidelity local pre-recorded audio tracks.
 * - In-browser microphone recording & custom audio upload via IndexedDB.
 * - Audio-reactive AnalyserNode for real-time lip/jaw/head motion.
 * - Complete playback controls: Play, Pause, Resume, Replay, Mute, Volume.
 */

export type VoiceSpeaker = 'none' | 'spiderman' | 'robot';

export type VoiceSourceType = 'recorded' | 'uploaded' | 'api_clone' | 'prerecorded' | 'speech_synth';

export interface VoiceConfig {
  sourceType: VoiceSourceType;
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
  volume: number; // 0 to 1
  isMuted: boolean;
  stability: number;
  similarity: number;
  style: number;
}

export interface PlaybackState {
  speaker: VoiceSpeaker;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
}

export const FUZAIL_SCRIPTS = {
  spiderman:
    "Hey there! Welcome to my portfolio. I'm Fuzail Ahmed, a software developer from Chennai, India. It's really nice to have you here. I enjoy creating modern web applications, exploring new technologies, and turning interesting ideas into something meaningful. I love learning, solving problems, and building things that make a difference. So take your time, have a look around, and feel free to explore my projects and experience. I hope you enjoy the journey. And once again, thank you for stopping by. Have an amazing day!",
  robot:
    "Hey there! Welcome to my portfolio. I'm Fuzail Ahmed, a software developer from Chennai, India. It's really nice to have you here. I enjoy creating modern web applications, exploring new technologies, and turning interesting ideas into something meaningful. I love learning, solving problems, and building things that make a difference. So take your time, have a look around, and feel free to explore my projects and experience. I hope you enjoy the journey. And once again, thank you for stopping by. Have an amazing day!",
  full:
    "Hey there! Welcome to my portfolio. I'm Fuzail Ahmed, a software developer from Chennai, India. It's really nice to have you here. I enjoy creating modern web applications, exploring new technologies, and turning interesting ideas into something meaningful. I love learning, solving problems, and building things that make a difference. So take your time, have a look around, and feel free to explore my projects and experience. I hope you enjoy the journey. And once again, thank you for stopping by. Have an amazing day!",
};

// ========================================================
// IndexedDB Storage Helper for Persisting Fuzail's Voice Clips
// ========================================================
const DB_NAME = 'fuzail_voice_db';
const STORE_NAME = 'voice_blobs';

function openVoiceDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = window.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveVoiceBlob(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openVoiceDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, key);
    return new Promise((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save voice blob to IndexedDB:', err);
  }
}

async function loadVoiceBlob(key: string): Promise<Blob | null> {
  try {
    const db = await openVoiceDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    return new Promise((res, rej) => {
      req.onsuccess = () => res(req.result || null);
      req.onerror = () => rej(req.error);
    });
  } catch {
    return null;
  }
}

async function deleteVoiceBlob(key: string): Promise<void> {
  try {
    const db = await openVoiceDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
  } catch {
    // Ignore error
  }
}

// ========================================================
// Centralized Fuzail Voice Manager
// ========================================================
class FuzailVoiceManager {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private analyserData: Uint8Array | null = null;

  private masterGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  private currentVoiceSource: AudioBufferSourceNode | null = null;
  private currentAmbientSource: AudioBufferSourceNode | null = null;
  private currentHtml5Audio: HTMLAudioElement | null = null;

  // Playback control state
  private activeSpeaker: VoiceSpeaker = 'none';
  private isUnlocked: boolean = false;
  private isMuted: boolean = false;
  private isPaused: boolean = false;
  private isLoading: boolean = false;
  private volume: number = 1.0;

  private currentAudioBuffer: AudioBuffer | null = null;
  private playbackStartTime: number = 0;
  private pauseOffset: number = 0;

  private decodedBuffers: Map<string, AudioBuffer> = new Map();
  private sfxBuffers: Map<string, AudioBuffer> = new Map();

  private config: VoiceConfig = {
    sourceType: 'prerecorded',
    volume: 1.0,
    isMuted: false,
    stability: 0.6,
    similarity: 0.85,
    style: 0.2,
  };

  private listeners: Set<(state: PlaybackState) => void> = new Set();
  private selectedSpeechVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.loadSavedConfig();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.selectBestIndianEnglishVoice();
      };
      this.selectBestIndianEnglishVoice();
    }
  }

  private loadSavedConfig() {
    try {
      const saved = localStorage.getItem('fuzail_voice_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config = { ...this.config, ...parsed };
        this.isMuted = this.config.isMuted;
        this.volume = this.config.volume;
      }
    } catch {
      // LocalStorage notice
    }
  }

  public saveConfig(updated: Partial<VoiceConfig>) {
    this.config = { ...this.config, ...updated };
    if (updated.volume !== undefined) this.setVolume(updated.volume);
    if (updated.isMuted !== undefined) {
      this.isMuted = updated.isMuted;
      this.applyMute();
    }
    try {
      localStorage.setItem('fuzail_voice_config', JSON.stringify(this.config));
    } catch {
      // LocalStorage notice
    }
    this.notifyState();
  }

  public getConfig(): VoiceConfig {
    return { ...this.config };
  }

  public getPlaybackState(): PlaybackState {
    return {
      speaker: this.activeSpeaker,
      isPlaying: this.activeSpeaker !== 'none' && !this.isPaused && !this.isLoading,
      isPaused: this.isPaused,
      isLoading: this.isLoading,
      duration: this.currentAudioBuffer ? this.currentAudioBuffer.duration : 0,
      currentTime: this.getCurrentPlaybackTime(),
    };
  }

  private getCurrentPlaybackTime(): number {
    if (!this.audioCtx || this.activeSpeaker === 'none') return 0;
    if (this.isPaused) return this.pauseOffset;
    return this.pauseOffset + (this.audioCtx.currentTime - this.playbackStartTime);
  }

  /**
   * Unlock AudioContext on visitor gesture (satisfies browser autoplay policies)
   */
  public async unlock(): Promise<boolean> {
    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();

        // 1. Master Gain
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);

        // 2. Studio Vocal Mastering Chain: Noise reduction, warmth, clarity, presence & dynamics compression
        this.voiceGain = this.audioCtx.createGain();
        this.voiceGain.gain.setValueAtTime(1.20, this.audioCtx.currentTime);

        // High-pass filter: Eliminates low-frequency rumble, AC hum, and sub-audible mic artifacts below 85Hz
        const highPass = this.audioCtx.createBiquadFilter();
        highPass.type = 'highpass';
        highPass.frequency.setValueAtTime(85, this.audioCtx.currentTime);
        highPass.Q.setValueAtTime(0.707, this.audioCtx.currentTime);

        // Warmth & Body EQ: Enhances natural vocal chest resonance around 240Hz
        const warmthFilter = this.audioCtx.createBiquadFilter();
        warmthFilter.type = 'peaking';
        warmthFilter.frequency.setValueAtTime(240, this.audioCtx.currentTime);
        warmthFilter.gain.setValueAtTime(1.2, this.audioCtx.currentTime);
        warmthFilter.Q.setValueAtTime(1.0, this.audioCtx.currentTime);

        // Vocal Presence EQ: Clarifies speech articulation, consonants, and diction around 3200Hz
        const presenceFilter = this.audioCtx.createBiquadFilter();
        presenceFilter.type = 'peaking';
        presenceFilter.frequency.setValueAtTime(3200, this.audioCtx.currentTime);
        presenceFilter.gain.setValueAtTime(2.2, this.audioCtx.currentTime);
        presenceFilter.Q.setValueAtTime(1.1, this.audioCtx.currentTime);

        // High-Shelf Air: Polished, smooth high-end clarity above 8500Hz
        const airFilter = this.audioCtx.createBiquadFilter();
        airFilter.type = 'highshelf';
        airFilter.frequency.setValueAtTime(8500, this.audioCtx.currentTime);
        airFilter.gain.setValueAtTime(1.0, this.audioCtx.currentTime);

        // Studio Vocal Dynamics Compressor: Smooths dynamics, balances volume, prevents peaking
        const compressor = this.audioCtx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-20, this.audioCtx.currentTime);
        compressor.knee.setValueAtTime(10, this.audioCtx.currentTime);
        compressor.ratio.setValueAtTime(3.5, this.audioCtx.currentTime);
        compressor.attack.setValueAtTime(0.003, this.audioCtx.currentTime);
        compressor.release.setValueAtTime(0.20, this.audioCtx.currentTime);

        // Real-time Analyser for lip-sync and visual equalizer
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.55;
        this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

        // Connect the vocal mastering chain: voiceGain -> highPass -> warmth -> presence -> air -> compressor -> analyser -> masterGain
        this.voiceGain.connect(highPass);
        highPass.connect(warmthFilter);
        warmthFilter.connect(presenceFilter);
        presenceFilter.connect(airFilter);
        airFilter.connect(compressor);
        compressor.connect(this.analyser);
        this.analyser.connect(this.masterGain);

        // 3. SFX Gain
        this.sfxGain = this.audioCtx.createGain();
        this.sfxGain.gain.setValueAtTime(0.85, this.audioCtx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // 4. Ambient Gain (Set to gentle background level so voice is never overpowered)
        this.ambientGain = this.audioCtx.createGain();
        this.ambientGain.gain.setValueAtTime(0.10, this.audioCtx.currentTime);
        this.ambientGain.connect(this.masterGain);
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.isUnlocked = true;
      await this.preloadSFX();
      return true;
    } catch (err) {
      console.warn('AudioContext unlock notice:', err);
      return false;
    }
  }

  private async preloadSFX() {
    if (!this.audioCtx) return;
    const sfxList = ['web-shoot', 'landing-impact', 'energy-ripple', 'robot-activation', 'cinematic-ambient'];
    for (const name of sfxList) {
      if (this.sfxBuffers.has(name)) continue;
      try {
        const res = await fetch(`/audio/${name}.wav`);
        if (res.ok) {
          const ab = await res.arrayBuffer();
          const buf = await this.audioCtx.decodeAudioData(ab);
          this.sfxBuffers.set(name, buf);
        }
      } catch {
        // SFX fallback
      }
    }
  }

  /**
   * Selects an authentic, natural male voice with preference for Indian English (en-IN)
   */
  private selectBestIndianEnglishVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const femaleKeywords = [
      'female', 'zira', 'heera', 'neerja', 'aditi', 'kalpana', 'sangeeta',
      'priya', 'susan', 'hazel', 'catherine', 'eva', 'jenny', 'aria',
      'woman', 'girl', 'victoria', 'stephanie', 'samantha', 'karen', 'tessa',
      'fiona', 'moira', 'veena', 'ananya', 'geeta', 'shruti', 'pooja'
    ];

    const isFemaleVoice = (v: SpeechSynthesisVoice) => {
      const lowerName = v.name.toLowerCase();
      const lowerLang = v.lang.toLowerCase();
      if ((v as any).gender && String((v as any).gender).toLowerCase().includes('female')) {
        return true;
      }
      return femaleKeywords.some((fk) => lowerName.includes(fk) || lowerLang.includes(fk));
    };

    // 1. Natural Indian English male voices
    const indianMaleKeywords = ['prabhat', 'ravi', 'karthik', 'madhav', 'hemant'];
    let found = voices.find(
      (v) =>
        (v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in')) &&
        !isFemaleVoice(v) &&
        indianMaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );

    // 2. Any Indian English male voice (strictly not female)
    if (!found) {
      found = voices.find(
        (v) =>
          (v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in')) &&
          !isFemaleVoice(v)
      );
    }

    // 3. Clear, friendly natural male English voices
    if (!found) {
      const preferredMale = [
        'david', 'guy', 'ryan', 'mark', 'george', 'christopher', 'brian', 'eric', 'oliver', 'male', 'andrew', 'steven'
      ];
      found = voices.find(
        (v) =>
          !isFemaleVoice(v) &&
          preferredMale.some((p) => v.name.toLowerCase().includes(p))
      );
    }

    // 4. Any English voice that is strictly verified NOT female
    if (!found) {
      found = voices.find((v) => v.lang.startsWith('en') && !isFemaleVoice(v));
    }

    // STRICT: NEVER EVER FALL BACK TO A FEMALE VOICE
    this.selectedSpeechVoice = found || null;
    if (this.selectedSpeechVoice) {
      console.log('✓ Selected Adult Male Voice:', this.selectedSpeechVoice.name, `(${this.selectedSpeechVoice.lang})`);
    } else {
      console.warn('Strict Male Voice Policy: No suitable male voice found in browser SpeechSynthesis. Audio will rely on pre-recorded male neural tracks.');
    }
  }

  /**
   * Real-time audio loudness level [0.0 -> 1.0] for mouth, jaw & head reactivity
   */
  public getAudioLevel(): number {
    if (this.activeSpeaker === 'none' || this.isPaused) {
      return 0.0;
    }
    if (this.analyser && this.analyserData) {
      this.analyser.getByteFrequencyData(this.analyserData as any);
      let sum = 0;
      // Formant vocal frequency range (~150Hz to 3800Hz)
      const startBin = 2;
      const endBin = Math.min(28, this.analyserData.length);
      for (let i = startBin; i < endBin; i++) {
        sum += this.analyserData[i];
      }
      const avg = sum / (endBin - startBin);
      const level = Math.min(1.0, avg / 125.0);
      if (level > 0.02) return level;
    }
    // Syllable speech modulation fallback when speechSynthesis is speaking
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      const t = performance.now() * 0.012;
      return (Math.sin(t) * 0.5 + 0.5) * (Math.sin(t * 1.7) * 0.4 + 0.6) * 0.75;
    }
    return 0.0;
  }

  // ========================================================
  // PLAYBACK CONTROL: PLAY, PAUSE, RESUME, REPLAY, STOP
  // ========================================================

  /**
   * Play Spider-Man's introduction using Fuzail Ahmed's voice
   */
  public async playSpidermanVoice(): Promise<void> {
    this.stopAllVoice();
    this.activeSpeaker = 'spiderman';
    this.isPaused = false;
    this.pauseOffset = 0;
    this.notifyState();

    try {
      await this.playCharacterVoice('spiderman', FUZAIL_SCRIPTS.spiderman);
    } finally {
      if (this.activeSpeaker === 'spiderman' && !this.isPaused) {
        this.activeSpeaker = 'none';
        this.notifyState();
      }
    }
  }

  /**
   * Play the AI Robot's introduction using Fuzail Ahmed's voice
   */
  public async playRobotVoice(scriptKey: 'robot' | 'full' = 'robot'): Promise<void> {
    this.stopAllVoice();
    this.activeSpeaker = 'robot';
    this.isPaused = false;
    this.pauseOffset = 0;
    this.notifyState();

    try {
      const text = scriptKey === 'full' ? FUZAIL_SCRIPTS.full : FUZAIL_SCRIPTS.robot;
      await this.playCharacterVoice('robot', text);
    } finally {
      if (this.activeSpeaker === 'robot' && !this.isPaused) {
        this.activeSpeaker = 'none';
        this.notifyState();
      }
    }
  }

  /**
   * Play the Friendly Natural-sounding Male AI Voice Introduction
   * Dialogue: "Hey! Hello, I'm Fuzail Ahmed, a Software Developer from Chennai, India..."
   */
  public async playAIVoiceIntro(): Promise<void> {
    await this.unlock();
    this.stopAllVoice();
    this.activeSpeaker = 'robot';
    this.isPaused = false;
    this.pauseOffset = 0;
    this.notifyState();

    const trackPath = '/audio/fuzail-voice/fuzail-ai-voice.wav';
    const text = FUZAIL_SCRIPTS.full;
    await this.playTrackOrText('robot', trackPath, text);
  }

  /**
   * Play a specific track path or fallback to natural male speech synth
   */
  public async playTrackOrText(speaker: 'spiderman' | 'robot', trackPath: string, text: string): Promise<void> {
    await this.unlock();
    this.stopAllVoice();
    this.activeSpeaker = speaker;
    this.isPaused = false;
    this.pauseOffset = 0;
    this.isLoading = true;
    this.notifyState();

    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
    }

    try {
      // 0. Priority: User's own recorded or uploaded demo voice if provided
      const customBlob =
        (await loadVoiceBlob(`fuzail_recorded_${speaker}`)) ||
        (await loadVoiceBlob(`fuzail_uploaded_${speaker}`));
      if (customBlob && this.audioCtx && this.voiceGain) {
        try {
          const ab = await customBlob.arrayBuffer();
          const buf = await this.audioCtx.decodeAudioData(ab);
          this.isLoading = false;
          this.notifyState();
          await this.playAudioBuffer(buf);
          return;
        } catch (err) {
          console.warn('Failed to decode custom recorded voice blob, falling back to track:', err);
        }
      }

      const candidatePaths = [
        trackPath,
        trackPath.replace(/\.(wav|mp3)$/, '.mp3'),
        trackPath.replace(/\.(wav|mp3)$/, '.wav'),
        '/audio/fuzail-voice/fuzail-full-speech.mp3',
        '/audio/fuzail-voice/fuzail-full-speech.wav',
        '/audio/fuzail-voice/fuzail-ai-voice.mp3',
        '/audio/fuzail-voice/fuzail-ai-voice.wav',
      ];

      for (const p of candidatePaths) {
        if (this.audioCtx && this.voiceGain) {
          try {
            let buf = this.decodedBuffers.get(p);
            if (!buf) {
              const res = await fetch(p);
              if (res.ok) {
                const ab = await res.arrayBuffer();
                buf = await this.audioCtx.decodeAudioData(ab);
                this.decodedBuffers.set(p, buf);
              }
            }
            if (buf) {
              this.isLoading = false;
              this.notifyState();
              await this.playAudioBuffer(buf);
              return;
            }
          } catch (e) {
            console.warn(`WebAudio decode notice for ${p}:`, e);
          }
        }

        // HTML5 Audio fallback
        try {
          this.isLoading = false;
          this.notifyState();
          await this.playHtml5Audio(p);
          return;
        } catch (e) {
          console.warn(`HTML5 Audio fallback notice for ${p}:`, e);
        }
      }

      // Natural Male SpeechSynth fallback
      this.isLoading = false;
      this.notifyState();
      await this.speakWithIndianEnglishSpeechSynth(text);
    } finally {
      if (this.ambientGain && this.audioCtx) {
        this.ambientGain.gain.setValueAtTime(0.10, this.audioCtx.currentTime);
      }
      if (this.activeSpeaker === speaker && !this.isPaused) {
        this.activeSpeaker = 'none';
      }
      this.isLoading = false;
      this.notifyState();
    }
  }

  /**
   * Pause active speech
   */
  public pause(): void {
    if (this.activeSpeaker === 'none' || this.isPaused) return;

    if (this.currentVoiceSource && this.audioCtx) {
      this.pauseOffset += this.audioCtx.currentTime - this.playbackStartTime;
      try {
        this.currentVoiceSource.stop();
        this.currentVoiceSource.disconnect();
      } catch {
        // Disconnect notice
      }
      this.currentVoiceSource = null;
    }

    if (this.currentHtml5Audio) {
      this.currentHtml5Audio.pause();
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }

    this.isPaused = true;
    this.notifyState();
  }

  /**
   * Resume paused speech
   */
  public async resume(): Promise<void> {
    if (this.activeSpeaker === 'none' || !this.isPaused) return;

    this.isPaused = false;
    this.notifyState();

    if (this.currentHtml5Audio) {
      this.currentHtml5Audio.play().catch(() => {});
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      return;
    }

    if (this.currentAudioBuffer) {
      await this.playAudioBuffer(this.currentAudioBuffer, this.pauseOffset);
      if (!this.isPaused) {
        this.activeSpeaker = 'none';
        this.notifyState();
      }
    }
  }

  /**
   * Replay current or specified speaker
   */
  public replay(speaker?: VoiceSpeaker): void {
    const target = speaker || (this.activeSpeaker !== 'none' ? this.activeSpeaker : 'spiderman');
    if (target === 'spiderman') {
      this.playSpidermanVoice();
    } else if (target === 'robot') {
      this.playRobotVoice();
    }
  }

  /**
   * STOP any ongoing voice playback across both characters (ensures mutual exclusion)
   */
  public stopAllVoice() {
    if (this.currentVoiceSource) {
      try {
        this.currentVoiceSource.stop();
        this.currentVoiceSource.disconnect();
      } catch {
        // Ignore disconnect notice
      }
      this.currentVoiceSource = null;
    }

    if (this.currentHtml5Audio) {
      try {
        this.currentHtml5Audio.pause();
        this.currentHtml5Audio.currentTime = 0;
      } catch {
        // HTML5 Audio cleanup notice
      }
      this.currentHtml5Audio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.currentAudioBuffer = null;
    this.pauseOffset = 0;
    this.isPaused = false;
    this.isLoading = false;

    const prev = this.activeSpeaker;
    this.activeSpeaker = 'none';
    if (prev !== 'none') {
      this.notifyState();
    }
  }

  // ========================================================
  // CORE VOICE RESOLUTION & PLAYBACK ENGINE
  // ========================================================
  private async playCharacterVoice(speaker: 'spiderman' | 'robot', scriptText: string): Promise<void> {
    await this.unlock();
    this.isLoading = true;
    this.notifyState();

    // Duck ambient music when character begins speaking
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
    }

    try {
      // 1. User's own mic recording in IndexedDB
      const recordedBlob = await loadVoiceBlob(`fuzail_recorded_${speaker}`);
      if (recordedBlob && this.audioCtx && this.voiceGain) {
        const ab = await recordedBlob.arrayBuffer();
        const buf = await this.audioCtx.decodeAudioData(ab);
        this.isLoading = false;
        this.notifyState();
        await this.playAudioBuffer(buf);
        return;
      }

      // 2. User uploaded custom audio file
      const uploadedBlob = await loadVoiceBlob(`fuzail_uploaded_${speaker}`);
      if (uploadedBlob && this.audioCtx && this.voiceGain) {
        const ab = await uploadedBlob.arrayBuffer();
        const buf = await this.audioCtx.decodeAudioData(ab);
        this.isLoading = false;
        this.notifyState();
        await this.playAudioBuffer(buf);
        return;
      }

      // 3. Direct Client-side TTS (if ElevenLabs credentials configured locally in browser)
      try {
        const clientAudio = await this.fetchDirectTTS(scriptText, speaker);
        if (clientAudio) {
          this.isLoading = false;
          this.notifyState();
          await this.playAudioBuffer(clientAudio);
          return;
        }
      } catch (e) {
        console.warn('Client TTS notice:', e);
      }

      // 4. Authentic Voice Track Reference (/audio/fuzail-voice/)
      const candidatePaths = [
        `/audio/fuzail-voice/${speaker}-intro.mp3`,
        `/audio/fuzail-voice/${speaker}-intro.wav`,
        `/audio/fuzail-voice/fuzail-full-speech.mp3`,
        `/audio/fuzail-voice/fuzail-full-speech.wav`,
        `/audio/fuzail-voice/fuzail-ai-voice.mp3`,
        `/audio/fuzail-voice/fuzail-ai-voice.wav`,
      ];

      for (const trackPath of candidatePaths) {
        if (this.audioCtx && this.voiceGain) {
          try {
            let buf = this.decodedBuffers.get(trackPath);
            if (!buf) {
              const res = await fetch(trackPath);
              if (res.ok) {
                const ab = await res.arrayBuffer();
                buf = await this.audioCtx.decodeAudioData(ab);
                this.decodedBuffers.set(trackPath, buf);
              }
            }
            if (buf) {
              this.isLoading = false;
              this.notifyState();
              await this.playAudioBuffer(buf);
              return;
            }
          } catch (e) {
            console.warn(`WebAudio decode notice for ${trackPath}:`, e);
          }
        }

        // HTML5 Audio fallback for this track
        try {
          this.isLoading = false;
          this.notifyState();
          await this.playHtml5Audio(trackPath);
          return;
        } catch (e) {
          console.warn(`HTML5 Audio fallback notice for ${trackPath}:`, e);
        }
      }

      // 5. Natural Indian English SpeechSynthesis Fallback
      this.isLoading = false;
      this.notifyState();
      await this.speakWithIndianEnglishSpeechSynth(scriptText);
    } finally {
      // Restore ambient music to normal background murmur
      if (this.ambientGain && this.audioCtx) {
        this.ambientGain.gain.setValueAtTime(0.10, this.audioCtx.currentTime);
      }
      this.isLoading = false;
      this.notifyState();
    }
  }

  /**
   * HTML5 Audio element fallback player
   */
  private playHtml5Audio(url: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        const audio = new Audio(url);
        audio.volume = this.isMuted ? 0 : Math.min(1.0, this.volume);
        this.currentHtml5Audio = audio;

        let resolved = false;
        const done = () => {
          if (!resolved) {
            resolved = true;
            this.currentHtml5Audio = null;
            resolve();
          }
        };

        audio.onended = done;
        audio.onerror = done;
        audio.play().catch(() => done());
      } catch {
        resolve();
      }
    });
  }

  /**
   * Direct Client-side TTS call (used only if user enters ElevenLabs API key in browser Voice Studio)
   */
  private async fetchDirectTTS(text: string, speaker: string): Promise<AudioBuffer | null> {
    if (!this.audioCtx) return null;
    const apiKey = this.config.elevenLabsApiKey;
    const voiceId = this.config.elevenLabsVoiceId;
    if (!apiKey || !voiceId) return null;

    const cacheKey = `direct_${speaker}_${text.slice(0, 32)}`;
    if (this.decodedBuffers.has(cacheKey)) {
      return this.decodedBuffers.get(cacheKey)!;
    }

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: this.config.stability,
            similarity_boost: this.config.similarity,
            style: this.config.style,
            use_speaker_boost: true,
          },
        }),
      });

      if (res.ok) {
        const ab = await res.arrayBuffer();
        const buf = await this.audioCtx.decodeAudioData(ab);
        this.decodedBuffers.set(cacheKey, buf);
        return buf;
      }
    } catch (e) {
      console.warn('Direct client-side TTS notice:', e);
    }
    return null;
  }

  /**
   * Play decoded AudioBuffer with pause offset & real-time AnalyserNode routing
   */
  private playAudioBuffer(buffer: AudioBuffer, startOffset = 0): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioCtx || !this.voiceGain || this.isMuted) {
        const remaining = Math.max(0, buffer.duration - startOffset);
        setTimeout(resolve, remaining * 1000);
        return;
      }

      try {
        const src = this.audioCtx.createBufferSource();
        src.buffer = buffer;
        src.connect(this.voiceGain);

        this.currentAudioBuffer = buffer;
        this.playbackStartTime = this.audioCtx.currentTime;
        this.pauseOffset = startOffset;

        let ended = false;
        const onEnd = () => {
          if (!ended) {
            ended = true;
            this.currentVoiceSource = null;
            if (!this.isPaused) {
              this.currentAudioBuffer = null;
              this.pauseOffset = 0;
            }
            resolve();
          }
        };

        src.onended = onEnd;
        this.currentVoiceSource = src;
        src.start(0, startOffset);
      } catch (err) {
        console.warn('AudioBuffer playback notice:', err);
        resolve();
      }
    });
  }

  /**
   * Natural Indian English conversational SpeechSynthesis
   */
  private speakWithIndianEnglishSpeechSynth(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setTimeout(resolve, Math.max(2000, (text.split(' ').length / 2.6) * 1000));
        return;
      }

      // STRICT MALE-ONLY ENFORCEMENT:
      // If no verified male voice exists in SpeechSynthesis, DO NOT play browser default
      // (as it often defaults to female). Safely resolve.
      if (!this.selectedSpeechVoice) {
        console.warn('SpeechSynthesis cancelled: No verified male voice installed on client OS.');
        setTimeout(resolve, Math.max(2000, (text.split(' ').length / 2.6) * 1000));
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedSpeechVoice;

        // Young adult male, natural Indian English conversational cadence & deep warm resonance
        utterance.rate = 0.95;
        utterance.pitch = 0.92;
        utterance.volume = this.volume;

        let finished = false;
        const complete = () => {
          if (!finished) {
            finished = true;
            resolve();
          }
        };

        utterance.onend = complete;
        utterance.onerror = complete;

        const maxSafetyMs = Math.max(3500, (text.length / 8) * 1000 + 4000);
        setTimeout(complete, maxSafetyMs);

        window.speechSynthesis.speak(utterance);
      } catch {
        resolve();
      }
    });
  }

  // ========================================================
  // SOUND EFFECTS & AMBIENT CITY SCORE
  // ========================================================
  public playSFX(name: string, volumeMultiplier = 1.0) {
    if (this.isMuted || !this.audioCtx || !this.sfxGain) return;
    const buf = this.sfxBuffers.get(name);
    if (!buf) return;
    try {
      const src = this.audioCtx.createBufferSource();
      src.buffer = buf;

      const g = this.audioCtx.createGain();
      g.gain.setValueAtTime(volumeMultiplier, this.audioCtx.currentTime);

      src.connect(g);
      g.connect(this.sfxGain);
      src.start();
    } catch {
      // Audio notice
    }
  }

  /**
   * Authentic Hollywood-style Spider-Man "thwip" web-shooting audio synthesizer
   * Combines pressurized gas noise sweep with high-frequency mechanical valve transient
   */
  public playWebShootSFX(volumeMultiplier = 0.85) {
    if (this.isMuted || !this.audioCtx || !this.sfxGain) return;
    try {
      const t = this.audioCtx.currentTime;
      const sampleRate = this.audioCtx.sampleRate;
      const bufferSize = Math.floor(sampleRate * 0.16);
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3600, t);
      filter.frequency.exponentialRampToValueAtTime(650, t + 0.15);
      filter.Q.setValueAtTime(4.5, t);

      const osc = this.audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.05);

      const oscGain = this.audioCtx.createGain();
      oscGain.gain.setValueAtTime(volumeMultiplier * 0.45, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(volumeMultiplier * 0.75, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);

      whiteNoise.start(t);
      whiteNoise.stop(t + 0.16);
      osc.start(t);
      osc.stop(t + 0.06);
    } catch {
      // Audio notice
    }
  }

  public startAmbientLoop() {
    if (this.isMuted || !this.audioCtx || !this.ambientGain) return;
    const buf = this.sfxBuffers.get('cinematic-ambient');
    if (!buf) return;
    try {
      if (this.currentAmbientSource) {
        this.currentAmbientSource.stop();
      }
      this.currentAmbientSource = this.audioCtx.createBufferSource();
      this.currentAmbientSource.buffer = buf;
      this.currentAmbientSource.loop = true;
      this.currentAmbientSource.connect(this.ambientGain);
      this.currentAmbientSource.start();
    } catch {
      // Audio notice
    }
  }

  public stopAmbientLoop() {
    try {
      if (this.currentAmbientSource) {
        this.currentAmbientSource.stop();
        this.currentAmbientSource.disconnect();
        this.currentAmbientSource = null;
      }
    } catch {
      // Audio notice
    }
  }

  // ========================================================
  // USER CUSTOM VOICE RECORDING & PERSISTENCE
  // ========================================================
  public async saveRecordedVoice(speaker: 'spiderman' | 'robot' | 'both', blob: Blob): Promise<void> {
    if (speaker === 'both' || speaker === 'spiderman') {
      await saveVoiceBlob('fuzail_recorded_spiderman', blob);
    }
    if (speaker === 'both' || speaker === 'robot') {
      await saveVoiceBlob('fuzail_recorded_robot', blob);
    }
    this.saveConfig({ sourceType: 'recorded' });
  }

  public async saveUploadedVoice(speaker: 'spiderman' | 'robot' | 'both', file: File): Promise<void> {
    if (speaker === 'both' || speaker === 'spiderman') {
      await saveVoiceBlob('fuzail_uploaded_spiderman', file);
    }
    if (speaker === 'both' || speaker === 'robot') {
      await saveVoiceBlob('fuzail_uploaded_robot', file);
    }
    this.saveConfig({ sourceType: 'uploaded' });
  }

  public async clearCustomVoice(speaker: 'spiderman' | 'robot' | 'both'): Promise<void> {
    if (speaker === 'both' || speaker === 'spiderman') {
      await deleteVoiceBlob('fuzail_recorded_spiderman');
      await deleteVoiceBlob('fuzail_uploaded_spiderman');
    }
    if (speaker === 'both' || speaker === 'robot') {
      await deleteVoiceBlob('fuzail_recorded_robot');
      await deleteVoiceBlob('fuzail_uploaded_robot');
    }
    this.saveConfig({ sourceType: 'prerecorded' });
  }

  public async hasCustomVoice(speaker: 'spiderman' | 'robot'): Promise<boolean> {
    const r = await loadVoiceBlob(`fuzail_recorded_${speaker}`);
    const u = await loadVoiceBlob(`fuzail_uploaded_${speaker}`);
    return !!(r || u);
  }

  // ========================================================
  // CONTROLS & EVENT SUBSCRIPTIONS
  // ========================================================
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.applyMute();
    this.saveConfig({ isMuted: this.isMuted });
    return this.isMuted;
  }

  private applyMute() {
    if (this.masterGain && this.audioCtx) {
      const g = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setValueAtTime(g, this.audioCtx.currentTime);
    }
    if (this.isMuted) {
      this.stopAllVoice();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
    this.saveConfig({ volume: this.volume });
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsUnlocked(): boolean {
    return this.isUnlocked;
  }

  public getActiveSpeaker(): VoiceSpeaker {
    return this.activeSpeaker;
  }

  public isSpeaking(): boolean {
    return this.activeSpeaker !== 'none' && !this.isPaused;
  }

  public subscribe(callback: (state: PlaybackState) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyState() {
    const st = this.getPlaybackState();
    this.listeners.forEach((cb) => {
      try {
        cb(st);
      } catch {
        // Listener notice
      }
    });
  }
}

export const fuzailVoiceManager = new FuzailVoiceManager();
