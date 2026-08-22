import React from 'react';
import { 
  X, 
  FileText, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Cpu, 
  Compass, 
  Mountain, 
  Droplets, 
  Sun, 
  Radiation, 
  Thermometer, 
  Rocket,
  Printer
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { PhotoGalleryGrid } from './PhotoGalleryGrid';

const DEFAULT_SITES = [];
const DEFAULT_WEIGHTS = {};
const DEFAULT_WEATHER = {};
const NOOP = () => {};

function handlePrintReport() {
  soundManager.playClick();
  window.print();
}

export const SiteModal = ({
  isOpen = false,
  onClose = NOOP,
  topSite = null,
  allSites = DEFAULT_SITES,
  weights = DEFAULT_WEIGHTS,
  spaceWeather = DEFAULT_WEATHER
}) => {
  if (!isOpen || !topSite) return null;



  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B1120] border border-cyan-500/40 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#070B14] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <span>AI MISSION DOSSIER: LUNAR HABITAT ARCHITECTURE</span>
                <span className="text-[10px] bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40">
                  CLASSIFIED // NASA ARTEMIS
                </span>
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Multi-Criteria Decision Analysis & Site Optimization Summary
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close mission dossier modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar font-mono text-xs">
          
          {/* Top Site Executive Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                PRIMARY RECOMMENDED HABITAT SITE
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {topSite.name} ({topSite.code})
              </h3>
              <div className="text-slate-300 text-xs mt-1">
                Latitude: <strong className="text-cyan-300">{Number(topSite.latitude || 0).toFixed(2)}°S</strong> • Longitude: <strong className="text-cyan-300">{Number(topSite.longitude || 0).toFixed(2)}°E</strong> • Elevation: <strong className="text-white">{topSite.elevationMeters}m</strong>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {Number(topSite.suitabilityScore || 0).toFixed(1)} / 100
              </div>
              <div className="text-[10px] text-emerald-400 font-bold">
                {topSite.tier} ({topSite.aiConfidence}% Confidence)
              </div>
            </div>
          </div>

          {/* Detailed Factor Matrix */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Criteria Topographic & Resource Factor Matrix</span>
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <Mountain className="w-3.5 h-3.5" />
                  <span className="font-bold">Slope Flatness</span>
                </div>
                <div className="text-lg font-bold text-white">{topSite.factors.terrain}/100</div>
                <div className="text-[10px] text-slate-400">Local incline: {topSite.slopeDegrees}°</div>
              </div>

              <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span className="font-bold">Water Ice Volatiles</span>
                </div>
                <div className="text-lg font-bold text-white">{topSite.factors.waterIce}/100</div>
                <div className="text-[10px] text-slate-400">Purity: {topSite.waterIcePurityPercent}% (PSR: {topSite.distanceToPsrMeters}m)</div>
              </div>

              <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span className="font-bold">Solar Illumination</span>
                </div>
                <div className="text-lg font-bold text-white">{topSite.factors.solarIllumination}/100</div>
                <div className="text-[10px] text-slate-400">Annual coverage: {topSite.illuminationPercent}%</div>
              </div>

              <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                  <Radiation className="w-3.5 h-3.5" />
                  <span className="font-bold">Radiation Safety</span>
                </div>
                <div className="text-lg font-bold text-white">{topSite.factors.radiationSafety}/100</div>
                <div className="text-[10px] text-slate-400">Annual flux: {topSite.radiationLevelMsvPerYear} mSv</div>
              </div>

              <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-rose-400 mb-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span className="font-bold">Thermal Stability</span>
                </div>
                <div className="text-lg font-bold text-white">{topSite.factors.temperature}/100</div>
                <div className="text-[10px] text-slate-400">Range: {topSite.tempMinKelvin}K - {topSite.tempMaxKelvin}K</div>
              </div>

              <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-sky-400 mb-1">
                  <Rocket className="w-3.5 h-3.5" />
                  <span className="font-bold">Landing Corridor</span>
                </div>
                <div className="text-lg font-bold text-white">{topSite.factors.accessibility}/100</div>
                <div className="text-[10px] text-slate-400">Earth LOS: {topSite.earthLineOfSightPercent}%</div>
              </div>
            </div>
          </div>

          {/* Strategic Deployment Recommendations */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Recommended Habitat Engineering & Infrastructure Steps</span>
            </h4>
            <div className="bg-[#070B14] p-4 rounded-xl border border-slate-800 space-y-2">
              {topSite.missionRecommendations && topSite.missionRecommendations.map((rec) => (
                <div key={rec} className="flex items-start gap-2 text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    •
                  </span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Applied Weights Used */}
          <div className="p-3 bg-[#070B14] rounded-xl border border-slate-800 text-[11px] text-slate-400">
            <strong className="text-white">Active Evaluation Weights: </strong>
            Slope/Terrain ({weights.terrain}%) • Solar Energy ({weights.solarEnergy}%) • Water Ice ({weights.waterIce}%) • Radiation ({weights.radiation}%) • Access ({weights.access}%)
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070B14] border-t border-slate-800 flex items-center justify-between">
          <div className="text-[10px] font-mono text-slate-500">
            Exported from Lunar Habitat AI Decision Studio
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-mono text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-mono text-xs font-bold transition-colors shadow-glow-cyan"
            >
              Close Dossier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SiteModal;
