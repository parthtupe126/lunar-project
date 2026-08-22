/**
 * lunarVisualArchive.js: Frontend loader for the 23-Node NASA Visual & Geological Reconnaissance Archive.
 * Contains 70mm Hasselblad photography, official NASA EVA traverse maps, LROC NAC overheads, and lithology data.
 */
import visualArchiveManifest from './node_visual_geological_manifest.json' with { type: 'json' };

export const LUNAR_VISUAL_ARCHIVE = (visualArchiveManifest && visualArchiveManifest.nodes) ? visualArchiveManifest.nodes : [];

const ALIAS_MAP = {
  'site-shackleton': 'site-shackleton',
  'site-malapert': 'site-malapert',
  'site-faustini': 'site-faustini',
  'site-connecting-ridge': 'site-connecting-ridge',
  'site-de-gerlache': 'site-de-gerlache',
  'site-haworth': 'site-haworth',
  'site-mons-mouton': 'site-mouton',
  'site-mouton': 'site-mouton',
  'site-nobile': 'site-nobile',
  'site-i': 'site-amundsen',
  'site-amundsen': 'site-amundsen',
  'site-j': 'site-marius',
  'site-marius': 'site-marius',
  'site-k': 'site-cabeus',
  'site-cabeus': 'site-cabeus',
  'site-l': 'site-shoemaker',
  'site-shoemaker': 'site-shoemaker',
  'ch3_shiv_shakti': 'site-chandrayaan3',
  'site-chandrayaan3': 'site-chandrayaan3',
  'ch1_jawahar': 'site-chandrayaan1',
  'site-chandrayaan1': 'site-chandrayaan1',
  'ch2_tiranga': 'site-chandrayaan2',
  'site-chandrayaan2': 'site-chandrayaan2',
  'lupex_ch4': 'site-chandrayaan4',
  'site-chandrayaan4': 'site-chandrayaan4',
  'apollo_11': 'site-apollo11',
  'site-apollo11': 'site-apollo11',
  'apollo_12': 'site-apollo12',
  'site-apollo12': 'site-apollo12',
  'apollo_14': 'site-apollo14',
  'site-apollo14': 'site-apollo14',
  'apollo_15': 'site-apollo15',
  'site-apollo15': 'site-apollo15',
  'apollo_16': 'site-apollo16',
  'site-apollo16': 'site-apollo16',
  'apollo_17': 'site-apollo17',
  'site-apollo17': 'site-apollo17',
  'artemis_3': 'site-artemis3',
  'site-artemis3': 'site-artemis3'
};

const DEFAULT_ARCHIVE = {
  node_id: 'site-default',
  code: 'Lunar Site',
  name: 'Lunar Reconnaissance Target',
  coordinates: { latitude: 0, longitude: 0, elevation_m: 0 },
  geological_breakdown: {
    stratigraphic_era: 'Imbrian / Highland Formation',
    primary_lithology: 'Ferroan Anorthosite & Regolith Breccia',
    regolith_depth_m: 3.5,
    mineral_composition: { plagioclase_pct: 75.0, pyroxene_pct: 15.0, ilmenite_tio2_pct: 1.2, feo_pct: 5.4 },
    volatile_trapping_potential: 'High Volatile Trapping Potential',
    thermal_profile: { surface_min_k: 80, surface_max_k: 240, annual_diurnal_delta_k: 160 },
    geomorphology: 'High-priority lunar science candidate zone.'
  },
  hasselblad_surface_reconnaissance: [
    {
      photo_id: 'NASA-SURF-01',
      title: 'Surface Photographic Survey',
      camera_type: '70mm Hasselblad Data Camera / Zeiss 60mm Biogon Lens',
      hardware_experiments: 'Lander Science Instrumentation Footprint',
      features_shown: 'Surface regolith texture and local topography',
      image_url: '/lunar_archive_photos/01_shackleton/hasselblad_surface_1.jpg',
      archive_source: 'NASA PDS Geosciences Node'
    }
  ],
  eva_traverse_map: {
    map_title: 'Official NASA EVA Traverse & Sampling Route',
    total_distance_km: 4.5,
    eva_routes: ['EVA 1: Primary Surface Exploration', 'EVA 2: Geological Boundary Sampling'],
    sampling_stations: [
      { station_id: 'Station 1', description: 'Primary Outcrop', target_sample: 'Anorthositic Regolith Core' }
    ],
    map_image_url: '/lunar_archive_photos/01_shackleton/eva_traverse_map.jpg'
  },
  lroc_overhead_reconnaissance: {
    frame_id: 'M102288180LE',
    resolution_m_per_px: 0.5,
    sun_elevation_deg: 14.5,
    visible_features: ['Touchdown ellipse', 'Surface path disturbance', 'Crater rim boundaries'],
    overhead_image_url: '/lunar_archive_photos/01_shackleton/lroc_overhead_nac.jpg'
  }
};

export function getVisualArchiveForSite(siteOrId) {
  if (!LUNAR_VISUAL_ARCHIVE || LUNAR_VISUAL_ARCHIVE.length === 0) return DEFAULT_ARCHIVE;
  if (!siteOrId) return LUNAR_VISUAL_ARCHIVE[0] || DEFAULT_ARCHIVE;
  
  const rawId = typeof siteOrId === 'string' ? siteOrId : siteOrId.id || siteOrId.code || '';
  const mappedId = ALIAS_MAP[rawId] || rawId;
  const name = typeof siteOrId === 'object' ? siteOrId.name || '' : '';
  const code = typeof siteOrId === 'object' ? siteOrId.code || '' : '';

  // 1. Exact ID or Alias Match
  let found = LUNAR_VISUAL_ARCHIVE.find((n) => n.node_id === mappedId || n.node_id === rawId);
  
  // 2. Exact Code Match
  if (!found && code) {
    found = LUNAR_VISUAL_ARCHIVE.find((n) => n.code?.toLowerCase() === code.toLowerCase());
  }

  // 3. Name Keyword Match
  if (!found && name) {
    const cleanName = name.toLowerCase().split('(')[0].split('—')[0].trim();
    found = LUNAR_VISUAL_ARCHIVE.find((n) => 
      n.name?.toLowerCase().includes(cleanName) || 
      cleanName.includes(n.name?.toLowerCase().split('(')[0].trim())
    );
  }

  return found || LUNAR_VISUAL_ARCHIVE[0] || DEFAULT_ARCHIVE;
}

export default LUNAR_VISUAL_ARCHIVE;
