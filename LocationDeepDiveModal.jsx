import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Mountain, 
  Droplets, 
  Sun, 
  Radiation, 
  Thermometer, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Compass, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  FileText,
  Check,
  Rocket,
  Target,
  Map as MapIcon,
  Globe,
  Sliders,
  Maximize2,
  Crosshair,
  ExternalLink,
  Eye,
  Scan,
  Database
} from 'lucide-react';
import scientificDataset from '../data/lunar_scientific_dataset.json';
import { getVisualArchiveForSite } from '../data/lunarVisualArchive';
import { soundManager } from '../utils/audio';
import {
  generateTerrainMesh,
  generateRoughnessProfile,
  generateSlopeDistribution,
  generateSolarIlluminationCurve,
  generateRadiationModel,
  generateIcePSRModel,
  generateCraterContours
} from '../utils/scientificVisualizers';

export const LocationDeepDiveModal = ({
  isOpen = false,
  onClose = () => {},
  site = null
}) => {
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [copied, setCopied] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  const safeSite = site || {};

  // Find exact enriched record from lunar_scientific_dataset.json
  const enriched = (Array.isArray(scientificDataset) ? scientificDataset : []).find(
    (d) => (safeSite.id && d.id === safeSite.id) || (safeSite.code && d.code?.toLowerCase() === safeSite.code?.toLowerCase()) || (safeSite.name && d.code && safeSite.name.toLowerCase().includes(d.code.toLowerCase()))
  ) || null;

  // Visual & Geological Reconnaissance Archive Record
  const visualArchive = useMemo(() => getVisualArchiveForSite(safeSite), [safeSite]);

  // Fallback structures if enriched is partially missing
  const terrain = enriched?.terrain_dem || {
    elevation_m: safeSite.elevationMeters || 0,
    slope_deg: safeSite.slopeDegrees || 0,
    roughness_rms_m: 0.85,
    crater_diameter_km: 25.0,
    rim_depth_m: 3500,
    landing_corridor_rating: 'Standard Highland Corridor',
    accessibility_index_100: safeSite.factors?.accessibility || 80
  };

  const waterIce = enriched?.water_ice || {
    ice_probability_pct: (safeSite.waterIcePurityPercent || 15) * 4.5,
    hydrogen_content_ppm: Math.round((safeSite.waterIcePurityPercent || 15) * 80),
    radar_cpr: 0.72,
    spectroscopy_band_3um_depth: 0.075,
    distance_to_psr_m: safeSite.distanceToPsrMeters || 400,
    estimated_ice_depth_m: 1.2,
    psr_name: `${safeSite.shortName || safeSite.code || 'Target'} Shadow Basin`
  };

  const solar = enriched?.solar_illumination || {
    annual_sunlight_pct: safeSite.illuminationPercent || 85,
    max_continuous_light_days: Math.round((safeSite.illuminationPercent || 85) * 1.6),
    max_continuous_dark_days: Math.max(3.5, Math.round((100 - (safeSite.illuminationPercent || 85)) * 0.4)),
    avg_solar_elevation_deg: 1.45,
    seasonal_variance_pct: 6.5
  };

  const radiation = enriched?.radiation_environment || {
    gcr_dose_msv_yr: safeSite.radiationLevelMsvPerYear || 300,
    spe_hazard_tier: 'Moderate (Solar Polar Exposure)',
    dose_rate_usv_h: Number(((safeSite.radiationLevelMsvPerYear || 300) / 8760 * 1000).toFixed(1)),
    solar_cycle_phase: 'Cycle 25 Maximum Modulation',
    terrain_shielding_factor_pct: safeSite.factors?.radiationSafety || 80
  };

  const comms = enriched?.geographic_communications || {
    geological_unit: 'Anorthositic Impact Melt Breccia & Regolith',
    crater_boundary: `${safeSite.shortName || safeSite.code || 'Target'} Geological Margin`,
    earth_direct_los_pct: safeSite.earthLineOfSightPercent || 95,
    relay_satellite_required: (safeSite.earthLineOfSightPercent || 95) < 90,
    near_or_far_side: (safeSite.latitude || 0) < -80 ? 'South Polar Region' : 'Near Side'
  };

  const mlMatrix = enriched?.ai_ml_matrix || {
    ground_truth_label: `${safeSite.tier || 'SUITABLE'} Habitation Candidate`,
    mission_ground_truth_reference: 'NASA LRO LOLA / Diviner / Chandrayaan M3',
    mcda_suitability_score: safeSite.suitabilityScore || 85,
    ai_confidence_pct: safeSite.aiConfidence || 90,
    suitability_tier: safeSite.tier || 'SUITABLE'
  };

  const temps = enriched?.environmental_temperatures || {
    temp_min_k: safeSite.tempMinKelvin || 150,
    temp_max_k: safeSite.tempMaxKelvin || 220,
    diurnal_temperature_swing_k: (safeSite.tempMaxKelvin || 220) - (safeSite.tempMinKelvin || 150)
  };

  // Pure data-driven visualizations calculated reactively for the selected node
  const terrainVisuals = useMemo(() => {
    try {
      return generateTerrainMesh(terrain.slope_deg, terrain.elevation_m, terrain.roughness_rms_m) || { wirelines: [], polygonPoints: '', peakX: 80, peakY: 45, grade: 'Nominal' };
    } catch(e) {
      return { wirelines: [], polygonPoints: '', peakX: 80, peakY: 45, grade: 'Nominal' };
    }
  }, [terrain.slope_deg, terrain.elevation_m, terrain.roughness_rms_m]);

  const roughnessVisuals = useMemo(() => {
    try {
      return generateRoughnessProfile(terrain.roughness_rms_m, terrain.elevation_m, terrain.crater_diameter_km);
    } catch(e) {
      return { path: '', points: [], avgRoughnessText: '0.85m RMS' };
    }
  }, [terrain.roughness_rms_m, terrain.elevation_m, terrain.crater_diameter_km]);

  const slopeVisuals = useMemo(() => {
    try {
      return generateSlopeDistribution(terrain.slope_deg, terrain.roughness_rms_m);
    } catch(e) {
      return { bars: [], distributionSummary: 'Nominal Slope' };
    }
  }, [terrain.slope_deg, terrain.roughness_rms_m]);

  const solarVisuals = useMemo(() => {
    try {
      return generateSolarIlluminationCurve(
        solar.annual_sunlight_pct,
        solar.max_continuous_light_days,
        solar.max_continuous_dark_days,
        solar.seasonal_variance_pct
      );
    } catch(e) {
      return { path: '', fillPath: '', points: [] };
    }
  }, [solar.annual_sunlight_pct, solar.max_continuous_light_days, solar.max_continuous_dark_days, solar.seasonal_variance_pct]);

  const radiationVisuals = useMemo(() => {
    try {
      return generateRadiationModel(
        radiation.gcr_dose_msv_yr,
        radiation.dose_rate_usv_h,
        radiation.terrain_shielding_factor_pct
      );
    } catch(e) {
      return { segments: [], hazardStatus: 'Moderate', safetyFactorPct: 80 };
    }
  }, [radiation.gcr_dose_msv_yr, radiation.dose_rate_usv_h, radiation.terrain_shielding_factor_pct]);

  const iceVisuals = useMemo(() => {
    try {
      return generateIcePSRModel(
        waterIce.ice_probability_pct,
        waterIce.hydrogen_content_ppm,
        waterIce.distance_to_psr_m
      );
    } catch(e) {
      return { concentricCircles: [], hydrationGrade: 'Standard Polar Grade' };
    }
  }, [waterIce.ice_probability_pct, waterIce.hydrogen_content_ppm, waterIce.distance_to_psr_m]);

  const craterContours = useMemo(() => {
    try {
      return generateCraterContours(
        terrain.crater_diameter_km,
        terrain.rim_depth_m,
        terrain.slope_deg
      );
    } catch(e) {
      return { contourPaths: [], rimCoordinates: [] };
    }
  }, [terrain.crater_diameter_km, terrain.rim_depth_m, terrain.slope_deg]);

  const handlePrint = () => {
    soundManager.playSelect();
    window.print();
  };

  const handleExportJson = () => {
    soundManager.playSelect();
    const exportData = {
      export_timestamp_utc: new Date().toISOString(),
      site_id: safeSite.id,
      name: safeSite.name,
      coordinates: { latitude: safeSite.latitude, longitude: safeSite.longitude },
      scientific_metrics: {
        terrain_dem: terrain,
        water_ice: waterIce,
        solar_illumination: solar,
        radiation_environment: radiation,
        geographic_communications: comms,
        environmental_temperatures: temps,
        ai_ml_decision_matrix: mlMatrix
      },
      visual_reconnaissance_archive: visualArchive,
      why_this_site: safeSite.whyThisSite,
      mission_recommendations: safeSite.missionRecommendations
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lunar_Scientific_Telemetry_${(safeSite.code || 'Site').replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !site) return null;

  const hasselbladPhotos = visualArchive?.hasselblad_surface_reconnaissance || [];
  const samplingStations = visualArchive?.eva_traverse_map?.sampling_stations || [];
  const visibleFeatures = visualArchive?.lroc_overhead_reconnaissance?.visible_features || [];
  const wirelines = terrainVisuals?.wirelines || [];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#070B14] border border-cyan-500/50 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  FULL SCIENTIFIC TELEMETRY PAGE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Lat: {site.latitude?.toFixed(3)}° • Lon: {site.longitude?.toFixed(3)}°
                </span>
              </div>
              <h2 className="text-lg font-bold font-mono text-white mt-0.5 flex items-center gap-2">
                {site.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs transition-colors cursor-pointer"
              title="Export Raw JSON Data"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copied ? 'Exported JSON' : 'Export JSON'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Print Telemetry Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-6 py-2 bg-[#050811] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
              activeSubTab === 'all' ? 'bg-cyan-600 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Parameters
          </button>
          <button
            onClick={() => setActiveSubTab('visual_recon')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer shrink-0 ${
              activeSubTab === 'visual_recon'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-glow-cyan'
                : 'text-purple-300 hover:text-white bg-purple-950/40 border border-purple-500/40'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-purple-300" /> 📸 Visual & Geological Archive
          </button>
          <button
            onClick={() => setActiveSubTab('terrain')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeSubTab === 'terrain' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" /> Terrain & DEM
          </button>
          <button
            onClick={() => setActiveSubTab('ice')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeSubTab === 'ice' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-blue-400'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" /> Water Ice
          </button>
          <button
            onClick={() => setActiveSubTab('solar')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeSubTab === 'solar' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Solar Power
          </button>
          <button
            onClick={() => setActiveSubTab('radiation')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeSubTab === 'radiation' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-purple-400'
            }`}
          >
            <Radiation className="w-3.5 h-3.5" /> Radiation
          </button>
          <button
            onClick={() => setActiveSubTab('comms')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeSubTab === 'comms' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-sky-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Earth Comms
          </button>
          <button
            onClick={() => setActiveSubTab('ml')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeSubTab === 'ml' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-indigo-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> AI/ML Matrix
          </button>
        </div>

        {/* Modal Body (Scrollable Report View) */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 font-sans text-xs">
          
          {/* SECTION: 📸 VISUAL & GEOLOGICAL RECONNAISSANCE ARCHIVE */}
          {(activeSubTab === 'visual_recon' || activeSubTab === 'all') && visualArchive && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#090E1A] to-[#050811] border border-cyan-500/40 space-y-5 shadow-2xl animate-in fade-in duration-300">
              
              {/* Header Title Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2 font-mono">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">
                      NASA PDS GEOSCIENCES NODE ARCHIVE
                    </span>
                    <span className="text-xs text-slate-400">
                      Official Reconnaissance Package • {visualArchive.name}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    AUTHENTIC 70MM HASSELBLAD, EVA TRAVERSE & LROC NAC RECONNAISSANCE
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-800">
                  <Scan className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resolution: <strong>0.5 m/pixel</strong> • Elevation: <strong>{safeSite.elevationMeters || 0}m</strong></span>
                </div>
              </div>

              {/* 1. ORIGINAL 70MM HASSELBLAD SURFACE PHOTOGRAPHS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                    <span>1. 70MM HASSELBLAD SURFACE PHOTOGRAPHS & EXPERIMENTS</span>
                    <span className="text-[9px] bg-cyan-950/80 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-500/30">
                      {hasselbladPhotos.length} ARCHIVAL FRAMES
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Zeiss 60mm Biogon / Kodak Ektachrome Film</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {hasselbladPhotos.map((photo, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        soundManager.playClick();
                        setActiveLightboxImg(photo);
                      }}
                      className="group relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-cyan-500/60 transition-all duration-300 cursor-pointer shadow-lg flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden bg-black">
                        <img 
                          src={photo.image_url} 
                          alt={photo.title || 'Surface Reconnaissance'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/20" />
                        
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="text-[9px] font-mono font-bold bg-black/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 backdrop-blur-sm">
                            {photo.photo_id || `FRAME-${idx+1}`}
                          </span>
                        </div>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="p-1.5 rounded-lg bg-black/80 text-cyan-300 border border-slate-700 backdrop-blur-sm block">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#0B1120] border-t border-slate-800/80 space-y-1.5 font-mono text-[11px] flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-100 text-xs">{photo.title}</h4>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">{photo.features_shown}</p>
                        </div>
                        
                        <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500">
                          <span>Camera: <strong className="text-slate-300">{photo.camera_type ? photo.camera_type.split('/')[0] : '70mm Hasselblad'}</strong></span>
                          <span>Hardware: <strong className="text-cyan-400">{photo.hardware_experiments ? photo.hardware_experiments.split('&')[0] : 'Science Package'}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. NASA EVA TRAVERSE MAP & 3. HIGH-RES LROC OVERHEAD DUAL PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* EVA Traverse Map Panel */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <MapIcon className="w-4 h-4 text-amber-400" /> 2. NASA EVA TRAVERSE & SAMPLING MAP
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Total Traverse: <strong className="text-amber-300">{visualArchive.eva_traverse_map?.total_distance_km || 4.5} km</strong>
                    </span>
                  </div>

                  <div 
                    onClick={() => {
                      soundManager.playClick();
                      setActiveLightboxImg({
                        title: visualArchive.eva_traverse_map?.map_title || 'EVA Traverse Map',
                        image_url: visualArchive.eva_traverse_map?.map_image_url,
                        features_shown: `Total Distance: ${visualArchive.eva_traverse_map?.total_distance_km || 4.5} km. Astronaut & Rover surface paths.`
                      });
                    }}
                    className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group cursor-pointer"
                  >
                    <img 
                      src={visualArchive.eva_traverse_map?.map_image_url} 
                      alt={visualArchive.eva_traverse_map?.map_title || 'EVA Traverse Map'}
                      className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* SVG Vector EVA Path Overlay */}
                    <svg viewBox="0 0 300 150" className="absolute inset-0 w-full h-full pointer-events-none">
                      <path d="M 40 110 Q 90 60 150 75 T 260 40" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4,4" />
                      <circle cx="40" cy="110" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                      <circle cx="150" cy="75" r="3.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                      <circle cx="260" cy="40" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      <text x="45" y="115" fill="#10b981" fontSize="8" fontWeight="bold">Touchdown</text>
                      <text x="155" y="75" fill="#06b6d4" fontSize="8" fontWeight="bold">Station 1</text>
                      <text x="210" y="35" fill="#ef4444" fontSize="8" fontWeight="bold">Station 2</text>
                    </svg>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] text-slate-300">
                      <span className="font-bold truncate max-w-[70%]">{visualArchive.eva_traverse_map?.map_title || 'NASA EVA Map'}</span>
                      <span className="bg-black/80 px-2 py-0.5 rounded text-amber-400 font-bold border border-amber-500/30">
                        CLICK TO EXPAND MAP
                      </span>
                    </div>
                  </div>

                  {/* Sampling Station List */}
                  <div className="space-y-1.5 text-[10px]">
                    <div className="text-slate-400 uppercase tracking-wider font-bold">Documented Sampling Stations:</div>
                    {samplingStations.map((st, sidx) => (
                      <div key={sidx} className="flex items-start justify-between bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                        <span className="text-amber-400 font-bold shrink-0 mr-2">{st.station_id}:</span>
                        <span className="text-slate-300 truncate flex-1">{st.description}</span>
                        <span className="text-cyan-300 font-bold shrink-0 ml-2">[{st.target_sample}]</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* High-Resolution LROC NAC Overhead Panel */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-cyan-400" /> 3. HIGH-RES LROC NAC OVERHEAD (0.5m/px)
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      Frame: {visualArchive.lroc_overhead_reconnaissance?.frame_id || 'M102288180LE'}
                    </span>
                  </div>

                  <div 
                    onClick={() => {
                      soundManager.playClick();
                      setActiveLightboxImg({
                        title: `LROC NAC Orbital Overhead — Frame ${visualArchive.lroc_overhead_reconnaissance?.frame_id || 'NAC'}`,
                        image_url: visualArchive.lroc_overhead_reconnaissance?.overhead_image_url,
                        features_shown: (visibleFeatures || []).join(' • ')
                      });
                    }}
                    className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group cursor-pointer"
                  >
                    <img 
                      src={visualArchive.lroc_overhead_reconnaissance?.overhead_image_url} 
                      alt="LROC Overhead Reconnaissance"
                      className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Targeting Reticle Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 border border-cyan-400/60 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] text-slate-300">
                      <span className="font-bold">Sun Angle: {visualArchive.lroc_overhead_reconnaissance?.sun_elevation_deg || 14.5}°</span>
                      <span className="bg-black/80 px-2 py-0.5 rounded text-cyan-400 font-bold border border-cyan-500/30">
                        CLICK TO ENLARGE OVERHEAD
                      </span>
                    </div>
                  </div>

                  {/* Visible Orbital Features Checklist */}
                  <div className="space-y-1 text-[10px]">
                    <div className="text-slate-400 uppercase tracking-wider font-bold">Identified Orbital Features:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {visibleFeatures.map((feat, fidx) => (
                        <div key={fidx} className="flex items-center gap-1.5 text-slate-300 bg-slate-950/80 p-1.5 rounded border border-slate-800/80">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* 4. COMPREHENSIVE GEOLOGICAL & LITHOLOGICAL BREAKDOWN MATRIX */}
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" /> 4. GEOLOGICAL & LITHOLOGICAL ANALYSIS MATRIX
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    {visualArchive.geological_breakdown?.stratigraphic_era || 'Highland Province'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Lithology & Regolith */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-[10px] text-slate-400 uppercase">Primary Lithology</div>
                    <div className="font-bold text-white text-xs">{visualArchive.geological_breakdown?.primary_lithology || 'Ferroan Anorthosite'}</div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Regolith Depth: <strong className="text-cyan-300">{visualArchive.geological_breakdown?.regolith_depth_m || 3.5} meters</strong>
                    </div>
                  </div>

                  {/* Mineral Abundance */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-[10px] text-slate-400 uppercase">Mineral / Elemental Abundance</div>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <div>Plagioclase: <strong className="text-emerald-400">{visualArchive.geological_breakdown?.mineral_composition?.plagioclase_pct || 75}%</strong></div>
                      <div>Pyroxene: <strong className="text-cyan-400">{visualArchive.geological_breakdown?.mineral_composition?.pyroxene_pct || 15}%</strong></div>
                      <div>Ilmenite (TiO2): <strong className="text-amber-400">{visualArchive.geological_breakdown?.mineral_composition?.ilmenite_tio2_pct || 1.2}%</strong></div>
                      <div>Iron (FeO): <strong className="text-rose-400">{visualArchive.geological_breakdown?.mineral_composition?.feo_pct || 5.4}%</strong></div>
                    </div>
                  </div>

                  {/* Volatiles & Thermal Delta */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-[10px] text-slate-400 uppercase">Volatile Trapping & Thermal Delta</div>
                    <div className="text-xs font-bold text-cyan-300">{visualArchive.geological_breakdown?.volatile_trapping_potential || 'High Trapping Capacity'}</div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Min/Max Temp: <strong className="text-white">{visualArchive.geological_breakdown?.thermal_profile?.surface_min_k || 80}K / {visualArchive.geological_breakdown?.thermal_profile?.surface_max_k || 240}K</strong>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <strong className="text-cyan-300 font-mono text-[11px]">Geomorphological Assessment: </strong>
                  {visualArchive.geological_breakdown?.geomorphology || 'Pristine highland geological setting.'}
                </p>
              </div>

            </div>
          )}

          {/* Section 1: Surface & Orbital Images */}
          {(activeSubTab === 'all' || activeSubTab === 'terrain') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-64 rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 group shadow-xl">
                <img 
                  src={site.surfaceImageUrl || site.thumbnail} 
                  alt={site.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/30" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-white bg-black/70 px-2 py-1 rounded-lg backdrop-blur-sm border border-slate-700">
                    Surface Optical Survey (Lander Camera)
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    LOLA: {terrain.elevation_m}m
                  </span>
                </div>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden border border-purple-500/40 bg-slate-950 group shadow-xl">
                <img 
                  src={site.orbitalImageUrl || site.thumbnail} 
                  alt={site.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/30" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-white bg-black/70 px-2 py-1 rounded-lg backdrop-blur-sm border border-slate-700">
                    Orbital Laser Altimetry (LROC NAC / LOLA)
                  </span>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                    Slope: {terrain.slope_deg}°
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Topography & Terrain Parameters */}
          {(activeSubTab === 'all' || activeSubTab === 'terrain') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                  <Mountain className="w-4 h-4" /> 1. TOPOGRAPHY & DIGITAL ELEVATION MODEL (DEM)
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  Data: NASA LOLA SLDEM2015 (118m)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Elevation (Datum)</div>
                  <div className="text-base font-bold text-emerald-400">{terrain.elevation_m} m</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Local Slope Angle</div>
                  <div className="text-base font-bold text-emerald-400">{terrain.slope_deg}°</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">RMS Roughness (1m)</div>
                  <div className="text-base font-bold text-cyan-400">{terrain.roughness_rms_m} m</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Landing Accessibility</div>
                  <div className="text-base font-bold text-purple-400">{terrain.accessibility_index_100}%</div>
                </div>
              </div>

              {/* Dynamic Mathematical 3D Vector Topographic Wireframe Mesh */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Scan className="w-3.5 h-3.5 text-emerald-400" /> Dynamic 3D Laser Altimetry Surface Mesh (LOLA slope {terrain.slope_deg}° & alt {terrain.elevation_m}m)
                  </span>
                  <span className="text-emerald-400 font-bold">Grade: {terrainVisuals.grade}</span>
                </div>
                <div className="relative h-28 w-full bg-[#050811] rounded-lg overflow-hidden border border-slate-800/80 flex items-center justify-center">
                  <svg viewBox="0 0 160 90" className="w-full h-full">
                    {wirelines.map((d, idx) => (
                      <path key={idx} d={d} stroke="#10b981" strokeWidth="0.75" opacity="0.6" fill="none" />
                    ))}
                    <polygon points={terrainVisuals.polygonPoints} fill="#10b981" fillOpacity="0.15" />
                    <circle cx={terrainVisuals.peakX} cy={terrainVisuals.peakY} r="3" fill="#06b6d4" stroke="#ffffff" strokeWidth="0.75" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Water Ice & Volatiles */}
          {(activeSubTab === 'all' || activeSubTab === 'ice') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-blue-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-blue-400 flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> 2. WATER ICE & VOLATILE PROSPECTING
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  Data: LEND / M3 / Mini-RF
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Ice Confidence</div>
                  <div className="text-base font-bold text-blue-400">{waterIce.ice_probability_pct}%</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Hydrogen Content</div>
                  <div className="text-base font-bold text-cyan-400">{waterIce.hydrogen_content_ppm} ppm</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Radar CPR</div>
                  <div className="text-base font-bold text-blue-400">{waterIce.radar_cpr}</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Distance to PSR</div>
                  <div className="text-base font-bold text-purple-400">{waterIce.distance_to_psr_m} m</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Hydration Classification:</span>
                <span className="text-cyan-300 font-bold">{iceVisuals.hydrationGrade}</span>
              </div>
            </div>
          )}

          {/* Section 4: Solar Illumination */}
          {(activeSubTab === 'all' || activeSubTab === 'solar') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-amber-400 flex items-center gap-2">
                  <Sun className="w-4 h-4" /> 3. SOLAR POWER & ILLUMINATION ARCHITECTURE
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  Data: LROC WAC 12-Month Sun Simulation
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Annual Sunlight</div>
                  <div className="text-base font-bold text-amber-400">{solar.annual_sunlight_pct}%</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Max Light Period</div>
                  <div className="text-base font-bold text-amber-400">{solar.max_continuous_light_days} days</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Max Dark Period</div>
                  <div className="text-base font-bold text-rose-400">{solar.max_continuous_dark_days} days</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Solar Elevation</div>
                  <div className="text-base font-bold text-cyan-400">{solar.avg_solar_elevation_deg}°</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Radiation & Thermal Environment */}
          {(activeSubTab === 'all' || activeSubTab === 'radiation') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-purple-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-purple-400 flex items-center gap-2">
                  <Radiation className="w-4 h-4" /> 4. RADIATION & THERMAL ENVIRONMENT
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  Data: LRO CRaTER / Diviner IR
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Annual GCR Dose</div>
                  <div className="text-base font-bold text-purple-400">{radiation.gcr_dose_msv_yr} mSv/yr</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Hourly Flux</div>
                  <div className="text-base font-bold text-rose-400">{radiation.dose_rate_usv_h} µSv/h</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Min Surface Temp</div>
                  <div className="text-base font-bold text-cyan-400">{temps.temp_min_k} K</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Max Surface Temp</div>
                  <div className="text-base font-bold text-amber-400">{temps.temp_max_k} K</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: AI/ML Matrix & Directives */}
          {(activeSubTab === 'all' || activeSubTab === 'ml') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-indigo-500/40 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> 5. AI MULTI-CRITERIA DECISION ANALYSIS & ENGINEERING DIRECTIVES
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold">
                  AI Confidence: {site.aiConfidence}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">Key Site Advantages & Trade-Offs</div>
                  <div className="space-y-1.5">
                    {(site.whyThisSite || [
                      { text: 'Optimal local landing corridor and low slope terrain', type: 'positive' },
                      { text: 'Direct adjacent access to permanent light and volatile traps', type: 'positive' },
                      { text: 'Precision touchdown navigation required for rock/hazard avoidance', type: 'warning' }
                    ]).map((item, idx) => {
                      const isPositive = typeof item === 'string' 
                        ? !item.toLowerCase().includes('warning') && !item.toLowerCase().includes('hazard')
                        : item.type === 'positive';
                      const text = typeof item === 'string' ? item : item.text || JSON.stringify(item);
                      return (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80">
                          {isPositive ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <span>{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">Habitat Deployment Recommendations</div>
                  <div className="space-y-1.5">
                    {(site.missionRecommendations || [
                      'Deploy 100kW photovoltaic array along crest peak',
                      'Establish primary pressurized habitat modules in micro-depression zone',
                      'Deploy autonomous rover into local PSR for water ice mining'
                    ]).map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          {idx + 1}
                        </span>
                        <span>{typeof rec === 'string' ? rec : rec.text || rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#0B1120] border-t border-slate-800 flex items-center justify-between font-mono">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>NASA LOLA SLDEM2015 + LROC NAC + PDS Geosciences Multi-Mission Archive</span>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-cyan cursor-pointer"
          >
            Close Telemetry Page
          </button>
        </div>

      </div>

      {/* Lightbox Zoom Modal for High-Resolution Archival Imagery */}
      {activeLightboxImg && (
        <div 
          onClick={() => setActiveLightboxImg(null)}
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <div className="max-w-4xl w-full bg-[#0B1120] border border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-3.5 bg-[#070B14] border-b border-slate-800 flex items-center justify-between font-mono">
              <div className="flex items-center gap-2 text-xs">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white truncate">{activeLightboxImg.title || 'Archival Reconnaissance Image'}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxImg(null);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden relative bg-black flex items-center justify-center p-2 min-h-[300px]">
              <img 
                src={activeLightboxImg.image_url} 
                alt={activeLightboxImg.title || 'Archival Reconnaissance'}
                className="max-h-[68vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="p-3 bg-[#0B1120] border-t border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>{activeLightboxImg.features_shown || 'NASA High-Resolution Surface Photographic Record'}</span>
              <span className="text-cyan-400 text-[10px] font-bold">NASA PDS RAW ARCHIVE</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LocationDeepDiveModal;
