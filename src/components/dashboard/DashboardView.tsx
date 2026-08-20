import React, { useState } from 'react';
import { LunarSite, NasaSpaceWeather, NasaApodData } from '../../types/lunar';
import { 
  BarChart3, 
  Sun, 
  Radiation, 
  Wind, 
  Flame, 
  Compass, 
  ShieldAlert, 
  Download, 
  Sparkles, 
  Search,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Satellite,
  Orbit
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface DashboardViewProps {
  sites: LunarSite[];
  selectedSite: LunarSite | null;
  onSelectSite: (site: LunarSite) => void;
  spaceWeather: NasaSpaceWeather;
  apodData: NasaApodData | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  spaceWeather,
  apodData
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [sortField, setSortField] = useState<keyof LunarSite['factors'] | 'suitabilityScore'>('suitabilityScore');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: keyof LunarSite['factors'] | 'suitabilityScore') => {
    soundManager.playClick();
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedSites = [...sites]
    .filter(s => s.name.toLowerCase().includes(searchFilter.toLowerCase()) || s.code.toLowerCase().includes(searchFilter.toLowerCase()))
    .sort((a, b) => {
      let valA = sortField === 'suitabilityScore' ? a.suitabilityScore : a.factors[sortField];
      let valB = sortField === 'suitabilityScore' ? b.suitabilityScore : b.factors[sortField];
      return sortAsc ? valA - valB : valB - valA;
    });

  const exportCSV = () => {
    soundManager.playSelect();
    const headers = ['Code', 'Name', 'Latitude', 'Longitude', 'Overall Score', 'Terrain', 'Water Ice', 'Solar', 'Radiation', 'Accessibility', 'Tier'];
    const rows = sites.map(s => [
      s.code,
      `"${s.name}"`,
      s.latitude,
      s.longitude,
      s.suitabilityScore,
      s.factors.terrain,
      s.factors.waterIce,
      s.factors.solarIllumination,
      s.factors.radiationSafety,
      s.factors.accessibility,
      s.tier
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lunar_habitat_ai_rankings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full bg-[#050811] overflow-y-auto p-6 space-y-6 text-slate-200">
      {/* Top Banner: Mission Status & NASA Space Weather Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solar Wind & Flare */}
        <div className="bg-[#0B1120]/80 border border-slate-800 p-4 rounded-2xl shadow-card backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sun className="w-4 h-4" /> NASA SPACE WEATHER
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[10px] border border-emerald-500/30">
              LIVE DONKI
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white mb-1">
            {spaceWeather.solarFlareLevel}
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Wind Speed: <strong className="text-cyan-300">{spaceWeather.solarWindSpeedKmS} km/s</strong></span>
            <span>Kp: <strong className="text-emerald-400">{spaceWeather.geomagneticIndexKp}</strong></span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Radiation Risk Index */}
        <div className="bg-[#0B1120]/80 border border-slate-800 p-4 rounded-2xl shadow-card backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Radiation className="w-4 h-4" /> GCR RADIATION FLUX
            </span>
            <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 text-[10px] border border-purple-500/30">
              POLAR SHIELD
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-purple-300 mb-1">
            {spaceWeather.radiationFlux} <span className="text-xs text-slate-400 font-normal">pfu (Nominal)</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>CME Event Alert: <strong className={spaceWeather.cmeAlert ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{spaceWeather.cmeAlert ? 'ACTIVE WARNING' : 'CLEAR'}</strong></span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Lunar Polar Environmental Conditions */}
        <div className="bg-[#0B1120]/80 border border-slate-800 p-4 rounded-2xl shadow-card backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Compass className="w-4 h-4" /> LUNAR CONDITIONS
            </span>
            <span className="text-[10px] font-mono text-slate-400">94% Lit Waning</span>
          </div>
          <div className="text-2xl font-black font-mono text-cyan-300 mb-1">
            382,594 <span className="text-xs text-slate-400 font-normal">km (Earth Dist)</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Thermal: <strong className="text-blue-300">-130°C</strong> to <strong className="text-amber-300">+120°C</strong></span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Live Lunar Orbiters Tracking */}
        <div className="bg-[#0B1120]/80 border border-slate-800 p-4 rounded-2xl shadow-card backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Orbit className="w-4 h-4" /> LIVE ORBITERS
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[10px] border border-emerald-500/30">
              3 LIVE • 2 MODELED
            </span>
          </div>
          <div className="text-sm font-bold font-mono text-white mb-1">
            LRO, Chang'e 7, CAPSTONE
          </div>
          <div className="text-xs font-mono text-slate-400">
            Artemis III Target: <strong className="text-cyan-400">South Pole Cluster</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Comparative Analysis & Leaderboard Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Comprehensive Ranked Site Leaderboard */}
        <div className="lg:col-span-2 bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 shadow-card backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                LUNAR HABITAT CANDIDATE LEADERBOARD
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-time multi-criteria weighted scoring across all 24 evaluated regions
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter site..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-44"
                />
              </div>

              {/* CSV Export Button */}
              <button
                onClick={exportCSV}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono transition-colors"
                title="Export Leaderboard to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 select-none">
                  <th className="pb-3 pr-2 cursor-pointer hover:text-white" onClick={() => handleSort('suitabilityScore')}>
                    <span className="flex items-center gap-1">
                      RANK {sortField === 'suitabilityScore' && (sortAsc ? <ChevronUp className="w-3 h-3 text-cyan-400" /> : <ChevronDown className="w-3 h-3 text-cyan-400" />)}
                    </span>
                  </th>
                  <th className="pb-3 px-3">SITE NAME & COORDS</th>
                  <th className="pb-3 px-2 text-right cursor-pointer hover:text-cyan-300" onClick={() => handleSort('suitabilityScore')}>
                    SCORE
                  </th>
                  <th className="pb-3 px-2 text-right cursor-pointer hover:text-cyan-300 hidden sm:table-cell" onClick={() => handleSort('terrain')}>
                    TERRAIN
                  </th>
                  <th className="pb-3 px-2 text-right cursor-pointer hover:text-blue-300 hidden sm:table-cell" onClick={() => handleSort('waterIce')}>
                    ICE
                  </th>
                  <th className="pb-3 px-2 text-right cursor-pointer hover:text-amber-300 hidden sm:table-cell" onClick={() => handleSort('solarIllumination')}>
                    SOLAR
                  </th>
                  <th className="pb-3 px-2 text-right cursor-pointer hover:text-purple-300 hidden md:table-cell" onClick={() => handleSort('radiationSafety')}>
                    RAD SAFE
                  </th>
                  <th className="pb-3 pl-3 text-center">TIER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedSites.map((site, index) => {
                  const isSelected = selectedSite?.id === site.id;
                  return (
                    <tr
                      key={site.id}
                      onClick={() => {
                        soundManager.playSelect();
                        onSelectSite(site);
                      }}
                      className={`hover:bg-cyan-950/20 cursor-pointer transition-colors ${
                        isSelected ? 'bg-purple-950/40 text-purple-200' : ''
                      }`}
                    >
                      <td className="py-2.5 pr-2 font-bold text-slate-400">
                        #{index + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className="text-cyan-400">{site.code}</span>
                          <span>{site.shortName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {site.latitude.toFixed(2)}°, {site.longitude.toFixed(2)}° • {site.elevationMeters}m
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-emerald-400 text-sm">
                        {site.suitabilityScore.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-cyan-300 hidden sm:table-cell">
                        {site.factors.terrain}
                      </td>
                      <td className="py-2.5 px-2 text-right text-blue-300 hidden sm:table-cell">
                        {site.factors.waterIce}
                      </td>
                      <td className="py-2.5 px-2 text-right text-amber-300 hidden sm:table-cell">
                        {site.factors.solarIllumination}
                      </td>
                      <td className="py-2.5 px-2 text-right text-purple-300 hidden md:table-cell">
                        {site.factors.radiationSafety}
                      </td>
                      <td className="py-2.5 pl-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          site.tier === 'HIGHLY SUITABLE'
                            ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                            : site.tier === 'SUITABLE'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        }`}>
                          {site.tier}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Multi-Variable Radar Comparison & NASA APOD */}
        <div className="space-y-6">
          {/* Radar Feature Overview */}
          <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 shadow-card backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              TOP SITES RADAR PROFILE
            </h3>

            {/* Visual Multi-Attribute Comparison of Top 3 Sites */}
            <div className="space-y-3 font-mono text-xs">
              {sites.slice(0, 3).map((site, i) => (
                <div key={site.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-purple-400' : i === 1 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {site.code}: {site.shortName}
                    </span>
                    <span className="text-cyan-400 font-bold">{site.suitabilityScore}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400">
                    <div>Terrain: <strong className="text-slate-200">{site.factors.terrain}</strong></div>
                    <div>Ice Volatiles: <strong className="text-slate-200">{site.factors.waterIce}</strong></div>
                    <div>Solar Illum: <strong className="text-slate-200">{site.factors.solarIllumination}</strong></div>
                    <div>Rad Shield: <strong className="text-slate-200">{site.factors.radiationSafety}</strong></div>
                    <div>Temp Stab: <strong className="text-slate-200">{site.factors.temperature}</strong></div>
                    <div>Access: <strong className="text-slate-200">{site.factors.accessibility}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NASA Planetary Featurette */}
          {apodData && (
            <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-4 shadow-card backdrop-blur-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Satellite className="w-3.5 h-3.5" /> NASA APOD FEATURE
                </span>
                <span>{apodData.date}</span>
              </div>
              <div className="relative h-28 rounded-lg overflow-hidden border border-slate-700/60">
                <img
                  src={apodData.url}
                  alt={apodData.title}
                  className="w-full h-full object-cover filter brightness-90"
                />
              </div>
              <h4 className="text-xs font-bold text-white">{apodData.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                {apodData.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
