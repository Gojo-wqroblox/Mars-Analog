import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PRESET_ASTRONAUTS } from '../data/analogSites';
import {
  User,
  ShieldCheck,
  Rocket,
  Lock,
  Mail,
  LogOut,
  X,
  Star,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, loginAsPreset, signup, logout } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [role, setRole] = useState<'Mission Specialist' | 'Planetary Geologist' | 'Commander' | 'EVA Flight Engineer'>('Planetary Geologist');
  const [organization, setOrganization] = useState('NASA Artemis Analog Recon');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid mission email or callsign');
      return;
    }
    setError('');
    await login(email, callsign);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !callsign) {
      setError('Please fill in both callsign and email');
      return;
    }
    setError('');
    await signup({
      callsign,
      email,
      role,
      organization,
      badgeNumber: `NASA-AST-${Math.floor(100 + Math.random() * 900)}`,
      avatarSeed: callsign,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#0a0f1d] border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/70 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060a14] border-b border-cyan-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Orbitron'] text-base font-bold text-white tracking-wider">
                ASTRONAUT PORTAL
              </h3>
              <p className="text-[10px] font-mono text-cyan-400">
                NULLG Mission Security & Flight Crew Roster
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is logged in, show current profile details */}
        {user ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-900/40">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-xl text-black font-mono shadow-lg shadow-cyan-500/20">
                {user.callsign.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-lg text-white font-['Chakra_Petch'] truncate">
                    {user.callsign}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                    AUTHENTICATED
                  </span>
                </div>
                <p className="text-xs text-cyan-300 font-mono mt-0.5">{user.role}</p>
                <p className="text-xs text-slate-400 font-mono truncate">{user.organization}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Badge Number:</span>
                <p className="text-cyan-300 font-bold mt-0.5">{user.badgeNumber}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Saved Favorites:</span>
                <p className="text-amber-300 font-bold mt-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {user.favorites.length} Analog Sites
                </p>
              </div>
            </div>

            {/* Quick Switch Astronaut Profile */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block mb-2">
                Quick Switch Crew Identity:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_ASTRONAUTS.map((astro) => (
                  <button
                    key={astro.id}
                    onClick={() => loginAsPreset(astro.id)}
                    className={`p-2 rounded-lg border text-left text-xs font-mono transition ${
                      astro.id === user.id
                        ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-white truncate">{astro.callsign}</div>
                    <div className="text-[10px] text-slate-400 truncate">{astro.role}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-mono flex items-center space-x-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Console</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition"
              >
                Return to Mission Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* User Login / Sign Up Tabs */
          <div className="p-6 space-y-5">
            {/* Tab switch */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2 text-center rounded-lg transition font-medium ${
                  tab === 'login'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Crew Log In
              </button>
              <button
                onClick={() => setTab('signup')}
                className={`flex-1 py-2 text-center rounded-lg transition font-medium ${
                  tab === 'signup'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                New Astronaut Sign Up
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono">
                {error}
              </div>
            )}

            {/* 1-Click Preset Quick Login */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  1-Click Astronaut Quick Sign In:
                </span>
              </div>
              <div className="space-y-1.5">
                {PRESET_ASTRONAUTS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loginAsPreset(preset.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-left transition text-xs group"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-cyan-300 font-mono">
                        {preset.callsign}
                      </span>
                      <span className="text-slate-400 text-[11px] ml-2">({preset.role})</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center">
                      Select <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            {tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Astronaut Callsign or Mission Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. j.watkins@artemis.nasa.gov or ARES-LEAD"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Security Access Code / Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-cyan-500/25 mt-2"
                >
                  Authorize Mission Access
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Callsign</label>
                    <input
                      type="text"
                      value={callsign}
                      onChange={(e) => setCallsign(e.target.value)}
                      placeholder="e.g. ORION-LEAD"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Role</label>
                    <select
                      value={role}
                      onChange={(e: any) => setRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
                    >
                      <option value="Planetary Geologist">Planetary Geologist</option>
                      <option value="Commander">Commander</option>
                      <option value="Mission Specialist">Mission Specialist</option>
                      <option value="EVA Flight Engineer">EVA Flight Engineer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Agency Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="astronaut@nasa.gov"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Organization / Mission</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="NASA Space Apps / Artemis Roster"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-cyan-500/25 mt-2"
                >
                  Create Astronaut Profile
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
