"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { ExamSetSelector } from "@/components/exam/ExamSetSelector";
import { getAllExamSetResults } from "@/lib/progress";
import type { ExamSet, ExamSetResult } from "@/lib/types";
import { CTFL_PASS_THRESHOLD, CTFL_TOTAL_QUESTIONS } from "@/lib/config";

export default function ExamHubPage() {
  const [results, setResults] = useState<Record<ExamSet, ExamSetResult | null>>({
    a: null,
    b: null,
    c: null,
    d: null,
  });

  useEffect(() => {
    setResults(getAllExamSetResults());
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Mock Exam Sets</h1>
          <p className="mt-1 text-sm text-slate-500">
            CTFL v4.0 · {CTFL_TOTAL_QUESTIONS} questions per set · 60 min ·
            Pass: {CTFL_PASS_THRESHOLD}/{CTFL_TOTAL_QUESTIONS} (65%). Take any
            set in any order — passing at least one marks the guide complete.
          </p>
        </div>
        <ExamSetSelector results={results} />
      </main>
    </>
  );
}
