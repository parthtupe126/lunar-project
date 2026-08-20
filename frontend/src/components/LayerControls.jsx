import React from 'react';
import { 
  Sliders, 
  Mountain, 
  TrendingUp, 
  Sun, 
  Droplets, 
  ShieldCheck, 
  Rocket, 
  Layers, 
  Filter, 
  RotateCcw,
  Thermometer,
  Gauge
} from 'lucide-react';
import { soundManager } from '../utils/audio';

/**
 * LayerControls: Human-designed aerospace control panel for MCDA multi-criteria sliders and map layers
 */
export const LayerControls = ({
  weights = {
    waterIce: 25,
    solarEnergy: 25,
    terrain: 20,
    radiation: 15,
    access: 15
  },
  setWeights = () => {},
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
  setLayers = () => {},
  filter = {
    minScore: 0,
    siteType: 'All',
    searchQuery: ''
  },
  setFilter = () => {}
}) => {
  // Mission Profiles
  const presets = [
    {
      name: 'Artemis Base',
      weights: { waterIce: 25, solarEnergy: 25, terrain: 20, radiation: 15, access: 15 }
    },
    {
      name: 'ISRU Mining',
      weights: { waterIce: 45, solarEnergy: 20, terrain: 15, radiation: 10, access: 10 }
    },
    {
      name: 'Solar Station',
      weights: { waterIce: 15, solarEnergy: 50, terrain: 15, radiation: 10, access: 10 }
    },
    {
      name: 'Radiation Safe',
      weights: { waterIce: 20, solarEnergy: 20, terrain: 15, radiation: 35, access: 10 }
    }
  ];

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

  const layerItems = [
    { key: 'terrain', label: 'Terrain Relief', icon: <Mountain className="w-3.5 h-3.5 text-slate-400" /> },
    { key: 'elevation', label: 'Elevation Contours', icon: <Layers className="w-3.5 h-3.5 text-slate-400" /> },
    { key: 'slope', label: 'Slope Gradients', icon: <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> },
    { key: 'waterIce', label: 'Water Ice Deposits', icon: <Droplets className="w-3.5 h-3.5 text-sky-400" /> },
    { key: 'illumination', label: 'Solar Illumination', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
    { key: 'radiation', label: 'Radiation Shielding', icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> },
    { key: 'temperature', label: 'Thermal Profile', icon: <Thermometer className="w-3.5 h-3.5 text-rose-400" /> },
  ];

  return (
    <aside className="w-80 h-full bg-[#0a0d14]/95 border-r border-slate-800/60 p-4 flex flex-col justify-between overflow-y-auto backdrop-blur-md z-10 shrink-0 select-none custom-scrollbar">
      <div className="space-y-4">
        
        {/* SECTION 1: CRITERIA WEIGHTINGS */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <h2 className="text-xs font-semibold tracking-wide text-slate-200 uppercase font-sans">
                Evaluation Weights
              </h2>
            </div>
            <button
              onClick={resetWeights}
              title="Reset weights"
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Mission Presets Chips */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p.weights)}
                className="px-2 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-md text-[11px] text-slate-300 transition-colors text-left truncate cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Sliders Container */}
          <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 space-y-3">
            
            {/* 1. Slope / Terrain Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span>Terrain Flatness</span>
                </span>
                <span className="font-mono text-xs font-semibold text-slate-200 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                  {weights.terrain}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.terrain}
                onChange={(e) => handleWeightChange('terrain', e.target.value)}
                className="w-full"
              />
            </div>

            {/* 2. Sun / Solar Energy Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Solar Energy</span>
                </span>
                <span className="font-mono text-xs font-semibold text-slate-200 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                  {weights.solarEnergy}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.solarEnergy}
                onChange={(e) => handleWeightChange('solarEnergy', e.target.value)}
                className="w-full"
              />
            </div>

            {/* 3. Water Ice Volatiles Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Droplets className="w-3 h-3 text-sky-400" />
                  <span>Water Ice (ISRU)</span>
                </span>
                <span className="font-mono text-xs font-semibold text-slate-200 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                  {weights.waterIce}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.waterIce}
                onChange={(e) => handleWeightChange('waterIce', e.target.value)}
                className="w-full"
              />
            </div>

            {/* 4. Radiation Shielding Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  <span>Radiation Protection</span>
                </span>
                <span className="font-mono text-xs font-semibold text-slate-200 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                  {weights.radiation}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.radiation}
                onChange={(e) => handleWeightChange('radiation', e.target.value)}
                className="w-full"
              />
            </div>

            {/* 5. Landing Access Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Rocket className="w-3 h-3 text-slate-400" />
                  <span>Landing Access</span>
                </span>
                <span className="font-mono text-xs font-semibold text-slate-200 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                  {weights.access}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.access}
                onChange={(e) => handleWeightChange('access', e.target.value)}
                className="w-full"
              />
            </div>

          </div>
        </div>

        {/* SECTION 2: MAP LAYERS */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <h2 className="text-xs font-semibold tracking-wide text-slate-200 uppercase font-sans">
              Surface Layers
            </h2>
          </div>

          <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5">
            {layerItems.map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                
                {/* Clean iOS / Linear-style switch */}
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layers[item.key]}
                    onChange={() => toggleLayer(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all border border-slate-700" />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 3: SITE FILTER */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <h2 className="text-xs font-semibold tracking-wide text-slate-200 uppercase font-sans">
              Filter Formations
            </h2>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 space-y-2.5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Min Suitability</span>
                <span className="font-mono text-xs text-slate-200 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                  {filter.minScore}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                value={filter.minScore}
                onChange={(e) => setFilter(prev => ({ ...prev, minScore: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                Geological Feature
              </label>
              <select
                value={filter.siteType}
                onChange={(e) => {
                  soundManager.playClick();
                  setFilter(prev => ({ ...prev, siteType: e.target.value }));
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Formations</option>
                <option value="Crater Rim">Crater Rim</option>
                <option value="Polar Plateau">Polar Plateau</option>
                <option value="PSR Basin">Permanently Shadowed (PSR)</option>
                <option value="Lava Tube">Lava Tube Skylight</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER METRIC NOTE */}
      <div className="mt-4 p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-1">
          <Gauge className="w-3.5 h-3.5 text-sky-400" />
          <span>MCDA Normalization</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-normal">
          Suitability scores recalculate in real-time across all 23 candidate landing sites.
        </p>
      </div>
    </aside>
  );
};

export default LayerControls;

