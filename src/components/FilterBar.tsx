import React from 'react';
import { GeologicalEra, Mineralogy, TerrainType, WaterIcePresence } from '../types';
import {
  Filter,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Mountain,
  Snowflake,
  Sun,
  Eye,
  Check,
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  selectedTerrains: TerrainType[];
  geologicalEra: GeologicalEra | 'ALL';
  waterIce: WaterIcePresence | 'ALL';
  mineralogy: Mineralogy | 'ALL';
  sortBy: 'matchRating' | 'name' | 'distance';
  sortOrder: 'asc' | 'desc';
}

interface FilterBarProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalSitesCount: number;
  filteredSitesCount: number;
}

const ALL_TERRAINS: { type: TerrainType; icon: React.ReactNode; color: string }[] = [
  { type: 'Volcanic', icon: <Mountain className="w-3.5 h-3.5" />, color: 'border-orange-500/50 text-orange-400 bg-orange-950/40' },
  { type: 'Ice/Polar', icon: <Snowflake className="w-3.5 h-3.5" />, color: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40' },
  { type: 'Arid Desert', icon: <Sun className="w-3.5 h-3.5" />, color: 'border-amber-500/50 text-amber-400 bg-amber-950/40' },
  { type: 'Lava Tubes/Caves', icon: <Eye className="w-3.5 h-3.5" />, color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40' },
];

const GEOLOGICAL_ERAS: (GeologicalEra | 'ALL')[] = [
  'ALL',
  'Noachian / Archaean Analog',
  'Hesperian / Proterozoic',
  'Amazonian / Recent Volcanic',
  'Impact Cataclysm / Lunar Basin Era',
  'Quaternary Periglacial',
];

const WATER_ICE_OPTIONS: (WaterIcePresence | 'ALL')[] = [
  'ALL',
  'Subsurface Permafrost Ice',
  'Glacial Mass & Cryo-Brine',
  'Hyper-Arid (Zero Water)',
  'Seasonal Frost / Hydrated Minerals',
];

const MINERALOGY_OPTIONS: (Mineralogy | 'ALL')[] = [
  'ALL',
  'Perchlorates & Ferric Iron',
  'Basalt & Pyroxene',
  'Anorthosite & Feldspar',
  'Sulfate Salts & Jarosite',
  'Olivine & Smectite Clays',
  'Titanium Ilmenite',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalSitesCount,
  filteredSitesCount,
}) => {
  const toggleTerrain = (terrain: TerrainType) => {
    const exists = filters.selectedTerrains.includes(terrain);
    const updated = exists
      ? filters.selectedTerrains.filter((t) => t !== terrain)
      : [...filters.selectedTerrains, terrain];
    onChangeFilters({ ...filters, selectedTerrains: updated });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedTerrains.length > 0 ||
    filters.geologicalEra !== 'ALL' ||
    filters.waterIce !== 'ALL' ||
    filters.mineralogy !== 'ALL';

  return (
    <div className="bg-[#080d1c]/90 border border-cyan-950/70 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-4">
      {/* Top Filter Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search Earth analog sites by name, country, or traits..."
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Controls & Counter */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Sort By:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onChangeFilters({ ...filters, sortBy: e.target.value as any })}
              className="bg-transparent text-cyan-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="matchRating" className="bg-slate-900">Match Rating %</option>
              <option value="name" className="bg-slate-900">Site Name</option>
              <option value="distance" className="bg-slate-900">Distance (km)</option>
            </select>
            <button
              onClick={() =>
                onChangeFilters({
                  ...filters,
                  sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc',
                })
              }
              className="px-1 text-slate-400 hover:text-cyan-300 transition"
              title="Toggle sort direction"
            >
              {filters.sortOrder === 'desc' ? '▼' : '▲'}
            </button>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <span className="text-slate-400">Displaying:</span>
            <span className="text-cyan-400 font-bold">{filteredSitesCount}</span>
            <span className="text-slate-500">/ {totalSitesCount}</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Terrain Type Switches */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            Terrain Type Switches:
          </span>
          {filters.selectedTerrains.length > 0 && (
            <span className="text-[11px] font-mono text-cyan-400">
              {filters.selectedTerrains.length} Selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALL_TERRAINS.map(({ type, icon, color }) => {
            const isSelected = filters.selectedTerrains.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleTerrain(type)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono border transition-all ${
                  isSelected
                    ? `${color} ring-1 ring-cyan-400/50 shadow-sm font-semibold`
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {icon}
                  <span>{type}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-black'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters: Geological Era, Water Ice, Mineralogy */}
      <div className="pt-2 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        {/* Geological Era */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Geological Era Analog
          </label>
          <select
            value={filters.geologicalEra}
            onChange={(e) => onChangeFilters({ ...filters, geologicalEra: e.target.value as any })}
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-cyan-200 focus:outline-none truncate"
          >
            {GEOLOGICAL_ERAS.map((era) => (
              <option key={era} value={era} className="bg-slate-900 text-slate-200">
                {era === 'ALL' ? 'All Geological Eras' : era}
              </option>
            ))}
          </select>
        </div>

        {/* Water Ice Presence */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Water Ice Presence
          </label>
          <select
            value={filters.waterIce}
            onChange={(e) => onChangeFilters({ ...filters, waterIce: e.target.value as any })}
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-cyan-200 focus:outline-none truncate"
          >
            {WATER_ICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                {opt === 'ALL' ? 'All Water/Ice Regimes' : opt}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Mineralogy */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Specific Mineralogy
          </label>
          <select
            value={filters.mineralogy}
            onChange={(e) => onChangeFilters({ ...filters, mineralogy: e.target.value as any })}
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-cyan-200 focus:outline-none truncate"
          >
            {MINERALOGY_OPTIONS.map((min) => (
              <option key={min} value={min} className="bg-slate-900 text-slate-200">
                {min === 'ALL' ? 'All Mineral Signatures' : min}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
