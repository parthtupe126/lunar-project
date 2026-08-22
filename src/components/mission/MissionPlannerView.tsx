import React, { useState, useMemo } from 'react';
import { LunarSite } from '../../types/lunar';
import {
  Rocket,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
  Zap,
  Droplets,
  Wind,
  Apple,
  Radio,
  ChevronRight,
  Target,
  Gauge,
  Globe2,
  Flag,
} from 'lucide-react';

interface MissionPlannerViewProps {
  sites: LunarSite[];
  selectedSite: LunarSite | null;
  onSelectSite: (site: LunarSite) => void;
}

interface MissionPhase {
  id: string;
  name: string;
  icon: React.ReactNode;
  durationDays: number;
  minDays: number;
  maxDays: number;
  description: string;
  color: string;
  milestones: string[];
}

interface LaunchWindow {
  date: string;
  deltaV: number;
  travelDays: number;
  rating: 'Optimal' | 'Good' | 'Acceptable';
  earthMoonDist: number;
}

const LAUNCH_WINDOWS: LaunchWindow[] = [
  { date: 'Oct 14 – Oct 18, 2025', deltaV: 3.12, travelDays: 4.5, rating: 'Optimal', earthMoonDist: 356400 },
  { date: 'Dec 02 – Dec 06, 2025', deltaV: 3.24, travelDays: 5.2, rating: 'Good', earthMoonDist: 368200 },
  { date: 'Jan 30 – Feb 03, 2026', deltaV: 3.41, travelDays: 6.1, rating: 'Acceptable', earthMoonDist: 401800 },
];

const PHASE_COLOR_MAP: Record<string, string> = {
  blue: 'border-blue-500/50 bg-blue-950/30',
  cyan: 'border-cyan-500/50 bg-cyan-950/30',
  amber: 'border-amber-500/50 bg-amber-950/30',
  orange: 'border-orange-500/50 bg-orange-950/30',
  emerald: 'border-emerald-500/50 bg-emerald-950/30',
};
const PHASE_TEXT_MAP: Record<string, string> = {
  blue: 'text-blue-400', cyan: 'text-cyan-400', amber: 'text-amber-400',
  orange: 'text-orange-400', emerald: 'text-emerald-400',
};
const PHASE_BG_MAP: Record<string, string> = {
  blue: 'bg-blue-500', cyan: 'bg-cyan-500', amber: 'bg-amber-500',
  orange: 'bg-orange-500', emerald: 'bg-emerald-500',
};

