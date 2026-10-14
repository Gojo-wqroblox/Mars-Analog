import React, { useState } from 'react';
import { EarthAnalogSite, TargetPlanet } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Trash2,
  Radar,
  Bot,
  Download,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileText,
} from 'lucide-react';

interface FavoritesViewProps {
  allSites: EarthAnalogSite[];
  targetPlanet: TargetPlanet;
  onInspectSite: (site: EarthAnalogSite) => void;
  onAskGemini: (site: EarthAnalogSite) => void;
  onBackToExplorer: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  allSites,
  targetPlanet,
  onInspectSite,
  onAskGemini,
  onBackToExplorer,
}) => {
  const { user, toggleFavorite, saveSiteNote } = useAuth();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const favoriteSites = allSites.filter((site) => user?.favorites.includes(site.id));

  const handleExportBriefing = () => {
    const briefingData = {
      missionTitle: 'NULLG: Interplanetary Site Scout - Crew Recon Briefing',
      astronaut: user?.callsign || 'OPERATOR',
      role: user?.role,
      agency: user?.organization,
      exportedAt: new Date().toISOString(),
      targetPlanet,
      favoriteSites: favoriteSites.map((s) => ({
        id: s.id,
        name: s.name,
        location: `${s.location}, ${s.country}`,
        matchRating: s.matchRating,
        traits: s.matchingTraits,
        geologicalEra: s.geologicalEra,
        astronautChallenges: s.astronautChallenges,
        crewNotes: user?.notes?.[s.id] || 'None logged',
      })),
    };

    const blob = new Blob([JSON.stringify(briefingData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NULLG_Mission_Briefing_${targetPlanet}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header of Favorites */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090d19]/90 border border-cyan-900/50 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50">
                CREW FAVORED TARGETS
              </span>
              <span className="text-xs font-mono text-slate-400">
                {favoriteSites.length} Sites Stored in Profile
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch'] text-white mt-0.5">
              My Saved Terrestrial Analogs
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {favoriteSites.length > 0 && (
            <button
              onClick={handleExportBriefing}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 font-mono text-xs flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Mission Briefing</span>
            </button>
          )}

          <button
            onClick={onBackToExplorer}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-xs transition"
          >
            ← Back to Full Explorer
          </button>
        </div>
      </div>

      {/* If Empty */}
      {favoriteSites.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#070b16]/90 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white">
            No Favorite Analog Sites Saved Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't added any sites to your profile favorites. Click the star icon next to any site in the Earth Analog Explorer Table to track it for mission planning.
          </p>
          <button
            onClick={onBackToExplorer}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-xs transition"
          >
            Browse Earth Analog Explorer
          </button>
        </div>
      ) : (
        /* Grid of Favorite Sites */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {favoriteSites.map((site) => {
            const isEditing = editingNoteId === site.id;
            const currentNote = user?.notes?.[site.id] || '';

            return (
              <div
                key={site.id}
                className="rounded-2xl border border-cyan-950/80 bg-[#080d1c]/90 p-5 flex flex-col justify-between backdrop-blur-md hover:border-cyan-800/60 transition group"
              >
                <div>
                  {/* Top site bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-semibold">
                          Target: {site.primaryTarget}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {site.geologicalEra}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white font-['Chakra_Petch'] mt-1 group-hover:text-cyan-300 transition">
                        {site.name}
                      </h3>
                      <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-mono mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{site.location}, {site.country}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="px-2.5 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-sm">
                        {site.matchRating.toFixed(1)}%
                      </div>
                      <button
                        onClick={() => toggleFavorite(site.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 transition"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Matching Traits */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {site.matchingTraits.map((trait) => (
                      <span
                        key={trait}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-700/80 text-cyan-200"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Astronaut Hazard snippet */}
                  <div className="mt-3 p-3 rounded-xl bg-black/40 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-amber-400 font-mono font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Astronaut Challenges
                      </span>
                      <span className="text-[10px] text-orange-400">
                        Risk: {site.astronautChallenges.riskLevel}
                      </span>
                    </div>
                    <p className="text-slate-300 line-clamp-2">
                      {site.astronautChallenges.environmental[0]}
                    </p>
                  </div>

                  {/* Specialist Note Section */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-cyan-400" />
                        Reconnaissance Note:
                      </span>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingNoteId(site.id);
                            setTempNote(currentNote);
                          }}
                          className="text-[11px] text-cyan-400 hover:underline"
                        >
                          {currentNote ? 'Edit note' : '+ Add note'}
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-1.5">
                        <textarea
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          placeholder="Record test objectives or mission notes..."
                          className="w-full bg-slate-950 border border-cyan-500/50 rounded-lg p-2 text-xs text-white focus:outline-none resize-none h-16"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              saveSiteNote(site.id, tempNote);
                              setEditingNoteId(null);
                            }}
                            className="px-3 py-1 bg-cyan-500 text-black text-xs font-mono font-bold rounded"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 italic">
                        {currentNote || 'No mission notes recorded yet.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {site.distanceKm.toLocaleString()} km from base
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onInspectSite(site)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-700 text-cyan-300 text-xs font-mono flex items-center space-x-1 transition"
                    >
                      <Radar className="w-3.5 h-3.5" />
                      <span>Radar</span>
                    </button>
                    <button
                      onClick={() => onAskGemini(site)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center space-x-1 transition"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
