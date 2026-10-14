import React, { useState, useEffect } from 'react';
import { TargetPlanet } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Satellite,
  Star,
  Bot,
  User,
  Clock,
  Radio,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  targetPlanet: TargetPlanet;
  onOpenGeminiChat: () => void;
  activeView: 'explorer' | 'favorites';
  setActiveView: (view: 'explorer' | 'favorites') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  targetPlanet,
  onOpenGeminiChat,
  activeView,
  setActiveView,
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().substring(11, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-950/80 bg-[#050813]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Mission Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('explorer')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Satellite className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#050813]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/40">
                  NASA SPACE APPS
                </span>
                <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                  PLANETARY RECON
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-['Orbitron'] flex items-center gap-1.5">
                <span>NULLG:</span>
                <span className="text-cyan-400 font-normal">Interplanetary Site Scout</span>
              </h1>
            </div>
          </div>

          {/* Right Navigation & Telemetry Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live UTC Clock */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{utcTime}</span>
            </div>

            {/* View Switcher: Explorer vs My Favorites */}
            <div className="flex items-center bg-slate-950/90 rounded-xl p-1 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveView('explorer')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'explorer'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Explorer
              </button>

              <button
                onClick={() => setActiveView('favorites')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'favorites'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${activeView === 'favorites' ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>Favorites</span>
                {user && user.favorites.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-bold ml-1">
                    {user.favorites.length}
                  </span>
                )}
              </button>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenGeminiChat}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-medium transition shadow-sm active:scale-95"
              title="Launch Gemini Surface Analytics AI"
            >
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">Gemini AI</span>
            </button>

            {/* Astronaut Profile / Login Button */}
            {user ? (
              <button
                onClick={openAuthModal}
                className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-black text-xs">
                  {user.callsign.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-bold text-white group-hover:text-cyan-300 transition truncate max-w-[90px]">
                    {user.callsign}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                    {user.role}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition"
              >
                Astronaut Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
