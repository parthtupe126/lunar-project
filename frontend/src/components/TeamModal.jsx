import React from 'react';
import { 
  X, 
  Users, 
  Github, 
  GitBranch, 
  GitCommit, 
  ExternalLink, 
  Code, 
  Sparkles, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Rocket, 
  CheckCircle2 
} from 'lucide-react';
import { soundManager } from '../utils/audio';

const REPO_URL = 'https://github.com/harshpenjarla-sys/Lunar-project';

const TEAM_MEMBERS = [
  {
    id: 'harsh',
    name: 'Harsh Penjarla',
    handle: 'harshpenjarla-sys',
    role: 'Project Lead & Repository Owner',
    badge: 'Owner / Lead',
    badgeColor: 'from-amber-500 to-orange-500 text-amber-100',
    avatar: 'https://avatars.githubusercontent.com/u/305730311?v=4',
    githubUrl: 'https://github.com/harshpenjarla-sys',
    contributions: [
      'Repository Architecture & Mission Vision',
      'Lunar Project Strategy & Habitat Planning',
      'Open Source Coordination & Codebase Oversight'
    ],
    skills: ['Project Leadership', 'System Design', 'Lunar Cartography', 'Research']
  },
  {
    id: 'ayush',
    name: 'Ayush Chavhan',
    handle: 'ayushchavhan69',
    role: 'Core Frontend & 3D Interactive UI Developer',
    badge: 'Core Developer',
    badgeColor: 'from-cyan-500 to-blue-500 text-cyan-100',
    avatar: 'https://avatars.githubusercontent.com/u/ayushchavhan69',
    githubUrl: 'https://github.com/ayushchavhan69',
    contributions: [
      '3D High-Fidelity Spinning Moon & Opening Sequence',
      'Auto-Navigation & Orbit Camera Interpolation',
      'Scientific Telemetry Deep-Dive & Mission Catalogues',
      'UI Refinements & Real-Photo Resilient Sync'
    ],
    skills: ['Three.js / WebGL', 'React', 'TailwindCSS', 'Audio FX', 'Vite']
  },
  {
    id: 'prafull',
    name: 'Prafull Bugadikattekar',
    handle: 'prafullbugadikattekar-commits',
    role: 'Machine Learning & Geospatial Pipeline Engineer',
    badge: 'ML & Pipeline',
    badgeColor: 'from-purple-500 to-pink-500 text-purple-100',
    avatar: 'https://avatars.githubusercontent.com/u/254096911?v=4',
    githubUrl: 'https://github.com/prafullbugadikattekar-commits',
    contributions: [
      'XGBoost ML Habitat Suitability Model',
      'Topographical DEM & Slope Geospatial Pipeline',
      'MCDA Engine Algorithmic Weighting Integration'
    ],
    skills: ['Python', 'XGBoost', 'Geospatial ML', 'SHAP Analysis', 'FastAPI']
  }
];

export const TeamModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b101d] border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070b14]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-glow-cyan">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono tracking-tight">
                  PROJECT CONTRIBUTORS & TEAM
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  {TEAM_MEMBERS.length} Members
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Lunar Habitat AI — Collaborative Engineering Team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-xs text-cyan-300 font-mono transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View GitHub Repo</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Repo Overview Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <GitBranch className="w-3.5 h-3.5" />
                <span>Repository: <strong className="text-white">harshpenjarla-sys/Lunar-project</strong></span>
              </div>
              <p className="text-xs text-slate-300">
                AI-powered Lunar Habitat Suitability & Interactive 3D Cartographic Explorer
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Branch: main
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-purple-300 flex items-center gap-1">
                <GitCommit className="w-3 h-3" /> Latest Sync
              </span>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="rounded-xl bg-[#0e1424]/80 border border-slate-800/90 hover:border-cyan-500/50 p-5 flex flex-col justify-between transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] group"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0284c7&color=fff`;
                      }}
                      className="w-12 h-12 rounded-xl border border-cyan-500/40 object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white font-mono truncate">
                        {member.name}
                      </h3>
                      <p className="text-[11px] text-cyan-400 font-mono truncate">
                        @{member.handle}
                      </p>
                      <span className={`inline-block mt-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r ${member.badgeColor}`}>
                        {member.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mb-3">
                    {member.role}
                  </p>

                  {/* Contributions */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                      Key Contributions
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {member.contributions.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Link */}
                <a
                  href={member.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800/80 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            ))}
          </div>

          {/* Technology & Collaboration Credits */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2 font-mono">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Project Technology Stack</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">React 18 + Vite</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Three.js / 3D Canvas</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Python XGBoost ML</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">NASA PDS / LRO DEM Geospatial</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">TailwindCSS</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#070b14]/90 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lunar Habitat AI v2.4</span>
          </div>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>github.com/harshpenjarla-sys/Lunar-project</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default TeamModal;
