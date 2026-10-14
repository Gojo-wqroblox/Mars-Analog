import { EarthAnalogSite, EnvironmentalTraits, TargetPlanet } from '../types';

export const TARGET_PLANET_PROFILES: Record<TargetPlanet, {
  name: string;
  code: string;
  symbol: string;
  gravity: string;
  surfaceTemp: string;
  atmosphere: string;
  radiationLevel: string;
  activePrograms: string[];
  averageTraits: EnvironmentalTraits;
  description: string;
  heroColor: string;
}> = {
  Mars: {
    name: 'Mars',
    code: 'RED-PLANET-SOL-4',
    symbol: '♂',
    gravity: '0.38g (3.72 m/s²)',
    surfaceTemp: '-140°C to +20°C (Avg -63°C)',
    atmosphere: '0.6% Earth (95% CO₂)',
    radiationLevel: 'High GCR & Solar Proton Events (250 mSv/yr)',
    activePrograms: ['NASA Mars 2020 (Perseverance)', 'ESA ExoMars', 'NASA Artemis-to-Mars Pathway', 'Ingenuity Fleet Follow-on'],
    averageTraits: {
      soilComposition: 88,
      temperatureRange: 82,
      atmosphericPressure: 95,
      radiationExposure: 86,
      geologicalTexture: 89,
      volatilesPresence: 55,
    },
    description: 'Arid desert world dominated by basaltic lava fields, ferric rust oxides, perchlorate salts, and ancient lacustrine delta deposits.',
    heroColor: '#f97316',
  },
  Moon: {
    name: 'Moon (Luna)',
    code: 'SELENA-LUNAR-BASE',
    symbol: '☾',
    gravity: '0.166g (1.62 m/s²)',
    surfaceTemp: '-246°C (PSR) to +121°C',
    atmosphere: 'Ultra-High Vacuum (Exosphere < 10⁻¹² bar)',
    radiationLevel: 'Extreme Unshielded Cosmic Radiation (380 mSv/yr)',
    activePrograms: ['NASA Artemis III-V', 'Lunar Gateway', 'ESA PANGAEA Astronaut Training', 'CLPS Commercial Landers'],
    averageTraits: {
      soilComposition: 92,
      temperatureRange: 96,
      atmosphericPressure: 99,
      radiationExposure: 94,
      geologicalTexture: 95,
      volatilesPresence: 35,
    },
    description: 'Airless, cratered world composed of anorthositic highlands and basaltic maria, riddled with impact melt sheets and lava tubes.',
    heroColor: '#38bdf8',
  },
};

