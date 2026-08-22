import aiPredictionsData from './ai_predictions.json';

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

const RAW_LUNAR_SITES = [
  {
    "id": "site-shackleton",
    "code": "Shackleton",
    "name": "Shackleton Crater Rim \u2014 Peak of Eternal Light",
    "shortName": "Shackleton Crater Rim",
    "tier": "HIGHLY SUITABLE",
    "latitude": -89.28,
    "longitude": 15.4,
    "suitabilityScore": 94.2,
    "aiConfidence": 94,
    "factors": {
      "terrain": 94,
      "waterIce": 89,
      "solarIllumination": 97,
      "radiationSafety": 84,
      "temperature": 90,
      "accessibility": 82
    },
    "elevationMeters": 4120,
    "slopeDegrees": 4.2,
    "illuminationPercent": 95.2,
    "waterIcePurityPercent": 19.5,
    "radiationLevelMsvPerYear": 280,
    "tempMinKelvin": 180,
    "tempMaxKelvin": 220,
    "earthLineOfSightPercent": 98.4,
    "distanceToPsrMeters": 350,
    "siteType": "Crater Rim",
    "description": "Premier candidate on the high rim crest of Shackleton Crater near the true lunar South Pole. Features near-continuous solar illumination and immediate ridge access to permanently shadowed volatile reserves.",
    "whyThisSite": [
      {
        "text": "Peak of Eternal Light: >95% annual solar illumination along ridge",
        "type": "positive"
      },
      {
        "text": "Direct adjacent access to deep Shackleton PSR cold trap",
        "type": "positive"
      },
      {
        "text": "Gentle localized slope (4.2\u00b0) along primary crest line",
        "type": "positive"
      },
      {
        "text": "Direct continuous Line-of-Sight to Earth ground telemetry stations",
        "type": "positive"
      },
      {
        "text": "Precision touchdown required to avoid steep internal wall gradients",
        "type": "warning"
      }
    ],
    "missionRecommendations": [
      "Deploy 100kW photovoltaic array along crest peak",
      "Establish primary pressurized habitat modules in micro-depression zone",
      "Deploy tethered autonomous cryo-rover into Shackleton PSR for water ice mining",
      "Install Ka-band optical communication direct Earth relay terminal"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Shackleton Crater Rim Crest Illuminated Ridge",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Artemis Polar Human Landing System (HLS)",
        "overlayText": "View Lander"
      },
      {
        "url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Polar Terrain Rover Ice Prospecting Traverse",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "alt_text": "LOLA SLDEM2015 Laser Altimetry Topography",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "site-malapert",
    "code": "Malapert",
    "name": "Mons Malapert (Malapert Mountain Plateau)",
    "shortName": "Mons Malapert Plateau",
    "tier": "HIGHLY SUITABLE",
    "latitude": -85.99,
    "longitude": 12.9,
    "suitabilityScore": 91.8,
    "aiConfidence": 93,
    "factors": {
      "terrain": 88,
      "waterIce": 83,
      "solarIllumination": 96,
      "radiationSafety": 86,
      "temperature": 88,
      "accessibility": 85
    },
    "elevationMeters": 5100,
    "slopeDegrees": 6.1,
    "illuminationPercent": 93.6,
    "waterIcePurityPercent": 17.2,
    "radiationLevelMsvPerYear": 290,
    "tempMinKelvin": 175,
    "tempMaxKelvin": 225,
    "earthLineOfSightPercent": 99.2,
    "distanceToPsrMeters": 620,
    "siteType": "Polar Plateau",
    "description": "Massive elevated massif offering exceptional continuous line-of-sight communication to Earth and outstanding long-duration solar exposure for high-output power generation.",
    "whyThisSite": [
      {
        "text": "Unsurpassed 99.2% uninterrupted direct line-of-sight to Earth",
        "type": "positive"
      },
      {
        "text": "High 5100m elevation above surrounding impact plains",
        "type": "positive"
      },
      {
        "text": "Extensive summit plateau accommodating multi-module layout",
        "type": "positive"
      },
      {
        "text": "Slightly longer rover traverse required to reach deep PSR ice deposits",
        "type": "warning"
      }
    ],
    "missionRecommendations": [
      "Construct primary Earth-Moon deep space telecommunications relay tower",
      "Establish multi-building scientific base camp on summit plateau",
      "Deploy solar tracking farm with battery storage modules",
      "Build automated landing zone on adjacent lower gradient shelf"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Mons Malapert Summit Panoramic Vista",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "High Altitude Comms Array Station",
        "overlayText": "View Facility"
      },
      {
        "url": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Malapert Mountain 3D Topographic Mesh",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "site-faustini",
    "code": "Faustini A",
    "name": "Faustini Crater Rim \u2014 Ridge A",
    "shortName": "Faustini Ridge A",
    "tier": "SUITABLE",
    "latitude": -87.15,
    "longitude": 77.0,
    "suitabilityScore": 83.4,
    "aiConfidence": 89,
    "factors": {
      "terrain": 80,
      "waterIce": 95,
      "solarIllumination": 78,
      "radiationSafety": 82,
      "temperature": 81,
      "accessibility": 76
    },
    "elevationMeters": 2450,
    "slopeDegrees": 8.5,
    "illuminationPercent": 77.5,
    "waterIcePurityPercent": 24.2,
    "radiationLevelMsvPerYear": 310,
    "tempMinKelvin": 150,
    "tempMaxKelvin": 230,
    "earthLineOfSightPercent": 88.5,
    "distanceToPsrMeters": 180,
    "siteType": "Crater Rim",
    "description": "High-priority volatile prospecting zone with exceptional water-ice concentrations identified by LEND and Diviner thermal mapping.",
    "whyThisSite": [
      {
        "text": "Extremely high water-ice signature (>24% estimated concentration)",
        "type": "positive"
      },
      {
        "text": "Ultra-short 180m access corridor into cold trap floor",
        "type": "positive"
      },
      {
        "text": "Steeper localized slopes (8.5\u00b0) require engineered landing pad",
        "type": "warning"
      },
      {
        "text": "Intermittent Earth line-of-sight requiring orbital relay support",
        "type": "warning"
      }
    ],
    "missionRecommendations": [
      "Deploy specialized ISRU cryo-extraction mining station",
      "Install autonomous winch-assisted rover descent cable system",
      "Establish compact nuclear/fuel-cell supplemental power source"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Faustini Volatile Cold Trap Basin",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "ISRU Water Sintering Plant",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "site-connecting-ridge",
    "code": "Connecting Ridge",
    "name": "Connecting Ridge (Shackleton-de Gerlache)",
    "shortName": "Connecting Ridge",
    "tier": "HIGHLY SUITABLE",
    "latitude": -88.6,
    "longitude": -31.7,
    "suitabilityScore": 89.6,
    "aiConfidence": 92,
    "factors": {
      "terrain": 92,
      "waterIce": 86,
      "solarIllumination": 91,
      "radiationSafety": 83,
      "temperature": 87,
      "accessibility": 90
    },
    "elevationMeters": 3850,
    "slopeDegrees": 3.8,
    "illuminationPercent": 89.5,
    "waterIcePurityPercent": 18.0,
    "radiationLevelMsvPerYear": 285,
    "tempMinKelvin": 170,
    "tempMaxKelvin": 224,
    "earthLineOfSightPercent": 94.2,
    "distanceToPsrMeters": 290,
    "siteType": "Crater Rim",
    "description": "A continuous elevated saddle connecting Shackleton and de Gerlache craters. Features gentle slopes, wide corridors for rover movement, and balanced solar illumination.",
    "whyThisSite": [
      {
        "text": "Gentle 3.8\u00b0 slope ideal for base construction and heavy rover traverse",
        "type": "positive"
      },
      {
        "text": "Direct access to both Shackleton and de Gerlache volatile basins",
        "type": "positive"
      },
      {
        "text": "Dual-basin logistical mobility corridor",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Construct modular habitat along central flat crest",
      "Establish dual-direction rover transport highway",
      "Install high-efficiency solar-thermal generation array"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Connecting Ridge Traverse Route",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Artemis Polar Base Camp Layout",
        "overlayText": "View Base"
      }
    ]
  },
  {
    "id": "site-de-gerlache",
    "code": "de Gerlache",
    "name": "de Gerlache Rim \u2014 Mons Peak Alpha",
    "shortName": "de Gerlache Peak Alpha",
    "tier": "SUITABLE",
    "latitude": -85.9,
    "longitude": 76.3,
    "suitabilityScore": 84.1,
    "aiConfidence": 88,
    "factors": {
      "terrain": 82,
      "waterIce": 91,
      "solarIllumination": 84,
      "radiationSafety": 80,
      "temperature": 83,
      "accessibility": 79
    },
    "elevationMeters": 2900,
    "slopeDegrees": 7.2,
    "illuminationPercent": 83.5,
    "waterIcePurityPercent": 21.8,
    "radiationLevelMsvPerYear": 300,
    "tempMinKelvin": 160,
    "tempMaxKelvin": 228,
    "earthLineOfSightPercent": 90.1,
    "distanceToPsrMeters": 220,
    "siteType": "Crater Rim",
    "description": "High ridge along de Gerlache crater rim with consistent solar exposure and proximity to extensive water-ice deposits.",
    "whyThisSite": [
      {
        "text": "Rich volatile signatures in adjacent de Gerlache interior",
        "type": "positive"
      },
      {
        "text": "Good solar exposure on elevated rim features",
        "type": "positive"
      },
      {
        "text": "Moderate terrain roughness requiring precision hazard detection",
        "type": "warning"
      }
    ],
    "missionRecommendations": [
      "Deploy autonomous scientific survey outpost",
      "Establish secondary power relay station",
      "Deploy robotic ice sampler"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "alt_text": "de Gerlache Crater Rim",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "site-haworth",
    "code": "Haworth",
    "name": "Haworth Crater Rim North",
    "shortName": "Haworth Crater Rim",
    "tier": "SUITABLE",
    "latitude": -87.4,
    "longitude": -5.1,
    "suitabilityScore": 85.8,
    "aiConfidence": 90,
    "factors": {
      "terrain": 84,
      "waterIce": 91,
      "solarIllumination": 83,
      "radiationSafety": 82,
      "temperature": 85,
      "accessibility": 82
    },
    "elevationMeters": 3100,
    "slopeDegrees": 5.4,
    "illuminationPercent": 82.8,
    "waterIcePurityPercent": 20.1,
    "radiationLevelMsvPerYear": 295,
    "tempMinKelvin": 165,
    "tempMaxKelvin": 226,
    "earthLineOfSightPercent": 91.8,
    "distanceToPsrMeters": 260,
    "siteType": "Crater Rim",
    "description": "Northern rim plateau overlooking the deep Haworth PSR with confirmed extensive volatile cold traps.",
    "whyThisSite": [
      {
        "text": "Direct access to one of the coldest PSRs on the Moon (<40K)",
        "type": "positive"
      },
      {
        "text": "Moderate slope and good structural foundation",
        "type": "positive"
      },
      {
        "text": "Consistent communication angles with Earth",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Deploy extreme-cold cryogenic rover system",
      "Establish volatile characterization laboratory",
      "Build automated solar generation field"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Haworth North Rim Topography",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "site-mons-mouton",
    "code": "Mons Mouton",
    "name": "Mons Mouton (Leibnitz Beta Plateau)",
    "shortName": "Mons Mouton Plateau",
    "tier": "HIGHLY SUITABLE",
    "latitude": -85.1,
    "longitude": 31.5,
    "suitabilityScore": 92.6,
    "aiConfidence": 95,
    "factors": {
      "terrain": 96,
      "waterIce": 81,
      "solarIllumination": 94,
      "radiationSafety": 88,
      "temperature": 89,
      "accessibility": 92
    },
    "elevationMeters": 5900,
    "slopeDegrees": 2.9,
    "illuminationPercent": 93.8,
    "waterIcePurityPercent": 16.5,
    "radiationLevelMsvPerYear": 275,
    "tempMinKelvin": 178,
    "tempMaxKelvin": 221,
    "earthLineOfSightPercent": 99.0,
    "distanceToPsrMeters": 480,
    "siteType": "Polar Plateau",
    "description": "Massive, flat-topped mountain plateau (VIPER landing target region). Exceptional 2.9\u00b0 flat terrain and highest summit elevation in the South Pole area.",
    "whyThisSite": [
      {
        "text": "Ultra-flat plateau terrain (2.9\u00b0 slope) perfectly suited for heavy landers",
        "type": "positive"
      },
      {
        "text": "Highest elevation (5900m) with 99.0% direct Earth line-of-sight",
        "type": "positive"
      },
      {
        "text": "Broad summit allowing extensive habitat and landing infrastructure",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Construct primary lunar spaceport and heavy logistics landing pad",
      "Deploy long-term science and residential habitat city",
      "Install high-gain Earth deep space network antenna complex"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Mons Mouton Flat Summit Tableland",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "VIPER Rover Exploration Zone",
        "overlayText": "View Rover"
      }
    ]
  },
  {
    "id": "site-nobile",
    "code": "Nobile",
    "name": "Nobile Crater Rim \u2014 Artemis Base Alpha",
    "shortName": "Nobile Crater Rim",
    "tier": "SUITABLE",
    "latitude": -85.2,
    "longitude": 53.5,
    "suitabilityScore": 87.5,
    "aiConfidence": 91,
    "factors": {
      "terrain": 88,
      "waterIce": 88,
      "solarIllumination": 87,
      "radiationSafety": 84,
      "temperature": 86,
      "accessibility": 86
    },
    "elevationMeters": 3400,
    "slopeDegrees": 4.8,
    "illuminationPercent": 86.8,
    "waterIcePurityPercent": 19.0,
    "radiationLevelMsvPerYear": 290,
    "tempMinKelvin": 170,
    "tempMaxKelvin": 225,
    "earthLineOfSightPercent": 93.5,
    "distanceToPsrMeters": 310,
    "siteType": "Crater Rim",
    "description": "Selected NASA VIPER rover traverse target region. Excellent balance of surface trafficability, solar power availability, and accessible shadowed volatiles.",
    "whyThisSite": [
      {
        "text": "Extensive ground-truth traverse planning already completed by NASA VIPER team",
        "type": "positive"
      },
      {
        "text": "Moderate slopes with direct access to shadowed ice pockets",
        "type": "positive"
      },
      {
        "text": "Reliable communications and solar illumination profiles",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Deploy autonomous mobile prospecting rover network",
      "Establish mid-scale habitat outpost",
      "Install localized ISRU refueling station"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Nobile Rim Rover Traverse Route",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "site-i",
    "code": "Amundsen",
    "name": "Amundsen Crater Floor & Rim (Site I)",
    "shortName": "Amundsen Crater",
    "tier": "MODERATE",
    "latitude": -84.5,
    "longitude": 82.8,
    "suitabilityScore": 80.2,
    "aiConfidence": 87,
    "factors": {
      "terrain": 78,
      "waterIce": 89,
      "solarIllumination": 75,
      "radiationSafety": 81,
      "temperature": 80,
      "accessibility": 77
    },
    "elevationMeters": 1800,
    "slopeDegrees": 6.8,
    "illuminationPercent": 75.2,
    "waterIcePurityPercent": 21.0,
    "radiationLevelMsvPerYear": 315,
    "tempMinKelvin": 140,
    "tempMaxKelvin": 235,
    "earthLineOfSightPercent": 86.4,
    "distanceToPsrMeters": 210,
    "siteType": "Crater Rim",
    "description": "Large complex impact crater with prominent central peaks and extensive cold trap floor deposits.",
    "whyThisSite": [
      {
        "text": "Deep cold trap volatiles within crater floor",
        "type": "positive"
      },
      {
        "text": "Prominent central peak geological interest",
        "type": "positive"
      },
      {
        "text": "Higher slope variance along rim walls",
        "type": "warning"
      }
    ],
    "missionRecommendations": [
      "Deploy deep seismic sensor network",
      "Establish crater-floor resource extraction pilot",
      "Set up orbital relay-assisted telemetry node"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Amundsen Crater Complex",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "site-j",
    "code": "Marius Hills",
    "name": "Marius Hills Lava Tube Skylight (Site J)",
    "shortName": "Marius Hills Skylight",
    "tier": "SUITABLE",
    "latitude": 14.2,
    "longitude": -56.7,
    "suitabilityScore": 86.7,
    "aiConfidence": 93,
    "factors": {
      "terrain": 82,
      "waterIce": 46,
      "solarIllumination": 52,
      "radiationSafety": 99,
      "temperature": 96,
      "accessibility": 80
    },
    "elevationMeters": -1200,
    "slopeDegrees": 12.0,
    "illuminationPercent": 52.0,
    "waterIcePurityPercent": 2.0,
    "radiationLevelMsvPerYear": 45,
    "tempMinKelvin": 250,
    "tempMaxKelvin": 255,
    "earthLineOfSightPercent": 100.0,
    "distanceToPsrMeters": 450000,
    "siteType": "Lava Tube",
    "description": "Natural sub-surface volcanic lava tube skylight entrance. Provides 99% cosmic ray radiation shielding and a constant natural thermal equilibrium of ~ -20\u00b0C (253K).",
    "whyThisSite": [
      {
        "text": "Maximum natural radiation shielding (45 mSv/yr vs 300+ mSv/yr on surface)",
        "type": "positive"
      },
      {
        "text": "Stable constant internal temperature (~253K / -20\u00b0C) eliminating thermal cycling",
        "type": "positive"
      },
      {
        "text": "Complete micrometeorite impact protection beneath basalt ceiling",
        "type": "positive"
      },
      {
        "text": "Equatorial location requires nuclear or high-capacity battery power for 14-day night",
        "type": "warning"
      }
    ],
    "missionRecommendations": [
      "Deploy autonomous spelunking crawler into subsurface tube cavern",
      "Establish subterranean pressurized habitat modules inside tube",
      "Install surface elevator and crane system at skylight portal",
      "Deploy nuclear fission surface power (FSP) unit on surface above"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / JAXA / Kaguya / LROC NAC (M111578606LE)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Marius Hills Lava Tube Skylight Portal",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Subterranean Inflatable Habitat Concept",
        "overlayText": "View Interior"
      }
    ]
  },
  {
    "id": "site-k",
    "code": "Cabeus",
    "name": "Cabeus Crater (LCROSS Ground Zero)",
    "shortName": "Cabeus Crater PSR",
    "tier": "SUITABLE",
    "latitude": -84.9,
    "longitude": -35.5,
    "suitabilityScore": 84.8,
    "aiConfidence": 96,
    "factors": {
      "terrain": 78,
      "waterIce": 97,
      "solarIllumination": 74,
      "radiationSafety": 83,
      "temperature": 82,
      "accessibility": 76
    },
    "elevationMeters": 2100,
    "slopeDegrees": 6.9,
    "illuminationPercent": 73.5,
    "waterIcePurityPercent": 26.5,
    "radiationLevelMsvPerYear": 310,
    "tempMinKelvin": 40,
    "tempMaxKelvin": 230,
    "earthLineOfSightPercent": 87.2,
    "distanceToPsrMeters": 120,
    "siteType": "PSR Basin",
    "description": "Proven site of NASA LCROSS impact (2009) confirming direct evidence of pure water ice (5.6% by mass in ejecta plume), hydroxyl, methane, and ammonia in permanent shadow.",
    "whyThisSite": [
      {
        "text": "Confirmed ground-truth water ice from NASA LCROSS kinetic impactor",
        "type": "positive"
      },
      {
        "text": "Highest volatile diversity (water, methane, ammonia, CO2)",
        "type": "positive"
      },
      {
        "text": "Extreme cold temperatures (<40K) require heated robotic rovers",
        "type": "warning"
      }
    ],
    "missionRecommendations": [
      "Establish heavy industrial cryogenic ice processing facility",
      "Deploy autonomous thermal heating sublimation tents",
      "Install high-power microwave energy beaming relay from crater rim"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / LCROSS / LRO Diviner Thermal Radiometer",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Cabeus Crater LCROSS Impact Site",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "site-l",
    "code": "Shoemaker",
    "name": "Shoemaker Crater Rim South (Site L)",
    "shortName": "Shoemaker Crater Rim",
    "tier": "SUITABLE",
    "latitude": -88.1,
    "longitude": 44.9,
    "suitabilityScore": 86.5,
    "aiConfidence": 91,
    "factors": {
      "terrain": 85,
      "waterIce": 89,
      "solarIllumination": 85,
      "radiationSafety": 84,
      "temperature": 86,
      "accessibility": 84
    },
    "elevationMeters": 3300,
    "slopeDegrees": 5.1,
    "illuminationPercent": 85.2,
    "waterIcePurityPercent": 20.4,
    "radiationLevelMsvPerYear": 290,
    "tempMinKelvin": 165,
    "tempMaxKelvin": 224,
    "earthLineOfSightPercent": 92.4,
    "distanceToPsrMeters": 270,
    "siteType": "Crater Rim",
    "description": "Southern rim ridge overlooking Shoemaker PSR. High concentration of hydrogen detected by Lunar Prospector and LRO LEND neutron spectrometers.",
    "whyThisSite": [
      {
        "text": "Strong hydrogen neutron suppression signature indicating water ice",
        "type": "positive"
      },
      {
        "text": "Stable ridge topology with good landing approach paths",
        "type": "positive"
      },
      {
        "text": "Proximity to Faustini and Shackleton exploration sectors",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Deploy long-range autonomous scouting rovers",
      "Establish regional polar power station",
      "Build intermediate communications repeaters"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Shoemaker Crater Rim Altimetry",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "ch3_shiv_shakti",
    "code": "Shiv Shakti",
    "name": "Chandrayaan-3 (Shiv Shakti Point)",
    "shortName": "Shiv Shakti Point",
    "tier": "SUITABLE",
    "latitude": -69.373,
    "longitude": 32.319,
    "suitabilityScore": 83.2,
    "aiConfidence": 92,
    "factors": {
      "terrain": 88,
      "waterIce": 72,
      "solarIllumination": 80,
      "radiationSafety": 76,
      "temperature": 78,
      "accessibility": 91
    },
    "elevationMeters": -2580,
    "slopeDegrees": 3.1,
    "illuminationPercent": 80.0,
    "waterIcePurityPercent": 14.5,
    "radiationLevelMsvPerYear": 310,
    "tempMinKelvin": 150,
    "tempMaxKelvin": 333,
    "earthLineOfSightPercent": 94.0,
    "distanceToPsrMeters": 850,
    "siteType": "Polar Plateau",
    "description": "Historic soft-landing site of ISRO Chandrayaan-3 (Vikram lander & Pragyan rover). Situated on the high southern highland plains between Manzinus C and Simpelius N. Confirmed elemental sulfur, iron, and titanium regolith compositions.",
    "whyThisSite": [
      {
        "text": "Gentle, wide landing corridor with 3.1\u00b0 localized slope profile",
        "type": "positive"
      },
      {
        "text": "ISRO ChaSTE thermal probe validated subsurface temperature gradient",
        "type": "positive"
      },
      {
        "text": "Direct line-of-sight to Indian Deep Space Network (IDSN) & NASA DSN",
        "type": "positive"
      },
      {
        "text": "Periodic 14-day lunar night requiring radioisotope thermal heater units (RHU)",
        "type": "warning"
      }
    ],
    "missionRecommendations": [
      "Establish South Pole Highland Science Outpost",
      "Deploy autonomous ISRU sulfur-concrete sintering plant",
      "Construct deep cryogenic drill testbed based on Pragyan APXS ground data"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "ISRO / NASA / Chandrayaan-3 Lander Imager & OHRC",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Chandrayaan-3 Vikram Lander on Shiv Shakti Point",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Pragyan Rover Ramp Deployment",
        "overlayText": "View Rover"
      }
    ]
  },
  {
    "id": "ch1_jawahar",
    "code": "Jawahar Point",
    "name": "Chandrayaan-1 (Jawahar Point)",
    "shortName": "Jawahar Point",
    "tier": "SUITABLE",
    "latitude": -89.9,
    "longitude": 0.0,
    "suitabilityScore": 88.4,
    "aiConfidence": 95,
    "factors": {
      "terrain": 82,
      "waterIce": 92,
      "solarIllumination": 91,
      "radiationSafety": 85,
      "temperature": 88,
      "accessibility": 80
    },
    "elevationMeters": 3950,
    "slopeDegrees": 5.0,
    "illuminationPercent": 91.5,
    "waterIcePurityPercent": 22.0,
    "radiationLevelMsvPerYear": 285,
    "tempMinKelvin": 170,
    "tempMaxKelvin": 225,
    "earthLineOfSightPercent": 97.5,
    "distanceToPsrMeters": 280,
    "siteType": "Crater Rim",
    "description": "Historic impact site of ISRO Moon Impact Probe (MIP) on Nov 14, 2008, confirming water molecules across the lunar polar regolith. Highly strategic ridge crest overlooking Shackleton interior.",
    "whyThisSite": [
      {
        "text": "Historic proven location for polar hydroxyl/water ice concentration",
        "type": "positive"
      },
      {
        "text": "High annual sunlight availability (>91%) along southern polar crest",
        "type": "positive"
      },
      {
        "text": "Immediate adjacent descent path into deep cold trap volatiles",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Install ISRO-NASA International Joint Polar Research Observatory",
      "Deploy autonomous continuous water extraction prototype",
      "Set up optical laser communication terminal to Earth ground stations"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "ISRO / ISSDC / Chandrayaan-1 Moon Mineralogy Mapper (M3)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Jawahar Point Shackleton Rim View",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "ch2_tiranga",
    "code": "Tiranga Point",
    "name": "Chandrayaan-2 (Tiranga Point)",
    "shortName": "Tiranga Point",
    "tier": "SUITABLE",
    "latitude": -70.83,
    "longitude": 22.68,
    "suitabilityScore": 81.9,
    "aiConfidence": 90,
    "factors": {
      "terrain": 86,
      "waterIce": 74,
      "solarIllumination": 81,
      "radiationSafety": 78,
      "temperature": 77,
      "accessibility": 89
    },
    "elevationMeters": -2300,
    "slopeDegrees": 4.0,
    "illuminationPercent": 81.0,
    "waterIcePurityPercent": 13.8,
    "radiationLevelMsvPerYear": 305,
    "tempMinKelvin": 145,
    "tempMaxKelvin": 335,
    "earthLineOfSightPercent": 95.0,
    "distanceToPsrMeters": 920,
    "siteType": "Polar Plateau",
    "description": "Chandrayaan-2 landing location in the southern highland terrain. Thoroughly surveyed by Chandrayaan-2 OHRC (0.32m resolution) providing world-class sub-meter topographic maps.",
    "whyThisSite": [
      {
        "text": "Comprehensive sub-meter 0.32m OHRC orbital photogrammetry available",
        "type": "positive"
      },
      {
        "text": "Smooth landing zone with low hazard density across highland plateau",
        "type": "positive"
      },
      {
        "text": "Good solar exposure during lunar summer solstice periods",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Deploy automated lunar regolith processing facility",
      "Set up regional high-bandwidth relay antenna node",
      "Integrate with ISRO long-duration polar mobile rover grid"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "ISRO / Chandrayaan-2 Orbiter High Resolution Camera (OHRC)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Tiranga Point High Resolution Mapping",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "lupex_ch4",
    "code": "LUPEX / CH-4",
    "name": "Chandrayaan-4 / LUPEX (Connecting Ridge Target)",
    "shortName": "LUPEX / CH-4 Target",
    "tier": "HIGHLY SUITABLE",
    "latitude": -89.4,
    "longitude": 145.0,
    "suitabilityScore": 91.2,
    "aiConfidence": 94,
    "factors": {
      "terrain": 90,
      "waterIce": 90,
      "solarIllumination": 93,
      "radiationSafety": 86,
      "temperature": 89,
      "accessibility": 88
    },
    "elevationMeters": 4050,
    "slopeDegrees": 4.1,
    "illuminationPercent": 92.8,
    "waterIcePurityPercent": 20.5,
    "radiationLevelMsvPerYear": 280,
    "tempMinKelvin": 175,
    "tempMaxKelvin": 222,
    "earthLineOfSightPercent": 97.8,
    "distanceToPsrMeters": 340,
    "siteType": "Crater Rim",
    "description": "Target landing site for the joint ISRO-JAXA LUPEX (Lunar Polar Exploration) / Chandrayaan-4 mission. Designed to drill 1.5m underground into polar ice traps for in-situ resource utilization.",
    "whyThisSite": [
      {
        "text": "Optimized specifically for 350kg JAXA rover + ISRO lander drilling operations",
        "type": "positive"
      },
      {
        "text": "Sustained solar illumination corridor with minimal shadowing during mission lifespan",
        "type": "positive"
      },
      {
        "text": "Direct proximity to verified high-purity volatile deposits",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Deploy ISRO-JAXA 1.5m deep core drill system",
      "Construct automated hydrogen/oxygen propellant generation pilot plant",
      "Install permanent polar thermal shelter module"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "ISRO / JAXA LUPEX Joint Mission Architecture",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "alt_text": "LUPEX Polar Rover Ice Prospecting Simulation",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "apollo_11",
    "code": "Apollo 11",
    "name": "Apollo 11 (Statio Tranquillitatis)",
    "shortName": "Tranquility Base",
    "tier": "SUITABLE",
    "latitude": 0.674,
    "longitude": 23.473,
    "suitabilityScore": 81.5,
    "aiConfidence": 98,
    "factors": {
      "terrain": 95,
      "waterIce": 20,
      "solarIllumination": 50,
      "radiationSafety": 72,
      "temperature": 65,
      "accessibility": 98
    },
    "elevationMeters": -1440,
    "slopeDegrees": 1.8,
    "illuminationPercent": 50.0,
    "waterIcePurityPercent": 0.5,
    "radiationLevelMsvPerYear": 380,
    "tempMinKelvin": 100,
    "tempMaxKelvin": 385,
    "earthLineOfSightPercent": 100.0,
    "distanceToPsrMeters": 850000,
    "siteType": "Mare Plain",
    "description": "Historic first human landing site on the Moon (July 20, 1969). Ultra-flat basaltic mare plain with near-zero slope hazards, proven geotechnical load-bearing capacity, and uninterrupted line-of-sight to Earth.",
    "whyThisSite": [
      {
        "text": "Proven ground-truth human landing zone with 1.8\u00b0 average slope",
        "type": "positive"
      },
      {
        "text": "100% direct permanent line-of-sight to Earth equatorial tracking stations",
        "type": "positive"
      },
      {
        "text": "High ilmenite/titanium basalt regolith ideal for metal extraction & oxygen reduction",
        "type": "positive"
      },
      {
        "text": "Equatorial 14-day continuous night and wide thermal swings (100K to 385K)",
        "type": "warning"
      }
    ],
    "missionRecommendations": [
      "Preserve Apollo 11 Historic Heritage Zone (Statio Tranquillitatis)",
      "Construct equatorial high-power nuclear fission surface power (FSP) hub",
      "Establish basalt oxygen-extraction & 3D printing research facility"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / Neil Armstrong & Buzz Aldrin / LROC NAC (M102360879R)",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Buzz Aldrin on Mare Tranquillitatis by Neil Armstrong",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Apollo Lunar Module LM-5 Eagle on Lunar Surface",
        "overlayText": "View Lander"
      }
    ]
  },
  {
    "id": "apollo_12",
    "code": "Apollo 12",
    "name": "Apollo 12 (Ocean of Storms / Surveyor 3)",
    "shortName": "Ocean of Storms",
    "tier": "SUITABLE",
    "latitude": -3.012,
    "longitude": -23.422,
    "suitabilityScore": 80.8,
    "aiConfidence": 97,
    "factors": {
      "terrain": 94,
      "waterIce": 20,
      "solarIllumination": 50,
      "radiationSafety": 72,
      "temperature": 65,
      "accessibility": 97
    },
    "elevationMeters": -1520,
    "slopeDegrees": 2.1,
    "illuminationPercent": 50.0,
    "waterIcePurityPercent": 0.4,
    "radiationLevelMsvPerYear": 380,
    "tempMinKelvin": 100,
    "tempMaxKelvin": 385,
    "earthLineOfSightPercent": 100.0,
    "distanceToPsrMeters": 890000,
    "siteType": "Mare Plain",
    "description": "Precision touchdown site adjacent to Surveyor 3 robotic probe (November 1969). Flat basaltic terrain demonstrating pinpoint lunar landing capability.",
    "whyThisSite": [
      {
        "text": "Demonstrated pinpoint touchdown accuracy within 160m of target",
        "type": "positive"
      },
      {
        "text": "Extensive multi-year material degradation benchmark data from Surveyor 3",
        "type": "positive"
      },
      {
        "text": "Flat mare plain suitable for heavy industrial rocket transport",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Establish Long-Duration Material Exposure Testbed",
      "Deploy equatorial automated rover depot",
      "Construct solar farm with regenerative fuel cell backup"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / Pete Conrad & Alan Bean / Apollo 12",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Apollo 12 Astronaut with Surveyor 3 Spacecraft",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "apollo_14",
    "code": "Apollo 14",
    "name": "Apollo 14 (Fra Mauro Highlands)",
    "shortName": "Fra Mauro Highlands",
    "tier": "SUITABLE",
    "latitude": -3.645,
    "longitude": -17.471,
    "suitabilityScore": 81.2,
    "aiConfidence": 96,
    "factors": {
      "terrain": 91,
      "waterIce": 22,
      "solarIllumination": 50,
      "radiationSafety": 73,
      "temperature": 66,
      "accessibility": 95
    },
    "elevationMeters": -1100,
    "slopeDegrees": 3.4,
    "illuminationPercent": 50.0,
    "waterIcePurityPercent": 0.6,
    "radiationLevelMsvPerYear": 375,
    "tempMinKelvin": 105,
    "tempMaxKelvin": 383,
    "earthLineOfSightPercent": 100.0,
    "distanceToPsrMeters": 870000,
    "siteType": "Polar Plateau",
    "description": "Imbrium impact ejecta blanket (February 1971). Rich in deep crustal lunar samples (KREEP materials) and ancient impact breccia.",
    "whyThisSite": [
      {
        "text": "Deep crustal KREEP (Potassium, Rare Earth Elements, Phosphorus) deposits",
        "type": "positive"
      },
      {
        "text": "Stable highland regolith suitable for subterranean habitat anchors",
        "type": "positive"
      },
      {
        "text": "Proven traverse corridors validated by Shepard and Mitchell",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Construct Rare Earth Element (REE) extraction lab",
      "Deploy subsurface seismic array network",
      "Install high-capacity heavy cargo landing pad"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / Alan Shepard & Edgar Mitchell / Apollo 14",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Fra Mauro Crater Rim Ridge Ejecta Blanket",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "apollo_15",
    "code": "Apollo 15",
    "name": "Apollo 15 (Hadley-Apennine)",
    "shortName": "Hadley-Apennine",
    "tier": "SUITABLE",
    "latitude": 26.132,
    "longitude": 3.634,
    "suitabilityScore": 82.4,
    "aiConfidence": 97,
    "factors": {
      "terrain": 88,
      "waterIce": 22,
      "solarIllumination": 50,
      "radiationSafety": 75,
      "temperature": 66,
      "accessibility": 93
    },
    "elevationMeters": -1800,
    "slopeDegrees": 4.8,
    "illuminationPercent": 50.0,
    "waterIcePurityPercent": 0.7,
    "radiationLevelMsvPerYear": 370,
    "tempMinKelvin": 102,
    "tempMaxKelvin": 384,
    "earthLineOfSightPercent": 100.0,
    "distanceToPsrMeters": 920000,
    "siteType": "Mare Plain",
    "description": "Spectacular geological junction at the base of the Apennine Mountains (5000m peaks) and Hadley Rille lava channel (July 1971). First Lunar Roving Vehicle (LRV) expedition.",
    "whyThisSite": [
      {
        "text": "Natural shielding provided by adjacent 5km Apennine Mountain massif",
        "type": "positive"
      },
      {
        "text": "Hadley Rille collapsed lava tube offers structural habitat shelter options",
        "type": "positive"
      },
      {
        "text": "Rich ancient crustal Genesis Rock (anorthosite) sampling site",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Explore Hadley Rille lava tube for subterranean habitat construction",
      "Establish deep-space mountain observatory",
      "Deploy high-torque robotic crawler for rille descent"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / David Scott & James Irwin / Apollo 15",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Apollo 15 Lunar Roving Vehicle (LRV) at Mount Hadley",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "apollo_16",
    "code": "Apollo 16",
    "name": "Apollo 16 (Descartes Highlands)",
    "shortName": "Descartes Highlands",
    "tier": "SUITABLE",
    "latitude": -8.973,
    "longitude": 15.498,
    "suitabilityScore": 82.0,
    "aiConfidence": 96,
    "factors": {
      "terrain": 89,
      "waterIce": 22,
      "solarIllumination": 50,
      "radiationSafety": 74,
      "temperature": 66,
      "accessibility": 94
    },
    "elevationMeters": 1400,
    "slopeDegrees": 4.2,
    "illuminationPercent": 50.0,
    "waterIcePurityPercent": 0.5,
    "radiationLevelMsvPerYear": 372,
    "tempMinKelvin": 104,
    "tempMaxKelvin": 382,
    "earthLineOfSightPercent": 100.0,
    "distanceToPsrMeters": 880000,
    "siteType": "Polar Plateau",
    "description": "Central lunar highlands plateau near Cayley Plains (April 1972). Proved that lunar highlands were formed by catastrophic impact events rather than volcanism.",
    "whyThisSite": [
      {
        "text": "High-elevation highland plateau with excellent radar line-of-sight",
        "type": "positive"
      },
      {
        "text": "High anorthosite content ideal for aluminum & silicon refining",
        "type": "positive"
      },
      {
        "text": "Stable solid bedrock foundation for pressurized base structures",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Build Highland Metallurgy and Sintering Facility",
      "Install optical astronomical interferometer",
      "Deploy autonomous regolith civil grading rovers"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / John Young & Charles Duke / Apollo 16",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "alt_text": "John Young Lunar Salute beside Lunar Module Orion",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "apollo_17",
    "code": "Apollo 17",
    "name": "Apollo 17 (Taurus-Littrow Valley)",
    "shortName": "Taurus-Littrow",
    "tier": "SUITABLE",
    "latitude": 20.191,
    "longitude": 30.772,
    "suitabilityScore": 83.0,
    "aiConfidence": 98,
    "factors": {
      "terrain": 90,
      "waterIce": 24,
      "solarIllumination": 50,
      "radiationSafety": 76,
      "temperature": 67,
      "accessibility": 95
    },
    "elevationMeters": -2500,
    "slopeDegrees": 3.9,
    "illuminationPercent": 50.0,
    "waterIcePurityPercent": 0.8,
    "radiationLevelMsvPerYear": 368,
    "tempMinKelvin": 105,
    "tempMaxKelvin": 384,
    "earthLineOfSightPercent": 100.0,
    "distanceToPsrMeters": 910000,
    "siteType": "Mare Plain",
    "description": "Deep scenic valley between the North and South Massifs (December 1972). Discovery of orange pyroclastic volcanic glass bead deposits (Shorty Crater) containing trapped volatile gases.",
    "whyThisSite": [
      {
        "text": "High natural radiation shielding from enclosing 2km massif canyon walls",
        "type": "positive"
      },
      {
        "text": "Volcanic orange glass deposits rich in volatile elements (zinc, lead, chlorine)",
        "type": "positive"
      },
      {
        "text": "Highest crewed exploration traverse distance (35.7 km) proven terrain",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Construct Taurus-Littrow Valley Deep Habitat Complex",
      "Develop Pyroclastic Volcanic Glass Resource Extraction Facility",
      "Establish long-range pressurized rover base terminal"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / Eugene Cernan & Harrison Schmitt (Geologist) / Apollo 17",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Harrison Schmitt at Taurus-Littrow Boulder Site",
        "overlayText": ""
      }
    ]
  },
  {
    "id": "artemis_3",
    "code": "Artemis III",
    "name": "Artemis III Target (Shackleton-Malapert Ridge)",
    "shortName": "Artemis III Ridge Target",
    "tier": "HIGHLY SUITABLE",
    "latitude": -89.5,
    "longitude": 130.0,
    "suitabilityScore": 93.8,
    "aiConfidence": 94,
    "factors": {
      "terrain": 94,
      "waterIce": 92,
      "solarIllumination": 95,
      "radiationSafety": 87,
      "temperature": 90,
      "accessibility": 91
    },
    "elevationMeters": 4200,
    "slopeDegrees": 3.7,
    "illuminationPercent": 94.5,
    "waterIcePurityPercent": 21.0,
    "radiationLevelMsvPerYear": 280,
    "tempMinKelvin": 175,
    "tempMaxKelvin": 222,
    "earthLineOfSightPercent": 98.0,
    "distanceToPsrMeters": 310,
    "siteType": "Crater Rim",
    "description": "Designated landing region candidate for NASA Artemis III crewed mission (SpaceX Starship HLS). Bridges optimal power generation ridges with direct rover access to permanently shadowed ice deposits.",
    "whyThisSite": [
      {
        "text": "Optimal multi-kilometer continuous solar illumination ridge",
        "type": "positive"
      },
      {
        "text": "Low localized slope corridor suitable for Starship HLS touchdown",
        "type": "positive"
      },
      {
        "text": "Immediate access to massive volatile water-ice deposits in adjacent shadow traps",
        "type": "positive"
      }
    ],
    "missionRecommendations": [
      "Deploy SpaceX Starship HLS cargo and crew landing zone",
      "Install Artemis Base Camp foundation habitat and mobile power cart",
      "Establish ISRU water purification pipeline"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    "imageAttribution": "NASA / SpaceX / Axiom Space / LROC NAC High-Res Mosaic",
    "galleryImages": [
      {
        "url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "alt_text": "Astronauts on Artemis III South Pole Ridge Touchdown",
        "overlayText": ""
      },
      {
        "url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "alt_text": "SpaceX Starship HLS Lunar Touchdown Vehicle",
        "overlayText": "View Lander"
      }
    ]
  }
];

const aiPredictionsMap = {};
if (aiPredictionsData?.predictions) {
  aiPredictionsData.predictions.forEach(p => {
    aiPredictionsMap[p.id] = p;
  });
}

export const INITIAL_LUNAR_SITES = RAW_LUNAR_SITES.map(site => {
  const pred = aiPredictionsMap[site.id];
  if (!pred) return site;
  return {
    ...site,
    ai_suitability_score: pred.ai_suitability_score,
    suitabilityScore: pred.ai_suitability_score,
    original_mcda_score: pred.original_mcda_score,
    aiConfidence: Math.round(pred.ai_confidence_pct),
    tier: pred.suitability_tier,
    ai_rank: pred.ai_rank,
    shap_top_features: pred.shap_top_features,
    ai_factors: pred.factors,
    ai_ml_matrix: {
      mcda_suitability_score: pred.ai_suitability_score,
      ai_confidence_pct: pred.ai_confidence_pct,
      suitability_tier: pred.suitability_tier,
      ai_rank: pred.ai_rank,
      score_delta_from_mcda: pred.score_delta,
      model_version: aiPredictionsData.metadata?.model_version || 'rf_lunar_v2.4',
      model_r2: aiPredictionsData.metadata?.model_r2 || 0.9562,
      model_rmse: aiPredictionsData.metadata?.model_rmse || 3.124
    }
  };
});

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
    name: 'Chandrayaan-4 / LUPEX (Connecting Ridge Target)',
    agency: 'ISRO / JAXA',
    country: '🇮🇳 India / 🇯🇵 Japan',
    category: 'isro',
    lat: -89.4,
    lon: 145.0,
    zoom: 2.0,
    date: 'Target 2028-2030',
    craft: '350kg JAXA Polar Rover + ISRO Heavy Lander',
    site: 'Connecting Ridge / South Pole PSR Interface',
    discovery: 'Planned in-situ volatile prospecting with 1.5-meter deep sub-surface drill and onboard chemical analysis for water ice purity quantification.',
    status: 'In Development'
  },
  // =========================================================================
  // NASA Apollo Program (Ground-Truth Crewed Surface Bases)
  // =========================================================================
  {
    id: 'apollo_11',
    name: 'Apollo 11 (Statio Tranquillitatis)',
    agency: 'NASA',
    country: '🇺🇸 USA',
    category: 'apollo',
    lat: 0.674,
    lon: 23.473,
    zoom: 2.3,
    date: 'July 20, 1969',
    craft: 'Lunar Module LM-5 Eagle (Armstrong & Aldrin)',
    site: 'Mare Tranquillitatis (Sea of Tranquility)',
    discovery: 'First human lunar landing. Returned 21.5 kg of titanium-rich basalt and breccia samples. Deployed EASEP seismometer and Laser Ranging Retroreflector (LRRR).',
    status: 'Historic Monument'
  },
  {
    id: 'apollo_12',
    name: 'Apollo 12 (Ocean of Storms)',
    agency: 'NASA',
    country: '🇺🇸 USA',
    category: 'apollo',
    lat: -3.012,
    lon: -23.422,
    zoom: 2.3,
    date: 'November 19, 1969',
    craft: 'LM-6 Intrepid (Conrad & Bean)',
    site: 'Oceanus Procellarum',
    discovery: 'Pinpoint precision landing 160m from Surveyor 3 probe. Deployed first complete ALSEP nuclear-powered geophysical station. Returned 34.3 kg of samples.',
    status: 'Historic Site'
  },
  {
    id: 'apollo_14',
    name: 'Apollo 14 (Fra Mauro Highlands)',
    agency: 'NASA',
    country: '🇺🇸 USA',
    category: 'apollo',
    lat: -3.645,
    lon: -17.471,
    zoom: 2.3,
    date: 'February 5, 1971',
    craft: 'LM-8 Antares (Shepard & Mitchell)',
    site: 'Fra Mauro Formation',
    discovery: 'Explored Imbrium Basin impact ejecta blanket. Used Modular Equipment Transporter (MET). Returned 42.3 kg of deep crustal KREEP breccias.',
    status: 'Historic Site'
  },
  {
    id: 'apollo_15',
    name: 'Apollo 15 (Hadley-Apennine)',
    agency: 'NASA',
    country: '🇺🇸 USA',
    category: 'apollo',
    lat: 26.132,
    lon: 3.634,
    zoom: 2.2,
    date: 'July 30, 1971',
    craft: 'LM-10 Falcon + Lunar Roving Vehicle #1 (Scott & Irwin)',
    site: 'Hadley Rille / Montes Apenninus',
    discovery: 'First J-mission with LRV rover (27.8 km traverse). Discovered "Genesis Rock" (anorthosite crust 4.1 Ga). Explored 300m-deep Hadley Rille volcanic canyon.',
    status: 'Historic Site'
  },
  {
    id: 'apollo_16',
    name: 'Apollo 16 (Descartes Highlands)',
    agency: 'NASA',
    country: '🇺🇸 USA',
    category: 'apollo',
    lat: -8.973,
    lon: 15.498,
    zoom: 2.2,
    date: 'April 21, 1972',
    craft: 'LM-11 Orion + LRV #2 (Young & Duke)',
    site: 'Cayley Plains / Descartes Formation',
    discovery: 'First exploration of central lunar highlands. Proved highlands are impact-formed, not volcanic. Returned 95.7 kg of anorthositic impact breccias.',
    status: 'Historic Site'
  },
  {
    id: 'apollo_17',
    name: 'Apollo 17 (Taurus-Littrow)',
    agency: 'NASA',
    country: '🇺🇸 USA',
    category: 'apollo',
    lat: 20.191,
    lon: 30.772,
    zoom: 2.2,
    date: 'December 11, 1972',
    craft: 'LM-12 Challenger + LRV #3 (Cernan & Schmitt)',
    site: 'Taurus-Littrow Valley',
    discovery: 'First professional scientist astronaut (Harrison Schmitt, geologist). Discovered orange volcanic glass beads (pyroclastic mantle venting). Record 110.5 kg samples & 35.7 km traverse.',
    status: 'Historic Site'
  },
  // =========================================================================
  // NASA Artemis & CLPS (Commercial Lunar Payload Services) Program
  // =========================================================================
  {
    id: 'artemis_3',
    name: 'Artemis III Target (Shackleton Ridge)',
    agency: 'NASA / SpaceX',
    country: '🇺🇸 USA',
    category: 'artemis',
    lat: -89.5,
    lon: 130.0,
    zoom: 2.0,
    date: 'Target 2026-2027',
    craft: 'Starship Human Landing System (HLS) + Axiom Extravehicular Suits',
    site: 'Peak of Eternal Light / Shackleton-Malapert Saddle',
    discovery: 'First crewed landing at the lunar South Pole. Week-long expedition to collect cryogenic polar volatile core samples and deploy the Artemis Base Camp surface assets.',
    status: 'Active Target'
  },
  {
    id: 'lcross_cabeus',
    name: 'LCROSS Impact (Cabeus PSR)',
    agency: 'NASA',
    country: '🇺🇸 USA',
    category: 'artemis',
    lat: -84.9,
    lon: -35.5,
    zoom: 2.1,
    date: 'October 9, 2009',
    craft: 'Centaur Upper Stage + Shepherding Spacecraft',
    site: 'Cabeus Crater Floor (Permanent Shadow)',
    discovery: 'Centaur kinetic impact generated a 10km ejecta plume confirming 155 kg of water vapor and ice (5.6% by mass), plus carbon monoxide, methane, and ammonia.',
    status: 'Impact Verified'
  },
  {
    id: 'im1_odysseus',
    name: 'Intuitive Machines IM-1 (Odysseus)',
    agency: 'Intuitive Machines / NASA CLPS',
    country: '🇺🇸 USA',
    category: 'artemis',
    lat: -80.13,
    lon: 1.44,
    zoom: 2.2,
    date: 'February 22, 2024',
    craft: 'Nova-C Lander (Odysseus)',
    site: 'Malapert A Crater (South Pole Region)',
    discovery: 'First commercial spacecraft to achieve a soft lunar landing. Operated scientific payloads in the extreme southern latitude including ROLSES radio receiver.',
    status: 'Mission Complete'
  },
  {
    id: 'viper_griffin',
    name: 'VIPER / Astrobotic Griffin',
    agency: 'NASA / Astrobotic',
    country: '🇺🇸 USA',
    category: 'artemis',
    lat: -85.4,
    lon: 31.8,
    zoom: 2.0,
    date: 'Target 2025-2026',
    craft: 'Griffin Lander + VIPER Prospecting Rover',
    site: 'Mons Mouton (Leibnitz Beta Plateau)',
    discovery: '100-day traverse mapping volatile distribution and subsurface ice with TRIDENT 1m drill and NIRVSS / NSS spectrometers across the flat Mons Mouton tableland.',
    status: 'Mission Planned'
  }
];
