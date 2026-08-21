import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Sparkles, Activity, Globe, Compass, ChevronRight, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

const getInstantMoonTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Base silvery-grey lunar albedo
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
  bgGrad.addColorStop(0, '#c2cbd7');
  bgGrad.addColorStop(0.5, '#a4adb9');
  bgGrad.addColorStop(1, '#8b94a2');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 256);

  // Soft lunar maria (lunar seas)
  const maria = [
    { x: 130, y: 110, rx: 65, ry: 42, color: 'rgba(52, 59, 70, 0.52)' },
    { x: 230, y: 95, rx: 50, ry: 35, color: 'rgba(48, 55, 65, 0.55)' },
    { x: 310, y: 115, rx: 60, ry: 40, color: 'rgba(46, 53, 62, 0.50)' },
    { x: 170, y: 70, rx: 45, ry: 30, color: 'rgba(50, 57, 66, 0.46)' },
    { x: 380, y: 130, rx: 55, ry: 38, color: 'rgba(58, 66, 76, 0.42)' },
    { x: 200, y: 175, rx: 42, ry: 26, color: 'rgba(55, 62, 72, 0.40)' }
  ];

  maria.forEach(m => {
    const g = ctx.createRadialGradient(m.x, m.y, 4, m.x, m.y, m.rx);
    g.addColorStop(0, m.color);
    g.addColorStop(0.7, m.color);
    g.addColorStop(1, 'rgba(120, 130, 145, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Soft highland crater rays & craters
  const craters = [
    { x: 180, y: 195, r: 14 },
    { x: 110, y: 95, r: 11 },
    { x: 250, y: 90, r: 9 },
    { x: 340, y: 140, r: 12 },
    { x: 420, y: 80, r: 10 }
  ];

  craters.forEach(c => {
    const rg = ctx.createRadialGradient(c.x, c.y, 1, c.x, c.y, c.r * 2.2);
    rg.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    rg.addColorStop(0.5, 'rgba(225, 232, 242, 0.15)');
    rg.addColorStop(1, 'rgba(180, 190, 205, 0)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    const cg = ctx.createRadialGradient(c.x - 1, c.y - 1, 1, c.x, c.y, c.r);
    cg.addColorStop(0, 'rgba(38, 43, 50, 0.65)');
    cg.addColorStop(0.7, 'rgba(65, 72, 82, 0.45)');
    cg.addColorStop(1, 'rgba(235, 240, 250, 0.35)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const MiniMoonGlobe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const size = 120; // 120px width/height

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 2.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);

    // Instant synchronous 0ms lunar texture
    const instantMap = getInstantMoonTexture();

    const geometry = new THREE.SphereGeometry(0.98, 48, 48);
    const material = new THREE.MeshStandardMaterial({
      map: instantMap,
      roughness: 0.92,
      metalness: 0.02
    });

    const moon = new THREE.Mesh(geometry, material);
    moon.rotation.y = Math.PI * 0.4;
    scene.add(moon);

    // Asynchronously load NASA photographic texture without blocking initial render
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/assets/real-moon/moon1024x512.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
      material.map = tex;
      material.needsUpdate = true;
    });

    // 1. Soft Warm Solar Light
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(2.2, 1.0, 2.4);
    scene.add(sunLight);

    // 2. Soft Ambient Earthshine for natural, blended shadow fill
    const ambientLight = new THREE.AmbientLight(0xdce3ef, 0.7);
    scene.add(ambientLight);

    // 3. Subtle Cyan Lunar Limb / Exosphere Rim Glow
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
    rimLight.position.set(-2.0, 1.2, -1.0);
    scene.add(rimLight);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      moon.rotation.y += 0.0035; // Gentle, smooth photorealistic spin
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-[120px] h-[120px] flex items-center justify-center pointer-events-none drop-shadow-[0_0_35px_rgba(6,182,212,0.45)]"
    />
  );
};

const BOOT_STAGES = [
  { label: 'CALIBRATING NASA LOLA 118m LASER ALTIMETRY & DIGITAL ELEVATION MODEL', tag: 'STAGE 01' },
  { label: 'LOADING LROC 8K MULTISPECTRAL SURFACE REGOLITH DATASETS', tag: 'STAGE 02' },
  { label: 'INITIALIZING MULTI-CRITERIA DECISION ANALYSIS (MCDA) ENGINE', tag: 'STAGE 03' },
  { label: 'SYNCHRONIZING ARTEMIS III & ISRO CHANDRAYAAN-3 ORBITAL TELEMETRY', tag: 'STAGE 04' },
  { label: 'LUNAR HABITAT AI STUDIO FULLY OPERATIONAL', tag: 'ONLINE' }
];

export const OpeningAnimation = ({ onComplete = () => {} }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const canvasRef = useRef(null);

  // Background Starfield & Orbit Rings Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate Stars
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Star Particles
      stars.forEach(s => {
        s.alpha += s.speed * s.direction;
        if (s.alpha > 1 || s.alpha < 0.2) s.direction *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Holographic Center Orbital HUD Rings
      const cx = width / 2;
      const cy = height / 2;
      angle += 0.008;

      // Outer Ring
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Dashed Rotating Ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, 165, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Reverse Dashed Outer Ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 0.7);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.setLineDash([14, 18]);
      ctx.beginPath();
      ctx.arc(0, 0, 195, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Progress Counter & Auto-Launch
  useEffect(() => {
    const duration = 2000; // 2.0 seconds smooth sequence
    const interval = 25;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setStageIndex(4);
          soundManager.playLaunch();
          setTimeout(() => {
            setIsClosing(true);
            setTimeout(() => {
              onComplete();
            }, 600);
          }, 300);
          return 100;
        }

        const stage = Math.min(Math.floor((next / 100) * 4), 3);
        setStageIndex(stage);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#030712] select-none overflow-hidden transition-all duration-700 ${
        isClosing ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Starfield & HUD Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Radial Gradient Glows */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

      {/* Central Interactive HUD Modal */}
      <div className="relative z-10 max-w-xl w-full mx-4 p-8 rounded-3xl bg-[#070B14]/85 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)] flex flex-col items-center text-center">
        
        {/* Holographic 3D Spinning Moon Sphere */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.35)]">
            <MiniMoonGlobe />
          </div>
          
          {/* Pulsing Target Brackets & Orbital Rings */}
          <div className="absolute -inset-3 border border-cyan-400/30 rounded-full animate-ping opacity-25 pointer-events-none" />
          <div className="absolute -inset-1.5 border border-purple-500/40 rounded-full pointer-events-none" />
        </div>

        {/* Brand Titles */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>LUNAR EXPLORATION MISSION CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 tracking-tight">
            LUNAR HABITAT AI
          </h1>
          <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
            Autonomous Site Selection, 3D Altimetry & Habitat Spatial Intelligence
          </p>
        </div>

        {/* Dynamic Telemetry Stage Card */}
        <div className="w-full bg-[#030712]/90 border border-slate-800/90 rounded-2xl p-4 text-left">
          <div className="flex items-center justify-between text-[11px] font-mono mb-2">
            <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              {BOOT_STAGES[stageIndex]?.tag || 'INITIALIZING'}
            </span>
            <span className="text-slate-400">{Math.round(progress)}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800 mb-3">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Live Log readout */}
          <div className="text-[11px] font-mono text-slate-300 truncate flex items-center gap-2">
            <span className="text-cyan-500">❯</span>
            <span className="typing-text">{BOOT_STAGES[stageIndex]?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningAnimation;
