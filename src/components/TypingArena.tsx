import React, { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
  Hand,
  RotateCcw,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { KeyboardLayoutId, KeyStat, TypingResult } from '../types/typing';
import { calculateStars } from '../data/badges';
import { playErrorSound, playKeyClick, playSuccessFanfare } from '../utils/sound';
import { VirtualKeyboard } from './VirtualKeyboard';
import { HandGuide } from './HandGuide';

interface TypingArenaProps {
  title: string;
  subtitle: string;
  text: string;
  targetWpm: number;
  minAccuracy: number;
  layoutId: KeyboardLayoutId;
  soundEnabled: boolean;
  showKeyboard: boolean;
  showHands: boolean;
  onToggleSound: () => void;
  onToggleKeyboard: () => void;
  onToggleHands: () => void;
  onComplete: (result: TypingResult) => Promise<string[]> | string[];
  onBack?: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  title,
  subtitle,
  text,
  targetWpm,
  minAccuracy,
  layoutId,
  soundEnabled,
  showKeyboard,
  showHands,
  onToggleSound,
  onToggleKeyboard,
  onToggleHands,
  onComplete,
  onBack,
  onNextLesson,
  hasNextLesson,
}) => {
  const [cursor, setCursor] = useState(0);
  const [hadErrorAtCurrent, setHadErrorAtCurrent] = useState(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [pressedCode, setPressedCode] = useState<string | null>(null);
  const [lastPressCorrect, setLastPressCorrect] = useState<boolean | null>(null);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const lastKeyTimeRef = useRef<number | null>(null);
  const keyStatsRef = useRef<Record<string, KeyStat>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const resetSession = useCallback(() => {
    setCursor(0);
    setHadErrorAtCurrent(false);
    setTotalKeystrokes(0);
    setTotalErrors(0);
    setCombo(0);
    setMaxCombo(0);
    setStartTime(null);
    setNow(Date.now());
    setPressedCode(null);
    setLastPressCorrect(null);
    setResult(null);
    setNewBadges([]);
    lastKeyTimeRef.current = null;
    keyStatsRef.current = {};
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    resetSession();
  }, [text, resetSession]);

  // Live timer
  useEffect(() => {
    if (!startTime || result) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [startTime, result]);

  const finishSession = useCallback(
    async (finalTotalKeys: number, finalErrors: number, endTs: number) => {
      const startTs = startTime ?? endTs - 1000;
      const durationSec = Math.max(1, (endTs - startTs) / 1000);
      const minutes = durationSec / 60;
      const cpm = Math.round(text.length / minutes);
      const wpm = Math.round(text.length / 5 / minutes);
      const accuracy =
        finalTotalKeys > 0
          ? Math.max(0, Math.min(100, ((finalTotalKeys - finalErrors) / finalTotalKeys) * 100))
          : 100;

      const { stars, passed } = calculateStars(wpm, accuracy, targetWpm, minAccuracy);
      const baseXp = passed ? 40 + stars * 25 : 15;
      const speedBonus = passed ? Math.min(50, Math.round(wpm * 0.5)) : 0;
      const xpEarned = baseXp + speedBonus;

      const typingResult: TypingResult = {
        wpm,
        cpm,
        accuracy: Number(accuracy.toFixed(1)),
        errors: finalErrors,
        totalChars: text.length,
        durationSec: Math.round(durationSec),
        stars,
        passed,
        xpEarned,
        keyStatsDelta: { ...keyStatsRef.current },
      };

      setResult(typingResult);

      if (passed) {
        playSuccessFanfare(soundEnabled);
        confetti({
          particleCount: stars === 3 ? 90 : 45,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      const unlocked = await onComplete(typingResult);
      if (Array.isArray(unlocked)) {
        setNewBadges(unlocked);
      }
    },
    [startTime, text.length, targetWpm, minAccuracy, soundEnabled, onComplete]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (result) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const ignored = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'Dead'];
      if (ignored.includes(e.key)) return;

      // Prevent spacebar scrolling
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
      }

      const expectedChar = text[cursor];
      if (!expectedChar) return;

      const currentTs = Date.now();
      if (!startTime) {
        setStartTime(currentTs);
      }

      const deltaMs = lastKeyTimeRef.current ? Math.min(3000, currentTs - lastKeyTimeRef.current) : 300;
      lastKeyTimeRef.current = currentTs;

      const statKey = expectedChar.toLowerCase();
      if (!keyStatsRef.current[statKey]) {
        keyStatsRef.current[statKey] = { hits: 0, misses: 0, totalMs: 0 };
      }

      setPressedCode(e.code);
      window.setTimeout(() => setPressedCode(null), 140);

      const newTotalKeys = totalKeystrokes + 1;
      setTotalKeystrokes(newTotalKeys);

      if (e.key === expectedChar) {
        playKeyClick(soundEnabled);
        setLastPressCorrect(true);
        setHadErrorAtCurrent(false);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);

        keyStatsRef.current[statKey].hits += 1;
        keyStatsRef.current[statKey].totalMs += deltaMs;

        const nextCursor = cursor + 1;
        setCursor(nextCursor);

        if (nextCursor >= text.length) {
          finishSession(newTotalKeys, totalErrors, currentTs);
        }
      } else {
        playErrorSound(soundEnabled);
        setLastPressCorrect(false);
        setHadErrorAtCurrent(true);
        setCombo(0);
        setTotalErrors((prev) => prev + 1);
        keyStatsRef.current[statKey].misses += 1;

        setShakeTrigger(true);
        window.setTimeout(() => setShakeTrigger(false), 280);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    cursor,
    text,
    result,
    startTime,
    totalKeystrokes,
    totalErrors,
    combo,
    maxCombo,
    soundEnabled,
    finishSession,
  ]);

  // Live metrics
  const elapsedMin = startTime ? Math.max(0.03, (now - startTime) / 60000) : 0;
  const liveWpm = elapsedMin > 0 ? Math.round(cursor / 5 / elapsedMin) : 0;
  const liveCpm = elapsedMin > 0 ? Math.round(cursor / elapsedMin) : 0;
  const liveAccuracy =
    totalKeystrokes > 0
      ? Math.max(0, Math.round(((totalKeystrokes - totalErrors) / totalKeystrokes) * 100))
      : 100;
  const progressPct = Math.round((cursor / text.length) * 100);
  const targetChar = cursor < text.length ? text[cursor] : null;

  return (
    <div ref={containerRef} tabIndex={-1} className="outline-none space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border-2 border-stone-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 transition cursor-pointer"
              title="Zurück zur Übersicht"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="font-extrabold text-stone-900 text-base sm:text-lg leading-tight">{title}</h2>
            <p className="text-xs text-stone-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-stone-50 border-stone-200 text-stone-500'
            }`}
            title="Tipp-Sound umschalten"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleHands}
            className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              showHands
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-stone-50 border-stone-200 text-stone-500'
            }`}
            title="Finger-Guide umschalten"
          >
            <Hand className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleKeyboard}
            className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              showKeyboard
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-stone-50 border-stone-200 text-stone-500'
            }`}
            title="Virtuelle Tastatur umschalten"
          >
            {showKeyboard ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">Tastatur</span>
          </button>
          <button
            onClick={resetSession}
            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 transition cursor-pointer"
            title="Neu starten"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Metrics Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border-2 border-stone-200 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Tempo</div>
          <div className="text-lg sm:text-2xl font-extrabold text-blue-600">
            {liveWpm} <span className="text-xs font-bold text-stone-400">WPM</span>
          </div>
          <div className="text-[10px] text-stone-400">{liveCpm} Zeichen/Min</div>
        </div>

        <div className="bg-white border-2 border-stone-200 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Genauigkeit</div>
          <div
            className={`text-lg sm:text-2xl font-extrabold ${
              liveAccuracy >= minAccuracy ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {liveAccuracy}%
          </div>
          <div className="text-[10px] text-stone-400">Ziel: ≥ {minAccuracy}%</div>
        </div>

        <div className="bg-white border-2 border-stone-200 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Combo</div>
          <div className="text-lg sm:text-2xl font-extrabold text-orange-500 flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            {combo}
          </div>
          <div className="text-[10px] text-stone-400">Rekord: {maxCombo}</div>
        </div>

        <div className="bg-white border-2 border-stone-200 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Fortschritt</div>
          <div className="text-lg sm:text-2xl font-extrabold text-stone-800">{progressPct}%</div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-1 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-150"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Text Prompt Box */}
      <div
        className={`relative bg-white border-2 border-b-4 rounded-2xl p-5 sm:p-7 transition-colors ${
          hadErrorAtCurrent ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
        } ${shakeTrigger ? 'animate-shake' : ''}`}
      >
        {!startTime && (
          <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold">
            Finger auf A S D F — J K L Ö legen und einfach lostippen
          </div>
        )}

        <div className="font-mono-typing text-xl sm:text-2xl leading-relaxed tracking-wide break-words select-none">
          {text.split('').map((char, idx) => {
            const isTyped = idx < cursor;
            const isCurrent = idx === cursor;
            const displayChar = char === ' ' ? '\u00A0' : char;

            if (isTyped) {
              return (
                <span key={idx} className="text-emerald-700 bg-emerald-50 rounded-xs">
                  {displayChar}
                </span>
              );
            }
            if (isCurrent) {
              return (
                <span
                  key={idx}
                  className={`relative rounded px-0.5 font-bold underline decoration-2 underline-offset-4 ${
                    hadErrorAtCurrent
                      ? 'bg-red-600 text-white decoration-red-200'
                      : 'bg-blue-600 text-white decoration-blue-200'
                  }`}
                >
                  {char === ' ' ? '␣' : char}
                </span>
              );
            }
            return (
              <span key={idx} className="text-stone-400">
                {displayChar}
              </span>
            );
          })}
        </div>
      </div>

      {/* Hand Guide & Virtual Keyboard */}
      {showHands && <HandGuide layoutId={layoutId} targetChar={targetChar} />}
      {showKeyboard && (
        <VirtualKeyboard
          layoutId={layoutId}
          targetChar={targetChar}
          pressedCode={pressedCode}
          lastPressCorrect={lastPressCorrect}
        />
      )}

      {/* Results Modal */}
      {result && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-pop-in text-center space-y-5">
            {/* Stars */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-11 h-11 transition-transform ${
                    s <= result.stars
                      ? 'text-amber-400 fill-amber-400 drop-shadow-sm scale-110'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {result.passed ? 'Grossartig gemacht!' : 'Fast geschafft!'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {result.passed
                  ? `Du hast ${result.xpEarned} XP gesammelt.`
                  : `Für das Bestehen brauchst du mindestens ${minAccuracy}% Genauigkeit.`}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-4">
              <div>
                <div className="text-xs text-slate-500">WPM</div>
                <div className="text-xl font-extrabold text-indigo-600">{result.wpm}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Genauigkeit</div>
                <div className="text-xl font-extrabold text-emerald-600">{result.accuracy}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Fehler</div>
                <div className="text-xl font-extrabold text-rose-500">{result.errors}</div>
              </div>
            </div>

            {newBadges.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-left">
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                  🎉 Neues Abzeichen freigeschaltet!
                </div>
                <div className="text-sm font-semibold text-amber-900">{newBadges.join(', ')}</div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={resetSession}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-stone-200 hover:bg-stone-50 font-bold text-stone-700 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Nochmal
              </button>
              {result.passed && hasNextLesson && onNextLesson ? (
                <button
                  onClick={onNextLesson}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 border-b-4 border-blue-800 text-white font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  Nächste Lektion
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                onBack && (
                  <button
                    onClick={onBack}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 border-b-4 border-blue-800 text-white font-bold transition cursor-pointer"
                  >
                    Zur Übersicht
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
