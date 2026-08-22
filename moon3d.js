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

  /* ─── SITE MARKER DEFINITIONS (lat/lon in degrees for 23 Verified Lunar Nodes) ─── */
  var MARKER_SITES = [
    { id: '01', name: 'Shackleton Crater Rim', lat: -89.28, lon: 15.40, color: '#4B8BF4', siteIndex: 0 },
    { id: '02', name: 'Mons Malapert Plateau', lat: -85.99, lon: 12.90, color: '#4B8BF4', siteIndex: 1 },
    { id: '03', name: 'Faustini Rim A', lat: -87.14, lon: 76.98, color: '#4B8BF4', siteIndex: 2 },
    { id: '04', name: 'Connecting Ridge', lat: -89.44, lon: 222.70, color: '#4B8BF4', siteIndex: 3 },
    { id: '05', name: 'de Gerlache Crater Rim', lat: -88.50, lon: 271.70, color: '#4B8BF4', siteIndex: 4 },
    { id: '06', name: 'Haworth Crater Rim', lat: -87.40, lon: 354.90, color: '#4B8BF4', siteIndex: 5 },
    { id: '07', name: 'Mons Mouton (Leibnitz)', lat: -84.50, lon: 327.90, color: '#4B8BF4', siteIndex: 6 },
    { id: '08', name: 'Nobile Crater Rim', lat: -85.20, lon: 53.50, color: '#4B8BF4', siteIndex: 7 },
    { id: '09', name: 'Amundsen Crater Peak', lat: -84.50, lon: 82.80, color: '#4B8BF4', siteIndex: 8 },
    { id: '10', name: 'Marius Hills Lava Tube', lat: 14.12, lon: 303.24, color: '#F4C44B', siteIndex: 9 },
    { id: '11', name: 'Cabeus Crater', lat: -84.90, lon: 324.50, color: '#4B8BF4', siteIndex: 10 },
    { id: '12', name: 'Shoemaker Crater Rim', lat: -88.10, lon: 44.90, color: '#4B8BF4', siteIndex: 11 },
    { id: '13', name: 'Chandrayaan-3 Shiv Shakti', lat: -69.37, lon: 32.32, color: '#34D399', siteIndex: 12 },
    { id: '14', name: 'Chandrayaan-1 Jawahar Point', lat: -89.90, lon: 0.00, color: '#34D399', siteIndex: 13 },
    { id: '15', name: 'Chandrayaan-2 Tiranga Point', lat: -70.90, lon: 22.78, color: '#34D399', siteIndex: 14 },
    { id: '16', name: 'Chandrayaan-4 / LUPEX Site', lat: -89.10, lon: 115.00, color: '#34D399', siteIndex: 15 },
    { id: '17', name: 'Apollo 11 Tranquility Base', lat: 0.67, lon: 23.47, color: '#A78BFA', siteIndex: 16 },
    { id: '18', name: 'Apollo 12 Ocean of Storms', lat: -3.01, lon: 336.58, color: '#A78BFA', siteIndex: 17 },
    { id: '19', name: 'Apollo 14 Fra Mauro', lat: -3.65, lon: 342.53, color: '#A78BFA', siteIndex: 18 },
    { id: '20', name: 'Apollo 15 Hadley Rille', lat: 26.13, lon: 3.63, color: '#A78BFA', siteIndex: 19 },
    { id: '21', name: 'Apollo 16 Descartes Highlands', lat: -8.97, lon: 15.50, color: '#A78BFA', siteIndex: 20 },
    { id: '22', name: 'Apollo 17 Taurus-Littrow', lat: 20.19, lon: 30.77, color: '#A78BFA', siteIndex: 21 },
    { id: '23', name: 'Artemis III Candidate Rim', lat: -89.50, lon: 45.00, color: '#4B8BF4', siteIndex: 22 }
  ];

  /* ─── Convert lat/lon to XYZ on a sphere ─── */
  function latLonToXYZ(lat, lon, radius) {
    var normLon = lon;
    while (normLon > 180) normLon -= 360;
    while (normLon < -180) normLon += 360;
    var phi   = (90 - lat)  * (Math.PI / 180);
    var theta = (normLon + 180) * (Math.PI / 180);
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

  /* ─── Procedural Moon Color Texture ─── */
  function buildMoonTexture(size) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext('2d');

    // Base gradient
    var base = ctx.createRadialGradient(size*0.35, size*0.35, size*0.02, size/2, size/2, size*0.72);
    base.addColorStop(0.00, '#D4D6D8');
    base.addColorStop(0.20, '#B8BBBE');
    base.addColorStop(0.42, '#9A9EA4');
    base.addColorStop(0.62, '#7A7F88');
    base.addColorStop(0.80, '#585E6A');
    base.addColorStop(1.00, '#30363F');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    // Mare patches
    var mares = [
      { x:0.38, y:0.28, rx:0.22, ry:0.16, alpha:0.38 },
      { x:0.58, y:0.42, rx:0.18, ry:0.13, alpha:0.32 },
      { x:0.25, y:0.62, rx:0.16, ry:0.12, alpha:0.30 },
      { x:0.70, y:0.25, rx:0.12, ry:0.10, alpha:0.28 },
      { x:0.50, y:0.70, rx:0.14, ry:0.09, alpha:0.26 },
      { x:0.18, y:0.38, rx:0.10, ry:0.08, alpha:0.24 },
    ];
    mares.forEach(function(m) {
      var mg = ctx.createRadialGradient(m.x*size, m.y*size, 0, m.x*size, m.y*size, m.rx*size);
      mg.addColorStop(0,   'rgba(38,42,50,' + m.alpha + ')');
      mg.addColorStop(0.6, 'rgba(44,49,58,' + (m.alpha*0.5) + ')');
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

    // Craters
    var rng = mulberry32(0xDEADBEEF);
    var craters = [
      [0.50, 0.85, 0.060, 0.88],
      [0.30, 0.20, 0.045, 0.80],
      [0.72, 0.55, 0.040, 0.75],
      [0.20, 0.50, 0.035, 0.70],
      [0.65, 0.75, 0.030, 0.72],
      [0.42, 0.40, 0.025, 0.68],
      [0.80, 0.35, 0.028, 0.74],
      [0.15, 0.70, 0.032, 0.66],
    ];
    for (var i = 0; i < 80; i++) {
      craters.push([rng(), rng(), 0.005 + rng()*0.015, 0.50 + rng()*0.35]);
    }
    craters.forEach(function(c) {
      var px = c[0]*size, py = c[1]*size, pr = c[2]*size, alpha = c[3];
      var cg = ctx.createRadialGradient(px, py, 0, px, py, pr);
      cg.addColorStop(0.00, 'rgba(10,12,16,' + alpha + ')');
      cg.addColorStop(0.55, 'rgba(18,22,28,' + (alpha*0.75) + ')');
      cg.addColorStop(0.80, 'rgba(40,45,52,' + (alpha*0.40) + ')');
      cg.addColorStop(0.90, 'rgba(185,190,198,' + (alpha*0.18) + ')');
      cg.addColorStop(1.00, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI*2);
      ctx.fillStyle = cg;
      ctx.fill();
    });

    // Grain noise
    var imgData = ctx.getImageData(0, 0, size, size);
    var d = imgData.data;
    for (var j = 0; j < d.length; j += 4) {
      var n = (rng() - 0.5) * 20;
      d[j]   = Math.min(255, Math.max(0, d[j]   + n));
      d[j+1] = Math.min(255, Math.max(0, d[j+1] + n));
      d[j+2] = Math.min(255, Math.max(0, d[j+2] + n));
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  }

  /* ─── Procedural Bump Map ─── */
  function buildBumpTexture(size) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, size, size);
    var rng = mulberry32(0xCAFEBABE);
    for (var i = 0; i < 140; i++) {
      var px = rng()*size, py = rng()*size, pr = (0.003 + rng()*0.035)*size;
      var bg = ctx.createRadialGradient(px, py, 0, px, py, pr);
      bg.addColorStop(0.00, '#111');
      bg.addColorStop(0.65, '#666');
      bg.addColorStop(0.88, '#ddd');
      bg.addColorStop(1.00, '#888');
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI*2);
      ctx.fillStyle = bg;
      ctx.fill();
    }
    var imgData = ctx.getImageData(0, 0, size, size);
    var d = imgData.data;
    for (var j = 0; j < d.length; j += 4) {
      var n = (rng() - 0.5) * 40;
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

  /* ─── Marker Sprite ─── */
  function buildMarkerSprite(hexColor, label) {
    var size = 128;
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var ctx = c.getContext('2d');
    // Glow
    var glow = ctx.createRadialGradient(64, 64, 8, 64, 64, 52);
    glow.addColorStop(0,   hexColor + 'BB');
    glow.addColorStop(0.5, hexColor + '44');
    glow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(64, 64, 52, 0, Math.PI*2);
    ctx.fillStyle = glow; ctx.fill();
    // Core
    ctx.beginPath(); ctx.arc(64, 64, 13, 0, Math.PI*2);
    ctx.fillStyle = hexColor; ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5; ctx.stroke();
    // Label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 26px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 64, 64);
    var tex = new THREE.CanvasTexture(c);
    var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    var sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.28, 0.28, 1);
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

    /* Scene */
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);

    /* Camera */
    var W = container.clientWidth  || 600;
    var H = container.clientHeight || 480;
    var camera = new THREE.PerspectiveCamera(42, W/H, 0.1, 1000);
    camera.position.set(0, 0, 6.5);

    /* Renderer */
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    /* Starfield */
    scene.add(buildStarfield());

    /* Moon sphere */
    var moonTex = buildMoonTexture(1024);
    var bumpTex = buildBumpTexture(512);
    var moonGeo = new THREE.SphereGeometry(MOON_RADIUS, 72, 72);
    var moonMat = new THREE.MeshStandardMaterial({
      map: moonTex, bumpMap: bumpTex, bumpScale: 0.09,
      roughness: 0.88, metalness: 0.00,
    });
    var moon = new THREE.Mesh(moonGeo, moonMat);
    scene.add(moon);

    /* Atmospheric rim */
    var atmGeo = new THREE.SphereGeometry(MOON_RADIUS * 1.035, 64, 64);
    var atmMat = new THREE.MeshBasicMaterial({
      color: 0x2244AA, transparent: true, opacity: 0.04,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    /* Lighting */
    var sun = new THREE.DirectionalLight(0xFFF4E0, 2.6);
    sun.position.set(-4.5, 2.5, 3);
    scene.add(sun);
    var fill = new THREE.DirectionalLight(0x6688BB, 0.12);
    fill.position.set(4, -1, -3);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x111828, 0.55));

    /* Markers */
    var markerGroup = new THREE.Group();
    var markerSprites = [];
    MARKER_SITES.forEach(function(site) {
      var pos = latLonToXYZ(site.lat, site.lon, MOON_RADIUS * 1.055);
      var sprite = buildMarkerSprite(site.color, site.id);
      sprite.position.copy(pos);
      sprite.userData.site = site;
      markerGroup.add(sprite);
      markerSprites.push(sprite);
    });
    moon.add(markerGroup);

    /* Raycaster */
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
        if (typeof window.selectLunarNode === 'function') {
          window.selectLunarNode(s.siteIndex);
        } else if (typeof selectSite === 'function') {
          selectSite(s.siteIndex);
        }
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
        tip.innerHTML = '<strong style="color:#4B8BF4">' + s.id + ': ' + s.name + '</strong><br>Lat: ' + s.lat + '&deg; &nbsp; Lon: ' + s.lon + '&deg;<br><span style="color:#34D399;font-size:10px;">⚡ Click to open Deep Dive</span>';
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

    /* Drag-to-rotate */
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

    /* Scroll to zoom */
    renderer.domElement.addEventListener('wheel', function(e) {
      e.preventDefault();
      camera.position.z = Math.max(3.8, Math.min(10, camera.position.z + e.deltaY * 0.008));
    }, { passive: false });

    /* Resize */
    window.addEventListener('resize', function() {
      var W2 = container.clientWidth, H2 = container.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    });

    /* Animation */
    var clock = new THREE.Clock();
    var pulseT = 0;

    function animate() {
      requestAnimationFrame(animate);
      var delta = clock.getDelta();
      pulseT += delta;

      if (!isDragging) {
        velY = velY * 0.97 + 0.0008;
        velX *= 0.95;
        rotY += velY;
        rotX += velX;
        rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotX));
      }

      moon.rotation.x = rotX;
      moon.rotation.y = rotY;

      markerSprites.forEach(function(sp, i) {
        var s = 0.26 + 0.04 * Math.sin(pulseT * 2.5 + i * 1.1);
        sp.scale.set(s, s, 1);
      });

      renderer.render(scene, camera);
    }
    animate();

    window.moon3d = {
      focusSite: function(idx) {
        var s = MARKER_SITES[idx];
        if (!s) return;
        var normLon = s.lon;
        while (normLon > 180) normLon -= 360;
        while (normLon < -180) normLon += 360;
        rotX = -(s.lat * Math.PI) / 180;
        rotY = -(normLon * Math.PI) / 180;
        velX = 0;
        velY = 0;
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
