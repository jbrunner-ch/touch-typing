export type KeyboardLayoutId = 'de-qwertz' | 'ch-qwertz' | 'en-qwerty';

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyDef {
  id: string;
  label: string;
  shiftLabel?: string;
  code: string;
  finger: FingerId;
  width?: number; // relative units, default 1
  isHomeRow?: boolean;
  hasBump?: boolean;
}

export interface Lesson {
  id: string;
  worldId: number;
  worldTitle: string;
  order: number;
  title: string;
  subtitle: string;
  newKeys: string[];
  targetWpm: number;
  minAccuracy: number;
  /** Text generator or static texts per layout */
  texts: {
    de: string;
    en: string;
  };
}

export interface LessonProgress {
  lessonId: string;
  stars: number; // 0..3
  bestWpm: number;
  bestCpm: number;
  bestAccuracy: number;
  attempts: number;
  lastPlayedAt: string;
}

export interface KeyStat {
  hits: number;
  misses: number;
  totalMs: number;
}

export interface SessionRecord {
  id?: string;
  lessonId: string;
  lessonTitle: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  xpEarned: number;
  stars: number;
  durationSec: number;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  xp: number;
  level: number;
  streak: number;
  lastPracticeDate: string; // YYYY-MM-DD
  preferredLayout: KeyboardLayoutId;
  soundEnabled: boolean;
  showKeyboard: boolean;
  showHands: boolean;
  privacyConsentAt: string;
  totalLessonsCompleted: number;
  totalKeystrokes: number;
  badges: string[];
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface TypingResult {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  totalChars: number;
  durationSec: number;
  stars: number;
  passed: boolean;
  xpEarned: number;
  keyStatsDelta: Record<string, KeyStat>;
}
