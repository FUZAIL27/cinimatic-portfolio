export type ExperienceMode = 'cinematic' | 'professional' | 'structure' | 'developer';

export interface ModeMeta {
  id: ExperienceMode;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  accentColor: string;
  gradient: string;
  previewGradient: string;
}

export const EXPERIENCE_MODES: ModeMeta[] = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    tagline: 'Superhero City Swinging Odyssey',
    description: 'Realistic 3D Spider-Man hero swinging through an illuminated high-rise city canyon with Hollywood camera tracking.',
    badge: 'ORIGINAL // HEROIC',
    accentColor: '#168BFF',
    gradient: 'from-blue-600/30 via-cyan-500/20 to-purple-600/30',
    previewGradient: 'from-blue-950 via-slate-950 to-cyan-950',
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Futuristic Humanoid Robot Guide',
    description: 'High-detail 3D humanoid robot assistant guiding you through enterprise architecture with sleek cyan & purple telemetry.',
    badge: 'ENTERPRISE // AI',
    accentColor: '#00E5FF',
    gradient: 'from-cyan-600/30 via-blue-500/20 to-violet-600/30',
    previewGradient: 'from-cyan-950 via-slate-950 to-indigo-950',
  },
  {
    id: 'structure',
    name: 'Structure',
    tagline: 'Futuristic 3D Architecture & Human Character',
    description: 'Immersive amber glowing 3D architectural environment with Fuzail Ahmed, perspective grid floor, floating systems wireframes, and connected microservice nodes.',
    badge: '3D ARCHITECTURE // AMBER',
    accentColor: '#FF7A1A',
    gradient: 'from-orange-600/30 via-amber-500/20 to-yellow-600/30',
    previewGradient: 'from-amber-950 via-stone-950 to-orange-950',
  },
  {
    id: 'developer',
    name: 'Developer',
    tagline: 'Cyber Code Workspace & Live Data Streams',
    description: 'Floating 3D code panels, interactive Git commit pipelines, database queries, terminal commands, and AI neural data streams.',
    badge: 'FULL STACK // IDE',
    accentColor: '#8B5CF6',
    gradient: 'from-purple-600/30 via-violet-500/20 to-pink-600/30',
    previewGradient: 'from-purple-950 via-slate-950 to-violet-950',
  },
];

