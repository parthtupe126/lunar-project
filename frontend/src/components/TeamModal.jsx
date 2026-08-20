import React from 'react';
import { 
  X, 
  Users, 
  Github, 
  GitBranch, 
  GitCommit, 
  ExternalLink, 
  CheckCircle2,
  Globe
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
    avatar: 'https://avatars.githubusercontent.com/u/305730311?v=4',
    githubUrl: 'https://github.com/harshpenjarla-sys',
    contributions: [
      'Repository Architecture & Mission Strategy',
      'Lunar Exploration Roadmap & Habitat Planning',
      'Codebase Oversight & Open Source Direction'
    ],
    skills: ['Project Leadership', 'System Design', 'Lunar Cartography', 'Research']
  },
  {
    id: 'ayush',
    name: 'Ayush Chavhan',
    handle: 'ayushchavhan69',
    role: 'Core Frontend & 3D Interactive UI Developer',
    badge: 'Core Developer',
    avatar: 'https://avatars.githubusercontent.com/u/ayushchavhan69',
    githubUrl: 'https://github.com/ayushchavhan69',
    contributions: [
      '3D High-Fidelity Spinning Moon & Opening Sequence',
      'Auto-Navigation & Orbit Camera Controls',
      'Scientific Telemetry Deep-Dive & Mission Catalogues',
      'UI/UX Redesign & Resilient Photo Pipeline'
    ],
    skills: ['Three.js / WebGL', 'React', 'TailwindCSS', 'Audio FX', 'Vite']
  },
  {
    id: 'prafull',
    name: 'Prafull Bugadikattekar',
    handle: 'prafullbugadikattekar-commits',
    role: 'Machine Learning & Geospatial Pipeline Engineer',
    badge: 'ML & Pipeline',
    avatar: 'https://avatars.githubusercontent.com/u/254096911?v=4',
    githubUrl: 'https://github.com/prafullbugadikattekar-commits',
    contributions: [
      'XGBoost ML Habitat Suitability Model',
      'Topographical DEM & Slope Geospatial Pipeline',
      'MCDA Engine Algorithmic Normalization'
    ],
    skills: ['Python', 'XGBoost', 'Geospatial ML', 'SHAP Analysis', 'FastAPI']
  }
];

export const TeamModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c1017] border border-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">
                  Contributors & Team
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {TEAM_MEMBERS.length} Engineers
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lunar Habitat AI — Open Source Mission Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub Repository</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
            </a>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          
          {/* Repo Overview Banner */}
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <GitBranch className="w-3.5 h-3.5 text-sky-400" />
                <span>Repository: <strong className="text-white">harshpenjarla-sys/Lunar-project</strong></span>
              </div>
              <p className="text-xs text-slate-400">
                AI-powered Lunar Habitat Suitability & Interactive 3D Cartographic Explorer
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> main
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
                <GitCommit className="w-3 h-3 text-slate-400" /> Latest Sync
              </span>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-4 flex flex-col justify-between transition-colors group"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0284c7&color=fff`;
                      }}
                      className="w-11 h-11 rounded-lg border border-slate-700 object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-white truncate">
                        {member.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        @{member.handle}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {member.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mb-3">
                    {member.role}
                  </p>

                  {/* Contributions */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">
                      Key Contributions
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {member.contributions.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-slate-500 mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {member.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60"
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
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                </a>
              </div>
            ))}
          </div>

          {/* Technology & Collaboration Credits */}
          <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Technology Architecture</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">React 18 + Vite</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Three.js / WebGL</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Python XGBoost ML</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">NASA PDS / LOLA Altimetry</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">TailwindCSS</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-2.5 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Lunar Habitat AI v2.4</span>
          </div>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white flex items-center gap-1"
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

