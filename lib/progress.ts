import type { Progress, ExamAttempt, ExamSet, ExamSetResult } from "./types";
import { CTFL_PASS_THRESHOLD } from "./config";

const STORAGE_KEY = "ctfl_progress";

const defaultProgress = (): Progress => ({
  completedLessons: [],
  quizAnswers: {},
  quizCorrect: {},
  examAttempts: [],
  examSetResults: {},
  lastVisited: "/",
});

export function loadProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function markLessonComplete(loId: string): void {
  const p = loadProgress();
  if (!p.completedLessons.includes(loId)) {
    p.completedLessons = [...p.completedLessons, loId];
    saveProgress(p);
  }
}

export function recordQuizAnswer(
  loId: string,
  answer: number | number[],
  correct: boolean
): void {
  const p = loadProgress();
  p.quizAnswers = { ...p.quizAnswers, [loId]: answer };
  p.quizCorrect = { ...p.quizCorrect, [loId]: correct };
  saveProgress(p);
}

export function recordExamAttempt(attempt: ExamAttempt): void {
  const p = loadProgress();
  p.examAttempts = [...p.examAttempts, attempt];
  saveProgress(p);
}

export function saveExamSetResult(result: ExamSetResult): void {
  const p = loadProgress();
  p.examSetResults = { ...p.examSetResults, [result.set]: result };
  saveProgress(p);
}

export function getExamSetResult(set: ExamSet): ExamSetResult | null {
  const p = loadProgress();
  return p.examSetResults[set] ?? null;
}

export function getAllExamSetResults(): Record<ExamSet, ExamSetResult | null> {
  const p = loadProgress();
  return {
    a: p.examSetResults.a ?? null,
    b: p.examSetResults.b ?? null,
    c: p.examSetResults.c ?? null,
    d: p.examSetResults.d ?? null,
    e: p.examSetResults.e ?? null,
    f: p.examSetResults.f ?? null,
  };
}

export function isGuideComplete(allLoIds: string[]): boolean {
  const p = loadProgress();
  const allLessonsDone = allLoIds.every((id) =>
    p.completedLessons.includes(id)
  );
  const anySetPassed = Object.values(p.examSetResults).some(
    (r) => r && r.passed
  );
  return allLessonsDone && anySetPassed;
}

export function setLastVisited(route: string): void {
  const p = loadProgress();
  p.lastVisited = route;
  saveProgress(p);
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ── Derived stats ─────────────────────────────────────────────────────────────

export function chapterProgress(
  chapterId: number,
  loIds: string[]
): { completed: number; total: number; pct: number } {
  void chapterId;
  const p = loadProgress();
  const completed = loIds.filter((id) =>
    p.completedLessons.includes(id)
  ).length;
  return {
    completed,
    total: loIds.length,
    pct: loIds.length === 0 ? 0 : Math.round((completed / loIds.length) * 100),
  };
}

export function overallProgress(allLoIds: string[]): number {
  const p = loadProgress();
  const done = allLoIds.filter((id) => p.completedLessons.includes(id)).length;
  return allLoIds.length === 0
    ? 0
    : Math.round((done / allLoIds.length) * 100);
}

export function examReadiness(allLoIds: string[]): number {
  const p = loadProgress();
  const correct = allLoIds.filter((id) => p.quizCorrect[id] === true).length;
  return allLoIds.length === 0
    ? 0
    : Math.round((correct / allLoIds.length) * 100);
}

export function bestExamSetScore(): {
  pct: number;
  passed: boolean;
  set: ExamSet | null;
} {
  const results = Object.values(loadProgress().examSetResults).filter(
    (r): r is ExamSetResult => Boolean(r)
  );
  if (results.length === 0) return { pct: 0, passed: false, set: null };
  const best = results.reduce((acc, r) =>
    r.score / r.total > acc.score / acc.total ? r : acc
  );
  return {
    pct: Math.round((best.score / best.total) * 100),
    passed: best.score >= CTFL_PASS_THRESHOLD,
    set: best.set,
  };
}
