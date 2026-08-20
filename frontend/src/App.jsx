import React, { useState, useEffect, useMemo } from 'react';
import { Map3D } from './components/Map3D';
import { LayerControls } from './components/LayerControls';
import { Scoreboard } from './components/Scoreboard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LocationDeepDiveModal } from './components/LocationDeepDiveModal';
import { PhotoGalleryGrid } from './components/PhotoGalleryGrid';
import { INITIAL_LUNAR_SITES } from './data/lunarSites';
import { rankSites } from './utils/aiEngine';
import { ApiService } from './api';

export function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('map');
  const [isMuted, setIsMuted] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Mission Priority Weights (Balanced 6-Factor Artemis baseline with Thermal Equilibrium)
  const [weights, setWeights] = useState({
    waterIce: 20,
    solarEnergy: 20,
    terrain: 20,
    temperature: 15,
    radiation: 15,
    access: 10
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
  const [rankedSites, setRankedSites] = useState(() => rankSites(INITIAL_LUNAR_SITES, {
    waterIce: 20,
    solarEnergy: 20,
    terrain: 20,
    temperature: 15,
    radiation: 15,
    access: 10
  }));

  // Selected Site ID (Defaults dynamically to #1 ranked site)
  const [selectedSiteId, setSelectedSiteId] = useState(() => {
    const initialRanked = rankSites(INITIAL_LUNAR_SITES, {
      waterIce: 20,
      solarEnergy: 20,
      terrain: 20,
      temperature: 15,
      radiation: 15,
      access: 10
    });
    return initialRanked[0]?.id || INITIAL_LUNAR_SITES[0]?.id;
  });

  // Recalculate suitability whenever weights change (via FastAPI or local MCDA)
  useEffect(() => {
    let isMounted = true;
    ApiService.calculateSuitability(weights).then(res => {
      if (isMounted && res.sites) {
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

  // Filtered sites for 3D map & Scoreboard
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

  // Currently selected site object (falls back to top visible site if filtered)
  const selectedSite = useMemo(() => {
    return visibleSites.find(s => s.id === selectedSiteId) || visibleSites[0] || rankedSites[0] || null;
  }, [visibleSites, rankedSites, selectedSiteId]);

  const handleSelectSite = (site) => {
    setSelectedSiteId(site.id);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#030712] text-slate-100 overflow-hidden font-sans">
      {/* 1. Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenReport={() => setIsDossierOpen(true)}
        spaceWeather={spaceWeather}
        isBackendConnected={isBackendConnected}
      />

      {/* 2. Main 3-Column Studio Viewport */}
      <main className="flex-1 min-h-0 relative overflow-hidden flex">
        
        {/* Left Column: UI Weight Sliders (Slope, Sun, Ice, Temp, Rad, Access) & Layer Controls */}
        <LayerControls
          weights={weights}
          setWeights={setWeights}
          layers={layers}
          setLayers={setLayers}
          filter={filter}
          setFilter={setFilter}
        />

        {/* Center Column: 3D Lunar Surface & Polar Orbit Visualization Canvas + 4-Panel Gallery */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <div className="flex-1 relative min-h-0">
            <Map3D
              sites={visibleSites}
              selectedSite={selectedSite}
              onSelectSite={handleSelectSite}
              layers={layers}
              searchQuery={filter.searchQuery}
              setSearchQuery={(q) => setFilter(prev => ({ ...prev, searchQuery: q }))}
              onOpenDeepDive={() => setIsDossierOpen(true)}
            />
          </div>

          {/* Bottom 4-Panel Surface & Lander Photo Gallery Grid */}
          {selectedSite && (
            <div className="p-2.5 bg-[#070B14]/95 border-t border-slate-800/90 backdrop-blur-xl shrink-0 z-20">
              <PhotoGalleryGrid
                images={selectedSite.galleryImages}
                siteName={selectedSite.name}
                onViewLander={() => setIsDossierOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Right Column: Top Habitat Coordinates & AI Scoreboard (Synchronized with visibleSites) */}
        <Scoreboard
          sites={visibleSites}
          selectedSite={selectedSite}
          onSelectSite={handleSelectSite}
          onOpenReport={() => setIsDossierOpen(true)}
          weights={weights}
        />

      </main>

      {/* 3. Telemetry Footer Bar */}
      <Footer
        totalCandidateSites={visibleSites.length}
        analyzedRegionsCount={1250}
        bestScore={rankedSites[0]?.suitabilityScore || 92.0}
        lastUpdated={spaceWeather.lastUpdated}
      />

      {/* 4. Unified AI Mission Dossier & Comprehensive Scientific Telemetry Modal */}
      {selectedSite && (
        <LocationDeepDiveModal
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          site={selectedSite}
          weights={weights}
        />
      )}
    </div>
  );
}

export default App;
