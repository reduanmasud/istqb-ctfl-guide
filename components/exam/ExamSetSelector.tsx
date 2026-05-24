"use client";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ExamSet, ExamSetResult } from "@/lib/types";
import { CheckCircle2, XCircle, Play, RotateCcw } from "lucide-react";
import { CTFL_PASS_THRESHOLD, CTFL_TOTAL_QUESTIONS } from "@/lib/config";

interface Props {
  results: Record<ExamSet, ExamSetResult | null>;
}

const SETS: { id: ExamSet; label: string; color: string }[] = [
  { id: "a", label: "Set A — Official Sample Exam (ISTQB)", color: "blue" },
  { id: "b", label: "Set B — Official Sample Exam (ISTQB)", color: "purple" },
  { id: "c", label: "Set C — Practice Exam", color: "green" },
  { id: "d", label: "Set D — Practice Exam", color: "orange" },
  { id: "e", label: "Set E — Practice Exam", color: "teal" },
  { id: "f", label: "Set F — Practice Exam", color: "rose" },
];

const accentMap: Record<string, { border: string; bar: string; text: string }> =
  {
    blue: { border: "border-blue-200", bar: "bg-blue-500", text: "text-blue-700" },
    purple: {
      border: "border-purple-200",
      bar: "bg-purple-500",
      text: "text-purple-700",
    },
    green: {
      border: "border-green-200",
      bar: "bg-green-500",
      text: "text-green-700",
    },
    orange: {
      border: "border-orange-200",
      bar: "bg-orange-500",
      text: "text-orange-700",
    },
    teal: {
      border: "border-teal-200",
      bar: "bg-teal-500",
      text: "text-teal-700",
    },
    rose: {
      border: "border-rose-200",
      bar: "bg-rose-500",
      text: "text-rose-700",
    },
  };

export function ExamSetSelector({ results }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {SETS.map(({ id, label, color }) => {
        const result = results[id];
        const accent = accentMap[color];
        const pct = result ? Math.round((result.score / result.total) * 100) : 0;
        return (
          <div
            key={id}
            className={cn(
              "rounded-xl border bg-white shadow-sm p-5 flex flex-col gap-3",
              accent.border
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn("h-8 w-1 rounded-full shrink-0", accent.bar)}
              />
              <div>
                <h3 className={cn("text-lg font-bold", accent.text)}>{label}</h3>
                <p className="text-xs text-slate-500">
                  {CTFL_TOTAL_QUESTIONS} questions · 60 min · Pass:{" "}
                  {CTFL_PASS_THRESHOLD}/{CTFL_TOTAL_QUESTIONS}
                </p>
              </div>
            </div>

            {result ? (
              <div
                className={cn(
                  "rounded-lg border px-3 py-2 flex items-center gap-2",
                  result.passed
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                )}
              >
                {result.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
                <span
                  className={cn(
                    "text-xs font-semibold",
                    result.passed ? "text-green-700" : "text-red-600"
                  )}
                >
                  {result.passed ? "Passed" : "Failed"} · {result.score}/
                  {result.total} ({pct}%)
                </span>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/40 px-3 py-2 text-xs text-slate-500">
                Not attempted yet
              </div>
            )}

            <Link
              href={`/exam/${id}`}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                result
                  ? "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {result ? (
                <>
                  <RotateCcw className="h-4 w-4" /> Retake
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Start
                </>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
