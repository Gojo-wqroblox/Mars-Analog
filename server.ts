import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI SDK according to AI Studio guidelines
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI with provided key:', err);
  }
}

// System prompt tailored for NASA Space Apps Planetary Analog Mission Planning
const SYSTEM_INSTRUCTION = `You are "Gemini Surface Analytics", the planetary analog AI mission planner for NULLG: Interplanetary Site Scout (NASA Space Apps).
Your role:
1. When asked about an Earth analog site (e.g. Atacama Desert, Haughton Crater, McMurdo Dry Valleys, Lanzarote Volcanic Fields, Death Valley, HI-SEAS Mauna Loa, Lake Salda, Askja Caldera, etc.), explain in high-fidelity scientific detail WHY it matches the target planet (Mars or Moon).
2. Detail its specific geological, mineralogical, and atmospheric analogies (e.g. perchlorate soils, basaltic lava tubes, impact breccias, cryo-permafrost).
3. SIMULATE POTENTIAL ASTRONAUT CHALLENGES related to its environment (extreme temperatures, hypothermia/hyperthermia, EVA suit abrasion from sharp basalt/tephra shards, solar UV & radiation proxies, communication dropouts in lava tubes, loose fine dust clogging rover joints and airlocks).
4. Recommend mission protocols, equipment mitigations, and analog training objectives.
5. Format your output with clear, structured NASA flight telemetry headers, bullet points, and an explicit "ASTRONAUT HAZARD PROFILE" block. Keep the tone professional, authoritative, and mission-critical.`;

// API endpoint for Gemini Surface Analytics Chat
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { prompt, siteContext, targetPlanet, conversationHistory } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  // Construct mission context
  let contextSnippet = `Target Planet: ${targetPlanet || 'Mars'}\n`;
  if (siteContext) {
    contextSnippet += `Site: ${siteContext.name} (${siteContext.location}, ${siteContext.country})\n`;
    contextSnippet += `Match Rating: ${siteContext.matchRating}%\n`;
    contextSnippet += `Matching Traits: ${siteContext.matchingTraits?.join(', ')}\n`;
    contextSnippet += `Geological Era: ${siteContext.geologicalEra}\n`;
    contextSnippet += `Mineralogy: ${siteContext.specificMineralogy?.join(', ')}\n`;
    contextSnippet += `Water/Ice: ${siteContext.waterIcePresence}\n`;
  }

  const fullPrompt = `[MISSION CONTEXT]\n${contextSnippet}\n\n[USER QUERY]\n${prompt}`;

  // If Gemini API is configured, call it
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';
      return res.json({
        reply: responseText,
        source: 'gemini-3.8-flash',
      });
    } catch (error: any) {
      console.error('Error invoking Gemini 3.8 Flash, activating fallback simulation:', error?.message);
      // Fall through to smart simulation response
    }
  }

  // Smart high-fidelity simulation engine
  const simulatedResponse = generateSmartSimulation(prompt, siteContext, targetPlanet || 'Mars');
  return res.json({
    reply: simulatedResponse,
    source: 'gemini-smart-simulation',
  });
});

