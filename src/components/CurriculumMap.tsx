import React from 'react';
import { ArrowRight, CheckCircle2, Lock, Play, Star, Unlock } from 'lucide-react';
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
  const progressPct = Math.round((completedCount / CURRICULUM.length) * 100);

  const isUnlocked = (lesson: Lesson, idx: number): boolean => {
    if (unlockAll || idx === 0) return true;
    const prevLesson = CURRICULUM[idx - 1];
    const prevProgress = progressMap[prevLesson.id];
    return Boolean(prevProgress && prevProgress.stars > 0) || Boolean(progressMap[lesson.id]?.stars);
  };

  const nextOpenLesson =
    CURRICULUM.find((l, idx) => isUnlocked(l, idx) && (progressMap[l.id]?.stars ?? 0) === 0) ||
    CURRICULUM[0];

  return (
    <div className="space-y-8">
      {/* Clean Editorial Hero Card */}
      <div className="bg-white border-2 border-stone-200 border-b-4 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <span>Lernpfad</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">
              {completedCount} / {CURRICULUM.length} Lektionen ({progressPct}%)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Blind schreiben mit 10 Fingern
          </h1>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 max-w-xs h-2.5 bg-stone-100 border border-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {totalStars} / {maxStars}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onToggleUnlockAll}
            className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {unlockAll ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {unlockAll ? 'Nur freigeschaltete' : 'Alle freischalten'}
          </button>

          <button
            onClick={() => onSelectLesson(nextOpenLesson)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 border-b-4 border-blue-800 active:border-b-0 active:translate-y-0.5 text-white text-sm font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <span>Lektion {nextOpenLesson.order} starten</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Worlds */}
      <div className="space-y-8">
        {WORLDS.map((world) => {
          const worldLessons = CURRICULUM.filter((l) => l.worldId === world.id);
          const worldDone = worldLessons.filter((l) => (progressMap[l.id]?.stars ?? 0) > 0).length;

          return (
            <section key={world.id} className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-stone-200 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-extrabold text-stone-900">{world.title}</span>
                </div>
                <span className="text-xs font-bold text-stone-500">
                  {worldDone} / {worldLessons.length} gemeistert
                </span>
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
                      className={`group text-left rounded-xl p-4 border-2 transition-all duration-100 ${
                        unlocked
                          ? 'bg-white border-stone-200 border-b-4 hover:border-blue-500 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                          : 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                          Lektion {lesson.order}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= stars
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-stone-200 fill-stone-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="font-bold text-stone-900 group-hover:text-blue-700 transition">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">{lesson.subtitle}</p>

                      {lesson.newKeys.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {lesson.newKeys.map((k) => (
                            <span
                              key={k}
                              className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono-typing text-xs font-bold border border-stone-300 border-b-2"
                            >
                              {k === ' ' ? 'Space' : k}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                        {prog ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {prog.bestWpm} WPM ({prog.bestAccuracy}%)
                          </span>
                        ) : (
                          <span className="text-stone-400 font-medium">Ziel: {lesson.targetWpm} WPM</span>
                        )}

                        {unlocked ? (
                          <span className="inline-flex items-center gap-1 text-blue-600 font-bold">
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Üben
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-stone-400" />
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
