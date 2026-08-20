import React, { useState } from 'react';
import { LunarSite, HabitatModule } from '../../types/lunar';
import { 
  Compass, 
  Sun, 
  Mountain, 
  Droplets, 
  Radiation, 
  Plus, 
  Trash2, 
  Zap, 
  Weight, 
  ShieldCheck, 
  Sparkles,
  ArrowRightLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface SiteAnalysisViewProps {
  sites: LunarSite[];
  selectedSite: LunarSite | null;
  onSelectSite: (site: LunarSite) => void;
}

export const SiteAnalysisView: React.FC<SiteAnalysisViewProps> = ({
  sites,
  selectedSite,
  onSelectSite
}) => {
  const primarySite = selectedSite || sites[0];
  const [compareSiteId, setCompareSiteId] = useState<string>(sites[1]?.id || sites[0].id);

  const compareSite = sites.find(s => s.id === compareSiteId) || sites[1] || sites[0];

  // Interactive Habitat Module Builder State
  const [modules, setModules] = useState<HabitatModule[]>([
    { id: '1', type: 'core_habitat', name: 'Pressurised Habitat Dome', x: 220, y: 150, powerKw: -35, massKg: 12000, status: 'active' },
    { id: '2', type: 'solar_array', name: 'Photovoltaic Array 1 (100kW)', x: 100, y: 80, powerKw: 100, massKg: 3500, status: 'active' },
    { id: '3', type: 'greenhouse', name: 'Hydroponics Life Support', x: 220, y: 240, powerKw: -20, massKg: 6500, status: 'active' },
    { id: '4', type: 'isru_plant', name: 'Cryogenic Water ISRU Plant', x: 360, y: 180, powerKw: -50, massKg: 9200, status: 'active' },
    { id: '5', type: 'comms_tower', name: 'Ka-Band Direct Earth Terminal', x: 140, y: 220, powerKw: -8, massKg: 1800, status: 'active' },
  ]);

  const addModule = (type: HabitatModule['type']) => {
    soundManager.playClick();
    const typeConfigs: Record<HabitatModule['type'], { name: string; powerKw: number; massKg: number }> = {
      core_habitat: { name: 'Auxiliary Habitat Module', powerKw: -30, massKg: 10000 },
      greenhouse: { name: 'Biomass Greenhouse', powerKw: -15, massKg: 5000 },
      solar_array: { name: 'High-Efficiency Solar Array (50kW)', powerKw: 50, massKg: 2000 },
      isru_plant: { name: 'Regolith Oxygen Extractor', powerKw: -45, massKg: 8500 },
      nuclear_reactor: { name: 'Kilopower Nuclear Fission (10kWe)', powerKw: 100, massKg: 4200 },
      landing_pad: { name: 'Blast-Deflecting Landing Pad', powerKw: -5, massKg: 15000 },
      comms_tower: { name: 'Surface Mesh Relay Mast', powerKw: -5, massKg: 1200 },
      rover_bay: { name: 'Autonomous Rover Hangar & Airlock', powerKw: -15, massKg: 4800 },
    };

    const config = typeConfigs[type];
    const newMod: HabitatModule = {
      id: Date.now().toString(),
      type,
      name: config.name,
      x: 150 + Math.random() * 200,
      y: 100 + Math.random() * 160,
      powerKw: config.powerKw,
      massKg: config.massKg,
      status: 'active'
    };
    setModules(prev => [...prev, newMod]);
  };

  const removeModule = (id: string) => {
    soundManager.playClick();
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const totalPowerGen = modules.filter(m => m.powerKw > 0).reduce((a, b) => a + b.powerKw, 0);
  const totalPowerLoad = Math.abs(modules.filter(m => m.powerKw < 0).reduce((a, b) => a + b.powerKw, 0));
  const totalMass = modules.reduce((a, b) => a + b.massKg, 0);
  const powerMargin = totalPowerGen - totalPowerLoad;

  return (
    <div className="w-full h-full bg-[#050811] overflow-y-auto p-6 space-y-6 text-slate-200">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            LUNAR SITE DEEP-DIVE & ARCHITECTURAL PLANNING
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Side-by-side site comparison, topography altimetry cross-sections, and 3D modular base blueprinting.
          </p>
        </div>

        {/* Site Selector Dropdowns */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Comparing:</span>
          <select
            value={primarySite.id}
            onChange={(e) => {
              const s = sites.find(x => x.id === e.target.value);
              if (s) onSelectSite(s);
            }}
            className="bg-[#0B1120] border border-cyan-500/50 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300 font-bold"
          >
            {sites.map(s => (
              <option key={s.id} value={s.id}>{s.code} ({s.shortName})</option>
            ))}
          </select>

          <ArrowRightLeft className="w-4 h-4 text-slate-500" />

          <select
            value={compareSite.id}
            onChange={(e) => setCompareSiteId(e.target.value)}
            className="bg-[#0B1120] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200"
          >
            {sites.map(s => (
              <option key={s.id} value={s.id}>{s.code} ({s.shortName})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Site Card */}
        <div className="bg-[#0B1120]/90 border border-purple-500/40 rounded-2xl p-5 shadow-glow-purple backdrop-blur-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                PRIMARY CANDIDATE
              </span>
              <h3 className="text-lg font-bold font-mono text-white mt-1">{primarySite.name}</h3>
              <p className="text-xs font-mono text-slate-400">
                Lat: {primarySite.latitude}° Lon: {primarySite.longitude}° • Elevation: {primarySite.elevationMeters}m
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-purple-300">{primarySite.suitabilityScore}</div>
              <div className="text-[10px] font-mono text-slate-400">Score / 100</div>
            </div>
          </div>

          {/* Factor Comparison Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Slope Angle</span>
              <div className="text-sm font-bold text-white">{primarySite.slopeDegrees}° (Smooth)</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Annual Solar Illumination</span>
              <div className="text-sm font-bold text-amber-300">{primarySite.illuminationPercent}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Water Ice Purity</span>
              <div className="text-sm font-bold text-cyan-300">{primarySite.waterIcePurityPercent}% (Estimated)</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Distance to PSR Basin</span>
              <div className="text-sm font-bold text-emerald-400">{primarySite.distanceToPsrMeters} m</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            {primarySite.description}
          </p>
        </div>

        {/* Secondary Compare Site Card */}
        <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 shadow-card backdrop-blur-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                BENCHMARK COMPARISON
              </span>
              <h3 className="text-lg font-bold font-mono text-white mt-1">{compareSite.name}</h3>
              <p className="text-xs font-mono text-slate-400">
                Lat: {compareSite.latitude}° Lon: {compareSite.longitude}° • Elevation: {compareSite.elevationMeters}m
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-cyan-300">{compareSite.suitabilityScore}</div>
              <div className="text-[10px] font-mono text-slate-400">Score / 100</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Slope Angle</span>
              <div className="text-sm font-bold text-white">{compareSite.slopeDegrees}°</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Annual Solar Illumination</span>
              <div className="text-sm font-bold text-amber-300">{compareSite.illuminationPercent}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Water Ice Purity</span>
              <div className="text-sm font-bold text-cyan-300">{compareSite.waterIcePurityPercent}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Distance to PSR Basin</span>
              <div className="text-sm font-bold text-emerald-400">{compareSite.distanceToPsrMeters} m</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            {compareSite.description}
          </p>
        </div>
      </div>

      {/* Topography Elevation Cross-Section Curve (LOLA Altimeter Simulation) */}
      <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 shadow-card backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white">
              LOLA ALTIMETRY TERRAIN CROSS-SECTION PROFILE (10 KM TRANSECT)
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            RESOLUTION: 1.0 METER/PIXEL
          </span>
        </div>

        {/* SVG Topographic Profile Graphic */}
        <div className="relative h-40 bg-slate-950/90 rounded-xl border border-slate-800/80 p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>+6,000 m (Highland Rim)</span>
            <span>0 m (Lunar Datum)</span>
            <span>-4,000 m (PSR Crater Floor)</span>
          </div>

          <svg className="w-full h-24 overflow-visible">
            {/* Coordinate Grid lines */}
            <line x1="0" y1="20" x2="100%" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="0" y1="50" x2="100%" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="0" y1="80" x2="100%" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

            {/* Topographic Curve Line */}
            <path
              d="M 0 65 Q 120 10 240 25 T 450 15 T 650 95 T 850 88 T 1100 35"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="2.5"
            />
            {/* Area fill under curve */}
            <path
              d="M 0 65 Q 120 10 240 25 T 450 15 T 650 95 T 850 88 T 1100 35 L 1100 100 L 0 100 Z"
              fill="url(#terrainGrad)"
              opacity="0.25"
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="terrainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#0B1120" />
              </linearGradient>
            </defs>

            {/* Habitat Anchor Pin Marker */}
            <circle cx="240" cy="25" r="5" fill="#A855F7" stroke="#FFFFFF" strokeWidth="2" />
            <text x="250" y="20" fill="#C084FC" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
              Basecamp Anchor (Flat Crest)
            </text>

            {/* PSR Water Ice Floor Indicator */}
            <rect x="620" y="85" width="80" height="15" rx="3" fill="#00F0FF" opacity="0.3" stroke="#00F0FF" />
            <text x="630" y="96" fill="#00F0FF" fontSize="9" fontFamily="JetBrains Mono">
              ★ PSR Ice Trap
            </text>
          </svg>

          <div className="flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-1">
            <span>0 km (West Ridge)</span>
            <span className="text-purple-400 font-bold">● Habitat Crest Target (2.4 km)</span>
            <span className="text-cyan-400 font-bold">★ Deep Volatile Basin (6.5 km)</span>
            <span>10 km (East Terraces)</span>
          </div>
        </div>
      </div>

      {/* Interactive Lunar Modular Habitat Base Sandbox */}
      <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 shadow-card backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              MODULAR HABITAT ARCHITECT & RESOURCE BUDGET
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Simulate base infrastructure placement, solar array capacity, and power/mass telemetry.
            </p>
          </div>

          {/* Real-Time Power & Mass Badges */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Net Power: <strong className={powerMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{powerMargin >= 0 ? `+${powerMargin}` : powerMargin} kW</strong></span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
              <Weight className="w-3.5 h-3.5 text-blue-400" />
              <span>Colony Mass: <strong className="text-white">{(totalMass / 1000).toFixed(1)} tons</strong></span>
            </div>
          </div>
        </div>

        {/* Module Add Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Deploy Module:</span>
          <button
            onClick={() => addModule('core_habitat')}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-mono transition-colors"
          >
            <Plus className="w-3 h-3" /> Hab Dome
          </button>
          <button
            onClick={() => addModule('solar_array')}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono transition-colors"
          >
            <Plus className="w-3 h-3" /> Solar Wing
          </button>
          <button
            onClick={() => addModule('greenhouse')}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-mono transition-colors"
          >
            <Plus className="w-3 h-3" /> Greenhouse
          </button>
          <button
            onClick={() => addModule('isru_plant')}
            className="flex items-center gap-1 px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono transition-colors"
          >
            <Plus className="w-3 h-3" /> ISRU Plant
          </button>
          <button
            onClick={() => addModule('nuclear_reactor')}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-mono transition-colors"
          >
            <Plus className="w-3 h-3" /> Kilopower
          </button>
        </div>

        {/* Blueprint Terrain Grid Canvas */}
        <div className="relative h-72 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none">
          {/* Blueprint Grid Lines */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* South Pole Rim Contour Guide */}
          <div className="absolute top-8 left-12 right-12 bottom-12 border-2 border-dashed border-cyan-500/20 rounded-full pointer-events-none flex items-center justify-center">
            <span className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-widest">
              PRIMARY HABITAT DEPLOYMENT CORRIDOR (SLOPE &lt; 5°)
            </span>
          </div>

          {/* Rendered Modules on Grid */}
          {modules.map((mod) => (
            <div
              key={mod.id}
              style={{ left: `${mod.x}px`, top: `${mod.y}px` }}
              className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-move"
            >
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0B1120]/90 border border-cyan-500/40 shadow-glow-cyan text-xs font-mono backdrop-blur-md">
                <div className={`w-3 h-3 rounded-full ${mod.powerKw > 0 ? 'bg-amber-400' : 'bg-cyan-400'} animate-pulse`} />
                <div>
                  <div className="font-bold text-white text-[11px] whitespace-nowrap">{mod.name}</div>
                  <div className="text-[9px] text-slate-400">
                    {mod.powerKw > 0 ? `+${mod.powerKw} kW` : `${mod.powerKw} kW`} • {(mod.massKg / 1000).toFixed(1)}t
                  </div>
                </div>
                <button
                  onClick={() => removeModule(mod.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
