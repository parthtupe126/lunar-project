import React, { useState } from 'react';
import { LunarSite } from '../../types/lunar';
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
  Check
} from 'lucide-react';
import scientificDataset from '../../data/lunar_scientific_dataset.json';
import { soundManager } from '../../utils/audio';

interface LocationDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: LunarSite | null;
}

export const LocationDeepDiveModal: React.FC<LocationDeepDiveModalProps> = ({
  isOpen,
  onClose,
  site
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'terrain' | 'ice' | 'solar' | 'radiation' | 'comms' | 'ml'>('all');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !site) return null;

  // Find exact enriched record from lunar_scientific_dataset.json
  const enriched = scientificDataset.find(
    (d: any) => d.id === site.id || d.code.toLowerCase() === site.code.toLowerCase() || site.name.toLowerCase().includes(d.code.toLowerCase())
  ) || null;

  // Fallback structures if enriched is partially missing
  const terrain = enriched?.terrain_dem || {
    elevation_m: site.elevationMeters,
    slope_deg: site.slopeDegrees,
    roughness_rms_m: 0.85,
    crater_diameter_km: 25.0,
    rim_depth_m: 3500,
    landing_corridor_rating: 'Standard Highland Corridor',
    accessibility_index_100: site.factors.accessibility
  };

  const waterIce = enriched?.water_ice || {
    ice_probability_pct: site.waterIcePurityPercent * 4.5,
    hydrogen_content_ppm: Math.round(site.waterIcePurityPercent * 80),
    radar_cpr: 0.72,
    spectroscopy_band_3um_depth: 0.075,
    distance_to_psr_m: site.distanceToPsrMeters,
    estimated_ice_depth_m: 1.2,
    psr_name: `${site.shortName} Shadow Basin`
  };

  const solar = enriched?.solar_illumination || {
    annual_sunlight_pct: site.illuminationPercent,
    max_continuous_light_days: Math.round(site.illuminationPercent * 1.6),
    max_continuous_dark_days: Math.max(3.5, Math.round((100 - site.illuminationPercent) * 0.4)),
    avg_solar_elevation_deg: 1.45,
    seasonal_variance_pct: 6.5
  };

  const radiation = enriched?.radiation_environment || {
    gcr_dose_msv_yr: site.radiationLevelMsvPerYear,
    spe_hazard_tier: 'Moderate (Solar Polar Exposure)',
    dose_rate_usv_h: Number((site.radiationLevelMsvPerYear / 8760 * 1000).toFixed(1)),
    solar_cycle_phase: 'Cycle 25 Maximum Modulation',
    terrain_shielding_factor_pct: site.factors.radiationSafety
  };

  const comms = enriched?.geographic_communications || {
    geological_unit: 'Anorthositic Impact Melt Breccia & Regolith',
    crater_boundary: `${site.shortName} Geological Margin`,
    earth_direct_los_pct: site.earthLineOfSightPercent,
    relay_satellite_required: site.earthLineOfSightPercent < 90,
    near_or_far_side: site.latitude < -80 ? 'South Polar Region' : 'Near Side'
  };

  const mlMatrix = enriched?.ai_ml_matrix || {
    ground_truth_label: `${site.tier} Habitation Candidate`,
    mission_ground_truth_reference: 'NASA LRO LOLA / Diviner / Chandrayaan M3',
    mcda_suitability_score: site.suitabilityScore,
    ai_confidence_pct: site.aiConfidence,
    suitability_tier: site.tier
  };

  const temps = enriched?.environmental_temperatures || {
    temp_min_k: site.tempMinKelvin,
    temp_max_k: site.tempMaxKelvin,
    diurnal_temperature_swing_k: site.tempMaxKelvin - site.tempMinKelvin
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
    a.download = `Lunar_Scientific_Telemetry_${site.code.replace(/\s+/g, '_')}.json`;
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
                  Lat: {site.latitude.toFixed(3)}° • Lon: {site.longitude.toFixed(3)}°
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs transition-colors"
              title="Export Raw JSON Data"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copied ? 'Exported JSON' : 'Export JSON'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Print Telemetry Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-6 py-2 bg-[#050811] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              activeSubTab === 'all' ? 'bg-cyan-600 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Parameters (Overview)
          </button>
          <button
            onClick={() => setActiveSubTab('terrain')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'terrain' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" /> Terrain & DEM
          </button>
          <button
            onClick={() => setActiveSubTab('ice')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'ice' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-blue-400'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" /> Water Ice
          </button>
          <button
            onClick={() => setActiveSubTab('solar')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'solar' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Solar Power
          </button>
          <button
            onClick={() => setActiveSubTab('radiation')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'radiation' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-purple-400'
            }`}
          >
            <Radiation className="w-3.5 h-3.5" /> Radiation
          </button>
          <button
            onClick={() => setActiveSubTab('comms')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'comms' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-sky-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Earth Comms
          </button>
          <button
            onClick={() => setActiveSubTab('ml')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'ml' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-indigo-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> AI/ML Matrix
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
                    {site.whyThisSite.map((item, idx) => (
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
                    {site.missionRecommendations.map((rec, idx) => (
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
            className="px-5 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-glow-cyan"
          >
            Close Telemetry Page
          </button>
        </div>

      </div>
    </div>
  );
};
