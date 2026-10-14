import React from 'react';
import { EarthAnalogSite, TargetPlanet } from '../types';
import { SiteRadarChart } from './SiteRadarChart';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Star,
  Compass,
  AlertTriangle,
  Bot,
  ExternalLink,
  ShieldAlert,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SiteTelemetryModalProps {
  site: EarthAnalogSite | null;
  targetPlanet: TargetPlanet;
  onClose: () => void;
  onAskGemini: (site: EarthAnalogSite) => void;
}

export const SiteTelemetryModal: React.FC<SiteTelemetryModalProps> = ({
  site,
  targetPlanet,
  onClose,
  onAskGemini,
}) => {
  const { isFavorite, toggleFavorite, user, saveSiteNote } = useAuth();
  const [note, setNote] = React.useState('');

  React.useEffect(() => {
    if (site && user?.notes?.[site.id]) {
      setNote(user.notes[site.id]);
    } else {
      setNote('');
    }
  }, [site, user]);

  if (!site) return null;

  const favorited = isFavorite(site.id);

  const riskBadgeColors = {
    Nominal: 'bg-emerald-950/70 text-emerald-300 border-emerald-600/50',
    Moderate: 'bg-amber-950/70 text-amber-300 border-amber-600/50',
    High: 'bg-orange-950/70 text-orange-300 border-orange-600/50',
    Extreme: 'bg-red-950/70 text-red-300 border-red-600/50 animate-pulse',
  };

  const handleSaveNote = () => {
    if (site) {
      saveSiteNote(site.id, note);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#090d19] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 text-slate-100 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/50 bg-[#060a14] relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
                  Target: {targetPlanet}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  REF-ID: {site.id.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Chakra_Petch'] flex items-center gap-2 mt-0.5">
                {site.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleFavorite(site.id)}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
                favorited
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-amber-300'
              }`}
              title={favorited ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Star className={`w-4 h-4 ${favorited ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Top Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left Column: Match Rating & Traits */}
            <div className="md:col-span-5 space-y-4">
              {/* Match Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-800/40 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-cyan-400">Surface Match Rating</span>
                    <div className="text-4xl font-extrabold font-['Orbitron'] text-cyan-300 mt-1">
                      {site.matchRating.toFixed(1)}%
                    </div>
                  </div>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-cyan-400 stroke-current transition-all duration-1000"
                        strokeDasharray={`${site.matchRating}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <Sparkles className="w-5 h-5 text-cyan-300 absolute" />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-cyan-900/40 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Location: {site.location}, {site.country}</span>
                  <span>{site.distanceKm.toLocaleString()} km from JSC</span>
                </div>
                <div className="text-[11px] font-mono text-cyan-500/80 mt-1">
                  Coords: {site.coordinates.lat.toFixed(4)}°, {site.coordinates.lng.toFixed(4)}°
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>{site.description}</p>
              </div>

              {/* Data Traits Pills */}
              <div>
                <span className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">
                  Matching Terrestrial Data Traits
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {site.matchingTraits.map((trait) => (
                    <span
                      key={trait}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-cyan-950/60 border border-cyan-800/40 text-cyan-300"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Geological Era & Mineralogy */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Geological Era:</span>
                  <span className="font-semibold text-slate-200">{site.geologicalEra}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Water / Ice:</span>
                  <span className="font-semibold text-cyan-300">{site.waterIcePresence}</span>
                </div>
                <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Mineralogy:</span>
                  <div className="text-right flex flex-wrap justify-end gap-1">
                    {site.specificMineralogy.map((m) => (
                      <span key={m} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Chart.js Environmental Radar & Bar comparison */}
            <div className="md:col-span-7 flex flex-col">
              <SiteRadarChart site={site} targetPlanet={targetPlanet} />
            </div>
          </div>

          {/* Simulated Astronaut Challenges & EVA Hazards */}
          <div className="p-5 rounded-xl bg-[#0d1222] border border-red-900/40 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h3 className="font-['Chakra_Petch'] font-bold text-base text-red-300 uppercase tracking-wide">
                  Simulated Astronaut Challenges & EVA Environmental Hazards
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${riskBadgeColors[site.astronautChallenges.riskLevel]}`}>
                Risk Level: {site.astronautChallenges.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-amber-400 uppercase mb-2">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Environmental Stress Factors</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {site.astronautChallenges.environmental.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-red-400 uppercase mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>EVA Suit & Rover Hazards</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {site.astronautChallenges.evaHazards.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* NASA Tested Missions & Field Studies */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center space-x-2 mb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Historical NASA & International Analog Testing Campaigns
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {site.nasaMissionsTested.map((mission) => (
                <div
                  key={mission}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs font-mono text-cyan-200 flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{mission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Astronaut Crew Notes */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Mission Log & Specialist Notes (Saved to Profile)
            </label>
            <div className="flex gap-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Log reconnaissance observations, equipment considerations, or traverse targets for this site..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none h-16"
              />
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-mono font-medium self-end transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-3.5 border-t border-cyan-900/50 bg-[#060a14] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Telemetry calibrated {site.lastTelemetrySync}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onAskGemini(site);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition active:scale-95"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Gemini Surface Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
