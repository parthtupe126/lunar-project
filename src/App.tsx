import React, { useState, useEffect, useMemo } from 'react';
import { 
  ActiveTab, 
  LunarSite, 
  LayerVisibility, 
  MissionPriorityWeights, 
  FilterState, 
  NasaSpaceWeather, 
  NasaApodData 
} from './types/lunar';
import { INITIAL_LUNAR_SITES } from './data/lunarSites';
import { rankSites } from './utils/aiEngine';
import { NasaService } from './services/nasaApi';
import { soundManager } from './utils/audio';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Map View Components (Matching Image 2)
import { LunarGlobe3D } from './components/map/LunarGlobe3D';
import { DataLayersPanel } from './components/map/DataLayersPanel';
import { SiteAnalysisPanel } from './components/map/SiteAnalysisPanel';
import { TopSitesShelf } from './components/map/TopSitesShelf';

// Tab Views
import { DashboardView } from './components/dashboard/DashboardView';
import { SiteAnalysisView } from './components/analysis/SiteAnalysisView';
import { OptimizationView } from './components/optimization/OptimizationView';
import { DataLayersView } from './components/layers/DataLayersView';

// Modals
import { MissionReportModal } from './components/modals/MissionReportModal';
import { LocationDeepDiveModal } from './components/modals/LocationDeepDiveModal';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [isMuted, setIsMuted] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

  // Mission Criteria Weights (Defaults matching Image 2)
  const [weights, setWeights] = useState<MissionPriorityWeights>({
    waterIce: 25,
    solarEnergy: 25,
    terrain: 20,
    radiation: 15,
    access: 15
  });

  // Layer Toggles (Defaults matching Image 2 with all layers active)
  const [layers, setLayers] = useState<LayerVisibility>({
    terrain: true,
    elevation: true,
    slope: true,
    waterIce: true,
    illumination: true,
    radiation: true,
    temperature: true,
    aiSuitability: true
  });

  // Site Filter State
  const [filter, setFilter] = useState<FilterState>({
    minScore: 0,
    siteType: 'All',
    searchQuery: ''
  });

  // Dynamically Re-scored and Ranked Sites
  const rankedSites = useMemo(() => {
    return rankSites(INITIAL_LUNAR_SITES, weights);
  }, [weights]);

  // Selected Site (Defaults to top candidate Site A)
  const [selectedSiteId, setSelectedSiteId] = useState<string>(INITIAL_LUNAR_SITES[0].id);

  const selectedSite = useMemo(() => {
    return rankedSites.find(s => s.id === selectedSiteId) || rankedSites[0] || null;
  }, [rankedSites, selectedSiteId]);

  // Filtered sites for globe & shelf view
  const visibleSites = useMemo(() => {
    return rankedSites.filter(site => {
      if (site.suitabilityScore < filter.minScore) return false;
      if (filter.siteType !== 'All' && site.siteType !== filter.siteType) return false;
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const match = site.name.toLowerCase().includes(q) || site.code.toLowerCase().includes(q) || site.shortName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [rankedSites, filter]);

  // Real-time NASA Space Weather & APOD state
  const [spaceWeather, setSpaceWeather] = useState<NasaSpaceWeather>({
    solarFlareLevel: 'C1.1 (Nominal)',
    solarWindSpeedKmS: 387,
    radiationFlux: 128,
    geomagneticIndexKp: 2.3,
    sunSpotCount: 142,
    cmeAlert: false,
    lastUpdated: 'Live Cached',
    isLiveApi: true
  });

  const [apodData, setApodData] = useState<NasaApodData | null>(null);

  // Fetch live NASA data on component mount
  useEffect(() => {
    NasaService.getLiveSpaceWeather().then(setSpaceWeather).catch(console.error);
    NasaService.getApod().then(setApodData).catch(console.error);
  }, []);

  const handleSelectSite = (site: LunarSite) => {
    setSelectedSiteId(site.id);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#030712] text-slate-100 overflow-hidden font-sans">
      {/* 1. Header (Navbar, NASA Live status, AI system online) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenReport={() => setIsReportOpen(true)}
        nasaLive={spaceWeather.isLiveApi}
      />

      {/* 2. Main Viewport Area */}
      <main className="flex-1 min-h-0 relative overflow-hidden flex">
        {/* TAB 1: LUNAR MAP (Exact match to Image 2 with Left Data Layers, Center 3D Globe + Bottom Top Sites Shelf, Right Site Analysis) */}
        {activeTab === 'map' && (
          <div className="flex-1 flex h-full overflow-hidden">
            {/* Left Data Layers & Site Filter Panel */}
            <DataLayersPanel
              layers={layers}
              setLayers={setLayers}
              filter={filter}
              setFilter={setFilter}
            />

            {/* Center Area: 3D Lunar Globe + Top Recommended Sites Bottom Shelf */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              <div className="flex-1 relative min-h-0">
                <LunarGlobe3D
                  sites={visibleSites}
                  selectedSite={selectedSite}
                  onSelectSite={handleSelectSite}
                  layers={layers}
                  searchQuery={filter.searchQuery}
                  setSearchQuery={(q) => setFilter(prev => ({ ...prev, searchQuery: q }))}
                  onOpenDeepDive={() => setIsDeepDiveOpen(true)}
                />
              </div>

              {/* Bottom Carousel / Shelf of Ranked Sites */}
              <TopSitesShelf
                sites={rankedSites}
                selectedSite={selectedSite}
                onSelectSite={handleSelectSite}
              />
            </div>

            {/* Right Site Analysis Inspector Panel */}
            <SiteAnalysisPanel
              site={selectedSite}
              weights={weights}
              setWeights={setWeights}
              setActiveTab={setActiveTab}
              onOpenDeepDive={() => setIsDeepDiveOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardView
            sites={rankedSites}
            selectedSite={selectedSite}
            onSelectSite={handleSelectSite}
            spaceWeather={spaceWeather}
            apodData={apodData}
          />
        )}

        {/* TAB 3: SITE ANALYSIS & HABITAT ARCHITECT */}
        {activeTab === 'analysis' && (
          <SiteAnalysisView
            sites={rankedSites}
            selectedSite={selectedSite}
            onSelectSite={handleSelectSite}
          />
        )}

        {/* TAB 4: OPTIMIZATION (MCDM / AHP) */}
        {activeTab === 'optimization' && (
          <OptimizationView
            sites={rankedSites}
            weights={weights}
            setWeights={setWeights}
            selectedSite={selectedSite}
            onSelectSite={handleSelectSite}
          />
        )}

        {/* TAB 5: DATA LAYERS SCIENCE EXPLORER */}
        {activeTab === 'layers' && (
          <DataLayersView />
        )}
      </main>

      {/* 3. Footer Telemetry Bar (Matching Image 2 footer) */}
      <Footer
        totalCandidateSites={24}
        analyzedRegionsCount={1250}
        bestScore={rankedSites[0]?.suitabilityScore || 92.4}
        lastUpdated="2 min ago"
      />

      {/* 4. AI Mission Dossier Report Modal */}
      {selectedSite && (
        <MissionReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          topSite={selectedSite}
          allSites={rankedSites}
          weights={weights}
          spaceWeather={spaceWeather}
        />
      )}

      {/* 5. Comprehensive Location Scientific Telemetry Deep Dive Page Modal */}
      {selectedSite && (
        <LocationDeepDiveModal
          isOpen={isDeepDiveOpen}
          onClose={() => setIsDeepDiveOpen(false)}
          site={selectedSite}
        />
      )}
    </div>
  );
}

export default App;
