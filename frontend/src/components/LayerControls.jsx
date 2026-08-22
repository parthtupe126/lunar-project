import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Sun, 
  Droplets, 
  Mountain, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  RotateCcw, 
  Sparkles, 
  Activity, 
  Filter, 
  Thermometer, 
  Radio, 
  Radiation, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  Rocket, 
  Crosshair,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { soundManager } from '../utils/audio';

const MISSION_PRESETS = [
  {
    name: 'ISRU Water Mining',
    desc: 'Maximizes polar permanently shadowed volatile ice extraction',
    weights: { waterIce: 45, solarEnergy: 20, terrain: 15, radiation: 10, access: 10 }
  },
  {
    name: 'Solar Power Station',
    desc: 'Maximizes continuous peak-of-eternal-light solar illumination',
    weights: { waterIce: 15, solarEnergy: 45, terrain: 20, radiation: 10, access: 10 }
  },
  {
    name: 'Radiation Safe Base',
    desc: 'Maximizes terrain and regolith shielding against galactic cosmic rays',
    weights: { waterIce: 15, solarEnergy: 15, terrain: 25, radiation: 35, access: 10 }
  },
  {
    name: 'Balanced Exploration',
    desc: 'Optimized NASA Artemis multi-objective habitat baseline',
    weights: { waterIce: 25, solarEnergy: 25, terrain: 20, radiation: 15, access: 15 }
  }
];

function getPresetIcon(name) {
  switch (name) {
    case 'ISRU Water Mining': return <Droplets className="w-3 h-3 text-blue-400" />;
    case 'Solar Power Station': return <Sun className="w-3 h-3 text-amber-400" />;
    case 'Radiation Safe Base': return <ShieldCheck className="w-3 h-3 text-purple-400" />;
    default: return <Sparkles className="w-3 h-3 text-cyan-400" />;
  }
}

const DEFAULT_WEIGHTS = {
  waterIce: 25,
  solarEnergy: 25,
  terrain: 20,
  radiation: 15,
  access: 15
};

const DEFAULT_FILTER = {
  minScore: 0,
  siteType: 'All',
  searchQuery: ''
};

