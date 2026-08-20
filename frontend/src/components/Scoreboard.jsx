import React from 'react';
import { 
  Trophy, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Mountain, 
  Droplets, 
  Sun, 
  ShieldCheck, 
  Rocket, 
  FileText,
  Camera,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

/**
 * Scoreboard: Human-crafted sidebar showing candidate rankings, orbital telemetry, and site breakdowns
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
      <aside className="w-84 h-full bg-[#0a0d14]/95 border-l border-slate-800/60 p-4 flex flex-col items-center justify-center text-slate-500 backdrop-blur-md shrink-0">
        <p className="text-xs font-mono text-center">Loading site coordinates...</p>
      </aside>
    );
  }

  // Radial progress gauge calculations
  const gaugeRadius = 26;
  const circumference = 2 * Math.PI * gaugeRadius;
  const clampedScore = Math.min(100, Math.max(0, topSite.suitabilityScore || 0));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <aside className="w-84 h-full bg-[#0a0d14]/95 border-l border-slate-800/60 p-4 flex flex-col justify-between overflow-y-auto backdrop-blur-md z-10 shrink-0 select-none custom-scrollbar">
      <div className="space-y-4">
        
        {/* SCOREBOARD HEADER & TOP CANDIDATES */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <h2 className="text-xs font-semibold tracking-wide text-slate-200 uppercase font-sans">
                Candidate Ranking
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {sites.length} Evaluated
            </span>
          </div>

          {/* Top Candidates Ranked List */}
          <div className="space-y-1.5 mb-3">
            {sites.slice(0, 3).map((s, idx) => {
              const isSelected = topSite.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    soundManager.playSelect();
                    onSelectSite(s);
                  }}
                  className={`w-full p-2 rounded-lg border text-left transition-colors flex items-center justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500/60 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-xs text-white truncate">
                        {s.code || s.shortName}
                      </span>
                    </div>
                    <div className="text-[11px] text-sky-400 font-mono font-medium mt-0.5">
                      {s.suitabilityScore.toFixed(1)}% Suitability
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-14 h-9 rounded-md overflow-hidden border border-slate-700/60 shrink-0 bg-black">
                    <img 
                      src={s.surfaceImageUrl || s.thumbnail} 
                      alt={s.code}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED SITE DOSSIER */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-3">
          
          {/* Site Title & Geographic Coordinates Banner */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <h3 className="text-sm font-semibold text-white">
                  {topSite.code} — {topSite.shortName}
                </h3>
              </div>
              {/* Detailed Lunar Coordinates */}
              <div className="text-[11px] font-mono text-slate-300 mt-1 flex items-center gap-1.5">
                <span>{topSite.latitude.toFixed(2)}°S</span>
                <span className="text-slate-600">•</span>
                <span>{topSite.longitude.toFixed(2)}°E</span>
                <span className="text-slate-600">•</span>
                <span>{topSite.elevationMeters}m</span>
              </div>
            </div>

            <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border shrink-0 ${
              topSite.tier === 'HIGHLY SUITABLE' 
                ? 'bg-blue-950/80 text-blue-300 border-blue-600/50'
                : topSite.tier === 'SUITABLE'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                : 'bg-amber-950/80 text-amber-300 border-amber-600/50'
            }`}>
              {topSite.tier}
            </span>
          </div>

          {/* Optical Photography Card */}
          {topSite.thumbnail && (
            <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
              <img 
                src={topSite.thumbnail} 
                alt={topSite.name}
                className="w-full h-26 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-slate-300">
                <span className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-slate-700/40">
                  <Camera className="w-2.5 h-2.5 text-sky-400" />
                  <span>NASA LRO Imagery</span>
                </span>
                <span className="bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm text-slate-200 font-mono border border-slate-700/40">
                  {topSite.elevationMeters > 0 ? `+${topSite.elevationMeters}m` : `${topSite.elevationMeters}m`}
                </span>
              </div>
            </div>
          )}

          {/* Score Gauge Card */}
          <div className="flex items-center gap-3 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 64 64" className="w-14 h-14 -rotate-90 origin-center block">
                <circle
                  cx="32"
                  cy="32"
                  r={gaugeRadius}
                  className="stroke-slate-800"
                  strokeWidth="4.5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={gaugeRadius}
                  className="stroke-blue-500 transition-all duration-700"
                  strokeWidth="4.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-bold font-mono text-white leading-none">
                  {topSite.suitabilityScore.toFixed(1)}
                </span>
                <span className="text-[8px] font-mono text-slate-400">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-medium text-slate-200 truncate">
                MCDA Suitability Score
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Model Confidence: <span className="text-emerald-400 font-semibold">{topSite.aiConfidence}%</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Distance to PSR: <span className="text-sky-300">{topSite.distanceToPsrMeters}m</span>
              </div>
            </div>
          </div>

          {/* Key Factor Breakdown Progress Bars */}
          <div className="space-y-2 text-xs">
            {/* Slope & Terrain */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-1 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Mountain className="w-3 h-3 text-emerald-400" /> Flatness
                </span>
                <span className="font-mono text-slate-200">{(topSite.factors?.terrain ?? 85)}% ({topSite.slopeDegrees ?? 4.2}°)</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${topSite.factors?.terrain ?? 85}%` }}
                />
              </div>
            </div>

            {/* Water Ice Volatiles */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-1 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3 h-3 text-sky-400" /> Water Ice
                </span>
                <span className="font-mono text-slate-200">{(topSite.factors?.waterIce ?? 80)}% ({topSite.waterIcePurityPercent ?? 15}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${topSite.factors?.waterIce ?? 80}%` }}
                />
              </div>
            </div>

            {/* Solar Illumination */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-1 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3 h-3 text-amber-400" /> Solar Light
                </span>
                <span className="font-mono text-slate-200">{(topSite.factors?.solarIllumination ?? 90)}% ({topSite.illuminationPercent ?? 85}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${topSite.factors?.solarIllumination ?? 90}%` }}
                />
              </div>
            </div>

            {/* Radiation Shielding */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-1 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" /> Radiation Safety
                </span>
                <span className="font-mono text-slate-200">{(topSite.factors?.radiationSafety ?? 80)}% ({topSite.radiationLevelMsvPerYear ?? 280} mSv)</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${topSite.factors?.radiationSafety ?? 80}%` }}
                />
              </div>
            </div>
          </div>

          {/* Key Attributes */}
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 tracking-wider">
              Site Observations
            </div>
            <ul className="space-y-1 text-[11px]">
              {(topSite.whyThisSite || [
                { text: 'Peak of Light: continuous annual solar exposure', type: 'positive' },
                { text: 'Adjacent traverse access to volatile cold trap reserves', type: 'positive' }
              ]).slice(0, 3).map((item, idx) => {
                const isPositive = typeof item === 'string' ? !item.toLowerCase().includes('warning') && !item.toLowerCase().includes('hazard') : item.type === 'positive';
                const text = typeof item === 'string' ? item : item.text || JSON.stringify(item);
                return (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-300 leading-tight">
                    {isPositive ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

      </div>

      {/* ACTION BAR */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenDeepDive();
          }}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
          <span>Detailed Site Analysis</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenReport();
          }}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Export Mission Dossier</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default Scoreboard;

