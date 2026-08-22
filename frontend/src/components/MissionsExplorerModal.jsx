import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Rocket, 
  Globe, 
  MapPin, 
  Calendar, 
  Crosshair, 
  Sparkles, 
  Compass, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { LUNAR_MISSIONS } from '../data/lunarSites';
import { soundManager } from '../utils/audio';

const MISSION_SECTIONS = [
  {
    id: 'isro',
    title: '🇮🇳 ISRO — CHANDRAYAAN PROGRAMME (4 MISSIONS)',
    agency: 'ISRO',
    theme: 'orange',
    filterTag: 'isro',
    missions: ['ch1_jawahar', 'ch2_tiranga', 'ch3_shiv_shakti', 'lupex_ch4']
  },
  {
    id: 'nasa_apollo',
    title: '🇺🇸 NASA — APOLLO CREWED LANDINGS (6 SITES)',
    agency: 'NASA',
    theme: 'cyan',
    filterTag: 'nasa',
    missions: ['apollo_11', 'apollo_12', 'apollo_14', 'apollo_15', 'apollo_16', 'apollo_17']
  },
  {
    id: 'nasa_artemis_lro',
    title: '🇺🇸 NASA — ARTEMIS & SOUTH POLE TARGETS (8 SITES)',
    agency: 'NASA',
    theme: 'cyan',
    filterTag: 'nasa',
    missions: ['artemis_3', 'shackleton_rim', 'connecting_ridge', 'de_gerlache_rim1', 'de_gerlache_rim2', 'haworth_plateau', 'malapert_mountain', 'amundsen_rim']
  },
  {
    id: 'spacex_clps',
    title: '🚀 SPACEX / NASA CLPS COMMERCIAL MISSIONS (5 MISSIONS)',
    agency: 'SpaceX / CLPS',
    theme: 'emerald',
    filterTag: 'spacex',
    missions: ['im1_odysseus', 'viper_griffin', 'clps_starship', 'im2_athena', 'firefly_blue_ghost']
  },
  {
    id: 'sides_poles',
    title: '🟣 HEMISPHERES & POLAR EXPLORATION AXES (4 AXES)',
    agency: 'Global Perspective',
    theme: 'purple',
    filterTag: 'sides',
    missions: ['near_side', 'far_side', 'south_pole', 'north_pole']
  }
];

function getThemeStyles(theme) {
  switch (theme) {
    case 'orange':
      return {
        badge: 'bg-orange-950/80 text-orange-400 border-orange-500/40',
        countryBadge: 'text-orange-300 font-bold',
        header: 'text-orange-400 border-orange-500/30 bg-orange-950/20',
        card: 'border-orange-500/20 hover:border-orange-500/60 shadow-glow-orange/10',
        button: 'bg-orange-600/90 hover:bg-orange-500 text-white border-orange-400/40 shadow-glow-orange',
        coord: 'text-orange-300'
      };
    case 'emerald':
      return {
        badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
        countryBadge: 'text-emerald-300 font-bold',
        header: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
        card: 'border-emerald-500/20 hover:border-emerald-500/60 shadow-glow-emerald/10',
        button: 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400/40 shadow-glow-emerald',
        coord: 'text-emerald-300'
      };
    case 'purple':
      return {
        badge: 'bg-purple-950/80 text-purple-400 border-purple-500/40',
        countryBadge: 'text-purple-300 font-bold',
        header: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
        card: 'border-purple-500/20 hover:border-purple-500/60 shadow-glow-purple/10',
        button: 'bg-purple-600/90 hover:bg-purple-500 text-white border-purple-400/40 shadow-glow-purple',
        coord: 'text-purple-300'
      };
    case 'cyan':
    default:
      return {
        badge: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40',
        countryBadge: 'text-cyan-300 font-bold',
        header: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
        card: 'border-cyan-500/20 hover:border-cyan-500/60 shadow-glow-cyan/10',
        button: 'bg-cyan-600/90 hover:bg-cyan-500 text-white border-cyan-400/40 shadow-glow-cyan',
        coord: 'text-cyan-300'
      };
  }
}

function getCountryCode(countryStr, agency) {
  if (agency?.includes('ISRO') || countryStr?.includes('India')) return 'IN';
  if (agency?.includes('NASA') || countryStr?.includes('USA')) return 'US';
  if (agency?.includes('SpaceX') || countryStr?.includes('SpaceX')) return 'US';
  if (agency?.includes('JAXA') || countryStr?.includes('Japan')) return 'JP';
  if (countryStr?.includes('0°')) return '🌐 0°';
  if (countryStr?.includes('180°')) return '🌐 180°';
  if (countryStr?.includes('-90°')) return '❄️ -90°';
  if (countryStr?.includes('+90°')) return '❄️ +90°';
  return 'INTL';
}

