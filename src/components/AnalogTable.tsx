import React, { useState } from 'react';
import { EarthAnalogSite, TargetPlanet } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Activity,
  Bot,
  Radar,
  ArrowRight,
  ShieldAlert,
  MapPin,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface AnalogTableProps {
  sites: EarthAnalogSite[];
  targetPlanet: TargetPlanet;
  onInspectSite: (site: EarthAnalogSite) => void;
  onAskGemini: (site: EarthAnalogSite) => void;
  isSimulatingUpdate: boolean;
}

export const AnalogTable: React.FC<AnalogTableProps> = ({
  sites,
  targetPlanet,
  onInspectSite,
  onAskGemini,
  isSimulatingUpdate,
}) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const [expandedSiteId, setExpandedSiteId] = useState<string | null>(null);

  const getMatchColor = (rating: number) => {
    if (rating >= 94) return 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40';
    if (rating >= 90) return 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40';
    return 'text-amber-300 bg-amber-950/60 border-amber-500/40';
  };

  if (sites.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-[#070b16]/90 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 mb-3">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="font-['Chakra_Petch'] text-base font-bold text-slate-300">
          No Terrestrial Analogs Matched
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No analog sites found matching your active terrain filters or mineralogy criteria for Target: {targetPlanet}. Try relaxing your filter switches.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-950/80 bg-[#080d1a]/90 backdrop-blur-xl shadow-2xl">
      {/* Top telemetry ticker */}
      <div className="px-5 py-3 border-b border-cyan-900/40 bg-[#050811] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-300 uppercase">
            EARTH ANALOG RECONNAISSANCE MATRIX
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-cyan-400 hidden sm:inline">
            Active Dataset: {sites.length} Verified Surface Sites
          </span>
        </div>

        {isSimulatingUpdate && (
          <div className="flex items-center space-x-1.5 text-cyan-300 text-[11px] animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Telemetry recalculation active...</span>
          </div>
        )}
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[#050812]/95 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="py-3.5 pl-5 pr-2 w-12 text-center">Fav</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Earth Analog Site</th>
              <th scope="col" className="py-3.5 px-4 font-semibold text-center">
                Match Rating %
              </th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Matching Data Traits</th>
              <th scope="col" className="py-3.5 px-4 font-semibold hidden md:table-cell">
                Geology & Minerals
              </th>
              <th scope="col" className="py-3.5 px-4 font-semibold hidden lg:table-cell">
                Distance
              </th>
              <th scope="col" className="py-3.5 pr-5 pl-2 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-850/60 font-sans">
            {sites.map((site) => {
              const favorited = isFavorite(site.id);
              const isExpanded = expandedSiteId === site.id;

              return (
                <React.Fragment key={site.id}>
                  <tr
                    className={`transition-colors duration-150 group hover:bg-cyan-950/20 ${
                      isExpanded ? 'bg-cyan-950/30' : ''
                    }`}
                  >
                    {/* Favorite Star */}
                    <td className="py-4 pl-5 pr-2 text-center">
                      <button
                        onClick={() => toggleFavorite(site.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 transition text-slate-500 hover:text-amber-400"
                        title={favorited ? 'Remove from favorites' : 'Save to profile favorites'}
                      >
                        <Star
                          className={`w-4 h-4 transition ${
                            favorited
                              ? 'fill-amber-400 text-amber-400 scale-110'
                              : 'text-slate-600 group-hover:text-slate-400'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Site Name & Location */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition font-['Chakra_Petch']">
                          {site.name}
                        </span>
                        <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-mono mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{site.location}, {site.country}</span>
                        </div>
                      </div>
                    </td>

                    {/* Match Rating % */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div
                          className={`px-3 py-1 rounded-xl font-mono font-bold text-sm border shadow-sm ${getMatchColor(
                            site.matchRating
                          )}`}
                        >
                          {site.matchRating.toFixed(1)}%
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {targetPlanet} parity
                        </span>
                      </div>
                    </td>

                    {/* Matching Data Traits */}
                    <td className="py-4 px-4 max-w-xs sm:max-w-md">
                      <div className="flex flex-wrap gap-1.5">
                        {site.matchingTraits.slice(0, 3).map((trait) => (
                          <span
                            key={trait}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-700/80 text-cyan-200"
                          >
                            {trait}
                          </span>
                        ))}
                        {site.matchingTraits.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900/60 text-slate-400">
                            +{site.matchingTraits.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Geology & Minerals */}
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex flex-col text-[11px] font-mono">
                        <span className="text-slate-300 font-medium truncate max-w-[180px]">
                          {site.geologicalEra}
                        </span>
                        <span className="text-cyan-400/90 text-[10px] truncate max-w-[180px]">
                          {site.waterIcePresence}
                        </span>
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-4 px-4 hidden lg:table-cell font-mono text-slate-300 text-xs">
                      {site.distanceKm.toLocaleString()} km
                    </td>

                    {/* Actions */}
                    <td className="py-4 pr-5 pl-2 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Radar Chart inspect */}
                        <button
                          onClick={() => onInspectSite(site)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 transition"
                          title="Inspect Telemetry & Radar Chart"
                        >
                          <Radar className="w-4 h-4" />
                        </button>

                        {/* Ask Gemini */}
                        <button
                          onClick={() => onAskGemini(site)}
                          className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white transition"
                          title="Ask Gemini Surface Analytics"
                        >
                          <Bot className="w-4 h-4" />
                        </button>

                        {/* Quick expand */}
                        <button
                          onClick={() => setExpandedSiteId(isExpanded ? null : site.id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition"
                          title={isExpanded ? 'Collapse row' : 'Quick preview'}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transform transition-transform ${
                              isExpanded ? 'rotate-180 text-cyan-400' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Quick Expand Accordion Row */}
                  {isExpanded && (
                    <tr className="bg-[#050811]/90 border-b border-cyan-950/80 animate-fade-in">
                      <td colSpan={7} className="p-4 sm:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">
                              Site Overview:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {site.description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[11px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Primary Astronaut Challenges:
                            </span>
                            <ul className="text-xs text-slate-300 space-y-1">
                              {site.astronautChallenges.environmental.slice(0, 2).map((h, i) => (
                                <li key={i} className="flex items-start space-x-1.5">
                                  <span className="text-amber-400">•</span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex flex-col justify-between items-start md:items-end">
                            <div className="text-right text-xs font-mono text-slate-400">
                              <div>Risk Rating: <span className="text-orange-400 font-bold">{site.astronautChallenges.riskLevel}</span></div>
                              <div className="text-[10px] text-slate-500 mt-1">Coords: {site.coordinates.lat.toFixed(3)}°, {site.coordinates.lng.toFixed(3)}°</div>
                            </div>
                            <button
                              onClick={() => onInspectSite(site)}
                              className="mt-3 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-xs flex items-center space-x-1.5 transition"
                            >
                              <span>Open Full Telemetry Radar</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
