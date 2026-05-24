"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import type { ExamQuestion, ExamSet } from "@/lib/types";
import { useExam } from "@/hooks/useExam";
import { cn } from "@/lib/cn";
import { Clock, AlertCircle, Send } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import {
  CTFL_PASS_THRESHOLD,
  CTFL_TOTAL_QUESTIONS,
  CTFL_EXAM_DURATION_SEC,
} from "@/lib/config";

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

const VALID_SETS: ExamSet[] = ["a", "b", "c", "d"];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ExamSetRunnerPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set: rawSet } = use(params);
  const setParam = rawSet.toLowerCase() as ExamSet;
  const router = useRouter();

  const [validated, setValidated] = useState<ExamSet | null>(null);

  useEffect(() => {
    if (!VALID_SETS.includes(setParam)) {
      router.replace("/exam");
    } else {
      setValidated(setParam);
    }
  }, [setParam, router]);

  if (!validated) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <p className="text-slate-500">Loading…</p>
        </main>
      </>
    );
  }

  return <ExamRunner set={validated} questions={SET_DATA[validated]} />;
}

function ExamRunner({
  set,
  questions,
}: {
  set: ExamSet;
  questions: ExamQuestion[];
}) {
  const router = useRouter();
  const { answers, answer, submitted, submit, timeLeft, timerActive, maxScore } =
    useExam(questions, set);
  const [currentQ, setCurrentQ] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isMulti = q?.multiSelect ?? false;
  const qAnswer = q ? answers[q.id] : undefined;
  const selectedArr: number[] =
    qAnswer === undefined ? [] : Array.isArray(qAnswer) ? qAnswer : [qAnswer];

  if (!q) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <p className="text-slate-500">No questions available for this set.</p>
        </main>
      </>
    );
  }

  const toggleOption = (idx: number) => {
    if (submitted) return;
    if (isMulti) {
      const curr = Array.isArray(answers[q.id]) ? (answers[q.id] as number[]) : [];
      const updated = curr.includes(idx)
        ? curr.filter((x) => x !== idx)
        : [...curr, idx];
      answer(q.id, updated);
    } else {
      answer(q.id, idx);
      setTimeout(() => {
        if (currentQ < questions.length - 1) setCurrentQ((c) => c + 1);
      }, 300);
    }
  };

  const handleSubmit = () => {
    const { attempt, result } = submit();
    sessionStorage.setItem("lastAttempt", JSON.stringify(attempt));
    sessionStorage.setItem("lastResult", JSON.stringify(result));
    router.push(`/exam/${set}/results`);
  };

  const getOptionState = (
    idx: number
  ): "idle" | "selected" | "correct" | "wrong" => {
    if (!submitted) return selectedArr.includes(idx) ? "selected" : "idle";
    const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
    if (correct.includes(idx)) return "correct";
    if (selectedArr.includes(idx)) return "wrong";
    return "idle";
  };

  const setLabel = set.toUpperCase();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Mock Exam · Set {setLabel}
            </h1>
            <p className="text-sm text-slate-500">
              CTFL v4.0 · {CTFL_TOTAL_QUESTIONS} questions · {maxScore} points ·
              Pass: {CTFL_PASS_THRESHOLD}/{CTFL_TOTAL_QUESTIONS} (65%)
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-mono font-semibold",
              timeLeft < 600
                ? "border-red-200 text-red-600 bg-red-50"
                : "border-blue-200 text-blue-700 bg-blue-50"
            )}
          >
            <Clock className="h-4 w-4" />
            {timerActive
              ? formatTime(timeLeft)
              : formatTime(CTFL_EXAM_DURATION_SEC)}
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 shrink-0 font-medium">
            {currentQ + 1}/{questions.length}
          </span>
        </div>

        <div className="mb-6 flex flex-wrap gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={cn(
                "h-7 w-7 rounded-md text-[10px] font-bold transition-colors",
                i === currentQ
                  ? "bg-blue-600 text-white shadow-sm"
                  : answers[questions[i].id] !== undefined
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-white text-slate-500 border border-blue-100 hover:bg-blue-50"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-blue-100 bg-white shadow-sm p-6 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-mono text-blue-600">
              Q{q.id} · {q.points}pt · {q.loRef} · Ch{q.chapter}
            </span>
            {isMulti && (
              <span className="rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                Select TWO
              </span>
            )}
          </div>

          <div className="text-slate-800 leading-relaxed mb-5">
            <Markdown variant="inline">{q.stem}</Markdown>
          </div>

          <div className="flex flex-col gap-2">
            {q.options.map((opt, idx) => {
              const state = getOptionState(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleOption(idx)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3.5 text-left text-sm transition-all",
                    state === "idle" &&
                      "border-blue-100 text-slate-700 hover:border-blue-300 hover:bg-blue-50",
                    state === "selected" && "border-blue-500 bg-blue-50 text-slate-800",
                    state === "correct" && "border-green-400 bg-green-50 text-green-800",
                    state === "wrong" && "border-red-400 bg-red-50 text-red-800"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                      state === "idle" && "border-blue-200 text-slate-500",
                      state === "selected" && "border-blue-500 bg-blue-500 text-white",
                      state === "correct" && "border-green-500 bg-green-500 text-white",
                      state === "wrong" && "border-red-500 bg-red-500 text-white"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">
                    <Markdown variant="inline">{opt}</Markdown>
                  </span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className="mt-4 rounded-lg p-3 text-xs bg-blue-50 border border-blue-200 text-slate-700">
              <span className="font-bold text-blue-700 block mb-1">Explanation</span>
              <Markdown>{q.explanation}</Markdown>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
            disabled={currentQ === 0}
            className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <span className="text-xs text-slate-500 font-medium">
            {answeredCount}/{questions.length} answered
          </span>

          {currentQ < questions.length - 1 ? (
            <button
              onClick={() =>
                setCurrentQ((c) => Math.min(questions.length - 1, c + 1))
              }
              className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Next →
            </button>
          ) : (
            !submitted && (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" /> Submit Exam
              </button>
            )
          )}
        </div>

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="rounded-xl border border-blue-100 bg-white shadow-2xl p-6 max-w-sm w-full mx-4">
              <AlertCircle className="h-8 w-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Submit Set {setLabel}?</h3>
              <p className="text-sm text-slate-500 mb-5">
                {answeredCount < questions.length
                  ? `You have ${questions.length - answeredCount} unanswered questions.`
                  : "All questions answered. Ready to submit?"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-blue-200 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
