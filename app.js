/* =============================================================
   LUNAR VISUALIZATION — Canvas Renderer
   Draws a realistic high-contrast lunar south pole terrain
   ============================================================= */

'use strict';

/* ─── SITE DATA ─── */
const SITES = [
  {
    id: '01',
    name: 'Shackleton Crater Rim',
    badge: 'HIGHLY SUITABLE',
    badgeClass: 'site-badge--high',
    score: 90.2,
    confidence: 93,
    iceTraverse: 350,
    pct: 81,
    status: 'High',
    coords: 'Lat: −89.28° S · Lon: 15.40° E · Alt: 4120m',
    shortCoords: 'Lat: -89.9° | Lon: 0.0° | Alt: 4310m',
    metrics: {
      terrain:   { val: 94, sub: '(4.2°)',   type: 'high' },
      ice:       { val: 89, sub: '(19.5%)',  type: 'high' },
      solar:     { val: 97, sub: '(95.2%)',  type: 'high' },
      radiation: { val: 84, sub: '(280 mSv)',type: 'moderate' },
      landing:   { val: 82, sub: '',         type: 'moderate' },
    }
  },
  {
    id: '02',
    name: 'Faulkes Crater',
    badge: 'HIGHLY SUITABLE',
    badgeClass: 'site-badge--high',
    score: 76.4,
    confidence: 88,
    iceTraverse: 820,
    pct: 76,
    status: 'High',
    coords: 'Lat: −75.20° S · Lon: 30.80° E · Alt: 3920m',
    shortCoords: 'Lat: -75.2° | Lon: 30.8° | Alt: 3920m',
    metrics: {
      terrain:   { val: 78, sub: '(6.1°)',   type: 'high' },
      ice:       { val: 72, sub: '(14.2%)',  type: 'high' },
      solar:     { val: 81, sub: '(82.4%)',  type: 'high' },
      radiation: { val: 74, sub: '(320 mSv)',type: 'moderate' },
      landing:   { val: 76, sub: '',         type: 'high' },
    }
  },
  {
    id: '03',
    name: 'Malapert Massif',
    badge: 'HIGHLY SUITABLE',
    badgeClass: 'site-badge--high',
    score: 72.1,
    confidence: 85,
    iceTraverse: 1200,
    pct: 72,
    status: 'High',
    coords: 'Lat: −86.60° S · Lon: −10.90° E · Alt: 2880m',
    shortCoords: 'Lat: -86.6° | Lon: -10.9° | Alt: 2880m',
    metrics: {
      terrain:   { val: 72, sub: '(7.8°)',   type: 'high' },
      ice:       { val: 65, sub: '(11.8%)',  type: 'moderate' },
      solar:     { val: 88, sub: '(89.1%)',  type: 'high' },
      radiation: { val: 70, sub: '(360 mSv)',type: 'moderate' },
      landing:   { val: 71, sub: '',         type: 'high' },
    }
  },
  {
    id: '04',
    name: 'Peak Near Shackleton',
    badge: 'MODERATELY SUITABLE',
    badgeClass: 'site-badge--moderate',
    score: 69.0,
    confidence: 81,
    iceTraverse: 650,
    pct: 69,
    status: 'Moderate',
    coords: 'Lat: −88.30° S · Lon: 15.10° E · Alt: 4120m',
    shortCoords: 'Lat: -88.3° | Lon: 15.1° | Alt: 4120m',
    metrics: {
      terrain:   { val: 68, sub: '(9.3°)',   type: 'moderate' },
      ice:       { val: 74, sub: '(15.6%)',  type: 'high' },
      solar:     { val: 72, sub: '(74.8%)',  type: 'high' },
      radiation: { val: 65, sub: '(390 mSv)',type: 'moderate' },
      landing:   { val: 62, sub: '',         type: 'moderate' },
    }
  },
  {
    id: '05',
    name: 'Aristarchus Plateau',
    badge: 'MODERATELY SUITABLE',
    badgeClass: 'site-badge--moderate',
    score: 66.0,
    confidence: 78,
    iceTraverse: 3400,
    pct: 66,
    status: 'Moderate',
    coords: 'Lat: 23.70° N · Lon: 47.00° E · Alt: 3100m',
    shortCoords: 'Lat: 23.7° | Lon: 47.0° | Alt: 3100m',
    metrics: {
      terrain:   { val: 71, sub: '(8.1°)',   type: 'high' },
      ice:       { val: 28, sub: '(2.4%)',   type: 'moderate' },
      solar:     { val: 84, sub: '(86.0%)',  type: 'high' },
      radiation: { val: 60, sub: '(440 mSv)',type: 'moderate' },
      landing:   { val: 69, sub: '',         type: 'moderate' },
    }
  },
];

