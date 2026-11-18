import { useState, useEffect } from 'react';

export interface SectionInfo {
  id: string;
  label: string;
  number: string;
  range: [number, number];
}

export const SECTIONS: SectionInfo[] = [
  { id: 'hero', label: 'HERO', number: '01', range: [0, 0.12] },
  { id: 'about', label: 'ABOUT', number: '02', range: [0.12, 0.26] },
  { id: 'skills', label: 'SKILLS', number: '03', range: [0.26, 0.42] },
  { id: 'experience', label: 'EXPERIENCE', number: '04', range: [0.42, 0.58] },
  { id: 'projects', label: 'PROJECTS', number: '05', range: [0.58, 0.74] },
  { id: 'ai', label: 'AI CORE', number: '06', range: [0.74, 0.85] },
  { id: 'education', label: 'EDUCATION & CERTS', number: '07', range: [0.85, 0.94] },
  { id: 'contact', label: 'CONTACT', number: '08', range: [0.94, 1.0] },
];

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionInfo>(SECTIONS[0]);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const currentScroll = window.scrollY;
      const rawProgress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      setProgress(rawProgress);

      const found = SECTIONS.find(
        (s) => rawProgress >= s.range[0] && (rawProgress <= s.range[1] || (s.range[1] === 1 && rawProgress >= 0.94))
      );
      if (found) {
        setActiveSection(found);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return { progress, activeSection, scrollToSection, isReducedMotion, setIsReducedMotion };
}
