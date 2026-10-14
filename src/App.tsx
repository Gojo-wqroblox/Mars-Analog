import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { EarthAnalogSite, TargetPlanet } from './types';
import { INITIAL_ANALOG_SITES } from './data/analogSites';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { PlanetSelector } from './components/PlanetSelector';
import { FilterBar, FilterState } from './components/FilterBar';
import { AnalogTable } from './components/AnalogTable';
import { SiteTelemetryModal } from './components/SiteTelemetryModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { FavoritesView } from './components/FavoritesView';
import { AuthModal } from './components/AuthModal';
import {
  Sparkles,
  Bot,
  Radar,
  ShieldCheck,
  Compass,
  AlertCircle,
  Layers,
} from 'lucide-react';

const REFRESH_INTERVAL_SECONDS = 30;

function MainDashboard() {
  const { isAuthModalOpen, closeAuthModal, user } = useAuth();

  // Primary State
  const [selectedPlanet, setSelectedPlanet] = useState<TargetPlanet>('Mars');
  const [activeView, setActiveView] = useState<'explorer' | 'favorites'>('explorer');

  // Sites state with real-time dynamic simulation
  const [sites, setSites] = useState<EarthAnalogSite[]>(INITIAL_ANALOG_SITES);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState<number>(REFRESH_INTERVAL_SECONDS);
  const [isSimulatingUpdate, setIsSimulatingUpdate] = useState<boolean>(false);

  // Modals state
  const [inspectingSite, setInspectingSite] = useState<EarthAnalogSite | null>(null);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState<boolean>(false);
  const [geminiSiteContext, setGeminiSiteContext] = useState<EarthAnalogSite | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedTerrains: [],
    geologicalEra: 'ALL',
    waterIce: 'ALL',
    mineralogy: 'ALL',
    sortBy: 'matchRating',
    sortOrder: 'desc',
  });

  // Real-time telemetry 30s updater
  const triggerTelemetryUpdate = useCallback(() => {
    setIsSimulatingUpdate(true);
    setSites((prevSites) =>
      prevSites.map((site) => {
        // Minor natural variance ±0.4% to ±1.4%
        const delta = (Math.random() * 2.2 - 1.1);
        const newRating = Math.min(
          99.4,
          Math.max(82.0, Number((site.baseMatchRating + delta).toFixed(1)))
        );

        // Slightly recalibrate one of the internal traits
        const traitKeys = ['temperatureRange', 'radiationExposure', 'atmosphericPressure'] as const;
        const randomKey = traitKeys[Math.floor(Math.random() * traitKeys.length)];
        const traitDelta = Math.floor(Math.random() * 5 - 2);
        const newTraitVal = Math.min(100, Math.max(50, site.traits[randomKey] + traitDelta));

        return {
          ...site,
          matchRating: newRating,
          traits: {
            ...site.traits,
            [randomKey]: newTraitVal,
          },
          lastTelemetrySync: 'Just now',
        };
      })
    );

    setTimeout(() => {
      setIsSimulatingUpdate(false);
      setSecondsUntilRefresh(REFRESH_INTERVAL_SECONDS);
    }, 1200);
  }, []);

  // 30s interval clock
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          triggerTelemetryUpdate();
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [triggerTelemetryUpdate]);

  // Filtered and Sorted Sites
  const filteredSites = useMemo(() => {
    return sites
      .filter((site) => {
        // Filter by planet
        if (site.primaryTarget !== selectedPlanet) return false;

        // Search Query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesName = site.name.toLowerCase().includes(q);
          const matchesCountry = site.country.toLowerCase().includes(q);
          const matchesLocation = site.location.toLowerCase().includes(q);
          const matchesTraits = site.matchingTraits.some((t) => t.toLowerCase().includes(q));
          if (!matchesName && !matchesCountry && !matchesLocation && !matchesTraits) {
            return false;
          }
        }

        // Terrain switches
        if (filters.selectedTerrains.length > 0) {
          const hasMatchedTerrain = filters.selectedTerrains.some((terrain) =>
            site.terrainTypes.includes(terrain)
          );
          if (!hasMatchedTerrain) return false;
        }

        // Geological Era
        if (filters.geologicalEra !== 'ALL' && site.geologicalEra !== filters.geologicalEra) {
          return false;
        }

        // Water Ice
        if (filters.waterIce !== 'ALL' && site.waterIcePresence !== filters.waterIce) {
          return false;
        }

        // Specific Mineralogy
        if (filters.mineralogy !== 'ALL' && !site.specificMineralogy.includes(filters.mineralogy)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (filters.sortBy === 'matchRating') {
          comparison = b.matchRating - a.matchRating;
        } else if (filters.sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (filters.sortBy === 'distance') {
          comparison = a.distanceKm - b.distanceKm;
        }
        return filters.sortOrder === 'desc' ? comparison : -comparison;
      });
  }, [sites, selectedPlanet, filters]);

  const totalCurrentPlanetSites = useMemo(() => {
    return sites.filter((s) => s.primaryTarget === selectedPlanet).length;
  }, [sites, selectedPlanet]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedTerrains: [],
      geologicalEra: 'ALL',
      waterIce: 'ALL',
      mineralogy: 'ALL',
      sortBy: 'matchRating',
      sortOrder: 'desc',
    });
  };

  const handleAskGemini = (site: EarthAnalogSite) => {
    setGeminiSiteContext(site);
    setIsGeminiChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        targetPlanet={selectedPlanet}
        onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {activeView === 'explorer' ? (
          <>
            {/* Mission Hero Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950 pb-5">
              <div>
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>NASA SPACE APPS CHALLENGE • TERRESTRIAL ANALOG SYSTEM</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Orbitron'] tracking-tight text-white">
                  Interplanetary Surface Reconnaissance
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
                  Identify Earth environments that simulate {selectedPlanet} geology, regolith mineralogy, and atmospheric stressors for astronaut crew training and rover validation.
                </p>
              </div>

              {/* Status HUD pill */}
              <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-xs font-mono self-start sm:self-center">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-500 uppercase">Operator ID</span>
                  <span className="text-cyan-300 font-bold">{user?.callsign || 'GUEST-CREW'}</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-500 uppercase">Clearance</span>
                  <span className="text-emerald-400 font-bold">LEVEL-4 ANALOG</span>
                </div>
              </div>
            </div>

            {/* Section 1: Planet Selector & Environmental Overview */}
            <section aria-label="Planet Selector">
              <PlanetSelector
                selectedPlanet={selectedPlanet}
                onSelectPlanet={(planet) => setSelectedPlanet(planet)}
                secondsUntilRefresh={secondsUntilRefresh}
                onManualRefresh={triggerTelemetryUpdate}
                isRefreshing={isSimulatingUpdate}
              />
            </section>

            {/* Section 2: Filter Switches & Advanced Controls */}
            <section aria-label="Terrain and Geological Filters">
              <FilterBar
                filters={filters}
                onChangeFilters={setFilters}
                onResetFilters={handleResetFilters}
                totalSitesCount={totalCurrentPlanetSites}
                filteredSitesCount={filteredSites.length}
              />
            </section>

            {/* Section 3: Earth Analog Explorer Table */}
            <section aria-label="Earth Analog Explorer Table">
              <AnalogTable
                sites={filteredSites}
                targetPlanet={selectedPlanet}
                onInspectSite={(site) => setInspectingSite(site)}
                onAskGemini={handleAskGemini}
                isSimulatingUpdate={isSimulatingUpdate}
              />
            </section>
          </>
        ) : (
          /* Favorites View */
          <FavoritesView
            allSites={sites}
            targetPlanet={selectedPlanet}
            onInspectSite={(site) => setInspectingSite(site)}
            onAskGemini={handleAskGemini}
            onBackToExplorer={() => setActiveView('explorer')}
          />
        )}
      </main>

      {/* Floating Gemini AI Launcher Button (if closed) */}
      {!isGeminiChatOpen && (
        <button
          onClick={() => setIsGeminiChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Bot className="w-5 h-5 text-black animate-pulse" />
          <span>Gemini Surface Analytics</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      )}

      {/* Gemini Surface Analytics Chatbot Assistant */}
      <GeminiChatbot
        isOpen={isGeminiChatOpen}
        onClose={() => setIsGeminiChatOpen(false)}
        targetPlanet={selectedPlanet}
        activeSiteContext={geminiSiteContext}
        onClearSiteContext={() => setGeminiSiteContext(null)}
        allSites={sites.filter((s) => s.primaryTarget === selectedPlanet)}
      />

      {/* Detailed Site Telemetry & Chart.js Radar Modal */}
      <SiteTelemetryModal
        site={inspectingSite}
        targetPlanet={selectedPlanet}
        onClose={() => setInspectingSite(null)}
        onAskGemini={handleAskGemini}
      />

      {/* Astronaut Portal & Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />

      {/* Footer */}
      <footer className="border-t border-cyan-950/60 bg-[#04060d] py-6 px-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>NULLG: Interplanetary Site Scout • NASA Space Apps Planetary Reconnaissance</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Mars 2020 & Artemis Telemetry Compliant</span>
            <span>•</span>
            <span className="text-cyan-400">Gemini 3.8 Flash AI Model</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainDashboard />
    </AuthProvider>
  );
}
