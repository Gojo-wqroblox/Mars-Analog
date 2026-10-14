export type TargetPlanet = 'Mars' | 'Moon';

export type TerrainType = 'Volcanic' | 'Ice/Polar' | 'Arid Desert' | 'Lava Tubes/Caves';

export type GeologicalEra = 
  | 'Noachian / Archaean Analog' 
  | 'Hesperian / Proterozoic' 
  | 'Amazonian / Recent Volcanic' 
  | 'Impact Cataclysm / Lunar Basin Era' 
  | 'Quaternary Periglacial';

export type WaterIcePresence = 
  | 'Subsurface Permafrost Ice' 
  | 'Glacial Mass & Cryo-Brine' 
  | 'Hyper-Arid (Zero Water)' 
  | 'Seasonal Frost / Hydrated Minerals';

export type Mineralogy = 
  | 'Perchlorates & Ferric Iron' 
  | 'Basalt & Pyroxene' 
  | 'Anorthosite & Feldspar' 
  | 'Sulfate Salts & Jarosite' 
  | 'Olivine & Smectite Clays' 
  | 'Titanium Ilmenite';

export interface EnvironmentalTraits {
  soilComposition: number;    // 0-100 similarity score to target
  temperatureRange: number;   // 0-100 severity/match
  atmosphericPressure: number;// 0-100 analog factor (low pressure/vacuum behavior)
  radiationExposure: number;  // 0-100 UV / cosmic proxy
  geologicalTexture: number;  // 0-100 surface roughness & regolith grain
  volatilesPresence: number;  // 0-100 presence of ice/subsurface brines
}

export interface EarthAnalogSite {
  id: string;
  name: string;
  location: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  primaryTarget: TargetPlanet;
  matchRating: number; // Percentage, e.g. 94.2
  baseMatchRating: number;
  terrainTypes: TerrainType[];
  matchingTraits: string[];
  geologicalEra: GeologicalEra;
  waterIcePresence: WaterIcePresence;
  specificMineralogy: Mineralogy[];
  distanceKm: number; // Distance from reference (e.g. NASA Johnson Space Center)
  description: string;
  nasaMissionsTested: string[];
  astronautChallenges: {
    environmental: string[];
    evaHazards: string[];
    riskLevel: 'Nominal' | 'Moderate' | 'High' | 'Extreme';
  };
  traits: EnvironmentalTraits;
  lastTelemetrySync: string;
}

export interface UserProfile {
  id: string;
  callsign: string;
  email: string;
  role: 'Mission Specialist' | 'Planetary Geologist' | 'Commander' | 'EVA Flight Engineer';
  organization: string;
  badgeNumber: string;
  avatarSeed: string;
  favorites: string[]; // Site IDs
  notes?: Record<string, string>; // Site ID -> user notes
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  siteReference?: string;
  challenges?: {
    hazard: string;
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    mitigation: string;
  }[];
  suitabilityScore?: number;
}
