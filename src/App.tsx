import { useState, useEffect, useCallback } from 'react';
import { EnvironmentContainer } from './components/3d/EnvironmentContainer';
import { Navbar } from './components/common/Navbar';
import { CustomCursor } from './components/common/CustomCursor';
import { ScrollProgress } from './components/common/ScrollProgress';
import { LoadingScreen } from './components/common/LoadingScreen';
import { EasterEggModal } from './components/common/EasterEggModal';
import { ProjectModal } from './components/common/ProjectModal';
import { ResumeModal } from './components/common/ResumeModal';
import { ExperienceModeSelector } from './components/common/ExperienceModeSelector';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AISection } from './components/sections/AISection';
import { EducationCertSection } from './components/sections/EducationCertSection';
import { ContactSection } from './components/sections/ContactSection';
import { ThankYouSection } from './components/sections/ThankYouSection';
import { FooterSection } from './components/sections/FooterSection';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useAudio } from './hooks/useAudio';
import { ExperienceModeProvider, useExperienceMode } from './context/ExperienceModeContext';
import type { ProjectItem } from './data/portfolioData';

function PortfolioContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const { progress, activeSection, scrollToSection, isReducedMotion } = useScrollProgress();
  const { isPlaying: isAudioPlaying, toggleAudio, playBlip } = useAudio();
  const { activeMode, toggleSelector } = useExperienceMode();

  // Keyboard shortcut listener: 'F' opens Easter Egg, ESC closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        if (e.key === 'Escape') {
          setIsEasterEggOpen(false);
          setIsResumeOpen(false);
          setSelectedProject(null);
        }
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsEasterEggOpen((prev) => !prev);
        playBlip(720);
      } else if (e.key === 'Escape') {
        setIsEasterEggOpen(false);
        setIsResumeOpen(false);
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playBlip]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleNavigate = useCallback(
    (id: string) => {
      scrollToSection(id);
      playBlip(640);
    },
    [scrollToSection, playBlip]
  );

  return (
    <div className={`relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden select-auto font-sans ${activeMode === 'cinematic' ? 'cinematic-experience' : ''}`}>
      {/* 1. Cinematic Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* 2. Custom Glowing Desktop Cursor */}
      <CustomCursor />

      {/* 3. Interchangeable 3D WebGL World (Only 1 Active Environment at a time) */}
      <EnvironmentContainer scrollProgress={progress} isReducedMotion={isReducedMotion} />

      {/* 4. Experience Mode Selector (Floating Button + Glassmorphic Modal) */}
      <ExperienceModeSelector onAudioBlip={playBlip} />

      {/* 5. Floating Glass Navbar */}
      <Navbar
        activeSectionId={activeSection.id}
        onNavigate={handleNavigate}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={toggleAudio}
        onOpenEasterEgg={() => {
          setIsEasterEggOpen(true);
          playBlip(720);
        }}
        onOpenResume={() => {
          setIsResumeOpen(true);
          playBlip(540);
        }}
        onOpenExperienceMode={toggleSelector}
        activeMode={activeMode}
      />

      {/* 6. Cinematic Scroll Progress Rail */}
      <ScrollProgress
        progress={progress}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* 7. Continuous Shared Sections Stream */}
      <main className="relative z-10">
        <HeroSection
          onExploreProjects={() => handleNavigate('projects')}
          onOpenResume={() => {
            setIsResumeOpen(true);
            playBlip(540);
          }}
          onContactClick={() => handleNavigate('contact')}
        />

        <AboutSection />

        <SkillsSection />

        <ExperienceSection />

        <ProjectsSection
          onSelectProject={(project) => {
            setSelectedProject(project);
            playBlip(800);
          }}
        />

        <AISection />

        <EducationCertSection />

        <ContactSection />
        <ThankYouSection onScrollToTop={() => handleNavigate('hero')} />
      </main>

      {/* 8. 3D Footer */}
      <FooterSection
        onScrollToTop={() => handleNavigate('hero')}
        onOpenEasterEgg={() => {
          setIsEasterEggOpen(true);
          playBlip(720);
        }}
      />

      {/* 9. Modals */}
      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

export function App() {
  return (
    <ExperienceModeProvider>
      <PortfolioContent />
    </ExperienceModeProvider>
  );
}

export default App;
