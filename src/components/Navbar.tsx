import React from 'react';
import {
  BarChart2,
  BookOpen,
  Flame,
  Gauge,
  Keyboard,
  LogIn,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { KeyboardLayoutId, UserProfile } from '../types/typing';
import { calculateLevelFromXp } from '../data/badges';
import { LAYOUT_LABELS } from '../data/keyboardLayouts';

export type NavTab = 'curriculum' | 'adaptive' | 'speed' | 'stats';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: UserProfile;
  isAuthenticated: boolean;
  authLoading: boolean;
  onGoogleLogin: () => void;
  onLogout: () => void;
  onChangeLayout: (layout: KeyboardLayoutId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  isAuthenticated,
  authLoading,
  onGoogleLogin,
  onLogout,
  onChangeLayout,
}) => {
  const { level, currentLevelXp, nextLevelXp } = calculateLevelFromXp(profile.xp);
  const xpPct = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'curriculum', label: 'Lektionen', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'adaptive', label: 'Adaptiv', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'speed', label: 'Speed-Test', icon: <Gauge className="w-4 h-4" /> },
    { id: 'stats', label: 'Statistik', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-stone-200">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <button
          onClick={() => onSelectTab('curriculum')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-400 border-b-2 border-stone-950 flex items-center justify-center group-hover:bg-stone-800 transition">
            <Keyboard className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="font-extrabold text-stone-900 leading-none text-base tracking-tight">
              TippMeister
            </div>
            <div className="text-[11px] font-semibold text-stone-500 mt-0.5">
              10-Finger-Schule
            </div>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                  active
                    ? 'bg-blue-600 text-white border-blue-700 border-b-2'
                    : 'bg-transparent text-stone-600 border-transparent hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Level & XP */}
          <div
            className="hidden sm:flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1.5"
            title={`${profile.xp} XP gesamt`}
          >
            <span className="text-xs font-extrabold text-stone-800">Lvl {level}</span>
            <div className="w-14 h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div
            className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-orange-700"
            title="Tägliche Übungsserie"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            {profile.streak}
          </div>

          {/* Keyboard Layout Selector */}
          <select
            value={profile.preferredLayout}
            onChange={(e) => onChangeLayout(e.target.value as KeyboardLayoutId)}
            className="text-xs font-bold bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 outline-none cursor-pointer"
            aria-label="Tastaturlayout wählen"
          >
            {(Object.keys(LAYOUT_LABELS) as KeyboardLayoutId[]).map((id) => (
              <option key={id} value={id}>
                {LAYOUT_LABELS[id].flag} {LAYOUT_LABELS[id].short}
              </option>
            ))}
          </select>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName || 'Profil'}
                  className="w-8 h-8 rounded-full border-2 border-stone-300 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-bold">
                  {(profile.displayName || 'U').slice(0, 1).toUpperCase()}
                </div>
              )}
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition cursor-pointer"
                title="Abmelden"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              disabled={authLoading}
              onClick={onGoogleLogin}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border-b-2 border-stone-950 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
