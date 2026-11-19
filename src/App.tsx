import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from './firebase/config';
import {
  deleteAllUserDataAndAccount,
  exportAllUserData,
  getOrCreateUserProfile,
  getTodayDateString,
  loadAllLessonProgress,
  loadKeyStats,
  loadRecentSessions,
  recordSession,
  saveKeyStats,
  saveLessonProgress,
  updateUserProfileFields,
} from './services/firestoreService';
import { CURRICULUM, getLessonText } from './data/curriculum';
import { BADGES, calculateLevelFromXp } from './data/badges';
import {
  KeyboardLayoutId,
  KeyStat,
  Lesson,
  LessonProgress,
  SessionRecord,
  TypingResult,
  UserProfile,
} from './types/typing';
import { Navbar, NavTab } from './components/Navbar';
import { CurriculumMap } from './components/CurriculumMap';
import { TypingArena } from './components/TypingArena';
import { AdaptiveTrainer } from './components/AdaptiveTrainer';
import { SpeedTest } from './components/SpeedTest';
import { StatsDashboard } from './components/StatsDashboard';
import { LegalModal } from './components/LegalModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';

const GUEST_STORAGE_KEY = 'tippmeister_guest_v1';
const CONSENT_STORAGE_KEY = 'tippmeister_consent_v1';

const DEFAULT_GUEST_PROFILE: UserProfile = {
  uid: 'guest',
  displayName: 'Gast',
  email: null,
  photoURL: null,
  xp: 0,
  level: 1,
  streak: 0,
  lastPracticeDate: '',
  preferredLayout: 'de-qwertz',
  soundEnabled: true,
  showKeyboard: true,
  showHands: true,
  privacyConsentAt: '',
  totalLessonsCompleted: 0,
  totalKeystrokes: 0,
  badges: [],
};

interface GuestState {
  profile: UserProfile;
  lessons: Record<string, LessonProgress>;
  keyStats: Record<string, KeyStat>;
  sessions: SessionRecord[];
}

function loadGuestState(): GuestState {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as GuestState;
    }
  } catch {
    // ignore corrupted local storage
  }
  return {
    profile: DEFAULT_GUEST_PROFILE,
    lessons: {},
    keyStats: {},
    sessions: [],
  };
}

