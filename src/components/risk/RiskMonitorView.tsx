import React, { useMemo } from 'react';
import { LunarSite, NasaSpaceWeather } from '../../types/lunar';
import {
  ShieldAlert,
  Radiation,
  Thermometer,
  Mountain,
  Wind,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Siren,
  TrendingDown,
  Info,
} from 'lucide-react';

interface RiskMonitorViewProps {
  sites: LunarSite[];
  selectedSite: LunarSite | null;
  onSelectSite: (site: LunarSite) => void;
  spaceWeather: NasaSpaceWeather;
}

interface RiskFactor {
  key: string;
  label: string;
  icon: React.ReactNode;
  getValue: (site: LunarSite) => number; // 0–100 risk (higher = MORE dangerous)
  getLabel: (site: LunarSite) => string;
  color: (score: number) => string;
}

const RISK_FACTORS: RiskFactor[] = [
  {
    key: 'radiation',
    label: 'Radiation',
    icon: <Radiation className="w-3.5 h-3.5" />,
    getValue: (s) => Math.min(100, Math.round((s.radiationLevelMsvPerYear / 600) * 100)),
    getLabel: (s) => `${s.radiationLevelMsvPerYear} mSv/yr`,
    color: (v) => v < 40 ? 'text-emerald-400' : v < 65 ? 'text-amber-400' : 'text-rose-400',
  },
  {
    key: 'slope',
    label: 'Slope Stability',
    icon: <Mountain className="w-3.5 h-3.5" />,
    getValue: (s) => Math.min(100, Math.round((s.slopeDegrees / 20) * 100)),
    getLabel: (s) => `${s.slopeDegrees}° slope`,
    color: (v) => v < 35 ? 'text-emerald-400' : v < 60 ? 'text-amber-400' : 'text-rose-400',
  },
  {
    key: 'thermal',
    label: 'Thermal Swing',
    icon: <Thermometer className="w-3.5 h-3.5" />,
    getValue: (s) => Math.min(100, Math.round(((s.tempMaxKelvin - s.tempMinKelvin) / 300) * 100)),
    getLabel: (s) => `ΔT = ${s.tempMaxKelvin - s.tempMinKelvin} K`,
    color: (v) => v < 35 ? 'text-emerald-400' : v < 60 ? 'text-amber-400' : 'text-rose-400',
  },
  {
    key: 'dust',
    label: 'Dust Exposure',
    icon: <Wind className="w-3.5 h-3.5" />,
    getValue: (s) => {
      const base = s.siteType === 'Crater Rim' ? 35 : s.siteType === 'PSR Basin' ? 55 : s.siteType === 'Lava Tube' ? 10 : s.siteType === 'Polar Plateau' ? 30 : 45;
      return Math.min(100, base + Math.round(s.slopeDegrees * 3));
    },
    getLabel: (s) => s.siteType === 'Lava Tube' ? 'Shielded (Subterranean)' : `${s.siteType} exposure`,
    color: (v) => v < 40 ? 'text-emerald-400' : v < 65 ? 'text-amber-400' : 'text-rose-400',
  },
  {
    key: 'seismic',
    label: 'Seismic Risk',
    icon: <Activity className="w-3.5 h-3.5" />,
    getValue: (s) => {
      const base = s.siteType === 'Mare Plain' ? 60 : s.siteType === 'Lava Tube' ? 70 : s.siteType === 'PSR Basin' ? 45 : 25;
      return Math.min(100, base + Math.round(s.slopeDegrees * 2));
    },
    getLabel: (s) => s.siteType === 'Lava Tube' ? 'Moderate (tube integrity)' : s.siteType === 'Crater Rim' ? 'Low (stable bedrock)' : 'Moderate',
    color: (v) => v < 40 ? 'text-emerald-400' : v < 65 ? 'text-amber-400' : 'text-rose-400',
  },
];

