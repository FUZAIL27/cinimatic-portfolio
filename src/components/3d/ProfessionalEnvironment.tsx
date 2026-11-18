import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { robotAudio, ROBOT_INTRO_SCRIPT, type RobotDialogueItem } from '../../utils/robotAudio';
import { fuzailVoiceManager } from '../../utils/fuzailVoiceManager';
import { RobotIntroOverlay } from '../common/RobotIntroOverlay';
import { useExperienceMode } from '../../context/ExperienceModeContext';

interface ProfessionalEnvironmentProps {
  scrollProgress: number; // 0 to 1
  isReducedMotion?: boolean;
}

export const ProfessionalEnvironment: React.FC<ProfessionalEnvironmentProps> = ({
  scrollProgress,
  isReducedMotion = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(scrollProgress);
  const { setMode } = useExperienceMode();

  // Intro states
  const [isIntroActive, setIsIntroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('fuzail_robot_intro_seen');
      return !seen;
    }
    return true;
  });
  const [hasStartedExperience, setHasStartedExperience] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<RobotDialogueItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWakingUp, setIsWakingUp] = useState(false);

  // Cinematic multi-camera director state
  const cinematicDirectorRef = useRef<{
    shot: 'idle' | 'silhouette' | 'armor_pan' | 'face_reveal' | 'master_speech' | 'transition';
    shotStartTime: number;
    shotDuration: number;
  }>({
    shot: 'idle',
    shotStartTime: 0,
    shotDuration: 0,
  });

  // Gesture state shared with Three.js animation loop via ref
  const gestureStateRef = useRef<{
    action: string;
    isWaking: boolean;
    wakeProgress: number;
    introActive: boolean;
  }>({
    action: 'idle',
    isWaking: false,
    wakeProgress: 0,
    introActive: isIntroActive,
  });

  const abortIntroRef = useRef(false);

  const handleEnterPortfolio = useCallback(() => {
    abortIntroRef.current = true;
    setIsIntroActive(false);
    setIsWakingUp(false);
    gestureStateRef.current.introActive = false;
    gestureStateRef.current.action = 'idle';
    cinematicDirectorRef.current.shot = 'idle';
    robotAudio.stopAllSpeech();
    robotAudio.stopAmbientLoop();
    try {
      sessionStorage.setItem('fuzail_robot_intro_seen', 'true');
      sessionStorage.setItem('fuzail_cinematic_intro_seen', 'true');
    } catch {
      // storage fallback
    }
    (window as any).__skipSpiderIntroOnRobotComplete = true;
    setMode('cinematic');
  }, [setMode]);

  useEffect(() => {
    scrollRef.current = scrollProgress;
    // If user scrolls away from top, smoothly transition to portfolio
    if (scrollProgress > 0.05 && isIntroActive) {
      handleEnterPortfolio();
    }
  }, [scrollProgress, isIntroActive, handleEnterPortfolio]);

  useEffect(() => {
    gestureStateRef.current.introActive = isIntroActive;
  }, [isIntroActive]);

  const runIntroSequence = useCallback(async () => {
    abortIntroRef.current = false;
    gestureStateRef.current.introActive = true;
    setIsIntroActive(true);

    // ========================================================
    // SHOT 1: DARK CINEMATIC REVEAL & DRAMATIC BACKLIGHTS (0 to 2.4s)
    // ========================================================
    setIsWakingUp(true);
    gestureStateRef.current.isWaking = true;
    gestureStateRef.current.wakeProgress = 0;
    gestureStateRef.current.action = 'wake';
    cinematicDirectorRef.current = {
      shot: 'silhouette',
      shotStartTime: performance.now(),
      shotDuration: 2400,
    };

    robotAudio.playActivationSFX();
    robotAudio.startAmbientLoop();

    const shot1Start = performance.now();
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (abortIntroRef.current) return resolve();
        const elapsed = now - shot1Start;
        const p = Math.min(1.0, elapsed / 2400);
        gestureStateRef.current.wakeProgress = p;
        if (p < 1.0) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });

    if (abortIntroRef.current) return;

    // ========================================================
    // SHOT 2: TACTICAL ARMOR & ARTICULATED GAUNTLETS PAN (2.4s to 4.8s)
    // ========================================================
    cinematicDirectorRef.current = {
      shot: 'armor_pan',
      shotStartTime: performance.now(),
      shotDuration: 2400,
    };
    gestureStateRef.current.action = 'clench_hands';

    await new Promise<void>((resolve) => {
      const start = performance.now();
      const step = (now: number) => {
        if (abortIntroRef.current) return resolve();
        if (now - start < 2400) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });

    if (abortIntroRef.current) return;

    // ========================================================
    // SHOT 3: CHISELED MASCULINE FACE & EYE REVEAL (4.8s to 7.2s)
    // ========================================================
    cinematicDirectorRef.current = {
      shot: 'face_reveal',
      shotStartTime: performance.now(),
      shotDuration: 2400,
    };
    gestureStateRef.current.action = 'face_turn';

    await new Promise<void>((resolve) => {
      const start = performance.now();
      const step = (now: number) => {
        if (abortIntroRef.current) return resolve();
        if (now - start < 2400) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });

    if (abortIntroRef.current) return;
    setIsWakingUp(false);
    gestureStateRef.current.isWaking = false;
    gestureStateRef.current.wakeProgress = 1.0;

    // ========================================================
    // SHOT 4: MASTER MEDIUM PORTRAIT SHOT & SPOKEN DIALOGUE
    // ========================================================
    cinematicDirectorRef.current = {
      shot: 'master_speech',
      shotStartTime: performance.now(),
      shotDuration: 18000,
    };

    // Play through complete 4-sentence dialogue script with natural male voice & lip-sync
    for (let i = 0; i < ROBOT_INTRO_SCRIPT.length; i++) {
      if (abortIntroRef.current) break;

      const item = ROBOT_INTRO_SCRIPT[i];
      setCurrentIndex(i);
      setCurrentSegment(item);
      gestureStateRef.current.action = item.action;

      // Speak dialogue line
      await robotAudio.speakLine(item.text, item.id);

      if (abortIntroRef.current) break;

      // Natural pause between sentences
      if (item.pauseAfterMs > 0) {
        await new Promise((res) => setTimeout(res, item.pauseAfterMs));
      }
    }

    if (abortIntroRef.current) return;

    // ========================================================
    // SHOT 5: FINAL WELCOMING NOD & PULL-BACK TRANSITION
    // ========================================================
    cinematicDirectorRef.current = {
      shot: 'transition',
      shotStartTime: performance.now(),
      shotDuration: 1800,
    };
    gestureStateRef.current.action = 'agree';
    await new Promise((res) => setTimeout(res, 1600));

    // Smooth transition into portfolio landing page
    handleEnterPortfolio();
  }, [handleEnterPortfolio]);

  const handleStartExperience = useCallback(async () => {
    setHasStartedExperience(true);
    await robotAudio.unlock();
    runIntroSequence();
  }, [runIntroSequence]);

  const handleReplay = useCallback(async () => {
    abortIntroRef.current = true;
    robotAudio.stopAllSpeech();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHasStartedExperience(true);
    await robotAudio.unlock();
    setTimeout(() => {
      runIntroSequence();
    }, 200);
  }, [runIntroSequence]);

  // Support 1-click replay via global event
  useEffect(() => {
    const onGlobalReplay = () => {
      handleReplay();
    };
    window.addEventListener('replay-robot-intro', onGlobalReplay);
    return () => window.removeEventListener('replay-robot-intro', onGlobalReplay);
  }, [handleReplay]);

  // Three.js Mount & Animation Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const getScreenCategory = () => {
      const w = window.innerWidth;
      if (w < 768) return 'mobile';
      if (w < 1024) return 'tablet';
      if (w < 1440) return 'laptop';
      return 'desktop';
    };

    let screenCategory = getScreenCategory();
    const isMobile = screenCategory === 'mobile';
    const isTablet = screenCategory === 'tablet';

    // 1. Scene & Presentation Studio Depth
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020612, 0.016);

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 48 : 42,
      window.innerWidth / window.innerHeight,
      0.1,
      280
    );
    camera.position.set(0, -1.0, isMobile ? 16.0 : 14.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // ========================================================
    // 2. PROCEDURAL TEXTURES FOR HOLLYWOOD SCI-FI TACTICAL SUIT
    // ========================================================
    const createTacticalKevlarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 512);

      // Micro crosshatch ballistic weave
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      const step = 8;
      for (let x = 0; x < 512; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y < 512; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      // Micro stippling for matte fabric finish
      ctx.fillStyle = '#090d16';
      for (let i = 0; i < 2400; i++) {
        const rx = Math.random() * 512;
        const ry = Math.random() * 512;
        ctx.fillRect(rx, ry, 2, 2);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(16, 16);
      return tex;
    };

    const createBrushedTitaniumTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 512, 512);

      // Micro horizontal brush streaks
      for (let i = 0; i < 600; i++) {
        const y = Math.random() * 512;
        const len = 40 + Math.random() * 120;
        const x = Math.random() * (512 - len);
        const alpha = 0.05 + Math.random() * 0.12;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len, y);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      return tex;
    };

    const kevlarBumpMap = createTacticalKevlarTexture();
    const titaniumBumpMap = createBrushedTitaniumTexture();

    // ========================================================
    // 3. CINEMATIC STUDIO LIGHTING (DRAMATIC HOLLYWOOD RIG)
    // ========================================================
    const ambientLight = new THREE.AmbientLight(0x060e1a, 1.8);
    scene.add(ambientLight);

    // Dramatic Rim Backlights (Snap on during Shot 1 reveal)
    const rimBackLeft = new THREE.DirectionalLight(0x00d4ff, 0);
    rimBackLeft.position.set(-8, 9, -8);
    scene.add(rimBackLeft);

    const rimBackRight = new THREE.DirectionalLight(0x0284c7, 0);
    rimBackRight.position.set(8, 9, -8);
    scene.add(rimBackRight);

    // Key Front Directional Light
    const keyLight = new THREE.DirectionalLight(0xf8fafc, 4.8);
    keyLight.position.set(-6, 12, 10);
    scene.add(keyLight);

    // Warm Cyan Studio Fill
    const fillLight = new THREE.PointLight(0x00e5ff, 3.2, 45);
    fillLight.position.set(8, 2, 8);
    scene.add(fillLight);

    // Volumetric Top Studio Spotlight
    const studioSpotlight = new THREE.SpotLight(0xffffff, 5.0, 40, Math.PI / 4, 0.35);
    studioSpotlight.position.set(0, 12, 12);
    scene.add(studioSpotlight);

    // Master presentation studio group
    const studioGroup = new THREE.Group();
    scene.add(studioGroup);

    // 4. Reflective Studio Floor Grid
    const floorGeo = new THREE.PlaneGeometry(60, 60, 30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x040812,
      roughness: 0.16,
      metalness: 0.92,
      wireframe: false,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, -6.5, 0);
    studioGroup.add(floorMesh);

    const floorGrid = new THREE.GridHelper(60, 40, 0x0284c7, 0x081c34);
    floorGrid.position.set(0, -6.45, 0);
    studioGroup.add(floorGrid);

    // Concentric Stage Rings on Floor
    const stageRing1 = new THREE.Mesh(
      new THREE.RingGeometry(5.8, 6.0, 64),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    );
    stageRing1.rotation.x = Math.PI / 2;
    stageRing1.position.set(0, -6.4, 0);
    studioGroup.add(stageRing1);

    const stageRing2 = new THREE.Mesh(
      new THREE.RingGeometry(8.5, 8.65, 64),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
    );
    stageRing2.rotation.x = Math.PI / 2;
    stageRing2.position.set(0, -6.4, 0);
    studioGroup.add(stageRing2);

    // 5. Floating Robot Anti-Gravity Platform
    const assistantGroup = new THREE.Group();
    studioGroup.add(assistantGroup);

    const diskGeo = new THREE.CylinderGeometry(3.2, 3.8, 0.45, 32);
    const diskMat = new THREE.MeshStandardMaterial({
      color: 0x081324,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
    });
    const diskMesh = new THREE.Mesh(diskGeo, diskMat);
    diskMesh.position.set(0, -3.2, 0);
    assistantGroup.add(diskMesh);

    // Energy levitation ring
    const energyRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.9, 0.05, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.85 })
    );
    energyRing.rotation.x = Math.PI / 2;
    energyRing.position.set(0, -3.0, 0);
    assistantGroup.add(energyRing);

    // 6. Holographic Display Panels (Profile & System Diagnostics)
    const createHoloHUDTexture = (
      header: string,
      subHeader: string,
      metrics: { label: string; val: string; pct: number }[]
    ) => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 360;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);

      ctx.fillStyle = 'rgba(7, 16, 32, 0.92)';
      ctx.roundRect(8, 8, 496, 344, 20);
      ctx.fill();

      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2.5;
      ctx.roundRect(8, 8, 496, 344, 20);
      ctx.stroke();

      ctx.fillStyle = '#00d4ff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(header, 30, 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(subHeader, 30, 78);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(30, 96);
      ctx.lineTo(480, 96);
      ctx.stroke();

      let y = 140;
      metrics.forEach((m) => {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px monospace';
        ctx.fillText(m.label, 30, y);

        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(m.val, 400, y);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.roundRect(30, y + 8, 450, 12, 6);
        ctx.fill();

        ctx.fillStyle = '#0284c7';
        ctx.roundRect(30, y + 8, 450 * (m.pct / 100), 12, 6);
        ctx.fill();

        y += 64;
      });

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    const hudTex1 = createHoloHUDTexture('SYSTEM // VERIFIED IDENTITY', 'FUZAIL AHMED', [
      { label: 'Java Spring Boot Microservices', val: '99.9%', pct: 99 },
      { label: 'Full Stack & Enterprise ERP', val: '5+ SCM/CRM', pct: 95 },
      { label: 'Cloud Architecture & DB', val: 'OPTIMIZED', pct: 94 },
    ]);
    const hudPanel1 = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 2.95),
      new THREE.MeshStandardMaterial({
        map: hudTex1,
        transparent: true,
        opacity: isMobile ? 0 : 0.88,
        roughness: 0.1,
        metalness: 0.3,
        side: THREE.DoubleSide,
      })
    );
    hudPanel1.position.set(-5.8, 1.0, -0.8);
    hudPanel1.rotation.y = 0.45;
    assistantGroup.add(hudPanel1);

    const hudTex2 = createHoloHUDTexture('RUNTIME TELEMETRY // CHENNAI', 'SOFTWARE DEVELOPER', [
      { label: 'MERN & Reactive Angular UI', val: 'ACTIVE', pct: 98 },
      { label: 'REST APIs & Distributed Systems', val: 'SYNCED', pct: 96 },
      { label: 'Creative Technology Solutions', val: 'ONLINE', pct: 92 },
    ]);
    const hudPanel2 = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 2.95),
      new THREE.MeshStandardMaterial({
        map: hudTex2,
        transparent: true,
        opacity: isMobile ? 0 : 0.88,
        roughness: 0.1,
        metalness: 0.3,
        side: THREE.DoubleSide,
      })
    );
    hudPanel2.position.set(5.8, 1.0, -0.8);
    hudPanel2.rotation.y = -0.45;
    assistantGroup.add(hudPanel2);

    // Floating Holographic Skill Pods
    const skillPods: { mesh: THREE.Mesh; angle: number; radius: number; speed: number; yBase: number }[] = [];
    const skillsList = [
      { name: 'JAVA / SPRING 3', color: '#0284c7' },
      { name: 'REACT / TYPESCRIPT', color: '#00e5ff' },
      { name: 'NODE.JS / EXPRESS', color: '#38bdf8' },
      { name: 'DOCKER / CLOUD', color: '#0ea5e9' },
      { name: 'POSTGRES / MYSQL', color: '#06b6d4' },
      { name: 'ENTERPRISE ERP', color: '#6366f1' },
    ];

    const createSkillCardTexture = (title: string, color: string) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 80;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);
      ctx.fillStyle = 'rgba(7, 16, 32, 0.94)';
      ctx.roundRect(4, 4, 248, 72, 12);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.roundRect(4, 4, 248, 72, 12);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(title, 128, 46);
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    skillsList.forEach((sk, i) => {
      const podTex = createSkillCardTexture(sk.name, sk.color);
      const podMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.9, 0.6),
        new THREE.MeshBasicMaterial({
          map: podTex,
          transparent: true,
          opacity: isMobile ? 0 : 0.85,
          side: THREE.DoubleSide,
        })
      );
      assistantGroup.add(podMesh);
      skillPods.push({
        mesh: podMesh,
        angle: (i / skillsList.length) * Math.PI * 2,
        radius: 4.6,
        speed: 0.25,
        yBase: i % 2 === 0 ? 0.6 : -0.6,
      });
    });

    // 7. Rotating Holographic Gyroscope Orbit Rings
    const holoRings: THREE.Mesh[] = [];
    const holoRingColors = [0x00e5ff, 0x0284c7, 0x38bdf8];
    for (let r = 0; r < 3; r++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.1 + r * 0.75, 0.03, 8, 64),
        new THREE.MeshBasicMaterial({
          color: holoRingColors[r],
          transparent: true,
          opacity: 0.45 - r * 0.1,
          wireframe: true,
        })
      );
      ring.position.set(0, 0, 0);
      ring.rotation.x = (r * Math.PI) / 3;
      ring.rotation.y = (r * Math.PI) / 4;
      assistantGroup.add(ring);
      holoRings.push(ring);
    }

    // ========================================================
    // 8. LOAD & RIG MASCULINE ROBOT WITH HOLLYWOOD TACTICAL SUIT
    // ========================================================
    let mixer: THREE.AnimationMixer | null = null;
    let robotModel: THREE.Group | null = null;
    let headBone: THREE.Object3D | null = null;
    let rightArmBone: THREE.Object3D | null = null;
    let rightForeArmBone: THREE.Object3D | null = null;
    let rightHandBone: THREE.Object3D | null = null;
    let leftArmBone: THREE.Object3D | null = null;
    let leftForeArmBone: THREE.Object3D | null = null;
    let leftHandBone: THREE.Object3D | null = null;
    let spineBone: THREE.Object3D | null = null;
    let leftShoulderBone: THREE.Object3D | null = null;
    let rightShoulderBone: THREE.Object3D | null = null;

    // Head, Eyes, AR Visor & Articulated Lip-Sync Jaw
    let leftEyeMesh: THREE.Mesh | null = null;
    let rightEyeMesh: THREE.Mesh | null = null;
    let eyeLight: THREE.PointLight | null = null;
    let jawBaffleMesh: THREE.Mesh | null = null;
    let speechEmitterMesh: THREE.Mesh | null = null;
    let arVisorMesh: THREE.Mesh | null = null;

    // Chest Rig & Kinetic Heart Core
    let arcReactorCore: THREE.Mesh | null = null;
    let arcReactorLight: THREE.PointLight | null = null;

    const jointMaterials: THREE.MeshStandardMaterial[] = [];
    const suitMaterials: THREE.MeshStandardMaterial[] = [];

    const actions: { [key: string]: THREE.AnimationAction } = {};
    let activeActionName = 'idle';

    const loader = new GLTFLoader();
    loader.load(
      '/models/robot.glb',
      (gltf) => {
        const model = gltf.scene;
        robotModel = model;

        const baseScale = isMobile ? 1.65 : isTablet ? 1.95 : 2.65;
        model.scale.set(baseScale, baseScale, baseScale);
        model.position.set(0, -3.1, 0);

        // Customize materials for Hollywood Live-Action Sci-Fi Costume:
        // Fitted black tactical ballistic suit + brushed dark titanium armor
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach((m: THREE.MeshStandardMaterial) => {
                if (m) {
                  const matName = (m.name || '').toLowerCase();
                  if (matName.includes('joint') || child.name.toLowerCase().includes('joint')) {
                    // Internal Tungsten / Carbon Mechanics
                    m.color = new THREE.Color(0x06090e);
                    m.roughness = 0.18;
                    m.metalness = 0.96;
                    m.emissive = new THREE.Color(0x00d4ff);
                    m.emissiveIntensity = 0.25;
                    jointMaterials.push(m);
                  } else {
                    // Premium Futuristic Black Cinematic Ballistic Suit with Carbon-Fibre Weave
                    m.color = new THREE.Color(0x0a0e17);
                    m.roughness = 0.72;
                    m.metalness = 0.20;
                    if (kevlarBumpMap) {
                      m.bumpMap = kevlarBumpMap;
                      m.bumpScale = 0.04;
                    }
                    m.emissive = new THREE.Color(0x0284c7);
                    m.emissiveIntensity = 0.06;
                    suitMaterials.push(m);
                  }
                }
              });
            }
          }

          // Locate Bones for presentation gestures, eye illumination & tracking
          if (child.name) {
            if (child.name.includes('Head') && !child.name.includes('End')) {
              headBone = child;
            }
            if (child.name.includes('RightArm') || child.name.includes('RightUpperArm')) {
              rightArmBone = child;
            }
            if (child.name.includes('RightForeArm')) {
              rightForeArmBone = child;
            }
            if (child.name.includes('RightHand')) {
              rightHandBone = child;
            }
            if (child.name.includes('LeftArm') || child.name.includes('LeftUpperArm')) {
              leftArmBone = child;
            }
            if (child.name.includes('LeftForeArm')) {
              leftForeArmBone = child;
            }
            if (child.name.includes('LeftHand')) {
              leftHandBone = child;
            }
            if (child.name.includes('Spine2') || child.name.includes('Spine')) {
              spineBone = child;
            }
            if (child.name.includes('LeftShoulder')) {
              leftShoulderBone = child;
            }
            if (child.name.includes('RightShoulder')) {
              rightShoulderBone = child;
            }
          }
        });

        // Broaden masculine shoulders for commanding body structure
        if (leftShoulderBone) {
          leftShoulderBone.position.x -= 0.12;
        }
        if (rightShoulderBone) {
          rightShoulderBone.position.x += 0.12;
        }

        // ========================================================
        // 9. ATTACH HOLLYWOOD TACTICAL ARMOR & LIP-SYNC MECHANICS
        // ========================================================

        // Shared brushed titanium / gunmetal metallic armor material
        const metallicArmorMat = new THREE.MeshStandardMaterial({
          color: 0x1a2332,
          roughness: 0.22,
          metalness: 0.95,
          bumpMap: titaniumBumpMap || undefined,
          bumpScale: 0.025,
          envMapIntensity: 2.3,
        });

        // Carbon-fibre composite under-plates
        const carbonPlateMat = new THREE.MeshStandardMaterial({
          color: 0x080c14,
          roughness: 0.35,
          metalness: 0.85,
          bumpMap: kevlarBumpMap || undefined,
          bumpScale: 0.03,
          envMapIntensity: 1.8,
        });

        const cyanConduitMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });

        // 1. Broad Masculine Shoulder Pauldrons (Brushed Gunmetal / Titanium with Cyan Illuminated Seams)
        const pauldronGeo = new THREE.BoxGeometry(4.4, 1.7, 3.5);
        if (leftArmBone) {
          const leftPauldron = new THREE.Mesh(pauldronGeo, metallicArmorMat);
          leftPauldron.position.set(0.65, 3.2, 0);
          leftPauldron.rotation.z = -0.25;
          const leftGlowStrip = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.16, 0.2), cyanConduitMat);
          leftGlowStrip.position.set(0.65, 3.2, 1.75);
          leftArmBone.add(leftPauldron);
          leftArmBone.add(leftGlowStrip);
        }
        if (rightArmBone) {
          const rightPauldron = new THREE.Mesh(pauldronGeo, metallicArmorMat);
          rightPauldron.position.set(-0.65, 3.2, 0);
          rightPauldron.rotation.z = 0.25;
          const rightGlowStrip = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.16, 0.2), cyanConduitMat);
          rightGlowStrip.position.set(-0.65, 3.2, 1.75);
          rightArmBone.add(rightPauldron);
          rightArmBone.add(rightGlowStrip);
        }

        // 2. Chiseled Masculine Head, Futuristic Glowing AR Visor, Expressive Blue Eyes & Lip-Sync Jaw
        if (headBone) {
          const headGroup = new THREE.Group();
          headBone.add(headGroup);

          // Masculine cheek & temple ballistic armor plates (Carbon-fibre composite)
          const cheekGeo = new THREE.BoxGeometry(1.6, 4.0, 3.5);
          const leftCheek = new THREE.Mesh(cheekGeo, carbonPlateMat);
          leftCheek.position.set(-3.8, 9.6, 4.5);
          leftCheek.rotation.y = -0.3;
          headGroup.add(leftCheek);

          const rightCheek = new THREE.Mesh(cheekGeo, carbonPlateMat);
          rightCheek.position.set(3.8, 9.6, 4.5);
          rightCheek.rotation.y = 0.3;
          headGroup.add(rightCheek);

          // ----------------------------------------------------
          // GLOWING FUTURISTIC AR VISOR INTEGRATED NATURALLY INTO HEAD
          // ----------------------------------------------------
          // 1. Curved Aerodynamic AR Visor Glass Shield
          const visorShieldGeo = new THREE.CylinderGeometry(
            4.3, 4.3, 1.7, 32, 1, true,
            -Math.PI * 0.40, Math.PI * 0.80
          );
          const arVisorMat = new THREE.MeshPhysicalMaterial({
            color: 0x00d4ff,
            emissive: new THREE.Color(0x0088cc),
            emissiveIntensity: 0.95,
            transparent: true,
            opacity: 0.82,
            roughness: 0.05,
            metalness: 0.25,
            transmission: 0.65,
            ior: 1.52,
          });
          arVisorMesh = new THREE.Mesh(visorShieldGeo, arVisorMat);
          arVisorMesh.rotation.y = Math.PI;
          arVisorMesh.position.set(0, 11.4, 4.8);
          headGroup.add(arVisorMesh);

          // 2. Sleek Titanium AR Visor Brow Ridge & Lateral Mounts
          const visorBrowGeo = new THREE.BoxGeometry(7.2, 0.45, 1.6);
          const visorBrow = new THREE.Mesh(visorBrowGeo, metallicArmorMat);
          visorBrow.position.set(0, 12.35, 7.6);
          visorBrow.rotation.x = 0.08;
          headGroup.add(visorBrow);

          // AR Visor Top Cyan Illuminator Line
          const visorGlowStrip = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.12, 0.2), cyanConduitMat);
          visorGlowStrip.position.set(0, 12.45, 8.4);
          headGroup.add(visorGlowStrip);

          // ----------------------------------------------------
          // EXPRESSIVE BLUE ILLUMINATED EYES (Receptive optical lenses)
          // ----------------------------------------------------
          const lensGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.4, 24);
          const lensBezelGeo = new THREE.TorusGeometry(0.95, 0.18, 12, 32);
          const eyeLensMat = new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            emissive: new THREE.Color(0x00e5ff),
            emissiveIntensity: 2.8,
            roughness: 0.12,
            metalness: 0.5,
          });
          const bezelMat = new THREE.MeshStandardMaterial({ color: 0x05080c, metalness: 0.98, roughness: 0.15 });

          // Left Optic Eye
          const leftEyeGroup = new THREE.Group();
          const leftLens = new THREE.Mesh(lensGeo, eyeLensMat);
          leftLens.rotation.x = Math.PI / 2;
          const leftBezel = new THREE.Mesh(lensBezelGeo, bezelMat);
          leftEyeGroup.add(leftLens);
          leftEyeGroup.add(leftBezel);
          leftEyeGroup.position.set(-2.4, 11.4, 7.8);
          leftEyeGroup.rotation.y = -0.12;
          headGroup.add(leftEyeGroup);
          leftEyeMesh = leftLens;

          // Right Optic Eye
          const rightEyeGroup = new THREE.Group();
          const rightLens = new THREE.Mesh(lensGeo, eyeLensMat);
          rightLens.rotation.x = Math.PI / 2;
          const rightBezel = new THREE.Mesh(lensBezelGeo, bezelMat);
          rightEyeGroup.add(rightLens);
          rightEyeGroup.add(rightBezel);
          rightEyeGroup.position.set(2.4, 11.4, 7.8);
          rightEyeGroup.rotation.y = 0.12;
          headGroup.add(rightEyeGroup);
          rightEyeMesh = rightLens;

          // Articulated Mandibular Jaw Baffle Plate for Real-Time Lip-Sync
          const jawGeo = new THREE.BoxGeometry(2.8, 0.9, 1.4);
          jawBaffleMesh = new THREE.Mesh(jawGeo, metallicArmorMat);
          jawBaffleMesh.position.set(0, 8.2, 7.6);
          headGroup.add(jawBaffleMesh);

          // Internal Acoustic Speech Resonance Emitter
          const emitterGeo = new THREE.BoxGeometry(1.8, 0.4, 0.6);
          const emitterMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.88 });
          speechEmitterMesh = new THREE.Mesh(emitterGeo, emitterMat);
          speechEmitterMesh.position.set(0, 8.4, 7.4);
          headGroup.add(speechEmitterMesh);

          // Expressive Eye & Face Ambient Fill Light (Electric Blue / Cyan)
          eyeLight = new THREE.PointLight(0x00e5ff, 2.8, 12);
          eyeLight.position.set(0, 11.5, 10.5);
          headGroup.add(eyeLight);
        }

        // 3. Tactical Ballistic Chest Rig & Kinetic Heart Core on Spine2
        if (spineBone) {
          const chestGroup = new THREE.Group();
          spineBone.add(chestGroup);

          // Symmetrical Angular Pectoral Armor Plates (Brushed Gunmetal / Titanium)
          const pecGeo = new THREE.BoxGeometry(4.2, 3.4, 1.2);
          const leftPec = new THREE.Mesh(pecGeo, metallicArmorMat);
          leftPec.position.set(-2.6, 9.8, 9.2);
          leftPec.rotation.y = -0.22;
          leftPec.rotation.z = -0.08;
          chestGroup.add(leftPec);

          const rightPec = new THREE.Mesh(pecGeo, metallicArmorMat);
          rightPec.position.set(2.6, 9.8, 9.2);
          rightPec.rotation.y = 0.22;
          rightPec.rotation.z = 0.08;
          chestGroup.add(rightPec);

          // Subtle Blue/Cyan Illuminated Accent Lines along Chest
          const leftAccent = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.6, 0.25), cyanConduitMat);
          leftAccent.position.set(-1.8, 10.2, 9.9);
          leftAccent.rotation.z = 0.65;
          chestGroup.add(leftAccent);

          const rightAccent = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.6, 0.25), cyanConduitMat);
          rightAccent.position.set(1.8, 10.2, 9.9);
          rightAccent.rotation.z = -0.65;
          chestGroup.add(rightAccent);

          // Kinetic Heart Core (Low-profile recessed military reactor)
          const coreBezelGeo = new THREE.TorusGeometry(1.8, 0.22, 16, 48);
          const coreBezelMat = new THREE.MeshStandardMaterial({
            color: 0x05080c,
            metalness: 0.98,
            roughness: 0.15,
          });
          const coreBezel = new THREE.Mesh(coreBezelGeo, coreBezelMat);
          coreBezel.position.set(0, 8.0, 9.6);
          coreBezel.rotation.x = 0.1;
          chestGroup.add(coreBezel);

          const coreLensGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
          const coreLensMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            emissive: new THREE.Color(0x00d4ff),
            emissiveIntensity: 2.2,
            roughness: 0.12,
            metalness: 0.4,
          });
          arcReactorCore = new THREE.Mesh(coreLensGeo, coreLensMat);
          arcReactorCore.rotation.x = Math.PI / 2 + 0.1;
          arcReactorCore.position.set(0, 8.0, 9.6);
          chestGroup.add(arcReactorCore);

          arcReactorLight = new THREE.PointLight(0x00d4ff, 3.0, 9.0);
          arcReactorLight.position.set(0, 8.0, 11.0);
          chestGroup.add(arcReactorLight);

          // Subtle Cyan Tech Conduits along Sternum
          const conduitGeo = new THREE.BoxGeometry(0.18, 4.2, 0.2);
          const leftConduit = new THREE.Mesh(conduitGeo, cyanConduitMat);
          leftConduit.position.set(-0.8, 9.8, 9.8);
          chestGroup.add(leftConduit);

          const rightConduit = new THREE.Mesh(conduitGeo, cyanConduitMat);
          rightConduit.position.set(0.8, 9.8, 9.8);
          chestGroup.add(rightConduit);
        }

        // 4. Reinforced Tactical Gloves & Knuckle Armor on Hands (Articulated mechanics)
        const knuckleGeo = new THREE.BoxGeometry(2.2, 0.5, 0.8);
        if (rightHandBone) {
          const rKnuckle = new THREE.Mesh(knuckleGeo, metallicArmorMat);
          rKnuckle.position.set(0, 1.2, 0.4);
          rightHandBone.add(rKnuckle);
          const rPlate = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.5), cyanConduitMat);
          rPlate.position.set(0, 1.2, 0.85);
          rightHandBone.add(rPlate);
        }
        if (leftHandBone) {
          const lKnuckle = new THREE.Mesh(knuckleGeo, metallicArmorMat);
          lKnuckle.position.set(0, 1.2, 0.4);
          leftHandBone.add(lKnuckle);
          const lPlate = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.5), cyanConduitMat);
          lPlate.position.set(0, 1.2, 0.85);
          leftHandBone.add(lPlate);
        }

        // Setup Skeletal Animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            actions[clip.name] = action;
          });

          if (actions['idle']) {
            actions['idle'].play();
            activeActionName = 'idle';
          }
        }

        assistantGroup.add(model);
      },
      undefined,
      (err) => console.warn('Professional robot assistant load error:', err)
    );

    // 10. Responsive Guide Waypoint Spline - Centered Stance (Prominently in Exact Centre)
    const getResponsiveWaypoints = () => {
      const yMobile = isMobile ? 0.8 : 0.0;
      const zBase = isMobile ? 1.0 : 2.0;

      return [
        new THREE.Vector3(0.0, 0.2 + yMobile, zBase),
        new THREE.Vector3(0.0, -0.1 + yMobile, zBase),
        new THREE.Vector3(0.0, -0.3 + yMobile, zBase + 0.2),
        new THREE.Vector3(0.0, -0.2 + yMobile, zBase),
        new THREE.Vector3(0.0, -0.4 + yMobile, zBase + 0.2),
        new THREE.Vector3(0.0, -0.3 + yMobile, zBase),
        new THREE.Vector3(0.0, -0.2 + yMobile, zBase),
        new THREE.Vector3(0.0, -0.1 + yMobile, zBase + 0.4),
      ];
    };

    let guideCurve = new THREE.CatmullRomCurve3(getResponsiveWaypoints(), false, 'catmullrom', 0.4);

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    const handleResize = () => {
      screenCategory = getScreenCategory();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.fov = window.innerWidth < 768 ? 48 : 42;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 1.8));

      guideCurve = new THREE.CatmullRomCurve3(getResponsiveWaypoints(), false, 'catmullrom', 0.4);

      hudPanel1.material.opacity = window.innerWidth < 768 ? 0 : 0.88;
      hudPanel2.material.opacity = window.innerWidth < 768 ? 0 : 0.88;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // ========================================================
    // 11. MASTER ANIMATION & CINEMATIC CAMERA DIRECTOR LOOP
    // ========================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Mouse Lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const p = THREE.MathUtils.clamp(scrollRef.current, 0, 1);
      const targetPos = guideCurve.getPoint(p);
      const bobbing = Math.sin(elapsedTime * 1.8) * 0.12;

      const introActive = gestureStateRef.current.introActive && p < 0.05;

      // Position Robot: Prominently in the EXACT CENTRE (x = 0.0) without cropping or side drift
      if (introActive) {
        assistantGroup.position.x = THREE.MathUtils.lerp(assistantGroup.position.x, 0.0, 0.06);
        assistantGroup.position.y = THREE.MathUtils.lerp(assistantGroup.position.y, 0.15 + bobbing, 0.06);
        assistantGroup.position.z = THREE.MathUtils.lerp(assistantGroup.position.z, 2.2, 0.06);
      } else {
        assistantGroup.position.x = THREE.MathUtils.lerp(assistantGroup.position.x, 0.0, 0.06);
        assistantGroup.position.y = THREE.MathUtils.lerp(assistantGroup.position.y, targetPos.y + bobbing, 0.06);
        assistantGroup.position.z = THREE.MathUtils.lerp(assistantGroup.position.z, targetPos.z, 0.06);
      }

      // Assistant turns to face user / center
      const lookTarget = new THREE.Vector3(0, assistantGroup.position.y, assistantGroup.position.z + 12);
      assistantGroup.lookAt(lookTarget);

      // ========================================================
      // 12. MULTI-SHOT HOLLYWOOD CINEMATIC CAMERA SEQUENCING
      // ========================================================
      const { shot, shotStartTime, shotDuration } = cinematicDirectorRef.current;
      const now = performance.now();
      const shotProgress = shotDuration > 0 ? Math.min(1.0, (now - shotStartTime) / shotDuration) : 0;

      if (introActive && !isReducedMotion) {
        if (shot === 'silhouette') {
          // SHOT 1: Low-angle silhouette reveal with cold blue dramatic rim backlights
          const easeP = THREE.MathUtils.smoothstep(shotProgress, 0, 1);
          camera.position.x = 0;
          camera.position.y = THREE.MathUtils.lerp(-1.4, -0.6, easeP);
          camera.position.z = THREE.MathUtils.lerp(17.0, 12.5, easeP);
          camera.lookAt(0, 0.5, 0);

          rimBackLeft.intensity = easeP * 7.5;
          rimBackRight.intensity = easeP * 7.5;
          keyLight.intensity = 1.0 + easeP * 1.5;
          studioSpotlight.intensity = easeP * 2.5;
        } else if (shot === 'armor_pan') {
          // SHOT 2: Tactical Chest Armor & Articulated Hands Macro Pan (Centered Hollywood Framing)
          const easeP = THREE.MathUtils.smoothstep(shotProgress, 0, 1);
          camera.position.x = THREE.MathUtils.lerp(0.6, 0.2, easeP);
          camera.position.y = THREE.MathUtils.lerp(0.1, 0.4, easeP);
          camera.position.z = THREE.MathUtils.lerp(4.8, 4.0, easeP);
          camera.lookAt(0, 0.25, 0);

          keyLight.intensity = 4.2;
          studioSpotlight.intensity = 4.0;
        } else if (shot === 'face_reveal') {
          // SHOT 3: Masculine Face, Glowing AR Visor & Expressive Blue Eyes Reveal
          const easeP = THREE.MathUtils.smoothstep(shotProgress, 0, 1);
          camera.position.x = THREE.MathUtils.lerp(-0.25, 0.0, easeP);
          camera.position.y = THREE.MathUtils.lerp(1.45, 1.35, easeP);
          camera.position.z = THREE.MathUtils.lerp(3.4, 2.9, easeP);
          camera.lookAt(0, 1.25, 0);
        } else if (shot === 'master_speech') {
          // SHOT 4: Master Medium Portrait Shot (Balanced Hollywood Center Framing)
          const targetZ = isMobile ? 8.6 : isTablet ? 7.6 : 6.8;
          const targetY = isMobile ? 0.55 : 0.35;
          const orbitX = mouseRef.current.x * 0.45;
          const orbitY = mouseRef.current.y * 0.25;

          camera.position.x = THREE.MathUtils.lerp(camera.position.x, orbitX, 0.05);
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + orbitY, 0.05);
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
          camera.lookAt(0, targetY, 0);

          rimBackLeft.intensity = 5.5;
          rimBackRight.intensity = 5.5;
          keyLight.intensity = 4.8;
          studioSpotlight.intensity = 5.0;
        } else if (shot === 'transition') {
          // SHOT 5: Pull-back camera transition
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, 14.0, 0.04);
          camera.lookAt(0, 0.35, 0);
        }
      } else if (!isReducedMotion) {
        // Standard exploration camera parallax - always centered on robot
        const orbitX = p < 0.05 ? Math.sin(elapsedTime * 0.35) * 1.2 : 0;
        const orbitY = p < 0.05 ? Math.cos(elapsedTime * 0.25) * 0.4 : 0;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseRef.current.x * 1.2 + orbitX, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseRef.current.y * 0.6 + orbitY, 0.05);
        camera.lookAt(0, assistantGroup.position.y * 0.3, 0);
      }

      // ========================================================
      // 13. REAL-TIME LIP-SYNC & KINEMATIC SPEECH ARTICULATION
      // ========================================================
      const { action, isWaking, wakeProgress } = gestureStateRef.current;
      const vocalLevel = fuzailVoiceManager.getAudioLevel();

      // Dynamic Lip-Sync: Mechanical Mandibular Jaw Baffle + Speech Resonance Emitter
      if (jawBaffleMesh && speechEmitterMesh) {
        if (vocalLevel > 0.02) {
          // Jaw drops and tilts open with spoken syllables
          jawBaffleMesh.position.y = THREE.MathUtils.lerp(jawBaffleMesh.position.y, 8.2 - vocalLevel * 0.45, 0.2);
          jawBaffleMesh.rotation.x = THREE.MathUtils.lerp(jawBaffleMesh.rotation.x, vocalLevel * 0.35, 0.2);

          // Internal acoustic emitter pulses in brightness & scale
          speechEmitterMesh.scale.set(1.0 + vocalLevel * 0.4, 1.0 + vocalLevel * 0.5, 1.0);
          (speechEmitterMesh.material as THREE.MeshBasicMaterial).opacity = Math.min(1.0, 0.3 + vocalLevel * 0.7);
        } else {
          // Jaw rests flush in closed position
          jawBaffleMesh.position.y = THREE.MathUtils.lerp(jawBaffleMesh.position.y, 8.2, 0.15);
          jawBaffleMesh.rotation.x = THREE.MathUtils.lerp(jawBaffleMesh.rotation.x, 0, 0.15);
          speechEmitterMesh.scale.set(1.0, 1.0, 1.0);
          (speechEmitterMesh.material as THREE.MeshBasicMaterial).opacity = 0.2;
        }
      }

      // Eye & Kinetic Heart Core Illumination
      if (leftEyeMesh && rightEyeMesh && eyeLight) {
        if (isWaking) {
          const eyeScale = Math.min(1.0, wakeProgress * 1.2);
          leftEyeMesh.scale.setScalar(eyeScale);
          rightEyeMesh.scale.setScalar(eyeScale);
          eyeLight.intensity = wakeProgress * 3.2;

          if (arcReactorCore && arcReactorLight) {
            arcReactorCore.scale.setScalar(wakeProgress);
            arcReactorLight.intensity = wakeProgress * 2.8;
          }

          jointMaterials.forEach((m) => {
            m.emissiveIntensity = THREE.MathUtils.lerp(0.05, 0.35, wakeProgress);
          });
          suitMaterials.forEach((m) => {
            m.emissiveIntensity = THREE.MathUtils.lerp(0.02, 0.08, wakeProgress);
          });
        } else if (introActive) {
          // Dynamic Audio-Reactive Pulse when speaking
          const speechPulse = 1.0 + vocalLevel * 0.35 + Math.sin(elapsedTime * 3.5) * 0.05;
          leftEyeMesh.scale.setScalar(speechPulse);
          rightEyeMesh.scale.setScalar(speechPulse);
          eyeLight.intensity = 2.4 + vocalLevel * 2.8;

          if (arVisorMesh) {
            (arVisorMesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity =
              0.85 + vocalLevel * 0.55 + Math.sin(elapsedTime * 2.5) * 0.1;
          }

          if (arcReactorCore && arcReactorLight) {
            const reactorPulse = 1.0 + vocalLevel * 0.25;
            arcReactorCore.scale.setScalar(reactorPulse);
            arcReactorLight.intensity = 2.5 + vocalLevel * 3.5;
          }
        } else {
          leftEyeMesh.scale.setScalar(1.0);
          rightEyeMesh.scale.setScalar(1.0);
          eyeLight.intensity = 2.0;

          if (arVisorMesh) {
            (arVisorMesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.85;
          }

          if (arcReactorCore && arcReactorLight) {
            arcReactorCore.scale.setScalar(1.0);
            arcReactorLight.intensity = 2.2;
          }
        }
      }

      // Skeletal Bone Pose / Kinematic Gestures with Natural Breathing
      if (!isReducedMotion) {
        // Natural subtle breathing cycle through the spine, shoulders & chest
        const breathCycle = Math.sin(elapsedTime * 2.2) * 0.015;
        if (spineBone) {
          spineBone.rotation.x = breathCycle * 0.4;
        }
        if (leftShoulderBone) {
          leftShoulderBone.position.y += breathCycle * 0.15;
        }
        if (rightShoulderBone) {
          rightShoulderBone.position.y += breathCycle * 0.15;
        }

        if (action === 'wake') {
          // Power-on sequence: head lifts up from resting down pose
          if (headBone) {
            headBone.rotation.x = THREE.MathUtils.lerp(-0.4, 0, wakeProgress);
            headBone.rotation.y = THREE.MathUtils.lerp(-0.2, 0, wakeProgress);
          }
        } else if (action === 'clench_hands') {
          // Clench fingers slightly during tactical armor reveal shot
          if (rightHandBone) {
            rightHandBone.rotation.z = THREE.MathUtils.lerp(rightHandBone.rotation.z, 0.35, 0.08);
          }
          if (leftHandBone) {
            leftHandBone.rotation.z = THREE.MathUtils.lerp(leftHandBone.rotation.z, -0.35, 0.08);
          }
        } else if (action === 'face_turn') {
          // Turn head to establish direct eye contact with camera
          if (headBone) {
            headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, 0.1, 0.08);
            headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, 0.0, 0.08);
          }
        } else if (action === 'wave') {
          // Friendly natural articulated greeting wave
          if (robotModel) {
            robotModel.rotation.y = THREE.MathUtils.lerp(robotModel.rotation.y, 0, 0.08);
          }
          if (rightArmBone) {
            rightArmBone.rotation.z = THREE.MathUtils.lerp(rightArmBone.rotation.z, -1.75, 0.1);
            rightArmBone.rotation.x = THREE.MathUtils.lerp(rightArmBone.rotation.x, 0.35, 0.1);
          }
          if (rightForeArmBone) {
            rightForeArmBone.rotation.z = THREE.MathUtils.lerp(rightForeArmBone.rotation.z, -0.75, 0.1);
          }
          if (rightHandBone) {
            rightHandBone.rotation.z = Math.sin(elapsedTime * 5.5) * 0.28;
          }
          if (headBone) {
            const speechNod = vocalLevel * 0.15 + Math.sin(elapsedTime * 3.0) * 0.03;
            headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, speechNod, 0.08);
            headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, mouseRef.current.x * 0.2, 0.08);
          }
        } else if (action === 'gesture_projects' || action === 'gesture_portfolio') {
          // Open welcoming presentation gesture towards projects & viewer
          if (robotModel) {
            robotModel.rotation.y = THREE.MathUtils.lerp(robotModel.rotation.y, 0.12, 0.08);
          }
          if (headBone) {
            const speechNod = vocalLevel * 0.14;
            headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, 0.12 + mouseRef.current.x * 0.18, 0.08);
            headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -0.04 + speechNod, 0.08);
          }
          if (rightArmBone) {
            rightArmBone.rotation.z = THREE.MathUtils.lerp(rightArmBone.rotation.z, -0.9, 0.08);
            rightArmBone.rotation.x = THREE.MathUtils.lerp(rightArmBone.rotation.x, 0.55, 0.08);
          }
          if (rightForeArmBone) {
            rightForeArmBone.rotation.z = THREE.MathUtils.lerp(rightForeArmBone.rotation.z, -0.45, 0.08);
          }
          if (leftArmBone) {
            leftArmBone.rotation.z = THREE.MathUtils.lerp(leftArmBone.rotation.z, 0.55, 0.08);
          }
          if (leftForeArmBone) {
            leftForeArmBone.rotation.z = THREE.MathUtils.lerp(leftForeArmBone.rotation.z, 0.35, 0.08);
          }
        } else if (action === 'gesture_skills' || action === 'gesture_tech') {
          // Robot points towards technical telemetry & orbiting skills
          if (robotModel) {
            robotModel.rotation.y = THREE.MathUtils.lerp(robotModel.rotation.y, -0.18, 0.08);
          }
          if (headBone) {
            const speechNod = vocalLevel * 0.14;
            headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, -0.18 + mouseRef.current.x * 0.18, 0.08);
            headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, 0.04 + speechNod, 0.08);
          }
          if (rightArmBone) {
            rightArmBone.rotation.z = THREE.MathUtils.lerp(rightArmBone.rotation.z, -0.8, 0.08);
            rightArmBone.rotation.x = THREE.MathUtils.lerp(rightArmBone.rotation.x, 0.85, 0.08);
          }
          if (rightForeArmBone) {
            rightForeArmBone.rotation.x = THREE.MathUtils.lerp(rightForeArmBone.rotation.x, 0.35, 0.08);
          }
        } else if (action === 'agree') {
          // Warm affirmative nod and open welcoming pose: "Let's build something amazing together!"
          if (robotModel) {
            robotModel.rotation.y = THREE.MathUtils.lerp(robotModel.rotation.y, 0, 0.08);
          }
          if (headBone) {
            const nod = Math.sin(elapsedTime * 4.5) * 0.09 + vocalLevel * 0.14;
            headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, nod, 0.1);
            headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, 0, 0.08);
          }
          if (rightArmBone) {
            rightArmBone.rotation.z = THREE.MathUtils.lerp(rightArmBone.rotation.z, -0.65, 0.08);
            rightArmBone.rotation.x = THREE.MathUtils.lerp(rightArmBone.rotation.x, 0.35, 0.08);
          }
          if (leftArmBone) {
            leftArmBone.rotation.z = THREE.MathUtils.lerp(leftArmBone.rotation.z, 0.65, 0.08);
            leftArmBone.rotation.x = THREE.MathUtils.lerp(leftArmBone.rotation.x, 0.35, 0.08);
          }
          if (leftForeArmBone) {
            leftForeArmBone.rotation.z = THREE.MathUtils.lerp(leftForeArmBone.rotation.z, 0.45, 0.08);
          }
        } else {
          // Conversational talk & idle tracking with Real-time Voice Audio Reactivity
          if (robotModel) {
            robotModel.rotation.y = THREE.MathUtils.lerp(robotModel.rotation.y, 0, 0.06);
          }
          if (headBone) {
            const speechNod = introActive ? (Math.sin(elapsedTime * 3.5) * 0.04 + vocalLevel * 0.14) : 0;
            const microTilt = vocalLevel > 0.05 ? Math.sin(elapsedTime * 6) * 0.025 : 0;
            headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, mouseRef.current.x * 0.3 + microTilt, 0.08);
            headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -mouseRef.current.y * 0.2 + speechNod, 0.08);
          }
          if (rightArmBone && introActive) {
            const vocalLift = vocalLevel * 0.18;
            rightArmBone.rotation.z = THREE.MathUtils.lerp(rightArmBone.rotation.z, -0.4 + Math.sin(elapsedTime * 2) * 0.08 - vocalLift, 0.08);
          }
        }
      }

      // Animation Action Blending
      if (mixer) {
        let desired = 'idle';
        if (action === 'agree' && actions['agree']) {
          desired = 'agree';
        }

        if (desired !== activeActionName && actions[desired]) {
          const prev = actions[activeActionName];
          const next = actions[desired];
          if (next) {
            next.reset().fadeIn(0.3).play();
            if (prev) prev.fadeOut(0.3);
            activeActionName = desired;
          }
        }
        mixer.update(delta);
      }

      // Rotate Holographic Gyroscope Orbit Rings
      holoRings.forEach((ring, idx) => {
        ring.rotation.z = elapsedTime * (0.2 + idx * 0.1);
        ring.rotation.x = Math.sin(elapsedTime * 0.4 + idx) * 0.45 + (idx * Math.PI) / 3;
      });

      // Energy Ring Pulse
      const pulse = 1 + Math.sin(elapsedTime * 3.5) * 0.06;
      energyRing.scale.set(pulse, pulse, 1);

      // Orbit Floating Skill Pods
      skillPods.forEach((sp) => {
        const a = sp.angle + elapsedTime * sp.speed;
        sp.mesh.position.set(
          Math.cos(a) * sp.radius,
          sp.yBase + Math.sin(elapsedTime * 1.5 + sp.angle) * 0.15,
          Math.sin(a) * sp.radius
        );
        sp.mesh.lookAt(camera.position);
      });

      // Holographic HUD floating breathing
      hudPanel1.position.y = 1.2 + Math.sin(elapsedTime * 1.5) * 0.08;
      hudPanel2.position.y = 1.2 + Math.cos(elapsedTime * 1.5) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (mixer) {
        mixer.stopAllAction();
      }

      floorGeo.dispose();
      floorMat.dispose();
      stageRing1.geometry.dispose();
      (stageRing1.material as THREE.Material).dispose();
      stageRing2.geometry.dispose();
      (stageRing2.material as THREE.Material).dispose();
      diskGeo.dispose();
      diskMat.dispose();
      energyRing.geometry.dispose();
      (energyRing.material as THREE.Material).dispose();
      hudPanel1.geometry.dispose();
      (hudPanel1.material as THREE.Material).dispose();
      hudTex1.dispose();
      hudPanel2.geometry.dispose();
      (hudPanel2.material as THREE.Material).dispose();
      hudTex2.dispose();
      holoRings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isReducedMotion]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mountRef}
        className="webgl-container pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />

      <RobotIntroOverlay
        isActive={isIntroActive && scrollProgress < 0.05}
        isWakingUp={isWakingUp}
        currentSegment={currentSegment}
        currentIndex={currentIndex}
        totalSegments={ROBOT_INTRO_SCRIPT.length}
        onSkip={handleEnterPortfolio}
        onEnterPortfolio={handleEnterPortfolio}
        onReplay={handleReplay}
        onStartExperience={handleStartExperience}
        hasStartedExperience={hasStartedExperience}
      />
    </div>
  );
};
