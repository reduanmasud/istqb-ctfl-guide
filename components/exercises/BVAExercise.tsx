"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { CheckCircle2, XCircle } from "lucide-react";

interface BVACase {
  rangeDescription: string;
  candidates: string[];
  boundaryIndices: number[];
  explanation: string;
}

interface Props {
  data: { cases: BVACase[] };
  onComplete: () => void;
}

export function BVAExercise({ data, onComplete }: Props) {
  const cases = data.cases ?? [];
  const [caseIdx, setCaseIdx] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);

  const current = cases[caseIdx];
  if (!current) return null;

  const toggle = (idx: number) => {
    if (checked) return;
    const next = new Set(selected);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelected(next);
  };

  const expected = new Set(current.boundaryIndices);
  const isCorrect =
    selected.size === expected.size &&
    [...selected].every((i) => expected.has(i));

  const reset = () => {
    setSelected(new Set());
    setChecked(false);
  };

  const goNext = () => {
    if (caseIdx < cases.length - 1) {
      setCaseIdx(caseIdx + 1);
      setSelected(new Set());
      setChecked(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-sm p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-5 w-1 rounded-full bg-blue-500 shrink-0" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Boundary Value Analysis · Case {caseIdx + 1}/{cases.length}
        </h3>
      </div>
      <p className="text-sm text-slate-700 mb-4 leading-relaxed">
        <span className="font-semibold">Specification: </span>
        {current.rangeDescription}
      </p>
      <p className="text-xs text-slate-500 mb-3">
        Click each value that is a boundary value.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {current.candidates.map((value, idx) => {
          const isPicked = selected.has(idx);
          const isExpected = expected.has(idx);
          const showResult = checked;
          const correctPicked = showResult && isPicked && isExpected;
          const wrongPicked = showResult && isPicked && !isExpected;
          const missedExpected = showResult && !isPicked && isExpected;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggle(idx)}
              disabled={checked}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-mono font-bold transition-all flex items-center gap-1.5",
                !showResult &&
                  !isPicked &&
                  "border-blue-200 bg-white text-slate-700 hover:bg-blue-50",
                !showResult &&
                  isPicked &&
                  "border-blue-500 bg-blue-500 text-white",
                correctPicked && "border-green-500 bg-green-500 text-white",
                wrongPicked && "border-red-500 bg-red-500 text-white",
                missedExpected &&
                  "border-amber-400 bg-amber-50 text-amber-700",
                checked && "cursor-not-allowed"
              )}
            >
              {value}
              {correctPicked && <CheckCircle2 className="h-3.5 w-3.5" />}
              {wrongPicked && <XCircle className="h-3.5 w-3.5" />}
            </button>
          );
        })}
      </div>

      {checked && (
        <div
          className={cn(
            "rounded-lg p-3 mb-4 text-xs leading-relaxed",
            isCorrect
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-amber-50 border border-amber-200 text-amber-800"
          )}
        >
          <span className="font-bold">
            {isCorrect ? "Correct! " : "Not quite. "}
          </span>
          {current.explanation}
        </div>
      )}

      <div className="flex gap-3">
        {!checked && (
          <button
            type="button"
            disabled={selected.size === 0}
            onClick={() => setChecked(true)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check
          </button>
        )}
        {checked && !isCorrect && (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Try Again
          </button>
        )}
        {checked && isCorrect && (
          <button
            type="button"
            onClick={goNext}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            {caseIdx < cases.length - 1 ? "Next Case →" : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}
