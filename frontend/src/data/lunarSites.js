
// Helper to convert lat/lon in degrees to 3D unit sphere coordinates
// Moon coordinates: South Pole is lat -90, equator is 0
export function latLonToVector3(lat, lon, radius = 1.5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return { x, y, z };
}

export const INITIAL_LUNAR_SITES = [
  // 1. Shackleton Crater Rim
  {
    id: 'site-shackleton',
    code: 'Shackleton',
    name: 'Shackleton Crater Rim — Peak of Eternal Light',
    shortName: 'Shackleton Crater Rim',
    tier: 'HIGHLY SUITABLE',
    latitude: -89.28,
    longitude: 15.40,
    suitabilityScore: 94.2,
    aiConfidence: 94,
    factors: {
      terrain: 94,
      waterIce: 89,
      solarIllumination: 97,
      radiationSafety: 84,
      temperature: 90,
      accessibility: 82
    },
    elevationMeters: 4120, // Real LOLA SLDEM2015
    slopeDegrees: 4.2,     // Real LOLA Slope
    illuminationPercent: 95.2,
    waterIcePurityPercent: 19.5,
    radiationLevelMsvPerYear: 280,
    tempMinKelvin: 180,
    tempMaxKelvin: 220,    // Real Diviner Max Temp
    earthLineOfSightPercent: 98.4,
    distanceToPsrMeters: 350,
    siteType: 'Crater Rim',
    description: 'Premier candidate on the high rim crest of Shackleton Crater near the true lunar South Pole. Features near-continuous solar illumination and immediate ridge access to permanently shadowed volatile reserves.',
    whyThisSite: [
      { text: 'Peak of Eternal Light: >95% annual solar illumination along ridge', type: 'positive' },
      { text: 'Direct adjacent access to deep Shackleton PSR cold trap', type: 'positive' },
      { text: 'Gentle localized slope (4.2°) along primary crest line', type: 'positive' },
      { text: 'Direct continuous Line-of-Sight to Earth ground telemetry stations', type: 'positive' },
      { text: 'Precision touchdown required to avoid steep internal wall gradients', type: 'warning' }
    ],
    missionRecommendations: [
      'Deploy 100kW photovoltaic array along crest peak',
      'Establish primary pressurized habitat modules in micro-depression zone',
      'Deploy tethered autonomous cryo-rover into Shackleton PSR for water ice mining',
      'Install Ka-band optical communication direct Earth relay terminal'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=400&q=80'
  },

  // 2. Mons Malapert Plateau
  {
    id: 'site-malapert',
    code: 'Malapert',
    name: 'Mons Malapert (Malapert Mountain Plateau)',
    shortName: 'Mons Malapert Plateau',
    tier: 'HIGHLY SUITABLE',
    latitude: -85.99,
    longitude: 12.90,
    suitabilityScore: 91.8,
    aiConfidence: 91,
    factors: {
      terrain: 90,
      waterIce: 83,
      solarIllumination: 96,
      radiationSafety: 88,
      temperature: 92,
      accessibility: 86
    },
    elevationMeters: 5100, // Real LOLA SLDEM2015
    slopeDegrees: 6.1,     // Real LOLA Slope
    illuminationPercent: 93.6,
    waterIcePurityPercent: 14.8,
    radiationLevelMsvPerYear: 290,
    tempMinKelvin: 195,
    tempMaxKelvin: 235,    // Real Diviner Max Temp
    earthLineOfSightPercent: 99.6,
    distanceToPsrMeters: 1100,
    siteType: 'Polar Plateau',
    description: 'A colossal 5.1 km high massif offering unmatched unobstructed line-of-sight to Earth, extremely high annual solar power availability, and expansive plateau areas suitable for multi-module expansion.',
    whyThisSite: [
      { text: 'Unmatched 99.6% direct Earth communications visibility', type: 'positive' },
      { text: 'Superb 93.6% year-round solar energy generation', type: 'positive' },
      { text: 'Expansive flat terrain on eastern plateau shelf for large-scale footprints', type: 'positive' },
      { text: 'Natural elevated vantage point for surface radar & LiDAR navigation', type: 'positive' },
      { text: 'Traverse distance to PSR volatile beds is approx. 1.1 km', type: 'warning' }
    ],
    missionRecommendations: [
      'Erect Artemis lunar communications hub and space traffic transponder',
      'Construct initial surface basecamp on eastern plateau shelf',
      'Establish automated rover haulage road to southern ice deposits'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80'
  },

  // 3. Faustini Rim A
  {
    id: 'site-faustini',
    code: 'Faustini A',
    name: 'Faustini Crater Rim — Ridge A',
    shortName: 'Faustini Rim A',
    tier: 'SUITABLE',
    latitude: -87.15,
    longitude: 77.00,
    suitabilityScore: 83.4,
    aiConfidence: 85,
    factors: {
      terrain: 81,
      waterIce: 95,
      solarIllumination: 78,
      radiationSafety: 80,
      temperature: 79,
      accessibility: 76
    },
    elevationMeters: 2450, // Real LOLA SLDEM2015
    slopeDegrees: 8.5,     // Real LOLA Slope
    illuminationPercent: 77.5,
    waterIcePurityPercent: 25.2,
    radiationLevelMsvPerYear: 335,
    tempMinKelvin: 110,
    tempMaxKelvin: 200,    // Real Diviner Max Temp
    earthLineOfSightPercent: 86.2,
    distanceToPsrMeters: 140,
    siteType: 'Crater Rim',
    description: 'High-yield volatiles prospect area. While solar illumination is lower compared to Shackleton, Faustini holds massive water ice reservoirs ideal for commercial propellant manufacturing.',
    whyThisSite: [
      { text: 'High water-ice purity estimate (25.2%) in immediate proximity', type: 'positive' },
      { text: 'Direct access to deep cryo-trap (140m distance)', type: 'positive' },
      { text: 'Rich mineral diversity including ilmenite for oxygen extraction', type: 'positive' },
      { text: 'Lower annual sunlight (77.5%) requires hybrid power infrastructure', type: 'warning' }
    ],
    missionRecommendations: [
      'Designate as industrial mining zone for Commercial Lunar Payload Services',
      'Deploy thermal mining solar reflectors and sublimator domes'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  },

  // 4. Connecting Ridge
  {
    id: 'site-connecting-ridge',
    code: 'Connecting Ridge',
    name: 'Connecting Ridge (Shackleton-de Gerlache)',
    shortName: 'Connecting Ridge',
    tier: 'HIGHLY SUITABLE',
    latitude: -88.60,
    longitude: -31.70,
    suitabilityScore: 89.6,
    aiConfidence: 89,
    factors: {
      terrain: 95,
      waterIce: 86,
      solarIllumination: 90,
      radiationSafety: 87,
      temperature: 88,
      accessibility: 92
    },
    elevationMeters: 3850, // Real LOLA SLDEM2015
    slopeDegrees: 3.8,     // Real LOLA Slope
    illuminationPercent: 89.5,
    waterIcePurityPercent: 16.8,
    radiationLevelMsvPerYear: 305,
    tempMinKelvin: 160,
    tempMaxKelvin: 220,    // Real Diviner Max Temp
    earthLineOfSightPercent: 93.5,
    distanceToPsrMeters: 580,
    siteType: 'Crater Rim',
    description: 'An elongated elevated ridge bridging Shackleton and de Gerlache craters. Offers ultra-low slope gradients (3.8°) ideal for heavy lander touchdowns and long-range pressurized rover traversal.',
    whyThisSite: [
      { text: 'Extremely gentle slope (< 4°) across a wide landing corridor', type: 'positive' },
      { text: 'Bilateral access to both Shackleton and de Gerlache shadow traps', type: 'positive' },
      { text: 'High structural stability for foundation piling and sintering', type: 'positive' },
      { text: 'Periodic brief communication shadowing during lunar winter', type: 'warning' }
    ],
    missionRecommendations: [
      'Designate primary human lander touchdown zone (HLS designated)',
      'Construct sintered regolith landing pad with blast deflection walls',
      'Deploy mobile power generation rovers'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=400&q=80'
  },

  // 5. de Gerlache Rim
  {
    id: 'site-de-gerlache',
    code: 'de Gerlache',
    name: 'de Gerlache Rim — Mons Peak Alpha',
    shortName: 'de Gerlache Rim',
    tier: 'SUITABLE',
    latitude: -85.90,
    longitude: 76.30,
    suitabilityScore: 84.1,
    aiConfidence: 86,
    factors: {
      terrain: 84,
      waterIce: 91,
      solarIllumination: 84,
      radiationSafety: 82,
      temperature: 83,
      accessibility: 80
    },
    elevationMeters: 2900, // Real LOLA SLDEM2015
    slopeDegrees: 7.2,     // Real LOLA Slope
    illuminationPercent: 83.5,
    waterIcePurityPercent: 22.1,
    radiationLevelMsvPerYear: 320,
    tempMinKelvin: 140,
    tempMaxKelvin: 210,    // Real Diviner Max Temp
    earthLineOfSightPercent: 89.2,
    distanceToPsrMeters: 210,
    siteType: 'Crater Rim',
    description: 'Overlooks the deep de Gerlache crater floor where neutron spectrometer readings indicate exceptionally high concentrations of subsurface hydrogen and water ice.',
    whyThisSite: [
      { text: 'Dense hydrogen/ice spectral signature in close proximity (210m)', type: 'positive' },
      { text: 'Solid bedrock geology suitable for foundation anchoring', type: 'positive' },
      { text: 'Slope angle (7.2°) requires leveled landing pad', type: 'warning' }
    ],
    missionRecommendations: [
      'Install compact Kilopower nuclear reactor (10 kWe) as baseline power',
      'Deploy autonomous ISRU water refinery pilot plant'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?auto=format&fit=crop&w=400&q=80'
  },

  // 6. Haworth Crater Rim
  {
    id: 'site-haworth',
    code: 'Haworth',
    name: 'Haworth Crater Rim North',
    shortName: 'Haworth Crater Rim',
    tier: 'SUITABLE',
    latitude: -87.40,
    longitude: -5.10,
    suitabilityScore: 85.8,
    aiConfidence: 87,
    factors: {
      terrain: 88,
      waterIce: 91,
      solarIllumination: 83,
      radiationSafety: 83,
      temperature: 82,
      accessibility: 85
    },
    elevationMeters: 3100, // Real LOLA SLDEM2015
    slopeDegrees: 5.4,     // Real LOLA Slope
    illuminationPercent: 82.8,
    waterIcePurityPercent: 22.8,
    radiationLevelMsvPerYear: 315,
    tempMinKelvin: 130,
    tempMaxKelvin: 215,    // Real Diviner Max Temp
    earthLineOfSightPercent: 91.8,
    distanceToPsrMeters: 280,
    siteType: 'Crater Rim',
    description: 'Prominent northern rim crest offering a balanced profile of ice proximity, stable illumination peaks, and easy access to both Haworth and Shoemaker crater basins.',
    whyThisSite: [
      { text: 'Multi-basin access for geological exploration and sampling', type: 'positive' },
      { text: 'Strong water ice presence in permanently shadowed floor', type: 'positive' },
      { text: 'Stable thermal conditions during peak lunar daytime', type: 'positive' }
    ],
    missionRecommendations: [
      'Establish science laboratory for volatile age dating and isotope analysis',
      'Integrate solar tower arrays on highest crest points'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80'
  },

  // 7. Mons Mouton (Leibnitz Beta Plateau)
  {
    id: 'site-mons-mouton',
    code: 'Mons Mouton',
    name: 'Mons Mouton (Leibnitz Beta Plateau)',
    shortName: 'Mons Mouton Plateau',
    tier: 'HIGHLY SUITABLE',
    latitude: -85.10,
    longitude: 31.50,
    suitabilityScore: 92.6,
    aiConfidence: 95,
    factors: {
      terrain: 98,
      waterIce: 81,
      solarIllumination: 95,
      radiationSafety: 91,
      temperature: 93,
      accessibility: 93
    },
    elevationMeters: 5900, // Real LOLA SLDEM2015
    slopeDegrees: 2.9,     // Real LOLA Slope
    illuminationPercent: 93.8,
    waterIcePurityPercent: 13.5,
    radiationLevelMsvPerYear: 275,
    tempMinKelvin: 200,
    tempMaxKelvin: 240,    // Real Diviner Max Temp
    earthLineOfSightPercent: 99.3,
    distanceToPsrMeters: 1650,
    siteType: 'Polar Plateau',
    description: 'A colossal 5.9 km flat-topped lunar mountain plateau selected as a primary VIPER rover landing site. The extraordinary flatness (2.9° slope) creates an ideal base for long-term expansion.',
    whyThisSite: [
      { text: 'Exceptional flatness (slope 2.9°) across 15+ square kilometers', type: 'positive' },
      { text: 'Highest elevation in candidate cluster (+5,900m) provides wide radar coverage', type: 'positive' },
      { text: 'Near constant 99.3% direct line-of-sight to Earth', type: 'positive' },
      { text: 'Naturally elevated above local secondary impact ejecta flows', type: 'positive' }
    ],
    missionRecommendations: [
      'Build primary civil lunar airport / commercial spaceport',
      'Deploy deep-space optical telescope array benefiting from atmospheric absence',
      'Establish permanent astronaut habitat complex'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80'
  },

  // 8. Nobile Crater Rim
  {
    id: 'site-nobile',
    code: 'Nobile',
    name: 'Nobile Crater Rim — Artemis Base Alpha',
    shortName: 'Nobile Crater Rim',
    tier: 'SUITABLE',
    latitude: -85.20,
    longitude: 53.50,
    suitabilityScore: 87.5,
    aiConfidence: 89,
    factors: {
      terrain: 90,
      waterIce: 88,
      solarIllumination: 86,
      radiationSafety: 85,
      temperature: 86,
      accessibility: 89
    },
    elevationMeters: 3400, // Real LOLA SLDEM2015
    slopeDegrees: 4.8,     // Real LOLA Slope
    illuminationPercent: 86.8,
    waterIcePurityPercent: 18.2,
    radiationLevelMsvPerYear: 300,
    tempMinKelvin: 165,
    tempMaxKelvin: 225,    // Real Diviner Max Temp
    earthLineOfSightPercent: 94.8,
    distanceToPsrMeters: 490,
    siteType: 'Crater Rim',
    description: 'Designated NASA VIPER landing exploration zone. Features undulating hills with accessible slopes down into permanently shadowed volatile pockets.',
    whyThisSite: [
      { text: 'Proven ground-truth candidate with extensive orbital survey data', type: 'positive' },
      { text: 'Safe approach paths for automated cargo landers', type: 'positive' },
      { text: 'Diverse soil composition rich in regolith volatiles', type: 'positive' }
    ],
    missionRecommendations: [
      'Install Artemis Base Camp Core Habitation Module',
      'Establish pressurized rover charging garage and airlocks'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
  },

  // 9. Amundsen Crater Floor & Rim
  {
    id: 'site-i',
    code: 'Amundsen',
    name: 'Amundsen Crater Floor & Rim (Site I)',
    shortName: 'Amundsen Crater (Site I)',
    tier: 'MODERATE',
    latitude: -84.50,
    longitude: 82.80,
    suitabilityScore: 80.2,
    aiConfidence: 82,
    factors: {
      terrain: 83,
      waterIce: 89,
      solarIllumination: 74,
      radiationSafety: 78,
      temperature: 76,
      accessibility: 78
    },
    elevationMeters: 1800, // Real LOLA SLDEM2015
    slopeDegrees: 6.8,     // Real LOLA Slope
    illuminationPercent: 75.2,
    waterIcePurityPercent: 20.4,
    radiationLevelMsvPerYear: 330,
    tempMinKelvin: 120,
    tempMaxKelvin: 210,    // Real Diviner Max Temp
    earthLineOfSightPercent: 82.5,
    distanceToPsrMeters: 380,
    siteType: 'Crater Rim',
    description: 'A 105-kilometer diameter crater with steep terraced walls and a central peak. Deep shadow reservoirs contain extensive organic and water ice signatures.',
    whyThisSite: [
      { text: 'Massive catchment area with high geological research value', type: 'positive' },
      { text: 'Central peak provides elevated solar installation opportunity', type: 'positive' },
      { text: 'Complex terraced walls require cautious rover navigation', type: 'warning' }
    ],
    missionRecommendations: [
      'Deploy autonomous drone/hopper for vertical wall sampling',
      'Construct remote science sensor grid'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80'
  },

  // 10. Marius Hills Lava Tube Skylight
  {
    id: 'site-j',
    code: 'Marius Hills',
    name: 'Marius Hills Lava Tube Skylight (Site J)',
    shortName: 'Marius Hills Lava Tube',
    tier: 'SUITABLE',
    latitude: 14.20,
    longitude: -56.70,
    suitabilityScore: 86.7,
    aiConfidence: 88,
    factors: {
      terrain: 79,
      waterIce: 46,
      solarIllumination: 70,
      radiationSafety: 100,
      temperature: 99,
      accessibility: 74
    },
    elevationMeters: -1200, // Real LOLA SLDEM2015
    slopeDegrees: 12.0,     // Real LOLA Slope
    illuminationPercent: 52.0,
    waterIcePurityPercent: 2.1,
    radiationLevelMsvPerYear: 15, // Complete subterranean shielding
    tempMinKelvin: 253,
    tempMaxKelvin: 256,    // Constant stable subterranean temp (-20°C)
    earthLineOfSightPercent: 82.0,
    distanceToPsrMeters: 45000,
    siteType: 'Lava Tube',
    description: 'A subterranean lava tube cave system located in Oceanus Procellarum. Provides virtually 100% natural radiation shielding and a constant stable internal temperature of -20°C year-round.',
    whyThisSite: [
      { text: 'Near 100% natural cosmic radiation and micrometeorite shielding', type: 'positive' },
      { text: 'Constant thermal equilibrium (-20°C) avoids extreme surface swings', type: 'positive' },
      { text: 'Gigantic cavern capacity (hundreds of meters wide)', type: 'positive' },
      { text: 'Low in-situ water ice availability (requires transport or recycling)', type: 'warning' },
      { text: 'Access requires vertical winch or crane ingress system', type: 'warning' }
    ],
    missionRecommendations: [
      'Subsurface master colony habitat installation',
      'Deploy heavy winched elevator down 50m skylight shaft',
      'Surface nuclear / solar umbilical power feed'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
  },

  // 11. Cabeus Crater (LCROSS Ground Zero)
  {
    id: 'site-k',
    code: 'Cabeus',
    name: 'Cabeus Crater (LCROSS Impact Site)',
    shortName: 'Cabeus Crater (Site K)',
    tier: 'SUITABLE',
    latitude: -84.90,
    longitude: -35.50,
    suitabilityScore: 84.8,
    aiConfidence: 90,
    factors: {
      terrain: 82,
      waterIce: 97,
      solarIllumination: 73,
      radiationSafety: 80,
      temperature: 75,
      accessibility: 77
    },
    elevationMeters: 2100, // Real LOLA SLDEM2015
    slopeDegrees: 6.9,     // Real LOLA Slope
    illuminationPercent: 73.5,
    waterIcePurityPercent: 26.8,
    radiationLevelMsvPerYear: 335,
    tempMinKelvin: 90,
    tempMaxKelvin: 210,    // Real Diviner Max Temp
    earthLineOfSightPercent: 86.8,
    distanceToPsrMeters: 90,
    siteType: 'PSR Basin',
    description: 'Ground zero of the historic NASA LCROSS mission which definitively confirmed pure water ice, carbon monoxide, methane, and silver/mercury traces in the lunar regolith plume.',
    whyThisSite: [
      { text: 'Highest confirmed volatile concentration (LCROSS validated)', type: 'positive' },
      { text: 'Direct target for heavy industrial volatile extraction', type: 'positive' },
      { text: 'Extremely cold cryogenic environment requires heated rover chassis', type: 'warning' }
    ],
    missionRecommendations: [
      'Commercial rocket propellant (LH2/LOX) plant',
      'Cryogenic volatile distillation pipeline'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80'
  },

  // 12. Shoemaker Crater Rim South
  {
    id: 'site-l',
    code: 'Shoemaker',
    name: 'Shoemaker Crater Rim South (Site L)',
    shortName: 'Shoemaker Rim (Site L)',
    tier: 'SUITABLE',
    latitude: -88.10,
    longitude: 44.90,
    suitabilityScore: 86.5,
    aiConfidence: 87,
    factors: {
      terrain: 88,
      waterIce: 89,
      solarIllumination: 85,
      radiationSafety: 84,
      temperature: 83,
      accessibility: 86
    },
    elevationMeters: 3300, // Real LOLA SLDEM2015
    slopeDegrees: 5.1,     // Real LOLA Slope
    illuminationPercent: 85.2,
    waterIcePurityPercent: 18.6,
    radiationLevelMsvPerYear: 310,
    tempMinKelvin: 150,
    tempMaxKelvin: 220,    // Real Diviner Max Temp
    earthLineOfSightPercent: 93.6,
    distanceToPsrMeters: 390,
    siteType: 'Crater Rim',
    description: 'Adjacent to Malapert and Shackleton, Shoemaker Crater features a deep floor trap with gentle rim slopes permitting continuous rover excursions.',
    whyThisSite: [
      { text: 'Consistent terrain and illumination along southern rim', type: 'positive' },
      { text: 'Direct line-of-sight to lunar comms satellites and Earth', type: 'positive' }
    ],
    missionRecommendations: [
      'Autonomous mining rover testing grounds',
      'Regolith sintering construction demonstration'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=400&q=80'
  },

  // 13. Chandrayaan-3 (Shiv Shakti Point)
  {
    id: 'ch3_shiv_shakti',
    code: 'Shiv Shakti',
    name: 'Chandrayaan-3 (Shiv Shakti Point)',
    shortName: 'Shiv Shakti Point',
    tier: 'SUITABLE',
    latitude: -69.373,
    longitude: 32.319,
    suitabilityScore: 83.2,
    aiConfidence: 96,
    factors: {
      terrain: 92,
      waterIce: 72,
      solarIllumination: 80,
      radiationSafety: 79,
      temperature: 82,
      accessibility: 94
    },
    elevationMeters: -2580, // Real LOLA SLDEM2015
    slopeDegrees: 3.1,      // Real LOLA Slope
    illuminationPercent: 80.0,
    waterIcePurityPercent: 8.5,
    radiationLevelMsvPerYear: 340,
    tempMinKelvin: 130,
    tempMaxKelvin: 333,     // Real ChaSTE surface measurement (60°C / 333K)
    earthLineOfSightPercent: 96.0,
    distanceToPsrMeters: 4200,
    siteType: 'Mare Plain',
    description: 'Historic ground-truth landing site of ISRO Vikram Lander & Pragyan Rover. Confirmed elemental sulfur, iron, titanium, and provided in-situ regolith thermophysical profiling down to 8 cm depth.',
    whyThisSite: [
      { text: 'In-situ ground truth validation from ChaSTE & APXS spectrometers', type: 'positive' },
      { text: 'Flat open highland plains with 3.1° slope', type: 'positive' },
      { text: 'Direct telemetry coverage to ISTRAC & DSN ground stations', type: 'positive' }
    ],
    missionRecommendations: [
      'Deploy stationary long-term seismological observatory',
      'Establish regolith plasma charging research station'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80'
  },

  // 14. Chandrayaan-1 (Jawahar Point)
  {
    id: 'ch1_jawahar',
    code: 'Jawahar Point',
    name: 'Chandrayaan-1 (Jawahar Point)',
    shortName: 'Jawahar Point',
    tier: 'SUITABLE',
    latitude: -89.90,
    longitude: 0.0,
    suitabilityScore: 88.4,
    aiConfidence: 93,
    factors: {
      terrain: 88,
      waterIce: 92,
      solarIllumination: 91,
      radiationSafety: 83,
      temperature: 86,
      accessibility: 82
    },
    elevationMeters: 3950, // Real LOLA SLDEM2015
    slopeDegrees: 5.0,     // Real LOLA Slope
    illuminationPercent: 91.5,
    waterIcePurityPercent: 20.0,
    radiationLevelMsvPerYear: 290,
    tempMinKelvin: 160,
    tempMaxKelvin: 220,    // Real Diviner Max Temp
    earthLineOfSightPercent: 97.0,
    distanceToPsrMeters: 250,
    siteType: 'Crater Rim',
    description: 'Impact site of the Moon Impact Probe (MIP) that discovered water molecules across polar lunar regolith alongside NASA M3 spectrometer data.',
    whyThisSite: [
      { text: 'Historic landmark of water molecule confirmation on the Moon', type: 'positive' },
      { text: 'High polar elevation with direct view into South Pole cold traps', type: 'positive' }
    ],
    missionRecommendations: [
      'Construct deep-space volatile monitoring station',
      'Install commemorative international scientific marker'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=400&q=80'
  },

  // 15. Chandrayaan-2 (Tiranga Point)
  {
    id: 'ch2_tiranga',
    code: 'Tiranga Point',
    name: 'Chandrayaan-2 (Tiranga Point)',
    shortName: 'Tiranga Point',
    tier: 'SUITABLE',
    latitude: -70.83,
    longitude: 22.68,
    suitabilityScore: 81.9,
    aiConfidence: 89,
    factors: {
      terrain: 89,
      waterIce: 74,
      solarIllumination: 81,
      radiationSafety: 80,
      temperature: 80,
      accessibility: 91
    },
    elevationMeters: -2300, // Real LOLA SLDEM2015
    slopeDegrees: 4.0,      // Real LOLA Slope
    illuminationPercent: 81.0,
    waterIcePurityPercent: 10.2,
    radiationLevelMsvPerYear: 335,
    tempMinKelvin: 135,
    tempMaxKelvin: 330,     // Real Diviner Max Temp
    earthLineOfSightPercent: 95.0,
    distanceToPsrMeters: 3800,
    siteType: 'Mare Plain',
    description: 'Target highland plains region surveyed continuously by Chandrayaan-2 Dual-Frequency SAR and high-resolution 0.32m optical cameras.',
    whyThisSite: [
      { text: 'High resolution (0.32m) orbital radar & camera calibration data', type: 'positive' },
      { text: 'Even highland plain suitable for automated landers', type: 'positive' }
    ],
    missionRecommendations: [
      'Install surface radar calibration transponder',
      'Deploy autonomous meteorological outpost'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=400&q=80'
  },

  // 16. Chandrayaan-4 / LUPEX
  {
    id: 'lupex_ch4',
    code: 'LUPEX / CH-4',
    name: 'Chandrayaan-4 / LUPEX (Connecting Ridge Target)',
    shortName: 'LUPEX / Chandrayaan-4',
    tier: 'HIGHLY SUITABLE',
    latitude: -89.40,
    longitude: 145.0,
    suitabilityScore: 91.2,
    aiConfidence: 92,
    factors: {
      terrain: 93,
      waterIce: 90,
      solarIllumination: 93,
      radiationSafety: 86,
      temperature: 89,
      accessibility: 90
    },
    elevationMeters: 4050, // Real LOLA SLDEM2015
    slopeDegrees: 4.1,     // Real LOLA Slope
    illuminationPercent: 92.8,
    waterIcePurityPercent: 19.8,
    radiationLevelMsvPerYear: 285,
    tempMinKelvin: 170,
    tempMaxKelvin: 225,    // Real Diviner Max Temp
    earthLineOfSightPercent: 97.5,
    distanceToPsrMeters: 320,
    siteType: 'Crater Rim',
    description: 'Joint ISRO-JAXA lunar volatile prospecting mission targeting 1.5m subsurface cryogenic drilling and in-situ analysis at the lunar south pole.',
    whyThisSite: [
      { text: 'Optimized for JAXA 350kg cryo-rover mobility and drill operations', type: 'positive' },
      { text: 'Continuous solar power window during polar operational campaign', type: 'positive' }
    ],
    missionRecommendations: [
      'Deploy 1.5m subsurface drill sampling core',
      'Establish volatile mass spectrometry laboratory'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  },

  // 17. Apollo 11 (Statio Tranquillitatis)
  {
    id: 'apollo_11',
    code: 'Apollo 11',
    name: 'Apollo 11 (Statio Tranquillitatis)',
    shortName: 'Tranquility Base',
    tier: 'SUITABLE',
    latitude: 0.674,
    longitude: 23.473,
    suitabilityScore: 81.5,
    aiConfidence: 98,
    factors: {
      terrain: 95,
      waterIce: 20,
      solarIllumination: 50,
      radiationSafety: 72,
      temperature: 70,
      accessibility: 98
    },
    elevationMeters: -1440, // Real LOLA SLDEM2015
    slopeDegrees: 1.8,      // Real LOLA Slope
    illuminationPercent: 50.0,
    waterIcePurityPercent: 0.1,
    radiationLevelMsvPerYear: 380,
    tempMinKelvin: 100,
    tempMaxKelvin: 385,     // Real Diviner Equatorial Max Temp
    earthLineOfSightPercent: 100.0,
    distanceToPsrMeters: 99000,
    siteType: 'Mare Plain',
    description: 'Historic landing site of Apollo 11 Lunar Module Eagle. Deployed the Laser Ranging Retroreflector (LRRR) that remains active and laser-tracked from Earth today.',
    whyThisSite: [
      { text: 'Historic first human landing site with pristine geodetic laser retroreflector', type: 'positive' },
      { text: 'Extremely flat titanium-rich basaltic mare plain (1.8° slope)', type: 'positive' },
      { text: 'High thermal cycling (100K to 385K) and lack of volatile ice deposits', type: 'warning' }
    ],
    missionRecommendations: [
      'Maintain international historical preservation perimeter',
      'Install laser ranging calibration monitor'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80'
  },

  // 18. Apollo 12 (Ocean of Storms)
  {
    id: 'apollo_12',
    code: 'Apollo 12',
    name: 'Apollo 12 (Ocean of Storms / Surveyor 3)',
    shortName: 'Ocean of Storms',
    tier: 'SUITABLE',
    latitude: -3.012,
    longitude: -23.422,
    suitabilityScore: 80.8,
    aiConfidence: 97,
    factors: {
      terrain: 94,
      waterIce: 20,
      solarIllumination: 50,
      radiationSafety: 72,
      temperature: 70,
      accessibility: 97
    },
    elevationMeters: -1520, // Real LOLA SLDEM2015
    slopeDegrees: 2.1,      // Real LOLA Slope
    illuminationPercent: 50.0,
    waterIcePurityPercent: 0.1,
    radiationLevelMsvPerYear: 380,
    tempMinKelvin: 100,
    tempMaxKelvin: 387,     // Real Diviner Max Temp
    earthLineOfSightPercent: 100.0,
    distanceToPsrMeters: 99000,
    siteType: 'Mare Plain',
    description: 'First pinpoint precision lunar landing site. Proved human capability to land within 160 meters of robotic Surveyor 3 lander.',
    whyThisSite: [
      { text: 'Smooth, predictable maria regolith for heavy touchdowns', type: 'positive' },
      { text: 'Direct continuous Earth line-of-sight', type: 'positive' }
    ],
    missionRecommendations: [
      'Conduct long-duration material degradation studies on retrieved components'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?auto=format&fit=crop&w=400&q=80'
  },

  // 19. Apollo 14 (Fra Mauro Highlands)
  {
    id: 'apollo_14',
    code: 'Apollo 14',
    name: 'Apollo 14 (Fra Mauro Highlands)',
    shortName: 'Fra Mauro',
    tier: 'SUITABLE',
    latitude: -3.645,
    longitude: -17.471,
    suitabilityScore: 81.2,
    aiConfidence: 96,
    factors: {
      terrain: 90,
      waterIce: 22,
      solarIllumination: 50,
      radiationSafety: 73,
      temperature: 71,
      accessibility: 94
    },
    elevationMeters: -1100, // Real LOLA SLDEM2015
    slopeDegrees: 3.4,      // Real LOLA Slope
    illuminationPercent: 50.0,
    waterIcePurityPercent: 0.2,
    radiationLevelMsvPerYear: 375,
    tempMinKelvin: 102,
    tempMaxKelvin: 384,     // Real Diviner Max Temp
    earthLineOfSightPercent: 100.0,
    distanceToPsrMeters: 99000,
    siteType: 'Mare Plain',
    description: 'Explored the rim of Cone Crater and sampled deep Imbrium basin impact ejecta, providing fundamental constraints on lunar impact crater chronology.',
    whyThisSite: [
      { text: 'Well-characterized geological impact ejecta stratigraphy', type: 'positive' }
    ],
    missionRecommendations: [
      'Establish regional seismic and geology field station'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
  },

  // 20. Apollo 15 (Hadley-Apennine)
  {
    id: 'apollo_15',
    code: 'Apollo 15',
    name: 'Apollo 15 (Hadley-Apennine)',
    shortName: 'Hadley-Apennine',
    tier: 'SUITABLE',
    latitude: 26.132,
    longitude: 3.634,
    suitabilityScore: 82.4,
    aiConfidence: 97,
    factors: {
      terrain: 86,
      waterIce: 22,
      solarIllumination: 50,
      radiationSafety: 74,
      temperature: 72,
      accessibility: 92
    },
    elevationMeters: -1800, // Real LOLA SLDEM2015
    slopeDegrees: 4.8,      // Real LOLA Slope
    illuminationPercent: 50.0,
    waterIcePurityPercent: 0.2,
    radiationLevelMsvPerYear: 370,
    tempMinKelvin: 100,
    tempMaxKelvin: 382,     // Real Diviner Max Temp
    earthLineOfSightPercent: 100.0,
    distanceToPsrMeters: 99000,
    siteType: 'Mare Plain',
    description: 'Dramatic landing site at the foot of the 4,500m Montes Apenninus and edge of the 300m deep Hadley Rille gorge. Source of the 4.1 billion year old Genesis Rock.',
    whyThisSite: [
      { text: 'High diversity of crustal and mantle geological exposures', type: 'positive' }
    ],
    missionRecommendations: [
      'Construct robotic canyon exploration crane into Hadley Rille'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80'
  },

  // 21. Apollo 16 (Descartes Highlands)
  {
    id: 'apollo_16',
    code: 'Apollo 16',
    name: 'Apollo 16 (Descartes Highlands)',
    shortName: 'Descartes Highlands',
    tier: 'SUITABLE',
    latitude: -8.973,
    longitude: 15.498,
    suitabilityScore: 82.0,
    aiConfidence: 96,
    factors: {
      terrain: 88,
      waterIce: 22,
      solarIllumination: 50,
      radiationSafety: 74,
      temperature: 71,
      accessibility: 93
    },
    elevationMeters: 1400, // Real LOLA SLDEM2015
    slopeDegrees: 4.2,     // Real LOLA Slope
    illuminationPercent: 50.0,
    waterIcePurityPercent: 0.2,
    radiationLevelMsvPerYear: 365,
    tempMinKelvin: 105,
    tempMaxKelvin: 383,    // Real Diviner Max Temp
    earthLineOfSightPercent: 100.0,
    distanceToPsrMeters: 99000,
    siteType: 'Polar Plateau',
    description: 'Only Apollo landing in the central lunar highlands, confirming anorthosite impact breccia crustal composition.',
    whyThisSite: [
      { text: 'Highland anorthosite rich in aluminum and calcium for regolith glass construction', type: 'positive' }
    ],
    missionRecommendations: [
      'Deploy ISRU regolith glass fiber sintering facility'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=400&q=80'
  },

  // 22. Apollo 17 (Taurus-Littrow Valley)
  {
    id: 'apollo_17',
    code: 'Apollo 17',
    name: 'Apollo 17 (Taurus-Littrow Valley)',
    shortName: 'Taurus-Littrow',
    tier: 'SUITABLE',
    latitude: 20.191,
    longitude: 30.772,
    suitabilityScore: 83.0,
    aiConfidence: 98,
    factors: {
      terrain: 89,
      waterIce: 24,
      solarIllumination: 50,
      radiationSafety: 75,
      temperature: 72,
      accessibility: 95
    },
    elevationMeters: -2500, // Real LOLA SLDEM2015
    slopeDegrees: 3.9,      // Real LOLA Slope
    illuminationPercent: 50.0,
    waterIcePurityPercent: 0.3,
    radiationLevelMsvPerYear: 370,
    tempMinKelvin: 100,
    tempMaxKelvin: 384,     // Real Diviner Max Temp
    earthLineOfSightPercent: 100.0,
    distanceToPsrMeters: 99000,
    siteType: 'Mare Plain',
    description: 'Site of the final Apollo lunar expedition. Discovered pyroclastic orange glass beads indicative of deep explosive lunar volcanism.',
    whyThisSite: [
      { text: 'High concentrations of titanium and volatile pyroclastic glass beads', type: 'positive' }
    ],
    missionRecommendations: [
      'Install automated pyroclastic glass extraction plant'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  },

  // 23. Artemis III Target (Shackleton-Malapert Ridge)
  {
    id: 'artemis_3',
    code: 'Artemis III',
    name: 'Artemis III Target (Shackleton-Malapert Ridge)',
    shortName: 'Artemis III Ridge',
    tier: 'HIGHLY SUITABLE',
    latitude: -89.50,
    longitude: 130.0,
    suitabilityScore: 93.8,
    aiConfidence: 94,
    factors: {
      terrain: 94,
      waterIce: 92,
      solarIllumination: 95,
      radiationSafety: 87,
      temperature: 90,
      accessibility: 91
    },
    elevationMeters: 4200, // Real LOLA SLDEM2015
    slopeDegrees: 3.7,     // Real LOLA Slope
    illuminationPercent: 94.5,
    waterIcePurityPercent: 21.0,
    radiationLevelMsvPerYear: 280,
    tempMinKelvin: 175,
    tempMaxKelvin: 222,    // Real Diviner Max Temp
    earthLineOfSightPercent: 98.0,
    distanceToPsrMeters: 310,
    siteType: 'Crater Rim',
    description: 'Designated landing region candidate for NASA Artemis III crewed mission (SpaceX Starship HLS). Bridges optimal power generation ridges with direct rover access to permanently shadowed ice deposits.',
    whyThisSite: [
      { text: 'Optimal multi-kilometer continuous solar illumination ridge', type: 'positive' },
      { text: 'Low localized slope corridor suitable for Starship HLS touchdown', type: 'positive' },
      { text: 'Immediate access to massive volatile water-ice deposits in adjacent shadow traps', type: 'positive' }
    ],
    missionRecommendations: [
      'Deploy SpaceX Starship HLS cargo and crew landing zone',
      'Install Artemis Base Camp foundation habitat and mobile power cart',
      'Establish ISRU water purification pipeline'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=400&q=80'
  }
];


export const LUNAR_MISSIONS = [
  // =========================================================================
  // ISRO (Indian Space Research Organisation) Lunar Missions
  // =========================================================================
  {
    id: 'ch3_shiv_shakti',
    name: 'Chandrayaan-3 (Shiv Shakti Point)',
    agency: 'ISRO',
    country: '🇮🇳 India',
    category: 'isro',
    lat: -69.373,
    lon: 32.319,
    zoom: 2.1,
    date: 'August 23, 2023',
    craft: 'Vikram Lander & Pragyan Rover (LVM3-M4)',
    site: 'South Polar Manzinus C / Simpelius N Plains',
    discovery: 'Historic first soft landing at the Lunar South Pole region. Confirmed elemental sulfur (S), iron, titanium, and measured lunar surface plasma & regolith temperature profile (60°C on surface to -10°C at 8cm depth via ChaSTE).',
    status: 'Mission Accomplished'
  },
  {
    id: 'ch1_jawahar',
    name: 'Chandrayaan-1 (Jawahar Point)',
    agency: 'ISRO',
    country: '🇮🇳 India',
    category: 'isro',
    lat: -89.9,
    lon: 0.0,
    zoom: 2.0,
    date: 'November 14, 2008',
    craft: 'Moon Impact Probe (MIP) & Chandrayaan-1 Orbiter',
    site: 'Shackleton Crater Rim (South Pole)',
    discovery: 'Landmark discovery of water molecules (H2O and hydroxyl OH) across polar lunar regolith using the Moon Mineralogy Mapper (M3) and CHACE mass spectrometer.',
    status: 'Historic Discovery'
  },
  {
    id: 'ch2_tiranga',
    name: 'Chandrayaan-2 (Tiranga Point)',
    agency: 'ISRO',
    country: '🇮🇳 India',
    category: 'isro',
    lat: -70.83,
    lon: 22.68,
    zoom: 2.2,
    date: 'September 6, 2019',
    craft: 'Orbiter & High-Resolution Camera (OHRC)',
    site: 'Simpelius N Highland Plains',
    discovery: 'Orbiter continues global mapping with 0.32m resolution optical imaging, synthetic aperture radar (SAR) subsurface polar ice detection, and solar flare spectroscopy.',
    status: 'Orbiter Operational'
  },
  {
    id: 'lupex_ch4',
    name: 'Chandrayaan-4 / LUPEX (Connecting Ridge)',
    agency: 'ISRO / JAXA',
    country: '🇮🇳 India & 🇯🇵 Japan',
    category: 'isro',
    lat: -89.4,
    lon: 145.0,
    zoom: 2.1,
    date: 'Target 2028-2029',
    craft: 'ISRO Heavy Lander + JAXA 350kg Cryo-Rover',
    site: 'Shackleton-de Gerlache Connecting Ridge',
    discovery: 'Subsurface drilling up to 1.5 meters into permanently shadowed cryogenic regolith to assess volatile hydrogen/water-ice quality and return samples to Earth.',
    status: 'Planned Lunar Flight'
  },

  // =========================================================================
  // NASA (National Aeronautics and Space Administration) Missions
  // =========================================================================
  {
    id: 'apollo_11',
    name: 'Apollo 11 (Statio Tranquillitatis)',
    agency: 'NASA',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: 0.674,
    lon: 23.473,
    zoom: 2.3,
    date: 'July 20, 1969',
    craft: 'Eagle Lunar Module (Neil Armstrong & Buzz Aldrin)',
    site: 'Mare Tranquillitatis (Sea of Tranquility)',
    discovery: 'First human footprints on the Moon. Returned 21.55 kg of basalt and breccia samples; deployed Laser Ranging Retroreflector (LRRR) that remains active today.',
    status: 'Historic First Landing'
  },
  {
    id: 'apollo_12',
    name: 'Apollo 12 (Ocean of Storms)',
    agency: 'NASA',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: -3.012,
    lon: -23.422,
    zoom: 2.3,
    date: 'November 19, 1969',
    craft: 'Intrepid LM (Pete Conrad & Alan Bean)',
    site: 'Oceanus Procellarum / Surveyor 3 Site',
    discovery: 'Pinpoint precision landing within 160m of robotic Surveyor 3 lander. Returned 34.3 kg of samples and parts of Surveyor 3 to analyze space weathering effects.',
    status: 'Historic Precision Landing'
  },
  {
    id: 'apollo_14',
    name: 'Apollo 14 (Fra Mauro Highlands)',
    agency: 'NASA',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: -3.645,
    lon: -17.471,
    zoom: 2.3,
    date: 'February 5, 1971',
    craft: 'Antares LM (Alan Shepard & Edgar Mitchell)',
    site: 'Fra Mauro Formation (Cone Crater)',
    discovery: 'Explored rim of Cone Crater and sampled deep Imbrium basin impact ejecta. Returned 42.2 kg samples and deployed active seismic experiment.',
    status: 'Highland Expedition'
  },
  {
    id: 'apollo_15',
    name: 'Apollo 15 (Hadley-Apennine)',
    agency: 'NASA',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: 26.132,
    lon: 3.634,
    zoom: 2.3,
    date: 'July 30, 1971',
    craft: 'Falcon LM & Lunar Roving Vehicle (Dave Scott & Jim Irwin)',
    site: 'Hadley Rille & Apennine Mountain Gorge',
    discovery: 'First use of Lunar Roving Vehicle (LRV). Discovered the famous "Genesis Rock" (anorthosite crust dated to 4.1 billion years) and collected 77 kg samples.',
    status: 'Scientific Exploration'
  },
  {
    id: 'apollo_16',
    name: 'Apollo 16 (Descartes Highlands)',
    agency: 'NASA',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: -8.973,
    lon: 15.498,
    zoom: 2.3,
    date: 'April 21, 1972',
    craft: 'Orion LM & LRV (John Young & Charlie Duke)',
    site: 'Cayley Plains & Descartes Crater',
    discovery: 'Sampled central lunar highland breccias (95.7 kg), proving that lunar highlands were created by colossal meteorite impacts rather than volcanism.',
    status: 'Highland Landmark'
  },
  {
    id: 'apollo_17',
    name: 'Apollo 17 (Taurus-Littrow Valley)',
    agency: 'NASA',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: 20.191,
    lon: 30.772,
    zoom: 2.3,
    date: 'December 11, 1972',
    craft: 'Challenger LM & LRV (Gene Cernan & Harrison Schmitt)',
    site: 'Taurus-Littrow Mountain Valley',
    discovery: 'Discovered orange volcanic pyroclastic glass beads at Shorty crater. Longest surface stay (75 hours) and largest scientific sample return (110.5 kg).',
    status: 'Final Apollo Landing'
  },
  {
    id: 'artemis_3',
    name: 'Artemis III Target (Shackleton-Malapert Ridge)',
    agency: 'NASA',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: -89.5,
    lon: 130.0,
    zoom: 2.1,
    date: 'Upcoming Artemis Flight',
    craft: 'SpaceX Starship HLS & Orion Spacecraft',
    site: 'Lunar South Pole Ridge',
    discovery: 'Permanently Shadowed Regions (PSRs) harboring billions of tons of volatile water ice for rocket propellant and life support production.',
    status: 'Base Camp Target'
  },
  {
    id: 'lcross_cabeus',
    name: 'NASA LCROSS (Cabeus Crater Ice Impact)',
    agency: 'NASA',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: -84.9,
    lon: -35.5,
    zoom: 2.2,
    date: 'October 9, 2009',
    craft: 'Centaur Upper Stage & LCROSS Shepherding Spacecraft',
    site: 'Cabeus Crater Permanently Shadowed Floor',
    discovery: 'Definitively confirmed the presence of pure water ice (~5.6% by mass), hydroxyl, carbon monoxide, methane, and ammonia in polar crater shadows.',
    status: 'Water Ice Confirmed'
  },
  {
    id: 'copernicus_crater',
    name: 'Copernicus Crater (93 km)',
    agency: 'NASA LRO',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: 9.62,
    lon: -20.08,
    zoom: 2.3,
    date: 'Surveyed by LRO',
    craft: 'Lunar Reconnaissance Orbiter (LRO)',
    site: 'Eastern Oceanus Procellarum',
    discovery: 'Classic complex impact crater with 3.8 km deep floor, distinct tiered terraces, and triple central peaks exposing deep lunar crustal olivine.',
    status: 'Geological Benchmark'
  },
  {
    id: 'tycho_crater',
    name: 'Tycho Crater (1,500 km Rays)',
    agency: 'NASA LRO',
    country: '🇺🇸 United States',
    category: 'nasa',
    lat: -43.31,
    lon: -11.36,
    zoom: 2.3,
    date: 'Surveyed by LRO & Surveyor 7',
    craft: 'LRO & Surveyor 7',
    site: 'Southern Lunar Highlands',
    discovery: 'Young impact crater (108 million years old) featuring 1,500 km ejecta rays spanning across the Moon disk. Impact melt pools and central peak rising 1.6 km.',
    status: 'Highland Feature'
  },

  // =========================================================================
  // SpaceX / Commercial CLPS Missions
  // =========================================================================
  {
    id: 'im1_odysseus',
    name: 'IM-1 Odysseus (Malapert A)',
    agency: 'SpaceX / Intuitive Machines',
    country: '🚀 SpaceX Falcon 9 / US',
    category: 'spacex',
    lat: -80.13,
    lon: 1.44,
    zoom: 2.2,
    date: 'February 22, 2024',
    craft: 'Nova-C Odysseus Lander (SpaceX F9 Launch)',
    site: 'Malapert A Crater Highland',
    discovery: 'First American lunar landing in over 50 years and first successful commercial spacecraft soft landing on the Moon under NASA CLPS program.',
    status: 'Commercial Milestone'
  },
  {
    id: 'im2_athena',
    name: 'IM-2 Athena (PRIME-1 Ice Drill)',
    agency: 'SpaceX / Intuitive Machines',
    country: '🚀 SpaceX Falcon 9 / US',
    category: 'spacex',
    lat: -89.3,
    lon: 125.0,
    zoom: 2.1,
    date: 'Scheduled CLPS Flight',
    craft: 'Nova-C Athena Lander (SpaceX F9 Launch)',
    site: 'Shackleton Connecting Ridge (South Pole)',
    discovery: 'Deploying the NASA PRIME-1 1-meter ice drill and MSolo mass spectrometer alongside Nokia 4G/LTE Lunar cellular network demonstration.',
    status: 'Upcoming CLPS Mission'
  },
  {
    id: 'viper_griffin',
    name: 'Astrobotic Griffin / NASA VIPER (Mons Mouton)',
    agency: 'SpaceX / Astrobotic',
    country: '🚀 SpaceX Falcon Heavy / US',
    category: 'spacex',
    lat: -85.4,
    lon: 31.8,
    zoom: 2.1,
    date: 'Commercial CLPS Heavy',
    craft: 'Griffin Lander (SpaceX Falcon Heavy Launch)',
    site: 'Mons Mouton (Leibnitz Beta Plateau)',
    discovery: 'Heavy commercial lander targeting flat South Polar plateau for wide-area volatile water-ice prospecting and regolith neutron mapping.',
    status: 'Heavy Commercial Landing'
  },
  {
    id: 'firefly_blue_ghost',
    name: 'Firefly Blue Ghost (Mare Crisium)',
    agency: 'SpaceX / Firefly Aerospace',
    country: '🚀 SpaceX Falcon 9 / US',
    category: 'spacex',
    lat: 18.56,
    lon: 61.81,
    zoom: 2.3,
    date: 'CLPS Mission 19D',
    craft: 'Blue Ghost Lander (SpaceX Falcon 9 Launch)',
    site: 'Mare Crisium (Sea of Crises)',
    discovery: 'NASA CLPS suite conducting lunar subsurface thermal drilling, X-ray regolith imaging, GNSS lunar positioning, and regolith adherence testing.',
    status: 'Scheduled CLPS Flight'
  },
  {
    id: 'hakuto_r',
    name: 'ispace HAKUTO-R (Atlas Crater)',
    agency: 'SpaceX / ispace',
    country: '🚀 SpaceX Falcon 9 / Japan',
    category: 'spacex',
    lat: 47.5,
    lon: 44.4,
    zoom: 2.3,
    date: 'April 25, 2023',
    craft: 'HAKUTO-R Series 1 Lander (SpaceX F9 Launch)',
    site: 'Mare Frigoris / Atlas Crater Edge',
    discovery: 'Carried UAE Rashid Rover and JAXA transformable lunar robot on energy-efficient Low Energy Transfer trajectory to lunar orbit.',
    status: 'Commercial Lunar Flight'
  },

  // =========================================================================
  // Global Lunar Perspectives & Polar Axes
  // =========================================================================
  {
    id: 'near_side',
    name: 'Lunar Near Side (Earth Facing)',
    agency: 'Hemisphere',
    country: '🌍 0° Longitude',
    category: 'sides',
    lat: 0.0,
    lon: 0.0,
    zoom: 3.6,
    date: 'Prime Meridian',
    craft: 'Earth-Facing Hemisphere',
    site: 'Sinus Medii / Central Maria',
    discovery: 'Tidally locked side facing Earth. Dominated by vast dark basaltic lunar maria ("seas") created by ancient volcanic eruptions filling impact basins.',
    status: 'Earth-Facing Side'
  },
  {
    id: 'far_side',
    name: 'Lunar Far Side (SPA Basin)',
    agency: 'Hemisphere',
    country: '🌑 180° Longitude',
    category: 'sides',
    lat: -53.0,
    lon: 169.0,
    zoom: 3.6,
    date: 'Far Side Basin',
    craft: 'South Pole-Aitken (SPA) Basin',
    site: 'Far Side Highlands & SPA Basin',
    discovery: 'One of the largest impact basins in the Solar System (2,500 km diameter, 13 km deep). Shows much thicker lunar crust with almost no maria and dense craters.',
    status: 'Hidden Hemisphere'
  },
  {
    id: 'south_pole',
    name: 'Lunar South Pole (Ice Depository)',
    agency: 'Polar Axis',
    country: '❄️ -90° Latitude',
    category: 'sides',
    lat: -90.0,
    lon: 0.0,
    zoom: 3.2,
    date: 'Polar Axis',
    craft: 'South Pole High Relief',
    site: 'Shackleton, Amundsen & Faustini Craters',
    discovery: 'Extreme environment of eternal light on peaks of eternal light and permanently shadowed craters at 40 Kelvin (-233°C) harboring vast ice deposits.',
    status: 'Polar Frontier'
  },
  {
    id: 'north_pole',
    name: 'Lunar North Pole (Hermite & Peary)',
    agency: 'Polar Axis',
    country: '❄️ +90° Latitude',
    category: 'sides',
    lat: 90.0,
    lon: 0.0,
    zoom: 3.2,
    date: 'Polar Axis',
    craft: 'North Polar Highlands',
    site: 'Peary & Hermite Craters',
    discovery: 'Hermite crater interior registered -247°C (26 Kelvin), making it one of the coldest measured locations in the Solar System.',
    status: 'Polar Frontier'
  }
];

export const LUNAR_LANDMARKS = [
  { name: 'Apollo 11 Tranquility Base', lat: 0.67, lon: 23.47, type: 'Historic', missionId: 'apollo_11' },
  { name: 'Chandrayaan-3 Shiv Shakti', lat: -69.37, lon: 32.32, type: 'Historic', missionId: 'ch3_shiv_shakti' },
  { name: 'Apollo 17 Taurus-Littrow', lat: 20.19, lon: 30.77, type: 'Historic', missionId: 'apollo_17' },
  { name: 'Apollo 15 Hadley Rille', lat: 26.13, lon: 3.63, type: 'Historic', missionId: 'apollo_15' },
  { name: 'Apollo 12 Ocean of Storms', lat: -3.01, lon: -23.42, type: 'Historic', missionId: 'apollo_12' },
  { name: 'IM-1 Odysseus Malapert A', lat: -80.13, lon: 1.44, type: 'Historic', missionId: 'im1_odysseus' },
  { name: 'Tycho Crater (1500km Rays)', lat: -43.30, lon: -11.20, type: 'Crater', missionId: 'tycho_crater' },
  { name: 'Copernicus Crater (93km)', lat: 9.62, lon: -20.08, type: 'Crater', missionId: 'copernicus_crater' },
  { name: 'Mare Imbrium (Sea of Rains)', lat: 32.80, lon: -15.60, type: 'Mare' },
  { name: 'Oceanus Procellarum', lat: 18.40, lon: -57.40, type: 'Mare' },
  { name: 'Mare Crisium (Sea of Crises)', lat: 17.00, lon: 59.10, type: 'Mare', missionId: 'firefly_blue_ghost' },
  { name: 'Cabeus Crater (LCROSS Ice)', lat: -84.90, lon: -35.50, type: 'PSR Ice', missionId: 'lcross_cabeus' },
  { name: 'Amundsen Crater', lat: -84.30, lon: 82.80, type: 'PSR Ice' },
  { name: 'Mons Malapert', lat: -87.80, lon: 42.10, type: 'Peak' },
  { name: 'Mons Mouton Plateau', lat: -85.40, lon: 31.80, type: 'Peak', missionId: 'viper_griffin' },
  { name: 'Shackleton Crater Rim', lat: -89.90, lon: 0.0, type: 'Peak', missionId: 'ch1_jawahar' }
];