/* ─── LUNAR CANVAS RENDERER ─── */
class LunarRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.raf = null;
    this.time = 0;
    this.resize();
    this.bindEvents();
  }

  resize() {
    const wrap = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.W = w;
    this.H = h;
    this.draw();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
  }

  draw() {
    const { ctx, W, H } = this;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const r = Math.min(W, H) * 0.43;

    // Moon sphere — base gradient (realistic cool gray)
    const moonGrad = ctx.createRadialGradient(
      cx - r * 0.28, cy - r * 0.22, r * 0.05,
      cx, cy, r
    );
    moonGrad.addColorStop(0.00, '#D8DADC');
    moonGrad.addColorStop(0.12, '#BCBFC3');
    moonGrad.addColorStop(0.28, '#9EA2A8');
    moonGrad.addColorStop(0.48, '#7A7F88');
    moonGrad.addColorStop(0.65, '#585E68');
    moonGrad.addColorStop(0.80, '#363C46');
    moonGrad.addColorStop(0.90, '#1E2530');
    moonGrad.addColorStop(1.00, '#0A0F18');

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = moonGrad;
    ctx.fill();

    // Clip all terrain to the sphere
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // ── Crater morphology layer ──
    this.drawCraters(ctx, cx, cy, r);

    // ── Terminator shadow (right side) ──
    const terminator = ctx.createRadialGradient(
      cx + r * 0.6, cy, r * 0.2,
      cx + r * 0.4, cy, r * 1.1
    );
    terminator.addColorStop(0, 'rgba(0,0,0,0)');
    terminator.addColorStop(0.5, 'rgba(0,0,0,0)');
    terminator.addColorStop(0.82, 'rgba(0,0,0,0.25)');
    terminator.addColorStop(1.0, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = terminator;
    ctx.fillRect(0, 0, W, H);

    // ── South polar deep shadow (bottom) ──
    const polarShadow = ctx.createRadialGradient(cx, cy + r * 0.5, r * 0.1, cx, cy + r * 0.7, r * 0.65);
    polarShadow.addColorStop(0, 'rgba(0,0,0,0)');
    polarShadow.addColorStop(0.4, 'rgba(0,0,0,0.2)');
    polarShadow.addColorStop(1.0, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = polarShadow;
    ctx.fillRect(0, 0, W, H);

    // ── Shackleton crater (prominent south polar crater) ──
    this.drawShackleton(ctx, cx, cy, r);

    // ── Surface limb highlight ──
    const limbGrad = ctx.createRadialGradient(
      cx - r * 0.35, cy - r * 0.3, r * 0.6,
      cx - r * 0.25, cy - r * 0.2, r * 1.02
    );
    limbGrad.addColorStop(0, 'rgba(255,255,255,0)');
    limbGrad.addColorStop(0.88, 'rgba(255,255,255,0)');
    limbGrad.addColorStop(0.94, 'rgba(255,255,255,0.05)');
    limbGrad.addColorStop(1.0, 'rgba(255,255,255,0.12)');
    ctx.fillStyle = limbGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.restore();

    // Outer glow / atmosphere rim
    const rimGlow = ctx.createRadialGradient(cx, cy, r * 0.97, cx, cy, r * 1.06);
    rimGlow.addColorStop(0, 'rgba(180,195,220,0.08)');
    rimGlow.addColorStop(0.5, 'rgba(120,145,180,0.04)');
    rimGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.06, 0, Math.PI * 2);
    ctx.fillStyle = rimGlow;
    ctx.fill();
  }

  drawCraters(ctx, cx, cy, r) {
    // Pre-defined realistic crater positions (normalized to radius)
    const craters = [
      // Large mare / basin areas
      { x: 0.08, y: -0.15, r: 0.28, depth: 0.55, type: 'basin' },
      { x: -0.22, y: 0.18, r: 0.20, depth: 0.45, type: 'basin' },
      { x: 0.30, y: 0.05, r: 0.16, depth: 0.50, type: 'basin' },
      // Medium craters
      { x: -0.10, y: -0.35, r: 0.09, depth: 0.65, type: 'crater' },
      { x: 0.35, y: -0.30, r: 0.07, depth: 0.70, type: 'crater' },
      { x: -0.40, y: -0.08, r: 0.08, depth: 0.60, type: 'crater' },
      { x: 0.18, y: 0.38, r: 0.10, depth: 0.55, type: 'crater' },
      { x: -0.28, y: 0.40, r: 0.06, depth: 0.68, type: 'crater' },
      { x: 0.42, y: 0.25, r: 0.07, depth: 0.62, type: 'crater' },
      // Small craters
      { x: 0.10, y: 0.20, r: 0.04, depth: 0.75, type: 'small' },
      { x: -0.15, y: 0.05, r: 0.035, depth: 0.70, type: 'small' },
      { x: 0.25, y: -0.10, r: 0.03, depth: 0.72, type: 'small' },
      { x: -0.35, y: 0.28, r: 0.04, depth: 0.68, type: 'small' },
      { x: 0.08, y: -0.42, r: 0.05, depth: 0.73, type: 'small' },
      { x: -0.05, y: 0.42, r: 0.05, depth: 0.65, type: 'small' },
      { x: 0.38, y: -0.12, r: 0.03, depth: 0.76, type: 'small' },
      { x: -0.42, y: 0.15, r: 0.04, depth: 0.65, type: 'small' },
    ];

    craters.forEach(c => {
      const px = cx + c.x * r;
      const py = cy + c.y * r;
      const cr = c.r * r;

      if (c.type === 'basin') {
        // Large basin — soft, mare-like
        const bg = ctx.createRadialGradient(
          px - cr * 0.25, py - cr * 0.2, cr * 0.1,
          px, py, cr
        );
        bg.addColorStop(0, `rgba(60,65,72,${c.depth * 0.4})`);
        bg.addColorStop(0.4, `rgba(45,50,58,${c.depth * 0.5})`);
        bg.addColorStop(0.8, `rgba(30,35,42,${c.depth * 0.35})`);
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.ellipse(px, py, cr, cr * 0.85, 0, 0, Math.PI * 2);
        ctx.fillStyle = bg;
        ctx.fill();
      } else {
        // Impact crater — darker floor, bright rim
        const cg = ctx.createRadialGradient(
          px + cr * 0.15, py - cr * 0.15, 0,
          px, py, cr
        );
        cg.addColorStop(0.0, `rgba(15,18,24,${c.depth * 0.85})`);
        cg.addColorStop(0.5, `rgba(20,24,32,${c.depth * 0.7})`);
        cg.addColorStop(0.82, `rgba(35,38,45,${c.depth * 0.4})`);
        cg.addColorStop(0.90, `rgba(180,185,192,${c.depth * 0.12})`); // bright rim
        cg.addColorStop(1.0, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(px, py, cr, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
      }
    });
  }

  drawShackleton(ctx, cx, cy, r) {
    // Shackleton — prominent deep crater near south pole
    // Located slightly above center-bottom
    const sx = cx + 0.04 * r;
    const sy = cy + 0.22 * r;
    const sr = 0.14 * r;

    // Deep permanently shadowed interior
    const sg = ctx.createRadialGradient(
      sx + sr * 0.1, sy - sr * 0.1, sr * 0.05,
      sx, sy, sr
    );
    sg.addColorStop(0.00, 'rgba(4,5,8,0.97)');
    sg.addColorStop(0.35, 'rgba(6,8,12,0.92)');
    sg.addColorStop(0.68, 'rgba(14,18,26,0.75)');
    sg.addColorStop(0.85, 'rgba(55,60,70,0.55)');  // inner wall
    sg.addColorStop(0.92, 'rgba(145,150,158,0.25)'); // rim bright
    sg.addColorStop(1.00, 'rgba(0,0,0,0)');

    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = sg;
    ctx.fill();

    // Sharp bright rim on sun-facing side
    const rimG = ctx.createLinearGradient(sx - sr, sy - sr, sx + sr * 0.4, sy + sr * 0.4);
    rimG.addColorStop(0, 'rgba(220,225,232,0.18)');
    rimG.addColorStop(0.4, 'rgba(180,185,195,0.08)');
    rimG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 1.02, 0, Math.PI * 2);
    ctx.strokeStyle = rimG;
    ctx.lineWidth = sr * 0.06;
    ctx.stroke();
  }
}

/* ─── STATE ─── */
let selectedSite = 0;
let vizMode = 'hc';

/* ─── DOM HELPERS ─── */
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

/* ─── INITIALIZE LUNAR CANVAS ─── */
function initLunarCanvas() {
  const canvas = $('lunar-canvas');
  if (!canvas) return;
  new LunarRenderer(canvas);
}

/* ─── SLIDER INTERACTIVITY ─── */
function initSliders() {
  const sliders = [
    { sliderId: 'slider-terrain',  valId: 'val-terrain'  },
    { sliderId: 'slider-solar',    valId: 'val-solar'    },
    { sliderId: 'slider-ice',      valId: 'val-ice'      },
    { sliderId: 'slider-radiation',valId: 'val-radiation'},
    { sliderId: 'slider-landing',  valId: 'val-landing'  },
  ];

  sliders.forEach(({ sliderId, valId }) => {
    const slider = $(sliderId);
    const valEl  = $(valId);
    if (!slider || !valEl) return;

    const update = () => {
      const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.setProperty('--fill-pct', pct + '%');
      valEl.textContent = slider.value + '%';
    };

    update();
    slider.addEventListener('input', update);
  });
}

/* ─── RESET CONTROLS ─── */
function initReset() {
  const btn = $('btn-reset-controls');
  if (!btn) return;
  const defaults = {
    'slider-terrain':   20,
    'slider-solar':     25,
    'slider-ice':       25,
    'slider-radiation': 15,
    'slider-landing':   15,
  };
  btn.addEventListener('click', () => {
    Object.entries(defaults).forEach(([id, val]) => {
      const el = $(id);
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event('input'));
      }
    });
  });
}