export const LayerControls = ({
  weights = DEFAULT_WEIGHTS,
  setWeights = () => {},
  layers = {},
  setLayers = () => {},
  filter = DEFAULT_FILTER,
  setFilter = () => {},
  onFlyToCustomCoord = () => {}
}) => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Custom Coordinate & Factor Simulator state with safe defaults
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
      [key]: Number(value) || 0
    }));
  };

  const applyPreset = (presetWeights) => {
    soundManager.playSelect();
    setWeights(presetWeights);
  };

  const resetWeights = () => {
    soundManager.playClick();
    setWeights(DEFAULT_WEIGHTS);
  };

  // Live calculation of overall Habitat Sustainability Index
  const liveSustainability = useMemo(() => {
    const total = (weights.terrain || 0) + (weights.solarEnergy || 0) + (weights.waterIce || 0) + (weights.radiation || 0) + (weights.access || 0);
    const normFactor = total > 0 ? (100 / total) : 1;
    
    const terrainEff = Math.min(100, ((weights.terrain || 0) * normFactor) * 1.05 + 75);
    const solarEff = Math.min(100, ((weights.solarEnergy || 0) * normFactor) * 1.08 + 72);
    const iceEff = Math.min(100, ((weights.waterIce || 0) * normFactor) * 1.10 + 70);
    const radEff = Math.min(100, ((weights.radiation || 0) * normFactor) * 0.95 + 78);
    const accessEff = Math.min(100, ((weights.access || 0) * normFactor) * 1.02 + 74);

    const overallScore = Math.min(99.5, Math.max(20.0, (
      terrainEff * 0.20 +
      solarEff * 0.25 +
      iceEff * 0.25 +
      radEff * 0.15 +
      accessEff * 0.15
    )));

    const powerOutputKw = (((weights.solarEnergy || 25) * 1.25)).toFixed(1);
    const waterYieldMt = (((weights.waterIce || 25) * 0.85)).toFixed(1);
    const radiationMarginPct = Math.min(99, Math.round(75 + (weights.radiation || 15) * 0.7));
    const slopeStabilityRating = (weights.terrain || 0) >= 20 ? 'Optimal Bedrock' : 'Standard Anchor';
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
    const slope = typeof customCoord.slope_deg === 'number' ? customCoord.slope_deg : 3.8;
    const sun = typeof customCoord.annual_illumination_pct === 'number' ? customCoord.annual_illumination_pct : 92.0;
    const ice = typeof customCoord.ice_prob === 'number' ? customCoord.ice_prob : 0.4;
    const vis = typeof customCoord.earth_vis_pct === 'number' ? customCoord.earth_vis_pct : 90.0;
    const rough = typeof customCoord.roughness_m === 'number' ? customCoord.roughness_m : 0.6;
    const deltaT = Math.abs((Number(customCoord.max_temp_k) || 220) - (Number(customCoord.min_temp_k) || 180));

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
      badgeClass = 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40 shadow-glow-emerald';
    } else if (score >= 70.0) {
      riskClass = 'High Suitability';
      badgeClass = 'text-cyan-300 bg-cyan-950/70 border-cyan-500/40 shadow-glow-cyan';
    } else if (score < 55.0) {
      riskClass = 'Hazard / Low Suitability';
      badgeClass = 'text-rose-400 bg-rose-950/60 border-rose-500/30';
    }

    return {
      score: score.toFixed(1),
      riskClass,
      badgeClass
    };
  }, [customCoord]);

  return (
    <aside className="w-80 h-full bg-[#070B14]/95 border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto backdrop-blur-xl z-10 shrink-0 select-none custom-scrollbar animate-smooth-slide-left">
      <div className="space-y-4">
        
        {/* SECTION 1: MISSION PRIORITY WEIGHTS (SLIDERS) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                CRITERIA WEIGHTS (MCDA)
              </h2>
            </div>
            <button
              type="button"
              onClick={resetWeights}
              title="Reset MCDA Weights to Artemis baseline"
              className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Mission Presets Carousel */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {MISSION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset.weights)}
                title={preset.desc}
                className="p-1.5 rounded-lg bg-[#0B1120] hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 group-hover:text-cyan-300 truncate">
                  {getPresetIcon(preset.name)}
                  <span className="truncate">{preset.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Weight Sliders */}
          <div className="bg-[#0B1120]/80 p-3 rounded-xl border border-slate-800/80 space-y-3 shadow-inner">
            
            {/* 1. Terrain / Slope Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Terrain (Slope Safety)</span>
                </span>
                <span className="font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                  {weights.terrain || 0}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.terrain || 0}
                aria-label="Terrain slope safety weight percentage"
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
                  {weights.solarEnergy || 0}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.solarEnergy || 0}
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
                  {weights.waterIce || 0}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.waterIce || 0}
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
                  {weights.radiation || 0}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.radiation || 0}
                aria-label="Radiation shielding weight percentage"
                onChange={(e) => handleWeightChange('radiation', e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* 5. Access / Surface Transit Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 text-sky-300">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                  <span>Earth Comms & Access</span>
                </span>
                <span className="font-bold text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-500/30 text-[11px]">
                  {weights.access || 0}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.access || 0}
                aria-label="Surface accessibility and Earth communications weight percentage"
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
              setIsSimulatorOpen(prev => !prev);
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
                        earth_vis_pct: 85,
                        elevation_m: 800,
                        roughness_m: 0.4,
                        max_temp_k: 260,
                        min_temp_k: 160
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
                        earth_vis_pct: 90,
                        elevation_m: 1200,
                        roughness_m: 0.6,
                        max_temp_k: 220,
                        min_temp_k: 180
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
                        earth_vis_pct: 98,
                        elevation_m: 5000,
                        roughness_m: 0.5,
                        max_temp_k: 230,
                        min_temp_k: 190
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
                        earth_vis_pct: 100,
                        elevation_m: -100,
                        roughness_m: 0.2,
                        max_temp_k: 385,
                        min_temp_k: 100
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
                    value={customCoord.lat ?? 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCustomCoord(prev => ({ ...prev, lat: isNaN(val) ? 0 : val }));
                    }}
                    className="w-full bg-[#050811] border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5">Longitude (°)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customCoord.lon ?? 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCustomCoord(prev => ({ ...prev, lon: isNaN(val) ? 0 : val }));
                    }}
                    className="w-full bg-[#050811] border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* 1. Slope Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span className="text-emerald-400 font-bold">Terrain Slope:</span>
                  <span className="font-mono text-slate-200">
                    {(Number(customCoord.slope_deg) || 0).toFixed(1)}° {(Number(customCoord.slope_deg) || 0) > 12 ? '⚠️ High' : '✓ Safe'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.1"
                  value={Number(customCoord.slope_deg) || 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCustomCoord(prev => ({ ...prev, slope_deg: isNaN(val) ? 0 : val }));
                  }}
                  className="w-full h-1 bg-slate-800 rounded accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* 2. Illumination Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span className="text-amber-400 font-bold">Annual Sunlight:</span>
                  <span className="font-mono text-slate-200">{(Number(customCoord.annual_illumination_pct) || 0).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Number(customCoord.annual_illumination_pct) || 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCustomCoord(prev => ({ ...prev, annual_illumination_pct: isNaN(val) ? 0 : val }));
                  }}
                  className="w-full h-1 bg-slate-800 rounded accent-amber-400 cursor-pointer"
                />
              </div>

              {/* 3. Water Ice Probability Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span className="text-cyan-400 font-bold">Water Ice Volatiles:</span>
                  <span className="font-mono text-slate-200">{((Number(customCoord.ice_prob) || 0) * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={Number(customCoord.ice_prob) || 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCustomCoord(prev => ({ ...prev, ice_prob: isNaN(val) ? 0 : val }));
                  }}
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
                  <div>⚡ Power: <span className="font-bold text-amber-300">{(((Number(customCoord.annual_illumination_pct) || 0) / 100) * 32.0).toFixed(1)} kW</span></div>
                  <div>🧊 Water: <span className="font-bold text-cyan-300">{((Number(customCoord.ice_prob) || 0) * 24.5).toFixed(1)} MT/yr</span></div>
                  <div>🛡️ Radiation: <span className="font-bold text-purple-300">{Math.max(10, Math.round(100 - (Number(customCoord.slope_deg) || 0) * 1.5))}% Safe</span></div>
                  <div>🛰️ Comms LOS: <span className="font-bold text-sky-300">{(Number(customCoord.lat) || 0) < -80 ? '90.0%' : '100.0%'}</span></div>
                </div>

                {/* Action: Fly to Simulated Node */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playSelect();
                    const latNum = Number(customCoord.lat) || 0;
                    const lonNum = Number(customCoord.lon) || 0;
                    const slopeNum = Number(customCoord.slope_deg) || 3.8;
                    const sunNum = Number(customCoord.annual_illumination_pct) || 92;
                    const iceNum = Number(customCoord.ice_prob) || 0.4;
                    const scoreNum = parseFloat(liveCustomPrediction.score) || 75.0;

                    if (typeof onFlyToCustomCoord === 'function') {
                      onFlyToCustomCoord({
                        id: `sim_${Date.now()}`,
                        code: 'SIM',
                        name: `Simulated Coordinate (${latNum > 0 ? '+' : ''}${latNum.toFixed(2)}°, ${lonNum > 0 ? '+' : ''}${lonNum.toFixed(2)}°)`,
                        shortName: `SIM (${latNum.toFixed(1)}°, ${lonNum.toFixed(1)}°)`,
                        tier: liveCustomPrediction.riskClass,
                        latitude: latNum,
                        longitude: lonNum,
                        elevationMeters: 1200,
                        suitabilityScore: scoreNum,
                        aiConfidence: 96,
                        slopeDegrees: slopeNum,
                        illuminationPercentage: sunNum,
                        waterIceIndicator: iceNum > 0.3 ? 'High' : (iceNum > 0.1 ? 'Moderate' : 'Low'),
                        siteType: slopeNum > 8 ? 'Crater Rim' : 'Polar Plateau',
                        factors: {
                          slope: slopeNum,
                          illumination: sunNum,
                          waterIce: iceNum * 100,
                          radiation: Math.max(10, Math.round(100 - slopeNum * 1.5)),
                          accessibility: latNum < -80 ? 90 : 100
                        },
                        geology_analysis: {
                          terrain_type: slopeNum > 8 ? 'Elevated Ridge / Rim Massif' : 'Highland Polar Plain',
                          regolith_stability: 'High Mechanical Load Bearing Capacity',
                          radiation_shielding: `${Math.max(10, Math.round(100 - slopeNum * 1.5))}% Estimated Attenuation`
                        }
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
                  {filter.minScore || 0}
                </span>
              </div>
              <input
                id="min-score-threshold"
                type="range"
                min="0"
                max="95"
                value={filter.minScore || 0}
                aria-label="Minimum Suitability Threshold Slider"
                onChange={(e) => setFilter(prev => ({ ...prev, minScore: Number(e.target.value) || 0 }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="geo-feature-type-select" className="block text-[11px] font-mono text-slate-400 mb-1">
                Geological Feature Type
              </label>
              <select
                id="geo-feature-type-select"
                value={filter.siteType || 'All'}
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
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          REAL-TIME LUNA-DSS
        </span>
        <span className="text-slate-500">v1.0 Active</span>
      </div>

    </aside>
  );
};
