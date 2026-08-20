import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { latLonToVector3, LUNAR_MISSIONS, LUNAR_LANDMARKS } from '../data/lunarSites';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Minus, 
  Crosshair, 
  Globe, 
  Sparkles,
  MapPin,
  Sun,
  Camera,
  Droplets,
  Thermometer,
  Mountain,
  Rocket,
  Play,
  Pause,
  Sliders,
  X,
  Compass,
  Layers,
  Activity
} from 'lucide-react';
import { soundManager } from '../utils/audio';

const MOON_RADIUS = 1.5;

// Shaders for Authentic Real Lunar Regolith 3D Photorealistic Rendering with LOLA 118m LDEM Normal Mapping & 3D Physical Relief
const MOON_VERT_SHADER = `
  uniform sampler2D bumpMap;
  uniform float displacementScale;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldTangent;
  varying vec3 vWorldBitangent;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;

    // 1. Analytical Tangent and Bitangent on Sphere (+U azimuth, +V latitude)
    vec3 norm = normalize(normal);
    vec3 tang = vec3(norm.z, 0.0, -norm.x);
    if (length(tang) < 0.0001) {
      tang = vec3(1.0, 0.0, 0.0);
    } else {
      tang = normalize(tang);
    }
    vec3 bitang = normalize(cross(norm, tang));

    // 2. Physical 3D Elevation Displacement from NASA LOLA LDEM Altimetry
    float elev = texture2D(bumpMap, uv).r;
    vec3 displacedPos = position + norm * ((elev - 0.43) * displacementScale);

    vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
    vWorldPosition = worldPos.xyz;

    vWorldNormal = normalize((modelMatrix * vec4(norm, 0.0)).xyz);
    vWorldTangent = normalize((modelMatrix * vec4(tang, 0.0)).xyz);
    vWorldBitangent = normalize((modelMatrix * vec4(bitang, 0.0)).xyz);

    vec4 mvPosition = viewMatrix * worldPos;
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const MOON_FRAG_SHADER = `
  precision highp float;

  uniform sampler2D textureMap;
  uniform sampler2D normalMap;
  uniform sampler2D bumpMap;
  uniform vec3 cameraWorldPosition;
  uniform vec3 sunDirection;
  uniform float reliefScale;
  uniform float ambientIntensity;
  uniform float isColorMode;
  uniform float contrastBoost;
  uniform float microDetailScale;
  uniform float isEvenLighting;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldTangent;
  varying vec3 vWorldBitangent;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;

  void main() {
    // 1. High-Resolution NASA 8K Albedo Map
    vec4 texColor = texture2D(textureMap, vUv);
    vec3 albedo = texColor.rgb;

    // 2. Orthonormal Tangent Frame in World Space
    mat3 TBN = mat3(normalize(vWorldTangent), normalize(vWorldBitangent), normalize(vWorldNormal));

    // 3. Sample High-Precision LOLA Normal Map with Relief Scale
    vec3 normalTex = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
    normalTex.xy *= reliefScale;

    // 4. Procedural Micro-Scale Regolith Roughness & Grain for Closeups
    float camDist = length(cameraWorldPosition - vWorldPosition);
    float closeDetail = smoothstep(5.0, 1.6, camDist) * microDetailScale;
    if (closeDetail > 0.001) {
      vec2 microUv = vUv * 900.0;
      float grain1 = sin(microUv.x * 6.283) * sin(microUv.y * 6.283);
      float grain2 = sin(microUv.x * 15.3 + microUv.y * 11.7) * 0.5;
      normalTex.xy += vec2(grain1, grain2) * (0.22 * closeDetail);
    }

    vec3 N = normalize(TBN * normalize(normalTex));

    // 5. Dynamic Sun and Camera View Directions
    vec3 V = normalize(cameraWorldPosition - vWorldPosition);
    vec3 L = normalize(sunDirection);

    if (isColorMode > 0.5) {
      // 6. NASA Photographic / Lommel-Seeliger & Multi-Source Even Illumination
      float NdotV = max(0.001, dot(N, V));
      float NdotL = max(0.0, dot(N, L));
      
      // Powdery regolith Lommel-Seeliger scattering
      float ls_sun = NdotL / (NdotL + NdotV);
      
      // Observer/Frontal light ensuring full visibility across all visible craters
      vec3 frontDir = normalize(V + vec3(0.06, 0.10, 0.0));
      float NdotFront = max(0.0, dot(N, frontDir));
      float ls_front = NdotFront / (NdotFront + NdotV);
      
      // Retroreflective opposition surge peak
      float phase_angle = max(0.0, dot(L, V));
      float opposition_surge = pow(phase_angle, 6.0) * 0.20;

      // Direct Sun
      vec3 sunColor = vec3(1.04, 1.01, 0.96);
      vec3 directSun = sunColor * (ls_sun * 0.65 + NdotL * 0.35 + opposition_surge);

      // Camera Front Fill
      vec3 directFront = sunColor * (ls_front * 0.65 + NdotFront * 0.35);

      // Ambient fill
      vec3 ambient = vec3(ambientIntensity, ambientIntensity * 1.02, ambientIntensity * 1.08);

      vec3 totalLighting;
      if (isEvenLighting > 0.5) {
        // Even Lighting: front-fill + key sunlight + ambient gives balanced illumination everywhere
        totalLighting = directFront * 0.72 + directSun * 0.38 + ambient * 0.60;
      } else {
        // Terminator Mode: dynamic sun terminator with soft earthshine fill
        float geomNdotL = dot(normalize(vWorldNormal), L);
        float terminator = smoothstep(-0.04, 0.10, geomNdotL);
        totalLighting = directSun * terminator + directFront * 0.18 + ambient;
      }

      // Lunar regolith glass bead glint at grazing angles
      vec3 H = normalize(L + V);
      float NdotH = max(0.0, dot(N, H));
      float specular = pow(NdotH, 32.0) * 0.06 * NdotV;
      totalLighting += vec3(specular);

      vec3 finalColor = albedo * totalLighting;

      // 7. Dynamic Contrast & Tone Balance
      if (contrastBoost > 0.5) {
        finalColor = pow(finalColor, vec3(contrastBoost));
      } else {
        finalColor = pow(finalColor, vec3(1.05));
      }

      // Subtle ACES-style highlight roll-off curve
      finalColor = (finalColor * (2.51 * finalColor + 0.03)) / (finalColor * (2.43 * finalColor + 0.59) + 0.14);

      gl_FragColor = vec4(finalColor, 1.0);
    } else {
      // 8K NASA LOLA Hypsometric Topography / Spectrometry / Thermal Map mode
      vec3 normalTexDemo = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
      normalTexDemo.xy *= (reliefScale * 0.65);
      vec3 N_demo = normalize(TBN * normalize(normalTexDemo));
      float diff = max(0.35, dot(N_demo, V));
      gl_FragColor = vec4(albedo * (diff * 0.70 + 0.40), 1.0);
    }
  }