export const INITIAL_ANALOG_SITES: EarthAnalogSite[] = [
  // --- MARS ANALOGS ---
  {
    id: 'atacama-desert',
    name: 'Atacama Desert (Yungay Core)',
    location: 'Antofagasta Region',
    country: 'Chile',
    coordinates: { lat: -24.088, lng: -69.967 },
    primaryTarget: 'Mars',
    matchRating: 94.8,
    baseMatchRating: 94.8,
    terrainTypes: ['Arid Desert'],
    matchingTraits: ['Hyper-Aridity', 'Perchlorate Soil', 'Extreme Solar UV', 'Ferric Oxides', 'Zero Organic Carbon'],
    geologicalEra: 'Hesperian / Proterozoic',
    waterIcePresence: 'Hyper-Arid (Zero Water)',
    specificMineralogy: ['Perchlorates & Ferric Iron', 'Sulfate Salts & Jarosite'],
    distanceKm: 6840,
    description: 'The driest non-polar desert on Earth. The Yungay basin has received almost no precipitation for millenia, creating soil hyper-oxidized by perchlorates that directly mimics Mars Viking and Curiosity landing sites.',
    nasaMissionsTested: ['NASA ASTEP Atacama Rover Astrobiology', 'Viking Labeled Release Calibration', 'Perseverance Drill Dry-Run'],
    astronautChallenges: {
      environmental: [
        'Dangerous acute solar UV index (>15) causing ocular damage and rapid suit polymer breakdown',
        'Intense diurnal thermal swings from +38°C to -10°C within hours',
        'Extreme pulmonary dehydration risk during prolonged EVA tests'
      ],
      evaHazards: [
        'Corrosive airborne salt aerosol and alkaline dust infiltration into seal joints',
        'Sharp gypsum crust collapse hazards underneath heavy EVA rover tires'
      ],
      riskLevel: 'High'
    },
    traits: {
      soilComposition: 96,
      temperatureRange: 78,
      atmosphericPressure: 82,
      radiationExposure: 94,
      geologicalTexture: 91,
      volatilesPresence: 12,
    },
    lastTelemetrySync: '12s ago',
  },
  {
    id: 'mcmurdo-dry-valleys',
    name: 'McMurdo Dry Valleys (University Valley)',
    location: 'Victoria Land',
    country: 'Antarctica',
    coordinates: { lat: -77.516, lng: 161.766 },
    primaryTarget: 'Mars',
    matchRating: 96.2,
    baseMatchRating: 96.2,
    terrainTypes: ['Ice/Polar', 'Arid Desert'],
    matchingTraits: ['Freezing Soil', 'Subsurface Cryo-Permafrost', 'Katabatic Gale Winds', 'Endolithic Crypto-Habitats', 'Subzero Hypersaline Brines'],
    geologicalEra: 'Amazonian / Recent Volcanic',
    waterIcePresence: 'Subsurface Permafrost Ice',
    specificMineralogy: ['Sulfate Salts & Jarosite', 'Basalt & Pyroxene'],
    distanceKm: 13420,
    description: 'Hyper-arid, ice-free polar desert kept dry by 300 km/h katabatic winds descending from the Polar Plateau. Subsurface permafrost mirrors the Martian northern plains Phoenix lander site.',
    nasaMissionsTested: ['NASA IceBite Cryogenic Drill Tests', 'Phoenix Lander Robotic Arm Prototyping', 'Life Detection at the Limit of Dryness'],
    astronautChallenges: {
      environmental: [
        'Extreme cold stress down to -50°C inducing battery thermal failure and lubricant freezing',
        'Severe desiccation and sub-polar UV reflection off surrounding glaciers',
        'Katabatic hurricane-force wind gusts stripping communications antennas'
      ],
      evaHazards: [
        'Hidden cryo-crevasses and hard permafrost fracturing during drilling tests',
        'Bio-containment quarantine protocols for delicate crypto-endolithic micro-organisms'
      ],
      riskLevel: 'Extreme'
    },
    traits: {
      soilComposition: 94,
      temperatureRange: 97,
      atmosphericPressure: 79,
      radiationExposure: 88,
      geologicalTexture: 95,
      volatilesPresence: 82,
    },
    lastTelemetrySync: '18s ago',
  },
  {
    id: 'death-valley',
    name: 'Death Valley & Badwater Basin',
    location: 'California',
    country: 'USA',
    coordinates: { lat: 36.532, lng: -116.932 },
    primaryTarget: 'Mars',
    matchRating: 89.4,
    baseMatchRating: 89.4,
    terrainTypes: ['Arid Desert'],
    matchingTraits: ['Evaporite Playas', 'Borate Deposits', 'Alluvial Fan Geomorphology', 'Hyper-Salinity'],
    geologicalEra: 'Hesperian / Proterozoic',
    waterIcePresence: 'Hyper-Arid (Zero Water)',
    specificMineralogy: ['Sulfate Salts & Jarosite', 'Perchlorates & Ferric Iron'],
    distanceKm: 2150,
    description: 'A sunken graben basin below sea level with expansive salt flats, clay mounds, and alluvial fans identical to Martian paleolake outflow channels seen in Gale Crater.',
    nasaMissionsTested: ['Curiosity Rover Wheel Tread Durability', 'NASA Mars Yard Field Calibrations', 'Remote Spectroscopy Benchmarking'],
    astronautChallenges: {
      environmental: [
        'Lethal heat index reaching 54°C causing thermal runaway in suit active liquid cooling garments',
        'Mirage and radiant ground heat disrupting LiDAR and optical navigation sensors'
      ],
      evaHazards: [
        'Razor-sharp sodium chloride halite pinnacles (Devil’s Golf Course) puncturing rover treads',
        'Unstable salt crusts collapsing into subterranean brine mud'
      ],
      riskLevel: 'Moderate'
    },
    traits: {
      soilComposition: 88,
      temperatureRange: 91,
      atmosphericPressure: 65,
      radiationExposure: 85,
      geologicalTexture: 87,
      volatilesPresence: 18,
    },
    lastTelemetrySync: '24s ago',
  },
  {
    id: 'hi-seas-mauna-loa',
    name: 'Mauna Loa & Haleakala (HI-SEAS)',
    location: 'Hawaii',
    country: 'USA',
    coordinates: { lat: 19.536, lng: -155.576 },
    primaryTarget: 'Mars',
    matchRating: 91.5,
    baseMatchRating: 91.5,
    terrainTypes: ['Volcanic', 'Lava Tubes/Caves'],
    matchingTraits: ['Basaltic Tephra', 'Weathered Palagonite', 'High Altitude Isolation', 'Subterranean Lava Conduits'],
    geologicalEra: 'Amazonian / Recent Volcanic',
    waterIcePresence: 'Seasonal Frost / Hydrated Minerals',
    specificMineralogy: ['Basalt & Pyroxene', 'Olivine & Smectite Clays'],
    distanceKm: 6120,
    description: 'High-altitude volcanic shield at 2,500m elevation. Weathered basaltic tephra (palagonite) matches the iron oxidation spectrum of Martian dust, hosting the HI-SEAS long-duration isolation habitat.',
    nasaMissionsTested: ['HI-SEAS Mars Isolation Missions I-VI', 'NASA PSTAR BASALT Field Science Optimization', 'Robotic Rover Remote Operations'],
    astronautChallenges: {
      environmental: [
        'Thin mountain atmosphere and high UV requiring strict simulated life-support monitoring',
        'Dense volcanic fog (VOG) carrying corrosive sulfur dioxide fumes'
      ],
      evaHazards: [
        'A\'a lava fields composed of sharp, loose clinkers causing ankle rollovers and suit tears',
        'Thin roof collapses over uncharted subterranean lava tube networks'
      ],
      riskLevel: 'High'
    },
    traits: {
      soilComposition: 93,
      temperatureRange: 82,
      atmosphericPressure: 74,
      radiationExposure: 89,
      geologicalTexture: 96,
      volatilesPresence: 44,
    },
    lastTelemetrySync: '5s ago',
  },
  {
    id: 'rio-tinto',
    name: 'Río Tinto Mining Basin',
    location: 'Andalusia',
    country: 'Spain',
    coordinates: { lat: 37.696, lng: -6.564 },
    primaryTarget: 'Mars',
    matchRating: 88.2,
    baseMatchRating: 88.2,
    terrainTypes: ['Arid Desert'],
    matchingTraits: ['Acidic Iron-Sulfate Waters', 'Jarosite Mineral Beds', 'Chemolithoautotrophic Life', 'Ferric Gossan Caps'],
    geologicalEra: 'Hesperian / Proterozoic',
    waterIcePresence: 'Seasonal Frost / Hydrated Minerals',
    specificMineralogy: ['Sulfate Salts & Jarosite', 'Perchlorates & Ferric Iron'],
    distanceKm: 7600,
    description: 'Hyper-acidic (pH ~2) river rich in dissolved heavy metals and jarosite precipitate, directly mirroring the geochemical formation conditions discovered by Opportunity rover at Meridiani Planum.',
    nasaMissionsTested: ['NASA MARTE Subsurface Drilling Mission', 'ExoMars MOMA Spectrometer Field Tests', 'Acidophilic Extremophile Bio-signature Profiling'],
    astronautChallenges: {
      environmental: [
        'Toxic sulfuric acid and heavy metal splashes requiring chemical-resistant exterior suit coats',
        'Vaporous sulfur compounds reducing visibility and corroding sensitive camera lenses'
      ],
      evaHazards: [
        'Slippery iron hydroxide mud banks causing loss of rover traction',
        'Pit mine shear face rockfall and unstable gossan ledges'
      ],
      riskLevel: 'Moderate'
    },
    traits: {
      soilComposition: 95,
      temperatureRange: 68,
      atmosphericPressure: 60,
      radiationExposure: 78,
      geologicalTexture: 84,
      volatilesPresence: 62,
    },
    lastTelemetrySync: '30s ago',
  },
  {
    id: 'lake-salda',
    name: 'Lake Salda Microbialites',
    location: 'Burdur Province',
    country: 'Turkey',
    coordinates: { lat: 37.552, lng: 29.704 },
    primaryTarget: 'Mars',
    matchRating: 92.1,
    baseMatchRating: 92.1,
    terrainTypes: ['Arid Desert'],
    matchingTraits: ['Hydromagnesite Carbonates', 'Microbial Biosignatures', 'Deep Deltaic Sediments', 'Serpentine Catchment'],
    geologicalEra: 'Noachian / Archaean Analog',
    waterIcePresence: 'Seasonal Frost / Hydrated Minerals',
    specificMineralogy: ['Olivine & Smectite Clays', 'Sulfate Salts & Jarosite'],
    distanceKm: 10400,
    description: 'The premier Earth analog for Jezero Crater on Mars. Features white hydromagnesite sediment shoals and ancient microbial structures formed in a closed alkaline lake catchment.',
    nasaMissionsTested: ['NASA Perseverance Science Team Field Study', 'Delta Sediment Core Sampling Validation', 'Orbital CRISM Spectral Match Comparison'],
    astronautChallenges: {
      environmental: [
        'Highly alkaline water and sediment (pH 9-10) degrading boot seals and polymer gaskets',
        'Rapid sediment liquefaction under heavy equipment loads near delta margins'
      ],
      evaHazards: [
        'Submerged karst sinkholes and deceptive quick-mud sediment deposits',
        'Strict biological non-contamination boundaries preserving pristine analog sites'
      ],
      riskLevel: 'Moderate'
    },
    traits: {
      soilComposition: 96,
      temperatureRange: 75,
      atmosphericPressure: 62,
      radiationExposure: 81,
      geologicalTexture: 89,
      volatilesPresence: 74,
    },
    lastTelemetrySync: '9s ago',
  },

  // --- MOON ANALOGS ---
  {
    id: 'haughton-crater',
    name: 'Haughton Impact Crater (Devon Island)',
    location: 'Nunavut Territory',
    country: 'Canada',
    coordinates: { lat: 75.383, lng: -89.683 },
    primaryTarget: 'Moon',
    matchRating: 96.5,
    baseMatchRating: 96.5,
    terrainTypes: ['Ice/Polar', 'Volcanic'],
    matchingTraits: ['Impact Melt Breccia', 'Shatter Cones', 'Barren Hydrothermal Regolith', 'Pristine Impact Morphology'],
    geologicalEra: 'Impact Cataclysm / Lunar Basin Era',
    waterIcePresence: 'Subsurface Permafrost Ice',
    specificMineralogy: ['Anorthosite & Feldspar', 'Basalt & Pyroxene'],
    distanceKm: 5400,
    description: 'A 23km diameter impact crater formed 39 million years ago in the High Arctic. Devoid of vegetation, this polar desert features hydrothermal impact breccia and shatter cones mirroring lunar highland impact basins.',
    nasaMissionsTested: ['NASA Haughton-Mars Project (HMP)', 'Artemis Surface EVA Traverses', 'Lunar Humvee & Rover Teleoperation'],
    astronautChallenges: {
      environmental: [
        'Sub-zero polar maritime conditions with sudden whiteout blizzards disorienting EVA crews',
        'Permanent GPS degradation and erratic magnetic field deviations near the magnetic North Pole'
      ],
      evaHazards: [
        'Abrasive impact breccia dust that rapidly abrades suit joints and visor anti-reflective coatings',
        'Deep permafrost polygon troughs and loose scree slopes on crater ring rims'
      ],
      riskLevel: 'High'
    },
    traits: {
      soilComposition: 97,
      temperatureRange: 94,
      atmosphericPressure: 88,
      radiationExposure: 91,
      geologicalTexture: 98,
      volatilesPresence: 52,
    },
    lastTelemetrySync: '14s ago',
  },
  {
    id: 'lanzarote-volcanic-fields',
    name: 'Lanzarote Volcanic Fields & Cueva de los Verdes',
    location: 'Canary Islands',
    country: 'Spain',
    coordinates: { lat: 29.046, lng: -13.633 },
    primaryTarget: 'Moon',
    matchRating: 93.4,
    baseMatchRating: 93.4,
    terrainTypes: ['Volcanic', 'Lava Tubes/Caves'],
    matchingTraits: ['Pristine Basalt Pavements', 'Subterranean Lava Tubes', 'Ophitic Pyroxene Textures', 'Unweathered Volcanic Glasses'],
    geologicalEra: 'Amazonian / Recent Volcanic',
    waterIcePresence: 'Hyper-Arid (Zero Water)',
    specificMineralogy: ['Basalt & Pyroxene', 'Titanium Ilmenite', 'Olivine & Smectite Clays'],
    distanceKm: 7850,
    description: 'Home to the European Space Agency PANGAEA astronaut training academy. The Timanfaya basalt flows and Cueva de los Verdes lava tubes directly simulate lunar maria and subterranean lava tube habitats.',
    nasaMissionsTested: ['ESA PANGAEA Lunar Astronaut Field Geology', 'Caves Underground Drone Mapping Protocol', 'Artemis Subsurface Shelter Assessment'],
    astronautChallenges: {
      environmental: [
        'Complete radio shadow and zero daylight inside massive subterranean basaltic lava tubes',
        'Acoustic reverberation and total darkness requiring advanced LiDAR beacon arrays'
      ],
      evaHazards: [
        'Overhead basalt roof breakdown and spalling from seismic micro-tremors',
        'Glassy volcanic obsidian and scoria cutting through pressurized glove fingertips'
      ],
      riskLevel: 'High'
    },
    traits: {
      soilComposition: 95,
      temperatureRange: 80,
      atmosphericPressure: 68,
      radiationExposure: 84,
      geologicalTexture: 97,
      volatilesPresence: 20,
    },
    lastTelemetrySync: '7s ago',
  },
  {
    id: 'craters-of-the-moon',
    name: 'Craters of the Moon National Monument',
    location: 'Idaho',
    country: 'USA',
    coordinates: { lat: 43.461, lng: -113.562 },
    primaryTarget: 'Moon',
    matchRating: 91.2,
    baseMatchRating: 91.2,
    terrainTypes: ['Volcanic', 'Lava Tubes/Caves'],
    matchingTraits: ['Apollo Training Ground', 'Pahoehoe Lava Crusts', 'Cinder Cones', 'Rift Eruption Cracks'],
    geologicalEra: 'Amazonian / Recent Volcanic',
    waterIcePresence: 'Seasonal Frost / Hydrated Minerals',
    specificMineralogy: ['Basalt & Pyroxene', 'Anorthosite & Feldspar'],
    distanceKm: 2480,
    description: 'Trained Apollo 14 astronauts Alan Shepard and Edgar Mitchell. Expansive flood basalt rift zone containing lava tubes, spatter cones, and cinder fields mirroring lunar mare basalt volcanism.',
    nasaMissionsTested: ['Apollo 14 Astronaut Pre-Flight Geological Training', 'NASA FINESSE Volcanic Robotics', 'Lunar Rover Traction Trials'],
    astronautChallenges: {
      environmental: [
        'High desert temperature extremes varying from blazing radiant summer heat to snow-buried basalt',
        'High elevation (1,800m) with lower atmospheric oxygen during high-exertion EVA traverses'
      ],
      evaHazards: [
        'Hollow lava blisters that punch through under astronaut footfalls',
        'Subterranean ice-pit caves with vertical pit entrances requiring technical rope rappelling'
      ],
      riskLevel: 'Moderate'
    },
    traits: {
      soilComposition: 92,
      temperatureRange: 86,
      atmosphericPressure: 72,
      radiationExposure: 83,
      geologicalTexture: 94,
      volatilesPresence: 35,
    },
    lastTelemetrySync: '22s ago',
  },
  {
    id: 'askja-caldera',
    name: 'Askja Caldera & Highlands of Iceland',
    location: 'Nordurland Eystra',
    country: 'Iceland',
    coordinates: { lat: 65.033, lng: -16.75 },
    primaryTarget: 'Moon',
    matchRating: 94.7,
    baseMatchRating: 94.7,
    terrainTypes: ['Volcanic', 'Ice/Polar'],
    matchingTraits: ['Anorthositic Plagioclase', 'Rhyolite & Basalt Mix', 'Highland Regolith Grain Match', 'Pumice Fields'],
    geologicalEra: 'Impact Cataclysm / Lunar Basin Era',
    waterIcePresence: 'Subsurface Permafrost Ice',
    specificMineralogy: ['Anorthosite & Feldspar', 'Basalt & Pyroxene', 'Titanium Ilmenite'],
    distanceKm: 6300,
    description: 'Training site for Neil Armstrong, Buzz Aldrin, and 30 other Apollo astronauts. The bleak pumice desert of Dyngjufjöll and Askja Caldera provided Apollo crews the exact visual and textural scale of the lunar regolith.',
    nasaMissionsTested: ['Apollo 11 & 12 Astronaut Field Training', 'NASA CLPS Lander Plume Regolith Dispersion Tests', 'Autonomous Robotic Sample Caching'],
    astronautChallenges: {
      environmental: [
        'Persistent hypothermic winds, freezing sleet, and geothermal hot springs emitting corrosive fumes',
        'Dense airborne fine tephra dust with high electrostatic stickiness mimicking lunar dust adhesion'
      ],
      evaHazards: [
        'Unconsolidated pumice scree causing rovers to dig into self-trapping sand traps',
        'Sub-glacial volcanic cavities that risk catastrophic sudden collapse'
      ],
      riskLevel: 'High'
    },
    traits: {
      soilComposition: 98,
      temperatureRange: 91,
      atmosphericPressure: 80,
      radiationExposure: 88,
      geologicalTexture: 96,
      volatilesPresence: 58,
    },
    lastTelemetrySync: '3s ago',
  },
  {
    id: 'undara-lava-tubes',
    name: 'Undara Lava Tube Complex',
    location: 'Queensland',
    country: 'Australia',
    coordinates: { lat: -18.204, lng: 144.571 },
    primaryTarget: 'Moon',
    matchRating: 90.6,
    baseMatchRating: 90.6,
    terrainTypes: ['Lava Tubes/Caves', 'Volcanic'],
    matchingTraits: ['Longest Single Lava Tube Flow (160km)', 'Marius Hills Lunar Skylight Analog', 'Thermal Stability Shielding'],
    geologicalEra: 'Amazonian / Recent Volcanic',
    waterIcePresence: 'Hyper-Arid (Zero Water)',
    specificMineralogy: ['Basalt & Pyroxene', 'Titanium Ilmenite'],
    distanceKm: 14100,
    description: 'One of the longest known volcanic lava tube systems on Earth, running over 160 kilometers. Serves as a direct terrestrial analogue for massive lunar sinuous rilles and collapsed skylights in Marius Hills.',
    nasaMissionsTested: ['Lunar Underground Base Architectural Feasibility', 'Speleological Autonomous Drone Lidar Mapping', 'Subterranean Radiation Shielding Testing'],
    astronautChallenges: {
      environmental: [
        'High underground humidity and elevated carbon dioxide pockets in non-ventilated blind tunnels',
        'Deep thermal isolation shielding but complete loss of solar auxiliary power'
      ],
      evaHazards: [
        'Massive boulder breakdown fields requiring quad-legged robotic or heavy exo-suit climbing',
        'Complex subterranean labyrinths causing high risk of lost-crew events without physical tether lines'
      ],
      riskLevel: 'Moderate'
    },
    traits: {
      soilComposition: 91,
      temperatureRange: 72,
      atmosphericPressure: 61,
      radiationExposure: 79,
      geologicalTexture: 92,
      volatilesPresence: 25,
    },
    lastTelemetrySync: '17s ago',
  },
  {
    id: 'sudbury-basin',
    name: 'Sudbury Impact Basin Shatter Cones',
    location: 'Ontario',
    country: 'Canada',
    coordinates: { lat: 46.602, lng: -81.189 },
    primaryTarget: 'Moon',
    matchRating: 88.9,
    baseMatchRating: 88.9,
    terrainTypes: ['Volcanic'],
    matchingTraits: ['Shock Metamorphism', 'Shatter Cones', 'Impact Melt Differentiated Sheet', 'High-Pressure Planar Deformation'],
    geologicalEra: 'Impact Cataclysm / Lunar Basin Era',
    waterIcePresence: 'Seasonal Frost / Hydrated Minerals',
    specificMineralogy: ['Anorthosite & Feldspar', 'Olivine & Smectite Clays'],
    distanceKm: 2200,
    description: 'One of the oldest and largest preserved impact craters on Earth (1.85 billion years old). Displays world-renowned shock metamorphism features, shatter cones, and an impact melt sheet similar to the South Pole-Aitken basin.',
    nasaMissionsTested: ['Apollo Astronaut Geological Sample Collection Training', 'Lunar Impact Melt Stratigraphy Analysis', 'Seismic Sensor Deployment Simulations'],
    astronautChallenges: {
      environmental: [
        'Dense boreal brush obscuring geological exposures (cleared in specialized quarry training zones)',
        'Wet freeze-thaw cycles inducing slick rock surfaces on ancient impact melt pavements'
      ],
      evaHazards: [
        'Steep quarry headwalls and sharp crystalline shatter cone fracture surfaces',
        'Heavy mineral magnetic anomalies distorting magnetometers and inertial measurement units'
      ],
      riskLevel: 'Nominal'
    },
    traits: {
      soilComposition: 93,
      temperatureRange: 82,
      atmosphericPressure: 71,
      radiationExposure: 76,
      geologicalTexture: 90,
      volatilesPresence: 49,
    },
    lastTelemetrySync: '28s ago',
  }
];

