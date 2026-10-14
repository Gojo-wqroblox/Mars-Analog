import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { EarthAnalogSite, TargetPlanet } from '../types';
import { TARGET_PLANET_PROFILES } from '../data/analogSites';
import { BarChart3, Radar as RadarIcon } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

interface SiteRadarChartProps {
  site: EarthAnalogSite;
  targetPlanet: TargetPlanet;
}

export const SiteRadarChart: React.FC<SiteRadarChartProps> = ({ site, targetPlanet }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');

  const planetProfile = TARGET_PLANET_PROFILES[targetPlanet];
  const targetColor = targetPlanet === 'Mars' ? 'rgba(249, 115, 22, ' : 'rgba(148, 163, 184, ';

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy prior chart instance if existing
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = [
      'Soil Composition',
      'Temperature Extremes',
      'Atmospheric Aridity',
      'Radiation/UV Exposure',
      'Geological Texture',
      'Ice / Volatiles Match',
    ];

    const siteData = [
      site.traits.soilComposition,
      site.traits.temperatureRange,
      site.traits.atmosphericPressure,
      site.traits.radiationExposure,
      site.traits.geologicalTexture,
      site.traits.volatilesPresence,
    ];

    const planetData = [
      planetProfile.averageTraits.soilComposition,
      planetProfile.averageTraits.temperatureRange,
      planetProfile.averageTraits.atmosphericPressure,
      planetProfile.averageTraits.radiationExposure,
      planetProfile.averageTraits.geologicalTexture,
      planetProfile.averageTraits.volatilesPresence,
    ];

    if (chartType === 'radar') {
      chartInstanceRef.current = new ChartJS(ctx, {
        type: 'radar',
        data: {
          labels,
          datasets: [
            {
              label: `${site.name} (Earth)`,
              data: siteData,
              backgroundColor: 'rgba(6, 182, 212, 0.25)',
              borderColor: '#06b6d4',
              borderWidth: 2.5,
              pointBackgroundColor: '#22d3ee',
              pointBorderColor: '#083344',
              pointHoverBackgroundColor: '#ffffff',
              pointHoverBorderColor: '#06b6d4',
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: `Target: ${planetProfile.name} Average`,
              data: planetData,
              backgroundColor: targetColor + '0.20)',
              borderColor: targetPlanet === 'Mars' ? '#f97316' : '#94a3b8',
              borderWidth: 2,
              borderDash: [5, 4],
              pointBackgroundColor: targetPlanet === 'Mars' ? '#ea580c' : '#64748b',
              pointBorderColor: '#050811',
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                color: 'rgba(255, 255, 255, 0.08)',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.08)',
              },
              pointLabels: {
                color: '#94a3b8',
                font: {
                  family: "'Inter', sans-serif",
                  size: 11,
                  weight: 500,
                },
              },
              ticks: {
                backdropColor: 'transparent',
                color: '#64748b',
                stepSize: 20,
                font: {
                  size: 9,
                },
              },
              min: 0,
              max: 100,
            },
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#e2e8f0',
                font: {
                  family: "'Chakra Petch', sans-serif",
                  size: 11,
                },
                boxWidth: 14,
                boxHeight: 14,
              },
            },
            tooltip: {
              backgroundColor: '#090e1a',
              borderColor: 'rgba(6, 182, 212, 0.4)',
              borderWidth: 1,
              titleColor: '#38bdf8',
              bodyColor: '#e2e8f0',
              padding: 10,
              callbacks: {
                label: (context) => ` ${context.dataset.label}: ${context.raw}/100 Index`,
              },
            },
          },
        },
      });
    } else {
      chartInstanceRef.current = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: `${site.name}`,
              data: siteData,
              backgroundColor: 'rgba(6, 182, 212, 0.75)',
              borderColor: '#06b6d4',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: `${planetProfile.name} Benchmark`,
              data: planetData,
              backgroundColor: targetColor + '0.70)',
              borderColor: targetPlanet === 'Mars' ? '#ea580c' : '#64748b',
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.04)',
              },
              ticks: {
                color: '#94a3b8',
                font: {
                  size: 10,
                },
                maxRotation: 30,
              },
            },
            y: {
              min: 0,
              max: 100,
              grid: {
                color: 'rgba(255, 255, 255, 0.06)',
              },
              ticks: {
                color: '#64748b',
                stepSize: 20,
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#e2e8f0',
                font: {
                  family: "'Chakra Petch', sans-serif",
                  size: 11,
                },
              },
            },
            tooltip: {
              backgroundColor: '#090e1a',
              borderColor: 'rgba(6, 182, 212, 0.4)',
              borderWidth: 1,
              titleColor: '#38bdf8',
              bodyColor: '#e2e8f0',
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [site, targetPlanet, chartType]);

  const traitsList = [
    { label: 'Soil Composition', siteVal: site.traits.soilComposition, planetVal: planetProfile.averageTraits.soilComposition },
    { label: 'Temperature Extremes', siteVal: site.traits.temperatureRange, planetVal: planetProfile.averageTraits.temperatureRange },
    { label: 'Atmospheric Aridity', siteVal: site.traits.atmosphericPressure, planetVal: planetProfile.averageTraits.atmosphericPressure },
    { label: 'Radiation / UV Exposure', siteVal: site.traits.radiationExposure, planetVal: planetProfile.averageTraits.radiationExposure },
    { label: 'Geological Texture', siteVal: site.traits.geologicalTexture, planetVal: planetProfile.averageTraits.geologicalTexture },
    { label: 'Ice / Volatiles', siteVal: site.traits.volatilesPresence, planetVal: planetProfile.averageTraits.volatilesPresence },
  ];

  return (
    <div className="flex flex-col h-full bg-[#080d1a]/80 border border-cyan-950/70 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-cyan-900/40 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider text-cyan-300 uppercase">
            Telemetry Trait Correlation
          </span>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700/60 text-xs">
          <button
            onClick={() => setChartType('radar')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all ${
              chartType === 'radar'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RadarIcon className="w-3.5 h-3.5" />
            <span>Radar</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all ${
              chartType === 'bar'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full h-64 sm:h-72 my-1">
        <canvas ref={canvasRef} />
      </div>

      {/* Trait delta chips */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {traitsList.map((t) => {
          const delta = t.siteVal - t.planetVal;
          const isHighMatch = Math.abs(delta) <= 10;
          return (
            <div key={t.label} className="bg-slate-950/60 border border-slate-800 rounded p-2 flex flex-col">
              <span className="text-slate-400 text-[11px] truncate">{t.label}</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-mono font-bold text-cyan-300">{t.siteVal}%</span>
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                  isHighMatch 
                    ? 'text-emerald-400 bg-emerald-950/40' 
                    : 'text-amber-400 bg-amber-950/40'
                }`}>
                  {delta >= 0 ? `+${delta}%` : `${delta}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
