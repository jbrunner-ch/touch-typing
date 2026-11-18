import React, { useMemo, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { ADAPTIVE_WORD_POOL } from '../data/curriculum';
import { KeyboardLayoutId, KeyStat, TypingResult } from '../types/typing';
import { TypingArena } from './TypingArena';

interface AdaptiveTrainerProps {
  keyStats: Record<string, KeyStat>;
  layoutId: KeyboardLayoutId;
  soundEnabled: boolean;
  showKeyboard: boolean;
  showHands: boolean;
  onToggleSound: () => void;
  onToggleKeyboard: () => void;
  onToggleHands: () => void;
  onComplete: (result: TypingResult, label: string) => Promise<string[]>;
}

export const AdaptiveTrainer: React.FC<AdaptiveTrainerProps> = ({
  keyStats,
  layoutId,
  soundEnabled,
  showKeyboard,
  showHands,
  onToggleSound,
  onToggleKeyboard,
  onToggleHands,
  onComplete,
}) => {
  const [seed, setSeed] = useState(0);

  const weakKeys = useMemo(() => {
    const entries = Object.entries(keyStats)
      .filter(([ch]) => /^[a-zäöüß]$/i.test(ch))
      .map(([ch, st]) => {
        const total = st.hits + st.misses;
        const errorRate = total > 0 ? st.misses / total : 0;
        const avgMs = st.hits > 0 ? st.totalMs / st.hits : 300;
        const score = errorRate * 100 + avgMs / 40;
        return { ch, errorRate, avgMs, score, total };
      })
      .sort((a, b) => b.score - a.score);

    return entries.slice(0, 5);
  }, [keyStats]);

  const drillText = useMemo(() => {
    const lang = layoutId === 'en-qwerty' ? 'en' : 'de';
    let pool = ADAPTIVE_WORD_POOL[lang];
    if (layoutId === 'ch-qwertz') {
      pool = pool.map((w) => w.replace(/ß/g, 'ss'));
    }

    const targets = weakKeys.map((w) => w.ch.toLowerCase());
    const prioritized =
      targets.length > 0
        ? pool.filter((word) => targets.some((t) => word.includes(t)))
        : pool;

    const source = prioritized.length >= 15 ? prioritized : pool;
    const chosen: string[] = [];
    for (let i = 0; i < 18; i++) {
      const idx = Math.floor(((Math.sin(seed * 97 + i * 31) + 1) / 2) * source.length);
      chosen.push(source[idx % source.length]);
    }
    return chosen.join(' ');
  }, [weakKeys, layoutId, seed]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            Adaptives Fehler-Training (wie Keybr & Tipp10)
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {weakKeys.length > 0
              ? 'Deine Übung wird dynamisch aus deinen aktuell schwächsten Tasten generiert:'
              : 'Absolviere zuerst 1–2 Übungen, damit wir deine schwächsten Tasten erkennen können. Bis dahin trainierst du häufige Wörter.'}
          </p>
          {weakKeys.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {weakKeys.map((wk) => (
                <span
                  key={wk.ch}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-mono-typing"
                >
                  {wk.ch.toUpperCase()}
                  <span className="text-[10px] font-normal text-rose-600">
                    {Math.round(wk.errorRate * 100)}% Fehler
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setSeed((s) => s + 1)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Neue Wörter generieren
        </button>
      </div>

      <TypingArena
        title="Adaptiver Drill"
        subtitle="Gezieltes Training deiner schwachen Tasten für maximales Muskelgedächtnis"
        text={drillText}
        targetWpm={35}
        minAccuracy={92}
        layoutId={layoutId}
        soundEnabled={soundEnabled}
        showKeyboard={showKeyboard}
        showHands={showHands}
        onToggleSound={onToggleSound}
        onToggleKeyboard={onToggleKeyboard}
        onToggleHands={onToggleHands}
        onComplete={(res) => onComplete(res, 'Adaptiver Drill')}
      />
    </div>
  );
};
