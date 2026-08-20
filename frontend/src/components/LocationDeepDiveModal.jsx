import React, { useState } from 'react';
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
  Crosshair
} from 'lucide-react';
import scientificDataset from '../data/lunar_scientific_dataset.json';
import { soundManager } from '../utils/audio';

export const LocationDeepDiveModal = ({
  isOpen = false,
  onClose = () => {},
  site = null
}) => {
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !site) return null;

  // Find exact enriched record from lunar_scientific_dataset.json
  const enriched = scientificDataset.find(
    (d) => d.id === site.id || d.code?.toLowerCase() === site.code?.toLowerCase() || site.name?.toLowerCase().includes(d.code?.toLowerCase())
  ) || null;

  // Fallback structures if enriched is partially missing
  const terrain = enriched?.terrain_dem || {
    elevation_m: site.elevationMeters || 0,
    slope_deg: site.slopeDegrees || 0,
    roughness_rms_m: 0.85,
    crater_diameter_km: 25.0,
    rim_depth_m: 3500,
    landing_corridor_rating: 'Standard Highland Corridor',
    accessibility_index_100: site.factors?.accessibility || 80
  };

  const waterIce = enriched?.water_ice || {
    ice_probability_pct: (site.waterIcePurityPercent || 15) * 4.5,
    hydrogen_content_ppm: Math.round((site.waterIcePurityPercent || 15) * 80),
    radar_cpr: 0.72,
    spectroscopy_band_3um_depth: 0.075,
    distance_to_psr_m: site.distanceToPsrMeters || 400,
    estimated_ice_depth_m: 1.2,
    psr_name: `${site.shortName || site.code} Shadow Basin`
  };

  const solar = enriched?.solar_illumination || {
    annual_sunlight_pct: site.illuminationPercent || 85,
    max_continuous_light_days: Math.round((site.illuminationPercent || 85) * 1.6),
    max_continuous_dark_days: Math.max(3.5, Math.round((100 - (site.illuminationPercent || 85)) * 0.4)),
    avg_solar_elevation_deg: 1.45,
    seasonal_variance_pct: 6.5
  };

  const radiation = enriched?.radiation_environment || {
    gcr_dose_msv_yr: site.radiationLevelMsvPerYear || 300,
    spe_hazard_tier: 'Moderate (Solar Polar Exposure)',
    dose_rate_usv_h: Number(((site.radiationLevelMsvPerYear || 300) / 8760 * 1000).toFixed(1)),
    solar_cycle_phase: 'Cycle 25 Maximum Modulation',
    terrain_shielding_factor_pct: site.factors?.radiationSafety || 80
  };

  const comms = enriched?.geographic_communications || {
    geological_unit: 'Anorthositic Impact Melt Breccia & Regolith',
    crater_boundary: `${site.shortName || site.code} Geological Margin`,
    earth_direct_los_pct: site.earthLineOfSightPercent || 95,
    relay_satellite_required: (site.earthLineOfSightPercent || 95) < 90,
    near_or_far_side: (site.latitude || 0) < -80 ? 'South Polar Region' : 'Near Side'
  };

  const mlMatrix = enriched?.ai_ml_matrix || {
    ground_truth_label: `${site.tier || 'SUITABLE'} Habitation Candidate`,
    mission_ground_truth_reference: 'NASA LRO LOLA / Diviner / Chandrayaan M3',
    mcda_suitability_score: site.suitabilityScore || 85,
    ai_confidence_pct: site.aiConfidence || 90,
    suitability_tier: site.tier || 'SUITABLE'
  };

  const temps = enriched?.environmental_temperatures || {
    temp_min_k: site.tempMinKelvin || 150,
    temp_max_k: site.tempMaxKelvin || 220,
    diurnal_temperature_swing_k: (site.tempMaxKelvin || 220) - (site.tempMinKelvin || 150)
  };

  const handlePrint = () => {
    soundManager.playSelect();
    window.print();
  };

  const handleExportJson = () => {
    soundManager.playSelect();
    const exportData = {
      export_timestamp_utc: new Date().toISOString(),
      site_id: site.id,
      name: site.name,
      coordinates: { latitude: site.latitude, longitude: site.longitude },
      scientific_metrics: {
        terrain_dem: terrain,
        water_ice: waterIce,
        solar_illumination: solar,
        radiation_environment: radiation,
        geographic_communications: comms,
        environmental_temperatures: temps,
        ai_ml_decision_matrix: mlMatrix
      },
      why_this_site: site.whyThisSite,
      mission_recommendations: site.missionRecommendations
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lunar_Scientific_Telemetry_${(site.code || 'Site').replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              activeSubTab === 'all' ? 'bg-cyan-600 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Parameters (Overview)
          </button>
          <button
            onClick={() => setActiveSubTab('terrain')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'terrain' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" /> Terrain & DEM
          </button>
          <button
            onClick={() => setActiveSubTab('ice')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'ice' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-blue-400'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" /> Water Ice
          </button>
          <button
            onClick={() => setActiveSubTab('solar')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'solar' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Solar Power
          </button>
          <button
            onClick={() => setActiveSubTab('radiation')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'radiation' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-purple-400'
            }`}
          >
            <Radiation className="w-3.5 h-3.5" /> Radiation
          </button>
          <button
            onClick={() => setActiveSubTab('comms')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'comms' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-sky-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Earth Comms
          </button>
          <button
            onClick={() => setActiveSubTab('ml')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'ml' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-indigo-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> AI/ML Matrix
          </button>
          <button
            onClick={() => setActiveSubTab('tactical')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'tactical' 
                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold shadow-glow-cyan' 
                : 'text-emerald-400 hover:text-white bg-emerald-950/40 border border-emerald-500/40'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> 🗺️ Tactical Science Maps (GIS)
          </button>
        </div>

        {/* Modal Body (Scrollable Report View) */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 font-sans text-xs">
          
          {/* Dual Surface & Orbital Satellite Reconnaissance Imagery Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Surface In-Situ Imagery */}
            <div className="relative h-52 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-xl flex flex-col justify-between p-3">
              <img 
                src={site.surfaceImageUrl || site.thumbnail} 
                alt={`${site.name} Surface`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/40" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-700 text-[10px] font-mono text-cyan-300">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Surface Photographic View</span>
                </span>
                <span className="bg-purple-950/80 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded backdrop-blur-md text-[9px] font-mono font-bold">
                  {site.tier}
                </span>
              </div>

              <div className="relative z-10 space-y-0.5">
                <div className="text-sm font-bold font-mono text-white tracking-tight">
                  {site.code} Surface In-Situ Profile
                </div>
                <div className="text-[10px] font-mono text-slate-300 truncate">
                  Attribution: <span className="text-cyan-300 font-semibold">{site.imageAttribution || 'NASA / PDS Ground Truth'}</span>
                </div>
              </div>
            </div>

            {/* 2. Orbital Satellite Reconnaissance Imagery */}
            <div className="relative h-52 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-xl flex flex-col justify-between p-3">
              <img 
                src={site.orbitalImageUrl || site.thumbnail} 
                alt={`${site.name} Orbital Satellite`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/40" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-700 text-[10px] font-mono text-indigo-300">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Orbital Satellite Reconnaissance (LRO / WMS)</span>
                </span>
                <span className="bg-black/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded backdrop-blur-md text-[9px] font-mono font-bold">
                  {site.suitabilityScore} / 100
                </span>
              </div>

              <div className="relative z-10 space-y-0.5">
                <div className="text-sm font-bold font-mono text-white tracking-tight">
                  {site.code} Orbital Altimetry & Texture Map
                </div>
                <div className="text-[10px] font-mono text-slate-300 truncate">
                  Satellite Credit: <span className="text-indigo-300 font-semibold">{site.imageAttribution || 'NASA / GSFC / ASU (LROC)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Lunar Terrain / DEM */}
          {(activeSubTab === 'all' || activeSubTab === 'terrain') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                  <Mountain className="w-4 h-4" /> 1. LUNAR TERRAIN & DIGITAL ELEVATION MODEL (DEM)
                </h3>
                <span className="text-[10px] font-mono text-slate-400">LOLA SLDEM2015 118m Ground Truth</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Elevation (Datum)</span>
                  <div className="text-sm font-bold text-white">{terrain.elevation_m > 0 ? `+${terrain.elevation_m}` : terrain.elevation_m} meters</div>
                  <span className="text-[9px] text-slate-500">LOLA Laser Altimetry</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Slope Gradient</span>
                  <div className="text-sm font-bold text-emerald-300">{terrain.slope_deg}°</div>
                  <span className="text-[9px] text-slate-500">Calculated Altimetry Relief</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Surface Roughness (RMS)</span>
                  <div className="text-sm font-bold text-cyan-300">{terrain.roughness_rms_m} m</div>
                  <span className="text-[9px] text-slate-500">Hurst Micro-topography</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Crater Diameter</span>
                  <div className="text-sm font-bold text-amber-300">{terrain.crater_diameter_km} km</div>
                  <span className="text-[9px] text-slate-500">Rim Depth: {terrain.rim_depth_m}m</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span>Landing Corridor Classification: <strong className="text-cyan-300">{terrain.landing_corridor_rating}</strong></span>
                <span>Traversability Index: <strong className="text-emerald-400">{terrain.accessibility_index_100} / 100</strong></span>
              </div>
            </div>
          )}

          {/* Section 2: Water Ice Data */}
          {(activeSubTab === 'all' || activeSubTab === 'ice') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-blue-400 flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> 2. WATER ICE & VOLATILE CONCENTRATION
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Mini-RF Radar & M3 Spectroscopy</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Ice Concentration</span>
                  <div className="text-sm font-bold text-blue-300">{waterIce.ice_probability_pct}%</div>
                  <span className="text-[9px] text-slate-500">Purity Rating: {site.waterIcePurityPercent}%</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Hydrogen Content</span>
                  <div className="text-sm font-bold text-cyan-300">{waterIce.hydrogen_content_ppm} ppm</div>
                  <span className="text-[9px] text-slate-500">Neutron Spectrometer</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Radar CPR Index</span>
                  <div className="text-sm font-bold text-white">{waterIce.radar_cpr} CPR</div>
                  <span className="text-[9px] text-slate-500">Volatiles & Ice Coherence</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Distance to PSR Basin</span>
                  <div className="text-sm font-bold text-emerald-300">{waterIce.distance_to_psr_m} m</div>
                  <span className="text-[9px] text-slate-500">Est. Ice Depth: {waterIce.estimated_ice_depth_m}m</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span>Associated Cold Trap: <strong className="text-blue-300">{waterIce.psr_name}</strong></span>
                <span>3.0µm Band Depth: <strong className="text-cyan-300">{waterIce.spectroscopy_band_3um_depth}</strong></span>
              </div>
            </div>
          )}

          {/* Section 3: Solar Illumination */}
          {(activeSubTab === 'all' || activeSubTab === 'solar') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-amber-400 flex items-center gap-2">
                  <Sun className="w-4 h-4" /> 3. SOLAR ILLUMINATION & POWER AVAILABILITY
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Peak of Eternal Light Horizon Models</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Annual Sunlight</span>
                  <div className="text-sm font-bold text-amber-300">{solar.annual_sunlight_pct}%</div>
                  <span className="text-[9px] text-slate-500">Year-round coverage</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Max Continuous Light</span>
                  <div className="text-sm font-bold text-emerald-300">{solar.max_continuous_light_days} Days</div>
                  <span className="text-[9px] text-slate-500">Continuous PV Power</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Max Continuous Darkness</span>
                  <div className="text-sm font-bold text-rose-300">{solar.max_continuous_dark_days} Days</div>
                  <span className="text-[9px] text-slate-500">Battery Buffer Req</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Solar Elevation Angle</span>
                  <div className="text-sm font-bold text-cyan-300">{solar.avg_solar_elevation_deg}°</div>
                  <span className="text-[9px] text-slate-500">Seasonal Var: {solar.seasonal_variance_pct}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Radiation & Thermal Profile */}
          {(activeSubTab === 'all' || activeSubTab === 'radiation') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-purple-400 flex items-center gap-2">
                  <Radiation className="w-4 h-4" /> 4. IONIZING RADIATION & THERMAL ENVIRONMENT
                </h3>
                <span className="text-[10px] font-mono text-slate-400">NASA LRO CRaTER & Diviner Radiometer</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">GCR Annual Dose</span>
                  <div className="text-sm font-bold text-purple-300">{radiation.gcr_dose_msv_yr} mSv/yr</div>
                  <span className="text-[9px] text-slate-500">Dose Rate: {radiation.dose_rate_usv_h} µSv/h</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Terrain Shielding</span>
                  <div className="text-sm font-bold text-emerald-300">{radiation.terrain_shielding_factor_pct}%</div>
                  <span className="text-[9px] text-slate-500">{radiation.spe_hazard_tier}</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Surface Temp (Min/Max)</span>
                  <div className="text-sm font-bold text-orange-300">{temps.temp_min_k}K - {temps.temp_max_k}K</div>
                  <span className="text-[9px] text-slate-500">Diviner Thermal Channels</span>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Diurnal Thermal Swing</span>
                  <div className="text-sm font-bold text-white">Δ {temps.diurnal_temperature_swing_k} K</div>
                  <span className="text-[9px] text-slate-500">Solar Cycle: {radiation.solar_cycle_phase}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Geographic & Communications */}
          {(activeSubTab === 'all' || activeSubTab === 'comms') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-sky-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-sky-400 flex items-center gap-2">
                  <Radio className="w-4 h-4" /> 5. GEOLOGICAL FORMATION & DIRECT EARTH TELEMETRY
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Deep Space Network (DSN) Line of Sight</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Geological Formation</span>
                  <div className="text-xs font-bold text-white mt-0.5">{comms.geological_unit}</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Direct Earth Line-of-Sight</span>
                  <div className="text-sm font-bold text-emerald-300">{comms.earth_direct_los_pct}% Annual Window</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Orbital Relay Status</span>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">
                    {comms.relay_satellite_required ? 'Relay Satellite Required' : 'Direct Ka/X-Band Earth Link'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: AI/ML Decision Matrix & Recommendations */}
          {(activeSubTab === 'all' || activeSubTab === 'ml') && (
            <div className="p-4 rounded-2xl bg-[#0B1120]/90 border border-purple-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold font-mono text-purple-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> 6. AI MULTI-CRITERIA DECISION ANALYSIS & ENGINEERING DIRECTIVES
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  AI Confidence: {site.aiConfidence}%
                </span>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px] font-mono uppercase">In-Situ Ground Truth Benchmark Reference</div>
                <div className="text-xs font-bold font-mono text-cyan-300 mt-0.5">{mlMatrix.mission_ground_truth_reference}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-300">Key Site Advantages & Trade-Offs</div>
                  <div className="space-y-1.5">
                    {site.whyThisSite?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80">
                        {item.type === 'positive' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-300">Habitat Deployment Recommendations</div>
                  <div className="space-y-1.5">
                    {site.missionRecommendations?.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          {idx + 1}
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 7: TACTICAL SCIENCE MAPS (GIS) MISSION CONTROL matching Image 2 */}
          {activeSubTab === 'tactical' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Mission Control Top Telemetry Strip */}
              <div className="flex items-center justify-between p-3 bg-[#090D18] border border-cyan-500/40 rounded-xl font-mono text-xs shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    <Target className="w-3.5 h-3.5" />
                    <span>NASA / ESA PROJECT ARTEMIS MISSION CONTROL</span>
                  </span>
                  <span className="text-slate-300 font-semibold">
                    Target: <strong className="text-white">{site.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <strong className="text-emerald-400">LROC Data Active</strong>
                  </span>
                  <span>•</span>
                  <span>Grid Datum: LOLA SLDEM2015 118m</span>
                </div>
              </div>

              {/* 3-Column Tactical Instrument Grid matching Image 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                
                {/* LEFT COLUMN: Terrain Flatness & Water Ice Detection (3 cols) */}
                <div className="lg:col-span-3 space-y-3.5">
                  
                  {/* Card 1: TERRAIN EVALUATION & FLATNESS */}
                  <div className="p-3 bg-[#0B1120]/95 border border-slate-800 rounded-xl space-y-2.5 font-mono shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                        TERRAIN EVALUATION & FLATNESS
                      </span>
                    </div>

                    {/* 3D Slope Mesh Graphic */}
                    <div className="relative h-28 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                      <svg viewBox="0 0 160 90" className="w-full h-full">
                        <defs>
                          <linearGradient id="topoMeshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="35%" stopColor="#10b981" />
                            <stop offset="70%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                        {/* 3D Wireframe Landscape Iso-Grid */}
                        <path d="M 10 70 L 60 30 L 110 45 L 150 75 L 100 85 Z" fill="url(#topoMeshGrad)" opacity="0.85" />
                        <path d="M 10 70 L 60 30 M 35 75 L 85 35 M 60 80 L 110 40 M 100 85 L 150 45" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" fill="none" />
                        <path d="M 60 30 L 150 45 M 40 45 L 130 60 M 20 60 L 110 75" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" fill="none" />
                        <circle cx="85" cy="48" r="14" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,2" fill="#10b981" fillOpacity="0.2" />
                        <circle cx="85" cy="48" r="3" fill="#10b981" />
                      </svg>

                      <div className="absolute top-1.5 left-2 text-[9px] text-cyan-300 font-bold">
                        3D Slope Analysis
                      </div>
                      <div className="absolute bottom-1.5 left-2 text-[9px] text-emerald-400 bg-black/80 px-1.5 py-0.5 rounded border border-emerald-500/40 font-bold">
                        High Stability: 94%
                      </div>
                      {/* Hypsometric Bar */}
                      <div className="absolute top-2 right-2 bottom-2 w-2 rounded-full bg-gradient-to-t from-blue-600 via-emerald-500 via-yellow-400 to-red-500 flex flex-col justify-between py-0.5 text-[7px] text-white font-bold items-center">
                        <span>94%</span>
                        <span>44%</span>
                      </div>
                    </div>

                    {/* Dual Distribution Curves */}
                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                      {/* Surface Roughness */}
                      <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                        <div className="text-slate-400">Surface Roughness</div>
                        <svg viewBox="0 0 60 25" className="w-full h-6">
                          <path d="M 2 22 Q 10 5, 20 18 T 35 8 T 50 16 L 58 22" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
                          <path d="M 2 22 Q 10 5, 20 18 T 35 8 T 50 16 L 58 22 Z" fill="#06b6d4" fillOpacity="0.2" />
                        </svg>
                        <div className="text-slate-300">RMS: <strong className="text-white">{terrain.roughness_rms_m}m</strong></div>
                      </div>

                      {/* Slope Distribution */}
                      <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                        <div className="text-slate-400">Slope Distribution</div>
                        <svg viewBox="0 0 60 25" className="w-full h-6">
                          <path d="M 2 22 Q 15 2, 28 20 T 58 22" fill="none" stroke="#10b981" strokeWidth="1.5" />
                          <path d="M 2 22 Q 15 2, 28 20 T 58 22 Z" fill="#10b981" fillOpacity="0.2" />
                        </svg>
                        <div className="text-emerald-400">&lt;3° construction</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: WATER ICE DETECTION */}
                  <div className="p-3 bg-[#0B1120]/95 border border-slate-800 rounded-xl space-y-2.5 font-mono shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5" />
                        WATER ICE DETECTION
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Heatmap */}
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between p-1.5">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-cyan-500 via-amber-500 to-rose-600 opacity-80" />
                        <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/60 bg-blue-950/80 backdrop-blur-xs flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white drop-shadow">PSR Trap</span>
                        </div>
                        <span className="relative z-10 text-[8px] text-white font-bold bg-black/60 px-1 rounded">
                          {site.code} PSR
                        </span>
                      </div>

                      {/* PSR Monochrome Mask */}
                      <div className="relative h-24 rounded-lg overflow-hidden bg-black border border-slate-800 flex flex-col justify-between p-1.5">
                        <div className="absolute inset-3 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                          <span className="text-[8px] text-slate-400 text-center font-bold">Permanently Shadowed</span>
                        </div>
                        <span className="relative z-10 text-[8px] text-slate-300 font-bold bg-slate-900/90 px-1 rounded">
                          PSR Mask
                        </span>
                      </div>
                    </div>

                    {/* Scale bar */}
                    <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[9px] flex items-center justify-between">
                      <span className="text-slate-400">Ice Probability:</span>
                      <strong className="text-blue-300">{waterIce.ice_probability_pct}% ({waterIce.hydrogen_content_ppm} ppm)</strong>
                    </div>
                  </div>

                </div>

                {/* CENTER COLUMN: Tactical 3D Topographic Crater Map (6 cols) */}
                <div className="lg:col-span-6 space-y-2">
                  
                  {/* Tactical Map Header Controls */}
                  <div className="flex items-center justify-between p-2 bg-[#0B1120] border border-slate-800 rounded-xl font-mono text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <button className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-bold">&lt;</button>
                      <button className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-bold">&gt;</button>
                      <button className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1">
                        <Crosshair className="w-3 h-3" /> CENTER MAP
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-1 rounded bg-slate-800/80 text-slate-300">South Pole</span>
                      <span className="px-2 py-1 rounded bg-slate-800/80 text-slate-300">Topomap</span>
                      <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">Layers: 3 Active</span>
                    </div>
                  </div>

                  {/* High-Resolution Crater Contour Visualization matching Image 2 center */}
                  <div className="relative h-96 rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 group shadow-2xl">
                    <img 
                      src={site.orbitalImageUrl || site.surfaceImageUrl || site.thumbnail} 
                      alt={site.name}
                      className="absolute inset-0 w-full h-full object-cover filter contrast-125 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/30" />

                    {/* Vector Topographic Contour Overlays */}
                    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full pointer-events-none">
                      {/* Contour Rings */}
                      <ellipse cx="200" cy="150" rx="140" ry="75" fill="none" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="4,4" opacity="0.5" />
                      <ellipse cx="200" cy="150" rx="110" ry="58" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />
                      <ellipse cx="200" cy="150" rx="80" ry="42" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
                      <ellipse cx="200" cy="150" rx="55" ry="28" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" />
                      
                      {/* Radial Landing Boundary Nodes */}
                      <circle cx="155" cy="138" r="3" fill="#06b6d4" />
                      <circle cx="245" cy="142" r="3" fill="#06b6d4" />
                      <circle cx="180" cy="168" r="3" fill="#06b6d4" />
                      <circle cx="220" cy="162" r="3" fill="#06b6d4" />
                      <circle cx="200" cy="150" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                    </svg>

                    {/* Tactical Site Badge Callout Tag matching Image 2 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-16 pointer-events-none">
                      <div className="bg-[#050811]/95 border-2 border-emerald-400 text-white px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md flex flex-col items-center animate-bounce duration-1000">
                        <span className="text-xs font-mono font-black text-emerald-400 tracking-wider">
                          {site.code.toUpperCase()}-A
                        </span>
                        <span className="text-[10px] font-mono text-slate-200">
                          Optimal Location ({(site.suitabilityScore / 10).toFixed(1)}/10)
                        </span>
                      </div>
                    </div>

                    {/* Top-Right Layer Legend Chips */}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-slate-700 font-mono text-[9px] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-300">Terrain (LOLA Altimetry)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-slate-300">Ice (High Probability)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-slate-300">Sun (Continuous Peak)</span>
                      </div>
                    </div>

                    {/* Bottom-Right LROC Timestamp */}
                    <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-[9px] text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>NASA LRO Data Active • High-Res Orthomosaic</span>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Solar Illumination, Radiation, Shielding (3 cols) */}
                <div className="lg:col-span-3 space-y-3.5">
                  
                  {/* Card 1: SOLAR ILLUMINATION ANALYSIS */}
                  <div className="p-3 bg-[#0B1120]/95 border border-slate-800 rounded-xl space-y-2.5 font-mono shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5" />
                        SOLAR ILLUMINATION ANALYSIS
                      </span>
                    </div>

                    <div className="text-[9px] text-slate-400">Annual Sunlight Duration Profile</div>
                    {/* Solar Peak Curve SVG */}
                    <div className="h-20 bg-slate-950 rounded-lg p-1.5 border border-slate-800 flex items-center justify-center">
                      <svg viewBox="0 0 160 50" className="w-full h-full">
                        <defs>
                          <linearGradient id="sunCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M 5 45 Q 40 40, 60 15 Q 80 8, 100 15 Q 120 40, 155 45 L 155 48 L 5 48 Z" fill="url(#sunCurveGrad)" />
                        <path d="M 5 45 Q 40 40, 60 15 Q 80 8, 100 15 Q 120 40, 155 45" fill="none" stroke="#fbbf24" strokeWidth="2" />
                        <line x1="80" y1="5" x2="80" y2="48" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
                        <circle cx="80" cy="8" r="3" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                      </svg>
                    </div>

                    <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[9px] flex items-center justify-between">
                      <span>Peak Sun Coverage:</span>
                      <strong className="text-amber-300 font-bold">{solar.annual_sunlight_pct}% ({solar.max_continuous_light_days} Days Continuous)</strong>
                    </div>
                  </div>

                  {/* Card 2: RADIATION EXPOSURE ASSESSMENT */}
                  <div className="p-3 bg-[#0B1120]/95 border border-slate-800 rounded-xl space-y-2.5 font-mono shadow-md">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Radiation className="w-3.5 h-3.5" />
                        RADIATION EXPOSURE ASSESSMENT
                      </span>
                    </div>

                    {/* Radiation Risk Colormap */}
                    <div className="relative h-20 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-emerald-500 via-yellow-400 to-rose-600 opacity-80" />
                      <div className="absolute top-2 left-2 text-[8px] font-bold text-white bg-black/60 px-1 rounded">
                        GCR/SEP Colormap
                      </div>
                      <div className="absolute bottom-2 left-2 text-[9px] font-bold text-white bg-black/80 px-1.5 py-0.5 rounded border border-slate-600">
                        Dose: {(radiation.gcr_dose_msv_yr / 1000).toFixed(2)} mSv/yr (Low Risk)
                      </div>
                      <div className="absolute top-2 right-2 bottom-2 w-1.5 rounded-full bg-gradient-to-t from-blue-600 via-green-400 to-red-500" />
                    </div>

                    <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[9px] flex items-center justify-between">
                      <span className="text-slate-400">Hourly Flux Rate:</span>
                      <strong className="text-purple-300 font-bold">{radiation.dose_rate_usv_h} µSv/h</strong>
                    </div>
                  </div>

                  {/* Card 3: TERRAIN SHIELDING INDEX */}
                  <div className="p-3 bg-[#0B1120]/95 border border-slate-800 rounded-xl space-y-2 font-mono shadow-md">
                    <div className="text-[11px] font-bold text-slate-200 uppercase border-b border-slate-800 pb-1">
                      TERRAIN SHIELDING INDEX
                    </div>
                    <div className="space-y-1.5 text-[9px]">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Terrain Crest Shielding</span>
                          <strong className="text-emerald-400">{radiation.terrain_shielding_factor_pct}%</strong>
                        </div>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${radiation.terrain_shielding_factor_pct}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Earth Line-of-Sight</span>
                          <strong className="text-cyan-400">{comms.earth_direct_los_pct}%</strong>
                        </div>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${comms.earth_direct_los_pct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Matrix: RANKED OPTIMAL LUNAR HABITAT SITES TABLE matching Image 2 */}
              <div className="p-3.5 bg-[#0B1120]/95 border border-slate-800 rounded-xl space-y-2.5 font-mono shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    RANKED OPTIMAL LUNAR HABITAT SITES COMPARISON MATRIX
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">View Site</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Compare</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">MCDA Optimized</span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                        <th className="py-2 px-3">Rank</th>
                        <th className="py-2 px-3">Site Name</th>
                        <th className="py-2 px-3">MCDA Score</th>
                        <th className="py-2 px-3">Water Ice</th>
                        <th className="py-2 px-3">Solar Power</th>
                        <th className="py-2 px-3">Terrain Slope</th>
                        <th className="py-2 px-3">Tactical Status / Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      {/* Active Site Highlight Row matching Image 2 green bar */}
                      <tr className="bg-emerald-950/60 border border-emerald-500/50 text-white font-bold">
                        <td className="py-2 px-3 text-emerald-400">#1 (Selected)</td>
                        <td className="py-2 px-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>{site.name}</span>
                        </td>
                        <td className="py-2 px-3 text-emerald-300">{(site.suitabilityScore / 10).toFixed(1)} / 10</td>
                        <td className="py-2 px-3 text-cyan-300">High ({waterIce.ice_probability_pct}%)</td>
                        <td className="py-2 px-3 text-amber-300">Peak ({solar.annual_sunlight_pct}%)</td>
                        <td className="py-2 px-3 text-emerald-300">Flat ({terrain.slope_deg}°)</td>
                        <td className="py-2 px-3 text-slate-200 font-sans text-xs">Optimal Landing Corridor & Habitat Base</td>
                      </tr>

                      {/* Top Neighbor Sites */}
                      {scientificDataset.filter(d => d.id !== site.id).slice(0, 3).map((d, idx) => (
                        <tr key={d.id} className="hover:bg-slate-900/60 transition-colors text-slate-300">
                          <td className="py-2 px-3 text-slate-400">#{idx + 2}</td>
                          <td className="py-2 px-3">{d.name}</td>
                          <td className="py-2 px-3 text-cyan-400">{(d.ai_ml_matrix.mcda_suitability_score / 10).toFixed(1)} / 10</td>
                          <td className="py-2 px-3">{d.water_ice.ice_probability_pct}%</td>
                          <td className="py-2 px-3">{d.solar_illumination.annual_sunlight_pct}%</td>
                          <td className="py-2 px-3">{d.terrain_dem.slope_deg}°</td>
                          <td className="py-2 px-3 text-slate-400 font-sans text-xs">{d.ai_ml_matrix.ground_truth_label}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#0B1120] border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400">
            Dataset Source: NASA LOLA Global LDEM 118m + LROC WAC + Diviner + Chandrayaan Ground Truth
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-glow-cyan cursor-pointer"
          >
            Close Telemetry Page
          </button>
        </div>

      </div>
    </div>
  );
};
