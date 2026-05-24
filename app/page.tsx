"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ChapterCard } from "@/components/dashboard/ChapterCard";
import { chapters, getAllLoIds } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import { isGuideComplete, bestExamSetScore } from "@/lib/progress";
import { CT_AI_GUIDE_URL, CTFL_TOTAL_LOS } from "@/lib/config";
import { BookOpen, Target, Trophy, Zap, GraduationCap } from "lucide-react";

const allLoIds = getAllLoIds();

export default function Dashboard() {
  const { progress, overallPct, readinessPct, getChapterProgress } =
    useProgress(allLoIds);

  const [guideDone, setGuideDone] = useState(false);
  const [bestSet, setBestSet] = useState<{ pct: number; passed: boolean }>({
    pct: 0,
    passed: false,
  });

  useEffect(() => {
    setGuideDone(isGuideComplete(allLoIds));
    const best = bestExamSetScore();
    setBestSet({ pct: best.pct, passed: best.passed });
  }, [progress]);

  const bestScore = bestSet.pct > 0 ? `${bestSet.pct}%` : "—";

  const stats = [
    {
      icon: BookOpen,
      label: "Progress",
      value: `${overallPct}%`,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Target,
      label: "Quiz Accuracy",
      value: `${readinessPct}%`,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Trophy,
      label: "Exam Attempts",
      value: progress.examAttempts.length,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: Zap,
      label: "Best Score",
      value: bestScore,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {guideDone && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <GraduationCap className="h-8 w-8 text-green-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-green-700">
                  🎓 CTFL Complete — You&apos;re ready for CT-AI!
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  You&apos;ve passed all learning objectives and at least one mock exam.
                </p>
              </div>
            </div>
            <a
              href={CT_AI_GUIDE_URL}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors shrink-0"
            >
              Start CT-AI Guide →
            </a>
          </div>
        )}

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700 border border-blue-200 mb-3 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            ISTQB CTFL v4.0 — Foundation Level certification
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            CTFL v4.0 Study Guide
          </h1>
          <p className="mt-2 text-slate-500">
            6 chapters · {CTFL_TOTAL_LOS} learning objectives · 4 mock exam sets · Practice-first approach
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
            <div
              key={label}
              className="rounded-xl border border-blue-100 bg-white shadow-sm p-4"
            >
              <div className={`inline-flex rounded-lg p-2 mb-2 ${iconBg}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="mb-8 rounded-xl border border-blue-100 bg-white shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">
              Overall Progress
            </span>
            <span className="text-sm text-slate-500">
              {overallPct}% complete
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-green-500 transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="mt-3 flex gap-4 text-xs text-slate-500">
            <span>
              {progress.completedLessons.length}/{allLoIds.length} lessons
              complete
            </span>
            <span>·</span>
            <span>Pass at least one mock exam set (26/40) to finish</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/exam"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Take a Mock Exam
          </Link>
          <Link
            href="/glossary"
            className="rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Browse Glossary
          </Link>
        </div>

        {/* Chapters grid */}
        <h2 className="text-lg font-bold text-slate-800 mb-4">Chapters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => {
            const { completed, total } = getChapterProgress(
              chapter.id,
              chapter.loIds
            );
            return (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                completed={completed}
                total={total}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}
