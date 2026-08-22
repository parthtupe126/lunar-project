import React from 'react';
import { 
  Rocket, 
  FileText, 
  Users,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { soundManager } from '../utils/audio';

const NOOP = () => {};

export const Header = ({
  onOpenReport = NOOP,
  onOpenMissions = NOOP,
  onOpenTeam = NOOP,
  isFullscreen = false,
  onToggleFullscreen = NOOP
}) => {
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
          type="button"
          onClick={() => {
            soundManager.playSelect();
            onOpenMissions();
          }}
          title="Open Structured Lunar Missions Directory (ISRO, Apollo, Artemis, SpaceX)"
          aria-label="Open Structured Lunar Missions Directory"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono font-semibold transition-[color,background-color,border-color,box-shadow] shadow-glow-cyan cursor-pointer"
        >
          <Rocket className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden sm:inline">Missions Catalogue</span>
          <span className="sm:hidden">Missions</span>
        </button>

        {/* Project Team & Members Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playSelect();
            onOpenTeam();
          }}
          title="View GitHub Repository Contributors & Team Members"
          aria-label="View Project Team and Contributors"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-mono font-semibold transition-[color,background-color,border-color,box-shadow] shadow-glow-purple cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Repo Team</span>
          <span className="sm:hidden">Team</span>
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onToggleFullscreen();
          }}
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Moon View (F)'}
          aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen Moon View'}
          className={`p-2 rounded-xl border transition-[color,background-color,border-color,box-shadow] flex items-center gap-1.5 text-xs font-mono cursor-pointer ${
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
          type="button"
          onClick={() => {
            soundManager.playSelect();
            onOpenReport();
          }}
          aria-label="Generate AI Mission Dossier Report"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-mono font-semibold transition-[color,background-color,border-color,box-shadow] shadow-glow-purple cursor-pointer"
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
