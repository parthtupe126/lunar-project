import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Mountain, 
  TrendingUp, 
  Sun, 
  Droplets, 
  Radiation, 
  Rocket, 
  Layers, 
  Filter, 
  Sparkles, 
  Thermometer, 
  RotateCcw,
  Zap,
  ShieldCheck,
  Activity,
  Gauge,
  Cpu,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { soundManager } from '../utils/audio';

const PRESETS = [
  {
    name: 'Artemis Baseline',
    weights: { waterIce: 25, solarEnergy: 25, terrain: 20, radiation: 15, access: 15 },
    iconColor: 'text-cyan-400'
  },
  {
    name: 'ISRU Water Mining',
    weights: { waterIce: 45, solarEnergy: 20, terrain: 15, radiation: 10, access: 10 },
    iconColor: 'text-blue-400'
  },
  {
    name: 'Solar Power Station',
    weights: { waterIce: 15, solarEnergy: 50, terrain: 15, radiation: 10, access: 10 },
    iconColor: 'text-amber-400'
  },
  {
    name: 'Radiation Safe Base',
    weights: { waterIce: 20, solarEnergy: 20, terrain: 15, radiation: 35, access: 10 },
    iconColor: 'text-purple-400'
  }
];

const DEFAULT_WEIGHTS = {
  waterIce: 25,
  solarEnergy: 25,
  terrain: 20,
  radiation: 15,
  access: 15
};

const DEFAULT_LAYERS = {
  terrain: true,
  elevation: true,
  slope: true,
  waterIce: true,
  illumination: true,
  radiation: true,
  temperature: true,
  aiSuitability: true
};

const DEFAULT_FILTER = {
  minScore: 0,
  siteType: 'All',
  searchQuery: ''
};

const NOOP = () => {};

