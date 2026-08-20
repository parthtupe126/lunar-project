import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Sparkles, Activity, Globe, Compass, ChevronRight, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();

    // High-Resolution NASA 4K Albedo & Normal Mapping
    const colorMap = textureLoader.load('/assets/real-moon/moon_4k_color_brim16.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.generateMipmaps = true;
    });

    const normalMap = textureLoader.load('/assets/real-moon/lola_ldem_4k_normal.jpg', (tex) => {
      tex.anisotropy = 16;
      tex.generateMipmaps = true;
    });

    const bumpMap = textureLoader.load('/assets/real-moon/lola_ldem_4k_bump.jpg');

    const geometry = new THREE.SphereGeometry(0.96, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(2.2, 2.2),
      bumpMap: bumpMap,
      bumpScale: 0.06,
      roughness: 0.90,
      metalness: 0.04
    });

    const moon = new THREE.Mesh(geometry, material);
    moon.rotation.y = Math.PI * 0.4;
    scene.add(moon);

    // 1. Key Direct Sunlight at grazing angle for dramatic 3D crater shadows
    const sunLight = new THREE.DirectionalLight(0xfffdf5, 3.8);
    sunLight.position.set(2.4, 1.2, 2.2);
    scene.add(sunLight);

    // 2. Soft Earthshine fill (prevents total darkness on dark side)
    const earthshine = new THREE.DirectionalLight(0x38bdf8, 0.65);
    earthshine.position.set(-2.0, -0.6, 1.2);
    scene.add(earthshine);

    // 3. Subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 4. Cyan orbital atmospheric rim glow
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
    rimLight.position.set(-2.2, 1.5, -1.0);
    scene.add(rimLight);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      moon.rotation.y += 0.008; // Smooth photorealistic lunar spin
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
