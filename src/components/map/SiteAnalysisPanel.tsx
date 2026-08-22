import React, { useState } from 'react';
import { LunarSite, MissionPriorityWeights, ActiveTab } from '../../types/lunar';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Mountain, 
  Droplets, 
  Sun, 
  Radiation, 
  Thermometer, 
  Rocket, 
  Edit3,
  Sliders,
  Check,
  X,
  Camera
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface SiteAnalysisPanelProps {
  site: LunarSite | null;
  weights: MissionPriorityWeights;
  setWeights: React.Dispatch<React.SetStateAction<MissionPriorityWeights>>;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDeepDive?: () => void;
}

export const SiteAnalysisPanel: React.FC<SiteAnalysisPanelProps> = ({
  site,
  weights,
  setWeights,
  setActiveTab,
  onOpenDeepDive
}) => {
  const [showWeightEditor, setShowWeightEditor] = useState(false);
  const [tempWeights, setTempWeights] = useState<MissionPriorityWeights>(weights);

  if (!site) {
    return (
      <aside className="w-80 h-full bg-[#070B14]/90 border-l border-slate-800/80 p-4 flex flex-col items-center justify-center text-slate-500 backdrop-blur-xl shrink-0">
        <Sparkles className="w-8 h-8 mb-2 text-slate-600 animate-pulse" />
        <p className="text-xs font-mono text-center">Select a lunar site to view AI suitability analysis</p>
      </aside>
    );
  }

  // Calculate SVG stroke offset for the circular radial gauge
  const gaugeRadius = 28;
  const circumference = 2 * Math.PI * gaugeRadius;
  const clampedScore = Math.min(100, Math.max(0, site.suitabilityScore || 0));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const handleOpenWeights = () => {
    soundManager.playClick();
    setTempWeights(weights);
    setShowWeightEditor(true);
  };

  const handleSaveWeights = () => {
    soundManager.playSelect();
    setWeights(tempWeights);
    setShowWeightEditor(false);
  };

  return (
    <aside className="w-80 h-full bg-[#070B14]/92 border-l border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto backdrop-blur-xl z-10 shrink-0 select-none">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="border-b border-slate-800 pb-3">
          <div className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase mb-1">
            SITE ANALYSIS
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white font-mono tracking-tight">
                {site.code}
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Lat: {site.latitude.toFixed(2)}° Lon: {site.longitude.toFixed(2)}°
              </p>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border ${
              site.tier === 'HIGHLY SUITABLE' 
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/50 shadow-glow-purple'
                : site.tier === 'SUITABLE'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}>
              {site.tier}
            </span>
          </div>
        </div>

        {/* Real Lunar Reconnaissance Optical Imagery Card */}
        {site.thumbnail && (
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-lg">
            <img 
              src={site.thumbnail} 
              alt={site.name}
              className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/30" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-700/50">
                <Camera className="w-3 h-3 text-cyan-400" />
                <span>NASA LRO Optical Survey</span>
              </span>
              <span className="bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm text-cyan-300 font-bold border border-slate-700/50">
                {site.elevationMeters > 0 ? `+${site.elevationMeters}m` : `${site.elevationMeters}m`}
              </span>
            </div>
          </div>
        )}

        {/* Big Circular Progress Score Gauge */}
        <div className="flex items-center gap-3.5 bg-[#0B1120]/80 p-3 rounded-2xl border border-slate-800/80 shadow-inner overflow-hidden">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 72 72" className="w-16 h-16 -rotate-90 origin-center block">
              {/* Background track */}
              <circle
                cx="36"
                cy="36"
                r={gaugeRadius}
                className="stroke-slate-800"
                strokeWidth="5.5"
                fill="transparent"
              />
              {/* Animated Progress bar */}
              <circle
                cx="36"
                cy="36"
                r={gaugeRadius}
                className="stroke-purple-500 radial-progress-bar"
                strokeWidth="5.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.6))'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-base font-black font-mono text-white leading-none">
                {site.suitabilityScore.toFixed(1)}
              </span>
              <span className="text-[8px] font-mono text-slate-400 leading-tight">
                / 100
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">
              Overall Suitability Score
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
              Top Ranked Site ({site.shortName})
            </div>
          </div>
        </div>

        {/* Factor Breakdown Bars with Exact Colors */}
        <div className="space-y-2 bg-[#0B1120]/70 p-3 rounded-xl border border-slate-800/80 text-xs font-mono">
          {/* Terrain */}
          <div>
            <div className="flex justify-between items-center text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-cyan-400" /> Terrain Flatness
              </span>
              <span className="font-bold text-white">{site.factors.terrain}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-700 shadow-glow-cyan"
                style={{ width: `${site.factors.terrain}%` }}
              />
            </div>
          </div>

          {/* Water Ice */}
          <div>
            <div className="flex justify-between items-center text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Water Ice Volatiles
              </span>
              <span className="font-bold text-white">{site.factors.waterIce}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${site.factors.waterIce}%` }}
              />
            </div>
          </div>

          {/* Solar Illumination */}
          <div>
            <div className="flex justify-between items-center text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Illumination
              </span>
              <span className="font-bold text-white">{site.factors.solarIllumination}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-700 shadow-glow-amber"
                style={{ width: `${site.factors.solarIllumination}%` }}
              />
            </div>
          </div>

          {/* Radiation Safety */}
          <div>
            <div className="flex justify-between items-center text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Radiation className="w-3.5 h-3.5 text-purple-400" /> Radiation Safety
              </span>
              <span className="font-bold text-white">{site.factors.radiationSafety}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-700 shadow-glow-purple"
                style={{ width: `${site.factors.radiationSafety}%` }}
              />
            </div>
          </div>

          {/* Temperature Stability */}
          <div>
            <div className="flex justify-between items-center text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-orange-400" /> Temperature
              </span>
              <span className="font-bold text-white">{site.factors.temperature}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${site.factors.temperature}%` }}
              />
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <div className="flex justify-between items-center text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-sky-400" /> Accessibility
              </span>
              <span className="font-bold text-white">{site.factors.accessibility}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${site.factors.accessibility}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI CONFIDENCE */}
        <div className="bg-[#0B1120]/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-slate-300 font-semibold tracking-wider text-[11px]">
              AI CONFIDENCE
            </span>
            <span className="font-bold text-emerald-400">{site.aiConfidence}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full shadow-glow-green transition-all duration-500"
              style={{ width: `${site.aiConfidence}%` }}
            />
          </div>
        </div>

        {/* WHY THIS SITE? (Matching Image 2) */}
        <div className="bg-[#0B1120]/70 p-3 rounded-xl border border-slate-800/80">
          <div className="text-[11px] font-mono font-bold text-slate-300 mb-2 tracking-wider">
            WHY THIS SITE?
          </div>
          <ul className="space-y-1.5 text-xs">
            {site.whyThisSite.map((item) => (
              <li key={item.text} className="flex items-start gap-2 text-slate-300 leading-tight">
                {item.type === 'positive' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Full Scientific Telemetry Deep Dive Page Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            if (onOpenDeepDive) onOpenDeepDive();
          }}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-glow-cyan flex items-center justify-center gap-2 border border-cyan-400/40 cursor-pointer"
        >
          <Rocket className="w-4 h-4 text-cyan-300" />
          <span>Open Full Scientific Telemetry Page ↗</span>
        </button>
      </div>

      {/* MISSION PRIORITY (Bottom Right - Matching Image 2) */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
              MISSION PRIORITY
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Custom Mission Profile</div>
          </div>
          <button
            onClick={handleOpenWeights}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-mono transition-colors border border-slate-700"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        {/* Priority Percentage Chips (Matching Image 2) */}
        <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
          <div className="bg-[#0B1120] p-1.5 rounded border border-slate-800">
            <div className="text-slate-400 text-[9px]">Water Ice</div>
            <div className="font-bold text-cyan-300">{weights.waterIce}%</div>
          </div>
          <div className="bg-[#0B1120] p-1.5 rounded border border-slate-800">
            <div className="text-slate-400 text-[9px]">Solar</div>
            <div className="font-bold text-amber-300">{weights.solarEnergy}%</div>
          </div>
          <div className="bg-[#0B1120] p-1.5 rounded border border-slate-800">
            <div className="text-slate-400 text-[9px]">Terrain</div>
            <div className="font-bold text-emerald-300">{weights.terrain}%</div>
          </div>
          <div className="bg-[#0B1120] p-1.5 rounded border border-slate-800">
            <div className="text-slate-400 text-[9px]">Radiation</div>
            <div className="font-bold text-purple-300">{weights.radiation}%</div>
          </div>
          <div className="bg-[#0B1120] p-1.5 rounded border border-slate-800">
            <div className="text-slate-400 text-[9px]">Access</div>
            <div className="font-bold text-sky-300">{weights.access}%</div>
          </div>
        </div>
      </div>

      {/* Inline Quick Weight Editor Modal */}
      {showWeightEditor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-cyan-500/40 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-mono text-white">Adjust Mission Weights</h3>
              </div>
              <button
                onClick={() => setShowWeightEditor(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-300">Water Ice Proximity</span>
                  <span className="font-bold">{tempWeights.waterIce}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={tempWeights.waterIce}
                  onChange={(e) => setTempWeights(prev => ({ ...prev, waterIce: Number(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-amber-300">Solar Energy</span>
                  <span className="font-bold">{tempWeights.solarEnergy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={tempWeights.solarEnergy}
                  onChange={(e) => setTempWeights(prev => ({ ...prev, solarEnergy: Number(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-emerald-300">Terrain Flatness</span>
                  <span className="font-bold">{tempWeights.terrain}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={tempWeights.terrain}
                  onChange={(e) => setTempWeights(prev => ({ ...prev, terrain: Number(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded accent-emerald-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-purple-300">Radiation Shielding</span>
                  <span className="font-bold">{tempWeights.radiation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={tempWeights.radiation}
                  onChange={(e) => setTempWeights(prev => ({ ...prev, radiation: Number(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded accent-purple-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sky-300">Landing Access</span>
                  <span className="font-bold">{tempWeights.access}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={tempWeights.access}
                  onChange={(e) => setTempWeights(prev => ({ ...prev, access: Number(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded accent-sky-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSaveWeights}
                className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-glow-cyan flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Weights</span>
              </button>
              <button
                onClick={() => {
                  setShowWeightEditor(false);
                  setActiveTab('optimization');
                }}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-mono text-xs font-medium transition-colors"
              >
                Full Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
