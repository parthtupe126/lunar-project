import { MissionProfilePreset } from '../types/lunar';

export const MISSION_PROFILES: MissionProfilePreset[] = [
  {
    id: 'default-artemis',
    name: 'Artemis Base Camp (Human Outpost)',
    description: 'Balanced profile prioritizing human survival, continuous solar energy, terrain flatness, and direct line-of-sight to Earth.',
    weights: {
      waterIce: 25,
      solarEnergy: 25,
      terrain: 20,
      radiation: 15,
      access: 15
    },
    icon: 'Rocket',
    targetFocus: 'Crew Survival & Solar Endurance'
  },
  {
    id: 'isru-mining',
    name: 'ISRU Volatiles & Cryogenic Fuel Refinery',
    description: 'Industrial profile optimized for proximity to permanently shadowed craters with dense water ice for rocket propellant (LOX/LH2).',
    weights: {
      waterIce: 45,
      solarEnergy: 15,
      terrain: 15,
      radiation: 10,
      access: 15
    },
    icon: 'Droplets',
    targetFocus: 'Water Ice & Volatile Extraction'
  },
  {
    id: 'deep-space-science',
    name: 'Deep Space Optical & Radio Observatory',
    description: 'Science-first profile prioritizing high elevation, low seismic jitter, clean line-of-sight, and natural radiation protection.',
    weights: {
      waterIce: 10,
      solarEnergy: 30,
      terrain: 30,
      radiation: 15,
      access: 15
    },
    icon: 'Radio',
    targetFocus: 'Astrophysics & Radio Astronomy'
  },
  {
    id: 'permanent-colony',
    name: 'Permanent 50-Person Self-Sustaining Colony',
    description: 'Long-term habitation profile prioritizing massive radiation shielding, thermal stability, expansive flat terrain, and volatile logistics.',
    weights: {
      waterIce: 20,
      solarEnergy: 20,
      terrain: 20,
      radiation: 25,
      access: 15
    },
    icon: 'Home',
    targetFocus: 'Long-Term Colonization'
  },
  {
    id: 'commercial-spaceport',
    name: 'Lunar Commercial Spaceport & Logistics Hub',
    description: 'Transportation profile prioritizing ultra-flat landing corridors, heavy cargo rover traversability, and Earth communications.',
    weights: {
      waterIce: 15,
      solarEnergy: 20,
      terrain: 35,
      radiation: 10,
      access: 20
    },
    icon: 'PlaneLanding',
    targetFocus: 'Heavy Cargo & Landings'
  }
];
