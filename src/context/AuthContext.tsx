import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { PRESET_ASTRONAUTS } from '../data/analogSites';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, callsign?: string) => Promise<boolean>;
  loginAsPreset: (presetId: string) => void;
  signup: (profile: Omit<UserProfile, 'id' | 'favorites'>) => Promise<boolean>;
  logout: () => void;
  toggleFavorite: (siteId: string) => void;
  isFavorite: (siteId: string) => boolean;
  saveSiteNote: (siteId: string, note: string) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const STORAGE_KEY = 'nullg_interplanetary_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved user profile from localStorage', e);
    }
    // Default initial user for instant seamless experience
    return PRESET_ASTRONAUTS[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.warn('Failed to persist user profile', e);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, callsign?: string): Promise<boolean> => {
    const existing = PRESET_ASTRONAUTS.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setUser(existing);
      setIsAuthModalOpen(false);
      return true;
    }

    // Dynamic login/account creation
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      callsign: callsign || email.split('@')[0].toUpperCase(),
      email,
      role: 'Mission Specialist',
      organization: 'NASA Space Apps Scout Team',
      badgeNumber: `NASA-EXP-${Math.floor(100 + Math.random() * 900)}`,
      avatarSeed: email,
      favorites: ['atacama-desert', 'haughton-crater'],
      notes: {},
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginAsPreset = (presetId: string) => {
    const preset = PRESET_ASTRONAUTS.find(p => p.id === presetId);
    if (preset) {
      setUser(preset);
      setIsAuthModalOpen(false);
    }
  };

  const signup = async (profileData: Omit<UserProfile, 'id' | 'favorites'>): Promise<boolean> => {
    const newUser: UserProfile = {
      ...profileData,
      id: `user-${Date.now()}`,
      favorites: ['atacama-desert'],
      notes: {},
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleFavorite = (siteId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const exists = user.favorites.includes(siteId);
    const updatedFavorites = exists
      ? user.favorites.filter(id => id !== siteId)
      : [...user.favorites, siteId];

    setUser({
      ...user,
      favorites: updatedFavorites,
    });
  };

  const isFavorite = (siteId: string): boolean => {
    return user ? user.favorites.includes(siteId) : false;
  };

  const saveSiteNote = (siteId: string, note: string) => {
    if (!user) return;
    setUser({
      ...user,
      notes: {
        ...(user.notes || {}),
        [siteId]: note,
      },
    });
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsPreset,
        signup,
        logout,
        toggleFavorite,
        isFavorite,
        saveSiteNote,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