/* ─── VIZ MODE BUTTONS ─── */
function initVizModes() {
  const btns = $$('.viz-mode-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('viz-mode-btn--active'));
      btn.classList.add('viz-mode-btn--active');
      vizMode = btn.dataset.mode;
    });
  });
}

/* ─── EXPLORE FILTER ─── */
function initExplore() {
  const btns = $$('.explore-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('explore-btn--active'));
      btn.classList.add('explore-btn--active');
    });
  });
}

/* ─── SITE SELECTION ─── */
function selectSite(index) {
  if (index === selectedSite) return;
  selectedSite = index;
  const site = SITES[index];

  // Update scoreboard active state
  $$('.score-row').forEach((row, i) => {
    row.classList.toggle('score-row--active', i === index);
  });

  // Update markers
  $$('.site-marker').forEach((m, i) => {
    m.classList.toggle('site-marker--active', i === index);
  });

  // Animate metrics update
  updateSiteDetail(site);
}

function updateSiteDetail(site) {
  // Site name & metadata
  const nameEl = $('site-name');
  const coordEl = $('site-coords');
  const badgeEl = $('site-badge');
  const scoreEl = $('suit-score');

  if (nameEl) {
    nameEl.style.opacity = '0';
    nameEl.style.transform = 'translateY(4px)';
    requestAnimationFrame(() => {
      nameEl.textContent = site.name;
      nameEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      nameEl.style.opacity = '1';
      nameEl.style.transform = 'translateY(0)';
    });
  }

  if (coordEl) coordEl.textContent = site.coords;

  if (badgeEl) {
    badgeEl.textContent = site.badge;
    badgeEl.className = 'site-badge ' + site.badgeClass;
  }

  if (scoreEl) {
    scoreEl.innerHTML = site.score.toFixed(1) + '<span class="suit-denom">/100</span>';
  }

  // Update confidence & ice traverse
  const metaVals = document.querySelectorAll('.suit-meta-val');
  if (metaVals[0]) metaVals[0].textContent = site.confidence + '%';
  if (metaVals[1]) metaVals[1].textContent = site.iceTraverse + 'm';

  // Update radial chart
  const radial = $('radial-progress');
  if (radial) {
    const circumference = 2 * Math.PI * 32; // r=32
    const dashLen = (site.score / 100) * circumference;
    radial.style.transition = 'stroke-dasharray 0.5s ease';
    radial.setAttribute('stroke-dasharray', `${dashLen.toFixed(1)} ${circumference}`);
    // Update score text
    const texts = radial.closest('svg').querySelectorAll('text');
    if (texts[0]) texts[0].textContent = site.score.toFixed(1);
  }

  // Update metric bars
  const metricKeys = ['terrain', 'ice', 'solar', 'radiation', 'landing'];
  const barIds = ['bar-terrain', 'bar-ice', 'bar-solar', 'bar-radiation', 'bar-access'];
  const valEls = document.querySelectorAll('.metric-val');

  metricKeys.forEach((key, i) => {
    const m = site.metrics[key];
    const bar = $(barIds[i]);
    if (bar) {
      bar.style.transition = 'width 0.45s ease';
      bar.style.width = m.val + '%';
      bar.className = `metric-bar-fill metric-bar-fill--${m.type}`;
    }
    if (valEls[i]) {
      valEls[i].innerHTML = `${m.val}% <span class="metric-sub">${m.sub}</span>`;
    }
  });

  // Update site rank badge
  const rankBadge = document.querySelector('.site-rank-badge');
  if (rankBadge) rankBadge.textContent = site.id;
}

