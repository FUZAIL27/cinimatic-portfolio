/**
 * CINEMATIC AUDIO & SPIDER-MAN VOICE CONTROLLER
 * Coordinates superhero SFX, ambient score, and Fuzail Ahmed's personal voice delivery.
 */

import { fuzailVoiceManager } from './fuzailVoiceManager';

export interface SpeechSegment {
  text: string;
  startTime: number;
  endTime: number;
  speaker: 'spiderman' | 'fuzail';
  speakerName: string;
}

export const CINEMATIC_DIALOGUES: SpeechSegment[] = [
  {
    text: "Hey there! Welcome to my portfolio.",
    startTime: 0.0,
    endTime: 2.5,
    speaker: 'spiderman',
    speakerName: 'FUZAIL AHMED',
  },
  {
    text: "I'm Fuzail Ahmed, a software developer from Chennai, India. It's really nice to have you here.",
    startTime: 2.5,
    endTime: 7.8,
    speaker: 'spiderman',
    speakerName: 'FUZAIL AHMED',
  },
  {
    text: "I enjoy creating modern web applications, exploring new technologies, and turning interesting ideas into something meaningful.",
    startTime: 7.8,
    endTime: 15.0,
    speaker: 'spiderman',
    speakerName: 'FUZAIL AHMED',
  },
  {
    text: "I love learning, solving problems, and building things that make a difference.",
    startTime: 15.0,
    endTime: 20.0,
    speaker: 'spiderman',
    speakerName: 'FUZAIL AHMED',
  },
  {
    text: "So take your time, have a look around, and feel free to explore my projects and experience.",
    startTime: 20.0,
    endTime: 26.0,
    speaker: 'spiderman',
    speakerName: 'FUZAIL AHMED',
  },
  {
    text: "I hope you enjoy the journey. And once again, thank you for stopping by. Have an amazing day!",
    startTime: 26.0,
    endTime: 31.8,
    speaker: 'spiderman',
    speakerName: 'FUZAIL AHMED',
  },
];

class CinematicAudioManager {
  private firedSFX: Set<string> = new Set();
  private hasTriggeredVoice: boolean = false;

  public async unlock(): Promise<boolean> {
    return await fuzailVoiceManager.unlock();
  }

  public playSFX(name: string, volume = 1.0) {
    fuzailVoiceManager.playSFX(name, volume);
  }

  public startAmbientScore() {
    fuzailVoiceManager.startAmbientLoop();
  }

  public stopAmbientScore() {
    fuzailVoiceManager.stopAmbientLoop();
  }

  public speakDialogue(_text: string) {
    // Handled in unified fashion via fuzailVoiceManager.playSpidermanVoice()
  }

  /**
   * Sync voice and sound effects with cinematic timeline
   */
  public updateTimeline(elapsed: number) {
    // 1. Web-shooting SFX at t = 3.0s
    if (elapsed >= 3.0 && elapsed < 3.3 && !this.sfxFired('web-shoot')) {
      this.playSFX('web-shoot', 0.85);
      this.markSFXFired('web-shoot');
    }

    // 2. Rooftop landing impact at t = 5.0s
    if (elapsed >= 5.0 && elapsed < 5.3 && !this.sfxFired('landing-impact')) {
      this.playSFX('landing-impact', 1.0);
      this.markSFXFired('landing-impact');
    }

    // 3. Fuzail's actual voice delivery through Spider-Man at t = 5.5s
    if (elapsed >= 5.5 && !this.hasTriggeredVoice) {
      this.hasTriggeredVoice = true;
      fuzailVoiceManager.playSpidermanVoice();
    }

    // 3B. Scene 3 Hollywood Web Shooting SFX at t = 11.0s
    if (elapsed >= 11.0 && elapsed < 11.3 && !this.sfxFired('scene3-web-shoot')) {
      fuzailVoiceManager.playWebShootSFX(0.95);
      this.markSFXFired('scene3-web-shoot');
    }

    // 4. Energy ripple contact chime at t = 28.0s (Spider-Man touches Fuzail's portrait)
    if (elapsed >= 28.0 && elapsed < 28.3 && !this.sfxFired('energy-ripple')) {
      this.playSFX('energy-ripple', 0.9);
      this.markSFXFired('energy-ripple');
    }
  }

  private sfxFired(name: string): boolean {
    return this.firedSFX.has(name);
  }

  private markSFXFired(name: string) {
    this.firedSFX.add(name);
  }

  public resetTimeline() {
    this.hasTriggeredVoice = false;
    this.firedSFX.clear();
    fuzailVoiceManager.stopAllVoice();
  }

  public toggleMute(): boolean {
    return fuzailVoiceManager.toggleMute();
  }

  public isReady(): boolean {
    return true;
  }

  public getMuted(): boolean {
    return fuzailVoiceManager.getIsMuted();
  }
}

export const cinematicAudio = new CinematicAudioManager();
