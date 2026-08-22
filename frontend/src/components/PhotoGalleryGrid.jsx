import React, { useState } from 'react';
import { Camera, Maximize2, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

const DEFAULT_GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Surface Crew & Lunar Lander Touchdown Zone',
    overlayText: ''
  },
  {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Orbital Descent & Lunar Landing Vehicle',
    overlayText: 'View Lander'
  },
  {
    url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Autonomous Surface Exploration Rover',
    overlayText: ''
  },
  {
    url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Pressurized Base Habitat & In-Situ Infrastructure',
    overlayText: ''
  }
];

const DEFAULT_IMAGES = [];
const NOOP = () => {};

export const PhotoGalleryGrid = ({
  images = DEFAULT_IMAGES,
  siteName = 'Lunar Target',
  onViewLander = NOOP
}) => {
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  const displayImages = (images && images.length > 0) ? images.slice(0, 4) : DEFAULT_GALLERY;

  return (
    <div className="w-full">
      {/* 4-Panel Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {displayImages.map((img, idx) => {
          
          return (
            <div
              key={img.url}
              className="group relative h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-950/90 border border-slate-800/90 hover:border-cyan-500/60 transition-[border-color,box-shadow] duration-300 shadow-lg text-left w-full"
            >
              {/* Background Lunar Photo */}
              <img
                src={img.url}
                alt={img.alt_text || `${siteName} Survey ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/10 transition-colors" />

              {/* Top-Right Expand Icon on Hover */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveLightboxImage(img);
                }}
                aria-label={`Expand photo ${img.alt_text || siteName}`}
                className="absolute top-2 right-2 p-1 rounded-md bg-black/70 text-cyan-300 backdrop-blur-sm border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
              </button>

              {/* Bottom Caption & Action Pill */}
              <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-1">
                <span className="text-[9px] font-mono text-slate-300 truncate max-w-[65%] drop-shadow">
                  {img.alt_text?.split('—')[0] || `Recon ${idx + 1}`}
                </span>

                {img.overlayText ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playSelect();
                      if (img.overlayText === 'View Lander') {
                        onViewLander(img);
                      } else {
                        setActiveLightboxImage(img);
                      }
                    }}
                    aria-label={`Action ${img.overlayText}`}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-900/90 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold tracking-wide backdrop-blur-md shadow-glow-cyan transition-[background-color,transform] hover:scale-105 shrink-0 cursor-pointer"
                  >
                    {img.overlayText}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {activeLightboxImage && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="High Resolution Optical Survey Lightbox"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-200"
          onClick={() => setActiveLightboxImage(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setActiveLightboxImage(null);
          }}
          tabIndex={-1}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#070B14] border border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between font-mono text-xs">
              <span className="text-cyan-400 font-bold flex items-center gap-2">
                <Camera className="w-4 h-4" />
                {siteName} — {activeLightboxImage.alt_text || 'High-Resolution Optical Survey'}
              </span>
              <button
                type="button"
                onClick={() => setActiveLightboxImage(null)}
                aria-label="Close optical survey lightbox"
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeLightboxImage.url}
                alt={activeLightboxImage.alt_text}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-3 bg-[#0B1120] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>{activeLightboxImage.alt_text}</span>
              <span className="text-cyan-300">NASA PDS / LRO LROC Reconnaissance Archives</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryGrid;
