import React, { useState, useEffect, useMemo } from 'react';
import { Map3D } from './components/Map3D';
import { LayerControls } from './components/LayerControls';
import { Scoreboard } from './components/Scoreboard';
import { Header } from './components/Header';
import { SiteModal } from './components/SiteModal';
import { LocationDeepDiveModal } from './components/LocationDeepDiveModal';
import { MissionsExplorerModal } from './components/MissionsExplorerModal';
import { OpeningAnimation } from './components/OpeningAnimation';
import { INITIAL_LUNAR_SITES } from './data/lunarSites';
import { rankSites } from './utils/aiEngine';
import { ApiService } from './api';

export function App() {
  // Navigation & UI State
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  const [isMuted, setIsMuted] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle Full Screen View for Moon
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcut (Press 'F' to toggle Fullscreen) & Event Listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e) => {
      if ((e.key === 'f' || e.key === 'F') && !['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Mission Priority Weights (Defaults matching Artemis baseline)
  const [weights, setWeights] = useState({
    waterIce: 25,
    solarEnergy: 25,
    terrain: 20,
    radiation: 15,
    access: 15
  });

  // 3D Data Layers Visibility
  const [layers, setLayers] = useState({
    terrain: true,
    elevation: true,
    slope: true,
    waterIce: true,
    illumination: true,
    radiation: true,
    temperature: true,
    aiSuitability: true
  });

  // Site Filter
  const [filter, setFilter] = useState({
    minScore: 0,
    siteType: 'All',
    searchQuery: ''
  });

  // Real-time Space Weather State
  const [spaceWeather, setSpaceWeather] = useState({
    solarFlareLevel: 'C1.1 (Nominal)',
    solarWindSpeedKmS: 387,
    radiationFlux: 128,
    geomagneticIndexKp: 2.3,
    sunSpotCount: 142,
    cmeAlert: false,
    lastUpdated: 'Live',
    isLiveApi: true
  });

  // Dynamic Ranked Sites based on weights
  const [rankedSites, setRankedSites] = useState(() => rankSites(INITIAL_LUNAR_SITES, weights));

  // Selected Site ID (Defaults to top site)
  const [selectedSiteId, setSelectedSiteId] = useState(INITIAL_LUNAR_SITES[0].id);

  // Recalculate suitability whenever weights change (via FastAPI or local MCDA)
  useEffect(() => {
    let isMounted = true;
    ApiService.calculateSuitability(weights).then(res => {
      if (isMounted) {
        setRankedSites(res.sites);
        setIsBackendConnected(res.isBackend);
      }
    });
    return () => { isMounted = false; };
  }, [weights]);

  // Initial Space Weather & Health Check
  useEffect(() => {
    ApiService.checkBackendHealth().then(res => {
      setIsBackendConnected(res.online);
    });

    ApiService.getSpaceWeather().then(weather => {
      setSpaceWeather(weather);
    });
  }, []);

  // Currently selected site object
  const selectedSite = useMemo(() => {
    return rankedSites.find(s => s.id === selectedSiteId) || rankedSites[0] || null;
  }, [rankedSites, selectedSiteId]);

  // Filtered sites for 3D map
  const visibleSites = useMemo(() => {
    return rankedSites.filter(site => {
      if (site.suitabilityScore < filter.minScore) return false;
      if (filter.siteType !== 'All' && site.siteType !== filter.siteType) return false;
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const match = site.name.toLowerCase().includes(q) || 
                      site.code.toLowerCase().includes(q) || 
                      site.shortName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [rankedSites, filter]);

  const handleSelectSite = (site) => {
    setSelectedSiteId(site.id);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#030712] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Header Navbar (Hidden in Fullscreen mode) */}
      {!isFullscreen && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onOpenReport={() => setIsReportOpen(true)}
          onOpenMissions={() => setIsMissionsOpen(true)}
          spaceWeather={spaceWeather}
          isBackendConnected={isBackendConnected}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      {/* 2. Main Studio Viewport (Full 100% width/height in Fullscreen Mode) */}
      <main className="flex-1 min-h-0 relative overflow-hidden flex">
        
        {/* Left Column: UI Weight Sliders (Slope, Sun, Ice) & Layer Controls */}
        {!isFullscreen && (
          <LayerControls
            weights={weights}
            setWeights={setWeights}
            layers={layers}
            setLayers={setLayers}
            filter={filter}
            setFilter={setFilter}
          />
        )}

        {/* Center Column: 3D Lunar Surface & Polar Orbit Visualization Canvas */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <div className="flex-1 relative min-h-0 w-full h-full">
            <Map3D
              sites={visibleSites}
              selectedSite={selectedSite}
              onSelectSite={handleSelectSite}
              layers={layers}
              searchQuery={filter.searchQuery}
              setSearchQuery={(q) => setFilter(prev => ({ ...prev, searchQuery: q }))}
              onOpenDeepDive={() => setIsDeepDiveOpen(true)}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>


        </div>

        {/* Right Column: Top Habitat Coordinates & AI Scoreboard */}
        {!isFullscreen && (
          <Scoreboard
            sites={rankedSites}
            selectedSite={selectedSite}
            onSelectSite={handleSelectSite}
            onOpenReport={() => setIsReportOpen(true)}
            onOpenDeepDive={() => setIsDeepDiveOpen(true)}
            weights={weights}
          />
        )}

      </main>



      {/* 4. AI Mission Dossier Modal */}
      {selectedSite && (
        <SiteModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          topSite={selectedSite}
          allSites={rankedSites}
          weights={weights}
          spaceWeather={spaceWeather}
        />
      )}

      {/* 5. Comprehensive Location Scientific Telemetry Deep-Dive Modal */}
      {selectedSite && (
        <LocationDeepDiveModal
          isOpen={isDeepDiveOpen}
          onClose={() => setIsDeepDiveOpen(false)}
          site={selectedSite}
        />
      )}

      {/* 6. Full Structured Lunar Missions Directory Modal */}
      <MissionsExplorerModal
        isOpen={isMissionsOpen}
        onClose={() => setIsMissionsOpen(false)}
        onFlyToMission={(mission) => {
          // Find matching site or coordinate
          const matchedSite = rankedSites.find(s => 
            s.id === mission.id || 
            s.name?.toLowerCase().includes(mission.name.toLowerCase().split('(')[0].trim())
          );
          if (matchedSite) {
            handleSelectSite(matchedSite);
          }
        }}
      />

      {/* 7. Cinematic Opening / Initialization Sequence */}
      {showIntro && (
        <OpeningAnimation onComplete={() => setShowIntro(false)} />
      )}
    </div>
  );
}

export default App;
