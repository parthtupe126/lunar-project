import React from 'react';
import { 
  Trophy, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Mountain, 
  Droplets, 
  Sun, 
  Radiation, 
  Rocket, 
  Thermometer, 
  FileText,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Camera,
  Layers
} from 'lucide-react';
import { soundManager } from '../utils/audio';

/**
 * Scoreboard: Panel showing top habitat candidate coordinates, rankings, and AI analysis breakdown
 */
export const Scoreboard = ({
  sites = [],
  selectedSite = null,
  onSelectSite = () => {},
  onOpenReport = () => {},
  onOpenDeepDive = () => {},
  weights = {}
}) => {
  const topSite = selectedSite || sites[0] || null;

  if (!topSite) {
    return (
      <aside className="w-84 h-full bg-[#070B14]/95 border-l border-slate-800/80 p-4 flex flex-col items-center justify-center text-slate-500 backdrop-blur-xl shrink-0">
        <Sparkles className="w-8 h-8 mb-2 text-slate-600 animate-pulse" />
        <p className="text-xs font-mono text-center">Loading habitat candidate coordinates...</p>
      </aside>
    );
  }

  // Radial progress gauge calculations
  const gaugeRadius = 28;
  const circumference = 2 * Math.PI * gaugeRadius;
  const clampedScore = Math.min(100, Math.max(0, topSite.suitabilityScore || 0));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <aside className="w-84 h-full bg-[#070B14]/95 border-l border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto backdrop-blur-xl z-10 shrink-0 select-none custom-scrollbar">
      <div className="space-y-4">
        
        {/* SCOREBOARD HEADER & TOP CANDIDATES PODIUM */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                HABITAT SCOREBOARD
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
              {sites.length} Analyzed
            </span>
          </div>

          {/* Quick Coordinates Mini-List */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {sites.slice(0, 3).map((s, idx) => {
              const isSelected = topSite.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    soundManager.playSelect();
                    onSelectSite(s);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-glow-purple'
                      : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                    <span className="font-bold text-slate-400">#{idx + 1}</span>
                    <span className={`font-bold ${idx === 0 ? 'text-purple-400' : idx === 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {s.suitabilityScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-xs text-white truncate">
                    {s.code}
                  </div>
                  <div className="font-mono text-[9px] text-slate-400">
                    {s.latitude.toFixed(1)}°S
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED SITE DOSSIER */}
        <div className="bg-[#0B1120]/80 p-3.5 rounded-2xl border border-slate-800/80 shadow-inner space-y-3">
          
          {/* Site Title & Geographic Coordinates Banner */}
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  {topSite.code} — {topSite.shortName}
                </h3>
              </div>
              {/* Detailed Lunar Coordinates */}
              <div className="text-[11px] font-mono text-cyan-300 mt-1 flex items-center gap-2">
                <span>Lat: <strong>{topSite.latitude.toFixed(2)}°S</strong></span>
                <span>•</span>
                <span>Lon: <strong>{topSite.longitude.toFixed(2)}°E</strong></span>
                <span>•</span>
                <span>Alt: <strong>{topSite.elevationMeters}m</strong></span>
              </div>
            </div>

            <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded-md border shrink-0 ${
              topSite.tier === 'HIGHLY SUITABLE' 
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/50 shadow-glow-purple'
                : topSite.tier === 'SUITABLE'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}>
              {topSite.tier}
            </span>
          </div>

          {/* Real Lunar Reconnaissance Optical Imagery Card */}
          {topSite.thumbnail && (
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-lg">
              <img 
                src={topSite.thumbnail} 
                alt={topSite.name}
                className="w-full h-28 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/30" />
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-slate-300">
                <span className="flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm border border-slate-700/50">
                  <Camera className="w-2.5 h-2.5 text-cyan-400" />
                  <span>NASA LRO Optical Survey</span>
                </span>
                <span className="bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm text-cyan-300 font-bold border border-slate-700/50">
                  {topSite.elevationMeters > 0 ? `+${topSite.elevationMeters}m` : `${topSite.elevationMeters}m`}
                </span>
              </div>
            </div>
          )}

          {/* Big Circular Progress Score Gauge */}
          <div className="flex items-center gap-3.5 bg-[#070B14]/90 p-3 rounded-xl border border-slate-800 overflow-hidden">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 72 72" className="w-16 h-16 -rotate-90 origin-center block">
                <circle
                  cx="36"
                  cy="36"
                  r={gaugeRadius}
                  className="stroke-slate-800"
                  strokeWidth="5.5"
                  fill="transparent"
                />
                <circle
                  cx="36"
                  cy="36"
                  r={gaugeRadius}
                  className="stroke-purple-500 transition-all duration-700"
                  strokeWidth="5.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.6))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black font-mono text-white leading-none">
                  {topSite.suitabilityScore.toFixed(1)}
                </span>
                <span className="text-[8px] font-mono text-slate-400 leading-tight">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">
                Overall AI Suitability
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                AI Confidence: <strong className="text-emerald-400">{topSite.aiConfidence}%</strong>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Traverse to Ice PSR: <strong className="text-cyan-300">{topSite.distanceToPsrMeters}m</strong>
              </div>
            </div>
          </div>

          {/* Key Factor Breakdown Progress Bars */}
          <div className="space-y-2 text-xs font-mono">
            {/* Slope & Terrain */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Mountain className="w-3 h-3 text-emerald-400" /> Terrain Slope Flatness
                </span>
                <span className="font-bold text-white">{topSite.factors.terrain}% ({topSite.slopeDegrees}°)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-glow-emerald"
                  style={{ width: `${topSite.factors.terrain}%` }}
                />
              </div>
            </div>

            {/* Water Ice Volatiles */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3 h-3 text-cyan-400" /> Water Ice Volatiles
                </span>
                <span className="font-bold text-white">{topSite.factors.waterIce}% ({topSite.waterIcePurityPercent}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500 shadow-glow-cyan"
                  style={{ width: `${topSite.factors.waterIce}%` }}
                />
              </div>
            </div>

            {/* Solar Illumination */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3 h-3 text-amber-400" /> Solar Illumination
                </span>
                <span className="font-bold text-white">{topSite.factors.solarIllumination}% ({topSite.illuminationPercent}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500 shadow-glow-amber"
                  style={{ width: `${topSite.factors.solarIllumination}%` }}
                />
              </div>
            </div>

            {/* Radiation Shielding */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Radiation className="w-3 h-3 text-purple-400" /> Radiation Safety
                </span>
                <span className="font-bold text-white">{topSite.factors.radiationSafety}% ({topSite.radiationLevelMsvPerYear} mSv)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full transition-all duration-500 shadow-glow-purple"
                  style={{ width: `${topSite.factors.radiationSafety}%` }}
                />
              </div>
            </div>

            {/* Landing Accessibility */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Rocket className="w-3 h-3 text-sky-400" /> Landing Corridor
                </span>
                <span className="font-bold text-white">{topSite.factors.accessibility}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${topSite.factors.accessibility}%` }}
                />
              </div>
            </div>
          </div>

          {/* WHY THIS SITE? */}
          <div className="bg-[#070B14]/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
              KEY SITE ATTRIBUTES
            </div>
            <ul className="space-y-1 text-[11px]">
              {topSite.whyThisSite && topSite.whyThisSite.slice(0, 4).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-slate-300 leading-tight">
                  {item.type === 'positive' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* ACTION BAR: FULL DOSSIER REPORT & SCIENTIFIC TELEMETRY PAGE */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenDeepDive();
          }}
          className="w-full py-2.5 bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-glow-cyan flex items-center justify-center gap-2 border border-cyan-400/40 cursor-pointer"
        >
          <Rocket className="w-4 h-4 text-cyan-300" />
          <span>Open Full Scientific Telemetry Page ↗</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenReport();
          }}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-glow-purple flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Generate AI Mission Dossier</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default Scoreboard;
