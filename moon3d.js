/* =============================================================
   MOON 3D — Three.js Interactive Lunar Globe
   Features:
    * Procedural realistic moon surface (bump + crater shading)
    * Auto-rotation with smooth drag-to-rotate & inertia
    * Scroll / pinch to zoom
    * Clickable 3D habitat site markers with tooltips
    * Atmospheric rim glow
    * Starfield background
   ============================================================= */

'use strict';

(function () {

  /* ─── CONSTANTS ─── */
  var MOON_RADIUS = 2.2;
  var STAR_COUNT  = 2200;

  /* ─── SITE MARKER DEFINITIONS (lat/lon in degrees) ─── */
  var MARKER_SITES = [
    // 01 — Darker Blue
    { id: '01', name: 'Shackleton Crater Rim', lat: -89.28, lon:  15.40, color: '#0077AA', siteIndex: 0 },
    // 02 — Darker Green
    { id: '02', name: 'Faulkes Crater',         lat: -75.20, lon:  30.80, color: '#008844', siteIndex: 1 },
    // 03 — Darker Orange
    { id: '03', name: 'Malapert Massif',         lat: -86.60, lon: -10.90, color: '#BB5511', siteIndex: 2 },
    // 04 — Darker Magenta
    { id: '04', name: 'Peak Near Shackleton',    lat: -88.30, lon:  15.10, color: '#B31166', siteIndex: 3 },
    // 05 — Darker Gold
    { id: '05', name: 'Aristarchus Plateau',     lat:  23.70, lon:  47.00, color: '#B39900', siteIndex: 4 },
  ];

  /* ─── Convert lat/lon to XYZ on a sphere ─── */
  function latLonToXYZ(lat, lon, radius) {
    var phi   = (90 - lat)  * (Math.PI / 180);
    var theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
       radius * Math.cos(phi),
       radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  /* ─── Fast PRNG ─── */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ─── Procedural Moon Color Texture (Enhanced Realistic) ─── */
  function buildMoonTexture(size) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext('2d');

    // --- Base regolith gradient: warm off-white highlands to dark lowlands ---
    var base = ctx.createRadialGradient(size*0.32, size*0.30, size*0.01, size/2, size/2, size*0.75);
    base.addColorStop(0.00, '#E2E4E0');
    base.addColorStop(0.10, '#CCCEC8');
    base.addColorStop(0.25, '#B0B3AC');
    base.addColorStop(0.42, '#969890');
    base.addColorStop(0.58, '#787B74');
    base.addColorStop(0.74, '#535650');
    base.addColorStop(0.88, '#353830');
    base.addColorStop(1.00, '#1C1E1A');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    // --- Large mare (dark volcanic basalt plains) ---
    var mares = [
      // Oceanus Procellarum
      { x:0.32, y:0.35, rx:0.26, ry:0.20, alpha:0.52, r:8,  g:12, b:18 },
      // Mare Imbrium
      { x:0.44, y:0.28, rx:0.16, ry:0.14, alpha:0.48, r:10, g:14, b:20 },
      // Mare Serenitatis
      { x:0.62, y:0.30, rx:0.13, ry:0.11, alpha:0.44, r:12, g:16, b:22 },
      // Mare Tranquillitatis
      { x:0.64, y:0.42, rx:0.15, ry:0.12, alpha:0.42, r:14, g:18, b:24 },
      // Mare Crisium
      { x:0.80, y:0.34, rx:0.09, ry:0.08, alpha:0.50, r:10, g:14, b:20 },
      // Mare Nectaris
      { x:0.68, y:0.55, rx:0.08, ry:0.07, alpha:0.40, r:12, g:16, b:22 },
      // Mare Fecunditatis
      { x:0.77, y:0.50, rx:0.11, ry:0.09, alpha:0.38, r:14, g:18, b:24 },
      // South polar region — darker
      { x:0.50, y:0.82, rx:0.20, ry:0.10, alpha:0.45, r:8,  g:10, b:14 },
    ];
    mares.forEach(function(m) {
      var mg = ctx.createRadialGradient(m.x*size, m.y*size, 0, m.x*size, m.y*size, m.rx*size);
      mg.addColorStop(0,   'rgba(' + m.r + ',' + m.g + ',' + m.b + ',' + m.alpha + ')');
      mg.addColorStop(0.50, 'rgba(' + m.r + ',' + m.g + ',' + m.b + ',' + (m.alpha*0.6) + ')');
      mg.addColorStop(0.80, 'rgba(' + m.r + ',' + m.g + ',' + m.b + ',' + (m.alpha*0.2) + ')');
      mg.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.save();
      ctx.translate(m.x*size, m.y*size);
      ctx.scale(1, m.ry/m.rx);
      ctx.translate(-m.x*size, -m.y*size);
      ctx.beginPath();
      ctx.arc(m.x*size, m.y*size, m.rx*size, 0, Math.PI*2);
      ctx.fillStyle = mg;
      ctx.fill();
      ctx.restore();
    });

    // --- Bright ray systems (ejecta from young craters) ---
    var rng = mulberry32(0xDEADBEEF);
    var rays = [
      { cx:0.68, cy:0.72, count:12, len:0.28, alpha:0.12 }, // Tycho rays
      { cx:0.28, cy:0.25, count: 8, len:0.18, alpha:0.09 }, // Copernicus
      { cx:0.80, cy:0.60, count: 6, len:0.14, alpha:0.08 }, // Kepler
    ];
    rays.forEach(function(ray) {
      for (var ri = 0; ri < ray.count; ri++) {
        var angle = (ri / ray.count) * Math.PI * 2 + rng() * 0.3;
        var rayLen = (0.6 + rng() * 0.4) * ray.len * size;
        var rayW   = (0.003 + rng() * 0.004) * size;
        ctx.save();
        ctx.translate(ray.cx * size, ray.cy * size);
        ctx.rotate(angle);
        var rayG = ctx.createLinearGradient(0, 0, rayLen, 0);
        rayG.addColorStop(0,   'rgba(220,220,210,' + ray.alpha + ')');
        rayG.addColorStop(0.5, 'rgba(210,210,200,' + (ray.alpha*0.5) + ')');
        rayG.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = rayG;
        ctx.fillRect(0, -rayW/2, rayLen, rayW);
        ctx.restore();
      }
    });

    // --- Impact craters (large named) ---
    var bigCraters = [
      // [x, y, r, depthAlpha]  all normalized 0-1
      [0.68, 0.72, 0.068, 0.90], // Tycho
      [0.28, 0.25, 0.052, 0.84], // Copernicus
      [0.50, 0.85, 0.062, 0.92], // Shackleton area
      [0.30, 0.68, 0.042, 0.80], // Clavius
      [0.72, 0.20, 0.038, 0.78], // Plato
      [0.18, 0.44, 0.036, 0.76], // Grimaldi
      [0.80, 0.35, 0.032, 0.78], // Langrenus
      [0.42, 0.58, 0.030, 0.74], // Albategnius
      [0.60, 0.60, 0.028, 0.72], // Theophilus
      [0.22, 0.30, 0.044, 0.80], // Aristarchus
    ];
    // Smaller random craters
    for (var i = 0; i < 120; i++) {
      bigCraters.push([rng(), rng(), 0.004 + rng()*0.018, 0.45 + rng()*0.40]);
    }
    bigCraters.forEach(function(c) {
      var px = c[0]*size, py = c[1]*size, pr = c[2]*size, alpha = c[3];
      // Dark floor
      var cg = ctx.createRadialGradient(px + pr*0.1, py - pr*0.1, pr*0.05, px, py, pr);
      cg.addColorStop(0.00, 'rgba(8,9,12,'  + alpha + ')');
      cg.addColorStop(0.45, 'rgba(14,16,20,' + (alpha*0.80) + ')');
      cg.addColorStop(0.72, 'rgba(26,28,34,' + (alpha*0.50) + ')');
      cg.addColorStop(0.86, 'rgba(38,40,46,' + (alpha*0.28) + ')');
      cg.addColorStop(0.93, 'rgba(195,198,190,' + (alpha*0.22) + ')'); // bright rim
      cg.addColorStop(1.00, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI*2);
      ctx.fillStyle = cg;
      ctx.fill();
      // Central peak for large craters
      if (pr > size * 0.022) {
        var peakG = ctx.createRadialGradient(px, py, 0, px, py, pr*0.18);
        peakG.addColorStop(0,   'rgba(180,182,178,' + (alpha*0.28) + ')');
        peakG.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(px, py, pr*0.18, 0, Math.PI*2);
        ctx.fillStyle = peakG;
        ctx.fill();
      }
    });

    // --- Highland terrain texture (fine-grained regolith noise) ---
    var imgData = ctx.getImageData(0, 0, size, size);
    var d = imgData.data;
    for (var j = 0; j < d.length; j += 4) {
      // Multi-octave noise for realistic regolith
      var n1 = (rng() - 0.5) * 18;
      var n2 = (rng() - 0.5) * 8;
      var noise = n1 + n2;
      // Slight warm tint on bright areas (feldspathic highlands)
      var brightness = d[j];
      var warmth = brightness > 140 ? 3 : 0;
      d[j]   = Math.min(255, Math.max(0, d[j]   + noise + warmth));
      d[j+1] = Math.min(255, Math.max(0, d[j+1] + noise));
      d[j+2] = Math.min(255, Math.max(0, d[j+2] + noise - warmth));
    }
    ctx.putImageData(imgData, 0, 0);

    // --- Terminator edge darkening (subsolar limb variation) ---
    var terminatorGrad = ctx.createLinearGradient(size*0.05, 0, size*0.95, 0);
    terminatorGrad.addColorStop(0,    'rgba(0,0,0,0.18)');
    terminatorGrad.addColorStop(0.12, 'rgba(0,0,0,0)');
    terminatorGrad.addColorStop(0.88, 'rgba(0,0,0,0)');
    terminatorGrad.addColorStop(1,    'rgba(0,0,0,0.24)');
    ctx.fillStyle = terminatorGrad;
    ctx.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
  }

  /* ─── Procedural Bump / Displacement Map (Enhanced) ─── */
  function buildBumpTexture(size) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext('2d');
    // Mid-gray base
    ctx.fillStyle = '#909090';
    ctx.fillRect(0, 0, size, size);
    var rng = mulberry32(0xCAFEBABE);

    // Large basin depressions
    var basins = [
      [0.32, 0.35, 0.26],
      [0.44, 0.28, 0.16],
      [0.62, 0.30, 0.13],
      [0.64, 0.42, 0.15],
      [0.50, 0.82, 0.20],
    ];
    basins.forEach(function(b) {
      var bx = b[0]*size, by = b[1]*size, br = b[2]*size;
      var bg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bg.addColorStop(0,    '#606060');
      bg.addColorStop(0.7,  '#828282');
      bg.addColorStop(1,    '#909090');
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI*2);
      ctx.fillStyle = bg;
      ctx.fill();
    });

    // Many craters with distinct rim+floor profile
    for (var i = 0; i < 240; i++) {
      var px = rng()*size, py = rng()*size;
      var pr = (0.002 + rng()*0.045)*size;
      var bg2 = ctx.createRadialGradient(px, py, 0, px, py, pr);
      bg2.addColorStop(0.00, '#0E0E0E'); // deep dark floor
      bg2.addColorStop(0.55, '#505050'); // inner wall
      bg2.addColorStop(0.82, '#BEBEBE'); // bright rim ejecta
      bg2.addColorStop(0.92, '#D8D8D8'); // peak brightness at rim
      bg2.addColorStop(1.00, '#909090'); // back to neutral
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI*2);
      ctx.fillStyle = bg2;
      ctx.fill();
    }

    // Fine-grain surface roughness noise
    var imgData = ctx.getImageData(0, 0, size, size);
    var d = imgData.data;
    for (var j = 0; j < d.length; j += 4) {
      var n = (rng() - 0.5) * 50;
      d[j] = d[j+1] = d[j+2] = Math.min(255, Math.max(0, d[j] + n));
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  }

  /* ─── Starfield ─── */
  function buildStarfield() {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(STAR_COUNT * 3);
    var col = new Float32Array(STAR_COUNT * 3);
    var rng = mulberry32(0xF00DCAFE);
    for (var i = 0; i < STAR_COUNT; i++) {
      var theta = rng() * Math.PI * 2;
      var phi   = Math.acos(2 * rng() - 1);
      var R     = 280 + rng() * 20;
      pos[i*3]   = R * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = R * Math.cos(phi);
      pos[i*3+2] = R * Math.sin(phi) * Math.sin(theta);
      var w = rng();
      col[i*3]   = 0.85 + w * 0.15;
      col[i*3+1] = 0.85 + (1-w) * 0.08;
      col[i*3+2] = 0.88 + (1-w) * 0.12;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    var mat = new THREE.PointsMaterial({ size: 0.5, vertexColors: true, transparent: true, opacity: 0.90 });
    return new THREE.Points(geo, mat);
  }

  /* ─── Marker Sprite — enhanced beacon with site name ─── */
  function buildMarkerSprite(hexColor, label, siteName) {
    var size = 320;  // high-res canvas for crisp look at zoom
    var cx = size / 2;
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var ctx = c.getContext('2d');

    // ─ Outermost diffuse halo ─
    var halo = ctx.createRadialGradient(cx, cx, cx * 0.10, cx, cx, cx * 0.98);
    halo.addColorStop(0,   hexColor + '28');
    halo.addColorStop(0.5, hexColor + '14');
    halo.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(cx, cx, cx * 0.98, 0, Math.PI*2);
    ctx.fillStyle = halo; ctx.fill();

    // ─ Outer ring (dashed) ─
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cx, cx * 0.70, 0, Math.PI*2);
    ctx.strokeStyle = hexColor + '55';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();

    // ─ Mid ring (solid) ─
    ctx.beginPath(); ctx.arc(cx, cx, cx * 0.46, 0, Math.PI*2);
    ctx.strokeStyle = hexColor + 'AA';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // ─ Inner glow fill ─
    var innerGlow = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx * 0.44);
    innerGlow.addColorStop(0,   hexColor + 'CC');
    innerGlow.addColorStop(0.4, hexColor + '66');
    innerGlow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(cx, cx, cx * 0.44, 0, Math.PI*2);
    ctx.fillStyle = innerGlow; ctx.fill();

    // ─ Core dot ─
    ctx.beginPath(); ctx.arc(cx, cx, cx * 0.14, 0, Math.PI*2);
    ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // ─ Cross-hair ticks ─
    ctx.strokeStyle = hexColor + 'CC';
    ctx.lineWidth = 1.5;
    var tick = cx * 0.22;
    [[cx, cx - cx*0.52, cx, cx - cx*0.38],
     [cx, cx + cx*0.38, cx, cx + cx*0.52],
     [cx - cx*0.52, cx, cx - cx*0.38, cx],
     [cx + cx*0.38, cx, cx + cx*0.52, cx]
    ].forEach(function(l) {
      ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke();
    });

    // ─ ID label in core ─
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold ' + Math.round(cx * 0.24) + 'px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = hexColor;
    ctx.shadowBlur = 8;
    ctx.fillText(label, cx, cx);
    ctx.shadowBlur = 0;

    // ─ Site name below marker ─
    if (siteName) {
      var fontSize = Math.round(cx * 0.155);
      ctx.font = '500 ' + fontSize + 'px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#E8EDF5';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 6;
      var words = siteName.split(' ');
      var lineH = fontSize * 1.25;
      var startY = cx + cx * 0.78;
      // Draw each word on its own line (max 2 lines)
      var lines = [];
      var cur = '';
      words.forEach(function(w) {
        var test = cur ? cur + ' ' + w : w;
        if (ctx.measureText(test).width > size * 0.90 && cur) {
          lines.push(cur); cur = w;
        } else { cur = test; }
      });
      if (cur) lines.push(cur);
      lines.slice(0, 2).forEach(function(ln, li) {
        ctx.fillText(ln, cx, startY + li * lineH);
      });
      ctx.shadowBlur = 0;
    }

    var tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 16;
    var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    var sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.52, 0.52, 1);
    return sprite;
  }

  /* ─── Tooltip DOM element ─── */
  var tooltipEl = null;
  function getTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'moon3d-tooltip';
      Object.assign(tooltipEl.style, {
        position: 'absolute', background: 'rgba(8,12,24,0.92)',
        border: '1px solid rgba(75,139,244,0.6)', borderRadius: '6px',
        padding: '7px 13px', color: '#E8EDF5',
        fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
        lineHeight: '1.6', pointerEvents: 'none', display: 'none',
        zIndex: '100', backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 24px rgba(75,139,244,0.3)', whiteSpace: 'nowrap',
      });
      document.getElementById('lunar-viz').appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  /* ─── MAIN INIT ─── */
  function initMoon3D() {
    var vizDiv = document.getElementById('lunar-viz');
    if (!vizDiv) return;

    // Hide old 2D canvas
    var oldCanvas = document.getElementById('lunar-canvas');
    if (oldCanvas) oldCanvas.style.display = 'none';

    // 3D container
    var container = document.createElement('div');
    container.id = 'moon3d-container';
    Object.assign(container.style, {
      position: 'absolute', inset: '0', overflow: 'hidden', borderRadius: 'inherit',
    });
    vizDiv.insertBefore(container, vizDiv.firstChild);

    /* ── Loading Overlay ── */
    var loadingEl = document.createElement('div');
    loadingEl.id = 'moon3d-loading';
    Object.assign(loadingEl.style, {
      position: 'absolute', inset: '0', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '14px',
      background: 'rgba(2,4,10,0.90)', zIndex: '20',
      color: '#4B8BF4', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
      letterSpacing: '0.08em',
    });
    var spinnerEl = document.createElement('div');
    Object.assign(spinnerEl.style, {
      width: '36px', height: '36px', borderRadius: '50%',
      border: '2px solid rgba(75,139,244,0.15)',
      borderTop: '2px solid #4B8BF4',
      animation: 'moon3d-spin 0.9s linear infinite',
    });
    if (!document.getElementById('moon3d-spin-style')) {
      var styleEl = document.createElement('style');
      styleEl.id = 'moon3d-spin-style';
      styleEl.textContent = '@keyframes moon3d-spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(styleEl);
    }
    loadingEl.appendChild(spinnerEl);
    loadingEl.appendChild(document.createTextNode('LOADING NASA MOON MODEL…'));
    container.appendChild(loadingEl);

    function hideLoading() {
      if (loadingEl && loadingEl.parentNode) {
        loadingEl.style.transition = 'opacity 0.6s ease';
        loadingEl.style.opacity = '0';
        setTimeout(function() {
          if (loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl);
        }, 650);
      }
    }

    /* Scene */
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);

    /* Camera — telephoto FOV so moon fills more of the panel */
    var W = container.clientWidth  || 600;
    var H = container.clientHeight || 480;
    var camera = new THREE.PerspectiveCamera(36, W/H, 0.05, 1000);
    camera.position.set(0, 0, 4.8);

    /* Renderer — use full native pixel ratio for maximum sharpness */
    var renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(window.devicePixelRatio);  // full DPI — key fix for zoom blur
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    /* Starfield */
    scene.add(buildStarfield());

    /* ── Moon pivot (parent for model + markers + atm, so they all rotate together) ── */
    var moonPivot = new THREE.Group();
    scene.add(moonPivot);

    /* Atmospheric rim glow (always sphere-sized, added to pivot) */
    var atmGeo = new THREE.SphereGeometry(MOON_RADIUS * 1.038, 64, 64);
    var atmMat = new THREE.MeshBasicMaterial({
      color: 0x1A3366, transparent: true, opacity: 0.055,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    moonPivot.add(new THREE.Mesh(atmGeo, atmMat));

    /* Subtle limb glow ring */
    var limbGeo = new THREE.SphereGeometry(MOON_RADIUS * 1.012, 64, 64);
    var limbMat = new THREE.MeshBasicMaterial({
      color: 0x334466, transparent: true, opacity: 0.025,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    moonPivot.add(new THREE.Mesh(limbGeo, limbMat));

    /* ── Lighting: simulate deep-space solar illumination ── */
    // Primary: warm high-intensity solar directional
    var sun = new THREE.DirectionalLight(0xFFF9F0, 3.4);
    sun.position.set(-3.5, 1.5, 4.5); // Moved sun to the left to cast more shadow on the right side
    scene.add(sun);
    // Secondary: very faint earthshine from opposite side
    var earthshine = new THREE.DirectionalLight(0x2244AA, 0.08); // Reduced to maintain shadow depth
    earthshine.position.set(5, -1, -3);
    scene.add(earthshine);
    // Ambient: near-zero — only for crater shadow detail
    scene.add(new THREE.AmbientLight(0x080C18, 0.22)); // Reduced for deeper shadows


    /* ── Markers (attached to moonPivot so they rotate with the moon) ── */
    var markerGroup = new THREE.Group();
    var markerSprites = [];
    MARKER_SITES.forEach(function(site) {
      var pos = latLonToXYZ(site.lat, site.lon, MOON_RADIUS * 1.055);
      var sprite = buildMarkerSprite(site.color, site.id, site.name);
      sprite.position.copy(pos);
      sprite.userData.site = site;
      markerGroup.add(sprite);
      markerSprites.push(sprite);
    });
    moonPivot.add(markerGroup);

    /* ── Raycaster ── */
    var raycaster = new THREE.Raycaster();
    var pointer   = new THREE.Vector2();

    function setPointer(e) {
      var rect = renderer.domElement.getBoundingClientRect();
      pointer.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      pointer.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    }

    renderer.domElement.addEventListener('click', function(e) {
      if (isDragging) return;
      setPointer(e);
      raycaster.setFromCamera(pointer, camera);
      var hits = raycaster.intersectObjects(markerSprites);
      if (hits.length > 0) {
        var s = hits[0].object.userData.site;
        if (typeof selectSite === 'function') selectSite(s.siteIndex);
      }
    });

    renderer.domElement.addEventListener('mousemove', function(e) {
      setPointer(e);
      raycaster.setFromCamera(pointer, camera);
      var hits = raycaster.intersectObjects(markerSprites);
      var tip = getTooltip();
      if (hits.length > 0) {
        var s = hits[0].object.userData.site;
        renderer.domElement.style.cursor = 'pointer';
        tip.innerHTML = '<strong style="color:#4B8BF4">' + s.name + '</strong><br>Lat: ' + s.lat + '&deg; &nbsp; Lon: ' + s.lon + '&deg;';
        tip.style.display = 'block';
        var rect = container.getBoundingClientRect();
        tip.style.left = (e.clientX - rect.left + 14) + 'px';
        tip.style.top  = (e.clientY - rect.top  + 14) + 'px';
      } else {
        renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
        tip.style.display = 'none';
      }
    });

    renderer.domElement.addEventListener('mouseleave', function() {
      var tip = getTooltip();
      if (tip) tip.style.display = 'none';
    });

    /* ── Drag-to-rotate ── */
    var isDragging = false;
    var prevX = 0, prevY = 0;
    var rotX = 0.15, rotY = 0;
    var velX = 0, velY = 0;

    renderer.domElement.style.cursor = 'grab';

    renderer.domElement.addEventListener('mousedown', function(e) {
      isDragging = true; prevX = e.clientX; prevY = e.clientY;
      velX = velY = 0;
      renderer.domElement.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', function() {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    });
    window.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      velY = (e.clientX - prevX) * 0.005;
      velX = (e.clientY - prevY) * 0.005;
      rotY += velY; rotX += velX;
      rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotX));
      prevX = e.clientX; prevY = e.clientY;
    });

    /* Touch */
    var tx0 = 0, ty0 = 0;
    renderer.domElement.addEventListener('touchstart', function(e) {
      tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY;
      velX = velY = 0; isDragging = true;
    }, { passive: true });
    renderer.domElement.addEventListener('touchmove', function(e) {
      velY = (e.touches[0].clientX - tx0) * 0.005;
      velX = (e.touches[0].clientY - ty0) * 0.005;
      rotY += velY; rotX += velX;
      rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotX));
      tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY;
    }, { passive: true });
    renderer.domElement.addEventListener('touchend', function() { isDragging = false; });

    /* ── Scroll to zoom + overlay auto-hide ── */
    var ZOOM_HIDE_THRESHOLD = 3.6;  // hide UI chrome below this distance
    var overlaysHidden = false;

    function updateOverlayVisibility() {
      var z = camera.position.z;
      var shouldHide = z < ZOOM_HIDE_THRESHOLD;
      if (shouldHide === overlaysHidden) return;
      overlaysHidden = shouldHide;

      // Only hide non-marker overlays — keep site markers visible always
      var targets = [
        document.querySelector('.measurement-overlay'),
        document.getElementById('coord-display'),
      ];
      targets.forEach(function(el) {
        if (!el) return;
        el.style.transition = 'opacity 0.4s ease';
        el.style.opacity = shouldHide ? '0' : '1';
        el.style.pointerEvents = shouldHide ? 'none' : '';
      });

      // Dim the viz toolbar when very close (keep it accessible)
      var toolbar = document.getElementById('viz-toolbar');
      if (toolbar) {
        toolbar.style.transition = 'opacity 0.4s ease';
        toolbar.style.opacity = shouldHide ? '0.20' : '1';
      }
    }

    renderer.domElement.addEventListener('wheel', function(e) {
      e.preventDefault();
      var delta = e.deltaY * 0.010;
      camera.position.z = Math.max(2.3, Math.min(7.5, camera.position.z + delta));
      updateOverlayVisibility();
    }, { passive: false });

    /* Pinch-to-zoom (touch) */
    var lastPinchDist = 0;
    renderer.domElement.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist = Math.sqrt(dx*dx + dy*dy);
      }
    }, { passive: true });
    renderer.domElement.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2) {
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        var dist = Math.sqrt(dx*dx + dy*dy);
        var pinchDelta = (lastPinchDist - dist) * 0.02;
        camera.position.z = Math.max(2.3, Math.min(7.5, camera.position.z + pinchDelta));
        lastPinchDist = dist;
        updateOverlayVisibility();
      }
    }, { passive: true });

    /* Resize */
    window.addEventListener('resize', function() {
      var W2 = container.clientWidth, H2 = container.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    });

    /* ── Animation loop ── */
    var clock = new THREE.Clock();
    var pulseT = 0;
    var autoRotate = true;

    function animate() {
      requestAnimationFrame(animate);
      var delta = clock.getDelta();
      pulseT += delta;

      if (!isDragging) {
        if (autoRotate) {
          velY = velY * 0.97 + 0.000075;  // ultra-slow drift (~12× slower)
        } else {
          velY *= 0.92;
        }
        velX *= 0.95;
        rotY += velY;
        rotX += velX;
        rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotX));
      }

      moonPivot.rotation.x = rotX;
      moonPivot.rotation.y = rotY;

      markerSprites.forEach(function(sp, i) {
        // Pulse between 0.42 and 0.62, and scale up when camera is close
        var zoomBoost = Math.max(1.0, (5.0 - camera.position.z) * 0.35 + 1.0);
        var pulse = 0.52 + 0.10 * Math.sin(pulseT * 2.0 + i * 1.1);
        var s = pulse * zoomBoost;
        sp.scale.set(s, s, 1);
      });

      renderer.render(scene, camera);
    }
    animate();

    /* ── Apply materials + maximum anisotropic filtering to kill zoom blur ── */
    function applyMoonMaterial(model) {
      var maxAniso = renderer.capabilities.getMaxAnisotropy();
      
      // Generate a high-frequency regolith noise texture for extreme zoom detail
      var regolithTex = (function() {
        var c = document.createElement('canvas');
        c.width = c.height = 256;
        var ctx = c.getContext('2d');
        var img = ctx.createImageData(256, 256);
        for (var i = 0; i < img.data.length; i += 4) {
          var v = 160 + Math.random() * 95; // high-contrast granular noise
          img.data[i] = img.data[i+1] = img.data[i+2] = v;
          img.data[i+3] = 255;
        }
        ctx.putImageData(img, 0, 0);
        var tex = new THREE.CanvasTexture(c);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(300, 300); // tile heavily across the sphere
        tex.anisotropy = maxAniso;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        return tex;
      })();

      model.traverse(function(child) {
        if (!child.isMesh) return;
        if (child.userData.isDetail) return; // Fix: prevent infinite loop
        
        // Overlay the micro-texture to fix blur at max zoom
        var detailMat = new THREE.MeshBasicMaterial({
          map: regolithTex,
          transparent: true,
          opacity: 0.25,
          blending: THREE.MultiplyBlending,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1
        });
        var detailMesh = new THREE.Mesh(child.geometry, detailMat);
        detailMesh.userData.isDetail = true;
        child.add(detailMesh);

        if (child.material) {
          child.material.roughness       = 0.94;  // real regolith is near-Lambertian
          child.material.metalness       = 0.00;
          child.material.envMapIntensity = 0.0;

          // Apply max anisotropy to every texture — this is what eliminates zoom blur
          var maps = ['map','normalMap','roughnessMap','metalnessMap','aoMap','emissiveMap','bumpMap'];
          maps.forEach(function(key) {
            if (child.material[key]) {
              child.material[key].anisotropy  = maxAniso;
              child.material[key].minFilter   = THREE.LinearMipmapLinearFilter;
              child.material[key].magFilter   = THREE.LinearFilter;
              child.material[key].encoding    = THREE.sRGBEncoding;
              child.material[key].needsUpdate = true;
            }
          });
          child.material.needsUpdate = true;
        }
      });
    }

    /* ── Load NASA GLB: try full-res first, chain-fallback to smaller ── */
    var loadingTextEl = loadingEl.lastChild; // the text node

    function normaliseAndAdd(model) {
      var box    = new THREE.Box3().setFromObject(model);
      var center = box.getCenter(new THREE.Vector3());
      var size   = box.getSize(new THREE.Vector3());
      var maxDim = Math.max(size.x, size.y, size.z);
      var scale  = (MOON_RADIUS * 2) / maxDim;
      model.scale.multiplyScalar(scale);
      box.setFromObject(model);
      box.getCenter(center);
      model.position.sub(center);
      applyMoonMaterial(model);
      moonPivot.add(model);
      renderer.toneMappingExposure = 1.35;
      hideLoading();
    }

    function loadSmallGLB() {
      if (loadingTextEl && loadingTextEl.nodeType === 3) {
        loadingTextEl.textContent = 'LOADING MOON MODEL (MEDIUM)…';
      }
      var loader2 = new THREE.GLTFLoader();
      loader2.load(
        './3d_models/moon_small.glb',
        function(gltf) { normaliseAndAdd(gltf.scene); },
        function(xhr) {
          if (xhr.total && loadingTextEl && loadingTextEl.nodeType === 3) {
            var pct = Math.round(xhr.loaded / xhr.total * 100);
            loadingTextEl.textContent = 'LOADING MOON MODEL… ' + pct + '%';
          }
        },
        function(err) {
          console.warn('[Moon3D] moon_small.glb failed too, using procedural:', err);
          useFallbackMoon();
          hideLoading();
        }
      );
    }

    if (typeof THREE.GLTFLoader !== 'undefined') {
      // Attempt full-resolution first (moon.glb — 53 MB, maximum detail)
      if (loadingTextEl && loadingTextEl.nodeType === 3) {
        loadingTextEl.textContent = 'LOADING NASA MOON MODEL (HIGH RES)…';
      }
      var loader = new THREE.GLTFLoader();
      loader.load(
        './3d_models/moon.glb',
        function(gltf) { normaliseAndAdd(gltf.scene); },
        function(xhr) {
          if (xhr.total && loadingTextEl && loadingTextEl.nodeType === 3) {
            var pct = Math.round(xhr.loaded / xhr.total * 100);
            loadingTextEl.textContent = 'LOADING HIGH-RES NASA MODEL… ' + pct + '%';
          }
        },
        function(err) {
          console.warn('[Moon3D] moon.glb failed, trying moon_small.glb:', err);
          loadSmallGLB();
        }
      );
    } else {
      useFallbackMoon();
      hideLoading();
    }

    /* Procedural fallback (used if GLTFLoader absent or GLB fails) */
    function useFallbackMoon() {
      var moonTex = buildMoonTexture(2048);
      var bumpTex = buildBumpTexture(1024);
      var moonGeo = new THREE.SphereGeometry(MOON_RADIUS, 96, 96);
      var moonMat = new THREE.MeshStandardMaterial({
        map: moonTex, bumpMap: bumpTex, bumpScale: 0.14,
        roughness: 0.92, metalness: 0.00,
      });
      moonPivot.add(new THREE.Mesh(moonGeo, moonMat));
    }

    window.moon3d = {
      focusSite: function(idx) {
        var s = MARKER_SITES[idx];
        if (!s) return;
      },
      toggleRotation: function() {
        autoRotate = !autoRotate;
        return autoRotate;
      },
      isRotating: function() {
        return autoRotate;
      }
    };
  }

  /* ─── Wait for Three.js then boot ─── */
  function waitForThree(cb, tries) {
    tries = tries || 0;
    if (typeof THREE !== 'undefined') { cb(); return; }
    if (tries > 40) { console.warn('[Moon3D] THREE not available'); return; }
    setTimeout(function() { waitForThree(cb, tries + 1); }, 150);
  }

  document.addEventListener('DOMContentLoaded', function() {
    waitForThree(initMoon3D);
  });

})();
