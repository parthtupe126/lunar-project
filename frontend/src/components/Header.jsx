import React from 'react';
import { 
  Rocket, 
  FileText, 
  Radio, 
  Sparkles, 
  Activity,
  Layers,
  BarChart3,
  Server,
  Maximize2,
  Minimize2,
  Users
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const Header = ({
  activeTab = 'map',
  setActiveTab = () => {},
  isMuted = false,
  setIsMuted = () => {},
  onOpenReport = () => {},
  onOpenMissions = () => {},
  onOpenTeam = () => {},
  spaceWeather = {},
  isBackendConnected = false,
  isFullscreen = false,
  onToggleFullscreen = () => {}
}) => {
  const navItems = [
    { id: 'map', label: '3D Lunar Globe', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'scoreboard', label: 'Habitat Scoreboard', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="h-14 bg-[#070B14]/95 border-b border-slate-800/80 px-4 flex items-center justify-between z-20 shrink-0 select-none backdrop-blur-xl animate-smooth-slide-down">
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
                v1.0
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Missions Directory Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenMissions();
          }}
          title="Open Structured Lunar Missions Directory (ISRO, Apollo, Artemis, SpaceX)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono font-semibold transition-all shadow-glow-cyan"
        >
          <Rocket className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden sm:inline">Missions Catalogue</span>
          <span className="sm:hidden">Missions</span>
        </button>

        {/* Project Team & Members Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenTeam();
          }}
          title="View GitHub Repository Contributors & Team Members"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-mono font-semibold transition-all shadow-glow-purple"
        >
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Repo Team</span>
          <span className="sm:hidden">Team</span>
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleFullscreen();
          }}
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Moon View (F)'}
          className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono ${
            isFullscreen 
              ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-glow-cyan' 
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
          <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
        </button>

        {/* AI Mission Dossier Trigger */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenReport();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-mono font-semibold transition-all shadow-glow-purple"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Mission Dossier</span>
          <span className="sm:hidden">Dossier</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