export function App() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>(() => loadGuestState().profile);
  const [lessonsProgress, setLessonsProgress] = useState<Record<string, LessonProgress>>(
    () => loadGuestState().lessons
  );
  const [keyStats, setKeyStats] = useState<Record<string, KeyStat>>(
    () => loadGuestState().keyStats
  );
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadGuestState().sessions);

  const [activeTab, setActiveTab] = useState<NavTab>('curriculum');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [unlockAll, setUnlockAll] = useState(false);

  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'imprint' | 'data' | null>(null);
  const [hasConsent, setHasConsent] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(CONSENT_STORAGE_KEY));
  });

  // Sync guest state to localStorage when not authenticated
  useEffect(() => {
    if (!firebaseUser) {
      localStorage.setItem(
        GUEST_STORAGE_KEY,
        JSON.stringify({
          profile,
          lessons: lessonsProgress,
          keyStats,
          sessions,
        })
      );
    }
  }, [firebaseUser, profile, lessonsProgress, keyStats, sessions]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const [prof, prog, kStats, sess] = await Promise.all([
            getOrCreateUserProfile(user, profile.preferredLayout),
            loadAllLessonProgress(user.uid),
            loadKeyStats(user.uid),
            loadRecentSessions(user.uid),
          ]);
          setProfile(prof);
          setLessonsProgress(prog);
          setKeyStats(kStats);
          setSessions(sess);
        } catch (err) {
          console.error('Fehler beim Laden der Cloud-Daten:', err);
        }
      } else {
        const guest = loadGuestState();
        setProfile(guest.profile);
        setLessonsProgress(guest.lessons);
        setKeyStats(guest.keyStats);
        setSessions(guest.sessions);
      }
      setAuthLoading(false);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen';
      setAuthError(`Google-Anmeldung nicht möglich: ${msg}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setActiveLesson(null);
  };

  const updatePreferences = useCallback(
    async (patch: Partial<UserProfile>) => {
      setProfile((prev) => ({ ...prev, ...patch }));
      if (firebaseUser) {
        await updateUserProfileFields(firebaseUser.uid, patch);
      }
    },
    [firebaseUser]
  );

  const handleTypingComplete = useCallback(
    async (result: TypingResult, lessonId: string, lessonTitle: string): Promise<string[]> => {
      const today = getTodayDateString();
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      let nextStreak = profile.streak;
      if (profile.lastPracticeDate !== today) {
        nextStreak = profile.lastPracticeDate === yesterday ? profile.streak + 1 : 1;
      }

      const nextXp = profile.xp + result.xpEarned;
      const { level: nextLevel } = calculateLevelFromXp(nextXp);
      const nextKeystrokes = profile.totalKeystrokes + result.totalChars;

      // Merge keyStats
      const mergedKeyStats: Record<string, KeyStat> = { ...keyStats };
      for (const [ch, delta] of Object.entries(result.keyStatsDelta)) {
        const existing = mergedKeyStats[ch] || { hits: 0, misses: 0, totalMs: 0 };
        mergedKeyStats[ch] = {
          hits: existing.hits + delta.hits,
          misses: existing.misses + delta.misses,
          totalMs: existing.totalMs + delta.totalMs,
        };
      }
      setKeyStats(mergedKeyStats);

      // Update lesson progress if curriculum lesson
      const updatedLessons = { ...lessonsProgress };
      const isCurriculum = CURRICULUM.some((l) => l.id === lessonId);
      if (isCurriculum) {
        const prev = updatedLessons[lessonId];
        const nextProg: LessonProgress = {
          lessonId,
          stars: Math.max(prev?.stars ?? 0, result.stars),
          bestWpm: Math.max(prev?.bestWpm ?? 0, result.wpm),
          bestCpm: Math.max(prev?.bestCpm ?? 0, result.cpm),
          bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, result.accuracy),
          attempts: (prev?.attempts ?? 0) + 1,
          lastPlayedAt: new Date().toISOString(),
        };
        updatedLessons[lessonId] = nextProg;
        setLessonsProgress(updatedLessons);
        if (firebaseUser) {
          saveLessonProgress(firebaseUser.uid, nextProg).catch(console.error);
        }
      }

      const completedCount = Object.values(updatedLessons).filter((l) => l.stars > 0).length;

      // Evaluate Badges
      const earnedSet = new Set(profile.badges);
      const newlyUnlockedNames: string[] = [];
      const unlock = (badgeId: string) => {
        if (!earnedSet.has(badgeId)) {
          earnedSet.add(badgeId);
          const def = BADGES.find((b) => b.id === badgeId);
          if (def) newlyUnlockedNames.push(`${def.icon} ${def.title}`);
        }
      };

      if (completedCount >= 1) unlock('first-lesson');
      const world1Done = CURRICULUM.filter((l) => l.worldId === 1).every(
        (l) => (updatedLessons[l.id]?.stars ?? 0) > 0
      );
      if (world1Done) unlock('home-row-master');
      if (result.accuracy >= 98) unlock('precision-98');
      if (result.wpm >= 40) unlock('speed-40');
      if (result.wpm >= 60 && result.accuracy >= 92) unlock('speed-60');
      if (nextStreak >= 3) unlock('streak-3');
      if (nextStreak >= 7) unlock('streak-7');
      if (nextKeystrokes >= 1000) unlock('keystrokes-1000');
      if (completedCount >= CURRICULUM.length) unlock('curriculum-complete');

      const nextBadges = Array.from(earnedSet);

      const newSession: SessionRecord = {
        lessonId,
        lessonTitle,
        wpm: result.wpm,
        cpm: result.cpm,
        accuracy: result.accuracy,
        xpEarned: result.xpEarned,
        stars: result.stars,
        durationSec: result.durationSec,
        createdAt: new Date().toISOString(),
      };
      setSessions((prev) => [newSession, ...prev].slice(0, 25));

      const profilePatch: Partial<UserProfile> = {
        xp: nextXp,
        level: nextLevel,
        streak: nextStreak,
        lastPracticeDate: today,
        totalLessonsCompleted: completedCount,
        totalKeystrokes: nextKeystrokes,
        badges: nextBadges,
      };
      setProfile((prev) => ({ ...prev, ...profilePatch }));

      if (firebaseUser) {
        Promise.all([
          updateUserProfileFields(firebaseUser.uid, profilePatch),
          saveKeyStats(firebaseUser.uid, mergedKeyStats),
          recordSession(firebaseUser.uid, newSession),
        ]).catch(console.error);
      }

      return newlyUnlockedNames;
    },
    [profile, keyStats, lessonsProgress, firebaseUser]
  );

  const handleExportData = async () => {
    const data = firebaseUser
      ? await exportAllUserData(firebaseUser.uid)
      : { exportedAt: new Date().toISOString(), guestData: loadGuestState() };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tippmeister-daten-${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (firebaseUser) {
      await deleteAllUserDataAndAccount(firebaseUser);
    }
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setProfile(DEFAULT_GUEST_PROFILE);
    setLessonsProgress({});
    setKeyStats({});
    setSessions([]);
    setActiveLesson(null);
  };

  const handleAcceptConsent = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, new Date().toISOString());
    setHasConsent(true);
  };

  const activeLessonIdx = activeLesson
    ? CURRICULUM.findIndex((l) => l.id === activeLesson.id)
    : -1;
  const nextLesson =
    activeLessonIdx >= 0 && activeLessonIdx + 1 < CURRICULUM.length
      ? CURRICULUM[activeLessonIdx + 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveLesson(null);
        }}
        profile={profile}
        isAuthenticated={Boolean(firebaseUser)}
        authLoading={authLoading}
        onGoogleLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onChangeLayout={(layout: KeyboardLayoutId) => updatePreferences({ preferredLayout: layout })}
      />

      {authError && (
        <div className="max-w-6xl mx-auto w-full px-4 pt-3">
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-2.5 text-xs font-medium flex items-center justify-between">
            <span>{authError}</span>
            <button onClick={() => setAuthError(null)} className="font-bold ml-4 cursor-pointer">
              ✕
            </button>
          </div>
        </div>
      )}

      {!firebaseUser && !authLoading && (
        <div className="max-w-6xl mx-auto w-full px-4 pt-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-stone-700 flex flex-wrap items-center justify-between gap-2">
            <span>
              Du übst aktuell im <strong>Gast-Modus</strong> (lokal gespeichert). Melde dich mit
              Google an, um deinen Fortschritt in der Cloud zu sichern.
            </span>
            <button
              onClick={handleGoogleLogin}
              className="font-bold text-blue-700 underline hover:text-blue-900 cursor-pointer"
            >
              Jetzt mit Google anmelden
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {activeTab === 'curriculum' && activeLesson ? (
          <TypingArena
            title={`Lektion ${activeLesson.order}: ${activeLesson.title}`}
            subtitle={activeLesson.subtitle}
            text={getLessonText(activeLesson, profile.preferredLayout)}
            targetWpm={activeLesson.targetWpm}
            minAccuracy={activeLesson.minAccuracy}
            layoutId={profile.preferredLayout}
            soundEnabled={profile.soundEnabled}
            showKeyboard={profile.showKeyboard}
            showHands={profile.showHands}
            onToggleSound={() => updatePreferences({ soundEnabled: !profile.soundEnabled })}
            onToggleKeyboard={() => updatePreferences({ showKeyboard: !profile.showKeyboard })}
            onToggleHands={() => updatePreferences({ showHands: !profile.showHands })}
            onComplete={(res) =>
              handleTypingComplete(res, activeLesson.id, `Lektion ${activeLesson.order}: ${activeLesson.title}`)
            }
            onBack={() => setActiveLesson(null)}
            hasNextLesson={Boolean(nextLesson)}
            onNextLesson={() => nextLesson && setActiveLesson(nextLesson)}
          />
        ) : activeTab === 'curriculum' ? (
          <CurriculumMap
            progressMap={lessonsProgress}
            unlockAll={unlockAll}
            onToggleUnlockAll={() => setUnlockAll((u) => !u)}
            onSelectLesson={(lesson) => setActiveLesson(lesson)}
          />
        ) : activeTab === 'adaptive' ? (
          <AdaptiveTrainer
            keyStats={keyStats}
            layoutId={profile.preferredLayout}
            soundEnabled={profile.soundEnabled}
            showKeyboard={profile.showKeyboard}
            showHands={profile.showHands}
            onToggleSound={() => updatePreferences({ soundEnabled: !profile.soundEnabled })}
            onToggleKeyboard={() => updatePreferences({ showKeyboard: !profile.showKeyboard })}
            onToggleHands={() => updatePreferences({ showHands: !profile.showHands })}
            onComplete={(res, label) => handleTypingComplete(res, 'adaptive', label)}
          />
        ) : activeTab === 'speed' ? (
          <SpeedTest
            layoutId={profile.preferredLayout}
            soundEnabled={profile.soundEnabled}
            showKeyboard={profile.showKeyboard}
            showHands={profile.showHands}
            onToggleSound={() => updatePreferences({ soundEnabled: !profile.soundEnabled })}
            onToggleKeyboard={() => updatePreferences({ showKeyboard: !profile.showKeyboard })}
            onToggleHands={() => updatePreferences({ showHands: !profile.showHands })}
            onComplete={(res, label) => handleTypingComplete(res, 'speed-test', label)}
          />
        ) : (
          <StatsDashboard profile={profile} keyStats={keyStats} sessions={sessions} />
        )}
      </main>

      {/* Legal Footer */}
      <footer className="border-t-2 border-stone-200 bg-white py-4 px-4 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} TippMeister — 10-Finger-System lernen (Schweiz / revDSG)
          </div>
          <div className="flex flex-wrap items-center gap-4 font-semibold">
            <button
              onClick={() => setLegalModalTab('privacy')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Datenschutzerklärung
            </button>
            <button
              onClick={() => setLegalModalTab('imprint')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Impressum
            </button>
            <button
              onClick={() => setLegalModalTab('data')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Daten exportieren / Konto löschen
            </button>
          </div>
        </div>
      </footer>

      {legalModalTab && (
        <LegalModal
          initialTab={legalModalTab}
          isAuthenticated={Boolean(firebaseUser)}
          onClose={() => setLegalModalTab(null)}
          onExportData={handleExportData}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      {!hasConsent && (
        <CookieConsentBanner
          onAccept={handleAcceptConsent}
          onOpenPrivacy={() => setLegalModalTab('privacy')}
        />
      )}
    </div>
  );
}

export default App;
