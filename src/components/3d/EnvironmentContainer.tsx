import React from 'react';
import { useExperienceMode } from '../../context/ExperienceModeContext';
import { CinematicEnvironment } from './CinematicEnvironment';
import { ProfessionalEnvironment } from './ProfessionalEnvironment';
import { StructureEnvironment } from './StructureEnvironment';
import { DeveloperEnvironment } from './DeveloperEnvironment';
import { Sparkles, Bot, Layers, Terminal } from 'lucide-react';

interface EnvironmentContainerProps {
  scrollProgress: number;
  isReducedMotion?: boolean;
}

export const EnvironmentContainer: React.FC<EnvironmentContainerProps> = ({
  scrollProgress,
  isReducedMotion = false,
}) => {
  const { activeMode, isTransitioning, currentModeMeta } = useExperienceMode();

  const getModeIcon = () => {
    switch (activeMode) {
      case 'professional':
        return <Bot size={18} className="text-cyan-400 animate-pulse" />;
      case 'structure':
        return <Layers size={18} className="text-amber-400 animate-pulse" />;
      case 'developer':
        return <Terminal size={18} className="text-purple-400 animate-pulse" />;
      case 'cinematic':
      default:
        return <Sparkles size={18} className="text-blue-400 animate-pulse" />;
    }
  };

  return (
    <>
      {/* Active 3D WebGL Environment — Only ONE active canvas at any time */}
      {activeMode === 'cinematic' && (
        <CinematicEnvironment
          scrollProgress={scrollProgress}
          isReducedMotion={isReducedMotion}
        />
      )}
      {activeMode === 'professional' && (
        <ProfessionalEnvironment
          scrollProgress={scrollProgress}
          isReducedMotion={isReducedMotion}
        />
      )}
      {activeMode === 'structure' && (
        <StructureEnvironment
          scrollProgress={scrollProgress}
          isReducedMotion={isReducedMotion}
        />
      )}
      {activeMode === 'developer' && (
        <DeveloperEnvironment
          scrollProgress={scrollProgress}
          isReducedMotion={isReducedMotion}
        />
      )}

      {/* Smooth Cinematic Mode Transition Overlay */}
      {isTransitioning && (
        <div
          className="fixed inset-0 z-30 pointer-events-none flex flex-col items-center justify-center bg-[#030712]/80 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
          aria-live="polite"
        >
          <div
            className="flex items-center gap-3.5 px-6 py-3 rounded-full bg-slate-900/95 border shadow-2xl backdrop-blur-2xl"
            style={{
              borderColor: `${currentModeMeta.accentColor}60`,
              boxShadow: `0 0 35px ${currentModeMeta.accentColor}35`,
            }}
          >
            {getModeIcon()}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                SWITCHING ENVIRONMENT
              </span>
              <span
                className="text-xs font-mono font-bold tracking-wider"
                style={{ color: currentModeMeta.accentColor }}
              >
                {currentModeMeta.name.toUpperCase()} MODE
              </span>
            </div>
            <span
              className="w-2 h-2 rounded-full animate-ping ml-2"
              style={{ backgroundColor: currentModeMeta.accentColor }}
            />
          </div>
        </div>
      )}
    </>
  );
};

