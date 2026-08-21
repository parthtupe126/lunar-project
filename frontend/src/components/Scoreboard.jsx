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

/**
 * Scoreboard: Panel showing top habitat candidate coordinates, rankings, and AI analysis breakdown
 */
export const Scoreboard = ({
  sites = [],
  selectedSite = null,
  onSelectSite = () => {},
  onOpenReport = () => {},
  onOpenDeepDive = () => {},
  onOpenMissions = () => {},
  weights = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [evaluationMode, setEvaluationMode] = useState('calibrated'); // 'calibrated' (NASA Ground Truth) | 'ai' (XGBoost ML)

  const topSite = selectedSite || sites[0] || null;

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

  const getSiteBadge = (s) => {
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
  };

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}

          {/* Expanded Category Filter Pills */}
          {isExpanded && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2 no-scrollbar">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategoryFilter('all');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                  activeCategoryFilter === 'all'
                    ? 'bg-cyan-600 text-white shadow-glow-cyan'
                    : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All ({sites.length})
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategoryFilter('isro');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                  activeCategoryFilter === 'isro'
                    ? 'bg-orange-600 text-white shadow-glow-orange'
                    : 'bg-[#0B1120] text-slate-400 hover:text-orange-400 border border-slate-800'
                }`}
              >
                🇮🇳 ISRO (4)
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategoryFilter('nasa');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                  activeCategoryFilter === 'nasa'
                    ? 'bg-blue-600 text-white shadow-glow-cyan'
                    : 'bg-[#0B1120] text-slate-400 hover:text-blue-400 border border-slate-800'
                }`}
              >
                🇺🇸 NASA (10)
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategoryFilter('apollo');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                  activeCategoryFilter === 'apollo'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#0B1120] text-slate-400 hover:text-indigo-400 border border-slate-800'
                }`}
              >
                Apollo (6)
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategoryFilter('southpole');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                  activeCategoryFilter === 'southpole'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-[#0B1120] text-slate-400 hover:text-purple-400 border border-slate-800'
                }`}
              >
                🌑 South Pole
              </button>
            </div>
          )}

          {/* Top Candidates Ranked List with Image Previews */}
          <div className={`space-y-1.5 mb-2 ${isExpanded ? 'max-h-[30rem] overflow-y-auto pr-1 custom-scrollbar' : ''}`}>
            {filteredCandidates.map((s) => {
              const originalIndex = sites.findIndex(item => item.id === s.id);
              const rankNum = originalIndex >= 0 ? originalIndex + 1 : 1;
              const isSelected = topSite.id === s.id;
              const badge = getSiteBadge(s);

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    soundManager.playSelect();
                    onSelectSite(s);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/50 border-purple-500/90 shadow-glow-purple ring-1 ring-purple-500/40'
                      : 'bg-[#0B1120] border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        Site #{rankNum}
                      </span>
                      {rankNum <= 3 && (
                        <span className="text-[9px] px-1 rounded bg-amber-950/70 text-amber-300 border border-amber-500/40 font-mono font-bold">
                          {rankNum === 1 ? '🥇 TOP' : rankNum === 2 ? '🥈' : '🥉'}
                        </span>
                      )}
                      <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border ${badge.color}`}>
                        {badge.flag} {badge.label}
                      </span>
                    </div>

                    <div className="font-mono font-bold text-xs text-white truncate" title={s.name}>
                      {s.name || s.code || s.shortName}
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px] mt-1">
                      <span className="text-cyan-300 font-bold bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30">
                        {s.suitabilityScore.toFixed(1)}%
                      </span>
                      <span className="text-slate-500">
                        {s.latitude?.toFixed(1)}°, {s.longitude?.toFixed(1)}°
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-700/80 shrink-0 bg-black shadow-md relative group">
                    <img 
                      src={s.surfaceImageUrl || s.thumbnail} 
                      alt={s.code}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Show More / Show Less Toggle Button */}
          {sites.length > 5 && (
            <button
              onClick={() => {
                soundManager.playClick();
                setIsExpanded(!isExpanded);
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 hover:from-cyan-900/80 hover:to-purple-900/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {isExpanded ? (
                <>
                  <span>Show Top 5 Only</span>
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                </>
              ) : (
                <>
                  <span>Show All 23 Candidate Missions ({sites.length - 5} More)</span>
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                </>
              )}
            </button>
          )}

          {/* Quick Launch Full Directory Modal */}
          {isExpanded && (
            <button
              onClick={() => {
                soundManager.playSelect();
                onOpenMissions();
              }}
              className="w-full mt-2 py-1.5 px-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 hover:text-white text-[11px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Rocket className="w-3.5 h-3.5 text-orange-400" />
              <span>Open 23 Missions Catalogue Modal ↗</span>
            </button>
          )}
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

          {/* Toggle Switch: NASA Calibrated vs AI Model Predictions */}
          <div className="bg-[#070B14] p-1 rounded-xl border border-slate-800 flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setEvaluationMode('calibrated');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                !isAiMode
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Database className="w-3 h-3 text-cyan-300" />
              <span>NASA Calibrated</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setEvaluationMode('ai');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                isAiMode
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Cpu className="w-3 h-3 text-purple-300" />
              <span>AI Pred (JSON)</span>
            </button>
          </div>

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
                  className={`${isAiMode ? 'stroke-purple-500' : 'stroke-cyan-400'} transition-all duration-700`}
                  strokeWidth="5.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ filter: isAiMode ? 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.6))' : 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.6))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black font-mono text-white leading-none">
                  {displayedScore.toFixed(1)}
                </span>
                <span className="text-[8px] font-mono text-slate-400 leading-tight">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {isAiMode ? 'Overall AI Suitability' : 'NASA MCDA Suitability'}
                </span>
                <span className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold border ${
                  isAiMode 
                    ? 'bg-purple-950/70 text-purple-300 border-purple-500/40' 
                    : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40'
                }`}>
                  {isAiMode ? 'AI' : 'MCDA'}
                </span>
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
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-glow-emerald"
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
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500 shadow-glow-cyan"
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
                  className="bg-amber-400 h-full rounded-full transition-all duration-500 shadow-glow-amber"
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
                  className="bg-purple-400 h-full rounded-full transition-all duration-500 shadow-glow-purple"
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
                  className="bg-sky-400 h-full rounded-full transition-all duration-500"
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
              {(topSite.whyThisSite || [
                { text: 'Peak of Eternal Light: high annual solar illumination along ridge', type: 'positive' },
                { text: 'Direct adjacent access to volatile cold trap reserves', type: 'positive' }
              ]).slice(0, 4).map((item, idx) => {
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
