"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Markdown } from "@/components/Markdown";
import type { Quiz } from "@/lib/types";

interface Props {
  quiz: Quiz;
  onComplete: (correct: boolean) => void;
}

export function QuizQuestion({ quiz, onComplete }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const isMulti = quiz.multiSelect ?? false;
  const correctAnswers = isMulti
    ? (quiz.correctMulti ?? [quiz.correct as number])
    : [quiz.correct as number];

  const toggle = (idx: number) => {
    if (submitted) return;
    if (isMulti) {
      setSelected((prev) =>
        prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]
      );
    } else {
      setSelected([idx]);
    }
  };

  const submit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);
    const isCorrect =
      selected.length === correctAnswers.length &&
      selected.every((s) => correctAnswers.includes(s));
    onComplete(isCorrect);
  };

  const getOptionState = (idx: number) => {
    if (!submitted) {
      return selected.includes(idx) ? "selected" : "idle";
    }
    const isCorrect = correctAnswers.includes(idx);
    const wasSelected = selected.includes(idx);
    if (isCorrect) return "correct";
    if (wasSelected && !isCorrect) return "wrong";
    return "idle";
  };

  const allCorrect =
    submitted &&
    selected.length === correctAnswers.length &&
    selected.every((s) => correctAnswers.includes(s));

  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
          {isMulti ? "Select TWO" : "Quick Check"}
        </span>
      </div>
      <div className="text-slate-800 leading-relaxed mb-4">
        <Markdown variant="inline">{quiz.question}</Markdown>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        {quiz.options.map((opt, idx) => {
          const state = getOptionState(idx);
          return (
            <button
              key={idx}
              onClick={() => toggle(idx)}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all",
                state === "idle" &&
                  "border-blue-100 text-slate-700 hover:border-blue-300 hover:bg-blue-50",
                state === "selected" &&
                  "border-blue-500 bg-blue-50 text-slate-800",
                state === "correct" &&
                  "border-green-400 bg-green-50 text-green-800",
                state === "wrong" &&
                  "border-red-400 bg-red-50 text-red-800"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                  state === "idle" && "border-blue-200 text-slate-500",
                  state === "selected" &&
                    "border-blue-500 bg-blue-500 text-white",
                  state === "correct" &&
                    "border-green-500 bg-green-500 text-white",
                  state === "wrong" && "border-red-500 bg-red-500 text-white"
                )}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="leading-relaxed">
                <Markdown variant="inline">{opt}</Markdown>
              </span>
              {state === "correct" && (
                <CheckCircle2 className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              )}
              {state === "wrong" && (
                <XCircle className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={submit}
          disabled={selected.length === 0}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer <ChevronRight className="h-4 w-4" />
        </button>
      ) : (
        <div
          className={cn(
            "rounded-lg p-4 text-sm",
            allCorrect
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-orange-50 border border-orange-200 text-orange-800"
          )}
        >
          <p className="font-semibold mb-1">
            {allCorrect ? "✓ Correct!" : "✗ Not quite"}
          </p>
          <div className="text-slate-600 text-xs leading-relaxed">
            <Markdown>{quiz.explanation}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
