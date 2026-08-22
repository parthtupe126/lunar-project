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
    title: '🇮🇳 ISRO — CHANDRAYAAN PROGRAMME',
    agency: 'ISRO',
    theme: 'orange',
    filterTag: 'isro',
    missions: ['ch1_jawahar', 'ch2_tiranga', 'ch3_shiv_shakti', 'lupex_ch4']
  },
  {
    id: 'nasa_apollo',
    title: '🇺🇸 NASA — APOLLO PROGRAMME (HUMAN LUNAR EXPEDITIONS)',
    agency: 'NASA',
    theme: 'cyan',
    filterTag: 'nasa',
    missions: ['apollo_11', 'apollo_12', 'apollo_14', 'apollo_15', 'apollo_16', 'apollo_17']
  },
  {
    id: 'nasa_artemis_lro',
    title: '🇺🇸 NASA — ARTEMIS, LCROSS & LRO SCIENTIFIC SURVEYS',
    agency: 'NASA',
    theme: 'cyan',
    filterTag: 'nasa',
    missions: ['artemis_3', 'lcross_cabeus', 'copernicus_crater', 'tycho_crater']
  },
  {
    id: 'spacex_clps',
    title: '🚀 SPACEX / CLPS & COMMERCIAL LUNAR MISSIONS',
    agency: 'SpaceX / Commercial',
    theme: 'emerald',
    filterTag: 'spacex',
    missions: ['im1_odysseus', 'im2_athena', 'viper_griffin', 'firefly_blue_ghost', 'hakuto_r']
  },
  {
    id: 'sides_poles',
    title: '🌑 HEMISPHERES & POLAR EXPLORATION AXES',
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
  if (agency?.includes('NASA') || countryStr?.includes('United States')) return 'US';
  if (agency?.includes('SpaceX') || countryStr?.includes('SpaceX')) return 'US';
  if (agency?.includes('ispace') || countryStr?.includes('Japan')) return 'JP';
  if (countryStr?.includes('0°')) return '🌍 0°';
  if (countryStr?.includes('180°')) return '🌑 180°';
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

      // Gather mission objects with flatMap (no chained map/filter)
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
                  {LUNAR_MISSIONS.length} MISSIONS & SITES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans hidden sm:block">
                Comprehensive structured catalogue of ISRO, NASA Apollo, Artemis, SpaceX CLPS & Polar Coordinates
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedFilter === 'all' 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Programmes ({LUNAR_MISSIONS.length})
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter('isro');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === 'isro' 
                  ? 'bg-orange-600 text-white shadow-glow-orange' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-orange-400 border border-slate-800'
              }`}
            >
              <span>🇮🇳 ISRO ({LUNAR_MISSIONS.filter(m => m.category === 'isro').length})</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter('nasa');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === 'nasa' 
                  ? 'bg-blue-600 text-white shadow-glow-cyan' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-blue-400 border border-slate-800'
              }`}
            >
              <span>🇺🇸 NASA ({LUNAR_MISSIONS.filter(m => m.category === 'nasa').length})</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter('spacex');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === 'spacex' 
                  ? 'bg-emerald-600 text-white shadow-glow-emerald' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-emerald-400 border border-slate-800'
              }`}
            >
              <span>🚀 SpaceX / CLPS ({LUNAR_MISSIONS.filter(m => m.category === 'spacex').length})</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter('sides');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === 'sides' 
                  ? 'bg-purple-600 text-white shadow-glow-purple' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-purple-400 border border-slate-800'
              }`}
            >
              <span>🌑 Hemispheres & Poles (4)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Missions Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 custom-scrollbar">
          {filteredSections.length === 0 ? (
            <div className="text-center py-16">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
              <p className="text-sm text-slate-400">No lunar missions matched your search criteria.</p>
              <button
                onClick={() => {
                  setSelectedFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-1.5 rounded-xl bg-slate-800 text-cyan-300 text-xs hover:bg-slate-700 transition-colors"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            filteredSections.map(section => {
              const theme = getThemeStyles(section.theme);

              return (
                <div key={section.id} className="space-y-3.5">
                  {/* Section Title Header Bar */}
                  <div className={`px-4 py-2 rounded-xl border flex items-center justify-between ${theme.header}`}>
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm tracking-wide">
                      <span>{section.title}</span>
                      <span className="text-[11px] opacity-80">({section.missions.length})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                      Click "Fly To Landing Site" to inspect in 3D orbit
                    </span>
                  </div>

                  {/* 3-Column Structured Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.missions.map(mission => {
                      const countryCode = getCountryCode(mission.country, mission.agency);

                      return (
                        <div
                          key={mission.id}
                          className={`bg-[#0A0F1D]/90 backdrop-blur-md rounded-2xl border p-4 flex flex-col justify-between transition-colors duration-200 hover:-translate-y-0.5 ${theme.card}`}
                        >
                          {/* Card Top: Agency Tag + Country Code + Status */}
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${theme.badge}`}>
                                  {mission.agency}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  • {mission.status}
                                </span>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 ${theme.countryBadge}`}>
                                {countryCode}
                              </span>
                            </div>

                            {/* Mission Title */}
                            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                              <span>{mission.name}</span>
                            </h3>

                            {/* Structured Parameters Key-Value List */}
                            <div className="space-y-1.5 text-[11px] bg-[#070B14]/80 p-2.5 rounded-xl border border-slate-800/80 mb-3 font-mono">
                              <div className="flex items-start gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                <span className="text-slate-400 shrink-0">Date:</span>
                                <strong className="text-slate-200 truncate">{mission.date}</strong>
                              </div>

                              <div className="flex items-start gap-1.5">
                                <Rocket className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                <span className="text-slate-400 shrink-0">Craft:</span>
                                <strong className="text-slate-200 truncate">{mission.craft}</strong>
                              </div>

                              <div className="flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                <span className="text-slate-400 shrink-0">Site:</span>
                                <strong className="text-slate-200 truncate">{mission.site}</strong>
                              </div>

                              <div className="flex items-start gap-1.5">
                                <Crosshair className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                <span className="text-slate-400 shrink-0">Coords:</span>
                                <strong className={theme.coord}>
                                  {mission.lat.toFixed(2)}°, {mission.lon.toFixed(2)}°
                                </strong>
                              </div>
                            </div>

                            {/* Scientific Discovery & Details */}
                            <p className="text-xs font-sans text-slate-300 leading-relaxed line-clamp-3 mb-4">
                              {mission.discovery}
                            </p>
                          </div>

                          {/* Action Button: Fly To Landing Site */}
                          <button
                            onClick={() => {
                              soundManager.playSelect();
                              onFlyToMission(mission);
                              onClose();
                            }}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${theme.button}`}
                          >
                            <Rocket className="w-3.5 h-3.5 transform -rotate-45" />
                            <span>🪐 Fly To Landing Site</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#0B1120]/90 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry calibrated with NASA LRO 118m Laser Altimetry (LOLA) & ISRO Lunar Data</span>
          </div>
          <div className="text-slate-500 font-mono text-[10px]">
            Press ESC to close directory
          </div>
        </div>

      </div>
    </div>
  );
};

export default MissionsExplorerModal;