export const MissionsExplorerModal = ({
  isOpen = false,
  onClose = () => {},
  onFlyToMission = () => {},
  initialCategory = 'all'
}) => {
  const [selectedFilter, setSelectedFilter] = useState(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync category when opening with a specific filter
  React.useEffect(() => {
    if (isOpen) {
      setSelectedFilter(initialCategory || 'all');
    }
  }, [initialCategory, isOpen]);

  // Primary 23 missions count (excluding sides)
  const primaryMissions = useMemo(() => {
    return LUNAR_MISSIONS.filter(m => m.category !== 'sides');
  }, []);

  // Map of mission by ID
  const missionsMap = useMemo(() => {
    const map = {};
    LUNAR_MISSIONS.forEach(m => {
      map[m.id] = m;
    });
    return map;
  }, []);

  // Filtered Sections
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return MISSION_SECTIONS.flatMap(section => {
      // Check category filter
      if (selectedFilter !== 'all' && section.filterTag !== selectedFilter && section.id !== selectedFilter) {
        return [];
      }

      // Gather mission objects
      let missions = section.missions.flatMap(id => missionsMap[id] ? [missionsMap[id]] : []);

      // Search filter
      if (q) {
        missions = missions.filter(m => 
          m.name.toLowerCase().includes(q) ||
          m.craft?.toLowerCase().includes(q) ||
          m.site?.toLowerCase().includes(q) ||
          m.discovery?.toLowerCase().includes(q) ||
          m.agency?.toLowerCase().includes(q) ||
          m.status?.toLowerCase().includes(q)
        );
      }

      if (missions.length === 0) return [];

      return [{
        ...section,
        missions
      }];
    });
  }, [selectedFilter, searchQuery, missionsMap]);

  if (!isOpen) return null;

  const isroCount = LUNAR_MISSIONS.filter(m => m.category === 'isro').length;
  const nasaCount = LUNAR_MISSIONS.filter(m => m.category === 'nasa' || m.category === 'apollo' || m.category === 'artemis').length;
  const spacexCount = LUNAR_MISSIONS.filter(m => m.category === 'spacex' || m.category === 'clps').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-200">
      <div className="bg-[#070B14] border border-slate-700/80 w-full max-w-7xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-mono">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0B1120]/90 backdrop-blur-xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-glow-cyan">
              <Rocket className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  LUNAR MISSIONS DIRECTORY & HISTORIC LANDMARKS
                </h2>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {primaryMissions.length} MISSIONS & CANDIDATES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans hidden sm:block">
                Comprehensive directory of 23 ISRO, NASA Apollo, Artemis, and SpaceX CLPS Exploration Targets
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            aria-label="Close missions catalogue modal"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 bg-[#0A0F1D]/90 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedFilter === 'all' 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Programmes ({primaryMissions.length})
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter('isro');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedFilter === 'isro' 
                  ? 'bg-orange-600 text-white shadow-glow-orange' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-orange-400 border border-slate-800'
              }`}
            >
              <span>🇮🇳 ISRO ({isroCount})</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter('nasa');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedFilter === 'nasa' 
                  ? 'bg-blue-600 text-white shadow-glow-cyan' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-blue-400 border border-slate-800'
              }`}
            >
              <span>🇺🇸 NASA ({nasaCount})</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter('spacex');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedFilter === 'spacex' 
                  ? 'bg-emerald-600 text-white shadow-glow-emerald' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-emerald-400 border border-slate-800'
              }`}
            >
              <span>🚀 SpaceX / CLPS ({spacexCount})</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter('sides');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedFilter === 'sides' 
                  ? 'bg-purple-600 text-white shadow-glow-purple' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-purple-400 border border-slate-800'
              }`}
            >
              <span>🟣 Hemispheres & Poles (4)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search missions, craft, sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070B14] border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {filteredSections.map(section => {
            const styles = getThemeStyles(section.theme);

            return (
              <div key={section.id} className="space-y-3">
                {/* Section Header */}
                <div className={`flex items-center justify-between p-2.5 rounded-xl border ${styles.header}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold tracking-wide">
                      {section.title}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${styles.badge}`}>
                    {section.missions.length} LOCATIONS
                  </span>
                </div>

                {/* Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.missions.map(mission => (
                    <div
                      key={mission.id}
                      className={`bg-[#0B1120]/80 rounded-xl border p-3.5 flex flex-col justify-between space-y-3 transition-all hover:-translate-y-0.5 ${styles.card}`}
                    >
                      {/* Top Bar */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                              {mission.agency}
                            </span>
                            <h3 className="text-sm font-bold text-white leading-tight mt-0.5 truncate" title={mission.name}>
                              {mission.name}
                            </h3>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap shrink-0 ${styles.badge}`}>
                            {getCountryCode(mission.country, mission.agency)}
                          </span>
                        </div>

                        {/* Telemetry info */}
                        <div className="mt-2.5 space-y-1 text-[11px] text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className={`font-mono font-bold ${styles.coord}`}>
                              {mission.lat > 0 ? `+${mission.lat.toFixed(2)}` : mission.lat.toFixed(2)}°, {mission.lon > 0 ? `+${mission.lon.toFixed(2)}` : mission.lon.toFixed(2)}°
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{mission.date}</span>
                          </div>
                        </div>

                        {/* Craft & Discovery */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] space-y-1.5">
                          <div>
                            <span className="text-slate-400 font-bold">Target Zone:</span>
                            <p className="text-slate-300 leading-snug">{mission.site}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold">Discovery / Role:</span>
                            <p className="text-slate-400 leading-snug line-clamp-3" title={mission.discovery}>
                              {mission.discovery}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playSelect();
                          onFlyToMission(mission);
                        }}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${styles.button}`}
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Navigate 3D Globe</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
              <p className="text-xs">No missions found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0B1120]/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NASA PDS / ISRO SAC / LROC Unified Dataset</span>
          </div>
          <span>Select any mission to focus the 3D Moon Surface Engine</span>
        </div>

      </div>
    </div>
  );
};
