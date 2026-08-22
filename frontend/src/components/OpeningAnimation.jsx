import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Activity, 
  Sparkles, 
  Cpu, 
  Globe,
  Layers,
  ChevronRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

function getInstantMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#828994';
  ctx.fillRect(0, 0, 512, 256);

  const maria = [
    { x: 190, y: 80, rx: 65, ry: 45, color: '#3d4450' },
    { x: 260, y: 90, rx: 45, ry: 35, color: '#383f4b' },
    { x: 290, y: 130, rx: 50, ry: 40, color: '#353c48' },
    { x: 120, y: 110, rx: 80, ry: 70, color: '#404754' },
    { x: 280, y: 175, rx: 35, ry: 30, color: '#444b58' },
    { x: 340, y: 115, rx: 35, ry: 35, color: '#323944' },
    { x: 250, y: 220, rx: 55, ry: 30, color: '#4a515e' }
  ];

  maria.forEach(m => {
    ctx.beginPath();
    ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = m.color;
    ctx.fill();
  });

  const craters = [
    { x: 230, y: 190, r: 9, ray: true },
    { x: 170, y: 115, r: 7, ray: true },
    { x: 130, y: 115, r: 5, ray: true },
    { x: 256, y: 245, r: 8, ray: false }
  ];

  craters.forEach(c => {
    if (c.ray) {
      ctx.strokeStyle = 'rgba(230, 235, 245, 0.35)';
      ctx.lineWidth = 1;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + Math.cos(a) * 45, c.y + Math.sin(a) * 45);
        ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#1e2430';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const MiniMoonGlobe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const size = 120;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 2.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);

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

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/assets/real-moon/moon1024x512.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps = true;
        material.map = tex;
        material.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('Fallback texture active in mini globe', err);
      }
    );

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(2.2, 1.0, 2.4);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xdce3ef, 0.7);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
    rimLight.position.set(-2.0, 1.2, -1.0);
    scene.add(rimLight);

    const clock = new THREE.Clock();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      moon.rotation.y += delta * 0.22;
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

const NOOP = () => {};

export const OpeningAnimation = ({ onComplete = NOOP }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
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

      stars.forEach(star => {
        star.alpha += star.speed * star.direction;
        if (star.alpha > 0.95 || star.alpha < 0.15) {
          star.direction *= -1;
        }
        ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.1, star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.save();
      ctx.translate(width / 2, height / 2);
      angle += 0.003;
      ctx.rotate(angle);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.10)';
      ctx.setLineDash([2, 6]);
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

  // Pure Interval with direct cleanup
  useEffect(() => {
    let count = 0;
    const timerId = setInterval(() => {
      count += 2;
      if (count >= 100) {
        clearInterval(timerId);
        setProgress(100);
        setStageIndex(4);
        soundManager.playLaunch();
        setIsClosing(true);
        onComplete();
      } else {
        setProgress(count);
        setStageIndex(Math.min(Math.floor((count / 100) * 4), 3));
      }
    }, 35);

    return () => {
      clearInterval(timerId);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#030712] select-none overflow-hidden transition-[opacity,transform] duration-700 ${
        isClosing ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full mx-4 p-8 rounded-3xl bg-[#070B14]/85 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)] flex flex-col items-center text-center">
        
        <div className="relative mb-6 flex items-center justify-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.35)]">
            <MiniMoonGlobe />
          </div>
          
          <div className="absolute -inset-3 border border-cyan-400/30 rounded-full animate-ping opacity-25 pointer-events-none" />
          <div className="absolute -inset-6 border border-purple-500/20 rounded-full border-dashed animate-spin-slow pointer-events-none" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-3 shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>AUTONOMOUS LUNAR DECISION SYSTEM</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 font-mono tracking-tight mb-2">
          LUNAR HABITAT AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-md mb-6 leading-relaxed">
          High-Precision Decision Support System for Artemis & ISRO Lunar South Pole Habitat Candidate Site Optimization
        </p>

        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyan-400 flex items-center gap-1.5 font-semibold">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{BOOT_STAGES[stageIndex]?.tag || 'INITIALIZING'}</span>
            </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-slate-900/90 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-purple-500 transition-[width] duration-75 shadow-glow-cyan"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="h-5 flex items-center justify-center">
            <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate animate-pulse">
              {BOOT_STAGES[stageIndex]?.label || 'Loading...'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>LOLA 118m LDEM</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>XGBoost ML Vector</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>MCDA Multi-Criteria</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setIsClosing(true);
            onComplete();
          }}
          aria-label="Skip initialization sequence"
          className="mt-5 text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group cursor-pointer"
        >
          <span>Skip Initialization Sequence</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default OpeningAnimation;