function initScoreboard() {
  $$('.score-row').forEach((row, i) => {
    const activate = () => selectSite(i);
    row.addEventListener('click', activate);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
}

function initMarkers() {
  $$('.site-marker').forEach((m, i) => {
    const activate = () => selectSite(i);
    m.addEventListener('click', activate);
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
}

/* ─── FULLSCREEN ─── */
function initFullscreen() {
  const btn = $('btn-fullscreen');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

/* ─── ACTION BUTTONS ─── */
function initActions() {
  const telBtn = $('btn-telemetry');
  if (telBtn) {
    telBtn.addEventListener('click', () => {
      // Visual feedback
      telBtn.style.opacity = '0.7';
      setTimeout(() => telBtn.style.opacity = '', 200);
    });
  }

  const dossierBtn = $('btn-dossier-action');
  if (dossierBtn) {
    dossierBtn.addEventListener('click', () => {
      dossierBtn.style.opacity = '0.7';
      setTimeout(() => dossierBtn.style.opacity = '', 200);
    });
  }

  const navDossier = $('btn-dossier');
  if (navDossier) {
    navDossier.addEventListener('click', () => {
      if (dossierBtn) dossierBtn.click();
    });
  }
}

/* ─── ROTATION TOGGLE ─── */
function initRotationToggle() {
  var btn   = $('btn-rotation-toggle');
  var label = $('rotation-label');
  var icon  = $('rotation-icon');
  if (!btn) return;

  btn.addEventListener('click', function() {
    // moon3d may not be ready yet if Three.js is still loading
    if (!window.moon3d || typeof window.moon3d.toggleRotation !== 'function') return;
    var isRotating = window.moon3d.toggleRotation();
    if (isRotating) {
      label.textContent = 'Stop Rotation';
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.remove('rotation-toggle-btn--paused');
      icon.style.animationPlayState = 'running';
    } else {
      label.textContent = 'Start Rotation';
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.add('rotation-toggle-btn--paused');
      icon.style.animationPlayState = 'paused';
    }
  });
}

/* ─── MAIN INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  initLunarCanvas();
  initSliders();
  initReset();
  initVizModes();
  initExplore();
  initScoreboard();
  initMarkers();
  initFullscreen();
  initActions();
  initRotationToggle();
});
