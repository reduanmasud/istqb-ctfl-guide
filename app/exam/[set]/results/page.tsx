"use client";
import { useEffect, useState, use } from "react";
import { Header } from "@/components/layout/Header";
import { loadProgress, isGuideComplete } from "@/lib/progress";
import { getAllLoIds } from "@/lib/content";
import chaptersData from "@/content/chapters.json";
import type {
  ExamAttempt,
  ExamQuestion,
  ChapterMeta,
  ExamSet,
} from "@/lib/types";
import { cn } from "@/lib/cn";
import Link from "next/link";
import {
  Trophy,
  XCircle,
  CheckCircle2,
  BarChart2,
  RefreshCw,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { CTFL_PASS_THRESHOLD, CT_AI_GUIDE_URL } from "@/lib/config";

import setA from "@/content/exams/set-a.json";
import setB from "@/content/exams/set-b.json";
import setC from "@/content/exams/set-c.json";
import setD from "@/content/exams/set-d.json";

const SET_DATA: Record<ExamSet, ExamQuestion[]> = {
  a: setA as ExamQuestion[],
  b: setB as ExamQuestion[],
  c: setC as ExamQuestion[],
  d: setD as ExamQuestion[],
};

const chapters = chaptersData as ChapterMeta[];

export default function ExamSetResultsPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set: rawSet } = use(params);
  const set = rawSet.toLowerCase() as ExamSet;
  const questions = SET_DATA[set];

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [guideDone, setGuideDone] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastAttempt");
    if (raw) {
      const parsed = JSON.parse(raw) as ExamAttempt;
      if (parsed.set === set) {
        setAttempt(parsed);
        setGuideDone(isGuideComplete(getAllLoIds()));
        return;
      }
    }
    const p = loadProgress();
    const lastForSet = [...p.examAttempts].reverse().find((a) => a.set === set);
    if (lastForSet) setAttempt(lastForSet);
    setGuideDone(isGuideComplete(getAllLoIds()));
  }, [set]);

  if (!questions) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-8 text-center">
          <p className="text-slate-500">
            Unknown set.{" "}
            <Link href="/exam" className="text-blue-600 underline">
              Back to exam hub
            </Link>
            .
          </p>
        </main>
      </>
    );
  }

  if (!attempt) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-8 text-center">
          <p className="text-slate-500">
            No exam results found for Set {set.toUpperCase()}.{" "}
            <Link href={`/exam/${set}`} className="text-blue-600 underline">
              Take Set {set.toUpperCase()}
            </Link>
            .
          </p>
        </main>
      </>
    );
  }

  const pct = Math.round((attempt.score / attempt.maxScore) * 100);
  const passed = attempt.score >= CTFL_PASS_THRESHOLD;
  const timeMin = Math.floor(attempt.timeSpent / 60);
  const timeSec = attempt.timeSpent % 60;

  const chapterStats = chapters.map((ch) => {
    const chQs = questions.filter((q) => q.chapter === ch.id);
    const correct = chQs.filter((q) => {
      const given = attempt.answers[q.id];
      if (given === undefined) return false;
      const corr = Array.isArray(q.correct) ? q.correct : [q.correct];
      const gArr = Array.isArray(given) ? given : [given];
      return corr.length === gArr.length && gArr.every((g) => corr.includes(g));
    });
    return {
      chapter: ch,
      total: chQs.length,
      correct: correct.length,
      pct: chQs.length > 0 ? Math.round((correct.length / chQs.length) * 100) : 0,
    };
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {guideDone && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-green-600 shrink-0" />
              <div>
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

        <div
          className={cn(
            "rounded-2xl border p-8 text-center mb-8 shadow-sm",
            passed
              ? "border-green-200 bg-gradient-to-b from-green-50 to-white"
              : "border-red-200 bg-gradient-to-b from-red-50 to-white"
          )}
        >
          {passed ? (
            <Trophy className="h-14 w-14 text-amber-500 mx-auto mb-4" />
          ) : (
            <XCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
          )}
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
            Set {set.toUpperCase()}
          </p>
          <h1
            className={cn(
              "text-5xl font-bold mb-1",
              passed ? "text-green-600" : "text-red-600"
            )}
          >
            {pct}%
          </h1>
          <p className="text-slate-500 mb-2 font-medium">
            {attempt.score}/{attempt.maxScore} points
          </p>
          <p
            className={cn(
              "text-lg font-bold mb-4",
              passed ? "text-green-700" : "text-slate-700"
            )}
          >
            {passed
              ? `🎉 PASS — You met the ${CTFL_PASS_THRESHOLD}/${attempt.maxScore} threshold!`
              : "Keep studying — you'll get there!"}
          </p>
          <p className="text-xs text-slate-400">
            Time: {timeMin}m {timeSec}s ·{" "}
            {new Date(attempt.date).toLocaleDateString()}
          </p>
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-blue-600" /> Chapter Breakdown
        </h2>
        <div className="flex flex-col gap-3 mb-8">
          {chapterStats.map(
            ({ chapter, total, correct, pct: cPct }) =>
              total > 0 && (
                <div
                  key={chapter.id}
                  className="rounded-xl border border-blue-100 bg-white shadow-sm p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-mono text-slate-400">
                        Ch {chapter.id}
                      </span>
                      <span className="ml-2 text-sm font-medium text-slate-700">
                        {chapter.title}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        cPct >= 65 ? "text-green-600" : "text-red-500"
                      )}
                    >
                      {correct}/{total} ({cPct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-blue-100">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        cPct >= 65 ? "bg-green-500" : "bg-red-400"
                      )}
                      style={{ width: `${cPct}%` }}
                    />
                  </div>
                  {cPct < 65 && (
                    <Link
                      href={`/chapter/${chapter.id}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
                    >
                      <BookOpen className="h-3 w-3" /> Review this chapter
                    </Link>
                  )}
                </div>
              )
          )}
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-4">Question Review</h2>
        <div className="flex flex-col gap-3 mb-8">
          {questions.map((q) => {
            const given = attempt.answers[q.id];
            const corr = Array.isArray(q.correct) ? q.correct : [q.correct];
            const gArr =
              given !== undefined ? (Array.isArray(given) ? given : [given]) : [];
            const isCorrect =
              given !== undefined &&
              corr.length === gArr.length &&
              gArr.every((g) => corr.includes(g));
            const skipped = given === undefined;

            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-xl border p-4 text-sm",
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                )}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">
                        Q{q.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        {q.loRef} · Ch{q.chapter}
                      </span>
                      {skipped && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                          Skipped
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed mb-2 line-clamp-2">
                      {q.stem}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-700">
                          Explanation:{" "}
                        </span>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/exam/${set}`}
            className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Retake Set {set.toUpperCase()}
          </Link>
          <Link
            href="/exam"
            className="rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Try another set
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
