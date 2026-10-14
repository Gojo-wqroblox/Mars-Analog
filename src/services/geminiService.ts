import { EarthAnalogSite, TargetPlanet } from '../types';

export interface ChatResponse {
  reply: string;
  source: string;
}

export async function askGeminiSurfaceAnalytics(
  prompt: string,
  targetPlanet: TargetPlanet,
  siteContext?: EarthAnalogSite
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        targetPlanet,
        siteContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Network issue calling backend Gemini endpoint, using local mission intelligence:', error);
    // Return reliable client-side mission fallback
    return {
      reply: getClientFallbackResponse(prompt, siteContext, targetPlanet),
      source: 'client-offline-cache',
    };
  }
}

function getClientFallbackResponse(
  prompt: string,
  site?: EarthAnalogSite,
  targetPlanet: TargetPlanet = 'Mars'
): string {
  const query = prompt.toLowerCase();
  const siteName = site?.name || (targetPlanet === 'Mars' ? 'Atacama Desert' : 'Haughton Crater');

  if (query.includes('atacama') || site?.id === 'atacama-desert') {
    return `### [TELEMETRY ANALYSIS: ATACAMA DESERT (CHILE)]
**Target Planet:** Mars (Amazonian-Hesperian Era)  
**Match Rating:** 94.8%  

#### Why It Matches Mars:
The Atacama Desert is the driest non-polar region on Earth. The Yungay core receives virtually zero precipitation, leading to extreme accumulation of oxidized perchlorate salts ($ClO_4^-$) and ferric iron, precisely mirroring the hyper-oxidized regolith analyzed by NASA's Phoenix and Curiosity missions.

#### Simulated Astronaut Challenges & EVA Hazards:
- **Solar Radiation Index >15:** Extreme UV breaks down spacesuit polymers and visor anti-fog coatings 4x faster than standard terrestrial tests.
- **Diurnal Thermal Cycling:** Temperature swings from +38°C to -10°C stress liquid cooling garments (LCGs).
- **Abrasive Perchlorate Dust:** Inhalation hazard during habitat airlock repressurization and rapid wear on suit bearing joints.
- **Dehydration:** Relative humidity < 3% accelerates astronaut fluid loss by 40%.`;
  }

  if (query.includes('haughton') || site?.id === 'haughton-crater') {
    return `### [TELEMETRY ANALYSIS: HAUGHTON IMPACT CRATER (CANADA)]
**Target Planet:** Moon (Lunar Highlands / Shackleton Rim)  
**Match Rating:** 96.5%  

#### Why It Matches the Moon:
Devon Island features a 23-km meteorite crater with shock-melted anorthositic impact breccias and shatter cones. The high-arctic periglacial desert lacks organic soil, creating pristine geometric fractured rock fields identical to lunar highland basins.

#### Simulated Astronaut Challenges & EVA Hazards:
- **Jagged Impact Breccia:** Razor-sharp microscopic glass and silicate shards inflict rapid abrasion on spacesuit joints, seals, and glove palms.
- **Sub-zero Thermal Shock:** Temperatures plunge to -45°C, reducing battery capacity by 50% and threatening EVA life support systems.
- **Navigational Disorientation:** High magnetic declination renders magnetic heading useless, simulating Apollo-style visual landmark navigation under harsh shadow angles.`;
  }

  return `### [GEMINI SURFACE ANALYTICS: MISSION SUMMARY]
**Site:** ${siteName}  
**Planetary Analog:** ${targetPlanet}  
**Match Rating:** ${site?.matchRating || 92}%  

#### Geologic & Surface Traits:
This site exhibits key morphological analogues to ${targetPlanet}, specifically in surface regolith texture, basaltic weathering rates, and arid or cryo-permafrost regimes.

#### Simulated Astronaut Challenges:
- **Thermal Range Management:** Rigorous testing needed for active suit cooling and heating loops.
- **Regolith Infiltration:** Fine-grain particulate risk to rover drivetrains, sample collection seals, and airlock pressure valves.
- **Terrain Mobility:** Fractured block fields requiring high-torque all-terrain rover navigation.`;
}