export const PRESET_ASTRONAUTS = [
  {
    id: 'astro-1',
    callsign: 'ARES-LEAD',
    email: 'j.watkins@artemis.nasa.gov',
    role: 'Planetary Geologist' as const,
    organization: 'NASA Johnson Space Center / Artemis Team',
    badgeNumber: 'NASA-AST-742',
    avatarSeed: 'JessicaWatkins',
    favorites: ['atacama-desert', 'haughton-crater', 'mcmurdo-dry-valleys'],
  },
  {
    id: 'astro-2',
    callsign: 'SELENE-CAPCOM',
    email: 'm.hansen@esa.int',
    role: 'Commander' as const,
    organization: 'ESA Astronaut Corps / PANGAEA Specialist',
    badgeNumber: 'ESA-EXP-088',
    avatarSeed: 'ReidWiseman',
    favorites: ['lanzarote-volcanic-fields', 'askja-caldera'],
  },
  {
    id: 'astro-3',
    callsign: 'ROVER-TECH',
    email: 'k.tani@jaxa.jp',
    role: 'EVA Flight Engineer' as const,
    organization: 'JAXA Human Spaceflight Directorate',
    badgeNumber: 'JAXA-ENG-319',
    avatarSeed: 'KimiyaTani',
    favorites: ['hi-seas-mauna-loa', 'craters-of-the-moon'],
  }
];
