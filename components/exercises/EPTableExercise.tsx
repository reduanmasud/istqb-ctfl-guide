"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { CheckCircle2, XCircle } from "lucide-react";

interface EPCase {
  description: string;
  values: string[];
  validIndices: number[];
  explanation: string;
}

interface Props {
  data: { cases: EPCase[] };
  onComplete: () => void;
}

type Choice = "valid" | "invalid" | null;

export function EPTableExercise({ data, onComplete }: Props) {
  const cases = data.cases ?? [];
  const [caseIdx, setCaseIdx] = useState(0);
  const [choices, setChoices] = useState<Choice[]>(() =>
    Array(cases[0]?.values.length ?? 0).fill(null)
  );
  const [checked, setChecked] = useState(false);

  const current = cases[caseIdx];
  if (!current) return null;

  const setChoice = (idx: number, value: Choice) => {
    if (checked) return;
    const next = [...choices];
    next[idx] = value;
    setChoices(next);
  };

  const isCellCorrect = (idx: number): boolean => {
    const expectedValid = current.validIndices.includes(idx);
    const givenValid = choices[idx] === "valid";
    return expectedValid === givenValid && choices[idx] !== null;
  };

  const allFilled = choices.every((c) => c !== null);
  const allCorrect = checked && choices.every((_, i) => isCellCorrect(i));

  const reset = () => {
    setChoices(Array(current.values.length).fill(null));
    setChecked(false);
  };

  const goNext = () => {
    if (caseIdx < cases.length - 1) {
      const nextIdx = caseIdx + 1;
      setCaseIdx(nextIdx);
      setChoices(Array(cases[nextIdx].values.length).fill(null));
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
          Equivalence Partitioning · Case {caseIdx + 1}/{cases.length}
        </h3>
      </div>
      <p className="text-sm text-slate-700 mb-4 leading-relaxed">
        <span className="font-semibold">Specification: </span>
        {current.description}
      </p>

      <div className="flex flex-col gap-2 mb-5">
        {current.values.map((value, idx) => {
          const choice = choices[idx];
          const showResult = checked;
          const correctHere = showResult && isCellCorrect(idx);
          const wrongHere = showResult && !isCellCorrect(idx);
          return (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-sm",
                !showResult && "border-blue-100 bg-white",
                correctHere && "border-green-300 bg-green-50",
                wrongHere && "border-red-300 bg-red-50"
              )}
            >
              <span className="font-mono font-bold text-slate-800 w-20 shrink-0">
                {value}
              </span>
              <div className="flex gap-2 flex-1">
                <button
                  type="button"
                  disabled={checked}
                  onClick={() => setChoice(idx, "valid")}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                    choice === "valid"
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-blue-200 bg-white text-slate-600 hover:bg-blue-50",
                    checked && "cursor-not-allowed opacity-70"
                  )}
                >
                  Valid
                </button>
                <button
                  type="button"
                  disabled={checked}
                  onClick={() => setChoice(idx, "invalid")}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                    choice === "invalid"
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-blue-200 bg-white text-slate-600 hover:bg-blue-50",
                    checked && "cursor-not-allowed opacity-70"
                  )}
                >
                  Invalid
                </button>
              </div>
              {correctHere && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              )}
              {wrongHere && (
                <XCircle className="h-4 w-4 shrink-0 text-red-500" />
              )}
            </div>
          );
        })}
      </div>

      {checked && (
        <div
          className={cn(
            "rounded-lg p-3 mb-4 text-xs leading-relaxed",
            allCorrect
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-amber-50 border border-amber-200 text-amber-800"
          )}
        >
          <span className="font-bold">
            {allCorrect ? "Correct! " : "Not quite. "}
          </span>
          {current.explanation}
        </div>
      )}

      <div className="flex gap-3">
        {!checked && (
          <button
            type="button"
            disabled={!allFilled}
            onClick={() => setChecked(true)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check
          </button>
        )}
        {checked && !allCorrect && (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Try Again
          </button>
        )}
        {checked && allCorrect && (
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
