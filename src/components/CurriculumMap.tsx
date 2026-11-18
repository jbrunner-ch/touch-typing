import React from 'react';
import { CheckCircle2, Lock, Play, Star, Unlock } from 'lucide-react';
import { CURRICULUM, WORLDS } from '../data/curriculum';
import { Lesson, LessonProgress } from '../types/typing';

interface CurriculumMapProps {
  progressMap: Record<string, LessonProgress>;
  unlockAll: boolean;
  onToggleUnlockAll: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}

export const CurriculumMap: React.FC<CurriculumMapProps> = ({
  progressMap,
  unlockAll,
  onToggleUnlockAll,
  onSelectLesson,
}) => {
  const totalStars = Object.values(progressMap).reduce((sum, p) => sum + (p.stars || 0), 0);
  const maxStars = CURRICULUM.length * 3;
  const completedCount = Object.values(progressMap).filter((p) => p.stars > 0).length;

  const isUnlocked = (lesson: Lesson, idx: number): boolean => {
    if (unlockAll || idx === 0) return true;
    const prevLesson = CURRICULUM[idx - 1];
    const prevProgress = progressMap[prevLesson.id];
    return Boolean(prevProgress && prevProgress.stars > 0) || Boolean(progressMap[lesson.id]?.stars);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            Strukturiertes 10-Finger-Curriculum
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dein Weg zum blinden Tippen
          </h1>
          <p className="text-indigo-100 text-sm mt-1">
            {completedCount} von {CURRICULUM.length} Lektionen gemeistert • {totalStars} / {maxStars} Sterne
          </p>
        </div>
        <button
          onClick={onToggleUnlockAll}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
        >
          {unlockAll ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          {unlockAll ? 'Sequenziell sperren' : 'Alle Lektionen freischalten'}
        </button>
      </div>

      {/* Worlds */}
      <div className="space-y-8">
        {WORLDS.map((world) => {
          const worldLessons = CURRICULUM.filter((l) => l.worldId === world.id);
          return (
            <section key={world.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${world.color} text-white flex items-center justify-center font-bold text-lg shadow-sm`}
                >
                  {world.badge}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">{world.title}</h2>
                  <p className="text-xs text-slate-500">
                    {worldLessons.filter((l) => (progressMap[l.id]?.stars ?? 0) > 0).length} /{' '}
                    {worldLessons.length} abgeschlossen
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {worldLessons.map((lesson) => {
                  const globalIdx = CURRICULUM.findIndex((l) => l.id === lesson.id);
                  const unlocked = isUnlocked(lesson, globalIdx);
                  const prog = progressMap[lesson.id];
                  const stars = prog?.stars ?? 0;

                  return (
                    <button
                      key={lesson.id}
                      disabled={!unlocked}
                      onClick={() => onSelectLesson(lesson)}
                      className={`group text-left rounded-2xl p-4 border transition-all duration-150 ${
                        unlocked
                          ? 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer'
                          : 'bg-slate-100/80 border-slate-200/70 opacity-65 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          Lektion {lesson.order}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= stars
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200 fill-slate-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lesson.subtitle}</p>

                      {lesson.newKeys.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {lesson.newKeys.map((k) => (
                            <span
                              key={k}
                              className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono-typing text-xs font-semibold border border-indigo-100"
                            >
                              {k === ' ' ? 'Space' : k}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        {prog ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Best: {prog.bestWpm} WPM ({prog.bestAccuracy}%)
                          </span>
                        ) : (
                          <span className="text-slate-400">Ziel: {lesson.targetWpm} WPM</span>
                        )}

                        {unlocked ? (
                          <span className="inline-flex items-center gap-1 text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Start
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
