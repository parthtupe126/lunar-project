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
      moon.rotation.y += 0.0035; // Gentle, slow photorealistic lunar spin
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

      {/* Central Clean Aerospace Modal */}
      <div className="relative z-10 max-w-md w-full mx-4 p-7 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
        
        {/* Photorealistic 3D Spinning Moon Sphere */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="relative w-26 h-26 rounded-full overflow-hidden flex items-center justify-center border border-slate-700 shadow-md">
            <MiniMoonGlobe />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>MISSION STUDIO INITIALIZATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
            Lunar Habitat Intelligence
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Autonomous site assessment, 3D altimetry & spatial suitability modeling
          </p>
        </div>

        {/* Dynamic Telemetry Stage Card */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-left">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              {BOOT_STAGES[stageIndex]?.tag || 'INITIALIZING'}
            </span>
            <span className="font-mono text-xs text-slate-400">{Math.round(progress)}%</span>
          </div>

          {/* Precision Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Live Log readout */}
          <div className="text-[11px] font-mono text-slate-400 truncate flex items-center gap-1.5">
            <span className="text-blue-400">❯</span>
            <span>{BOOT_STAGES[stageIndex]?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningAnimation;
