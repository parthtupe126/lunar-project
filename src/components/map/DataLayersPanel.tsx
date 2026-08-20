import React from 'react';
import { LayerVisibility, FilterState } from '../../types/lunar';
import { 
  Mountain, 
  TrendingUp, 
  Layers, 
  Droplets, 
  Sun, 
  Radiation, 
  Thermometer, 
  Cpu, 
  Filter, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface DataLayersPanelProps {
  layers: LayerVisibility;
  setLayers: React.Dispatch<React.SetStateAction<LayerVisibility>>;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const DataLayersPanel: React.FC<DataLayersPanelProps> = ({
  layers,
  setLayers,
  filter,
  setFilter,
}) => {
  const toggleLayer = (layerKey: keyof LayerVisibility) => {
    soundManager.playClick();
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const layerItems: { key: keyof LayerVisibility; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'terrain', label: 'Terrain', icon: <Mountain className="w-4 h-4 text-cyan-400" />, color: 'peer-checked:bg-cyan-500' },
    { key: 'elevation', label: 'Elevation', icon: <Layers className="w-4 h-4 text-blue-400" />, color: 'peer-checked:bg-blue-500' },
    { key: 'slope', label: 'Slope', icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, color: 'peer-checked:bg-emerald-500' },
    { key: 'waterIce', label: 'Water Ice', icon: <Droplets className="w-4 h-4 text-cyan-300" />, color: 'peer-checked:bg-cyan-400' },
    { key: 'illumination', label: 'Illumination', icon: <Sun className="w-4 h-4 text-amber-400" />, color: 'peer-checked:bg-amber-500' },
    { key: 'radiation', label: 'Radiation', icon: <Radiation className="w-4 h-4 text-purple-400" />, color: 'peer-checked:bg-purple-500' },
    { key: 'temperature', label: 'Temperature', icon: <Thermometer className="w-4 h-4 text-rose-400" />, color: 'peer-checked:bg-rose-500' },
    { key: 'aiSuitability', label: 'AI Suitability', icon: <Cpu className="w-4 h-4 text-emerald-300" />, color: 'peer-checked:bg-emerald-500' },
  ];

  return (
    <aside className="w-72 h-full bg-[#070B14]/90 border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto backdrop-blur-xl z-10 shrink-0 select-none">
      <div className="space-y-5">
        {/* DATA LAYERS HEADER */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              DATA LAYERS
            </h2>
          </div>

          {/* Layer Switches List (Matching Image 2) */}
          <div className="space-y-2 bg-[#0B1120]/70 p-2.5 rounded-xl border border-slate-800/80 shadow-inner">
            {layerItems.map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-200">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                
                {/* Modern Toggle Switch */}
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layers[item.key]}
                    onChange={() => toggleLayer(item.key)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer ${item.color} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all border border-slate-700`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SITE FILTER SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              SITE FILTER
            </h2>
          </div>

          <div className="bg-[#0B1120]/70 p-3 rounded-xl border border-slate-800/80 space-y-3.5 shadow-inner">
            {/* Minimum Suitability Score Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Minimum Suitability Score</span>
                <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {filter.minScore}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filter.minScore}
                onChange={(e) => {
                  setFilter((prev) => ({ ...prev, minScore: Number(e.target.value) }));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            {/* Site Type Dropdown */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Site Type
              </label>
              <select
                value={filter.siteType}
                onChange={(e) => {
                  soundManager.playClick();
                  setFilter((prev) => ({ ...prev, siteType: e.target.value }));
                }}
                className="w-full bg-[#070B14] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="All">All Sites</option>
                <option value="Crater Rim">Crater Rim</option>
                <option value="Polar Plateau">Polar Plateau</option>
                <option value="PSR Basin">Permanently Shadowed (PSR)</option>
                <option value="Lava Tube">Lava Tube Skylight</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* AI-POWERED INSIGHTS CARD (Bottom Left - Matching Image 2) */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-b from-[#0F172A]/90 to-[#070B14]/90 border border-slate-700/60 shadow-lg relative overflow-hidden group">
        <div className="relative h-24 rounded-lg overflow-hidden mb-2.5 border border-slate-700/50">
          <img
            src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80"
            alt="Lunar Habitat Outpost Concept"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
          <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> ARTEMIS BASE CAMP
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-1 text-xs font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI-POWERED INSIGHTS</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
          Advanced machine learning analyzes multiple lunar factors to recommend the best habitat sites.
        </p>
      </div>
    </aside>
  );
};
