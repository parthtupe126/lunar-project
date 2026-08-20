import React from 'react';
import { 
  Globe2, 
  Volume2, 
  VolumeX, 
  FileText, 
  Compass,
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
  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="h-13 bg-[#0a0d14]/95 border-b border-slate-800/60 px-4 flex items-center justify-between z-20 shrink-0 select-none backdrop-blur-md">
      {/* Brand & Studio Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/70 flex items-center justify-center shadow-sm">
          <Globe2 className="w-4 h-4 text-sky-400" />
        </div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xs font-semibold tracking-tight text-white flex items-center gap-2">
            <span className="font-sans font-bold text-slate-100 text-sm">LUNAR HABITAT</span>
            <span className="text-[11px] font-mono text-slate-400 font-normal">STUDIO</span>
          </h1>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            v2.4
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5">
        {/* Missions Directory Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenMissions();
          }}
          title="Open Structured Lunar Missions Directory (ISRO, Apollo, Artemis, SpaceX)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Missions Directory</span>
          <span className="sm:hidden">Missions</span>
        </button>

        {/* Project Team Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenTeam();
          }}
          title="View Team Members & Contributors"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Contributors</span>
          <span className="sm:hidden">Team</span>
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleFullscreen();
          }}
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen View (F)'}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isFullscreen 
              ? 'bg-sky-950/60 border-sky-600/50 text-sky-300' 
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-sky-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Primary Action: AI Mission Dossier Trigger */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenReport();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer ml-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Mission Dossier</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

