import React, { useState, useMemo } from 'react';
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
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  Cpu,
  Database
} from 'lucide-react';
import { soundManager } from '../utils/audio';

const DEFAULT_SITES = [];
const DEFAULT_WEIGHTS = {};
const NOOP = () => {};


const DEFAULT_WHY_SITE = [
  { text: 'Peak of Eternal Light: high annual solar illumination along ridge', type: 'positive' },
  { text: 'Direct adjacent access to volatile cold trap reserves', type: 'positive' }
];

function getSiteBadge(s) {
  if (!s) return { label: 'Candidate', flag: '🌑', color: 'text-slate-300 bg-slate-900 border-slate-700' };
  const id = s.id?.toLowerCase() || '';
  const name = s.name?.toLowerCase() || '';
  if (id.includes('ch') || id.includes('lupex') || id.includes('jawahar') || id.includes('tiranga') || id.includes('shiv') || name.includes('chandrayaan')) {
    return { label: 'ISRO', flag: '🇮🇳', color: 'text-orange-400 bg-orange-950/60 border-orange-500/40' };
  }
  if (id.includes('apollo') || name.includes('apollo')) {
    return { label: 'Apollo', flag: '🇺🇸', color: 'text-blue-300 bg-blue-950/60 border-blue-500/40' };
  }
  if (id.includes('artemis') || name.includes('artemis')) {
    return { label: 'Artemis', flag: '🇺🇸', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40' };
  }
  if (id.includes('spacex') || name.includes('spacex') || id.includes('viper') || id.includes('im1')) {
    return { label: 'CLPS', flag: '🚀', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' };
  }
  return { label: s.siteType || 'Candidate', flag: '🌑', color: 'text-slate-300 bg-slate-900 border-slate-700' };
}

/**
 * Scoreboard: Panel showing top habitat candidate coordinates, rankings, and AI analysis breakdown
 */
export const Scoreboard = ({
  sites = DEFAULT_SITES,
  selectedSite = null,
  onSelectSite = NOOP,
  onOpenReport = NOOP,
  onOpenDeepDive = NOOP,
  onOpenMissions = NOOP,
  weights = DEFAULT_WEIGHTS
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [evaluationMode, setEvaluationMode] = useState('calibrated'); // 'calibrated' (NASA Ground Truth) | 'ai' (XGBoost ML)

  const topSite = selectedSite || sites[0] || null;

  // Filtered Candidates list computed unconditionally before any early returns (Rules of Hooks)
  const filteredCandidates = useMemo(() => {
    let list = sites;
    if (activeCategoryFilter === 'top5') list = sites.slice(0, 5);
    else if (activeCategoryFilter === 'isro') {
      list = sites.filter(s => {
        const id = s.id?.toLowerCase() || '';
        const name = s.name?.toLowerCase() || '';
        return id.includes('ch') || id.includes('lupex') || id.includes('jawahar') || id.includes('tiranga') || id.includes('shiv') || name.includes('chandrayaan') || name.includes('isro');
      });
    } else if (activeCategoryFilter === 'apollo') {
      list = sites.filter(s => {
        const id = s.id?.toLowerCase() || '';
        const name = s.name?.toLowerCase() || '';
        return id.includes('apollo') || name.includes('apollo');
      });
    } else if (activeCategoryFilter === 'nasa') {
      list = sites.filter(s => {
        const id = s.id?.toLowerCase() || '';
        const name = s.name?.toLowerCase() || '';
        return id.includes('apollo') || id.includes('artemis') || id.includes('shackleton') || id.includes('mouton') || name.includes('artemis') || name.includes('apollo') || name.includes('nasa');
      });
    } else if (activeCategoryFilter === 'southpole') {
      list = sites.filter(s => (s.latitude || 0) < -70);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.code && s.code.toLowerCase().includes(q)) ||
        (s.shortName && s.shortName.toLowerCase().includes(q))
      );
    }

    if (!isExpanded && !searchQuery.trim() && activeCategoryFilter === 'all') {
      return sites.slice(0, 5);
    }

    return list;
  }, [sites, isExpanded, activeCategoryFilter, searchQuery]);

  if (!topSite) {
    return (
      <aside className="w-84 h-full bg-[#070B14]/95 border-l border-slate-800/80 p-4 flex flex-col items-center justify-center text-slate-500 backdrop-blur-xl shrink-0">
        <Sparkles className="w-8 h-8 mb-2 text-slate-600 animate-pulse" />
        <p className="text-xs font-mono text-center">Loading habitat candidate coordinates...</p>
      </aside>
    );
  }

  const isAiMode = evaluationMode === 'ai';

  // Dynamic Score depending on mode
  const displayedScore = isAiMode 
    ? (topSite.ai_suitability_score ?? topSite.suitabilityScore ?? 0)
    : (topSite.original_mcda_score ?? topSite.suitabilityScore ?? 0);

  // Dynamic factors depending on mode
  const activeFactors = isAiMode
    ? (topSite.ai_factors || topSite.factors || {})
    : (topSite.factors || {});

  // Radial progress gauge calculations
  const gaugeRadius = 28;
  const circumference = 2 * Math.PI * gaugeRadius;
  const clampedScore = Math.min(100, Math.max(0, displayedScore));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <aside className="w-84 h-full bg-[#070B14]/95 border-l border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto backdrop-blur-xl z-10 shrink-0 select-none custom-scrollbar animate-smooth-slide-right">
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

          {/* Search Box when Expanded */}
          {isExpanded && (
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search missions (e.g. Apollo, ISRO)..."
                aria-label="Search lunar candidate sites"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 mb-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'top5', label: 'Top 5' },
              { id: 'isro', label: '🇮🇳 ISRO' },
              { id: 'apollo', label: '🇺🇸 Apollo' },
              { id: 'nasa', label: '🚀 Artemis' },
              { id: 'southpole', label: '❄️ South Pole' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategoryFilter(f.id);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategoryFilter === f.id
                    ? 'bg-cyan-600 text-white shadow-glow-cyan'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Top Candidates List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-0.5">
            {filteredCandidates.map((s, index) => {
              const isSelected = s.id === topSite.id;
              const badge = getSiteBadge(s);
              const score = isAiMode 
                ? (s.ai_suitability_score ?? s.suitabilityScore ?? 0)
                : (s.original_mcda_score ?? s.suitabilityScore ?? 0);

              
              return (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectSite(s);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      soundManager.playClick();
                      onSelectSite(s);
                    }
                  }}
                  aria-label={`Select site ${s.shortName || s.name}`}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-between group focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-[#0B1120]/70 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-mono font-bold w-4 text-center ${
                      index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-white truncate">
                          {s.shortName || s.name}
                        </span>
                        <span className={`text-[9px] px-1 rounded border ${badge.color}`}>
                          {badge.flag} {badge.label}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                        <span>Lat: {s.latitude?.toFixed(1)}°</span>
                        <span>Lon: {s.longitude?.toFixed(1)}°</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-cyan-400">
                      {score.toFixed(1)}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400">
                      {s.tier ? s.tier.replace('_', ' ') : 'SUITABLE'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expand/Collapse Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="w-full mt-2 py-1 bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 text-[10px] font-mono rounded-lg border border-slate-800 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Show Top 5 Only</span>
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>View All {sites.length} Analyzed Sites</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {/* SECTION 2: TOP SITE DEEP-DIVE CARD */}
        <div className="bg-[#0B1120]/90 rounded-2xl border border-cyan-500/30 p-3.5 space-y-3 shadow-lg">
          
          {/* Site Header & Rank Badge */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30 font-bold">
                  RANK #1 SELECTED NODE
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {topSite.code}
                </span>
              </div>
              <h3 className="text-sm font-mono font-bold text-white leading-tight">
                {topSite.name}
              </h3>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                {topSite.latitude?.toFixed(3)}°S, {topSite.longitude?.toFixed(3)}°E • Elevation: {topSite.elevationMeters ?? 4120}m
              </p>
            </div>

            {/* Radial Suitability Score Meter */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r={gaugeRadius}
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={gaugeRadius}
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={isAiMode ? "text-purple-400 transition-[stroke-dashoffset] duration-700" : "text-cyan-400 transition-[stroke-dashoffset] duration-700"}
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono font-black text-white leading-none">
                  {displayedScore.toFixed(1)}
                </span>
                <span className="text-[8px] font-mono text-slate-400 leading-none mt-0.5">
                  / 100
                </span>
              </div>
            </div>
          </div>

          {/* AI vs NASA Domain Calibrated Toggle */}
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#050811] rounded-lg border border-slate-800 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setEvaluationMode('calibrated');
              }}
              className={`py-1 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                evaluationMode === 'calibrated'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>NASA MCDA</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setEvaluationMode('ai');
              }}
              className={`py-1 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                evaluationMode === 'ai'
                  ? 'bg-purple-950 text-purple-300 border border-purple-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>XGBoost ML</span>
            </button>
          </div>

          {/* Key Factor Breakdown Progress Bars */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="uppercase tracking-wider font-bold">
                {isAiMode ? 'AI Feature Factors (JSON)' : 'NASA Domain Criteria'}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                isAiMode 
                  ? 'text-purple-300 bg-purple-950/60 border-purple-500/30' 
                  : 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30'
              }`}>
                {isAiMode ? 'XGBoost ML Vector' : 'LRO / M³ Sensors'}
              </span>
            </div>

            {/* Slope & Terrain */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Mountain className="w-3 h-3 text-emerald-400" /> Terrain Slope Flatness
                </span>
                <span className="font-bold text-white">
                  {Math.round(activeFactors.terrain ?? 85)}% ({topSite.slopeDegrees ?? 4.2}°)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-[width] duration-500 shadow-glow-emerald"
                  style={{ width: `${Math.round(activeFactors.terrain ?? 85)}%` }}
                />
              </div>
            </div>

            {/* Water Ice Volatiles */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3 h-3 text-cyan-400" /> Water Ice Volatiles
                </span>
                <span className="font-bold text-white">
                  {Math.round(activeFactors.waterIce ?? 80)}% ({topSite.waterIcePurityPercent ?? 15}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-[width] duration-500 shadow-glow-cyan"
                  style={{ width: `${Math.round(activeFactors.waterIce ?? 80)}%` }}
                />
              </div>
            </div>

            {/* Solar Illumination */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3 h-3 text-amber-400" /> Solar Illumination
                </span>
                <span className="font-bold text-white">
                  {Math.round(activeFactors.solarIllumination ?? 90)}% ({topSite.illuminationPercent ?? 85}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-[width] duration-500 shadow-glow-amber"
                  style={{ width: `${Math.round(activeFactors.solarIllumination ?? 90)}%` }}
                />
              </div>
            </div>

            {/* Radiation Shielding */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Radiation className="w-3 h-3 text-purple-400" /> Radiation Safety
                </span>
                <span className="font-bold text-white">
                  {Math.round(activeFactors.radiationSafety ?? 80)}% ({topSite.radiationLevelMsvPerYear ?? 280} mSv)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full transition-[width] duration-500 shadow-glow-purple"
                  style={{ width: `${Math.round(activeFactors.radiationSafety ?? 80)}%` }}
                />
              </div>
            </div>

            {/* Landing Accessibility */}
            <div>
              <div className="flex justify-between items-center text-slate-300 mb-0.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Rocket className="w-3 h-3 text-sky-400" /> Landing Corridor
                </span>
                <span className="font-bold text-white">
                  {Math.round(activeFactors.accessibility ?? 82)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${Math.round(activeFactors.accessibility ?? 82)}%` }}
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
              {(topSite.whyThisSite || DEFAULT_WHY_SITE).slice(0, 4).map((item) => {
                const isPositive = typeof item === 'string' ? !item.toLowerCase().includes('warning') && !item.toLowerCase().includes('hazard') : item.type === 'positive';
                const text = typeof item === 'string' ? item : item.text || JSON.stringify(item);
                
                return (
                  <li key={typeof item === 'string' ? item : item.text} className="flex items-start gap-1.5 text-slate-300 leading-tight">
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

      {/* ACTION BAR: FULL DOSSIER REPORT & SCIENTIFIC TELEMETRY PAGE */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
        <button
          type="button"
          onClick={() => {
            soundManager.playSelect();
            onOpenDeepDive();
          }}
          className="w-full py-2.5 bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white rounded-xl font-mono text-xs font-bold transition-[background-color,border-color,box-shadow] shadow-glow-cyan flex items-center justify-center gap-2 border border-cyan-400/40 cursor-pointer"
        >
          <Rocket className="w-4 h-4 text-cyan-300" />
          <span>Open Full Scientific Telemetry Page ↗</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playSelect();
            onOpenReport();
          }}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl font-mono text-xs font-bold transition-[background-color,box-shadow] shadow-glow-purple flex items-center justify-center gap-2 cursor-pointer"
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
