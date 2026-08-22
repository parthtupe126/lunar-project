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
