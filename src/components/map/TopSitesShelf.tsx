import React from 'react';
import { LunarSite } from '../../types/lunar';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface TopSitesShelfProps {
  sites: LunarSite[];
  selectedSite: LunarSite | null;
  onSelectSite: (site: LunarSite) => void;
}

export const TopSitesShelf: React.FC<TopSitesShelfProps> = ({
  sites,
  selectedSite,
  onSelectSite
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    soundManager.playClick();
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#070B14]/95 border-t border-slate-800/80 px-4 py-3 z-10 shrink-0 select-none backdrop-blur-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            TOP RECOMMENDED SITES
          </h3>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            Ranked by AI Multi-Criteria Suitability
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Deck */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {sites.map((site, index) => {
          const isSelected = selectedSite?.id === site.id;
          const rank = index + 1;

          let badgeStyle = 'bg-slate-800/80 text-slate-300 border-slate-700';
          let borderStyle = 'border-slate-800 hover:border-slate-600';
          let rankColor = 'text-slate-300';

          if (rank === 1) {
            badgeStyle = 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-glow-purple';
            rankColor = 'text-purple-400';
          } else if (rank === 2) {
            badgeStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
            rankColor = 'text-emerald-400';
          } else if (rank === 3) {
            badgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-500/40';
            rankColor = 'text-amber-400';
          } else if (rank === 4) {
            badgeStyle = 'bg-blue-950/80 text-blue-300 border-blue-500/40';
            rankColor = 'text-blue-400';
          } else if (rank === 5) {
            badgeStyle = 'bg-orange-950/80 text-orange-300 border-orange-500/40';
            rankColor = 'text-orange-400';
          }

          if (isSelected) {
            borderStyle = 'border-purple-500 ring-2 ring-purple-500/30 bg-purple-950/30';
          }

          return (
            <div
              key={site.id}
              onClick={() => {
                soundManager.playSelect();
                onSelectSite(site);
              }}
              className={`flex-shrink-0 w-52 bg-[#0B1120]/90 rounded-xl p-2.5 border ${borderStyle} cursor-pointer transition-all duration-200 hover:translate-y-[-2px] shadow-card group`}
            >
              {/* Header: Rank + Code + Score */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
                  <span className={`w-4 h-4 rounded flex items-center justify-center bg-slate-900 border border-slate-700 text-[10px] ${rankColor}`}>
                    {rank}
                  </span>
                  <span className="text-white">{site.code}</span>
                </div>
                <span className={`font-mono text-xs font-bold ${rankColor}`}>
                  {site.suitabilityScore.toFixed(1)}
                </span>
              </div>

              {/* Crater Preview Thumbnail (Matching Image 2) */}
              <div className="relative h-16 rounded-lg overflow-hidden mb-2 border border-slate-700/60">
                <img
                  src={site.thumbnail}
                  alt={site.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-transparent" />
              </div>

              {/* Coordinates */}
              <div className="text-[10px] font-mono text-slate-400 text-center mb-1.5">
                {site.latitude.toFixed(2)}°, {site.longitude.toFixed(2)}°
              </div>

              {/* Suitability Badge (Matching Image 2) */}
              <div className="text-center">
                <span className={`inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${badgeStyle}`}>
                  {site.tier === 'HIGHLY SUITABLE' ? 'Highly Suitable' : site.tier === 'SUITABLE' ? 'Suitable' : 'Moderate'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
