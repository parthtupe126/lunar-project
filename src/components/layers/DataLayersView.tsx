import React, { useState } from 'react';
import { Layers, Database, Eye, ExternalLink, Sparkles, CheckCircle2, Satellite } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const DataLayersView: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState('lola');

  const datasets = [
    {
      id: 'lola',
      name: 'LRO LOLA (Lunar Orbiter Laser Altimeter)',
      instrument: 'Pulse laser altimeter (1064 nm)',
      resolution: '5 meters / pixel polar grid',
      coverage: '100% Polar & Global Topography',
      description: 'Provides ultra-accurate topographical elevation, slope gradients, surface roughness, and illumination maps. Essential for calculating habitat foundation tilt limits and crater rim sun coverage.',
      color: 'text-cyan-400',
      badge: 'Elevation & Slope'
    },
    {
      id: 'diviner',
      name: 'LRO Diviner Lunar Radiometer',
      instrument: '9-channel infrared radiometer',
      resolution: '200 meters / pixel',
      coverage: 'Global Day / Night Thermal Cycle',
      description: 'Maps the extreme thermal environment of the Moon, ranging from -248°C (25 K) in permanently shadowed craters up to +120°C (393 K) at sub-solar points. Critical for habitat insulation design.',
      color: 'text-rose-400',
      badge: 'Thermal & Temperature'
    },
    {
      id: 'lamp',
      name: 'LRO LAMP (Lyman-Alpha Mapping Project)',
      instrument: 'Far-ultraviolet imaging spectrograph',
      resolution: '100 meters / pixel in PSRs',
      coverage: 'Permanently Shadowed Regions (PSRs)',
      description: 'Uses interplanetary starlight and Lyman-alpha emissions to illuminate dark crater floors, identifying water ice frost patches with ~1.5% to 25% regolith weight concentration.',
      color: 'text-blue-400',
      badge: 'Water Ice Volatiles'
    },
    {
      id: 'lroc',
      name: 'LRO LROC (Lunar Reconnaissance Orbiter Camera)',
      instrument: 'Narrow Angle (NAC) & Wide Angle (WAC)',
      resolution: '0.5 meters / pixel optical',
      coverage: 'Complete South Pole Mosaic',
      description: 'High-resolution optical images capturing boulder distributions, micro-craters, and surface morphology for lunar lander precision guidance and hazard avoidance.',
      color: 'text-emerald-400',
      badge: 'Optical Imagery'
    },
    {
      id: 'mini-rf',
      name: 'LRO Mini-RF (Miniature Radio Frequency)',
      instrument: 'Synthetic Aperture Radar (S-band & X-band)',
      resolution: '15 meters / pixel',
      coverage: 'Subsurface Polar Deposits',
      description: 'Radar backscatter Circular Polarization Ratio (CPR) analysis differentiating surface roughness from subsurface pure water ice sheets.',
      color: 'text-purple-400',
      badge: 'Subsurface Radar'
    },
    {
      id: 'm3',
      name: 'Chandrayaan-1 Moon Mineralogy Mapper (M³)',
      instrument: 'Imaging Spectrometer (430 - 3000 nm)',
      resolution: '70 meters / pixel',
      coverage: 'Mineral & OH/H2O Absorption Bands',
      description: 'Uncovered definitive diagnostic absorption bands at 2.8 to 3.0 microns indicating widespread hydroxyl and water molecules bound in polar regolith.',
      color: 'text-amber-400',
      badge: 'Spectrometry'
    }
  ];

  const currentData = datasets.find(d => d.id === selectedDataset) || datasets[0];

  return (
    <div className="w-full h-full bg-[#050811] overflow-y-auto p-6 space-y-6 text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          NASA & INTERNATIONAL LUNAR SENSOR DATASETS
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Multi-spectral satellite data layers feeding the AI Decision Support Engine algorithms.
        </p>
      </div>

      {/* Dataset Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {datasets.map((dataset) => {
          const isSelected = selectedDataset === dataset.id;
          return (
            <div
              key={dataset.id}
              onClick={() => {
                soundManager.playSelect();
                setSelectedDataset(dataset.id);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-glow-cyan ring-1 ring-cyan-400/50'
                  : 'bg-[#0B1120]/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {dataset.badge}
                </span>
                <Satellite className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="font-mono text-sm font-bold text-white mb-1">{dataset.name}</h3>
              <p className="text-xs text-slate-400 font-mono mb-2">Res: {dataset.resolution}</p>
              <p className="text-xs text-slate-300 line-clamp-2">{dataset.description}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Dataset Detail Inspection Panel */}
      <div className="bg-[#0B1120]/90 border border-slate-800 rounded-2xl p-6 shadow-card backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
              SCIENTIFIC SPECIFICATION SHEET
            </span>
            <h3 className="text-lg font-bold font-mono text-white mt-0.5">{currentData.name}</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
            OPERATIONAL DATASET
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px]">Sensor Instrument</span>
            <div className="text-sm font-bold text-white mt-1">{currentData.instrument}</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px]">Spatial Resolution</span>
            <div className="text-sm font-bold text-cyan-300 mt-1">{currentData.resolution}</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px]">Planetary Coverage</span>
            <div className="text-sm font-bold text-emerald-300 mt-1">{currentData.coverage}</div>
          </div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold font-mono text-cyan-300">AI Integration & Processing Pipeline:</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {currentData.description} Raw PDS (Planetary Data System) archives are normalized into a continuous polar stereographic coordinate matrix. The neural MCDM model applies spatial convolution kernels to detect slope anomalies (&gt; 10°), calculate 365-day line-of-sight solar vectors, and estimate in-situ volatile density.
          </p>
        </div>
      </div>
    </div>
  );
};
