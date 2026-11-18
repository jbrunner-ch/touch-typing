import React from 'react';
import { Award, BarChart3, Clock, Target, Zap } from 'lucide-react';
import { BADGES } from '../data/badges';
import { KeyStat, SessionRecord, UserProfile } from '../types/typing';

interface StatsDashboardProps {
  profile: UserProfile;
  keyStats: Record<string, KeyStat>;
  sessions: SessionRecord[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  profile,
  keyStats,
  sessions,
}) => {
  const keyEntries = Object.entries(keyStats)
    .filter(([ch]) => ch !== ' ' && ch.length === 1)
    .map(([ch, st]) => {
      const total = st.hits + st.misses;
      const accuracy = total > 0 ? Math.round((st.hits / total) * 100) : 100;
      const avgMs = st.hits > 0 ? Math.round(st.totalMs / st.hits) : 0;
      return { ch, hits: st.hits, misses: st.misses, total, accuracy, avgMs };
    })
    .sort((a, b) => a.accuracy - b.accuracy);

  const avgWpm =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, r) => s + r.wpm, 0) / sessions.length)
      : 0;
  const avgAcc =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, r) => s + r.accuracy, 0) / sessions.length)
      : 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Zap className="w-4 h-4 text-indigo-500" />
            Ø Tempo
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{avgWpm} WPM</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Target className="w-4 h-4 text-emerald-500" />
            Ø Genauigkeit
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{avgAcc}%</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            Anschläge gesamt
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {profile.totalKeystrokes.toLocaleString('de-CH')}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Award className="w-4 h-4 text-rose-500" />
            Abzeichen
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {profile.badges.length} / {BADGES.length}
          </div>
        </div>
      </div>

      {/* Key Heatmap */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-base">Tasten-Genauigkeit (Heatmap)</h3>
        {keyEntries.length === 0 ? (
          <p className="text-sm text-slate-500">
            Noch keine Tastendaten vorhanden. Schliesse deine erste Übung ab!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keyEntries.map((item) => {
              let colorClass = 'bg-emerald-50 border-emerald-200 text-emerald-800';
              if (item.accuracy < 85) {
                colorClass = 'bg-rose-50 border-rose-300 text-rose-800';
              } else if (item.accuracy < 94) {
                colorClass = 'bg-amber-50 border-amber-300 text-amber-800';
              }
              return (
                <div
                  key={item.ch}
                  className={`border rounded-xl px-3 py-2 text-center min-w-[64px] ${colorClass}`}
                >
                  <div className="font-mono-typing font-bold text-base">
                    {item.ch.toUpperCase()}
                  </div>
                  <div className="text-[11px] font-semibold">{item.accuracy}%</div>
                  <div className="text-[10px] opacity-70">{item.avgMs}ms</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-base">Abzeichen & Meilensteine</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const unlocked = profile.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-2xl p-3.5 border flex items-center gap-3 transition ${
                  unlocked
                    ? 'bg-white border-amber-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-55 grayscale'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-xl shrink-0 shadow-xs`}
                >
                  {b.icon}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{b.title}</div>
                  <div className="text-xs text-slate-500">{b.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Letzte Übungen
        </h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-500">Noch keine abgeschlossenen Übungen.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-100">
                  <th className="py-2 font-semibold">Übung</th>
                  <th className="py-2 font-semibold">WPM</th>
                  <th className="py-2 font-semibold">Genauigkeit</th>
                  <th className="py-2 font-semibold">XP</th>
                  <th className="py-2 font-semibold">Datum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((s, idx) => (
                  <tr key={s.id ?? idx} className="hover:bg-slate-50">
                    <td className="py-2.5 font-medium text-slate-800">{s.lessonTitle}</td>
                    <td className="py-2.5 font-bold text-indigo-600">{s.wpm}</td>
                    <td className="py-2.5 font-semibold text-emerald-600">{s.accuracy}%</td>
                    <td className="py-2.5 text-amber-600 font-semibold">+{s.xpEarned} XP</td>
                    <td className="py-2.5 text-xs text-slate-400">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString('de-CH') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
