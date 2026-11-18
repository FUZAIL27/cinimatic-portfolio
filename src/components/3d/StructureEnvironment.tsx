import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import cityBackdropImg from '../../assets/images/fuzail-cyberpunk-city.jpg';

interface StructureEnvironmentProps {
  scrollProgress: number; // 0 to 1
  isReducedMotion?: boolean;
}

export const StructureEnvironment: React.FC<StructureEnvironmentProps> = ({
  scrollProgress,
  isReducedMotion = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // 1. Scene & Deep Navy/Black Cyberpunk Atmosphere (Ultra-HD Depth)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020612, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 54 : 45,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );
    const defaultCamZ = isMobile ? 24 : 19;
    camera.position.set(0, 0, defaultCamZ);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Multi-Spectrum Studio & Cyberpunk Lighting
    const ambientLight = new THREE.AmbientLight(0x061226, 2.8);
    scene.add(ambientLight);

    // Warm Flame/Orange Key Light (Signature Fuzail Amber Accent)
    const orangeKey = new THREE.PointLight(0xff5500, 6.5, 90);
    orangeKey.position.set(12, 8, 12);
    scene.add(orangeKey);

    // Electric Cyan Fill / Rim Light (Cyberpunk Visor & Grid Glow)
    const cyanRim = new THREE.PointLight(0x00e5ff, 5.8, 80);
    cyanRim.position.set(-12, 6, 10);
    scene.add(cyanRim);

    // Deep Violet/Purple Atmospheric Accent Light (Spatial Depth)
    const purpleAccent = new THREE.PointLight(0x8b5cf6, 4.5, 70);
    purpleAccent.position.set(0, -15, -15);
    scene.add(purpleAccent);

    // Top Volumetric Cyan Stage Light
    const topVolumetric = new THREE.PointLight(0x00e5ff, 3.2, 55);
    topVolumetric.position.set(4, 14, 5);
    scene.add(topVolumetric);

    // Master World Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 3. Cinematic Cyberpunk City Panoramic Backdrop Plane
    const textureLoader = new THREE.TextureLoader();
    const cityTexture = textureLoader.load(cityBackdropImg);
    cityTexture.colorSpace = THREE.SRGBColorSpace;

    const cityPlaneGeo = new THREE.PlaneGeometry(120, 68);
    const cityPlaneMat = new THREE.MeshBasicMaterial({
      map: cityTexture,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });
    const cityPlaneMesh = new THREE.Mesh(cityPlaneGeo, cityPlaneMat);
    cityPlaneMesh.position.set(0, 4, -45);
    worldGroup.add(cityPlaneMesh);

    // 4. Glowing Perspective Grid Floor (Cyan & Amber dual grid)
    const gridY = -6.2;
    const gridPrimary = new THREE.GridHelper(90, 90, 0x00e5ff, 0x0a1c38);
    gridPrimary.position.set(0, gridY, 0);
    worldGroup.add(gridPrimary);

    const gridAccent = new THREE.GridHelper(90, 18, 0xff5500, 0x1f0a00);
    gridAccent.position.set(0, gridY + 0.02, 0);
    worldGroup.add(gridAccent);

    // Dark Reflective Floor with High Specular Gloss
    const floorGeo = new THREE.PlaneGeometry(160, 160);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x020612,
      roughness: 0.12,
      metalness: 0.94,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, gridY - 0.05, 0);
    floorMesh.rotation.x = -Math.PI / 2;
    worldGroup.add(floorMesh);

    // 5. Giant Illuminated Fuzail Chevron ("A") Logo in Distant Skyline
    const logoGroup = new THREE.Group();
    logoGroup.position.set(-16, 12, -35);
    worldGroup.add(logoGroup);

    const chevronShape = new THREE.Shape();
    chevronShape.moveTo(0, 5.0);
    chevronShape.lineTo(3.2, -3.0);
    chevronShape.lineTo(1.8, -3.0);
    chevronShape.lineTo(0, 1.6);
    chevronShape.lineTo(-1.8, -3.0);
    chevronShape.lineTo(-3.2, -3.0);
    chevronShape.closePath();

    const chevronGeo = new THREE.ShapeGeometry(chevronShape);
    const chevronMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
    });
    const chevronMesh = new THREE.Mesh(chevronGeo, chevronMat);
    logoGroup.add(chevronMesh);

    // Glowing Neon Edge Lines
    const chevronEdges = new THREE.EdgesGeometry(chevronGeo);
    const chevronEdgeMat = new THREE.LineBasicMaterial({
      color: 0xffaa33,
      linewidth: 2,
    });
    const chevronLine = new THREE.LineSegments(chevronEdges, chevronEdgeMat);
    logoGroup.add(chevronLine);

    // Ambient Logo Backlight
    const logoLight = new THREE.PointLight(0xff5500, 4.2, 28);
    logoLight.position.set(0, 1, 2);
    logoGroup.add(logoLight);

    // 6. 3D Rotating Holographic Earth / Digital Wireframe Globe (Upper Right)
    const globeGroup = new THREE.Group();
    const globePosX = isMobile ? 6 : 9.5;
    const globePosY = isMobile ? 5.2 : 6.0;
    const globePosZ = isMobile ? -14 : -10;
    globeGroup.position.set(globePosX, globePosY, globePosZ);
    worldGroup.add(globeGroup);

    // Core Wireframe Sphere
    const globeRadius = isMobile ? 2.4 : 3.2;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 26, 26);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Inner Glowing Translucent Atmospheric Core
    const innerCoreGeo = new THREE.SphereGeometry(globeRadius * 0.94, 20, 20);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.22,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    globeGroup.add(innerCoreMesh);

    // Equatorial and Orbital Holographic Rings
    const ring1Geo = new THREE.RingGeometry(globeRadius * 1.25, globeRadius * 1.32, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    globeGroup.add(ring1Mesh);

    const ring2Geo = new THREE.RingGeometry(globeRadius * 1.45, globeRadius * 1.5, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    ring2Mesh.rotation.x = Math.PI / 5;
    globeGroup.add(ring2Mesh);

    // 8 Orbiting Satellites / Data Nodes around Globe
    const satCount = 8;
    const satMeshes: THREE.Mesh[] = [];
    for (let s = 0; s < satCount; s++) {
      const satGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
      const satMat = new THREE.MeshBasicMaterial({
        color: s % 2 === 0 ? 0xffaa33 : 0x00e5ff,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      globeGroup.add(satMesh);
      satMeshes.push(satMesh);
    }

    // 7. Floating Cosmic & Cyberpunk Particles (Cyan, Sky Blue, Amber, Purple)
    const particleCount = isMobile ? 180 : 360;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color(0x00e5ff), // Cyan
      new THREE.Color(0x38bdf8), // Sky Blue
      new THREE.Color(0xff8a1f), // Amber
      new THREE.Color(0xa855f7), // Purple
    ];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 55;
      particlePositions[i * 3 + 1] = gridY + Math.random() * 26;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 45;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;

      particleSpeeds[i] = 0.15 + Math.random() * 0.45;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
    });
    const emberParticles = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(emberParticles);

    // 8. Diagonal Light Streaks across Skyline
    const streakCount = 4;
    const streakMeshes: THREE.Line[] = [];
    const streakMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.42,
    });
    for (let st = 0; st < streakCount; st++) {
      const p1 = new THREE.Vector3(
        (Math.random() - 0.5) * 35,
        15 + Math.random() * 8,
        -20 - Math.random() * 10
      );
      const p2 = new THREE.Vector3(p1.x - 12, p1.y - 14, p1.z);
      const strGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const strMesh = new THREE.Line(strGeo, streakMat);
      worldGroup.add(strMesh);
      streakMeshes.push(strMesh);
    }

    // Mouse Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mob = w < 768;
      camera.fov = mob ? 54 : 45;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    };
    window.addEventListener('resize', handleResize);

    // 9. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, mouseRef.current.targetX, 0.05);
      mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, mouseRef.current.targetY, 0.05);

      // Camera motion & scroll tracking
      const scrollOffset = scrollRef.current * 12;
      camera.position.y = -scrollOffset * 0.8;
      if (!isReducedMotion) {
        camera.position.x = mouseRef.current.x * 1.2;
        camera.position.y = -scrollOffset * 0.8 + mouseRef.current.y * 0.6;
      }
      camera.lookAt(0, -scrollOffset * 0.5, 0);

      // Rotate Globe & Orbit Rings
      globeGroup.rotation.y = elapsedTime * 0.18;
      ring1Mesh.rotation.z = elapsedTime * 0.24;
      ring2Mesh.rotation.z = -elapsedTime * 0.16;

      // Orbit Satellites
      satMeshes.forEach((sat, idx) => {
        const angle = elapsedTime * 0.6 + (idx / satCount) * Math.PI * 2;
        const rad = globeRadius * (1.35 + (idx % 3) * 0.18);
        sat.position.x = Math.cos(angle) * rad;
        sat.position.z = Math.sin(angle) * rad;
        sat.position.y = Math.sin(angle * 2) * 0.8;
        sat.rotation.y = -angle;
      });

      // Float upward particles
      const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += particleSpeeds[i] * 0.08;
        if (posArray[i * 3 + 1] > gridY + 28) {
          posArray[i * 3 + 1] = gridY;
        }
      }
      posAttr.needsUpdate = true;

      // Pulse Chevron Logo
      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.05;
      logoGroup.scale.set(pulse, pulse, 1);

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      cityPlaneGeo.dispose();
      cityPlaneMat.dispose();
      cityTexture.dispose();
      gridPrimary.dispose();
      gridAccent.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      chevronGeo.dispose();
      chevronMat.dispose();
      chevronEdges.dispose();
      chevronEdgeMat.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satMeshes.forEach((s) => {
        s.geometry.dispose();
        (s.material as THREE.Material).dispose();
      });
      particleGeo.dispose();
      particleMat.dispose();
      streakMeshes.forEach((str) => {
        str.geometry.dispose();
        (str.material as THREE.Material).dispose();
      });
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isReducedMotion]);

  return (
    <div
      ref={mountRef}
      className="webgl-container pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
};