// Fallback smart simulation system
function generateSmartSimulation(prompt: string, site: any, targetPlanet: string): string {
  const queryLower = prompt.toLowerCase();
  const siteName = site?.name || (targetPlanet === 'Mars' ? 'Atacama Desert' : 'Haughton Impact Crater');
  const planetName = targetPlanet === 'Moon' ? 'the Moon (Luna)' : 'Mars (Red Planet)';

  // If query is specifically about Atacama
  if (queryLower.includes('atacama') || (site?.id === 'atacama-desert')) {
    return `### [TELEMETRY ANALYSIS: ATACAMA DESERT YUNGAY CORE]
**Target Comparison:** Mars (Hesperian / Amazonian Boundary)  
**Match Rating:** 94.8% Similarity  

#### 1. Why Atacama is an Exceptional Mars Analog
The Yungay basin in the Atacama Desert is the oldest, most hyper-arid non-polar desert on Earth, experiencing zero precipitation for millenia. 
- **Oxidized Perchlorate Soils:** The top regolith is hyper-saturated with nitrates and perchlorates ($ClO_4^-$), directly matching soil chemical signatures discovered by the Phoenix lander and Curiosity rover.
- **Extreme Solar UV Flux:** At over 2,400m elevation with minimal tropospheric vapor, the UV radiation mirrors Martian equatorial surface conditions, creating extreme organic carbon depletion.
- **Drill Subsurface Testing:** NASA's ASTEP program tested deep autonomous drills here to sample endolithic micro-habitats trapped within salt nodules.

#### 2. Simulated Astronaut Challenges & Environmental Hazards
- **🚨 Acute Solar & UV Exposure:** Solar irradiance reaches index >15. EVA crew faces ocular glare stress and expedited polymer degradation on spacesuit seals and fabric layers.
- **🚨 Intense Diurnal Thermal Cycles:** Ground temperatures spike to +40°C under direct solar radiation and plummet to -10°C at night, inducing rapid thermal expansion stress on life-support liquid cooling systems.
- **🚨 Corrosive Airborne Perchlorate Dust:** Windborne abrasive salt fines adhere electrostatically to spacesuit bearings, rotary airlocks, and solar collector arrays, posing chemical inhalation hazards upon habitat ingress.
- **🚨 Pulmonic Desiccation:** Ambient relative humidity drops below 3%, demanding strict crew electrolyte and hydration management protocols.

#### 3. Recommended EVA & Equipment Mitigations
- Deploy dual-stage electrostatic dust cleaning chambers at habitat airlocks.
- Enforce mandatory UV-absorbent polyimide external overgarments.
- Test autonomous sample caching rovers under high-temperature brushless motor stress.`;
  }

  // If query is about Haughton Crater
  if (queryLower.includes('haughton') || (site?.id === 'haughton-crater')) {
    return `### [TELEMETRY ANALYSIS: HAUGHTON IMPACT CRATER]
**Target Comparison:** The Moon (Shackleton / South Pole-Aitken Basin Analog)  
**Match Rating:** 96.5% Similarity  

#### 1. Why Haughton Crater is the Premier Lunar Analog
Located on Devon Island in the Canadian High Arctic, Haughton is a 23-km wide impact structure formed 39 million years ago into a cold, barren desert.
- **Impact Melt Breccia & Shatter Cones:** The force of the meteor impact shattered ancient dolomites and anorthositic crystalline basement rock, creating extensive hydrothermal impact breccias identical to lunar highland samples returned by Apollo 16.
- **Cryo-Permafrost & Shadowed Gullies:** Micro-climates in shadowed crater ravines mimic the permanently shadowed regions (PSRs) at the lunar South Pole where water ice deposits persist.
- **Barren Arctic Polar Regolith:** The absence of vegetation and harsh mechanical freeze-thaw weathering creates a terrain texture that mimics airless crater floor topography.

#### 2. Simulated Astronaut Challenges & Environmental Hazards
- **🚨 Hypothermic Polar Stress:** Temperatures drop to -45°C with 80 km/h blizzard winds, severely challenging battery chemical discharge rates and hydraulic fluids in rover suspension systems.
- **🚨 Visor & Joint Regolith Abrasion:** Shattered impact breccia produces jagged, razor-sharp micron-sized silicate shards that scratch visor anti-reflective coatings and abrade flexible suit elbow/knee seals.
- **🚨 Extreme Navigational Disorientation:** Near the magnetic pole, magnetic compasses are useless, and overcast Arctic whiteout conditions produce zero shadow contrast, simulating the disorienting stark lighting at lunar low-sun angles.
- **🚨 Crater Rim Traverse Instability:** Unconsolidated scree and polygonal permafrost fissures create slippage hazards for heavy pressurized rovers.

#### 3. Recommended Mission Protocols
- Calibrate active optical LiDAR terrain-relative navigation (TRN) for low-contrast lighting.
- Implement titanium-matrix composite wheel treads tested for sharp impact breccia fields.
- Practice emergency crew egress drills in simulated communications blackouts.`;
  }

  // If query is about Lanzarote
  if (queryLower.includes('lanzarote') || (site?.id === 'lanzarote-volcanic-fields')) {
    return `### [TELEMETRY ANALYSIS: LANZAROTE VOLCANIC FIELDS & LAVA TUBES]
**Target Comparison:** Lunar Maria & Marius Hills Subterranean Conduits  
**Match Rating:** 93.4% Similarity  

#### 1. Why Lanzarote is Vital for Lunar Base Reconnaissance
Lanzarote’s Timanfaya national park and the 6-kilometer Cueva de los Verdes lava tube system represent Earth's most pristine basaltic volcanic analogue.
- **Lunar Basalt Geochemistry:** The basalt flows are rich in olivine, pyroxene, and titanium ilmenite with near-zero chemical alteration due to low rainfall.
- **Subterranean Habitats:** Underground lava tubes provide natural protection against cosmic radiation, micro-meteorites, and thermal extremes—identical to target lunar lava tubes in the Marius Hills skylight region.

#### 2. Simulated Astronaut Challenges
- **🚨 Subterranean RF & Telemetry Shadows:** Deep lava tube ingress creates a total communications blackout, necessitating the deployment of optical mesh repeater nodes every 50 meters.
- **🚨 Total Absence of Ambient Photons:** Pitch-black underground conditions disorient spatial awareness and depth perception.
- **🚨 Spalling Basalt Ceiling Hazards:** Overhead basalt blocks and sharp basaltic stalactites risk dislodgement during seismic vibrations or rover acoustic resonance.
- **🚨 Scoria Suit Perforation:** Glassy pahoehoe crusts and vesicular scoria can tear through high-pressure suit outer bladders during climbing ascents.

#### 3. Recommended Mission Mitigations
- Equip autonomous scout drones with 3D SLAM LiDAR to map cave conduits prior to crew ingress.
- Utilize self-deploying optical tether beacons for real-time telemetry backhaul.`;
  }

  // If query is about McMurdo Dry Valleys
  if (queryLower.includes('mcmurdo') || (site?.id === 'mcmurdo-dry-valleys')) {
    return `### [TELEMETRY ANALYSIS: MCMURDO DRY VALLEYS]
**Target Comparison:** Mars Polar Plains (Phoenix Lander Site / Vastitas Borealis)  
**Match Rating:** 96.2% Similarity  

#### 1. Why McMurdo Matches Mars Polar Cryo-Surfaces
The University and Beacon Valleys in Antarctica are stripped of snow by katabatic winds exceeding 300 km/h, leaving dry, frozen ground overlaying buried ice.
- **Subsurface Cryo-Permafrost:** Ice-cemented soil sits just 2 to 10 cm below dry regolith, perfectly mirroring the subsurface permafrost discovered by NASA's Phoenix lander.
- **Endolithic Cryptobiotic Habitats:** Extremophile microbes survive inside porous sandstone, serving as the gold standard for testing Mars rover bio-signature life-detection instruments.

#### 2. Simulated Astronaut Challenges
- **🚨 Cryogenic Thermal Degradation:** Persistent temperatures below -50°C cause standard lithium-ion batteries to lose 60% capacity and freeze mobility lubricants.
- **🚨 Katabatic Hurricane Hazards:** Sudden 100+ knot winds strip external scientific payloads, disrupt satellite links, and trigger immediate zero-visibility conditions.
- **🚨 Biological Non-Contamination Envelopes:** Strict planetary protection protocols require sterile EVA suits to prevent Earth microbes from contaminating fragile cryo-ecosystems.`;
  }

  // General scientific response for any other site or query
  return `### [GEMINI SURFACE ANALYTICS: MISSION RECON REPORT]
**Site Target:** ${siteName}  
**Planetary Analog Target:** ${planetName}  
**Telemetry Match Rating:** ${site?.matchRating || '92.4'}%  

#### 1. Planetary Geological & Environmental Analogies
- **Geomorphological Match:** The surface architecture of ${siteName} features unweathered basaltic/sedimentary exposures that reflect the volcanic, impact, and erosional history of ${planetName}.
- **Mineralogical Profile:** Contains signature minerals including ${site?.specificMineralogy?.join(', ') || 'Basalt, Olivine, and Ferric Oxides'}, aligning closely with spectroscopic data from orbital orbiters.
- **Atmospheric & Thermal Similitude:** Provides high-altitude, low-vapor, and intense radiation exposure that mimics the harsh surface flux of interplanetary destinations.

#### 2. Simulated Astronaut Challenges & EVA Hazards
- **🚨 Environmental Extremes:** Rapid thermal cycling and severe moisture deficits impose strict operational envelopes on Portable Life Support Systems (PLSS).
- **🚨 Suit Joint & Visor Abrasiveness:** Airborne micro-particles and jagged volcanic regolith cause electrostatic cling and accelerated mechanical wear on spacesuit bearings.
- **🚨 Terrain Traverse Risks:** Loose scree, fragile crusts, and uneven topography challenge rover autonomous hazard-avoidance algorithms and crew mobility.

#### 3. Analog Training & Equipment Recommendations
- Conduct pressurized rover traverse simulations to evaluate battery range and traction.
- Validate subsurface core-drilling tools and sealed sample containment protocols.
- Establish communications latency protocols (up to 20-minute Mars delay simulation).`;
}

// Serve client in Vite dev or production
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NULLG Interplanetary Site Scout server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
