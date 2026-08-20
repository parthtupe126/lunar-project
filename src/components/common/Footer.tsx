import React from 'react';
import { Target, Compass, Sparkles, Database, Cpu, Clock, Activity } from 'lucide-react';

interface FooterProps {
  totalCandidateSites: number;
  analyzedRegionsCount: number;
  bestScore: number;
  lastUpdated: string;
}

export const Footer: React.FC<FooterProps> = ({
  totalCandidateSites,
  analyzedRegionsCount,
  bestScore,
  lastUpdated
}) => {
  return (
    <footer className="h-9 px-5 bg-[#070B14]/95 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20 shrink-0 select-none">
      <div className="flex items-center gap-6 overflow-x-auto py-1">
        {/* Candidate Sites */}
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Candidate Sites:</span>
          <span className="font-bold text-slate-200">{totalCandidateSites}</span>
        </div>

        {/* Analyzed Regions */}
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Analyzed Regions:</span>
          <span className="font-bold text-slate-200">{analyzedRegionsCount.toLocaleString()}</span>
        </div>

        {/* Best Score */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Best Score:</span>
          <span className="font-bold text-amber-300">{bestScore.toFixed(1)}</span>
        </div>

        {/* Data Status */}
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">Data Status:</span>
          <span className="font-semibold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
            LRO LOLA & LAMP ACTIVE
          </span>
        </div>

        {/* AI Status */}
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">AI Status:</span>
          <span className="font-semibold text-cyan-300">READY (NEURAL MCDM)</span>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-slate-400 shrink-0 pl-4 border-l border-slate-800">
        <Clock className="w-3 h-3 text-slate-400" />
        <span>Sync: <strong className="text-slate-300">{lastUpdated}</strong></span>
      </div>
    </footer>
  );
};
