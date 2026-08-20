import React from 'react';
import { LunarSite, MissionPriorityWeights, MissionProfilePreset } from '../../types/lunar';
import { MISSION_PROFILES } from '../../data/missionProfiles';
import { 
  Sliders, 
  Sparkles, 
  Rocket, 
  Droplets, 
  Radio, 
  Home, 
  PlaneLanding, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface OptimizationViewProps {
  sites: LunarSite[];
  weights: MissionPriorityWeights;
  setWeights: React.Dispatch<React.SetStateAction<MissionPriorityWeights>>;
  selectedSite: LunarSite | null;
  onSelectSite: (site: LunarSite) => void;
}

export const OptimizationView: React.FC<OptimizationViewProps> = ({
  sites,
  weights,
  setWeights,
  selectedSite,
  onSelectSite
}) => {
  const handleApplyPreset = (preset: MissionProfilePreset) => {
    soundManager.playSelect();
    setWeights(preset.weights);
  };

  const handleSliderChange = (key: keyof MissionPriorityWeights, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }));
  };

  const resetToBalanced = () => {
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
    <div className="w-full h-full bg-[#050811] overflow-y-auto p-6 space-y-6 text-slate-200">
      {/* Optimization Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            AI MULTI-CRITERIA DECISION OPTIMIZATION (MCDM / AHP)
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Fine-tune objective weights or select mission presets. Algorithmic re-scoring updates dynamically.
          </p>
        </div>

        <button
          onClick={resetToBalanced}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-mono transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Default Weights</span>
        </button>
      </div>

      {/* Preset Mission Profiles Shelf */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
          SELECT MISSION ARCHITECTURE PRESET
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {MISSION_PROFILES.map((preset) => {
            const isMatch =
              weights.waterIce === preset.weights.waterIce &&
              weights.solarEnergy === preset.weights.solarEnergy &&
              weights.terrain === preset.weights.terrain &&
              weights.radiation === preset.weights.radiation &&
              weights.access === preset.weights.access;

            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  isMatch
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-glow-cyan ring-1 ring-cyan-400/50'
                    : 'bg-[#0B1120]/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                      {preset.id.includes('artemis') && <Rocket className="w-4 h-4" />}
                      {preset.id.includes('mining') && <Droplets className="w-4 h-4" />}
                      {preset.id.includes('science') && <Radio className="w-4 h-4" />}
                      {preset.id.includes('colony') && <Home className="w-4 h-4" />}
                      {preset.id.includes('spaceport') && <PlaneLanding className="w-4 h-4" />}
                    </span>
                    {isMatch && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <h4 className="font-mono text-xs font-bold text-white mb-1">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-300 font-semibold">
                  Focus: {preset.targetFocus}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Sliders + Real-Time Pareto / Ranking Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Card */}
        <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 shadow-card backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              MULTI-CRITERIA WEIGHT ADJUSTMENT MATRIX
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Total Weight: {weights.waterIce + weights.solarEnergy + weights.terrain + weights.radiation + weights.access}%
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Water Ice Proximity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Droplets className="w-4 h-4 text-cyan-400" /> Water Ice & PSR Volatiles
                </span>
                <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {weights.waterIce}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.waterIce}
                onChange={(e) => handleSliderChange('waterIce', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="text-[10px] text-slate-500">
                Prioritizes proximity to hydrogen beds in deep craters (Cabeus, Faustini, Haworth)
              </div>
            </div>

            {/* Solar Energy */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Solar Illumination & Power
                </span>
                <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {weights.solarEnergy}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.solarEnergy}
                onChange={(e) => handleSliderChange('solarEnergy', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="text-[10px] text-slate-500">
                Prioritizes Peaks of Eternal Light with &gt; 90% annual sunlight (Shackleton, Malapert)
              </div>
            </div>

            {/* Terrain Flatness */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Terrain Flatness & Bearing Capacity
                </span>
                <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {weights.terrain}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.terrain}
                onChange={(e) => handleSliderChange('terrain', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="text-[10px] text-slate-500">
                Requires slopes &lt; 5° for landing pads and multi-module base expansion
              </div>
            </div>

            {/* Radiation Shielding */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Radiation Safety & SPE Protection
                </span>
                <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {weights.radiation}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.radiation}
                onChange={(e) => handleSliderChange('radiation', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="text-[10px] text-slate-500">
                Favors natural lava tubes (Marius Hills) or deep regolith berm protection
              </div>
            </div>

            {/* Surface Accessibility */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-sky-300 font-bold">
                  <Rocket className="w-4 h-4 text-sky-400" /> Landing Approach & Rover Access
                </span>
                <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {weights.access}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.access}
                onChange={(e) => handleSliderChange('access', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="text-[10px] text-slate-500">
                Optimizes descent delta-V and ease of pressurized rover traverses
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Candidate Site Leaderboard & Pareto Frontier */}
        <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 shadow-card backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold font-mono text-white">
                CURRENT RE-WEIGHTED TOP CANDIDATES
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Dynamically calculated via Weighted Linear MCDM Engine
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              OPTIMIZED
            </span>
          </div>

          <div className="space-y-2 font-mono">
            {sites.slice(0, 6).map((site, index) => {
              const isSelected = selectedSite?.id === site.id;
              return (
                <div
                  key={site.id}
                  onClick={() => {
                    soundManager.playSelect();
                    onSelectSite(site);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{site.code}</span>
                        <span className="text-slate-400 font-normal">{site.shortName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {site.latitude}°, {site.longitude}° • {site.siteType}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400">
                      {site.suitabilityScore.toFixed(1)}
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${
                      site.tier === 'HIGHLY SUITABLE'
                        ? 'bg-purple-950 text-purple-300 border-purple-500/40'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {site.tier}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