function getRiskColor(score: number): string {
  if (score < 35) return 'bg-emerald-500';
  if (score < 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

function getRiskBgColor(score: number): string {
  if (score < 35) return 'bg-emerald-950/40 border-emerald-500/30';
  if (score < 60) return 'bg-amber-950/40 border-amber-500/30';
  return 'bg-rose-950/40 border-rose-500/30';
}

function getRiskLabel(score: number): string {
  if (score < 35) return 'LOW';
  if (score < 60) return 'MODERATE';
  return 'HIGH';
}

function getRiskTextColor(score: number): string {
  if (score < 35) return 'text-emerald-400';
  if (score < 60) return 'text-amber-400';
  return 'text-rose-400';
}

function compositeRisk(site: LunarSite): number {
  const scores = RISK_FACTORS.map(f => f.getValue(site));
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export const RiskMonitorView: React.FC<RiskMonitorViewProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  spaceWeather,
}) => {
  const site = selectedSite || sites[0];
  const siteRisk = compositeRisk(site);

  // Space weather alert level
  const flareLevel = spaceWeather.solarFlareLevel;
  const isHighFlare = flareLevel.startsWith('M') || flareLevel.startsWith('X');
  const isMedFlare = flareLevel.startsWith('C') && parseFloat(flareLevel.slice(1)) > 5;
  const overallSpaceAlertLevel = spaceWeather.cmeAlert ? 'CRITICAL' : isHighFlare ? 'HIGH' : isMedFlare ? 'MODERATE' : 'NOMINAL';

  const alertBgMap: Record<string, string> = {
    CRITICAL: 'bg-rose-950/60 border-rose-500/60',
    HIGH: 'bg-orange-950/60 border-orange-500/60',
    MODERATE: 'bg-amber-950/60 border-amber-500/50',
    NOMINAL: 'bg-emerald-950/40 border-emerald-500/40',
  };
  const alertTextMap: Record<string, string> = {
    CRITICAL: 'text-rose-400', HIGH: 'text-orange-400', MODERATE: 'text-amber-400', NOMINAL: 'text-emerald-400',
  };

  // Top 8 sites for heatmap
  const heatmapSites = useMemo(() => sites.slice(0, 8), [sites]);

  const safetyRating = 100 - siteRisk;

  return (
    <div className="w-full h-full bg-[#050811] overflow-y-auto p-6 space-y-6 text-slate-200">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            RISK MONITOR — ENVIRONMENTAL & OPERATIONAL HAZARDS
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Live NASA space weather alerts, per-site danger scoring, and hazard heatmap across all candidates.
          </p>
        </div>
        <select
          value={site.id}
          onChange={e => { const s = sites.find(x => x.id === e.target.value); if (s) onSelectSite(s); }}
          className="bg-[#0B1120] border border-rose-500/50 rounded-lg px-3 py-1.5 text-xs font-mono text-rose-300 font-bold"
        >
          {sites.map(s => <option key={s.id} value={s.id}>{s.code} — {s.shortName}</option>)}
        </select>
      </div>

      {/* LIVE NASA HAZARD ALERT BANNER */}
      <div className={`rounded-2xl border p-4 ${alertBgMap[overallSpaceAlertLevel]}`}>
        <div className="flex items-center gap-3">
          {overallSpaceAlertLevel === 'NOMINAL'
            ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            : overallSpaceAlertLevel === 'CRITICAL'
            ? <Siren className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
            : <AlertTriangle className={`w-5 h-5 shrink-0 ${alertTextMap[overallSpaceAlertLevel]}`} />
          }
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold ${alertTextMap[overallSpaceAlertLevel]}`}>
                ● LIVE NASA SPACE WEATHER — ALERT LEVEL: {overallSpaceAlertLevel}
              </span>
              <span className="text-[10px] font-mono text-slate-500">Updated: {spaceWeather.lastUpdated}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-4 text-[11px] font-mono text-slate-300">
              <span>Solar Flare: <strong className={isHighFlare ? 'text-rose-400' : isMedFlare ? 'text-amber-400' : 'text-emerald-400'}>{spaceWeather.solarFlareLevel}</strong></span>
              <span>Wind Speed: <strong className="text-cyan-300">{spaceWeather.solarWindSpeedKmS} km/s</strong></span>
              <span>Radiation Flux: <strong className="text-amber-300">{spaceWeather.radiationFlux} pfu</strong></span>
              <span>Kp Index: <strong className={spaceWeather.geomagneticIndexKp > 5 ? 'text-rose-400' : 'text-slate-200'}>{spaceWeather.geomagneticIndexKp}</strong></span>
              <span>Sunspot Count: <strong className="text-slate-200">{spaceWeather.sunSpotCount}</strong></span>
              {spaceWeather.cmeAlert && <span className="text-rose-400 font-bold animate-pulse">⚡ CME ALERT ACTIVE</span>}
            </div>
          </div>
        </div>
      </div>

      {/* SELECTED SITE RISK DETAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Operational Safety Rating Gauge */}
        <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> OPERATIONAL SAFETY RATING — {site.shortName}
          </h3>

          <div className="flex items-center gap-6">
            {/* Gauge */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={safetyRating >= 65 ? '#10b981' : safetyRating >= 45 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="12"
                  strokeDasharray={`${(safetyRating / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center z-10">
                <div className={`text-2xl font-black font-mono ${safetyRating >= 65 ? 'text-emerald-400' : safetyRating >= 45 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {safetyRating}
                </div>
                <div className="text-[9px] font-mono text-slate-400">/ 100 SAFE</div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 flex-1">
              <div className={`text-sm font-bold font-mono px-3 py-1.5 rounded-lg border ${getRiskBgColor(siteRisk)}`}>
                <span className={getRiskTextColor(siteRisk)}>
                  {siteRisk < 35 ? '✓ LOW OVERALL RISK' : siteRisk < 60 ? '⚠ MODERATE OVERALL RISK' : '✗ HIGH OVERALL RISK'}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                {siteRisk < 35
                  ? 'This site presents minimal combined hazards. Safe for immediate crew deployment.'
                  : siteRisk < 60
                  ? 'Moderate risk profile. Mitigations required before crewed operations.'
                  : 'High risk — significant engineering mitigations needed before habitation.'}
              </p>
              <div className="text-[10px] font-mono text-slate-500">
                Composite of {RISK_FACTORS.length} risk factors • Site: {site.tier}
              </div>
            </div>
          </div>

          {/* Per-Factor Risk Bars */}
          <div className="space-y-2">
            {RISK_FACTORS.map(f => {
              const val = f.getValue(site);
              return (
                <div key={f.key} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <div className={`flex items-center gap-1.5 ${f.color(val)}`}>
                      {f.icon} <span>{f.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{f.getLabel(site)}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getRiskTextColor(val)} ${getRiskBgColor(val)}`}>
                        {getRiskLabel(val)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getRiskColor(val)}`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hazard Detail Cards */}
        <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" /> MITIGATION RECOMMENDATIONS
          </h3>

          {[
            {
              icon: <Radiation className="w-4 h-4" />,
              title: 'Radiation Shielding',
              active: site.radiationLevelMsvPerYear > 300,
              detail: site.radiationLevelMsvPerYear > 300
                ? `${site.radiationLevelMsvPerYear} mSv/yr exceeds safe limit. Add 2m regolith berm shielding.`
                : `${site.radiationLevelMsvPerYear} mSv/yr is within acceptable limits. Standard habitat shielding sufficient.`,
              color: site.radiationLevelMsvPerYear > 300 ? 'text-rose-400' : 'text-emerald-400',
            },
            {
              icon: <Mountain className="w-4 h-4" />,
              title: 'Slope Stability & Foundations',
              active: site.slopeDegrees > 7,
              detail: site.slopeDegrees > 7
                ? `${site.slopeDegrees}° slope requires engineered leveling pads and anchor pilings.`
                : `${site.slopeDegrees}° slope is gentle. Standard habitat foundation footpads adequate.`,
              color: site.slopeDegrees > 7 ? 'text-amber-400' : 'text-emerald-400',
            },
            {
              icon: <Thermometer className="w-4 h-4" />,
              title: 'Thermal Control System',
              active: (site.tempMaxKelvin - site.tempMinKelvin) > 80,
              detail: `ΔT = ${site.tempMaxKelvin - site.tempMinKelvin} K swing. ${(site.tempMaxKelvin - site.tempMinKelvin) > 80 ? 'Multi-layer insulation (MLI) and active thermal control required.' : 'Standard MLI blankets sufficient.'}`,
              color: (site.tempMaxKelvin - site.tempMinKelvin) > 80 ? 'text-amber-400' : 'text-emerald-400',
            },
            {
              icon: <Wind className="w-4 h-4" />,
              title: 'Dust Mitigation Protocol',
              active: site.siteType !== 'Lava Tube',
              detail: site.siteType === 'Lava Tube'
                ? 'Subterranean location provides complete dust protection.'
                : 'Deploy electrostatic dust shields on all optical surfaces. Use HEPA airlocks.',
              color: site.siteType === 'Lava Tube' ? 'text-emerald-400' : 'text-amber-400',
            },
            {
              icon: <Activity className="w-4 h-4" />,
              title: 'Seismic Monitoring',
              active: site.siteType === 'Lava Tube' || site.siteType === 'Mare Plain',
              detail: site.siteType === 'Lava Tube'
                ? 'Install structural integrity sensors inside tube. Monitor for settling.'
                : 'Deploy seismometer array. Use flexible habitat connection joints.',
              color: site.siteType === 'Lava Tube' ? 'text-amber-400' : 'text-emerald-400',
            },
            {
              icon: <Zap className="w-4 h-4" />,
              title: 'Solar Event Response',
              active: isHighFlare || spaceWeather.cmeAlert,
              detail: isHighFlare || spaceWeather.cmeAlert
                ? '⚡ ACTIVE ALERT: Direct crew to storm shelter immediately. Suspend EVA operations.'
                : 'Solar activity nominal. Maintain storm shelter readiness protocol at all times.',
              color: isHighFlare || spaceWeather.cmeAlert ? 'text-rose-400' : 'text-emerald-400',
            },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${item.active ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-950/50 border-slate-800'}`}>
              <span className={item.color}>{item.icon}</span>
              <div>
                <div className="text-[11px] font-mono font-bold text-white">{item.title}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5 leading-relaxed">{item.detail}</div>
              </div>
              <div className="ml-auto shrink-0">
                {item.active
                  ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RISK HEATMAP — All sites × all factors */}
      <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold font-mono text-white">RISK HEATMAP — ALL CANDIDATE SITES</h3>
          <span className="ml-auto text-[10px] font-mono text-slate-500">Lower score = Safer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono border-collapse">
            <thead>
              <tr>
                <th className="text-left text-slate-400 py-2 pr-4 font-normal">Site</th>
                {RISK_FACTORS.map(f => (
                  <th key={f.key} className="text-center text-slate-400 py-2 px-2 font-normal whitespace-nowrap">
                    {f.label}
                  </th>
                ))}
                <th className="text-center text-slate-400 py-2 px-2 font-normal">Overall Risk</th>
                <th className="text-center text-slate-400 py-2 px-2 font-normal">Safety Rating</th>
              </tr>
            </thead>
            <tbody>
              {heatmapSites.map((s, i) => {
                const composite = compositeRisk(s);
                const safety = 100 - composite;
                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectSite(s)}
                    className={`border-t border-slate-800/60 cursor-pointer transition-colors ${s.id === site.id ? 'bg-slate-800/40' : 'hover:bg-slate-900/40'}`}
                  >
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <span className="text-white font-bold">{s.code}</span>
                    </td>
                    {RISK_FACTORS.map(f => {
                      const val = f.getValue(s);
                      return (
                        <td key={f.key} className="text-center py-2 px-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            val < 35 ? 'bg-emerald-950 text-emerald-400' :
                            val < 60 ? 'bg-amber-950 text-amber-400' :
                            'bg-rose-950 text-rose-400'
                          }`}>
                            {getRiskLabel(val)}
                          </span>
                        </td>
                      );
                    })}
                    <td className="text-center py-2 px-2">
                      <span className={`font-bold ${getRiskTextColor(composite)}`}>{composite}</span>
                    </td>
                    <td className="text-center py-2 px-2">
                      <div className="flex items-center gap-1.5 justify-center">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getRiskColor(composite)}`}
                            style={{ width: `${safety}%` }}
                          />
                        </div>
                        <span className={`font-bold ${getRiskTextColor(composite)}`}>{safety}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-1 text-[10px] font-mono">
          <span className="text-slate-500">Risk Legend:</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Low (&lt;35)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" /> Moderate (35–60)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-500 inline-block" /> High (&gt;60)</span>
        </div>
      </div>
    </div>
  );
};
