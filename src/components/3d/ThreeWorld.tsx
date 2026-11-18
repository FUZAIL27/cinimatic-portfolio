import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { fuzailVoiceManager } from '../../utils/fuzailVoiceManager';

interface ThreeWorldProps {
  scrollProgress: number; // 0 to 1
  isReducedMotion?: boolean;
  introActive?: boolean;
  onIntroTimeUpdate?: (elapsed: number, duration: number) => void;
  onIntroComplete?: () => void;
}

export const ThreeWorld: React.FC<ThreeWorldProps> = ({
  scrollProgress,
  isReducedMotion = false,
  introActive = true,
  onIntroTimeUpdate,
  onIntroComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(scrollProgress);
  const introActiveRef = useRef(introActive);
  const onIntroTimeUpdateRef = useRef(onIntroTimeUpdate);
  const onIntroCompleteRef = useRef(onIntroComplete);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    introActiveRef.current = introActive;
  }, [introActive]);

  useEffect(() => {
    onIntroTimeUpdateRef.current = onIntroTimeUpdate;
  }, [onIntroTimeUpdate]);

  useEffect(() => {
    onIntroCompleteRef.current = onIntroComplete;
  }, [onIntroComplete]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 700 : 1800;

    // Scene & Twilight Sunset Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070d1c, 0.014);

    const camera = new THREE.PerspectiveCamera(isMobile ? 50 : 42, window.innerWidth / window.innerHeight, 0.1, 260);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // ==========================================
    // 1. VIBRANT CINEMATIC SUNSET LIGHTING SYSTEM
    // Golden Hour Sunset Sun + Twilight Cyan & Electric Blue Rim
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x0e172a, 2.2);
    scene.add(ambientLight);

    // Warm Golden-Hour Sunset Key Light streaming down skyscraper canyon
    const sunsetKeyLight = new THREE.DirectionalLight(0xff9a3c, 3.2);
    sunsetKeyLight.position.set(16, 14, 12);
    scene.add(sunsetKeyLight);

    // Electric Blue High-Altitude Key Light (Opposite rim)
    const blueKeyLight = new THREE.PointLight(0x168bff, 5.8, 65);
    blueKeyLight.position.set(-14, 10, 14);
    scene.add(blueKeyLight);

    // Purple / Magenta Fill Light (Right canyon wall bounce)
    const purpleFillLight = new THREE.PointLight(0x8b5cf6, 4.8, 60);
    purpleFillLight.position.set(12, -4, 12);
    scene.add(purpleFillLight);

    // Cyan Horizon Rim Light
    const cyanRimLight = new THREE.PointLight(0x00e5ff, 4.8, 55);
    cyanRimLight.position.set(0, -50, -25);
    scene.add(cyanRimLight);

    // Warm Amber Street-Level Sunset Glow
    const streetSunsetGlow = new THREE.DirectionalLight(0xff7722, 1.5);
    streetSunsetGlow.position.set(-5, -1, 1);
    scene.add(streetSunsetGlow);

    // Dynamic Crimson Hero Rim Light (Brings out iconic superhero red suit definition)
    const crimsonHeroLight = new THREE.PointLight(0xef4444, 4.5, 32);
    crimsonHeroLight.position.set(-2, 8, 14);
    scene.add(crimsonHeroLight);

    // Dynamic Hero follow spotlight
    const heroSpotlight = new THREE.PointLight(0x00e5ff, 4.5, 26);
    scene.add(heroSpotlight);

    // ==========================================
    // 2. VIBRANT MULTI-COLOR NEBULA / PARTICLES
    // ==========================================
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const vibrantPalette = [
      new THREE.Color(0x168bff), // Electric Blue
      new THREE.Color(0x00e5ff), // Cyan
      new THREE.Color(0x8b5cf6), // Purple
      new THREE.Color(0xec4899), // Magenta
      new THREE.Color(0xff4fa3), // Pink
      new THREE.Color(0xff9d42), // Orange
      new THREE.Color(0xffffff), // White
    ];

    for (let i = 0; i < particleCount; i++) {
      const pIdx = i * 3;
      particlePos[pIdx] = (Math.random() - 0.5) * 75;
      particlePos[pIdx + 1] = (Math.random() - 0.5) * 190 - (i / particleCount) * 55;
      particlePos[pIdx + 2] = (Math.random() - 0.5) * 75 - (i / particleCount) * 95;

      const col = vibrantPalette[Math.floor(Math.random() * vibrantPalette.length)];
      particleColors[pIdx] = col.r;
      particleColors[pIdx + 1] = col.g;
      particleColors[pIdx + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle sprite using canvas
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.35, 'rgba(0,229,255,0.8)');
      grad.addColorStop(0.7, 'rgba(139,92,246,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.38 : 0.55,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(particleGeo, particleMat);
    scene.add(starField);

    // ==========================================
    // 3. CINEMATIC CITY WITH REALISTIC HIGH-DENSITY WINDOWS
    // ==========================================
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // High-resolution procedural window facade canvas
    const winCanvas = document.createElement('canvas');
    winCanvas.width = 512;
    winCanvas.height = 512;
    const winCtx = winCanvas.getContext('2d');
    if (winCtx) {
      winCtx.fillStyle = '#060b16';
      winCtx.fillRect(0, 0, 512, 512);

      const rows = 32;
      const cols = 16;
      const cellW = 512 / cols;
      const cellH = 512 / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.35) {
            // Elegant micro-window illumination palette
            const colors = [
              '#ff9d42', // Warm amber office
              '#fbbf24', // Golden yellow
              '#00e5ff', // Cyan tech floor
              '#168bff', // Electric blue
              '#8b5cf6', // Purple executive
              '#f8fafc', // Clean white
            ];
            winCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            winCtx.fillRect(c * cellW + 4, r * cellH + 3, cellW - 8, cellH - 6);
          } else {
            winCtx.fillStyle = '#0a1020';
            winCtx.fillRect(c * cellW + 4, r * cellH + 3, cellW - 8, cellH - 6);
          }
        }
      }
    }
    const windowTexture = new THREE.CanvasTexture(winCanvas);
    windowTexture.wrapS = THREE.RepeatWrapping;
    windowTexture.wrapT = THREE.RepeatWrapping;

    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x070c1a,
      roughness: 0.3,
      metalness: 0.85,
      emissiveMap: windowTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.75,
    });

    const buildingEdgeMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.45,
    });

    // 8 Designated Skyscraper Web Anchor Spires
    const anchorPoints: THREE.Vector3[] = [
      new THREE.Vector3(-10.5, 16, 10),   // 0: Hero high spire (Left)
      new THREE.Vector3(10.5, -2, 4),     // 1: Hero-to-About tower (Right)
      new THREE.Vector3(-10.0, -22, -14), // 2: About-to-Skills tower (Left)
      new THREE.Vector3(9.5, -46, -30),   // 3: Skills-to-Exp tower (Right)
      new THREE.Vector3(-9.2, -72, -46),  // 4: Exp-to-Projects tower (Left)
      new THREE.Vector3(9.0, -96, -62),   // 5: Projects-to-AI tower (Right)
      new THREE.Vector3(-8.5, -122, -78), // 6: AI-to-Education tower (Left)
      new THREE.Vector3(8.0, -150, -94),  // 7: Education-to-Contact tower (Right)
    ];

    const cityBuildings: { mesh: THREE.Mesh; beacon: THREE.Mesh; originalY: number }[] = [];
    const buildingCounts = isMobile ? 18 : 30;

    for (let i = 0; i < buildingCounts; i++) {
      const isLeft = i % 2 === 0;
      const progressRatio = i / buildingCounts;
      const yCenter = 16 - progressRatio * 185;
      const bHeight = 18 + (i % 5) * 7;
      const bWidth = 4.8 + (i % 3) * 1.5;
      const bDepth = 5.2 + (i % 4) * 1.5;

      const xDist = (isLeft ? -1 : 1) * (10.5 + (i % 4) * 2.5);
      const zDist = 12 - progressRatio * 115 + Math.sin(i * 1.8) * 4;

      const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
      const bMesh = new THREE.Mesh(bGeo, buildingMat);
      bMesh.position.set(xDist, yCenter, zDist);
      cityGroup.add(bMesh);

      // Neon architectural edge outlines
      const edges = new THREE.EdgesGeometry(bGeo);
      const edgeLine = new THREE.LineSegments(edges, buildingEdgeMat);
      bMesh.add(edgeLine);

      // Rooftop antenna with beacon
      const antennaGeo = new THREE.CylinderGeometry(0.05, 0.1, 4.0, 8);
      const antenna = new THREE.Mesh(antennaGeo, buildingMat);
      antenna.position.set(0, bHeight / 2 + 2.0, 0);
      bMesh.add(antenna);

      const beaconColor = i % 2 === 0 ? 0x00e5ff : 0xff4fa3;
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshBasicMaterial({ color: beaconColor })
      );
      beacon.position.set(0, bHeight / 2 + 4.0, 0);
      bMesh.add(beacon);

      cityBuildings.push({ mesh: bMesh, beacon, originalY: yCenter });
    }

    // Glowing target rings around the 8 Web Anchor Spires
    const anchorRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    anchorPoints.forEach((pt) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 8, 28), anchorRingMat);
      ring.position.copy(pt);
      ring.rotation.x = Math.PI / 2;
      cityGroup.add(ring);
    });

    // Starting High Skyscraper Rooftop Perch Ledge & Observation Summit (Expanded for Left Spidey & Right Photo)
    const startRooftopGeo = new THREE.BoxGeometry(16.0, 4.0, 11.0);
    const startRooftop = new THREE.Mesh(startRooftopGeo, buildingMat);
    startRooftop.position.set(0.0, -2.35, 11.5);
    cityGroup.add(startRooftop);
    const startRooftopEdge = new THREE.LineSegments(new THREE.EdgesGeometry(startRooftopGeo), buildingEdgeMat);
    startRooftop.add(startRooftopEdge);

    // Glowing Observation Summit Perimeter Ring
    const terraceRing = new THREE.Mesh(
      new THREE.RingGeometry(5.8, 6.0, 64),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide })
    );
    terraceRing.rotation.x = -Math.PI / 2;
    terraceRing.position.set(0, 2.01, 0);
    startRooftop.add(terraceRing);

    // Final Skyscraper Observation Helipad (Contact Section)
    const endHelipadGeo = new THREE.CylinderGeometry(7.0, 7.8, 2.0, 32);
    const endHelipad = new THREE.Mesh(endHelipadGeo, buildingMat);
    endHelipad.position.set(1.0, -167.0, -106);
    cityGroup.add(endHelipad);
    const helipadRing = new THREE.Mesh(
      new THREE.RingGeometry(4.2, 4.5, 32),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide })
    );
    helipadRing.rotation.x = -Math.PI / 2;
    helipadRing.position.set(0, 1.05, 0);
    endHelipad.add(helipadRing);

    // Atmospheric Searchlight Beams rising into the night sky
    const searchlights: THREE.Mesh[] = [];
    const beamGeo = new THREE.CylinderGeometry(0.1, 3.5, 50, 16, 1, true);
    const beamColors = [0x168bff, 0x8b5cf6, 0x00e5ff, 0xec4899];
    for (let b = 0; b < 4; b++) {
      const beamMat = new THREE.MeshBasicMaterial({
        color: beamColors[b],
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set((b % 2 === 0 ? -1 : 1) * 16, -20 - b * 35, -10 - b * 20);
      beam.rotation.x = Math.PI / 2.3;
      beam.rotation.z = (b - 1.5) * 0.2;
      cityGroup.add(beam);
      searchlights.push(beam);
    }

    // ==========================================
    // 4. AUTHENTIC HIGH-DETAIL 3D SPIDER-MAN HERO
    // (Cinematic PBR Suit, Rigged Skeleton & Animation Mixer)
    // ==========================================
    const heroCharacter = new THREE.Group();
    heroCharacter.renderOrder = 999;
    scene.add(heroCharacter);

    let mixer: THREE.AnimationMixer | null = null;
    let leftHandBone: THREE.Object3D | null = null;
    let rightHandBone: THREE.Object3D | null = null;

    // Right Arm & 10 Right Finger Bones
    let spideyRightClavicle: THREE.Object3D | null = null;
    let spideyRightUpperArm: THREE.Object3D | null = null;
    let spideyRightForearm: THREE.Object3D | null = null;
    let spideyRightHand: THREE.Object3D | null = null;
    let spideyRThumb0: THREE.Object3D | null = null;
    let spideyRThumb1: THREE.Object3D | null = null;
    let spideyRIndex0: THREE.Object3D | null = null;
    let spideyRIndex1: THREE.Object3D | null = null;
    let spideyRMiddle0: THREE.Object3D | null = null;
    let spideyRMiddle1: THREE.Object3D | null = null;
    let spideyRRing0: THREE.Object3D | null = null;
    let spideyRRing1: THREE.Object3D | null = null;
    let spideyRPinky0: THREE.Object3D | null = null;
    let spideyRPinky1: THREE.Object3D | null = null;

    // Left Arm & 10 Left Finger Bones
    let spideyLeftClavicle: THREE.Object3D | null = null;
    let spideyLeftUpperArm: THREE.Object3D | null = null;
    let spideyLeftForearm: THREE.Object3D | null = null;
    let spideyLeftHand: THREE.Object3D | null = null;
    let spideyLThumb0: THREE.Object3D | null = null;
    let spideyLThumb1: THREE.Object3D | null = null;
    let spideyLIndex0: THREE.Object3D | null = null;
    let spideyLIndex1: THREE.Object3D | null = null;
    let spideyLMiddle0: THREE.Object3D | null = null;
    let spideyLMiddle1: THREE.Object3D | null = null;
    let spideyLRing0: THREE.Object3D | null = null;
    let spideyLRing1: THREE.Object3D | null = null;
    let spideyLPinky0: THREE.Object3D | null = null;
    let spideyLPinky1: THREE.Object3D | null = null;

    // Head, Neck & Spine
    let spideyHead: THREE.Object3D | null = null;
    let spideyNeck: THREE.Object3D | null = null;
    let spideySpine: THREE.Object3D | null = null;
    const animActions: { [key: string]: THREE.AnimationAction } = {};
    let currentActionName = '';

    // Fallback wrist anchors for web lines scaled for prominent superhero model
    const leftWristFallback = new THREE.Object3D();
    leftWristFallback.position.set(-0.6, 1.1, 0.4);
    heroCharacter.add(leftWristFallback);

    const rightWristFallback = new THREE.Object3D();
    rightWristFallback.position.set(0.6, 1.1, 0.4);
    heroCharacter.add(rightWristFallback);

    let heroModelRef: THREE.Object3D | null = null;

    // Responsive character sizing, camera distance, and animation selection
    const getResponsiveSettings = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const h = typeof window !== 'undefined' ? window.innerHeight : 800;
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1024;

      if (isMobile) {
        // Dynamic scale so Spider-Man fits comfortably on all mobile heights (small 667px up to 932px)
        const scaleFactor = Math.min(0.85, Math.max(0.72, (h / 844) * 0.78));
        return {
          isMobile: true,
          isTablet: false,
          isDesktop: false,
          action: 'walk' as const,
          heroScale: scaleFactor,
          charY: -0.48,
          charZ: 11.5,
          camZ: 25.8,
          camY: 1.05,
          lookY: 1.05,
          camFov: 44,
        };
      }

      if (isTablet) {
        // Tablet (iPad / tablets 768px - 1023px)
        const scaleFactor = Math.min(1.02, Math.max(0.86, (h / 1024) * 0.94));
        return {
          isMobile: false,
          isTablet: true,
          isDesktop: false,
          action: 'walk' as const,
          heroScale: scaleFactor,
          charY: -0.42,
          charZ: 11.5,
          camZ: 24.6,
          camY: 1.15,
          lookY: 1.10,
          camFov: 43,
        };
      }

      // Desktop (>= 1024px) - EXACT EXISTING DESKTOP EXPERIENCE
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        action: 'idle' as const,
        heroScale: 1.20,
        charY: -0.35,
        charZ: 11.5,
        camZ: 21.8,
        camY: 1.30,
        lookY: 0.90,
        camFov: 42,
      };
    };

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/spiderman.glb',
      (gltf) => {
        const model = gltf.scene;
        heroModelRef = model;

        // Cinematic Superhero Scale (Perfect headroom below navbar and full body head-to-toe visibility)
        const initialSettings = getResponsiveSettings();
        model.scale.setScalar(initialSettings.heroScale);
        model.position.set(0, 0, 0);

        // Hide clutter props (static weapon webs, manhole) and tune PBR suit materials
        model.traverse((child: any) => {
          if (child.isMesh) {
            // CRITICAL: Disable frustum culling on all SkinnedMeshes so Three.js never hides the character!
            child.frustumCulled = false;
            child.castShadow = true;
            child.receiveShadow = true;
            child.renderOrder = 999;

            const meshName = (child.name || '').toLowerCase();
            const matName = (child.material?.name || '').toLowerCase();

            // Hide manhole cover and static weapon web mesh props so only clean superhero model is visible
            if (
              meshName.includes('manhole') ||
              matName.includes('manhole') ||
              meshName.includes('spider_wp') ||
              meshName.includes('_wp_') ||
              meshName.includes('wp00') ||
              meshName.includes('wp02') ||
              matName.includes('web02') ||
              matName.includes('_wp')
            ) {
              child.visible = false;
              return;
            }

            // Enhance suit materials for cinematic movie quality
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach((m: THREE.MeshStandardMaterial) => {
                if (m) {
                  m.side = THREE.DoubleSide; // Guarantee solid surfaces from all camera angles
                  m.depthWrite = true;
                  const mName = (m.name || '').toLowerCase();
                  // Brilliant reflective white almond eye lenses with dark rims
                  if (
                    mName.includes('03') ||
                    mName.includes('lens') ||
                    mName.includes('eye') ||
                    meshName.includes('03')
                  ) {
                    m.color = new THREE.Color(0xffffff);
                    m.emissive = new THREE.Color(0xffffff);
                    m.emissiveIntensity = 0.95;
                    m.roughness = 0.08;
                    m.metalness = 0.2;
                  } else {
                    // Movie-quality fabric sheen on red & blue superhero suit with muscle contour reflections
                    m.roughness = 0.35;
                    m.metalness = 0.32;
                    m.envMapIntensity = 2.5;
                  }
                }
              });
            }
          }

          // Locate bones for connecting dynamic web cable and handshake kinematics
          if (child.name) {
            const bName = child.name;
            // Right arm chain
            if (bName.includes('R_Clavicle') || bName.includes('044')) spideyRightClavicle = child;
            if (bName.includes('R_UpperArm') || bName.includes('045')) spideyRightUpperArm = child;
            if (bName.includes('R_Forearm') || bName.includes('046')) spideyRightForearm = child;
            if (bName.includes('R_Hand') || bName.includes('047')) {
              rightHandBone = child;
              spideyRightHand = child;
            }
            // Right fingers (individual bones for iconic web-shooter pose & touch articulation)
            if (bName.includes('R_Finger0_048') || (bName.includes('R_Finger0') && !bName.includes('Finger01'))) spideyRThumb0 = child;
            if (bName.includes('R_Finger01_049')) spideyRThumb1 = child;
            if (bName.includes('R_Finger1_050') || (bName.includes('R_Finger1') && !bName.includes('Finger11'))) spideyRIndex0 = child;
            if (bName.includes('R_Finger11_051')) spideyRIndex1 = child;
            if (bName.includes('R_Finger2_052') || (bName.includes('R_Finger2') && !bName.includes('Finger21'))) spideyRMiddle0 = child;
            if (bName.includes('R_Finger21_053')) spideyRMiddle1 = child;
            if (bName.includes('R_Finger3_054') || (bName.includes('R_Finger3') && !bName.includes('Finger31'))) spideyRRing0 = child;
            if (bName.includes('R_Finger31_055')) spideyRRing1 = child;
            if (bName.includes('R_Finger4_056') || (bName.includes('R_Finger4') && !bName.includes('Finger41'))) spideyRPinky0 = child;
            if (bName.includes('R_Finger41_057')) spideyRPinky1 = child;

            // Left arm chain
            if (bName.includes('L_Clavicle') || bName.includes('017')) spideyLeftClavicle = child;
            if (bName.includes('L_UpperArm') || bName.includes('018')) spideyLeftUpperArm = child;
            if (bName.includes('L_Forearm') || bName.includes('019')) spideyLeftForearm = child;
            if (bName.includes('L_Hand') || bName.includes('020')) {
              leftHandBone = child;
              spideyLeftHand = child;
            }
            // Left fingers
            if (bName.includes('L_Finger0_021') || (bName.includes('L_Finger0') && !bName.includes('Finger01'))) spideyLThumb0 = child;
            if (bName.includes('L_Finger01_022')) spideyLThumb1 = child;
            if (bName.includes('L_Finger1_023') || (bName.includes('L_Finger1') && !bName.includes('Finger11'))) spideyLIndex0 = child;
            if (bName.includes('L_Finger11_024')) spideyLIndex1 = child;
            if (bName.includes('L_Finger2_025') || (bName.includes('L_Finger2') && !bName.includes('Finger21'))) spideyLMiddle0 = child;
            if (bName.includes('L_Finger21_026')) spideyLMiddle1 = child;
            if (bName.includes('L_Finger3_027') || (bName.includes('L_Finger3') && !bName.includes('Finger31'))) spideyLRing0 = child;
            if (bName.includes('L_Finger31_028')) spideyLRing1 = child;
            if (bName.includes('L_Finger4_029') || (bName.includes('L_Finger4') && !bName.includes('Finger41'))) spideyLPinky0 = child;
            if (bName.includes('L_Finger41_030')) spideyLPinky1 = child;

            // Head, Neck & Spine
            if (bName.includes('Head_043')) spideyHead = child;
            if (bName.includes('Neck_042')) spideyNeck = child;
            if (bName.includes('Spine1_016') || bName.includes('Spine_013')) spideySpine = child;
          }
        });

        // Setup Skeletal Animation Mixer
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            const shortName = clip.name.split('@')[1]
              ? clip.name.split('@')[1].replace('|Base Layer', '').trim()
              : clip.name;
            animActions[shortName] = action;
            animActions[clip.name] = action;
          });

          // Configure walking action with realistic superhero cadence
          if (animActions['walk']) {
            animActions['walk'].setEffectiveTimeScale(0.88);
          }

          const currentSettings = getResponsiveSettings();
          const targetStartName = currentSettings.action === 'walk' && animActions['walk'] ? 'walk' : 'idle';
          const startAction =
            animActions[targetStartName] ||
            animActions['idle'] ||
            animActions['wait'] ||
            animActions['dash'] ||
            animActions[gltf.animations[0].name];
          if (startAction) {
            startAction.play();
            currentActionName = targetStartName;
          }
        }

        heroCharacter.add(model);
      },
      undefined,
      (err) => {
        console.warn('Spider-Man GLB model load notice:', err);
      }
    );

    // ==========================================
    // 4B. INTERACTIVE TOUCH CONTACT PARTICLES & LIGHT RIPPLE
    // (Activated when Spider-Man physically places his palm on Fuzail's photograph)
    // ==========================================
    const touchContactPos = new THREE.Vector3(1.33, 1.40, 11.65);

    // 1. Holographic Particle Sparks at contact point (Dual Cyan & Purple)
    const touchSparkCount = 40;
    const touchSparkGeo = new THREE.BufferGeometry();
    const touchSparkPositions = new Float32Array(touchSparkCount * 3);
    const touchSparkColors = new Float32Array(touchSparkCount * 3);
    const touchSparkVelocities: THREE.Vector3[] = [];

    for (let i = 0; i < touchSparkCount; i++) {
      touchSparkPositions[i * 3] = 0;
      touchSparkPositions[i * 3 + 1] = 0;
      touchSparkPositions[i * 3 + 2] = 0;

      const isCyan = i % 2 === 0;
      touchSparkColors[i * 3] = isCyan ? 0.0 : 0.85;
      touchSparkColors[i * 3 + 1] = isCyan ? 0.95 : 0.45;
      touchSparkColors[i * 3 + 2] = isCyan ? 1.0 : 1.0;

      touchSparkVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6
        )
      );
    }

    touchSparkGeo.setAttribute('position', new THREE.BufferAttribute(touchSparkPositions, 3));
    touchSparkGeo.setAttribute('color', new THREE.BufferAttribute(touchSparkColors, 3));

    const touchSparkMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const touchSparks = new THREE.Points(touchSparkGeo, touchSparkMat);
    touchSparks.position.copy(touchContactPos);
    scene.add(touchSparks);

    // 2. 3D Cyan & Violet Expanding Light Ripple Ring at palm contact point
    const touchRippleGeo = new THREE.RingGeometry(0.04, 0.40, 32);
    const touchRippleMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const touchRippleMesh = new THREE.Mesh(touchRippleGeo, touchRippleMat);
    touchRippleMesh.position.copy(touchContactPos);
    scene.add(touchRippleMesh);

    // 3. Dynamic Cyan Contact Point Light (illuminates hand and photograph surface)
    const touchAuraLight = new THREE.PointLight(0x00e5ff, 0, 4.0);
    touchAuraLight.position.copy(touchContactPos);
    scene.add(touchAuraLight);

    // 4C. HOLLYWOOD WRIST WEB-SHOOTER SPARK VFX
    const wristSparkCount = 28;
    const wristSparkGeo = new THREE.BufferGeometry();
    const wristSparkPositions = new Float32Array(wristSparkCount * 3);
    const wristSparkColors = new Float32Array(wristSparkCount * 3);
    for (let i = 0; i < wristSparkCount; i++) {
      wristSparkPositions[i * 3] = (Math.random() - 0.5) * 0.15;
      wristSparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      wristSparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
      const isElectric = i % 2 === 0;
      wristSparkColors[i * 3] = isElectric ? 0.1 : 1.0;
      wristSparkColors[i * 3 + 1] = isElectric ? 0.95 : 0.85;
      wristSparkColors[i * 3 + 2] = 1.0;
    }
    wristSparkGeo.setAttribute('position', new THREE.BufferAttribute(wristSparkPositions, 3));
    wristSparkGeo.setAttribute('color', new THREE.BufferAttribute(wristSparkColors, 3));
    const wristSparkMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const wristSparkMesh = new THREE.Points(wristSparkGeo, wristSparkMat);
    scene.add(wristSparkMesh);
    const wristSparkLight = new THREE.PointLight(0x00f0ff, 0, 3.5);
    scene.add(wristSparkLight);

    // ==========================================
    // 5. DYNAMIC WEB-CABLE & PARTICLE STREAM
    // ==========================================
    const webSegments = 28;
    const webPositions = new Float32Array(webSegments * 3);
    const webGeo = new THREE.BufferGeometry();
    webGeo.setAttribute('position', new THREE.BufferAttribute(webPositions, 3));

    // Pure White Inner Core Strand
    const webCoreMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const webCoreLine = new THREE.Line(webGeo, webCoreMat);
    scene.add(webCoreLine);

    // Volumetric Cyan & Electric Blue Glowing Halo
    const webGlowMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const webGlowLine = new THREE.Line(webGeo, webGlowMat);
    scene.add(webGlowLine);

    // Web energy sparks traveling along cable
    const sparkCount = 18;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const webSparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(webSparks);

    // Web impact cluster flash at the anchor
    const webImpact = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 12, 12),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(webImpact);

    // Hero motion trails
    const trailCount = 22;
    const trailPositions = new Float32Array(trailCount * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      size: 0.38,
      color: 0x168bff,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const heroTrail = new THREE.Points(trailGeo, trailMat);
    scene.add(heroTrail);

    // ==========================================
    // 6. CONTINUOUS 3D SWING TRAJECTORY SPLINE
    // ==========================================
    const trajectoryPoints = [
      new THREE.Vector3(0.0, 0.0, 11.5),   // 0.00: Hero starting perch (Center of screen)
      new THREE.Vector3(-0.8, -2.5, 8.5),  // 0.08: Hero initial leap & swing dip
      new THREE.Vector3(2.4, -10, 3.5),    // 0.16: Swing swoop into About
      new THREE.Vector3(0.6, -20, -4.5),   // 0.24: About section clear flight corridor
      new THREE.Vector3(-2.2, -30, -16),   // 0.32: Acrobatic flip into Skills
      new THREE.Vector3(2.6, -40, -26),    // 0.40: Orbiting Skills galaxy
      new THREE.Vector3(-1.5, -52, -34),   // 0.48: Dive along Experience spine
      new THREE.Vector3(2.2, -64, -42),    // 0.56: Experience timeline swoop
      new THREE.Vector3(-2.0, -76, -50),   // 0.64: Leap toward Project gallery
      new THREE.Vector3(2.0, -88, -58),    // 0.72: Traversing project worlds
      new THREE.Vector3(0.5, -102, -66),   // 0.80: Diving toward AI Core
      new THREE.Vector3(-1.8, -114, -74),  // 0.86: AI Core energy portal
      new THREE.Vector3(1.8, -132, -84),   // 0.92: Flying through Education
      new THREE.Vector3(-0.6, -154, -98),  // 0.96: Gliding to Contact
      new THREE.Vector3(1.0, -166.0, -106),// 1.00: Contact helipad landing
    ];

    const swingSpline = new THREE.CatmullRomCurve3(trajectoryPoints, false, 'catmullrom', 0.4);

    // ==========================================
    // 7. PRESERVED ORIGINAL SECTION ARTIFACTS
    // ==========================================
    // Hero Rotating Rings
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0, 0);
    scene.add(heroGroup);

    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.04, 16, 64), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(6.5, 0.03, 16, 64), ringMat2);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.set(0, -2.1, 11.5);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.set(0, -2.2, 11.5);
    heroGroup.add(ring1);
    heroGroup.add(ring2);

    const crystalGeo = new THREE.OctahedronGeometry(0.7, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x168bff,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
    });
    const crystals: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      const angle = (i / 6) * Math.PI * 2;
      crystal.position.set(Math.cos(angle) * 7.5, Math.sin(angle) * 5, (Math.random() - 0.5) * 4);
      heroGroup.add(crystal);
      crystals.push(crystal);
    }

    const gridHelper = new THREE.GridHelper(40, 40, 0x00e5ff, 0x1e293b);
    gridHelper.position.set(0, -6, 0);
    heroGroup.add(gridHelper);

    // About Environment
    const aboutGroup = new THREE.Group();
    aboutGroup.position.set(0, -18, -12);
    scene.add(aboutGroup);

    const discGeo = new THREE.RingGeometry(3.5, 4.2, 64);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const aboutRing = new THREE.Mesh(discGeo, discMat);
    aboutRing.rotation.x = Math.PI / 2.3;
    aboutGroup.add(aboutRing);

    const badgeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const badgeMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.7,
      wireframe: true,
    });
    const aboutBadges: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const b = new THREE.Mesh(badgeGeo, badgeMat);
      aboutGroup.add(b);
      aboutBadges.push(b);
    }

    // Skills Galaxy
    const skillsGroup = new THREE.Group();
    skillsGroup.position.set(0, -38, -26);
    scene.add(skillsGroup);

    const coreGeo = new THREE.IcosahedronGeometry(2.4, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.3,
      wireframe: true,
    });
    const centralCore = new THREE.Mesh(coreGeo, coreMat);
    skillsGroup.add(centralCore);

    const innerCoreGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x168bff,
      transparent: true,
      opacity: 0.35,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    skillsGroup.add(innerCore);

    const techNodes: THREE.Mesh[] = [];
    const nodeCount = 14;
    const nodeGeo = new THREE.SphereGeometry(0.42, 16, 16);
    for (let i = 0; i < nodeCount; i++) {
      const hue = (i / nodeCount) * 0.75 + 0.45;
      const nodeColor = new THREE.Color().setHSL(hue % 1, 0.95, 0.6);
      const nodeMesh = new THREE.Mesh(
        nodeGeo,
        new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.85,
          roughness: 0.2,
        })
      );
      skillsGroup.add(nodeMesh);
      techNodes.push(nodeMesh);
    }

    // Experience Spine
    const expGroup = new THREE.Group();
    expGroup.position.set(0, -62, -42);
    scene.add(expGroup);

    const pathCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, 0),
      new THREE.Vector3(-1.5, 5, 1),
      new THREE.Vector3(1.5, 0, -1),
      new THREE.Vector3(-1.2, -5, 1),
      new THREE.Vector3(0, -10, 0),
    ]);
    const tubeGeo = new THREE.TubeGeometry(pathCurve, 64, 0.08, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.1,
    });
    const spineTube = new THREE.Mesh(tubeGeo, tubeMat);
    expGroup.add(spineTube);

    // Projects Portals
    const projGroup = new THREE.Group();
    projGroup.position.set(0, -88, -58);
    scene.add(projGroup);

    const projectFrames: THREE.Mesh[] = [];
    const frameGeo = new THREE.BoxGeometry(4.5, 3.0, 0.15);
    const frameColors = [0x00e5ff, 0x8b5cf6, 0x168bff, 0xec4899];
    for (let i = 0; i < 4; i++) {
      const fMat = new THREE.MeshStandardMaterial({
        color: frameColors[i],
        emissive: frameColors[i],
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const frame = new THREE.Mesh(frameGeo, fMat);
      const angle = (i / 4) * Math.PI * 2;
      frame.position.set(Math.cos(angle) * 7.5, (i % 2 === 0 ? 1 : -1) * 2, Math.sin(angle) * 4);
      frame.rotation.y = -angle + Math.PI / 2;
      projGroup.add(frame);
      projectFrames.push(frame);
    }

    // AI Core Digital World
    const aiGroup = new THREE.Group();
    aiGroup.position.set(0, -114, -74);
    scene.add(aiGroup);

    const aiCoreGeo = new THREE.IcosahedronGeometry(3.0, 2);
    const aiCoreMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 1.6,
      wireframe: true,
    });
    const aiSphere = new THREE.Mesh(aiCoreGeo, aiCoreMat);
    aiGroup.add(aiSphere);

    const pipelineNodes: THREE.Mesh[] = [];
    const pipelineCount = 6;
    for (let i = 0; i < pipelineCount; i++) {
      const pNode = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.5, 0),
        new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 0.95,
          wireframe: true,
        })
      );
      const angle = (i / pipelineCount) * Math.PI * 2;
      pNode.position.set(Math.cos(angle) * 6.8, Math.sin(angle) * 4.2, (Math.random() - 0.5) * 2);
      aiGroup.add(pNode);
      pipelineNodes.push(pNode);
    }

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.5,
    });
    const lineGeo = new THREE.BufferGeometry();
    const lineCoords: number[] = [];
    for (let i = 0; i < pipelineCount; i++) {
      const next = (i + 1) % pipelineCount;
      const angleA = (i / pipelineCount) * Math.PI * 2;
      const angleB = (next / pipelineCount) * Math.PI * 2;
      lineCoords.push(Math.cos(angleA) * 6.8, Math.sin(angleA) * 4.2, 0);
      lineCoords.push(Math.cos(angleB) * 6.8, Math.sin(angleB) * 4.2, 0);
      lineCoords.push(Math.cos(angleA) * 6.8, Math.sin(angleA) * 4.2, 0);
      lineCoords.push(0, 0, 0);
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
    const pipelineLines = new THREE.LineSegments(lineGeo, lineMat);
    aiGroup.add(pipelineLines);

    // Education & Certifications
    const eduGroup = new THREE.Group();
    eduGroup.position.set(0, -140, -92);
    scene.add(eduGroup);

    const certSlabs: THREE.Mesh[] = [];
    const slabGeo = new THREE.BoxGeometry(2.2, 1.4, 0.08);
    for (let i = 0; i < 8; i++) {
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x168bff,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.45,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      const row = Math.floor(i / 4);
      const col = i % 4;
      slab.position.set((col - 1.5) * 3.2, (row === 0 ? 1 : -1) * 2, (Math.random() - 0.5) * 2);
      eduGroup.add(slab);
      certSlabs.push(slab);
    }

    // Contact World
    const contactGroup = new THREE.Group();
    contactGroup.position.set(0, -168, -110);
    scene.add(contactGroup);

    const calmRing = new THREE.Mesh(
      new THREE.TorusGeometry(8.5, 0.05, 16, 100),
      new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.7,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      })
    );
    contactGroup.add(calmRing);

    // Mouse & Resize Trackers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!mountRef.current) return;
      const settings = getResponsiveSettings();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.fov = settings.camFov;
      camera.updateProjectionMatrix();
      if (heroModelRef) {
        heroModelRef.scale.setScalar(settings.heroScale);
      }
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 8. ANIMATION RENDER LOOP (Pendulum Physics & Hollywood Camera)
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const currentCamPos = camera.position.clone();
    const currentTarget = new THREE.Vector3(0, 0, 0);

    // 5. Cinematic Introduction State & Hollywood Web Dynamics
    let introClock = 0;
    const handleReplayIntro = () => {
      introClock = 0;
      (window as any).__cinematicIntroStarted = true;
    };
    window.addEventListener('replay-cinematic-intro', handleReplayIntro);
    const INTRO_DURATION = 37.0;

    // Hollywood Web Shooter Activation & Recoil Dynamics
    let webShootRecoil = 0.0;
    let camShakeIntensity = 0.0;
    let interactiveShootTimer = -1.0;

    const triggerWebShoot = () => {
      interactiveShootTimer = 0.0;
      camShakeIntensity = 0.85;
      webShootRecoil = 1.0;
      fuzailVoiceManager.playWebShootSFX(0.95);
    };

    const handleShootWebEvent = () => {
      triggerWebShoot();
    };
    window.addEventListener('spiderman-shoot-web', handleShootWebEvent);

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const tagName = activeEl?.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || (activeEl as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.code === 'Space' || e.key === ' ' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        triggerWebShoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // KINEMATIC POSING: Iconic Hollywood Web Shooter Pose (Middle & Ring Curled, Index & Pinky Straight, Thumb Open)
    const applyIconicWebShooterPose = (progress: number, recoil = 0.0) => {
      if (progress <= 0.001) return;
      const p = Math.min(1.0, Math.max(0.0, progress));

      // Clavicle lifts slightly
      if (spideyRightClavicle) {
        spideyRightClavicle.rotation.set(0.06 * p, 0.18 * p, -0.06 * p);
      }
      // Upper arm: smoothly raises forward aiming toward target, with recoil impulse
      if (spideyRightUpperArm) {
        spideyRightUpperArm.rotation.set(
          THREE.MathUtils.lerp(0.0, 1.35 - recoil * 0.22, p),
          THREE.MathUtils.lerp(0.0, -0.42, p),
          THREE.MathUtils.lerp(0.0, 0.32, p)
        );
      }
      // Forearm: extends straight forward
      if (spideyRightForearm) {
        spideyRightForearm.rotation.set(
          THREE.MathUtils.lerp(0.0, 0.22 + recoil * 0.15, p),
          THREE.MathUtils.lerp(0.0, -0.12, p),
          THREE.MathUtils.lerp(0.0, -0.16, p)
        );
      }
      // Hand/Wrist: iconic dorsiflexion upward so palm faces target and underside web-shooter nozzle points at target
      if (spideyRightHand) {
        spideyRightHand.rotation.set(
          THREE.MathUtils.lerp(0.0, 0.68, p),
          THREE.MathUtils.lerp(0.0, -0.26, p),
          THREE.MathUtils.lerp(0.0, 0.36, p)
        );
      }

      // FINGERS: Classic Spider-Man Trigger Gesture
      // 1. Middle & Ring fingers: curled firmly into palm to press the palm trigger!
      if (spideyRMiddle0) spideyRMiddle0.rotation.set(0.12 * p, 0.05 * p, 1.48 * p);
      if (spideyRMiddle1) spideyRMiddle1.rotation.set(0.0, 0.0, 1.68 * p);
      if (spideyRRing0) spideyRRing0.rotation.set(0.10 * p, 0.05 * p, 1.45 * p);
      if (spideyRRing1) spideyRRing1.rotation.set(0.0, 0.0, 1.65 * p);

      // 2. Index & Pinky fingers: extended straight out!
      if (spideyRIndex0) spideyRIndex0.rotation.set(0.02 * p, -0.05 * p, -0.22 * p);
      if (spideyRIndex1) spideyRIndex1.rotation.set(0.0, 0.0, 0.04 * p);
      if (spideyRPinky0) spideyRPinky0.rotation.set(-0.05 * p, 0.08 * p, -0.15 * p);
      if (spideyRPinky1) spideyRPinky1.rotation.set(0.0, 0.0, 0.05 * p);

      // 3. Thumb: spread open wide
      if (spideyRThumb0) spideyRThumb0.rotation.set(-1.15 * p, -0.45 * p, -0.32 * p);
      if (spideyRThumb1) spideyRThumb1.rotation.set(-0.35 * p, 0.0, -0.15 * p);

      // Symmetrical counter-balance on left arm & torso
      if (spideyLeftClavicle) spideyLeftClavicle.rotation.set(-0.04 * p, -0.10 * p, 0.04 * p);
      if (spideyLeftUpperArm) spideyLeftUpperArm.rotation.set(-0.25 * p, 0.35 * p, -0.45 * p);
      if (spideyLeftForearm) spideyLeftForearm.rotation.set(0.40 * p, 0.0, 0.20 * p);
      if (spideyLeftHand) spideyLeftHand.rotation.set(0.10 * p, 0.0, -0.15 * p);

      if (spideyNeck) spideyNeck.rotation.set(-0.02 * p, -0.05 * p, 0);
      if (spideyLThumb0) spideyLThumb0.rotation.set(-0.5 * p, 0, 0);
      if (spideyLThumb1) spideyLThumb1.rotation.set(-0.2 * p, 0, 0);
      if (spideyLIndex0) spideyLIndex0.rotation.set(0.15 * p, 0, 0.2 * p);
      if (spideyLIndex1) spideyLIndex1.rotation.set(0, 0, 0.2 * p);
      if (spideyLMiddle0) spideyLMiddle0.rotation.set(0.2 * p, 0, 0.25 * p);
      if (spideyLMiddle1) spideyLMiddle1.rotation.set(0, 0, 0.25 * p);
      if (spideyLRing0) spideyLRing0.rotation.set(0.2 * p, 0, 0.25 * p);
      if (spideyLRing1) spideyLRing1.rotation.set(0, 0, 0.25 * p);
      if (spideyLPinky0) spideyLPinky0.rotation.set(0.15 * p, 0, 0.2 * p);
      if (spideyLPinky1) spideyLPinky1.rotation.set(0, 0, 0.2 * p);
    };

    // KINEMATIC POSING: Natural Superhero Gesture towards Fuzail's Photograph (ZERO WEBS, Zero Distortion)
    const applyPortraitTouchPose = (progress: number) => {
      if (progress <= 0.001) return;
      const p = Math.min(1.0, Math.max(0.0, progress));

      if (spideyRightClavicle) {
        spideyRightClavicle.rotation.set(0.04 * p, 0.08 * p, -0.04 * p);
      }
      // Upper arm lifts smoothly and naturally forward and rightward towards the portrait
      if (spideyRightUpperArm) {
        spideyRightUpperArm.rotation.set(0.48 * p, -0.28 * p, 0.22 * p);
      }
      // Forearm extends gently with natural elbow flexion
      if (spideyRightForearm) {
        spideyRightForearm.rotation.set(0.35 * p, 0.0, -0.10 * p);
      }
      // Hand rests flat and naturally aligned with the arm
      if (spideyRightHand) {
        spideyRightHand.rotation.set(0.12 * p, -0.15 * p, 0.08 * p);
      }

      // Turn head naturally towards the portrait
      if (spideyNeck) spideyNeck.rotation.set(0.02 * p, 0.12 * p, 0);
      if (spideyHead) {
        spideyHead.rotation.set(0.04 * p, 0.35 * p, 0.0);
      }
      if (spideySpine) {
        spideySpine.rotation.set(0.02 * p, 0.08 * p, 0.0);
      }
    };

    const smoothstep = (min: number, max: number, val: number) => {
      const x = Math.max(0, Math.min(1, (val - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const rawP = THREE.MathUtils.clamp(scrollRef.current, 0, 1);
      const liveP = THREE.MathUtils.clamp(
        rawP + Math.sin(elapsedTime * 0.75) * (isReducedMotion ? 0 : 0.0035),
        0,
        1
      );

      const isMobileScreen = window.innerWidth < 768;
      const isTabletScreen = window.innerWidth >= 768 && window.innerWidth < 1024;
      const heroScale = isMobileScreen ? 1.05 : isTabletScreen ? 1.15 : 1.20;
      const characterHeight = 1.81 * heroScale;

      const isIntroMode = introActiveRef.current && rawP < 0.03 && !isReducedMotion;

      let isSwinging = false;
      let cycleProgress = 0;

      let desiredCamPos: THREE.Vector3;
      let desiredLookAt: THREE.Vector3;
      let reachProgress = 0; // 0 (idle) to 1 (full contact with profile card)
      const currentSettings = getResponsiveSettings();

      if (isIntroMode || rawP < 0.16) {
        if (isIntroMode) {
          // Advance Introduction Clock only when experience has started
          const isStarted = !!(window as any).__cinematicIntroStarted;
          if (isStarted) {
            introClock += delta;
          }
          onIntroTimeUpdateRef.current?.(introClock, INTRO_DURATION);
          if (introClock >= INTRO_DURATION) {
            onIntroCompleteRef.current?.();
          }

          const t = introClock;

          // ----------------------------------------------------
          // SCENE 1: 0.0s - 3.0s: City Establishing Shot (Night Skyline & Atmospheric Fog)
          // ----------------------------------------------------
          if (t < 3.0) {
            heroCharacter.position.set(-5.0, 14.0, 2.0);
            heroCharacter.rotation.set(0.2, 0.4, 0);

            webCoreMat.opacity = 0;
            webGlowMat.opacity = 0;
            reachProgress = 0;

            const camT = t / 3.0;
            desiredCamPos = new THREE.Vector3(
              THREE.MathUtils.lerp(-3.5, 0.0, smoothstep(0, 1, camT)),
              THREE.MathUtils.lerp(6.5, 3.8, smoothstep(0, 1, camT)),
              THREE.MathUtils.lerp(28.0, 22.0, smoothstep(0, 1, camT))
            );
            desiredLookAt = new THREE.Vector3(0.0, 1.5, 11.5);
          }
          // ----------------------------------------------------
          // SCENE 2A: 3.0s - 5.5s: Spider-Man Web Arrival & Rooftop Superhero Touchdown
          // ----------------------------------------------------
          else if (t < 5.5) {
            reachProgress = 0;
            if (t < 4.5) {
              const swingT = smoothstep(3.0, 4.5, t);
              const spideyX = THREE.MathUtils.lerp(-5.0, 0.0, swingT);
              const spideyY = THREE.MathUtils.lerp(14.0, -0.35, swingT * swingT);
              const spideyZ = THREE.MathUtils.lerp(2.0, 11.5, swingT);
              heroCharacter.position.set(spideyX, spideyY, spideyZ);

              // Web cable to anchor 0
              const spideyWrist = new THREE.Vector3(spideyX + 0.3, spideyY + 1.2, spideyZ);
              const anchor0 = anchorPoints[0];
              const webAttr = webGeo.attributes.position as THREE.BufferAttribute;
              for (let s = 0; s < webSegments; s++) {
                const st = s / (webSegments - 1);
                const p = new THREE.Vector3().lerpVectors(spideyWrist, anchor0, st);
                p.y -= Math.sin(st * Math.PI) * 0.4;
                webAttr.setXYZ(s, p.x, p.y, p.z);
              }
              webAttr.needsUpdate = true;
              webCoreMat.opacity = (1 - swingT * 0.6) * 0.95;
              webGlowMat.opacity = (1 - swingT * 0.6) * 0.65;

              if (swingT < 0.8) {
                heroCharacter.rotation.set(0.25, Math.PI / 4, 0);
              } else {
                heroCharacter.rotation.set(0.12, 0.08, 0);
              }

              desiredCamPos = new THREE.Vector3(
                THREE.MathUtils.lerp(0.2, 0.0, swingT),
                THREE.MathUtils.lerp(3.8, 1.6, swingT),
                THREE.MathUtils.lerp(22.0, 21.8, swingT)
              );
              desiredLookAt = new THREE.Vector3(0.0, 0.90, 11.5);
            } else {
              const riseT = smoothstep(4.5, 5.5, t);
              heroCharacter.position.set(0.0, -0.35, 11.5);
              heroCharacter.rotation.set(
                THREE.MathUtils.lerp(0.12, 0.02, riseT),
                THREE.MathUtils.lerp(0.08, 0.12, riseT),
                0
              );
              webCoreMat.opacity = 0;
              webGlowMat.opacity = 0;

              desiredCamPos = new THREE.Vector3(0.0, 1.30, 21.8);
              desiredLookAt = new THREE.Vector3(0.0, 0.90, 11.5);
            }
          }
          // ----------------------------------------------------
          // SCENE 1 (HOLLYWOOD HERO INTRO): 5.5s - 8.5s: Confident Superhero Stance & Welcome Speech
          // ----------------------------------------------------
          else if (t < 8.5) {
            heroCharacter.position.set(0.0, -0.35, 11.5);
            heroCharacter.rotation.set(0.02, 0.12, 0);
            webCoreMat.opacity = 0;
            webGlowMat.opacity = 0;
            reachProgress = 0;

            desiredCamPos = new THREE.Vector3(0.0, 1.30, 21.8);
            desiredLookAt = new THREE.Vector3(0.0, 0.90, 11.5);
          }
          // ----------------------------------------------------
          // SCENE 2 (HOLLYWOOD WEB-SHOOTER ACTIVATION): 8.5s - 11.0s: Wrist Flex & Spark
          // ----------------------------------------------------
          else if (t < 11.0) {
            heroCharacter.position.set(0.0, -0.35, 11.5);
            heroCharacter.rotation.set(0.02, 0.12, 0);
            webCoreMat.opacity = 0;
            webGlowMat.opacity = 0;
            reachProgress = 0;

            desiredCamPos = new THREE.Vector3(0.0, 1.30, 21.8);
            desiredLookAt = new THREE.Vector3(0.0, 0.90, 11.5);
          }
          // ----------------------------------------------------
          // SCENE 3 (HOLLYWOOD WEB SHOOTING & RECOIL): 11.0s - 14.0s: Fast Launch & Recoil
          // ----------------------------------------------------
          else if (t < 14.0) {
            heroCharacter.position.set(0.0, -0.35, 11.5);
            heroCharacter.rotation.set(0.02, 0.12, 0);
            reachProgress = 0;

            // Shoot high-speed web toward anchor 0 (-10.5, 16, 10)
            const shootRelT = smoothstep(11.0, 11.45, t);
            const fadeRelT = smoothstep(13.2, 14.0, t);
            const activeAlpha = Math.min(shootRelT * 2.0, 1.0) * (1.0 - fadeRelT);

            const handPos = new THREE.Vector3();
            if (spideyRightHand) {
              spideyRightHand.getWorldPosition(handPos);
            } else {
              rightWristFallback.getWorldPosition(handPos);
            }

            const targetAnchor = anchorPoints[0];
            const currentHead = new THREE.Vector3().lerpVectors(handPos, targetAnchor, Math.min(1.0, shootRelT * 1.5));
            const webAttr = webGeo.attributes.position as THREE.BufferAttribute;
            for (let s = 0; s < webSegments; s++) {
              const st = s / (webSegments - 1);
              const p = new THREE.Vector3().lerpVectors(handPos, currentHead, st);
              p.y -= Math.sin(st * Math.PI) * (0.25 * (1 - shootRelT));
              webAttr.setXYZ(s, p.x, p.y, p.z);
            }
            webAttr.needsUpdate = true;
            webCoreMat.opacity = activeAlpha * 0.95;
            webGlowMat.opacity = activeAlpha * 0.70;

            desiredCamPos = new THREE.Vector3(0.0, 1.30, 21.8);
            desiredLookAt = new THREE.Vector3(0.0, 0.90, 11.5);
          }
          // ----------------------------------------------------
          // SCENE 3B: 14.0s - 25.5s: Hero Stance & Fuzail Welcome Dialogue
          // ----------------------------------------------------
          else if (t < 25.5) {
            heroCharacter.position.set(0.0, -0.35, 11.5);
            heroCharacter.rotation.set(0.02, 0.12, 0);
            webCoreMat.opacity = 0;
            webGlowMat.opacity = 0;
            reachProgress = 0;

            desiredCamPos = new THREE.Vector3(0.0, 1.30, 21.8);
            desiredLookAt = new THREE.Vector3(0.0, 0.90, 11.5);
          }
          // ----------------------------------------------------
          // SCENE 4: 25.5s - 33.5s: Physical Approach & Palm on Fuzail's Portrait (ZERO WEBS!)
          // ----------------------------------------------------
          else if (t < 33.5) {
            webCoreMat.opacity = 0;
            webGlowMat.opacity = 0;

            if (currentSettings.isDesktop) {
              if (t < 27.5) {
                // 1. Approach: steps naturally towards portrait card
                const appT = smoothstep(25.5, 27.5, t);
                heroCharacter.position.set(THREE.MathUtils.lerp(0.0, 0.58, appT), -0.35, 11.5);
                heroCharacter.rotation.set(0.02, THREE.MathUtils.lerp(0.12, 0.32, appT), 0);
                reachProgress = 0;

                desiredCamPos = new THREE.Vector3(
                  THREE.MathUtils.lerp(0.0, 0.28, appT),
                  1.30,
                  THREE.MathUtils.lerp(21.8, 21.2, appT)
                );
                desiredLookAt = new THREE.Vector3(
                  THREE.MathUtils.lerp(0.0, 0.40, appT),
                  0.90,
                  11.5
                );
              } else if (t < 29.0) {
                // 2. Raise arm & gently gesture towards photograph surface
                const touchT = smoothstep(27.5, 29.0, t);
                heroCharacter.position.set(0.58, -0.35, 11.5);
                heroCharacter.rotation.set(0.02, 0.32, 0);
                reachProgress = touchT;

                desiredCamPos = new THREE.Vector3(0.28, 1.30, 21.2);
                desiredLookAt = new THREE.Vector3(0.40, 0.90, 11.5);
              } else if (t < 32.0) {
                // 3. HOLD GESTURE POSE! Hand visibly acknowledging the photograph
                heroCharacter.position.set(0.58, -0.35, 11.5);
                heroCharacter.rotation.set(0.02, 0.32, 0);
                reachProgress = 1.0;

                desiredCamPos = new THREE.Vector3(0.28, 1.30, 21.2);
                desiredLookAt = new THREE.Vector3(0.40, 0.90, 11.5);
              } else {
                // 4. Smoothly lower arm and step back
                const relT = smoothstep(32.0, 33.5, t);
                heroCharacter.position.set(THREE.MathUtils.lerp(0.58, 0.0, relT), -0.35, 11.5);
                heroCharacter.rotation.set(0.02, THREE.MathUtils.lerp(0.32, 0.12, relT), 0);
                reachProgress = 1.0 - relT;

                desiredCamPos = new THREE.Vector3(
                  THREE.MathUtils.lerp(0.28, 0.0, relT),
                  1.30,
                  THREE.MathUtils.lerp(21.2, 21.8, relT)
                );
                desiredLookAt = new THREE.Vector3(
                  THREE.MathUtils.lerp(0.40, 0.0, relT),
                  0.90,
                  11.5
                );
              }
            } else {
              // Mobile & Tablet: Stay centered in walking stage with zero reach distortion
              heroCharacter.position.set(0.0, currentSettings.charY, 11.5);
              const walkSway = Math.sin(elapsedTime * 1.5) * 0.08;
              heroCharacter.rotation.set(0.02, walkSway, 0);
              reachProgress = 0;
              desiredCamPos = new THREE.Vector3(0.0, currentSettings.camY, currentSettings.camZ);
              desiredLookAt = new THREE.Vector3(0.0, currentSettings.lookY, 11.5);
            }
          }
          // ----------------------------------------------------
          // SCENE 5: 33.5s - 37.0s: Grand Portfolio Reveal Transition
          // ----------------------------------------------------
          else {
            reachProgress = 0;
            heroCharacter.position.set(0.0, -0.35, 11.5);
            heroCharacter.rotation.set(0.02, 0.12, 0);
            webCoreMat.opacity = 0;
            webGlowMat.opacity = 0;

            desiredCamPos = new THREE.Vector3(0.0, 1.30, 21.8);
            desiredLookAt = new THREE.Vector3(0.0, 0.90, 11.5);
          }
        } else {
          // Standard Portfolio 3D Experience (Scroll-Driven Interactive Touch)
          const settings = getResponsiveSettings();
          const baseZ = settings.camZ;
          const baseY = settings.camY;
          const baseLookY = settings.lookY;
          const charY = settings.charY;

          if (rawP < 0.05) {
            // Interactive Hover on Photo Card: smoothly places palm on portrait when visitor hovers (ZERO WEBS!)
            const isHoveringPhoto = settings.isDesktop && !!(window as any).__spidermanPhotoHover;
            const targetHoverReach = isHoveringPhoto ? 1.0 : 0.0;
            reachProgress = THREE.MathUtils.lerp(reachProgress, targetHoverReach, 0.1);

            webCoreMat.opacity = 0;
            webGlowMat.opacity = 0;

            if (reachProgress > 0.01) {
              heroCharacter.position.set(THREE.MathUtils.lerp(0.0, 0.58, reachProgress), charY, 11.5);
              heroCharacter.rotation.set(0.02, THREE.MathUtils.lerp(0.12, 0.32, reachProgress), 0);
              desiredLookAt = new THREE.Vector3(THREE.MathUtils.lerp(0.0, 0.40, reachProgress), baseLookY, 11.5);
              desiredCamPos = new THREE.Vector3(
                mouseRef.current.x * 0.35 + THREE.MathUtils.lerp(0.0, 0.28, reachProgress),
                baseY + mouseRef.current.y * 0.25,
                THREE.MathUtils.lerp(baseZ, baseZ - 0.4, reachProgress)
              );
            } else {
              // Resting Hero Section: Spider-Man in true CENTER, full head-to-toe visible
              if (settings.action === 'walk') {
                // Realistic walking motion with smooth pacing sway on mobile and tablet
                const walkSway = Math.sin(elapsedTime * 1.5) * 0.08;
                heroCharacter.position.set(0.0, charY, 11.5);
                heroCharacter.rotation.set(0.02, walkSway, 0);
              } else {
                heroCharacter.position.set(0.0, charY, 11.5);
                heroCharacter.rotation.set(0.02, 0.12, 0);
              }

              webCoreMat.opacity = 0;
              webGlowMat.opacity = 0;

              desiredLookAt = new THREE.Vector3(0.0, baseLookY, 11.5);
              desiredCamPos = new THREE.Vector3(
                mouseRef.current.x * 0.35,
                baseY + mouseRef.current.y * 0.25,
                baseZ
              );
            }
          } else if (rawP < 0.12) {
            // Smoothly turns towards city canyon as user begins scrolling
            const disengT = (rawP - 0.05) / 0.07;
            reachProgress = 0;

            heroCharacter.position.set(0.0, charY, 11.5);
            heroCharacter.rotation.set(0.02, THREE.MathUtils.lerp(0.12, 0.0, disengT), 0);

            webCoreMat.opacity = 0;
            webGlowMat.opacity = 0;

            desiredLookAt = new THREE.Vector3(0.0, 0.75, 11.5);
            desiredCamPos = new THREE.Vector3(
              mouseRef.current.x * 0.35,
              1.20 + mouseRef.current.y * 0.25,
              18.5
            );
          } else {
            // Release & Dynamic Web Launch to Anchor 0
            const relT = (rawP - 0.12) / 0.04;
            reachProgress = 0;

            heroCharacter.position.set(0.0, -0.45, 11.5);
            heroCharacter.rotation.set(0.04, 0.0, 0);

            // Dynamic Web Launch from wrist to anchor 0
            const spideyWrist = new THREE.Vector3(heroCharacter.position.x - 0.35, 0.8, 11.5);
            const anchor0 = anchorPoints[0];
            const endPt = new THREE.Vector3().lerpVectors(spideyWrist, anchor0, relT);
            const webAttr = webGeo.attributes.position as THREE.BufferAttribute;
            for (let s = 0; s < webSegments; s++) {
              const st = s / (webSegments - 1);
              const p = new THREE.Vector3().lerpVectors(spideyWrist, endPt, st);
              p.y -= Math.sin(st * Math.PI) * 0.25;
              webAttr.setXYZ(s, p.x, p.y, p.z);
            }
            webAttr.needsUpdate = true;
            webCoreMat.opacity = relT * 0.95;
            webGlowMat.opacity = relT * 0.65;

            desiredLookAt = new THREE.Vector3(0.0, 0.85, 11.5);
            desiredCamPos = new THREE.Vector3(
              mouseRef.current.x * 0.35,
              1.25 + mouseRef.current.y * 0.25,
              17.5
            );
          }
        }

        // 1. Update Skeletal Animation Mixer (walk on mobile/tablet, idle on desktop)
        const desiredActionName = currentSettings.action; // 'walk' on mobile/tablet, 'idle' on desktop

        if (mixer) {
          const isShootingWeb = interactiveShootTimer >= 0.0;
          if (!isShootingWeb) {
            if (currentActionName !== desiredActionName && animActions[desiredActionName]) {
              animActions[currentActionName]?.fadeOut(0.3);
              const targetAct = animActions[desiredActionName];
              targetAct.reset();
              if (desiredActionName === 'walk') {
                targetAct.setEffectiveTimeScale(0.88); // Smooth, realistic walking pace
              }
              targetAct.fadeIn(0.3).play();
              currentActionName = desiredActionName;
            }
          }
          mixer.update(delta);
        }

        // 2. CRITICAL: Procedural Bone Posing applied AFTER mixer.update
        const breath = Math.sin(elapsedTime * 2.2) * 0.02;
        if (spideySpine) {
          spideySpine.rotation.x += breath * 0.5;
        }

        if (isIntroMode) {
          const t = introClock;

          if (t >= 5.5 && t < 8.5) {
            // Scene 1: Hero Introduction - Dynamic idle with natural breathing and head surveying rooftop
            const surveyHeadYaw = Math.sin((t - 5.5) * 1.5) * 0.18;
            const surveyHeadPitch = Math.cos((t - 5.5) * 2.0) * 0.04;
            if (spideyHead) {
              spideyHead.rotation.set(surveyHeadPitch, surveyHeadYaw + mouseRef.current.x * 0.06, 0);
            }
            wristSparkLight.intensity = 0;
            wristSparkMat.opacity = 0;
          } else if (t >= 8.5 && t < 11.0) {
            // Scene 2: Web Shooter Activation - Smoothly raises arm, flexes wrist upward with iconic trigger gesture & wrist spark
            const actT = smoothstep(8.5, 10.2, t);
            applyIconicWebShooterPose(actT, 0.0);

            // Wrist spark VFX
            const sparkT = smoothstep(9.5, 11.0, t);
            wristSparkLight.intensity = (3.5 + Math.random() * 2.5) * sparkT;
            wristSparkMat.opacity = (0.75 + Math.random() * 0.25) * sparkT;
            const wPos = new THREE.Vector3();
            if (spideyRightHand) spideyRightHand.getWorldPosition(wPos);
            else rightWristFallback.getWorldPosition(wPos);
            wristSparkMesh.position.copy(wPos);
            wristSparkLight.position.copy(wPos);

            if (spideyHead) {
              spideyHead.rotation.set(0.02, -0.15 * actT, 0);
            }
          } else if (t >= 11.0 && t < 14.0) {
            // Scene 3: Web Shooting - High-velocity web shoot, realistic recoil motion on arm & torso, camera recoil
            if (t >= 11.0 && t < 11.1) {
              webShootRecoil = 1.0;
              camShakeIntensity = 1.0;
            }
            const holdT = t < 13.0 ? 1.0 : (1.0 - smoothstep(13.0, 14.0, t));
            applyIconicWebShooterPose(holdT, webShootRecoil);

            wristSparkLight.intensity = (2.0 + Math.random() * 2.0) * (1.0 - smoothstep(11.0, 11.8, t));
            wristSparkMat.opacity = (0.8 + Math.random() * 0.2) * (1.0 - smoothstep(11.0, 11.8, t));

            if (spideyHead) {
              spideyHead.rotation.set(-0.06 * webShootRecoil, -0.22, 0);
            }
          } else if (t >= 14.0 && t < 25.5) {
            // Speech gestures: Audio-reactive head nods with natural superhero body posture & clean skeletal arms
            const vocalLevel = fuzailVoiceManager.getAudioLevel();
            const speechHeadNod = Math.sin(t * 8.0) * 0.035 + vocalLevel * 0.08;
            const speechHeadTilt = Math.sin(t * 4.0) * 0.025 + Math.sin(t * 12.0) * vocalLevel * 0.04;

            wristSparkLight.intensity = 0;
            wristSparkMat.opacity = 0;

            if (spideyHead) {
              spideyHead.rotation.set(speechHeadNod, speechHeadTilt + mouseRef.current.x * 0.05, vocalLevel * 0.03);
            }
          } else if (reachProgress > 0.001) {
            // Scene 4: Hand on Portrait Interaction (NO WEBS!)
            wristSparkLight.intensity = 0;
            wristSparkMat.opacity = 0;
            if (currentSettings.isDesktop) {
              applyPortraitTouchPose(reachProgress);
            }
          }
        } else {
          // Standard / Interactive Mode:
          if (interactiveShootTimer >= 0.0) {
            // Active on-demand web shoot!
            interactiveShootTimer += delta;
            const it = interactiveShootTimer;

            if (it < 0.25) {
              // Activation phase
              const actP = it / 0.25;
              applyIconicWebShooterPose(actP, 0.0);
              wristSparkLight.intensity = (4.0 + Math.random() * 2.0) * actP;
              wristSparkMat.opacity = 0.9 * actP;
              const wPos = new THREE.Vector3();
              if (spideyRightHand) spideyRightHand.getWorldPosition(wPos);
              else rightWristFallback.getWorldPosition(wPos);
              wristSparkMesh.position.copy(wPos);
              wristSparkLight.position.copy(wPos);
            } else if (it < 0.85) {
              // Web release & recoil
              const webT = (it - 0.25) / 0.60;
              applyIconicWebShooterPose(1.0, webShootRecoil);

              const handPos = new THREE.Vector3();
              if (spideyRightHand) spideyRightHand.getWorldPosition(handPos);
              else rightWristFallback.getWorldPosition(handPos);

              const anchor0 = anchorPoints[0];
              const curEnd = new THREE.Vector3().lerpVectors(handPos, anchor0, Math.min(1.0, webT * 2.5));
              const webAttr = webGeo.attributes.position as THREE.BufferAttribute;
              for (let s = 0; s < webSegments; s++) {
                const st = s / (webSegments - 1);
                const p = new THREE.Vector3().lerpVectors(handPos, curEnd, st);
                p.y -= Math.sin(st * Math.PI) * (0.25 * (1 - webT));
                webAttr.setXYZ(s, p.x, p.y, p.z);
              }
              webAttr.needsUpdate = true;
              const webFade = it < 0.65 ? 1.0 : (1.0 - (it - 0.65) / 0.20);
              webCoreMat.opacity = webFade * 0.95;
              webGlowMat.opacity = webFade * 0.70;

              wristSparkLight.intensity = 0;
              wristSparkMat.opacity = 0;
            } else if (it < 1.35) {
              // Return to idle
              const retP = (it - 0.85) / 0.50;
              applyIconicWebShooterPose(1.0 - retP, 0.0);
              webCoreMat.opacity = 0;
              webGlowMat.opacity = 0;
            } else {
              interactiveShootTimer = -1.0;
              webCoreMat.opacity = 0;
              webGlowMat.opacity = 0;
            }
          } else if (reachProgress > 0.001) {
            // Hovering on photo card: acknowledges portrait on desktop (NO WEBS!)
            wristSparkLight.intensity = 0;
            wristSparkMat.opacity = 0;
            if (currentSettings.isDesktop) {
              applyPortraitTouchPose(reachProgress);
            }
          } else {
            // Idle or walking superhero with natural head tracking
            wristSparkLight.intensity = 0;
            wristSparkMat.opacity = 0;
            if (spideyHead) {
              if (currentSettings.action === 'walk') {
                const vocalLevel = fuzailVoiceManager.getAudioLevel();
                const walkHeadNod = Math.sin(elapsedTime * 3.0) * 0.02 + vocalLevel * 0.04;
                spideyHead.rotation.set(
                  walkHeadNod - mouseRef.current.y * 0.06,
                  mouseRef.current.x * 0.12,
                  0
                );
              } else {
                spideyHead.rotation.set(
                  -mouseRef.current.y * 0.12,
                  mouseRef.current.x * 0.16,
                  0
                );
              }
            }
          }
        }

        // Apply Camera Recoil Shake & Recoil Damping
        if (camShakeIntensity > 0.01) {
          desiredCamPos.x += (Math.random() - 0.5) * 0.08 * camShakeIntensity;
          desiredCamPos.y += (Math.random() - 0.5) * 0.08 * camShakeIntensity;
          camShakeIntensity = Math.max(0, camShakeIntensity - delta * 3.5);
        }
        if (webShootRecoil > 0.01) {
          webShootRecoil = Math.max(0, webShootRecoil - delta * 3.2);
        }

        // 3. ZERO WEBS on Portrait Interaction:
        // Web strands are strictly turned OFF during portrait touch
        if (reachProgress > 0.001) {
          webCoreMat.opacity = 0;
          webGlowMat.opacity = 0;
        } else if (!isSwinging && (!isIntroMode || (introClock > 5.5 && (introClock < 11.0 || introClock >= 14.0))) && interactiveShootTimer < 0) {
          webCoreMat.opacity = 0;
          webGlowMat.opacity = 0;
        }

        // 4. Update Touch VFX: Cyan Ripple, Aura Light & Sparks at contact point
        // EXCLUSIVELY when hand touches photo, with ZERO web strands
        if (reachProgress > 0.65) {
          const intensity = (reachProgress - 0.65) / 0.35;
          const pulse = Math.sin(elapsedTime * 6) * 0.15;

          touchSparkMat.opacity = (0.80 + pulse) * intensity;
          touchRippleMat.opacity = (0.80 + pulse) * intensity;
          touchRippleMesh.scale.setScalar(0.85 + (pulse + 0.15) * 1.3 * intensity);
          touchAuraLight.intensity = (4.0 + pulse * 3) * intensity;

          const sAttr = touchSparkGeo.attributes.position as THREE.BufferAttribute;
          for (let sp = 0; sp < touchSparkCount; sp++) {
            const v = touchSparkVelocities[sp];
            const c = ((elapsedTime * 2.2 + sp / touchSparkCount) % 1);
            sAttr.setXYZ(sp, v.x * c * 0.35, v.y * c * 0.35, v.z * c * 0.35);
          }
          sAttr.needsUpdate = true;

          window.dispatchEvent(
            new CustomEvent('spiderman-photo-touch', {
              detail: { isTouching: true, intensity },
            })
          );
        } else {
          touchSparkMat.opacity = 0;
          touchRippleMat.opacity = 0;
          touchAuraLight.intensity = 0;

          window.dispatchEvent(
            new CustomEvent('spiderman-photo-touch', {
              detail: { isTouching: false, intensity: 0 },
            })
          );
        }
      } else {
          // Flight beyond Hero section: Full continuous spline traversal
          const heroPos = swingSpline.getPoint(liveP);
          const heroTangent = swingSpline.getTangent(liveP).normalize();
          heroCharacter.position.copy(heroPos);

          touchSparkMat.opacity = 0;
          touchRippleMat.opacity = 0;
          touchAuraLight.intensity = 0;
          window.dispatchEvent(new CustomEvent('spiderman-photo-touch', { detail: { isTouching: false, intensity: 0 } }));

          if (rawP > 0.94) {
            heroCharacter.rotation.set(-0.02, 0.15, 0); // turns toward visitor in final scene
          } else {
            heroCharacter.lookAt(heroPos.clone().add(heroTangent));
          }

          // 2. REALISTIC PENDULUM SWING & WEB PHYSICS
          const totalSwings = anchorPoints.length;
          const swingIndex = Math.min(Math.floor(liveP * totalSwings), totalSwings - 1);
          const anchorPos = anchorPoints[swingIndex];
          const useRightHand = swingIndex % 2 === 1;
          cycleProgress = (liveP * totalSwings) % 1;

          const activeHandPos = new THREE.Vector3();
          if (useRightHand) {
            if (rightHandBone) {
              rightHandBone.getWorldPosition(activeHandPos);
            } else {
              rightWristFallback.getWorldPosition(activeHandPos);
            }
          } else {
            if (leftHandBone) {
              leftHandBone.getWorldPosition(activeHandPos);
            } else {
              leftWristFallback.getWorldPosition(activeHandPos);
            }
          }

          const isShooting = cycleProgress < 0.12;
          isSwinging = cycleProgress >= 0.12 && cycleProgress < 0.76;
          const isReleasing = cycleProgress >= 0.76;

          let webVisible = !isReleasing;
          let reach = 1.0;
          if (isShooting) {
            reach = cycleProgress / 0.12;
          }

          const currentWebEnd = new THREE.Vector3().lerpVectors(activeHandPos, anchorPos, reach);
          const webPosAttr = webGeo.attributes.position as THREE.BufferAttribute;
          const sagAmount = isSwinging ? 0.03 : 0.22;
          const tensionVibrate = Math.sin(elapsedTime * 80) * 0.012;

          for (let s = 0; s < webSegments; s++) {
            const segT = s / (webSegments - 1);
            const pLine = new THREE.Vector3().lerpVectors(activeHandPos, currentWebEnd, segT);
            const catenary = Math.sin(segT * Math.PI) * sagAmount * (1 - reach * 0.4);
            pLine.y -= catenary;
            pLine.x += tensionVibrate;
            webPosAttr.setXYZ(s, pLine.x, pLine.y, pLine.z);
          }
          webPosAttr.needsUpdate = true;

          webCoreMat.opacity = webVisible ? (isShooting ? reach : 0.95) : 0;
          webGlowMat.opacity = webVisible ? (isShooting ? reach * 0.6 : 0.55) : 0;

          const sparkPosAttr = sparkGeo.attributes.position as THREE.BufferAttribute;
          for (let sp = 0; sp < sparkCount; sp++) {
            const sT = ((elapsedTime * 1.8 + sp / sparkCount) % 1) * reach;
            const sIdx = Math.floor(sT * (webSegments - 1));
            sparkPosAttr.setXYZ(sp, webPosAttr.getX(sIdx), webPosAttr.getY(sIdx), webPosAttr.getZ(sIdx));
          }
          sparkPosAttr.needsUpdate = true;
          sparkMat.opacity = webVisible ? 0.85 : 0;

          webImpact.position.copy(anchorPos);
          webImpact.material.opacity = isSwinging ? 0.65 + Math.sin(elapsedTime * 15) * 0.25 : 0;

          // 3. SKELETAL ANIMATION BLENDING
          if (mixer) {
            let desiredAction = 'dash';
            if (rawP > 0.94) {
              desiredAction = animActions['wait'] ? 'wait' : (animActions['idle'] ? 'idle' : 'dash');
            } else if (isShooting) {
              desiredAction = animActions['skill01'] ? 'skill01' : (animActions['atk-01'] ? 'atk-01' : 'dash');
            } else if (isSwinging) {
              desiredAction = animActions['dash'] ? 'dash' : (animActions['skill02'] ? 'skill02' : 'dash');
            } else if (isReleasing) {
              desiredAction = animActions['skill03'] ? 'skill03' : (animActions['skill05-01'] ? 'skill05-01' : 'dash');
            }

            if (desiredAction !== currentActionName && animActions[desiredAction]) {
              const prev = animActions[currentActionName];
              const next = animActions[desiredAction];
              if (next) {
                next.reset().fadeIn(0.22).play();
                if (prev) prev.fadeOut(0.22);
                currentActionName = desiredAction;
              }
            }
            mixer.update(delta);
          }

          // Procedural Centripetal Banking & Momentum Flips
          if (!isReducedMotion && rawP <= 0.94) {
            if (isSwinging) {
              const swingPhase = (cycleProgress - 0.12) / 0.64;
              const bankRoll = Math.sin(swingPhase * Math.PI) * (useRightHand ? -0.42 : 0.42);
              heroCharacter.rotateZ(bankRoll);
              heroCharacter.rotateX(0.22);
            } else if (isReleasing) {
              const flipPhase = (cycleProgress - 0.76) / 0.24;
              heroCharacter.rotateX(flipPhase * Math.PI * 2);
              heroCharacter.rotateZ(Math.sin(flipPhase * Math.PI) * 0.3);
            } else if (isShooting) {
              heroCharacter.rotateX(0.18);
            }
          }

          // Camera follow for city swinging
          const flightDist = isMobileScreen ? 4.2 : 5.0;
          const flightHeight = characterHeight * 0.55;
          const camOffset = new THREE.Vector3(
            mouseRef.current.x * 1.2,
            flightHeight + mouseRef.current.y * 0.6,
            flightDist
          );

          if (isSwinging && !isReducedMotion) {
            const swingPhase = (cycleProgress - 0.12) / 0.64;
            const sideKick = Math.sin(swingPhase * Math.PI) * (useRightHand ? 1.4 : -1.4);
            camOffset.x += sideKick;
          }

          if (rawP > 0.94) {
            // Final Thank-You Scene: Cinematic low-angle camera framing Spider-Man and night skyline
            desiredCamPos = new THREE.Vector3(
              1.0 + mouseRef.current.x * 0.35,
              -163.8 + mouseRef.current.y * 0.25,
              -99.5
            );
            desiredLookAt = new THREE.Vector3(1.0, -165.2, -106.0);
          } else {
            desiredCamPos = heroPos.clone().add(camOffset);
            desiredLookAt = heroPos.clone().add(new THREE.Vector3(0, characterHeight * 0.5, 0));
            if (isSwinging && !isReducedMotion) {
              desiredLookAt.add(heroTangent.clone().multiplyScalar(0.4));
            }
          }
        }

      if (!isReducedMotion) {
        currentCamPos.lerp(desiredCamPos, 0.058);
        currentTarget.lerp(desiredLookAt, 0.058);

        camera.position.copy(currentCamPos);
        camera.lookAt(currentTarget);

        // Smooth cinematic roll / banking into turns
        const targetRoll = -heroCharacter.rotation.z * 0.15;
        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRoll, 0.05);

        // Dynamic Hollywood camera FOV (expands during fast dives, tightens at apex)
        const speedFactor = isSwinging ? Math.sin((cycleProgress - 0.12) / 0.64 * Math.PI) : 0;
        const baseFov = isMobileScreen ? 50 : 42;
        const targetFov = THREE.MathUtils.lerp(baseFov, baseFov + 8, speedFactor);
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05);
        camera.updateProjectionMatrix();

        // 5. AMBIENT SECTION OBJECT ANIMATIONS
        ring1.rotation.z = elapsedTime * 0.16;
        ring2.rotation.x = elapsedTime * 0.13;
        ring2.rotation.y = elapsedTime * 0.19;

        crystals.forEach((c, idx) => {
          c.rotation.x = elapsedTime * (0.2 + idx * 0.05);
          c.rotation.y = elapsedTime * (0.25 + idx * 0.04);
        });

        aboutRing.rotation.z = -elapsedTime * 0.1;
        aboutBadges.forEach((b, idx) => {
          const bAngle = elapsedTime * 0.4 + (idx / 5) * Math.PI * 2;
          b.position.set(
            Math.cos(bAngle) * 4.8,
            Math.sin(bAngle) * 3.2,
            Math.sin(elapsedTime * 0.8 + idx) * 0.8
          );
          b.rotation.x = elapsedTime * 0.5;
          b.rotation.y = elapsedTime * 0.7;
        });

        centralCore.rotation.y = elapsedTime * 0.25;
        centralCore.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
        const scalePulse = 1 + Math.sin(elapsedTime * 2) * 0.06;
        innerCore.scale.set(scalePulse, scalePulse, scalePulse);

        techNodes.forEach((node, idx) => {
          const orbitRadius = 6.2 + (idx % 3) * 2.1;
          const speed = 0.25 + (idx % 4) * 0.08;
          const orbitAngle = elapsedTime * speed + (idx / nodeCount) * Math.PI * 2;
          node.position.set(
            Math.cos(orbitAngle) * orbitRadius,
            Math.sin(orbitAngle * 0.8) * (orbitRadius * 0.5),
            Math.sin(orbitAngle) * (orbitRadius * 0.7)
          );
        });

        projectFrames.forEach((frame, idx) => {
          frame.rotation.y += Math.sin(elapsedTime + idx) * 0.003;
        });

        aiSphere.rotation.y = elapsedTime * 0.4;
        aiSphere.rotation.z = elapsedTime * 0.25;
        const aiPulse = 1 + Math.sin(elapsedTime * 3) * 0.1;
        aiSphere.scale.set(aiPulse, aiPulse, aiPulse);

        pipelineNodes.forEach((pn, idx) => {
          const pAngle = elapsedTime * 0.3 + (idx / pipelineCount) * Math.PI * 2;
          pn.position.x = Math.cos(pAngle) * 6.8;
          pn.position.y = Math.sin(pAngle) * 4.2;
          pn.rotation.x = elapsedTime;
        });

        certSlabs.forEach((slab, idx) => {
          slab.rotation.y = Math.sin(elapsedTime * 0.8 + idx) * 0.1;
          slab.position.z += Math.sin(elapsedTime + idx) * 0.003;
        });

        calmRing.rotation.z = elapsedTime * 0.08;

        // Searchlights sweeping across twilight sky
        searchlights.forEach((beam, bIdx) => {
          beam.rotation.z = Math.sin(elapsedTime * 0.4 + bIdx) * 0.35 + (bIdx - 1.5) * 0.2;
        });

        // Skyscraper beacons blinking
        cityBuildings.forEach((b, bIdx) => {
          const bScale = 0.8 + Math.sin(elapsedTime * 3.5 + bIdx) * 0.35;
          b.beacon.scale.set(bScale, bScale, bScale);
        });

        // Dynamic light drifting
        blueKeyLight.position.x = Math.sin(elapsedTime * 0.5) * 10 - 5;
        purpleFillLight.position.y = Math.cos(elapsedTime * 0.6) * 8 - 2;
      } else {
        camera.position.copy(desiredCamPos);
        camera.lookAt(desiredLookAt);
      }

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('replay-cinematic-intro', handleReplayIntro);
      window.removeEventListener('spiderman-shoot-web', handleShootWebEvent);
      window.removeEventListener('keydown', handleKeyDown);

      if (mixer) {
        mixer.stopAllAction();
      }

      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      windowTexture.dispose();
      buildingMat.dispose();
      buildingEdgeMat.dispose();
      beamGeo.dispose();
      webGeo.dispose();
      webCoreMat.dispose();
      webGlowMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      discGeo.dispose();
      discMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      nodeGeo.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      frameGeo.dispose();
      aiCoreGeo.dispose();
      aiCoreMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      touchSparkGeo.dispose();
      touchSparkMat.dispose();
      touchRippleGeo.dispose();
      touchRippleMat.dispose();
      wristSparkGeo.dispose();
      wristSparkMat.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isReducedMotion]);

  return (
    <div
      ref={mountRef}
      className="webgl-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};
