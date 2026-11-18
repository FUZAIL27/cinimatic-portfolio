import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DeveloperEnvironmentProps {
  scrollProgress: number; // 0 to 1
  isReducedMotion?: boolean;
}

export const DeveloperEnvironment: React.FC<DeveloperEnvironmentProps> = ({
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

    // 1. Scene & Dark Cybernetic Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.016);

    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 240);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Developer Workspace Lighting (Cyber Emerald, Neon Cyan, Syntax Violet)
    const ambientLight = new THREE.AmbientLight(0x061124, 2.2);
    scene.add(ambientLight);

    const emeraldKey = new THREE.PointLight(0x10b981, 5.0, 55);
    emeraldKey.position.set(-10, 12, 10);
    scene.add(emeraldKey);

    const cyanFill = new THREE.PointLight(0x00e5ff, 4.5, 50);
    cyanFill.position.set(10, -6, 8);
    scene.add(cyanFill);

    const violetAccent = new THREE.PointLight(0x8b5cf6, 4.0, 45);
    violetAccent.position.set(0, -30, -12);
    scene.add(violetAccent);

    const workspaceGroup = new THREE.Group();
    scene.add(workspaceGroup);

    // 3. Helper: Generate Canvas Textures for Floating Code Panels
    const createCodeTexture = (
      title: string,
      lang: string,
      lines: { text: string; color: string }[]
    ) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 768;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Dark glass IDE panel background
      ctx.fillStyle = 'rgba(6, 12, 26, 0.94)';
      ctx.fillRect(0, 0, 1024, 768);

      // IDE Titlebar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1024, 60);

      // Window Control dots (Red, Yellow, Green)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(32, 30, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(60, 30, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(88, 30, 8, 0, Math.PI * 2);
      ctx.fill();

      // Title & Lang Tag
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(title, 130, 38);

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`[ ${lang} ]`, 880, 38);

      // Syntax lines
      ctx.font = '22px monospace';
      let yPos = 115;
      lines.forEach((l, idx) => {
        // Line number
        ctx.fillStyle = '#334155';
        ctx.fillText(String(idx + 1).padStart(2, '0'), 30, yPos);

        // Code content
        ctx.fillStyle = l.color;
        ctx.fillText(l.text, 85, yPos);
        yPos += 36;
      });

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    // Panel 1: Java & Spring Boot Microservice
    const javaTex = createCodeTexture('SupplyChainController.java', 'JAVA / SPRING BOOT', [
      { text: '@RestController', color: '#f59e0b' },
      { text: '@RequestMapping("/api/v1/erp/scm")', color: '#38bdf8' },
      { text: 'public class SupplyChainController {', color: '#f8fafc' },
      { text: '    @Autowired private OrderService orderService;', color: '#94a3b8' },
      { text: '    @Autowired private EventBus eventBus;', color: '#94a3b8' },
      { text: '    ', color: '#94a3b8' },
      { text: '    @PostMapping("/dispatch/batch")', color: '#f59e0b' },
      { text: '    public ResponseEntity<DispatchResult> process(', color: '#38bdf8' },
      { text: '        @Valid @RequestBody OrderBatchRequest req) {', color: '#f8fafc' },
      { text: '        var result = orderService.dispatch(req);', color: '#a78bfa' },
      { text: '        eventBus.publish(new DispatchEvent(result));', color: '#10b981' },
      { text: '        return ResponseEntity.ok(result);', color: '#38bdf8' },
      { text: '    }', color: '#f8fafc' },
      { text: '}', color: '#f8fafc' },
    ]);

    // Panel 2: Live Animated Terminal
    const termCanvas = document.createElement('canvas');
    termCanvas.width = 1024;
    termCanvas.height = 768;
    const termCtx = termCanvas.getContext('2d')!;
    const termTex = new THREE.CanvasTexture(termCanvas);

    // Panel 3: TypeScript UI Architecture
    const tsTex = createCodeTexture('reactive-architecture.ts', 'TYPESCRIPT / REACT', [
      { text: 'import { Observable, BehaviorSubject } from "rxjs";', color: '#a78bfa' },
      { text: 'export interface ERPTelemetryStream<T> {', color: '#f8fafc' },
      { text: '    readonly transactionId: UUID;', color: '#38bdf8' },
      { text: '    status: "DISPATCHED" | "ACID_VERIFIED";', color: '#10b981' },
      { text: '    payload: Readonly<T>;', color: '#f59e0b' },
      { text: '}', color: '#f8fafc' },
      { text: 'export const useEnterpriseStream = () => {', color: '#38bdf8' },
      { text: '    const [state, setState] = useState<StreamState>();', color: '#f8fafc' },
      { text: '    useEffect(() => {', color: '#f59e0b' },
      { text: '        const sub = stream$.subscribe(setState);', color: '#a78bfa' },
      { text: '        return () => sub.unsubscribe();', color: '#94a3b8' },
      { text: '    }, []);', color: '#f8fafc' },
      { text: '    return state;', color: '#10b981' },
      { text: '};', color: '#f8fafc' },
    ]);

    // Panel 4: Database SQL & ACID Ledger
    const sqlTex = createCodeTexture('inventory_schema.sql', 'POSTGRESQL / ACID', [
      { text: 'BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;', color: '#f59e0b' },
      { text: 'CREATE TABLE IF NOT EXISTS erp_inventory_ledger (', color: '#38bdf8' },
      { text: '    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),', color: '#94a3b8' },
      { text: '    sku_code VARCHAR(64) NOT NULL UNIQUE,', color: '#f8fafc' },
      { text: '    unit_price NUMERIC(12, 2) NOT NULL,', color: '#10b981' },
      { text: '    available_stock INT CHECK (available_stock >= 0),', color: '#f59e0b' },
      { text: '    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()', color: '#94a3b8' },
      { text: ');', color: '#f8fafc' },
      { text: 'CREATE INDEX idx_ledger_sku ON erp_inventory_ledger(sku_code);', color: '#a78bfa' },
      { text: 'COMMIT;', color: '#f59e0b' },
    ]);

    // 4. Create 3D Mesh Code Panels
    const panelGeo = new THREE.PlaneGeometry(6.2, 4.6);
    const panelMatConfig = (tex: THREE.Texture) => {
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        opacity: 0.92,
        roughness: 0.25,
        metalness: 0.4,
        side: THREE.DoubleSide,
      });
      return mat;
    };

    const codePanels: { mesh: THREE.Mesh; basePos: THREE.Vector3; rotSpeed: number }[] = [];

    // Panel A: Java Microservice (Top Right)
    const p1Mat = panelMatConfig(javaTex);
    const p1Mesh = new THREE.Mesh(panelGeo, p1Mat);
    p1Mesh.position.set(6.8, 2.5, -2);
    p1Mesh.rotation.y = -0.25;
    workspaceGroup.add(p1Mesh);
    codePanels.push({ mesh: p1Mesh, basePos: p1Mesh.position.clone(), rotSpeed: 0.15 });

    // Panel B: Animated Terminal (Top Left)
    const p2Mat = panelMatConfig(termTex);
    const p2Mesh = new THREE.Mesh(panelGeo, p2Mat);
    p2Mesh.position.set(-6.8, -14, -10);
    p2Mesh.rotation.y = 0.25;
    workspaceGroup.add(p2Mesh);
    codePanels.push({ mesh: p2Mesh, basePos: p2Mesh.position.clone(), rotSpeed: -0.12 });

    // Panel C: TypeScript UI (Mid Right)
    const p3Mat = panelMatConfig(tsTex);
    const p3Mesh = new THREE.Mesh(panelGeo, p3Mat);
    p3Mesh.position.set(7.0, -38, -20);
    p3Mesh.rotation.y = -0.22;
    workspaceGroup.add(p3Mesh);
    codePanels.push({ mesh: p3Mesh, basePos: p3Mesh.position.clone(), rotSpeed: 0.1 });

    // Panel D: Database SQL (Deep Left)
    const p4Mat = panelMatConfig(sqlTex);
    const p4Mesh = new THREE.Mesh(panelGeo, p4Mat);
    p4Mesh.position.set(-6.5, -68, -32);
    p4Mesh.rotation.y = 0.28;
    workspaceGroup.add(p4Mesh);
    codePanels.push({ mesh: p4Mesh, basePos: p4Mesh.position.clone(), rotSpeed: -0.15 });

    // Glass Card Edge outlines
    [p1Mesh, p2Mesh, p3Mesh, p4Mesh].forEach((mesh, idx) => {
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(panelGeo),
        new THREE.LineBasicMaterial({
          color: idx % 2 === 0 ? 0x00e5ff : 0x10b981,
          transparent: true,
          opacity: 0.65,
        })
      );
      mesh.add(edge);
    });

    // 5. 3D Git Commit Tree Pipeline
    const gitGroup = new THREE.Group();
    gitGroup.position.set(0, -25, -14);
    workspaceGroup.add(gitGroup);

    const gitSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.0, 8, 0),
      new THREE.Vector3(-1.5, 4, 1),
      new THREE.Vector3(0.0, 0, 0),
      new THREE.Vector3(2.0, -4, -1),
      new THREE.Vector3(0.0, -8, 0),
    ]);

    const gitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(gitSpline.getPoints(50)),
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.75 })
    );
    gitGroup.add(gitLine);

    // Git Commit Spheres
    const commitNodes: THREE.Mesh[] = [];
    for (let g = 0; g < 6; g++) {
      const gNode = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0x091b24,
          emissive: g % 2 === 0 ? 0x10b981 : 0x00e5ff,
          emissiveIntensity: 0.9,
          roughness: 0.2,
          metalness: 0.8,
        })
      );
      const pt = gitSpline.getPoint(g / 5);
      gNode.position.copy(pt);
      gitGroup.add(gNode);
      commitNodes.push(gNode);
    }

    // 6. 3D Floating Docker Container Wireframe
    const dockerGroup = new THREE.Group();
    dockerGroup.position.set(5.5, -55, -26);
    workspaceGroup.add(dockerGroup);

    const dockerBox = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.6, 2.8, 3.2)),
      new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.75 })
    );
    dockerGroup.add(dockerBox);

    const dockerCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.0, 0),
      new THREE.MeshStandardMaterial({
        color: 0x0a1c38,
        wireframe: true,
        emissive: 0x168bff,
        emissiveIntensity: 0.8,
      })
    );
    dockerGroup.add(dockerCore);

    // 7. Floating 3D Technology Tokens
    // (Java, Spring Boot, React, Angular, JavaScript, Node.js, Express.js, MongoDB, MySQL, REST APIs, Docker)
    const techTokensList = [
      { name: 'Java', color: '#f59e0b' },
      { name: 'Spring Boot', color: '#10b981' },
      { name: 'React', color: '#00e5ff' },
      { name: 'Angular', color: '#ef4444' },
      { name: 'JavaScript', color: '#facc15' },
      { name: 'Node.js', color: '#22c55e' },
      { name: 'Express.js', color: '#94a3b8' },
      { name: 'MongoDB', color: '#10b981' },
      { name: 'MySQL', color: '#0284c7' },
      { name: 'REST APIs', color: '#8b5cf6' },
      { name: 'Docker', color: '#38bdf8' },
    ];

    const createTechTokenTexture = (name: string, color: string) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 70;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);
      ctx.fillStyle = 'rgba(6, 12, 26, 0.95)';
      ctx.roundRect(4, 4, 248, 62, 10);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.roundRect(4, 4, 248, 62, 10);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`</> ${name}`, 128, 40);

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    const techTokenMeshes: { mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number; phase: number }[] = [];
    techTokensList.forEach((token, idx) => {
      const tokenTex = createTechTokenTexture(token.name, token.color);
      const tokenMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 0.62),
        new THREE.MeshBasicMaterial({
          map: tokenTex,
          transparent: true,
          opacity: isMobile ? 0 : 0.85,
          side: THREE.DoubleSide,
        })
      );
      const yPos = 6 - idx * 7.5;
      const xPos = (idx % 2 === 0 ? 1 : -1) * (4.8 + (idx % 3) * 1.2);
      const zPos = -idx * 4 + Math.sin(idx) * 2;
      tokenMesh.position.set(xPos, yPos, zPos);
      workspaceGroup.add(tokenMesh);
      techTokenMeshes.push({
        mesh: tokenMesh,
        basePos: tokenMesh.position.clone(),
        speed: 0.8 + (idx % 3) * 0.3,
        phase: idx * 0.8,
      });
    });

    // 8. Flowing API HTTP Packets & Matrix Code Particles
    const packetStreamCount = isMobile ? 350 : 800;
    const packetStreamGeo = new THREE.BufferGeometry();
    const packetStreamPos = new Float32Array(packetStreamCount * 3);
    const packetStreamColors = new Float32Array(packetStreamCount * 3);

    const devPalette = [
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0x00e5ff), // Cyan
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0xf59e0b), // Amber
    ];

    for (let dp = 0; dp < packetStreamCount; dp++) {
      const idx = dp * 3;
      packetStreamPos[idx] = (Math.random() - 0.5) * 50;
      packetStreamPos[idx + 1] = (Math.random() - 0.5) * 110 - 35;
      packetStreamPos[idx + 2] = (Math.random() - 0.5) * 50 - 15;

      const col = devPalette[Math.floor(Math.random() * devPalette.length)];
      packetStreamColors[idx] = col.r;
      packetStreamColors[idx + 1] = col.g;
      packetStreamColors[idx + 2] = col.b;
    }

    packetStreamGeo.setAttribute('position', new THREE.BufferAttribute(packetStreamPos, 3));
    packetStreamGeo.setAttribute('color', new THREE.BufferAttribute(packetStreamColors, 3));

    const packetStreamMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const packetStream = new THREE.Points(packetStreamGeo, packetStreamMat);
    workspaceGroup.add(packetStream);

    // Event Handlers
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // 8. Render Loop & Terminal Animation
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let termFrame = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      termFrame++;

      // Animate Terminal Canvas content every 10 frames
      if (termFrame % 8 === 0) {
        termCtx.fillStyle = 'rgba(5, 10, 20, 0.95)';
        termCtx.fillRect(0, 0, 1024, 768);

        // Terminal Titlebar
        termCtx.fillStyle = '#0f172a';
        termCtx.fillRect(0, 0, 1024, 60);

        termCtx.fillStyle = '#ef4444';
        termCtx.beginPath();
        termCtx.arc(32, 30, 8, 0, Math.PI * 2);
        termCtx.fill();

        termCtx.fillStyle = '#f59e0b';
        termCtx.beginPath();
        termCtx.arc(60, 30, 8, 0, Math.PI * 2);
        termCtx.fill();

        termCtx.fillStyle = '#10b981';
        termCtx.beginPath();
        termCtx.arc(88, 30, 8, 0, Math.PI * 2);
        termCtx.fill();

        termCtx.fillStyle = '#e2e8f0';
        termCtx.font = 'bold 22px monospace';
        termCtx.fillText('fuzail@tech-solution-enterprise: ~/production-workspace', 130, 38);

        // Live CLI commands stream
        const termLines = [
          { text: '$ git status', color: '#94a3b8' },
          { text: 'On branch main: Your branch is up to date with origin/main.', color: '#38bdf8' },
          { text: '$ mvn clean compile test -Penterprise-erp', color: '#94a3b8' },
          { text: '[INFO] Running com.techsolution.erp.SupplyChainTestSuite', color: '#f59e0b' },
          { text: '[INFO] Tests run: 48, Failures: 0, Errors: 0, Skipped: 0', color: '#10b981' },
          { text: '[INFO] BUILD SUCCESS [ 2.458 s ]', color: '#10b981' },
          { text: '$ docker-compose up -d --scale microservice=4', color: '#94a3b8' },
          { text: '✔ Container erp-gateway       Started', color: '#10b981' },
          { text: '✔ Container erp-supply-chain  Started (4/4)', color: '#10b981' },
          { text: '✔ Container postgres-cluster  Healthy (ACID Tier)', color: '#10b981' },
          { text: `● Listening on 0.0.0.0:8080 [ UPTIME: ${Math.floor(elapsedTime * 10)}s ]`, color: '#38bdf8' },
          { text: '$ ready for incoming API traffic' + (Math.sin(elapsedTime * 6) > 0 ? ' _' : '  '), color: '#00e5ff' },
        ];

        termCtx.font = '22px monospace';
        let ty = 120;
        termLines.forEach((tl) => {
          termCtx.fillStyle = tl.color;
          termCtx.fillText(tl.text, 40, ty);
          ty += 42;
        });
        termTex.needsUpdate = true;
      }

      // Mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const p = THREE.MathUtils.clamp(scrollRef.current, 0, 1);

      // Camera smoothly navigates through code panels
      const targetCamY = THREE.MathUtils.lerp(2, -75, p);
      const targetCamZ = THREE.MathUtils.lerp(18, 14, p);
      const targetCamX = Math.sin(p * Math.PI * 1.5) * 3.0;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX + mouseRef.current.x * 2.2, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY + mouseRef.current.y * 1.5, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.05);

      const lookTarget = new THREE.Vector3(0, targetCamY - 1.5, targetCamZ - 18);
      camera.lookAt(lookTarget);

      // Floating code panel oscillations
      codePanels.forEach((cp, idx) => {
        cp.mesh.position.y = cp.basePos.y + Math.sin(elapsedTime * 1.2 + idx * 1.5) * 0.25;
        cp.mesh.rotation.y = cp.mesh.rotation.y + Math.sin(elapsedTime * 0.5 + idx) * 0.001;
      });

      // Floating technology tokens animation
      techTokenMeshes.forEach((t) => {
        t.mesh.position.y = t.basePos.y + Math.sin(elapsedTime * t.speed + t.phase) * 0.22;
        t.mesh.rotation.y = Math.sin(elapsedTime * 0.4 + t.phase) * 0.12;
      });

      // Docker wireframe rotation
      dockerGroup.rotation.y = elapsedTime * 0.25;
      dockerCore.rotation.x = -elapsedTime * 0.4;
      dockerCore.rotation.z = elapsedTime * 0.3;

      // Git commit pulses
      commitNodes.forEach((node, idx) => {
        const pulse = 1 + Math.sin(elapsedTime * 4 + idx * 1.2) * 0.15;
        node.scale.set(pulse, pulse, pulse);
      });

      // Packet streams flowing downward like matrix stream
      const posAttr = packetStreamGeo.attributes.position as THREE.BufferAttribute;
      for (let s = 0; s < packetStreamCount; s++) {
        let py = posAttr.getY(s) - 0.15;
        if (py < -90) py = 30;
        posAttr.setY(s, py);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      javaTex.dispose();
      termTex.dispose();
      tsTex.dispose();
      sqlTex.dispose();
      panelGeo.dispose();
      p1Mat.dispose();
      p2Mat.dispose();
      p3Mat.dispose();
      p4Mat.dispose();
      gitLine.geometry.dispose();
      (gitLine.material as THREE.Material).dispose();
      commitNodes.forEach((cn) => {
        cn.geometry.dispose();
        (cn.material as THREE.Material).dispose();
      });
      dockerBox.geometry.dispose();
      (dockerBox.material as THREE.Material).dispose();
      dockerCore.geometry.dispose();
      (dockerCore.material as THREE.Material).dispose();
      packetStreamGeo.dispose();
      packetStreamMat.dispose();
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
