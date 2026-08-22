import React from 'react';
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
  ShieldCheck
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



  return (
    <aside className="w-80 h-full bg-[#070B14]/95 border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto backdrop-blur-xl z-10 shrink-0 select-none custom-scrollbar animate-smooth-slide-left">
      <div className="space-y-5">
        
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
          <div className="bg-[#0B1120]/80 p-3 rounded-xl border border-slate-800/80 space-y-3.5 shadow-inner">
            
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

        {/* SECTION 2: 3D DATA LAYERS */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Layers className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              3D MAP LAYERS
            </h2>
          </div>

          <div className="bg-[#0B1120]/80 p-2.5 rounded-xl border border-slate-800/80 space-y-2 shadow-inner">
            {LAYER_ITEMS.map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                
                {/* Modern Toggle Switch */}
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    aria-label={`Toggle ${item.label} layer`}
                    checked={layers[item.key]}
                    onChange={() => toggleLayer(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform border border-slate-700" />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 3: SITE FILTER */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Filter className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              CRITERIA FILTER
            </h2>
          </div>

          <div className="bg-[#0B1120]/80 p-3 rounded-xl border border-slate-800/80 space-y-3 shadow-inner">
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
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER INFO CARD */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-b from-[#0F172A]/90 to-[#070B14]/90 border border-slate-700/60 shadow-lg">
        <div className="flex items-center gap-1.5 mb-1 text-xs font-mono font-bold text-cyan-400">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>REAL-TIME MCDA ENGINE</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
          Adjusting sliders re-evaluates all candidate coordinates with weighted multi-factor matrix normalization.
        </p>
      </div>
    </aside>
  );
};

export default LayerControls;
