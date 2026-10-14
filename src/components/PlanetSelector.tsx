import React from 'react';
import { TargetPlanet } from '../types';
import { TARGET_PLANET_PROFILES } from '../data/analogSites';
import {
  Globe2,
  RefreshCw,
  Gauge,
  Thermometer,
  Shield,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PlanetSelectorProps {
  selectedPlanet: TargetPlanet;
  onSelectPlanet: (planet: TargetPlanet) => void;
  secondsUntilRefresh: number;
  onManualRefresh: () => void;
  isRefreshing: boolean;
}

export const PlanetSelector: React.FC<PlanetSelectorProps> = ({
  selectedPlanet,
  onSelectPlanet,
  secondsUntilRefresh,
  onManualRefresh,
  isRefreshing,
}) => {
  const profile = TARGET_PLANET_PROFILES[selectedPlanet];
  const isMars = selectedPlanet === 'Mars';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-950/80 bg-gradient-to-b from-[#0a0f20]/90 to-[#060913]/90 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
      {/* Background ambient planetary glow */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${
          isMars ? 'bg-orange-500' : 'bg-cyan-400'
        }`}
      />

      {/* Main Switcher Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        {/* Toggle Button: Target: Moon vs Target: Mars */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-inner">
            <button
              onClick={() => onSelectPlanet('Mars')}
              className={`flex items-center space-x-2.5 px-5 py-2.5 rounded-xl font-['Chakra_Petch'] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                isMars
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30 ring-1 ring-orange-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
              <span>Target: Mars</span>
              <span className="text-xs opacity-75">♂</span>
            </button>

            <button
              onClick={() => onSelectPlanet('Moon')}
              className={`flex items-center space-x-2.5 px-5 py-2.5 rounded-xl font-['Chakra_Petch'] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                !isMars
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 ring-1 ring-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse" />
              <span>Target: Moon</span>
              <span className="text-xs opacity-75">☾</span>
            </button>
          </div>

          {/* Active Planetary Designation */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400">Baseline Target:</span>
            <span className={`font-bold px-2 py-0.5 rounded border ${
              isMars 
                ? 'bg-orange-950/60 text-orange-300 border-orange-800/60' 
                : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
            }`}>
              {profile.code}
            </span>
          </div>
        </div>

        {/* Live Simulation Telemetry Status & Manual Ping */}
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Activity className={`w-4 h-4 ${isRefreshing ? 'text-cyan-400 animate-spin' : 'text-emerald-400'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                Real-Time Telemetry
              </span>
              <span className="text-slate-200">
                Sync in <span className="text-cyan-300 font-bold">{secondsUntilRefresh}s</span>
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 transition text-[11px] disabled:opacity-50"
            title="Force immediate sensor recalibration cycle"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Now</span>
          </button>
        </div>
      </div>

      {/* Target Planetary Environmental Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] mb-1">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Surface Gravity</span>
          </div>
          <span className="text-slate-100 font-bold">{profile.gravity}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] mb-1">
            <Thermometer className="w-3.5 h-3.5 text-orange-400" />
            <span>Surface Temp Swing</span>
          </div>
          <span className="text-slate-100 font-bold truncate block">{profile.surfaceTemp}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] mb-1">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Atmospheric Density</span>
          </div>
          <span className="text-slate-100 font-bold truncate block">{profile.atmosphere}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] mb-1">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Radiation Exposure</span>
          </div>
          <span className="text-slate-100 font-bold truncate block">{profile.radiationLevel}</span>
        </div>
      </div>
    </div>
  );
};
