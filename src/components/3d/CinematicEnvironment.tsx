import React, { useState, useEffect, useCallback } from 'react';
import { ThreeWorld } from './ThreeWorld';
import { CinematicIntroOverlay } from '../common/CinematicIntroOverlay';
import { cinematicAudio } from '../../utils/cinematicAudio';

interface CinematicEnvironmentProps {
  scrollProgress: number;
  isReducedMotion?: boolean;
}

const INTRO_DURATION = 37.0;

/**
 * CINEMATIC MODE — FUZAIL AHMED MEETS SPIDER-MAN
 * Complete 5-Scene Movie Introduction Sequence:
 * Scene 1 (0–3s): Night City Establishing Shot
 * Scene 2 (3–5.5s): Spider-Man Web-Swinging Arrival & Dramatic Rooftop Landing
 * Scene 3 (5.5–26s): Spider-Man Welcome Speech with Actual Voice & Subtitles
 * Scene 4 (26–34s): Physical Hand Contact with Fuzail's Profile Card & Energy Glow
 * Scene 5 (34–37s): Grand Portfolio Reveal & Smooth Normal Scrolling
 */
export const CinematicEnvironment: React.FC<CinematicEnvironmentProps> = ({
  scrollProgress,
  isReducedMotion = false,
}) => {
  const [isIntroActive, setIsIntroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).__skipSpiderIntroOnRobotComplete) return false;
      const seen = sessionStorage.getItem('fuzail_cinematic_intro_seen');
      return !seen;
    }
    return false;
  });
  const [introElapsed, setIntroElapsed] = useState(0);

  // If user scrolls past the top, smoothly complete intro so they can explore freely
  useEffect(() => {
    if (scrollProgress > 0.04 && isIntroActive) {
      setIsIntroActive(false);
      cinematicAudio.stopAmbientScore();
    }
  }, [scrollProgress, isIntroActive]);

  // Support 1-click replay from navbar or hero button
  useEffect(() => {
    const handleReplay = () => {
      (window as any).__cinematicIntroStarted = true;
      cinematicAudio.resetTimeline();
      cinematicAudio.startAmbientScore();
      setIsIntroActive(true);
      setIntroElapsed(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('replay-cinematic-intro', handleReplay);
    return () => window.removeEventListener('replay-cinematic-intro', handleReplay);
  }, []);

  const handleSkip = useCallback(() => {
    (window as any).__cinematicIntroStarted = false;
    setIsIntroActive(false);
    cinematicAudio.stopAmbientScore();
  }, []);

  const handleTimeUpdate = useCallback((elapsed: number) => {
    setIntroElapsed(elapsed);
  }, []);

  const handleComplete = useCallback(() => {
    setIsIntroActive(false);
    cinematicAudio.stopAmbientScore();
    sessionStorage.setItem('fuzail_cinematic_intro_seen', 'true');
  }, []);

  return (
    <div className="relative w-full h-full">
      <ThreeWorld
        scrollProgress={scrollProgress}
        isReducedMotion={isReducedMotion}
        introActive={isIntroActive}
        onIntroTimeUpdate={handleTimeUpdate}
        onIntroComplete={handleComplete}
      />

      <CinematicIntroOverlay
        elapsedTime={introElapsed}
        totalDuration={INTRO_DURATION}
        isPlaying={isIntroActive && scrollProgress < 0.04}
        onSkip={handleSkip}
      />
    </div>
  );
};
