/**
 * AI ROBOT AUDIO & DIALOGUE CONTROLLER
 * Delegated to Centralized Fuzail Voice Manager for unified voice identity.
 */

import { fuzailVoiceManager } from './fuzailVoiceManager';

export interface RobotDialogueItem {
  id: number;
  text: string;
  subtitle: string;
  action:
    | 'wake'
    | 'wave'
    | 'gesture_welcome'
    | 'gesture_tech'
    | 'gesture_portfolio'
    | 'gesture_skills'
    | 'gesture_projects'
    | 'agree'
    | 'complete';
  targetSection?: string;
  pauseAfterMs: number;
}

export const ROBOT_INTRO_SCRIPT: RobotDialogueItem[] = [
  {
    id: 1,
    text: "Hey there! Welcome to my portfolio. I'm Fuzail Ahmed, a software developer from Chennai, India. It's really nice to have you here.",
    subtitle: "Hey there! Welcome to my portfolio. I'm Fuzail Ahmed, a software developer from Chennai, India. It's really nice to have you here.",
    action: "wave",
    pauseAfterMs: 700,
  },
  {
    id: 2,
    text: "I enjoy creating modern web applications, exploring new technologies, and turning interesting ideas into something meaningful.",
    subtitle: "I enjoy creating modern web applications, exploring new technologies, and turning interesting ideas into something meaningful.",
    action: "gesture_projects",
    targetSection: "projects",
    pauseAfterMs: 800,
  },
  {
    id: 3,
    text: "I love learning, solving problems, and building things that make a difference.",
    subtitle: "I love learning, solving problems, and building things that make a difference.",
    action: "gesture_skills",
    targetSection: "skills",
    pauseAfterMs: 800,
  },
  {
    id: 4,
    text: "So take your time, have a look around, and feel free to explore my projects and experience. I hope you enjoy the journey. And once again, thank you for stopping by. Have an amazing day!",
    subtitle: "So take your time, have a look around, and feel free to explore my projects and experience. I hope you enjoy the journey. And once again, thank you for stopping by. Have an amazing day!",
    action: "agree",
    pauseAfterMs: 1200,
  },
];

class RobotAudioManager {
  public async unlock(): Promise<boolean> {
    return await fuzailVoiceManager.unlock();
  }

  public playActivationSFX() {
    fuzailVoiceManager.playSFX('robot-activation', 1.0);
  }

  public startAmbientLoop() {
    fuzailVoiceManager.startAmbientLoop();
  }

  public stopAmbientLoop() {
    fuzailVoiceManager.stopAmbientLoop();
  }

  public async speakLine(text: string, lineId?: number): Promise<void> {
    let id = lineId;
    if (!id) {
      const match = ROBOT_INTRO_SCRIPT.find((item) => item.text === text);
      id = match ? match.id : 1;
    }
    const trackPath = `/audio/fuzail-voice/robot-${id}.wav`;
    await fuzailVoiceManager.playTrackOrText('robot', trackPath, text);
  }

  public stopAllSpeech() {
    fuzailVoiceManager.stopAllVoice();
  }

  public toggleMute(): boolean {
    return fuzailVoiceManager.toggleMute();
  }

  public getIsMuted(): boolean {
    return fuzailVoiceManager.getIsMuted();
  }

  public getIsSpeaking(): boolean {
    return fuzailVoiceManager.getActiveSpeaker() === 'robot';
  }

  public getIsInitialized(): boolean {
    return true;
  }
}

export const robotAudio = new RobotAudioManager();
