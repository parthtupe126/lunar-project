import React from 'react';
import { ActiveTab, MissionPriorityWeights } from '../../types/lunar';
import { 
  Globe2, 
  BarChart3, 
  Layers, 
  Sliders, 
  FileText, 
  Volume2, 
  VolumeX, 
  Radio,
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenReport: () => void;
  nasaLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  onOpenReport,
  nasaLive
}) => {
  const handleTabClick = (tab: ActiveTab) => {
    soundManager.playClick();
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) soundManager.playSelect();
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'DASHBOARD', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'map', label: 'LUNAR MAP', icon: <Globe2 className="w-3.5 h-3.5" /> },
    { id: 'analysis', label: 'SITE ANALYSIS', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'optimization', label: 'OPTIMIZATION', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'layers', label: 'DATA LAYERS', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="h-16 px-5 bg-[#070B14]/90 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Mission Title */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 shadow-glow-cyan">
          <Globe2 className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070B14] animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 font-mono">
              LUNAR HABITAT AI
            </h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
            AI-Powered Lunar Site Selection & Mission Planning
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center bg-[#0B1120]/90 p-1 rounded-xl border border-slate-700/60 shadow-inner">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan border border-cyan-400/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: NASA Telemetry, Sound & AI Status */}
      <div className="flex items-center gap-3">
        {/* NASA Live API Status */}
        <div 
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[11px] font-mono text-slate-300"
          title="Connected to NASA Open Data API Key"
        >
          <Radio className={`w-3.5 h-3.5 ${nasaLive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
          <span>NASA DONKI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping-slow" />
        </div>

        {/* Generate Mission Dossier Report Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenReport();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 hover:border-purple-400 text-xs font-mono transition-all shadow-glow-purple"
          title="Export AI Mission Briefing Dossier"
        >
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden lg:inline">EXPORT DOSSIER</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors"
          title={isMuted ? "Unmute Audio FX" : "Mute Audio FX"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* AI System Online Badge (Matching Reference UI) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium shadow-glow-green">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide">AI SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
};
