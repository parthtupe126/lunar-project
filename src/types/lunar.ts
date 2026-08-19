export type ActiveTab = 'map' | 'dashboard' | 'analysis' | 'optimization' | 'layers';

export type SiteSuitabilityTier = 'HIGHLY SUITABLE' | 'SUITABLE' | 'MODERATE' | 'POOR';

export interface FactorBreakdown {
  terrain: number;        // 0 - 100 (Flatness & slope stability)
  waterIce: number;       // 0 - 100 (PSR volatile & ice concentration probability)
  solarIllumination: number; // 0 - 100 (Annual sunlight % on peak)
  radiationSafety: number;   // 0 - 100 (Cosmic ray & SPE shielding)
  temperature: number;       // 0 - 100 (Thermal equilibrium stability)
  accessibility: number;     // 0 - 100 (Landing delta-V & rover traversability)
}

export interface WhyThisSiteItem {
  text: string;
  type: 'positive' | 'warning' | 'neutral';
}

export interface LunarSite {
  id: string;
  code: string;              // e.g. 'Site A', 'Site B'
  name: string;              // e.g. 'Shackleton Crater Rim - Peak of Eternal Light'
  shortName: string;         // e.g. 'Shackleton Rim'
  tier: SiteSuitabilityTier;
  latitude: number;          // Decimal degrees (e.g. -89.20)
  longitude: number;         // Decimal degrees (e.g. 15.40)
  suitabilityScore: number;  // 0 - 100
  aiConfidence: number;      // 0 - 100%
  factors: FactorBreakdown;
  
  // Physical & Environmental Specs
  elevationMeters: number;
  slopeDegrees: number;
  illuminationPercent: number;
  waterIcePurityPercent: number;
  radiationLevelMsvPerYear: number;
  tempMinKelvin: number;
  tempMaxKelvin: number;
  earthLineOfSightPercent: number;
  distanceToPsrMeters: number;
  
  // Qualitative & AI Content
  siteType: 'Crater Rim' | 'Polar Plateau' | 'PSR Basin' | 'Lava Tube' | 'Mare Plain';
  description: string;
  whyThisSite: WhyThisSiteItem[];
  missionRecommendations: string[];
  thumbnail: string;
  
  // 3D Cartesian coordinates on unit sphere for globe rendering
  sphereX?: number;
  sphereY?: number;
  sphereZ?: number;
}

export interface LayerVisibility {
  terrain: boolean;
  elevation: boolean;
  slope: boolean;
  waterIce: boolean;
  illumination: boolean;
  radiation: boolean;
  temperature: boolean;
  aiSuitability: boolean;
}

export interface MissionPriorityWeights {
  waterIce: number;       // e.g. 25%
  solarEnergy: number;    // e.g. 25%
  terrain: number;        // e.g. 20%
  radiation: number;      // e.g. 15%
  access: number;         // e.g. 15%
}

export interface MissionProfilePreset {
  id: string;
  name: string;
  description: string;
  weights: MissionPriorityWeights;
  icon: string;
  targetFocus: string;
}

export interface NasaSpaceWeather {
  solarFlareLevel: string; // e.g. 'C1.1' or 'M2.4'
  solarWindSpeedKmS: number; // e.g. 387 km/s
  radiationFlux: number; // e.g. 128 pfu
  geomagneticIndexKp: number; // 0 - 9
  sunSpotCount: number;
  cmeAlert: boolean;
  lastUpdated: string;
  isLiveApi: boolean;
}

export interface NasaApodData {
  title: string;
  url: string;
  hdurl?: string;
  explanation: string;
  date: string;
  copyright?: string;
}

export interface HabitatModule {
  id: string;
  type: 'core_habitat' | 'greenhouse' | 'solar_array' | 'isru_plant' | 'nuclear_reactor' | 'landing_pad' | 'comms_tower' | 'rover_bay';
  name: string;
  x: number;
  y: number;
  powerKw: number;
  massKg: number;
  status: 'active' | 'standby' | 'warning';
}

export interface FilterState {
  minScore: number;
  siteType: string;
  searchQuery: string;
}
