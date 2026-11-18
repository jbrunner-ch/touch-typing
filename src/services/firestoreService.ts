import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { deleteUser, User } from 'firebase/auth';
import { db } from '../firebase/config';
import {
  KeyboardLayoutId,
  KeyStat,
  LessonProgress,
  SessionRecord,
  UserProfile,
} from '../types/typing';

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getOrCreateUserProfile(
  user: User,
  defaultLayout: KeyboardLayoutId = 'de-qwertz'
): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    return {
      uid: user.uid,
      displayName: data.displayName ?? user.displayName ?? null,
      email: data.email ?? user.email ?? null,
      photoURL: data.photoURL ?? user.photoURL ?? null,
      xp: Number(data.xp ?? 0),
      level: Number(data.level ?? 1),
      streak: Number(data.streak ?? 0),
      lastPracticeDate: String(data.lastPracticeDate ?? ''),
      preferredLayout: (data.preferredLayout as KeyboardLayoutId) || defaultLayout,
      soundEnabled: data.soundEnabled ?? true,
      showKeyboard: data.showKeyboard ?? true,
      showHands: data.showHands ?? true,
      privacyConsentAt: String(data.privacyConsentAt ?? new Date().toISOString()),
      totalLessonsCompleted: Number(data.totalLessonsCompleted ?? 0),
      totalKeystrokes: Number(data.totalKeystrokes ?? 0),
      badges: Array.isArray(data.badges) ? data.badges : [],
    };
  }

  const nowIso = new Date().toISOString();
  const initialProfile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName ?? null,
    email: user.email ?? null,
    photoURL: user.photoURL ?? null,
    xp: 0,
    level: 1,
    streak: 0,
    lastPracticeDate: '',
    preferredLayout: defaultLayout,
    soundEnabled: true,
    showKeyboard: true,
    showHands: true,
    privacyConsentAt: nowIso,
    totalLessonsCompleted: 0,
    totalKeystrokes: 0,
    badges: [],
  };

  await setDoc(userRef, {
    ...initialProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return initialProfile;
}

export async function updateUserProfileFields(
  uid: string,
  fields: Partial<Omit<UserProfile, 'uid'>>
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

export async function loadAllLessonProgress(uid: string): Promise<Record<string, LessonProgress>> {
  const lessonsRef = collection(db, 'users', uid, 'lessons');
  const snap = await getDocs(lessonsRef);
  const result: Record<string, LessonProgress> = {};
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    result[docSnap.id] = {
      lessonId: String(d.lessonId ?? docSnap.id),
      stars: Number(d.stars ?? 0),
      bestWpm: Number(d.bestWpm ?? 0),
      bestCpm: Number(d.bestCpm ?? 0),
      bestAccuracy: Number(d.bestAccuracy ?? 0),
      attempts: Number(d.attempts ?? 1),
      lastPlayedAt: String(d.lastPlayedAt ?? ''),
    };
  });
  return result;
}

export async function saveLessonProgress(uid: string, progress: LessonProgress): Promise<void> {
  const ref = doc(db, 'users', uid, 'lessons', progress.lessonId);
  await setDoc(ref, {
    lessonId: progress.lessonId,
    stars: Math.min(3, Math.max(0, Math.round(progress.stars))),
    bestWpm: Math.max(0, Math.round(progress.bestWpm)),
    bestCpm: Math.max(0, Math.round(progress.bestCpm)),
    bestAccuracy: Math.min(100, Math.max(0, Number(progress.bestAccuracy.toFixed(1)))),
    attempts: Math.max(1, Math.round(progress.attempts)),
    lastPlayedAt: progress.lastPlayedAt,
  });
}

export async function loadKeyStats(uid: string): Promise<Record<string, KeyStat>> {
  const ref = doc(db, 'users', uid, 'stats', 'keys');
  const snap = await getDoc(ref);
  if (!snap.exists()) return {};
  const data = snap.data();
  return (data.keys as Record<string, KeyStat>) || {};
}

export async function saveKeyStats(uid: string, keys: Record<string, KeyStat>): Promise<void> {
  const ref = doc(db, 'users', uid, 'stats', 'keys');
  // Limit map size to <= 180 keys to stay well within Firestore rules limit of 200
  const entries = Object.entries(keys).slice(0, 180);
  const trimmed = Object.fromEntries(entries);
  await setDoc(ref, {
    keys: trimmed,
    updatedAt: serverTimestamp(),
  });
}

export async function loadRecentSessions(uid: string, maxCount = 25): Promise<SessionRecord[]> {
  const sessionsRef = collection(db, 'users', uid, 'sessions');
  const q = query(sessionsRef, orderBy('createdAt', 'desc'), limit(maxCount));
  const snap = await getDocs(q);
  const list: SessionRecord[] = [];
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    list.push({
      id: docSnap.id,
      lessonId: String(d.lessonId ?? ''),
      lessonTitle: String(d.lessonTitle ?? ''),
      wpm: Number(d.wpm ?? 0),
      cpm: Number(d.cpm ?? 0),
      accuracy: Number(d.accuracy ?? 0),
      xpEarned: Number(d.xpEarned ?? 0),
      stars: Number(d.stars ?? 0),
      durationSec: Number(d.durationSec ?? 0),
      createdAt: String(d.createdAt ?? ''),
    });
  });
  return list;
}

export async function recordSession(uid: string, session: Omit<SessionRecord, 'id'>): Promise<string> {
  const sessionsRef = collection(db, 'users', uid, 'sessions');
  const newDoc = doc(sessionsRef);
  await setDoc(newDoc, {
    lessonId: session.lessonId,
    lessonTitle: session.lessonTitle.slice(0, 120),
    wpm: Math.max(0, Math.round(session.wpm)),
    cpm: Math.max(0, Math.round(session.cpm)),
    accuracy: Math.min(100, Math.max(0, Number(session.accuracy.toFixed(1)))),
    xpEarned: Math.max(0, Math.round(session.xpEarned)),
    stars: Math.min(3, Math.max(0, Math.round(session.stars))),
    durationSec: Math.max(0, Math.round(session.durationSec)),
    createdAt: session.createdAt,
  });
  return newDoc.id;
}

export async function exportAllUserData(uid: string): Promise<Record<string, unknown>> {
  const [profileSnap, lessons, keyStats, sessions] = await Promise.all([
    getDoc(doc(db, 'users', uid)),
    loadAllLessonProgress(uid),
    loadKeyStats(uid),
    loadRecentSessions(uid, 200),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    profile: profileSnap.exists() ? profileSnap.data() : null,
    lessons,
    keyStats,
    sessions,
  };
}

export async function deleteAllUserDataAndAccount(user: User): Promise<void> {
  const uid = user.uid;

  // Delete subcollections in batches
  const subcollections = ['lessons', 'stats', 'sessions'];
  for (const sub of subcollections) {
    const colRef = collection(db, 'users', uid, sub);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }

  // Delete main profile document
  await deleteDoc(doc(db, 'users', uid));

  // Delete Firebase Auth account
  await deleteUser(user);
}
