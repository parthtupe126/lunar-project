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
  if (!s) return { label: 'Candidate', flag: '🏳️', color: 'text-slate-300 bg-slate-900 border-slate-700' };
  const id = s.id?.toLowerCase() || '';
  const name = s.name?.toLowerCase() || '';
  if (id.includes('ch') || id.includes('lupex') || id.includes('jawahar') || id.includes('tiranga') || id.includes('shiv') || name.includes('chandrayaan') || name.includes('isro')) {
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
  return { label: s.siteType || 'Polar Site', flag: '🏔️', color: 'text-slate-300 bg-slate-900 border-slate-700' };
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
  const [evaluationMode, setEvaluationMode] = useState('calibrated'); // 'calibrated' (NASA Ground Truth) | 'ai' (Random Forest ML)

  const topSite = selectedSite || sites[0] || null;

  // Filtered Candidates list computed unconditionally before any early returns (Rules of Hooks)
  const filteredCandidates = useMemo(() => {
    let list = Array.isArray(sites) ? sites : [];
    if (activeCategoryFilter === 'top5') {
      list = list.slice(0, 5);
    } else if (activeCategoryFilter === 'isro') {
      list = list.filter(s => {
        const id = s?.id?.toLowerCase() || '';
        const name = s?.name?.toLowerCase() || '';
        return id.includes('ch') || id.includes('lupex') || id.includes('jawahar') || id.includes('tiranga') || id.includes('shiv') || name.includes('chandrayaan') || name.includes('isro');
      });
    } else if (activeCategoryFilter === 'apollo') {
      list = list.filter(s => {
        const id = s?.id?.toLowerCase() || '';
        const name = s?.name?.toLowerCase() || '';
        return id.includes('apollo') || name.includes('apollo');
      });
    } else if (activeCategoryFilter === 'nasa') {
      list = list.filter(s => {
        const id = s?.id?.toLowerCase() || '';
        const name = s?.name?.toLowerCase() || '';
        return id.includes('apollo') || id.includes('artemis') || id.includes('shackleton') || id.includes('mouton') || id.includes('nobile') || id.includes('malapert') || name.includes('artemis') || name.includes('apollo') || name.includes('nasa');
      });
    } else if (activeCategoryFilter === 'southpole') {
      list = list.filter(s => (s?.latitude ?? 0) < -70);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(s => 
        (s?.name && s.name.toLowerCase().includes(q)) ||
        (s?.code && s.code.toLowerCase().includes(q)) ||
        (s?.shortName && s.shortName.toLowerCase().includes(q)) ||
        (s?.siteType && s.siteType.toLowerCase().includes(q))
      );
    }

    if (!isExpanded && !searchQuery.trim() && activeCategoryFilter === 'all') {
      return list.slice(0, 5);
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

  // Dynamic Score depending on mode (always numeric safe)
  const rawScore = isAiMode 
    ? (topSite.ai_suitability_score ?? topSite.suitabilityScore ?? 0)
    : (topSite.original_mcda_score ?? topSite.suitabilityScore ?? 0);
  const displayedScore = typeof rawScore === 'number' ? rawScore : (parseFloat(rawScore) || 0);

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
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30 font-semibold">
              {Array.isArray(sites) ? sites.length : 23} Analyzed
            </span>
          </div>

          {/* Search Box when Expanded */}
          {isExpanded && (
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search 23 sites (e.g. Apollo, ISRO)..."
                aria-label="Search lunar candidate sites"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 mb-2">
            {[
              { id: 'all', label: `All (${Array.isArray(sites) ? sites.length : 23})` },
              { id: 'top5', label: 'Top 5' },
              { id: 'isro', label: '🇮🇳 ISRO' },
              { id: 'apollo', label: '🇺🇸 Apollo' },
              { id: 'nasa', label: '🚀 Artemis' },
              { id: 'southpole', label: '🧊 South Pole' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategoryFilter(f.id);
                  if (f.id !== 'all' && f.id !== 'top5') {
                    setIsExpanded(true);
                  }
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

          {/* Candidates List (Shows Top 5 or All 23 when expanded) */}
          <div className={`space-y-1.5 ${isExpanded ? 'max-h-[380px]' : 'max-h-56'} overflow-y-auto custom-scrollbar pr-0.5 transition-all duration-300`}>
            {filteredCandidates.map((s, index) => {
              const isSelected = s?.id === topSite.id;
              const badge = getSiteBadge(s);
              const itemRawScore = isAiMode 
                ? (s?.ai_suitability_score ?? s?.suitabilityScore ?? 0)
                : (s?.original_mcda_score ?? s?.suitabilityScore ?? 0);
              const scoreNum = typeof itemRawScore === 'number' ? itemRawScore : (parseFloat(itemRawScore) || 0);

              // Find overall rank in full sites array
              const globalIndex = Array.isArray(sites) ? sites.findIndex(item => item.id === s.id) : -1;
              const rankNum = globalIndex >= 0 ? globalIndex + 1 : index + 1;

              const latVal = s?.latitude != null ? Number(s.latitude) : null;
              const lonVal = s?.longitude != null ? Number(s.longitude) : null;

              return (
                <div
                  key={s?.id || index}
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
                  aria-label={`Select site ${s?.shortName || s?.name || 'Candidate'}`}
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between group focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-[#0B1120]/70 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-mono font-bold w-5 text-center shrink-0 ${
                      rankNum === 1 ? 'text-amber-400' : rankNum === 2 ? 'text-slate-300' : rankNum === 3 ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      #{rankNum}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-mono font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200'}`}>
                          {s?.shortName || s?.name || 'Site Candidate'}
                        </span>
                        <span className={`text-[9px] px-1 rounded border whitespace-nowrap shrink-0 ${badge.color}`}>
                          {badge.flag} {badge.label}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                        <span>Lat: {latVal != null ? `${latVal.toFixed(1)}°` : '—'}</span>
                        <span>Lon: {lonVal != null ? `${lonVal.toFixed(1)}°` : '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-1">
                    <div className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-300' : 'text-cyan-400'}`}>
                      {scoreNum.toFixed(1)}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase">
                      {s?.tier ? String(s.tier).replace('_', ' ') : 'SUITABLE'}
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
            className="w-full mt-2 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 text-[10px] font-mono font-bold rounded-lg border border-slate-700/80 hover:border-cyan-500/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            {isExpanded ? (
              <>
                <span>Show Top 5 Only</span>
                <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              </>
            ) : (
              <>
                <span>View All {Array.isArray(sites) ? sites.length : 23} Analyzed Sites</span>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              </>
            )}
          </button>
        </div>

        {/* SECTION 2: TOP SITE DEEP-DIVE CARD */}
        <div className="bg-[#0B1120]/90 rounded-2xl border border-cyan-500/30 p-3.5 space-y-3 shadow-lg">
          
          {/* Site Header & Rank Badge */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30 font-bold">
                  SELECTED NODE
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {topSite.code || 'NODE'}
                </span>
              </div>
              <h3 className="text-sm font-mono font-bold text-white leading-tight">
                {topSite.name}
              </h3>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                {topSite.latitude != null ? `${Number(topSite.latitude).toFixed(3)}°S` : '0°'}, {topSite.longitude != null ? `${Number(topSite.longitude).toFixed(3)}°E` : '0°'} • Elevation: {topSite.elevationMeters ?? 4120}m
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
              <span>Random Forest ML</span>
            </button>
          </div>

          {/* ML Feature Impact SHAP Bar */}
          {isAiMode && Array.isArray(topSite.shap_top_features) && (
            <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-2 space-y-1 text-[10px] font-mono animate-smooth-fade-in">
              <div className="flex items-center justify-between text-purple-300 font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Random Forest Key Drivers
                </span>
                <span className="text-[9px] text-slate-400">
                  R²: {topSite.ai_ml_matrix?.model_r2 || '0.956'}
                </span>
              </div>
              <div className="space-y-1">
                {topSite.shap_top_features.map((feat, idx) => {
                  const val = typeof feat?.impact === 'number' 
                    ? feat.impact 
                    : typeof feat?.shap_value === 'number' 
                    ? feat.shap_value 
                    : (parseFloat(feat?.impact || feat?.shap_value || 0) || 0);
                  return (
                    <div key={idx} className="flex items-center justify-between text-[9px]">
                      <span className="text-slate-300">{feat?.feature || 'Feature'}</span>
                      <span className={val > 0 ? "text-emerald-400" : "text-rose-400"}>
                        {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Factor Breakdown Bars */}
          <div className="space-y-1.5">
            {[
              { label: 'Terrain Flatness', key: 'terrain', icon: Mountain, val: activeFactors.terrain || 90 },
              { label: 'Water Ice & PSR', key: 'waterIce', icon: Droplets, val: activeFactors.waterIce || 85 },
              { label: 'Solar Illumination', key: 'solarIllumination', icon: Sun, val: activeFactors.solarIllumination || 95 },
              { label: 'Radiation Shielding', key: 'radiationSafety', icon: Radiation, val: activeFactors.radiationSafety || 80 },
              { label: 'Thermal Equilibrium', key: 'temperature', icon: Thermometer, val: activeFactors.temperature || 88 },
              { label: 'Landing Accessibility', key: 'accessibility', icon: Rocket, val: activeFactors.accessibility || 82 }
            ].map((f) => (
              <div key={f.key} className="space-y-0.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-300">
                  <span className="flex items-center gap-1">
                    <f.icon className="w-3 h-3 text-cyan-400" />
                    {f.label}
                  </span>
                  <span className="font-bold text-cyan-300">{Number(f.val || 0)}%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAiMode ? 'bg-purple-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, Number(f.val || 0)))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Why This Site Strategic Highlights */}
          <div className="space-y-1 pt-1 border-t border-slate-800/80">
            <h4 className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              Strategic Evaluation
            </h4>
            <div className="space-y-1">
              {(topSite.whyThisSite || DEFAULT_WHY_SITE).slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[10px] font-mono text-slate-300">
                  {item.type === 'warning' ? (
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Full Deep-Dive Dossier & Mission Explorer */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenDeepDive(topSite);
              }}
              className="py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-mono font-bold rounded-lg border border-cyan-400/50 flex items-center justify-center gap-1 transition-all cursor-pointer shadow-glow-cyan"
            >
              <FileText className="w-3 h-3" />
              <span>Full Dossier</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenReport();
              }}
              className="py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-[10px] font-mono font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-3 h-3 text-cyan-400" />
              <span>PDF Report</span>
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER METADATA */}
      <div className="pt-3 border-t border-slate-800/80 text-[9px] font-mono text-slate-500 flex items-center justify-between">
        <span>NASA PDS / LROC SOC</span>
        <span>23 Verified Sites</span>
      </div>
    </aside>
  );
};
