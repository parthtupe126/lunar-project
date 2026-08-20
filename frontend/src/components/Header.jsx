import React from 'react';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  FileText, 
  Radio, 
  Sparkles, 
  Activity,
  Layers,
  BarChart3,
  Server
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const Header = ({
  activeTab = 'map',
  setActiveTab = () => {},
  isMuted = false,
  setIsMuted = () => {},
  onOpenReport = () => {},
  spaceWeather = {},
  isBackendConnected = false
}) => {
  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const navItems = [
    { id: 'map', label: '3D Lunar Globe', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'scoreboard', label: 'Habitat Scoreboard', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="h-14 bg-[#070B14]/95 border-b border-slate-800/80 px-4 flex items-center justify-between z-20 shrink-0 select-none backdrop-blur-xl">
      {/* Brand & Mission Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center shadow-glow-cyan">
          <Rocket className="w-5 h-5 text-white transform -rotate-45" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold font-mono tracking-tight text-white flex items-center gap-1.5">
              <span>LUNAR HABITAT AI</span>
              <span className="text-[10px] font-mono font-normal text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30">
                v2.4
              </span>
            </h1>
          </div>
          <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
            Artemis Multi-Criteria Site Selection & 3D Spatial Intelligence Studio
          </p>
        </div>
      </div>

      {/* Center Live Telemetry & ML Model Indicators */}
      <div className="hidden md:flex items-center gap-2 font-mono text-[11px]">
        {/* Machine Learning Model Indicator */}
        <div className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>ML: <strong className="text-white">XGBoost v1.0</strong> <span className="text-indigo-400 text-[10px]">(R² 0.956)</span></span>
        </div>

        {/* Backend API Connection Status */}
        <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
          isBackendConnected 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <Server className="w-3 h-3 text-cyan-400" />
          <span>Engine: <strong className={isBackendConnected ? 'text-emerald-400' : 'text-slate-300'}>
            {isBackendConnected ? 'FastAPI Active' : 'Local MCDA Active'}
          </strong></span>
        </div>

        {/* NASA Live Space Weather Pill */}
        <div className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>NASA API: <strong className="text-white">Active</strong> • Flare: <strong>{spaceWeather.solarFlareLevel || 'C1.1 (Nominal)'}</strong></span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* AI Mission Dossier Trigger */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenReport();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-mono font-semibold transition-all shadow-glow-purple cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>AI Mission Dossier</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
