import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  type ExperienceMode,
  type ModeMeta,
  EXPERIENCE_MODES,
} from '../data/experienceModes';

interface ExperienceModeContextType {
  activeMode: ExperienceMode;
  currentModeMeta: ModeMeta;
  setMode: (mode: ExperienceMode) => void;
  isSelectorOpen: boolean;
  setIsSelectorOpen: (open: boolean) => void;
  toggleSelector: () => void;
  isTransitioning: boolean;
}

const ExperienceModeContext = createContext<ExperienceModeContextType | undefined>(undefined);

const STORAGE_KEY = 'fuzail_experience_mode_pref';

export const ExperienceModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMode, setActiveModeState] = useState<ExperienceMode>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY) as ExperienceMode;
      if (saved && ['cinematic', 'professional', 'structure', 'developer'].includes(saved)) {
        return saved;
      }
    } catch {
      // Ignore sessionStorage errors
    }
    return 'cinematic'; // Default to Cinematic Mode with Spider-Man & Hero Voice Player
  });

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleSelector = useCallback(() => {
    setIsSelectorOpen((prev) => !prev);
  }, []);

  const setMode = useCallback((newMode: ExperienceMode) => {
    if (newMode === activeMode) {
      setIsSelectorOpen(false);
      return;
    }

    // 1. Close selector popup
    setIsSelectorOpen(false);

    // 2. Preserve current scroll position
    const currentScrollY = window.scrollY;

    // 3. Initiate smooth visual transition
    setIsTransitioning(true);

    // 4. Update mode state and session persistence
    setActiveModeState(newMode);
    try {
      sessionStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // Ignore storage errors
    }

    // 5. Ensure scroll position stays intact
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScrollY, behavior: 'instant' as ScrollBehavior });
    });

    // 6. Complete transition after smooth crossfade (800ms)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  }, [activeMode]);

  const currentModeMeta = EXPERIENCE_MODES.find((m) => m.id === activeMode) || EXPERIENCE_MODES[0];

  return (
    <ExperienceModeContext.Provider
      value={{
        activeMode,
        currentModeMeta,
        setMode,
        isSelectorOpen,
        setIsSelectorOpen,
        toggleSelector,
        isTransitioning,
      }}
    >
      {children}
    </ExperienceModeContext.Provider>
  );
};

export const useExperienceMode = (): ExperienceModeContextType => {
  const context = useContext(ExperienceModeContext);
  if (!context) {
    throw new Error('useExperienceMode must be used within an ExperienceModeProvider');
  }
  return context;
};
