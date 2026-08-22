import React from 'react';
import { Database } from 'lucide-react';

export const Footer = ({
  totalCandidateSites = 23,
  analyzedRegionsCount = 1250,
  bestScore = 94.2,
  lastUpdated = 'Live'
}) => {
  return (
    <footer className="h-7 bg-[#070B14] border-t border-slate-800/80 px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 z-20 shrink-0 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">MCDA ENGINE OPERATIONAL</span>
        </div>
        <span className="text-slate-700 hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1">
          <Database className="w-3 h-3 text-cyan-400" />
          <span>Polygonal Topography Grid: <strong>{analyzedRegionsCount}km²</strong></span>
        </div>
        <span className="text-slate-700 hidden md:inline">|</span>
        <div className="hidden md:flex items-center gap-1">
          <span>Candidate Sites: <strong className="text-white">{totalCandidateSites}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div>
          Top Suitability: <strong className="text-purple-400">{bestScore.toFixed(1)}/100</strong>
        </div>
        <span className="text-slate-700">|</span>
        <div className="text-slate-400">
          Status: <strong className="text-cyan-300">Synchronized ({lastUpdated})</strong>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
