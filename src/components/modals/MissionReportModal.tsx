import React from 'react';
import { LunarSite, MissionPriorityWeights, NasaSpaceWeather } from '../../types/lunar';
import { 
  FileText, 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Globe2, 
  Sparkles,
  Zap,
  Droplets,
  Mountain,
  Camera
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { generateAiAssessment } from '../../utils/aiEngine';

interface MissionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  topSite: LunarSite;
  allSites: LunarSite[];
  weights: MissionPriorityWeights;
  spaceWeather: NasaSpaceWeather;
}

export const MissionReportModal: React.FC<MissionReportModalProps> = ({
  isOpen,
  onClose,
  topSite,
  allSites,
  weights,
  spaceWeather
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundManager.playSelect();
    window.print();
  };

  const handleDownloadTxt = () => {
    soundManager.playSelect();
    const content = `========================================================================
LUNAR HABITAT SITE SELECTION & MISSION FEASIBILITY DOSSIER
AI Decision Support System — NASA Polar Architecture Assessment
Generated Date: ${new Date().toUTCString()}
========================================================================

1. EXECUTIVE SUMMARY & PRIMARY RECOMMENDATION
------------------------------------------------------------------------
Recommended Primary Site: ${topSite.name} (${topSite.code})
Coordinates: Latitude ${topSite.latitude}°, Longitude ${topSite.longitude}°
Overall Suitability Score: ${topSite.suitabilityScore} / 100 [${topSite.tier}]
AI Confidence: ${topSite.aiConfidence}%

2. FACTOR SCORE BREAKDOWN (0-100)
------------------------------------------------------------------------
- Terrain Flatness & Slope Stability: ${topSite.factors.terrain} / 100 (Slope: ${topSite.slopeDegrees}°)
- Water Ice Volatiles Proximity: ${topSite.factors.waterIce} / 100 (Est. Purity: ${topSite.waterIcePurityPercent}%)
- Solar Illumination & Power: ${topSite.factors.solarIllumination} / 100 (Annual Coverage: ${topSite.illuminationPercent}%)
- Radiation Shielding Profile: ${topSite.factors.radiationSafety} / 100 (${topSite.radiationLevelMsvPerYear} mSv/yr)
- Thermal Stability: ${topSite.factors.temperature} / 100 (${topSite.tempMinKelvin}K to ${topSite.tempMaxKelvin}K)
- Surface & Landing Corridor Accessibility: ${topSite.factors.accessibility} / 100

3. KEY SITE ADVANTAGES & ENGINEERING TRADE-OFFS
------------------------------------------------------------------------
${topSite.whyThisSite.map(w => `[${w.type.toUpperCase()}] ${w.text}`).join('\n')}

4. HABITAT DEPLOYMENT ACTION PLAN
------------------------------------------------------------------------
${topSite.missionRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

5. ACTIVE MISSION PRIORITY WEIGHTS
------------------------------------------------------------------------
- Water Ice: ${weights.waterIce}%
- Solar Energy: ${weights.solarEnergy}%
- Terrain Flatness: ${weights.terrain}%
- Radiation Safety: ${weights.radiation}%
- Landing Access: ${weights.access}%

6. REAL-TIME NASA SPACE WEATHER STATUS
------------------------------------------------------------------------
- Solar Flare Level: ${spaceWeather.solarFlareLevel}
- Solar Wind Velocity: ${spaceWeather.solarWindSpeedKmS} km/s
- Radiation Flux: ${spaceWeather.radiationFlux} pfu
- CME Hazard Alert: ${spaceWeather.cmeAlert ? 'ACTIVE WARNING' : 'CLEAR / NOMINAL'}

========================================================================
END OF DOSSIER — LUNAR HABITAT AI DECISION SUPPORT SYSTEM
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lunar_Site_Report_${topSite.code.replace(' ', '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0B1120] border border-cyan-500/50 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#070B14] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold font-mono text-white">
                AI LUNAR MISSION FEASIBILITY DOSSIER
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Official Multi-Criteria Site Assessment & Risk Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadTxt}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
              title="Download Text File"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable Report Content) */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 font-sans text-xs">
          {/* Executive Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-500/40">
                AI PRIMARY SELECTION
              </span>
              <h4 className="text-base font-bold text-white font-mono mt-1">
                {topSite.name}
              </h4>
              <p className="text-xs font-mono text-slate-300">
                Coordinates: {topSite.latitude}° N, {topSite.longitude}° E • Elevation: {topSite.elevationMeters}m
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                {topSite.suitabilityScore}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold">
                {topSite.tier} ({topSite.aiConfidence}% Confidence)
              </div>
            </div>
          </div>

          {/* Real Satellite Reconnaissance Photographic Banner */}
          {topSite.thumbnail && (
            <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-xl">
              <img 
                src={topSite.thumbnail} 
                alt={topSite.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-black/20" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span className="flex items-center gap-1.5 bg-black/80 px-2 py-1 rounded backdrop-blur-md border border-slate-700/60">
                  <Camera className="w-3 h-3 text-cyan-400" />
                  <span>NASA LROC Orbital Reconnaissance Survey</span>
                </span>
                <span className="bg-black/80 px-2 py-1 rounded backdrop-blur-md text-emerald-300 font-bold border border-slate-700/60">
                  Target Datum: {topSite.elevationMeters > 0 ? `+${topSite.elevationMeters}m` : `${topSite.elevationMeters}m`}
                </span>
              </div>
            </div>
          )}

          {/* Key Evaluation Factors */}
          <div className="space-y-2">
            <h5 className="font-mono font-bold text-slate-400 uppercase text-[11px]">
              Multi-Criteria Environmental Scores
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Terrain Flatness</span>
                <div className="text-sm font-bold text-cyan-300">{topSite.factors.terrain}/100</div>
                <span className="text-[10px] text-slate-500">Slope: {topSite.slopeDegrees}°</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Water Ice Volatiles</span>
                <div className="text-sm font-bold text-blue-300">{topSite.factors.waterIce}/100</div>
                <span className="text-[10px] text-slate-500">Purity: {topSite.waterIcePurityPercent}%</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Solar Illumination</span>
                <div className="text-sm font-bold text-amber-300">{topSite.factors.solarIllumination}/100</div>
                <span className="text-[10px] text-slate-500">{topSite.illuminationPercent}% Year-Round</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Radiation Safety</span>
                <div className="text-sm font-bold text-purple-300">{topSite.factors.radiationSafety}/100</div>
                <span className="text-[10px] text-slate-500">{topSite.radiationLevelMsvPerYear} mSv/yr</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Thermal Stability</span>
                <div className="text-sm font-bold text-orange-300">{topSite.factors.temperature}/100</div>
                <span className="text-[10px] text-slate-500">{topSite.tempMinKelvin}K - {topSite.tempMaxKelvin}K</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Accessibility</span>
                <div className="text-sm font-bold text-sky-300">{topSite.factors.accessibility}/100</div>
                <span className="text-[10px] text-slate-500">PSR Dist: {topSite.distanceToPsrMeters}m</span>
              </div>
            </div>
          </div>

          {/* Rationale & Recommendations */}
          <div className="space-y-3">
            <h5 className="font-mono font-bold text-slate-400 uppercase text-[11px]">
              AI Site Assessment & Engineering Directives
            </h5>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 leading-relaxed">
              {generateAiAssessment(topSite, weights)}
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              {topSite.missionRecommendations.map((rec) => (
                <div key={rec} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Space Weather Context */}
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>NASA DONKI Space Weather: <strong className="text-amber-300">{spaceWeather.solarFlareLevel}</strong></span>
            <span>Solar Wind: <strong className="text-cyan-300">{spaceWeather.solarWindSpeedKmS} km/s</strong></span>
            <span>CME Status: <strong className="text-emerald-400">NOMINAL</strong></span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#070B14] border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadTxt}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-glow-cyan flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Full Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