export const MissionPlannerView: React.FC<MissionPlannerViewProps> = ({
  sites,
  selectedSite,
  onSelectSite,
}) => {
  const site = selectedSite || sites[0];
  const [crewCount, setCrewCount] = useState(4);
  const [phases, setPhases] = useState<MissionPhase[]>([
    {
      id: 'pre-launch',
      name: 'Pre-Launch & Training',
      icon: <Target className="w-4 h-4" />,
      durationDays: 180,
      minDays: 90,
      maxDays: 365,
      description: 'Crew training, hardware integration, final systems checks and mission rehearsal.',
      color: 'blue',
      milestones: ['Crew selection finalized', 'Habitat modules shipped', 'Ground system readiness review'],
    },
    {
      id: 'transit',
      name: 'Earth–Moon Transit',
      icon: <Rocket className="w-4 h-4" />,
      durationDays: 5,
      minDays: 4,
      maxDays: 7,
      description: 'Trans-Lunar Injection (TLI) burn and coast to lunar orbit insertion (LOI).',
      color: 'cyan',
      milestones: ['TLI burn confirmed', 'Mid-course correction', 'Lunar orbit insertion (LOI)'],
    },
    {
      id: 'landing',
      name: 'Descent & Landing',
      icon: <Flag className="w-4 h-4" />,
      durationDays: 2,
      minDays: 1,
      maxDays: 3,
      description: 'Powered descent, HLS touchdown, initial surface egress and site survey.',
      color: 'amber',
      milestones: ['Deorbit burn', 'Terminal descent initiated', 'Touchdown confirmed', 'Egress & site survey'],
    },
    {
      id: 'construction',
      name: 'Base Construction',
      icon: <Globe2 className="w-4 h-4" />,
      durationDays: 30,
      minDays: 14,
      maxDays: 90,
      description: 'Habitat module deployment, solar array erection, ISRU plant commissioning.',
      color: 'orange',
      milestones: ['Habitat dome pressurized', 'Solar arrays online', 'ISRU plant commissioned', 'Life support verified'],
    },
    {
      id: 'habitation',
      name: 'Long-Term Habitation',
      icon: <Users className="w-4 h-4" />,
      durationDays: 365,
      minDays: 30,
      maxDays: 1095,
      description: 'Permanent crew rotation, science operations, and base expansion.',
      color: 'emerald',
      milestones: ['First crew rotation', 'Greenhouse operational', 'Water ISRU self-sufficient', 'Expansion Phase 2'],
    },
  ]);

  // Crew resource calculations (NASA standards)
  const dailyO2Kg = crewCount * 0.84;          // 0.84 kg/person/day
  const dailyH2OLiters = crewCount * 3.0;       // 3 L/person/day (drinking + cooking)
  const dailyFoodKg = crewCount * 1.77;          // 1.77 kg/person/day
  const dailyPowerKw = crewCount * 2.5 + 15;     // 2.5 kW/person + base 15 kW for systems
  const missionDurationDays = phases.reduce((a, b) => a + b.durationDays, 0);
  const totalO2 = (dailyO2Kg * missionDurationDays).toFixed(0);
  const totalH2O = (dailyH2OLiters * missionDurationDays).toFixed(0);
  const totalFood = (dailyFoodKg * missionDurationDays).toFixed(0);

  // Readiness checklist auto-generated from site data
  const checklist = useMemo(() => [
    {
      label: 'Solar Power Source',
      detail: `${site.illuminationPercent}% annual illumination`,
      status: site.illuminationPercent >= 85 ? 'ready' : site.illuminationPercent >= 60 ? 'warning' : 'fail',
    },
    {
      label: 'ISRU Water Source',
      detail: `${site.waterIcePurityPercent}% ice purity estimate`,
      status: site.waterIcePurityPercent >= 15 ? 'ready' : site.waterIcePurityPercent >= 5 ? 'warning' : 'fail',
    },
    {
      label: 'Terrain Trafficability',
      detail: `${site.slopeDegrees}° slope angle`,
      status: site.slopeDegrees <= 5 ? 'ready' : site.slopeDegrees <= 10 ? 'warning' : 'fail',
    },
    {
      label: 'Radiation Safety',
      detail: `${site.radiationLevelMsvPerYear} mSv/yr`,
      status: site.radiationLevelMsvPerYear <= 300 ? 'ready' : site.radiationLevelMsvPerYear <= 500 ? 'warning' : 'fail',
    },
    {
      label: 'Earth Communications',
      detail: `${site.earthLineOfSightPercent}% LOS availability`,
      status: site.earthLineOfSightPercent >= 90 ? 'ready' : site.earthLineOfSightPercent >= 70 ? 'warning' : 'fail',
    },
    {
      label: 'Thermal Management',
      detail: `${site.tempMinKelvin}K – ${site.tempMaxKelvin}K range`,
      status: (site.tempMaxKelvin - site.tempMinKelvin) <= 60 ? 'ready' : (site.tempMaxKelvin - site.tempMinKelvin) <= 120 ? 'warning' : 'fail',
    },
    {
      label: 'Landing Zone Clearance',
      detail: `${site.slopeDegrees < 5 ? 'HLS CERTIFIED' : 'Leveling required'}`,
      status: site.slopeDegrees < 5 ? 'ready' : site.slopeDegrees < 8 ? 'warning' : 'fail',
    },
    {
      label: 'PSR Volatile Access',
      detail: `${site.distanceToPsrMeters}m to nearest PSR`,
      status: site.distanceToPsrMeters <= 500 ? 'ready' : site.distanceToPsrMeters <= 2000 ? 'warning' : 'fail',
    },
    {
      label: 'Power Budget (Required)',
      detail: `${dailyPowerKw.toFixed(1)} kW/day for ${crewCount} crew`,
      status: site.illuminationPercent >= 80 ? 'ready' : 'warning',
    },
    {
      label: 'Mission Crew Count',
      detail: `${crewCount} crew × ${missionDurationDays} days`,
      status: crewCount <= 6 ? 'ready' : crewCount <= 8 ? 'warning' : 'fail',
    },
  ], [site, crewCount, dailyPowerKw, missionDurationDays]);

  const readyCount = checklist.filter(c => c.status === 'ready').length;
  const overallReadiness = Math.round((readyCount / checklist.length) * 100);

  const totalTimelineWidth = phases.reduce((a, b) => a + b.durationDays, 0);

  return (
    <div className="w-full h-full bg-[#050811] overflow-y-auto p-6 space-y-6 text-slate-200">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            MISSION PLANNING — LUNAR COLONIZATION
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            End-to-end mission design: crew sizing, timeline, launch windows & readiness checklist.
          </p>
        </div>
        <select
          value={site.id}
          onChange={e => { const s = sites.find(x => x.id === e.target.value); if (s) onSelectSite(s); }}
          className="bg-[#0B1120] border border-blue-500/50 rounded-lg px-3 py-1.5 text-xs font-mono text-blue-300 font-bold"
        >
          {sites.map(s => <option key={s.id} value={s.id}>{s.code} — {s.shortName}</option>)}
        </select>
      </div>

      {/* TOP ROW: Crew Configurator + Overall Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Crew & Resource Calculator */}
        <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> CREW & RESOURCE CALCULATOR
          </h3>

          {/* Crew Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Crew Size</span>
              <span className="text-blue-300 font-bold text-lg">{crewCount} Astronauts</span>
            </div>
            <input
              type="range" min={1} max={12} value={crewCount}
              onChange={e => setCrewCount(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1 (Solo)</span><span>4 (Artemis)</span><span>8 (Gateway)</span><span>12 (Colony)</span>
            </div>
          </div>

          {/* Resource Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'O₂ / Day', value: `${dailyO2Kg.toFixed(2)} kg`, icon: <Wind className="w-3.5 h-3.5" />, color: 'text-cyan-400', total: `${totalO2} kg total` },
              { label: 'H₂O / Day', value: `${dailyH2OLiters.toFixed(1)} L`, icon: <Droplets className="w-3.5 h-3.5" />, color: 'text-blue-400', total: `${totalH2O} L total` },
              { label: 'Food / Day', value: `${dailyFoodKg.toFixed(2)} kg`, icon: <Apple className="w-3.5 h-3.5" />, color: 'text-amber-400', total: `${totalFood} kg total` },
              { label: 'Power Needed', value: `${dailyPowerKw.toFixed(1)} kW`, icon: <Zap className="w-3.5 h-3.5" />, color: 'text-yellow-400', total: `${(dailyPowerKw * 24).toFixed(0)} kWh/day` },
            ].map(r => (
              <div key={r.label} className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 space-y-1">
                <div className={`flex items-center gap-1.5 text-[10px] font-mono ${r.color}`}>
                  {r.icon} <span>{r.label}</span>
                </div>
                <div className="text-sm font-bold font-mono text-white">{r.value}</div>
                <div className="text-[10px] font-mono text-slate-500">{r.total}</div>
              </div>
            ))}
          </div>

          {/* Mission Duration Summary */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-700 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Total Mission Duration
            </div>
            <span className="text-base font-black font-mono text-blue-300">
              {missionDurationDays} DAYS
              <span className="text-xs text-slate-400 font-normal ml-1">({(missionDurationDays / 365).toFixed(1)} yrs)</span>
            </span>
          </div>
        </div>

        {/* Mission Readiness Score */}
        <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" /> MISSION READINESS — {site.shortName}
          </h3>

          {/* Big Readiness Dial */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={overallReadiness >= 80 ? '#10b981' : overallReadiness >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="12"
                  strokeDasharray={`${(overallReadiness / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center z-10">
                <div className={`text-3xl font-black font-mono ${overallReadiness >= 80 ? 'text-emerald-400' : overallReadiness >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {overallReadiness}%
                </div>
                <div className="text-[10px] font-mono text-slate-400">READY</div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 bg-slate-900/60 rounded-lg px-3 py-1.5 border border-slate-800">
                {item.status === 'ready' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                {item.status === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                {item.status === 'fail' && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono text-white truncate">{item.label}</div>
                  <div className="text-[10px] font-mono text-slate-500">{item.detail}</div>
                </div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  item.status === 'ready' ? 'bg-emerald-950 text-emerald-400' :
                  item.status === 'warning' ? 'bg-amber-950 text-amber-400' :
                  'bg-rose-950 text-rose-400'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Timeline & Phase Breakdown */}
      <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            MISSION PHASES & LIFECYCLE SCHEDULE
          </h3>
          <span className="text-xs font-mono text-cyan-400">Total: {totalTimelineWidth} Days (~{Math.round(totalTimelineWidth / 30.4)} months)</span>
        </div>

        {/* Gantt-style visual bar */}
        <div className="flex h-8 rounded-lg overflow-hidden border border-slate-700 gap-0.5">
          {phases.map(p => (
            <div
              key={p.id}
              className={`${PHASE_BG_MAP[p.color]} opacity-80 flex items-center justify-center transition-all duration-300`}
              style={{ width: `${(p.durationDays / totalTimelineWidth) * 100}%` }}
              title={`${p.name}: ${p.durationDays} days`}
            >
              <span className="text-[9px] font-mono font-bold text-white truncate px-1 hidden sm:block">
                {p.durationDays}d
              </span>
            </div>
          ))}
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {phases.map((phase, idx) => (
            <div key={phase.id} className={`rounded-xl border p-3 space-y-2 ${PHASE_COLOR_MAP[phase.color]}`}>
              <div className="flex items-center gap-1.5">
                <span className={PHASE_TEXT_MAP[phase.color]}>{phase.icon}</span>
                <span className={`text-[10px] font-mono font-bold ${PHASE_TEXT_MAP[phase.color]}`}>
                  PHASE {idx + 1}
                </span>
              </div>
              <div className="text-[11px] font-bold font-mono text-white leading-tight">{phase.name}</div>

              {/* Duration Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Duration</span>
                  <span className={`font-bold ${PHASE_TEXT_MAP[phase.color]}`}>{phase.durationDays}d</span>
                </div>
                <input
                  type="range"
                  min={phase.minDays}
                  max={phase.maxDays}
                  value={phase.durationDays}
                  onChange={e => setPhases(prev => prev.map(p => p.id === phase.id ? { ...p, durationDays: Number(e.target.value) } : p))}
                  className="w-full h-1.5 accent-current"
                />
              </div>

              {/* Milestones */}
              <div className="space-y-1">
                {phase.milestones.slice(0, 2).map((m) => (
                  <div key={m} className="flex items-start gap-1 text-[9px] font-mono text-slate-400">
                    <ChevronRight className="w-2.5 h-2.5 shrink-0 mt-0.5" />{m}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Windows */}
      <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" /> OPTIMAL LAUNCH WINDOWS — EARTH → MOON
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LAUNCH_WINDOWS.map((w, i) => (
            <div key={w.date} className={`rounded-xl border p-4 space-y-3 ${
              w.rating === 'Optimal' ? 'border-emerald-500/50 bg-emerald-950/20' :
              w.rating === 'Good' ? 'border-cyan-500/40 bg-cyan-950/20' :
              'border-slate-700 bg-slate-900/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                  w.rating === 'Optimal' ? 'bg-emerald-900 text-emerald-300' :
                  w.rating === 'Good' ? 'bg-cyan-900 text-cyan-300' :
                  'bg-slate-800 text-slate-400'
                }`}>{w.rating.toUpperCase()}</span>
                <span className="text-[10px] font-mono text-slate-500">Window #{i + 1}</span>
              </div>
              <div className="text-sm font-bold font-mono text-white">{w.date}</div>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div>
                  <div className="text-slate-400">Δv Cost</div>
                  <div className="text-cyan-300 font-bold">{w.deltaV} km/s</div>
                </div>
                <div>
                  <div className="text-slate-400">Transit</div>
                  <div className="text-amber-300 font-bold">{w.travelDays}d</div>
                </div>
                <div>
                  <div className="text-slate-400">E-M Dist</div>
                  <div className="text-slate-300 font-bold">{(w.earthMoonDist / 1000).toFixed(0)}k km</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-mono text-slate-500">
          ★ Launch windows calculated for Trans-Lunar Injection (TLI) trajectories. Δv assumes SLS Block 1B / Starship class vehicle with 70-ton LEO payload capacity.
        </p>
      </div>
    </div>
  );
};