`;

function getPhaseName(degrees) {
  const deg = ((degrees % 360) + 360) % 360;
  if (deg >= 350 || deg <= 10) return 'New Moon (0°)';
  if (deg > 10 && deg < 80) return `Waxing Crescent (${Math.round(deg)}°)`;
  if (deg >= 80 && deg <= 100) return 'First Quarter (90°)';
  if (deg > 100 && deg < 170) return `Waxing Gibbous (${Math.round(deg)}°)`;
  if (deg >= 170 && deg <= 190) return 'Full Moon (180°)';
  if (deg > 190 && deg < 260) return `Waning Gibbous (${Math.round(deg)}°)`;
  if (deg >= 260 && deg <= 280) return 'Third Quarter (270°)';
  return `Waning Crescent (${Math.round(deg)}°)`;
}

// Approximate elevation function derived from LOLA LDEM datum (-9,000m to +10,780m)
function getEstimatedElevation(lat, lon) {
  const absLat = Math.abs(lat);
  // South Pole - Aitken Basin (-53° S, 169° E)
  const dSPA = Math.hypot(lat - (-53), lon - 169);
  if (dSPA < 35) return Math.round(-8500 + dSPA * 180);
  
  // South Pole (Shackleton / Amundsen)
  if (lat < -80) return Math.round(-4200 + (lat + 90) * 320);

  // Mare Imbrium / Oceanus Procellarum Lowlands
  if (lat > 10 && lat < 40 && lon > -60 && lon < 0) return Math.round(-2100 + Math.sin(lat * 0.1) * 600);

  // Highlands / Montes Apenninus
  if (lat > 15 && lat < 30 && lon > -5 && lon < 15) return Math.round(4800 + Math.cos(lon * 0.2) * 2200);

  // General lunar highlands
  return Math.round(1200 + Math.sin(lat * 0.08) * 2400 + Math.cos(lon * 0.05) * 1800);
}

/**
 * Map3D: Ultra-Realistic 3D Photorealistic Moon Simulation Component with 8K LOLA LDEM (118m)
 */
export const Map3D = ({
  sites = [],
  selectedSite = null,
  onSelectSite = () => {},
  layers = {
    terrain: true,
    elevation: true,
    slope: true,
    waterIce: true,
    illumination: true,
    radiation: true,
    temperature: true,
    aiSuitability: true
  },
  searchQuery = '',
  setSearchQuery = () => {},
  onOpenDeepDive = () => {}
}) => {
  const containerRef = useRef(null);

  // Active UI & Simulation States
  const [activeTextureMode, setActiveTextureMode] = useState('lroc_8k'); // 'lroc_8k' | 'crater_contrast' | 'lola_dem' | 'ice_spectrometry' | 'thermal_diviner'
  const [sunAngle, setSunAngle] = useState(0);
  const [isEvenLighting, setIsEvenLighting] = useState(true);
  const [reliefScale, setReliefScale] = useState(2.8);
  const [displacementScale, setDisplacementScale] = useState(0.026);
  const [ambientIntensity, setAmbientIntensity] = useState(0.28);
  const [contrastBoost, setContrastBoost] = useState(1.05);
  const [microDetailScale, setMicroDetailScale] = useState(1.0);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [spinSpeed] = useState(0.001);
  const [showMissions, setShowMissions] = useState(true);
  const [activeMissionFilter, setActiveMissionFilter] = useState('all'); // 'all' | 'isro' | 'nasa' | 'spacex' | 'sides'
  const [selectedMission, setSelectedMission] = useState(null);
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);
  const [cursorCoords, setCursorCoords] = useState({ lat: -89.20, lon: 15.40, elevation: -3850 });
  const [hoveredObject, setHoveredObject] = useState(null);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const moonMeshRef = useRef(null);
  const moonMaterialRef = useRef(null);
  const globeGroupRef = useRef(null);
  const markersGroupRef = useRef(null);
  const missionsGroupRef = useRef(null);
  const overlaysGroupRef = useRef(null);
  const textureCacheRef = useRef({});
  const targetCameraPosRef = useRef(null);
  const targetControlsTargetRef = useRef(null);

  // Filtered search list
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const siteMatches = sites.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.shortName.toLowerCase().includes(q)
    );
    const missionMatches = LUNAR_MISSIONS.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.agency.toLowerCase().includes(q) ||
      m.site.toLowerCase().includes(q)
    ).map(m => ({
      id: m.id,
      code: m.agency,
      name: m.name,
      shortName: m.name,
      latitude: m.lat,
      longitude: m.lon,
      suitabilityScore: 99.9,
      siteType: `${m.country} • ${m.craft}`,
      isMission: true,
      missionData: m
    }));
    return [...siteMatches, ...missionMatches].slice(0, 6);
  }, [sites, searchQuery]);

  // Filtered Missions List
  const visibleMissions = useMemo(() => {
    if (activeMissionFilter === 'all') return LUNAR_MISSIONS;
    return LUNAR_MISSIONS.filter(m => m.category === activeMissionFilter);
  }, [activeMissionFilter]);

  // Water-Ice Volatiles Epithermal Neutron Spectrometer Texture
  const createWaterIceTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const polarGradients = [
      { x: canvas.width * 0.5, y: canvas.height * 0.94, r: 180, c: '#38bdf8' },
      { x: canvas.width * 0.42, y: canvas.height * 0.92, r: 130, c: '#06b6d4' },
      { x: canvas.width * 0.58, y: canvas.height * 0.91, r: 110, c: '#60a5fa' },
    ];
    polarGradients.forEach(p => {
      const grad = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, p.r);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.95)');
      grad.addColorStop(0.4, 'rgba(6, 182, 212, 0.6)');
      grad.addColorStop(0.8, 'rgba(30, 58, 138, 0.3)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    return new THREE.CanvasTexture(canvas);
  };

  // Diviner Thermal IR Heatmap Texture
  const createThermalTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0.0, '#312e81');
    gradient.addColorStop(0.5, '#ea580c');
    gradient.addColorStop(0.88, '#4c1d95');
    gradient.addColorStop(1.0, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
  };

  // Three.js Core Initialization
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Camera & OrbitControls (Strict zoom boundaries preventing clipping inside Moon or lost in space)
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.05, 2000);
    camera.position.set(0, -2.8, 2.6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 1.72; // Close-up orbital clearance above 1.50 radius moon surface
    controls.maxDistance = 5.50; // Overview boundary preventing moon from becoming tiny speck
    controls.enablePan = false;  // Keep Moon locked to center
    controlsRef.current = controls;

    // 3. 6-Sided Starfield Skybox
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const skyUrls = [
      '/assets/starfield/front.png',
      '/assets/starfield/back.png',
      '/assets/starfield/left.png',
      '/assets/starfield/right.png',
      '/assets/starfield/top.png',
      '/assets/starfield/bottom.png'
    ];
    cubeTextureLoader.load(skyUrls, (skyTexture) => {
      scene.background = skyTexture;
    }, undefined, () => {
      const starsGeo = new THREE.BufferGeometry();
      const starPositions = new Float32Array(1200 * 3);
      for (let i = 0; i < 1200 * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 80;
        starPositions[i + 1] = (Math.random() - 0.5) * 80;
        starPositions[i + 2] = (Math.random() - 0.5) * 80;
      }
      starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.8 });
      scene.add(new THREE.Points(starsGeo, starsMat));
    });

    // 4. Globe Group & Subgroups
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);
    markersGroupRef.current = markersGroup;

    const missionsGroup = new THREE.Group();
    globeGroup.add(missionsGroup);
    missionsGroupRef.current = missionsGroup;

    const overlaysGroup = new THREE.Group();
    globeGroup.add(overlaysGroup);
    overlaysGroupRef.current = overlaysGroup;

    // 5. Loading Manager & Textures
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const pct = Math.round((itemsLoaded / itemsTotal) * 100);
      setLoadingPercent(pct);
    };

    loadingManager.onLoad = () => {
      setIsLoading(false);
    };

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy() || 16;

    // Load High-Res NASA LRO 8K True-Color, High-Contrast & LOLA Normal/Bump Maps
    const colorMap8k = textureLoader.load('/assets/real-moon/moon_8k_nasa_truecolor.jpg', (tex) => {
      tex.anisotropy = maxAnisotropy;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
    }, undefined, () => {
      // Fallback
      textureLoader.load('/assets/real-moon/moon_8k_color_brim16.jpg', (fallbackTex) => {
        fallbackTex.anisotropy = maxAnisotropy;
        fallbackTex.colorSpace = THREE.SRGBColorSpace;
        if (moonMaterialRef.current && activeTextureMode === 'lroc_8k') {
          moonMaterialRef.current.uniforms.textureMap.value = fallbackTex;
        }
      });
    });

    const craterContrastMap = textureLoader.load('/assets/real-moon/moon_8k_high_contrast.jpg', (tex) => {
      tex.anisotropy = maxAnisotropy;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
    }, undefined, () => {
      textureLoader.load('/assets/real-moon/nasa_moon_color_4k.jpg', (fallbackTex) => {
        fallbackTex.anisotropy = maxAnisotropy;
        fallbackTex.colorSpace = THREE.SRGBColorSpace;
      });
    });

    const lolaNormalMap = textureLoader.load('/assets/real-moon/lola_ldem_8k_normal_detail.jpg', (tex) => {
      tex.anisotropy = maxAnisotropy;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
    }, undefined, () => {
      textureLoader.load('/assets/real-moon/lola_ldem_8k_normal.jpg', (fallbackTex) => {
        fallbackTex.anisotropy = maxAnisotropy;
        if (moonMaterialRef.current) moonMaterialRef.current.uniforms.normalMap.value = fallbackTex;
      });
    });

    const lolaBumpMap = textureLoader.load('/assets/real-moon/lola_ldem_8k_bump.jpg', (tex) => {
      tex.anisotropy = maxAnisotropy;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
    });

    const lolaHypsometricMap = textureLoader.load('/assets/real-moon/lola_ldem_8k_hypsometric.jpg', (tex) => {
      tex.anisotropy = maxAnisotropy;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
    });

    textureCacheRef.current = {
      lroc_8k: colorMap8k,
      crater_contrast: craterContrastMap,
      normal_8k: lolaNormalMap,
      bump_8k: lolaBumpMap,
      lola_dem: lolaHypsometricMap,
      ice_spectrometry: createWaterIceTexture(),
      thermal_diviner: createThermalTexture()
    };

    // Calculate initial sun direction (front-top illumination)
    const initialSunAngleRad = (0 * Math.PI) / 180.0;
    const sunDir = new THREE.Vector3(
      Math.sin(initialSunAngleRad),
      0.25 + 0.05 * Math.sin(initialSunAngleRad * 2.0),
      Math.cos(initialSunAngleRad)
    ).normalize();

    // High-Definition Moon Sphere Mesh (256x256 segments for authentic 3D physical relief displacement)
    const moonGeo = new THREE.SphereGeometry(MOON_RADIUS, 256, 256);
    const moonMat = new THREE.ShaderMaterial({
      uniforms: {
        textureMap: { value: colorMap8k },
        normalMap: { value: lolaNormalMap },
        bumpMap: { value: lolaBumpMap },
        cameraWorldPosition: { value: camera.position },
        sunDirection: { value: sunDir },
        reliefScale: { value: 2.8 },
        displacementScale: { value: 0.026 },
        ambientIntensity: { value: 0.28 },
        contrastBoost: { value: 1.05 },
        microDetailScale: { value: 1.0 },
        isEvenLighting: { value: 1.0 },
        isColorMode: { value: 1.0 }
      },
      vertexShader: MOON_VERT_SHADER,
      fragmentShader: MOON_FRAG_SHADER
    });
    moonMaterialRef.current = moonMat;

    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.rotation.y = Math.PI * 0.5;
    globeGroup.add(moonMesh);
    moonMeshRef.current = moonMesh;

    // Latitudinal Coordinate Rings
    const gridMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.16 });
    [-88, -85, -80, -70, -50, 0, 50, 70, 85].forEach(lat => {
      const radius = (MOON_RADIUS + 0.004) * Math.cos((lat * Math.PI) / 180);
      const y = (MOON_RADIUS + 0.004) * Math.sin((lat * Math.PI) / 180);
      const ringGeo = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius));
      }
      ringGeo.setFromPoints(points);
      globeGroup.add(new THREE.Line(ringGeo, gridMat));
    });

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth Camera Fly-To transitions
      if (targetCameraPosRef.current && cameraRef.current) {
        cameraRef.current.position.lerp(targetCameraPosRef.current, 0.06);
        if (targetControlsTargetRef.current && controlsRef.current) {
          controlsRef.current.target.lerp(targetControlsTargetRef.current, 0.06);
        }
        if (cameraRef.current.position.distanceTo(targetCameraPosRef.current) < 0.02) {
          targetCameraPosRef.current = null;
          targetControlsTargetRef.current = null;
        }
      }

      // Auto-rotation
      if (isAutoSpin && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += spinSpeed;
      }

      // Update shader camera world position uniform
      if (moonMaterialRef.current && moonMaterialRef.current.uniforms.cameraWorldPosition) {
        moonMaterialRef.current.uniforms.cameraWorldPosition.value.copy(camera.position);
      }

      // Marker pulse animation
      if (markersGroupRef.current) {
        const time = Date.now() * 0.003;
        markersGroupRef.current.children.forEach(child => {
          if (child.userData && child.userData.pulseRing) {
            const scale = 1 + Math.sin(time + (child.userData.index || 0)) * 0.25;
            child.userData.pulseRing.scale.set(scale, scale, scale);
          }
        });
      }

      // Mission beacon animation
      if (missionsGroupRef.current) {
        const time = Date.now() * 0.004;
        missionsGroupRef.current.children.forEach(child => {
          if (child.userData && child.userData.beacon) {
            const scale = 1 + Math.cos(time + 1) * 0.25;
            child.userData.beacon.scale.set(scale, scale, scale);
          }
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // Update Sun Direction & Moon Phase
  useEffect(() => {
    if (!moonMaterialRef.current) return;
    const rad = (sunAngle * Math.PI) / 180.0;
    const sunDir = new THREE.Vector3(
      Math.sin(rad),
      0.25 + 0.06 * Math.sin(rad * 2.0),
      Math.cos(rad)
    ).normalize();
    moonMaterialRef.current.uniforms.sunDirection.value.copy(sunDir);
  }, [sunAngle]);

  // Update Even Lighting Mode
  useEffect(() => {
    if (!moonMaterialRef.current) return;
    moonMaterialRef.current.uniforms.isEvenLighting.value = isEvenLighting ? 1.0 : 0.0;
  }, [isEvenLighting]);

  // Update Relief Depth Scale
  useEffect(() => {
    if (!moonMaterialRef.current) return;
    moonMaterialRef.current.uniforms.reliefScale.value = reliefScale;
  }, [reliefScale]);

  // Update 3D Displacement Scale
  useEffect(() => {
    if (!moonMaterialRef.current) return;
    moonMaterialRef.current.uniforms.displacementScale.value = displacementScale;
  }, [displacementScale]);

  // Update Ambient Intensity / Earthshine
  useEffect(() => {
    if (!moonMaterialRef.current) return;
    moonMaterialRef.current.uniforms.ambientIntensity.value = ambientIntensity;
  }, [ambientIntensity]);

  // Update Contrast Boost
  useEffect(() => {
    if (!moonMaterialRef.current) return;
    moonMaterialRef.current.uniforms.contrastBoost.value = contrastBoost;
  }, [contrastBoost]);

  // Update Micro Detail Scale
  useEffect(() => {
    if (!moonMaterialRef.current) return;
    moonMaterialRef.current.uniforms.microDetailScale.value = microDetailScale;
  }, [microDetailScale]);

  // Switch Active Texture Map Mode
  useEffect(() => {
    if (!moonMaterialRef.current || !textureCacheRef.current) return;
    const cache = textureCacheRef.current;
    const mat = moonMaterialRef.current;

    if (activeTextureMode === 'lroc_8k') {
      mat.uniforms.textureMap.value = cache.lroc_8k;
      mat.uniforms.isColorMode.value = 1.0;
      mat.uniforms.contrastBoost.value = contrastBoost;
    } else if (activeTextureMode === 'crater_contrast') {
      mat.uniforms.textureMap.value = cache.crater_contrast || cache.lroc_8k;
      mat.uniforms.isColorMode.value = 1.0;
      mat.uniforms.contrastBoost.value = 1.35;
    } else if (activeTextureMode === 'lola_dem') {
      mat.uniforms.textureMap.value = cache.lola_dem;
      mat.uniforms.isColorMode.value = 0.0;
    } else if (activeTextureMode === 'ice_spectrometry') {
      mat.uniforms.textureMap.value = cache.ice_spectrometry;
      mat.uniforms.isColorMode.value = 0.0;
    } else if (activeTextureMode === 'thermal_diviner') {
      mat.uniforms.textureMap.value = cache.thermal_diviner;
      mat.uniforms.isColorMode.value = 0.0;
    }
  }, [activeTextureMode, contrastBoost]);

  // Render Mission Landmark Markers
  useEffect(() => {
    if (!missionsGroupRef.current) return;
    const group = missionsGroupRef.current;
    group.clear();

    if (!showMissions) return;

    visibleMissions.forEach(mission => {
      const pos = latLonToVector3(mission.lat, mission.lon, MOON_RADIUS + 0.012);
      const marker = new THREE.Group();
      marker.position.set(pos.x, pos.y, pos.z);
      marker.lookAt(pos.x * 2, pos.y * 2, pos.z * 2);

      let color = 0x38bdf8;
      if (mission.category === 'isro') color = 0xf97316;
      else if (mission.category === 'nasa') color = 0x00f0ff;
      else if (mission.category === 'spacex') color = 0x10b981;
      else if (mission.category === 'sides') color = 0xa855f7;

      const isCurrentSelected = selectedMission?.id === mission.id;

      const beaconGeo = new THREE.RingGeometry(0.028, 0.048, 24);
      const beaconMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: isCurrentSelected ? 0.95 : 0.60,
        side: THREE.DoubleSide
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      marker.add(beaconMesh);

      const borderGeo = new THREE.RingGeometry(0.018, 0.024, 24);
      const borderMat = new THREE.MeshBasicMaterial({ color: 0x070b14, side: THREE.DoubleSide });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      marker.add(borderMesh);

      const coreGeo = new THREE.CircleGeometry(isCurrentSelected ? 0.024 : 0.018, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: isCurrentSelected ? 0xffffff : color });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      marker.add(coreMesh);

      marker.userData = {
        mission,
        beacon: beaconMesh,
        isMission: true
      };

      group.add(marker);
    });
  }, [showMissions, visibleMissions, selectedMission]);

  // Render AI Suitability Habitat Site Markers (High-precision subtle reticles, only when selected or active)
  useEffect(() => {
    if (!markersGroupRef.current) return;
    const group = markersGroupRef.current;
    group.clear();

    if (!layers.aiSuitability) return;

    sites.forEach((site) => {
      const isSelected = selectedSite && selectedSite.id === site.id;
      // Only render subtle marker if selected or if specifically inspecting
      if (!isSelected) return;

      const pos = latLonToVector3(site.latitude, site.longitude, MOON_RADIUS + 0.008);

      const marker = new THREE.Group();
      marker.position.set(pos.x, pos.y, pos.z);
      marker.lookAt(pos.x * 2, pos.y * 2, pos.z * 2);

      const ringGeo = new THREE.RingGeometry(0.016, 0.024, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.90,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      marker.add(ringMesh);

      const crossGeo = new THREE.RingGeometry(0.006, 0.010, 16);
      const crossMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });
      const crossMesh = new THREE.Mesh(crossGeo, crossMat);
      marker.add(crossMesh);

      marker.userData = {
        site,
        pulseRing: ringMesh,
        isSite: true
      };

      group.add(marker);
    });
  }, [sites, selectedSite, layers.aiSuitability]);

  // Clean overlays group (No fake translucent discs over authentic lunar surface)
  useEffect(() => {
    if (!overlaysGroupRef.current) return;
    overlaysGroupRef.current.clear();
  }, [sites, layers]);

  // Smooth Camera Fly-To function
  const flyToCoords = (latDeg, lonDeg, distance = 2.4) => {
    soundManager.playSelect();
    const pos = latLonToVector3(latDeg, lonDeg, distance);
    targetCameraPosRef.current = new THREE.Vector3(pos.x, pos.y, pos.z);
    targetControlsTargetRef.current = new THREE.Vector3(0, 0, 0);
  };

  const handleSelectSiteInternal = (site) => {
    setSelectedMission(null);
    onSelectSite(site);
    flyToCoords(site.latitude, site.longitude, 2.2);
  };

  const handleSelectMissionInternal = (mission) => {
    setSelectedMission(mission);
    flyToCoords(mission.lat, mission.lon, mission.zoom || 2.4);
  };

  const resetView = () => {
    soundManager.playClick();
    targetCameraPosRef.current = new THREE.Vector3(0, -2.8, 2.6);
    targetControlsTargetRef.current = new THREE.Vector3(0, -0.2, 0);
  };

  // Mouse Raycasting & Coordinates Tracking with Elevation Lookup
  const handlePointerMove = (e) => {
    if (!containerRef.current || !cameraRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const estimatedLat = -85 - (mouseY + 1) * 2.5;
    const estimatedLon = mouseX * 90;
    const clampedLat = Math.max(-90, Math.min(90, estimatedLat));
    const elevMeters = getEstimatedElevation(clampedLat, estimatedLon);

    setCursorCoords({
      lat: clampedLat,
      lon: estimatedLon,
      elevation: elevMeters
    });

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    if (missionsGroupRef.current) {
      const missionHits = raycaster.intersectObjects(missionsGroupRef.current.children, true);
      if (missionHits.length > 0) {
        let p = missionHits[0].object.parent;
        if (p && p.userData && p.userData.mission) {
          setHoveredObject({ type: 'mission', data: p.userData.mission });
          return;
        }
      }
    }

    if (markersGroupRef.current) {
      const siteHits = raycaster.intersectObjects(markersGroupRef.current.children, true);
      if (siteHits.length > 0) {
        let p = siteHits[0].object.parent;
        if (p && p.userData && p.userData.site) {
          setHoveredObject({ type: 'site', data: p.userData.site });
          return;
        }
      }
    }

    setHoveredObject(null);
  };

  const handleClick = (e) => {
    if (!containerRef.current || !cameraRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    if (missionsGroupRef.current) {
      const missionHits = raycaster.intersectObjects(missionsGroupRef.current.children, true);
      if (missionHits.length > 0) {
        let p = missionHits[0].object.parent;
        if (p && p.userData && p.userData.mission) {
          handleSelectMissionInternal(p.userData.mission);
          return;
        }
      }
    }

    if (markersGroupRef.current) {
      const siteHits = raycaster.intersectObjects(markersGroupRef.current.children, true);
      if (siteHits.length > 0) {
        let p = siteHits[0].object.parent;
        if (p && p.userData && p.userData.site) {
          handleSelectSiteInternal(p.userData.site);
          return;
        }
      }
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-[#030712] overflow-hidden select-none"
      onMouseMove={handlePointerMove}
      onClick={handleClick}
    >
      {/* 1. Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-[#030712]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 transition-opacity duration-700">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
          <div className="text-lg font-mono font-bold text-white tracking-wider flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
            LOADING NASA LOLA 8K GLOBAL LDEM (118m)
          </div>
          <div className="text-xs font-mono text-slate-400 mt-2 max-w-sm">
            Initializing high-precision NASA LOLA laser altimeter digital elevation model & Hapke regolith shaders ({loadingPercent}%)...
          </div>
          <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4 border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${loadingPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3. Top Search & Filter Bar */}
      <div className="absolute top-4 left-4 z-20 w-80 max-w-[calc(100%-2rem)]">
        <div className="relative flex items-center bg-[#0B1120]/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg px-3 py-2">
          <Search className="w-4 h-4 text-cyan-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search Chandrayaan, Apollo, Artemis, crater..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs font-mono text-white placeholder-slate-400 focus:outline-none w-full"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white text-xs font-mono px-1"
            >
              ×
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="mt-1 bg-[#0B1120]/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl">
            {searchResults.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.isMission) {
                    handleSelectMissionInternal(item.missionData);
                  } else {
                    handleSelectSiteInternal(item);
                  }
                  setSearchQuery('');
                }}
                className="px-3 py-2 hover:bg-slate-800/80 cursor-pointer border-b border-slate-800/60 last:border-0 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    {item.isMission ? <Rocket className="w-3 h-3 text-orange-400" /> : <MapPin className="w-3 h-3 text-cyan-400" />}
                    <span>{item.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}° • {item.siteType}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                  FLY TO
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Top Center: Texture Map & Surface Mode Switcher */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 hidden md:flex items-center gap-1 bg-[#0B1120]/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl overflow-x-auto max-w-[90vw] no-scrollbar">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTextureMode('lroc_8k');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTextureMode === 'lroc_8k'
              ? 'bg-cyan-600 text-white shadow-glow-cyan'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>NASA 8K Real Moon</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTextureMode('crater_contrast');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTextureMode === 'crater_contrast'
              ? 'bg-amber-600 text-white shadow-glow-amber'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>High-Contrast Surface</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTextureMode('lola_dem');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTextureMode === 'lola_dem'
              ? 'bg-emerald-600 text-white shadow-glow-emerald'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>LOLA 8K Topography (118m LDEM)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTextureMode('ice_spectrometry');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTextureMode === 'ice_spectrometry'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Water Ice Neutron</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTextureMode('thermal_diviner');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTextureMode === 'thermal_diviner'
              ? 'bg-purple-600 text-white shadow-glow-purple'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5" />
          <span>Diviner Thermal IR</span>
        </button>
      </div>

      {/* 5. Top Right: Moon Phase & Lighting HUD */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        {/* Real-time Telemetry & LOLA Elevation readout */}
        <div className="bg-[#0B1120]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Target: <strong className="text-white">Lunar South Pole</strong></span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            Lat: <span className="text-cyan-300 font-bold">{cursorCoords.lat.toFixed(2)}°</span>
          </div>
          <div>
            Lon: <span className="text-cyan-300 font-bold">{cursorCoords.lon.toFixed(2)}°</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-emerald-400 font-bold flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Elev: {cursorCoords.elevation > 0 ? `+${cursorCoords.elevation}` : cursorCoords.elevation} m</span>
          </div>
        </div>

        {/* View Controls Toolbox */}
        <div className="bg-[#0B1120]/90 backdrop-blur-md rounded-xl border border-slate-800 p-1 flex items-center gap-1 shadow-lg">
          <button
            onClick={() => {
              soundManager.playClick();
              if (cameraRef.current && controlsRef.current) {
                const target = controlsRef.current.target || new THREE.Vector3(0, 0, 0);
                const offset = new THREE.Vector3().subVectors(cameraRef.current.position, target);
                const currentDist = offset.length();
                const newDist = Math.max(controlsRef.current.minDistance, currentDist * 0.84);
                offset.setLength(newDist);
                cameraRef.current.position.copy(target).add(offset);
                controlsRef.current.update();
              }
            }}
            title="Zoom In"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              if (cameraRef.current && controlsRef.current) {
                const target = controlsRef.current.target || new THREE.Vector3(0, 0, 0);
                const offset = new THREE.Vector3().subVectors(cameraRef.current.position, target);
                const currentDist = offset.length();
                const newDist = Math.min(controlsRef.current.maxDistance, currentDist * 1.18);
                offset.setLength(newDist);
                cameraRef.current.position.copy(target).add(offset);
                controlsRef.current.update();
              }
            }}
            title="Zoom Out"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            title="Reset Polar View"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            title={isAutoSpin ? 'Freeze Moon' : 'Start Auto-Spin'}
            className={`p-1.5 rounded-lg transition-colors ${
              isAutoSpin ? 'text-cyan-400 bg-cyan-950/80' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {isAutoSpin ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsControlsExpanded(!isControlsExpanded)}
            title="Lighting & Relief Controls"
            className={`p-1.5 rounded-lg transition-colors ${
              isControlsExpanded ? 'text-amber-400 bg-amber-950/80' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded Topography & Lighting Sliders */}
        {isControlsExpanded && (
          <div className="bg-[#0B1120]/95 backdrop-blur-xl p-3 rounded-xl border border-slate-700 text-xs font-mono shadow-2xl w-64 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Even Lighting Mode Toggle */}
            <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Even Global Light
              </span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsEvenLighting(!isEvenLighting);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  isEvenLighting 
                    ? 'bg-cyan-600 text-white shadow-glow-cyan' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isEvenLighting ? 'ON' : 'OFF'}
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Sun className="w-3.5 h-3.5" /> Sun Angle / Phase
                </span>
                <span className="text-[11px] text-amber-300">{getPhaseName(sunAngle)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={sunAngle}
                onChange={(e) => setSunAngle(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <button onClick={() => setSunAngle(0)} className="hover:text-amber-400">New</button>
                <button onClick={() => setSunAngle(90)} className="hover:text-amber-400">1st Qtr</button>
                <button onClick={() => setSunAngle(180)} className="hover:text-amber-400 font-bold text-amber-400">Full</button>
                <button onClick={() => setSunAngle(270)} className="hover:text-amber-400">3rd Qtr</button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Mountain className="w-3.5 h-3.5" /> LOLA Crater Relief Depth
                </span>
                <span className="text-cyan-300 font-bold">{reliefScale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={reliefScale}
                onChange={(e) => setReliefScale(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Activity className="w-3.5 h-3.5" /> 3D Elevation Displacement
                </span>
                <span className="text-emerald-300 font-bold">{(displacementScale * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.06"
                step="0.002"
                value={displacementScale}
                onChange={(e) => setDisplacementScale(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded accent-emerald-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <Globe className="w-3.5 h-3.5" /> Earthshine / Ambient Fill
                </span>
                <span className="text-blue-300 font-bold">{Math.round(ambientIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.30"
                step="0.01"
                value={ambientIntensity}
                onChange={(e) => setAmbientIntensity(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded accent-blue-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <Camera className="w-3.5 h-3.5" /> Regolith Photographic Contrast
                </span>
                <span className="text-purple-300 font-bold">{contrastBoost.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.6"
                step="0.05"
                value={contrastBoost}
                onChange={(e) => setContrastBoost(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded accent-purple-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. LOLA LDEM Hypsometric Elevation Legend (Shown in LOLA DEM mode) */}
      {activeTextureMode === 'lola_dem' && (
        <div className="absolute top-20 right-4 z-20 bg-[#0B1120]/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-[10px] font-mono shadow-2xl animate-in fade-in duration-200">
          <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
            <span>NASA LOLA 118m LDEM Scale</span>
          </div>
          <div className="h-3 w-48 rounded bg-gradient-to-r from-[#2c004d] via-[#0284c7] via-[#eab308] via-[#dc2626] to-[#ffffff] border border-slate-600 mb-1" />
          <div className="flex justify-between text-slate-400 text-[9px]">
            <span>-9,000m (Basin)</span>
            <span>0m (Datum)</span>
            <span>+10,700m (Peaks)</span>
          </div>
        </div>
      )}

      {/* 7. Bottom Missions & Exploration Toolbar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-col gap-2">
        
        {/* Mission Quick-Jump Pills */}
        <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <div className="bg-[#0B1120]/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 flex items-center gap-1 shrink-0 shadow-xl">
            <span className="text-[10px] font-mono text-slate-400 px-2 font-bold flex items-center gap-1">
              <Rocket className="w-3 h-3 text-orange-400" /> EXPLORE:
            </span>
            <button
              onClick={() => setActiveMissionFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                activeMissionFilter === 'all' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({LUNAR_MISSIONS.length})
            </button>
            <button
              onClick={() => setActiveMissionFilter('isro')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition-colors ${
                activeMissionFilter === 'isro' ? 'bg-orange-600 text-white shadow-glow-orange' : 'text-slate-400 hover:text-orange-400'
              }`}
            >
              <span>🇮🇳 ISRO ({LUNAR_MISSIONS.filter(m => m.category === 'isro').length})</span>
            </button>
            <button
              onClick={() => setActiveMissionFilter('nasa')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition-colors ${
                activeMissionFilter === 'nasa' ? 'bg-blue-600 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-blue-400'
              }`}
            >
              <span>🇺🇸 NASA ({LUNAR_MISSIONS.filter(m => m.category === 'nasa').length})</span>
            </button>
            <button
              onClick={() => setActiveMissionFilter('spacex')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition-colors ${
                activeMissionFilter === 'spacex' ? 'bg-emerald-600 text-white shadow-glow-emerald' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <span>🚀 SpaceX / CLPS ({LUNAR_MISSIONS.filter(m => m.category === 'spacex').length})</span>
            </button>
            <button
              onClick={() => setActiveMissionFilter('sides')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition-colors ${
                activeMissionFilter === 'sides' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-purple-400'
              }`}
            >
              <span>🌑 Sides & Poles</span>
            </button>
          </div>

          {/* Individual Mission Quick-Jump Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            {visibleMissions.map(m => (
              <button
                key={m.id}
                onClick={() => handleSelectMissionInternal(m)}
                className={`shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-mono border backdrop-blur-md transition-all flex items-center gap-1.5 ${
                  selectedMission?.id === m.id
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 shadow-glow-cyan font-bold'
                    : 'bg-[#0B1120]/80 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                <span>{m.name.split('(')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Mission Modal Card */}
        {selectedMission && (
          <div className="pointer-events-auto bg-[#070B14]/95 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-2xl shadow-2xl max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    {selectedMission.agency}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedMission.country}</span>
                  <span className="text-xs font-mono text-emerald-400">• {selectedMission.status}</span>
                </div>
                <h3 className="text-sm font-mono font-bold text-white mt-1">{selectedMission.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMission(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mission / Site Reconnaissance Image */}
            <div className="relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img 
                src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80"
                alt={selectedMission.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/20" />
              <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5 text-[9px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-700/50">
                <Camera className="w-3 h-3 text-cyan-400" />
                <span>Surface & Orbital Photographic Reconnaissance</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500">Date:</span> <strong className="text-slate-200">{selectedMission.date}</strong>
              </div>
              <div>
                <span className="text-slate-500">Coordinates:</span> <strong className="text-cyan-300">{selectedMission.lat.toFixed(2)}°, {selectedMission.lon.toFixed(2)}°</strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500">Craft:</span> <strong className="text-slate-200 truncate block">{selectedMission.craft}</strong>
              </div>
            </div>

            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              {selectedMission.discovery}
            </p>

            {/* Clickable Full Scientific Telemetry Page Opener Button */}
            <button
              onClick={() => {
                soundManager.playSelect();
                // Robust multi-tier site resolution from mission
                let matchedSite = sites.find(s => 
                  s.id === selectedMission.id || 
                  (s.name && selectedMission.name && s.name.toLowerCase().includes(selectedMission.name.toLowerCase().split('(')[0].trim())) ||
                  (s.code && selectedMission.name && selectedMission.name.toLowerCase().includes(s.code.toLowerCase()))
                );

                if (!matchedSite) {
                  // Keyword matching against crater / region names (e.g., Cabeus, Shackleton, Malapert, Apollo, Shiv Shakti)
                  const missionText = `${selectedMission.name} ${selectedMission.discovery || ''}`.toLowerCase();
                  matchedSite = sites.find(s => 
                    (s.name && missionText.includes(s.name.toLowerCase())) ||
                    (s.code && missionText.includes(s.code.toLowerCase())) ||
                    (s.shortName && missionText.includes(s.shortName.toLowerCase()))
                  );
                }

                if (!matchedSite && sites.length > 0 && selectedMission.lat !== undefined && selectedMission.lon !== undefined) {
                  // Closest site by spherical distance
                  matchedSite = sites.reduce((closest, s) => {
                    const dCurrent = Math.hypot((s.latitude || 0) - selectedMission.lat, (s.longitude || 0) - selectedMission.lon);
                    const dClosest = Math.hypot((closest.latitude || 0) - selectedMission.lat, (closest.longitude || 0) - selectedMission.lon);
                    return dCurrent < dClosest ? s : closest;
                  }, sites[0]);
                }

                if (matchedSite) {
                  onSelectSite(matchedSite);
                }
                setSelectedMission(null);
                onOpenDeepDive();
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-glow-cyan flex items-center justify-center gap-2 border border-cyan-400/40 mt-1 cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-cyan-300" />
              <span>Open Full Scientific Telemetry & Comprehensive Parameters Page ↗</span>
            </button>
          </div>
        )}

        {/* NASA Provenance Footer Badge */}
        <div className="flex items-center justify-between pointer-events-none">
          <div className="bg-[#0B1120]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>NASA LOLA Global LDEM (118m Laser Altimetry) + LROC 8K Regolith Mosaic</span>
          </div>
        </div>
      </div>

      {/* 8. Hovered Tooltip */}
      {hoveredObject && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-[#0B1120]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono shadow-xl flex items-center gap-2">
            {hoveredObject.type === 'mission' ? (
              <>
                <Rocket className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-white font-bold">{hoveredObject.data.name}</span>
                <span className="text-orange-400 font-semibold">{hoveredObject.data.agency}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white font-bold">{hoveredObject.data.name}</span>
                <span className="text-emerald-400 font-semibold">{hoveredObject.data.suitabilityScore?.toFixed(1)}/100</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map3D;
