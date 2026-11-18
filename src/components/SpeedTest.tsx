import React, { useMemo, useState } from 'react';
import { Gauge, RefreshCw } from 'lucide-react';
import { ADAPTIVE_WORD_POOL } from '../data/curriculum';
import { KeyboardLayoutId, TypingResult } from '../types/typing';
import { TypingArena } from './TypingArena';

interface SpeedTestProps {
  layoutId: KeyboardLayoutId;
  soundEnabled: boolean;
  showKeyboard: boolean;
  showHands: boolean;
  onToggleSound: () => void;
  onToggleKeyboard: () => void;
  onToggleHands: () => void;
  onComplete: (result: TypingResult, label: string) => Promise<string[]>;
}

export const SpeedTest: React.FC<SpeedTestProps> = ({
  layoutId,
  soundEnabled,
  showKeyboard,
  showHands,
  onToggleSound,
  onToggleKeyboard,
  onToggleHands,
  onComplete,
}) => {
  const [wordCount, setWordCount] = useState<15 | 30 | 50>(30);
  const [seed, setSeed] = useState(1);

  const testText = useMemo(() => {
    const lang = layoutId === 'en-qwerty' ? 'en' : 'de';
    let pool = ADAPTIVE_WORD_POOL[lang];
    if (layoutId === 'ch-qwertz') {
      pool = pool.map((w) => w.replace(/ß/g, 'ss'));
    }

    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      const idx = Math.floor(((Math.sin(seed * 131 + i * 53) + 1) / 2) * pool.length);
      words.push(pool[idx % pool.length]);
    }
    return words.join(' ');
  }, [wordCount, layoutId, seed]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
          <Gauge className="w-5 h-5" />
          Freier Speed-Test
        </div>

        <div className="flex items-center gap-2">
          {([15, 30, 50] as const).map((cnt) => (
            <button
              key={cnt}
              onClick={() => {
                setWordCount(cnt);
                setSeed((s) => s + 1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                wordCount === cnt
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cnt} Wörter
            </button>
          ))}
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Neuer Text
          </button>
        </div>
      </div>

      <TypingArena
        title={`Speed-Test (${wordCount} Wörter)`}
        subtitle="Miss deine echte Schreibgeschwindigkeit und Präzision"
        text={testText}
        targetWpm={45}
        minAccuracy={90}
        layoutId={layoutId}
        soundEnabled={soundEnabled}
        showKeyboard={showKeyboard}
        showHands={showHands}
        onToggleSound={onToggleSound}
        onToggleKeyboard={onToggleKeyboard}
        onToggleHands={onToggleHands}
        onComplete={(res) => onComplete(res, `Speed-Test (${wordCount} Wörter)`)}
      />
    </div>
  );
};
