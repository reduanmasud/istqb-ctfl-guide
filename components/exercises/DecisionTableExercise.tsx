"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface DTRule {
  values: (boolean | null)[];
  action: string;
}

interface DTCase {
  title: string;
  conditions: string[];
  rules: DTRule[];
  explanation: string;
  answers: boolean[][];
}

interface Props {
  data: { cases: DTCase[] };
  onComplete: () => void;
}

export function DecisionTableExercise({ data, onComplete }: Props) {
  const cases = data.cases ?? [];
  const [caseIdx, setCaseIdx] = useState(0);
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);

  const current = cases[caseIdx];
  if (!current) return null;

  const cellKey = (ruleIdx: number, condIdx: number) =>
    `${ruleIdx}-${condIdx}`;

  const toggleCell = (ruleIdx: number, condIdx: number) => {
    if (checked) return;
    const original = current.rules[ruleIdx].values[condIdx];
    if (original !== null) return;
    const key = cellKey(ruleIdx, condIdx);
    setFilled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getCellValue = (ruleIdx: number, condIdx: number): boolean => {
    const original = current.rules[ruleIdx].values[condIdx];
    if (original !== null) return original;
    return filled[cellKey(ruleIdx, condIdx)] ?? false;
  };

  const isCellCorrect = (ruleIdx: number, condIdx: number): boolean => {
    return (
      getCellValue(ruleIdx, condIdx) === current.answers[ruleIdx][condIdx]
    );
  };

  const allBlanksFilled = current.rules.every((rule, rIdx) =>
    rule.values.every(
      (v, cIdx) => v !== null || filled[cellKey(rIdx, cIdx)] !== undefined
    )
  );

  const allCorrect =
    checked &&
    current.rules.every((rule, rIdx) =>
      rule.values.every((_, cIdx) => isCellCorrect(rIdx, cIdx))
    );

  const reset = () => {
    setFilled({});
    setChecked(false);
  };

  const goNext = () => {
    if (caseIdx < cases.length - 1) {
      setCaseIdx(caseIdx + 1);
      setFilled({});
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
          Decision Table · Case {caseIdx + 1}/{cases.length}
        </h3>
      </div>
      <p className="text-sm font-semibold text-slate-800 mb-1">{current.title}</p>
      <p className="text-xs text-slate-500 mb-4">
        Click each blank cell to toggle between T (true) and F (false).
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-blue-100 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left px-3 py-2 border-b border-blue-100 text-xs font-semibold text-slate-600">
                Condition
              </th>
              {current.rules.map((_, rIdx) => (
                <th
                  key={rIdx}
                  className="px-3 py-2 border-b border-blue-100 text-xs font-semibold text-blue-700"
                >
                  R{rIdx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.conditions.map((cond, cIdx) => (
              <tr key={cIdx}>
                <td className="px-3 py-2 border-b border-blue-50 text-xs text-slate-700">
                  {cond}
                </td>
                {current.rules.map((rule, rIdx) => {
                  const original = rule.values[cIdx];
                  const isBlank = original === null;
                  const value = getCellValue(rIdx, cIdx);
                  const wasFilled =
                    isBlank && filled[cellKey(rIdx, cIdx)] !== undefined;
                  const showResult = checked && isBlank && wasFilled;
                  const correctHere = showResult && isCellCorrect(rIdx, cIdx);
                  const wrongHere = showResult && !isCellCorrect(rIdx, cIdx);
                  return (
                    <td
                      key={rIdx}
                      className="px-3 py-2 border-b border-blue-50 text-center"
                    >
                      <button
                        type="button"
                        disabled={!isBlank || checked}
                        onClick={() => toggleCell(rIdx, cIdx)}
                        className={cn(
                          "w-10 h-8 rounded-md text-xs font-bold transition-colors",
                          !isBlank && "bg-slate-100 text-slate-700 cursor-default",
                          isBlank &&
                            !wasFilled &&
                            "border border-dashed border-blue-300 bg-white text-slate-400 hover:bg-blue-50",
                          isBlank &&
                            wasFilled &&
                            !showResult &&
                            "bg-blue-500 text-white",
                          correctHere && "bg-green-500 text-white",
                          wrongHere && "bg-red-500 text-white"
                        )}
                      >
                        {isBlank && !wasFilled ? "?" : value ? "T" : "F"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-amber-50">
              <td className="px-3 py-2 text-xs font-semibold text-slate-700">
                Action
              </td>
              {current.rules.map((rule, rIdx) => (
                <td
                  key={rIdx}
                  className="px-3 py-2 text-center text-xs font-medium text-amber-800"
                >
                  {rule.action}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
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
            disabled={!allBlanksFilled}
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
