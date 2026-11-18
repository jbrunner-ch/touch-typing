import { BadgeDef } from '../types/typing';

export const BADGES: BadgeDef[] = [
  {
    id: 'first-lesson',
    title: 'Erster Meilenstein',
    description: 'Schliesse deine erste Lektion erfolgreich ab.',
    icon: '🚀',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'home-row-master',
    title: 'Heimreihen-Held',
    description: 'Meistere alle Lektionen der Grundstellung (Welt 1).',
    icon: '🏠',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'precision-98',
    title: 'Scharfschütze',
    description: 'Erreiche mindestens 98 % Genauigkeit in einer Lektion.',
    icon: '🎯',
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 'speed-40',
    title: 'Flotter Finger',
    description: 'Tippe mindestens 40 WPM in einer Lektion oder einem Speed-Test.',
    icon: '⚡',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'speed-60',
    title: 'Tastatur-Turbo',
    description: 'Knacke die 60 WPM Marke bei mindestens 92 % Genauigkeit.',
    icon: '🔥',
    color: 'from-red-500 to-orange-600',
  },
  {
    id: 'streak-3',
    title: 'Dranbleiber',
    description: 'Übe an 3 Tagen in Folge.',
    icon: '📅',
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'streak-7',
    title: 'Wochen-Champion',
    description: 'Halte einen 7-Tage-Streak durch.',
    icon: '👑',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'keystrokes-1000',
    title: 'Tausend-Tasten',
    description: 'Sammle insgesamt über 1.000 Tastenanschläge.',
    icon: '⌨️',
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 'curriculum-complete',
    title: '10-Finger-Meister',
    description: 'Schliesse alle 20 Lektionen des Curriculums ab.',
    icon: '🏆',
    color: 'from-amber-500 to-yellow-400',
  },
];

export function calculateLevelFromXp(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number } {
  // Progressive curve: Level 1 -> 100 XP, Level 2 -> 250 XP, etc.
  let level = 1;
  let remaining = xp;
  while (true) {
    const needed = level * 120;
    if (remaining < needed) {
      return { level, currentLevelXp: remaining, nextLevelXp: needed };
    }
    remaining -= needed;
    level++;
  }
}

export function calculateStars(wpm: number, accuracy: number, targetWpm: number, minAccuracy: number): {
  stars: number;
  passed: boolean;
} {
  if (accuracy < minAccuracy) {
    return { stars: 0, passed: false };
  }
  if (wpm >= targetWpm * 1.25 && accuracy >= 97) {
    return { stars: 3, passed: true };
  }
  if (wpm >= targetWpm && accuracy >= 94) {
    return { stars: 2, passed: true };
  }
  return { stars: 1, passed: true };
}