const LAYER_ITEMS = [
  { key: 'terrain', label: 'Terrain Relief', icon: <Mountain className="w-3.5 h-3.5 text-cyan-400" /> },
  { key: 'elevation', label: 'Elevation Contours', icon: <Layers className="w-3.5 h-3.5 text-blue-400" /> },
  { key: 'slope', label: 'Slope Hazards', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> },
  { key: 'waterIce', label: 'Water Ice Volatiles', icon: <Droplets className="w-3.5 h-3.5 text-cyan-300" /> },
  { key: 'illumination', label: 'Solar Illumination', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
  { key: 'radiation', label: 'Radiation Shielding', icon: <Radiation className="w-3.5 h-3.5 text-purple-400" /> },
  { key: 'temperature', label: 'Thermal Profile', icon: <Thermometer className="w-3.5 h-3.5 text-rose-400" /> },
];

function getPresetIcon(name) {
  switch (name) {
    case 'ISRU Water Mining': return <Droplets className="w-3 h-3 text-blue-400" />;
    case 'Solar Power Station': return <Sun className="w-3 h-3 text-amber-400" />;
    case 'Radiation Safe Base': return <ShieldCheck className="w-3 h-3 text-purple-400" />;
    default: return <Sparkles className="w-3 h-3 text-cyan-400" />;
  }
}

export const LayerControls = ({
  weights = DEFAULT_WEIGHTS,
  setWeights = NOOP,
  layers = DEFAULT_LAYERS,
  setLayers = NOOP,
  filter = DEFAULT_FILTER,
  setFilter = NOOP
}) => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Custom Coordinate & Factor Simulator state
  const [customCoord, setCustomCoord] = useState({
    lat: -89.28,
    lon: 15.40,
    slope_deg: 3.8,
    annual_illumination_pct: 92.0,
    ice_prob: 0.40,
    earth_vis_pct: 90.0,
    elevation_m: 1200.0,
    roughness_m: 0.6,
    max_temp_k: 220.0,
    min_temp_k: 180.0
  });

  const handleWeightChange = (key, value) => {
    soundManager.playClick();
    setWeights(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const toggleLayer = (layerKey) => {
    soundManager.playClick();
    setLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const applyPreset = (presetWeights) => {
    soundManager.playSelect();
    setWeights(presetWeights);
  };

  const resetWeights = () => {
    soundManager.playClick();
    setWeights({
      waterIce: 25,
      solarEnergy: 25,
      terrain: 20,
      radiation: 15,
      access: 15
    });
  };

  // Live calculation of overall Habitat Sustainability Index
  const liveSustainability = useMemo(() => {
    const total = (weights.terrain || 0) + (weights.solarEnergy || 0) + (weights.waterIce || 0) + (weights.radiation || 0) + (weights.access || 0);
    const normFactor = total > 0 ? (100 / total) : 1;
    
    const terrainEff = Math.min(100, (weights.terrain * normFactor) * 1.05 + 75);
    const solarEff = Math.min(100, (weights.solarEnergy * normFactor) * 1.08 + 72);
    const iceEff = Math.min(100, (weights.waterIce * normFactor) * 1.10 + 70);
    const radEff = Math.min(100, (weights.radiation * normFactor) * 0.95 + 78);
    const accessEff = Math.min(100, (weights.access * normFactor) * 1.02 + 74);

    const overallScore = Math.min(99.5, Math.max(20.0, (
      terrainEff * 0.20 +
      solarEff * 0.25 +
      iceEff * 0.25 +
      radEff * 0.15 +
      accessEff * 0.15
    )));

    // Derived engineering metrics
    const powerOutputKw = ((weights.solarEnergy || 25) * 1.25).toFixed(1);
    const waterYieldMt = ((weights.waterIce || 25) * 0.85).toFixed(1);
    const radiationMarginPct = Math.min(99, Math.round(75 + (weights.radiation || 15) * 0.7));
    const slopeStabilityRating = weights.terrain >= 20 ? 'Optimal Bedrock' : 'Standard Anchor';
    const commsLOS = Math.min(99.5, (88 + (weights.access || 15) * 0.5)).toFixed(1);

    let statusTier = 'MODERATE';
    let statusColor = 'text-amber-400 border-amber-500/30 bg-amber-950/60';
    if (overallScore >= 90) {
      statusTier = 'MAXIMUM SUSTAINABILITY';
      statusColor = 'text-emerald-300 border-emerald-500/40 bg-emerald-950/70 shadow-glow-emerald';
    } else if (overallScore >= 80) {
      statusTier = 'HIGH RESILIENCE';
      statusColor = 'text-cyan-300 border-cyan-500/40 bg-cyan-950/70 shadow-glow-cyan';
    }

    return {
      overallScore: overallScore.toFixed(1),
      statusTier,
      statusColor,
      powerOutputKw,
      waterYieldMt,
      radiationMarginPct,
      slopeStabilityRating,
      commsLOS
    };
  }, [weights]);

  // Live predicted score for custom simulator
  const liveCustomPrediction = useMemo(() => {
    const slope = Number(customCoord.slope_deg || 3.8);
    const sun = Number(customCoord.annual_illumination_pct || 92.0);
    const ice = Number(customCoord.ice_prob || 0.4);
    const vis = Number(customCoord.earth_vis_pct || 90.0);
    const rough = Number(customCoord.roughness_m || 0.6);
    const deltaT = Math.abs(Number(customCoord.max_temp_k || 220) - Number(customCoord.min_temp_k || 180));

    const score = Math.min(99.5, Math.max(10.0,
      (100.0 - slope * 2.5) * 0.20 +
      sun * 0.25 +
      (ice * 100.0) * 0.25 +
      (100.0 - deltaT * 0.2) * 0.15 +
      vis * 0.15 - (rough * 2.0)
    ));

    let riskClass = 'Moderate Suitability';
    let badgeClass = 'text-amber-400 bg-amber-950/60 border-amber-500/30';
    if (score >= 85.0) {
      riskClass = 'Very High Suitability';
      badgeClass = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    } else if (score >= 72.0) {
      riskClass = 'High Suitability';
      badgeClass = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
    }

    return {
      score: score.toFixed(1),
      riskClass,
      badgeClass,
      energyKw: (sun * 0.32).toFixed(1),
      waterMt: (ice * 24.5).toFixed(1),
      lifetimeYrs: score >= 80 ? '25+ Yrs' : '15 Yrs'
    };
  }, [customCoord]);

  return (
    <aside className="w-80 h-full bg-[#070B14]/95 border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto backdrop-blur-xl z-10 shrink-0 select-none custom-scrollbar animate-smooth-slide-left">
      <div className="space-y-4">
        
        {/* SECTION 1: AI MISSION WEIGHT SLIDERS */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                AI WEIGHT SLIDERS
              </h2>
            </div>
            <button
              type="button"
              onClick={resetWeights}
              title="Reset to Artemis Baseline"
              aria-label="Reset weights to Artemis Baseline"
              className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Mission Presets */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p.weights)}
                aria-label={`Apply ${p.name} preset`}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-[#0B1120] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-[10px] font-mono text-slate-300 transition-colors text-left cursor-pointer"
              >
                {getPresetIcon(p.name)}
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Sliders Container */}
          <div className="bg-[#0B1120]/80 p-3 rounded-xl border border-slate-800/80 space-y-3 shadow-inner">
            
            {/* 1. Slope / Terrain Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Slope (Terrain Flatness)</span>
                </span>
                <span className="font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                  {weights.terrain}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.terrain}
                aria-label="Slope terrain flatness weight percentage"
                onChange={(e) => handleWeightChange('terrain', e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
                <span>0% (Ignore Slope)</span>
                <span>60% (Max Flatness)</span>
              </div>
            </div>

            {/* 2. Sun / Solar Illumination Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sun (Solar Energy)</span>
                </span>
                <span className="font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30 text-[11px]">
                  {weights.solarEnergy}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.solarEnergy}
                aria-label="Solar energy illumination weight percentage"
                onChange={(e) => handleWeightChange('solarEnergy', e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
                <span>0% (Ignore Sun)</span>
                <span>60% (Continuous Light)</span>
              </div>
            </div>

            {/* 3. Ice / Water Ice Volatiles Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ice (Water Volatiles)</span>
                </span>
                <span className="font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 text-[11px]">
                  {weights.waterIce}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.waterIce}
                aria-label="Water ice volatiles weight percentage"
                onChange={(e) => handleWeightChange('waterIce', e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
                <span>0% (Ignore Ice)</span>
                <span>60% (ISRU Priority)</span>
              </div>
            </div>

            {/* 4. Radiation Shielding Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Radiation className="w-3.5 h-3.5 text-purple-400" />
                  <span>Radiation Shielding</span>
                </span>
                <span className="font-bold text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30 text-[11px]">
                  {weights.radiation}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.radiation}
                aria-label="Radiation shielding weight percentage"
                onChange={(e) => handleWeightChange('radiation', e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* 5. Landing Access Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 text-sky-300">
                  <Rocket className="w-3.5 h-3.5 text-sky-400" />
                  <span>Landing Accessibility</span>
                </span>
                <span className="font-bold text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-500/30 text-[11px]">
                  {weights.access}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.access}
                aria-label="Landing accessibility weight percentage"
                onChange={(e) => handleWeightChange('access', e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

          </div>
        </div>

        {/* SECTION 2: LIVE AI SUSTAINABILITY IMPACT MATRIX */}
        <div className="bg-[#0B1120] p-3 rounded-xl border border-cyan-500/30 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>LIVE SUSTAINABILITY EFFECT</span>
            </div>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold ${liveSustainability.statusColor}`}>
              {liveSustainability.overallScore}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
            <div className="bg-[#050811] p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" /> Power Output
              </span>
              <span className="text-amber-300 font-bold font-mono text-[11px] block mt-0.5">
                {liveSustainability.powerOutputKw} kW
              </span>
            </div>
            <div className="bg-[#050811] p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" /> Water Autonomy
              </span>
              <span className="text-cyan-300 font-bold font-mono text-[11px] block mt-0.5">
                {liveSustainability.waterYieldMt} MT/yr
              </span>
            </div>
            <div className="bg-[#050811] p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" /> Radiation Margin
              </span>
              <span className="text-purple-300 font-bold font-mono text-[11px] block mt-0.5">
                {liveSustainability.radiationMarginPct}% Safe
              </span>
            </div>
            <div className="bg-[#050811] p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1">
                <Rocket className="w-3 h-3 text-sky-400" /> Earth Line-of-Sight
              </span>
              <span className="text-sky-300 font-bold font-mono text-[11px] block mt-0.5">
                {liveSustainability.commsLOS}%
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: CUSTOM COORDINATE & FACTOR SIMULATOR */}
        <div className="bg-[#0B1120]/95 rounded-xl border border-purple-500/40 p-3 space-y-2.5 shadow-lg">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setIsSimulatorOpen(!isSimulatorOpen);
            }}
            className="w-full flex items-center justify-between text-xs font-mono font-bold text-purple-300 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>CUSTOM FACTOR SIMULATOR</span>
            </div>
            {isSimulatorOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Collapsible Custom Input Controls */}
          {isSimulatorOpen && (
            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-[10px] font-mono animate-smooth-fade-in">
              {/* Quick Coordinate Presets */}
              <div>
                <span className="text-[9px] text-slate-400 block mb-1 font-bold uppercase tracking-wider">
                  Quick Coordinate Presets:
                </span>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setCustomCoord({
                        lat: -69.37,
                        lon: 32.32,
                        slope_deg: 4.5,
                        annual_illumination_pct: 68,
                        ice_prob: 0.15,
                        radiation_shielding_pct: 75,
                        earth_los_pct: 85
                      });
                    }}
                    className="p-1 text-[9px] bg-slate-900 hover:bg-orange-950/60 text-slate-300 hover:text-orange-300 rounded border border-slate-800 transition-colors text-left truncate cursor-pointer"
                  >
                    🇮🇳 Shiv Shakti (-69.4°)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setCustomCoord({
                        lat: -89.50,
                        lon: 130.00,
                        slope_deg: 3.8,
                        annual_illumination_pct: 92,
                        ice_prob: 0.40,
                        radiation_shielding_pct: 82,
                        earth_los_pct: 90
                      });
                    }}
                    className="p-1 text-[9px] bg-slate-900 hover:bg-blue-950/60 text-slate-300 hover:text-cyan-300 rounded border border-slate-800 transition-colors text-left truncate cursor-pointer"
                  >
                    🇺🇸 Artemis III (-89.5°)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setCustomCoord({
                        lat: -86.04,
                        lon: -2.70,
                        slope_deg: 6.2,
                        annual_illumination_pct: 95,
                        ice_prob: 0.10,
                        radiation_shielding_pct: 88,
                        earth_los_pct: 98
                      });
                    }}
                    className="p-1 text-[9px] bg-slate-900 hover:bg-amber-950/60 text-slate-300 hover:text-amber-300 rounded border border-slate-800 transition-colors text-left truncate cursor-pointer"
                  >
                    🏔️ Malapert Peak (-86.0°)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setCustomCoord({
                        lat: 0.67,
                        lon: 23.47,
                        slope_deg: 1.2,
                        annual_illumination_pct: 50,
                        ice_prob: 0.00,
                        radiation_shielding_pct: 60,
                        earth_los_pct: 100
                      });
                    }}
                    className="p-1 text-[9px] bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 rounded border border-slate-800 transition-colors text-left truncate cursor-pointer"
                  >
                    🇺🇸 Apollo 11 (+0.7°)
                  </button>
                </div>
              </div>

              {/* Coordinate Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-0.5">Latitude (°)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customCoord.lat}
                    onChange={(e) => setCustomCoord(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-[#050811] border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5">Longitude (°)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customCoord.lon}
                    onChange={(e) => setCustomCoord(prev => ({ ...prev, lon: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-[#050811] border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* 1. Slope Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span className="text-emerald-400 font-bold">Terrain Slope:</span>
                  <span className="font-mono text-slate-200">{customCoord.slope_deg.toFixed(1)}° {customCoord.slope_deg > 12 ? '⚠️ High' : '✓ Safe'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.1"
                  value={customCoord.slope_deg}
                  onChange={(e) => setCustomCoord(prev => ({ ...prev, slope_deg: parseFloat(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* 2. Illumination Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span className="text-amber-400 font-bold">Annual Sunlight:</span>
                  <span className="font-mono text-slate-200">{customCoord.annual_illumination_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={customCoord.annual_illumination_pct}
                  onChange={(e) => setCustomCoord(prev => ({ ...prev, annual_illumination_pct: parseFloat(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded accent-amber-400 cursor-pointer"
                />
              </div>

              {/* 3. Water Ice Probability Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span className="text-cyan-400 font-bold">Water Ice Volatiles:</span>
                  <span className="font-mono text-slate-200">{(customCoord.ice_prob * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={customCoord.ice_prob}
                  onChange={(e) => setCustomCoord(prev => ({ ...prev, ice_prob: parseFloat(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Real-Time Live Result Box */}
              <div className="p-2.5 bg-[#050811] rounded-lg border border-purple-500/50 space-y-2 shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold">PREDICTED SUITABILITY</div>
                    <div className="text-base font-bold text-white flex items-center gap-1.5">
                      <span className="text-purple-300 font-mono">{liveCustomPrediction.score} / 100</span>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded border font-bold ${liveCustomPrediction.badgeClass}`}>
                    {liveCustomPrediction.riskClass}
                  </span>
                </div>

                {/* Derived Engineering Metrics */}
                <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-slate-800 text-[9px] text-slate-300">
                  <div>⚡ Power: <span className="font-bold text-amber-300">{((customCoord.annual_illumination_pct / 100) * 32.0).toFixed(1)} kW</span></div>
                  <div>🧊 Water: <span className="font-bold text-cyan-300">{(customCoord.ice_prob * 24.5).toFixed(1)} MT/yr</span></div>
                  <div>🛡️ Radiation: <span className="font-bold text-purple-300">{(100 - (customCoord.slope_deg * 1.5)).toFixed(0)}% Safe</span></div>
                  <div>🛰️ Comms LOS: <span className="font-bold text-sky-300">{customCoord.lat < -80 ? '90.0%' : '100.0%'}</span></div>
                </div>

                {/* Action: Fly to Simulated Node */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playSelect();
                    if (onFlyToCustomCoord) {
                      onFlyToCustomCoord({
                        id: `sim_${Date.now()}`,
                        code: 'SIM-NODE',
                        name: `Simulated Coordinate (${customCoord.lat > 0 ? '+' : ''}${customCoord.lat.toFixed(2)}°, ${customCoord.lon > 0 ? '+' : ''}${customCoord.lon.toFixed(2)}°)`,
                        shortName: `SIM (${customCoord.lat.toFixed(1)}°, ${customCoord.lon.toFixed(1)}°)`,
                        tier: liveCustomPrediction.riskClass,
                        latitude: customCoord.lat,
                        longitude: customCoord.lon,
                        elevationMeters: 1200,
                        suitabilityScore: parseFloat(liveCustomPrediction.score),
                        aiConfidence: 96,
                        slopeDegrees: customCoord.slope_deg,
                        illuminationPercentage: customCoord.annual_illumination_pct,
                        waterIceIndicator: customCoord.ice_prob > 0.3 ? 'High' : (customCoord.ice_prob > 0.1 ? 'Moderate' : 'Low'),
                        siteType: customCoord.slope_deg > 8 ? 'Crater Rim' : 'Polar Plateau'
                      });
                    }
                  }}
                  className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-glow-purple cursor-pointer transition-all active:scale-95"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Project & Fly on 3D Globe</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CRITERIA FILTER */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              CRITERIA FILTER
            </h2>
          </div>

          <div className="bg-[#0B1120]/80 p-3 rounded-xl border border-slate-800/80 space-y-2.5 shadow-inner">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <label htmlFor="min-score-threshold" className="text-slate-400 cursor-pointer">
                  Min Suitability Threshold
                </label>
                <span className="font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 text-[11px]">
                  {filter.minScore}
                </span>
              </div>
              <input
                id="min-score-threshold"
                type="range"
                min="0"
                max="95"
                value={filter.minScore}
                aria-label="Minimum Suitability Threshold Slider"
                onChange={(e) => setFilter(prev => ({ ...prev, minScore: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="geo-feature-type-select" className="block text-[11px] font-mono text-slate-400 mb-1">
                Geological Feature Type
              </label>
              <select
                id="geo-feature-type-select"
                value={filter.siteType}
                aria-label="Geological Feature Type Selection"
                onChange={(e) => {
                  soundManager.playClick();
                  setFilter(prev => ({ ...prev, siteType: e.target.value }));
                }}
                className="w-full bg-[#070B14] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Site Formations</option>
                <option value="Crater Rim">Crater Rim</option>
                <option value="Polar Plateau">Polar Plateau</option>
                <option value="PSR Basin">Permanently Shadowed (PSR)</option>
                <option value="Lava Tube">Lava Tube Skylight</option>
                <option value="Mare Plain">Mare Plain (Basalt)</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER INFO CARD */}
      <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-b from-[#0F172A]/90 to-[#070B14]/90 border border-slate-700/60 shadow-lg text-[9px] font-mono text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1 text-cyan-400 font-bold">
          <Zap className="w-3 h-3" /> REAL-TIME LUNA-DSS
        </span>
        <span className="text-slate-500">v1.0 Active</span>
      </div>
    </aside>
  );
};
