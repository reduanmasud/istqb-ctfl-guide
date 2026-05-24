"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type {
  ExamQuestion,
  ExamAttempt,
  ExamSet,
  ExamSetResult,
} from "@/lib/types";
import { recordExamAttempt, saveExamSetResult } from "@/lib/progress";
import { CTFL_EXAM_DURATION_SEC, CTFL_PASS_THRESHOLD } from "@/lib/config";

export function useExam(questions: ExamQuestion[], set: ExamSet) {
  const [answers, setAnswers] = useState<Record<number, number | number[]>>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CTFL_EXAM_DURATION_SEC);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (Object.keys(answers).length > 0 && !timerActive && !submitted) {
      setTimerActive(true);
    }
  }, [answers, timerActive, submitted]);

  useEffect(() => {
    if (timerActive && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, submitted]);

  const answer = useCallback(
    (questionId: number, value: number | number[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const computeScore = useCallback(
    (givenAnswers: Record<number, number | number[]>) =>
      questions.reduce((total, q) => {
        const given = givenAnswers[q.id];
        if (given === undefined) return total;
        const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
        const givenArr = Array.isArray(given) ? given : [given];
        const isCorrect =
          correct.length === givenArr.length &&
          givenArr.every((g) => correct.includes(g));
        return total + (isCorrect ? q.points : 0);
      }, 0),
    [questions]
  );

  const submit = useCallback((): {
    attempt: ExamAttempt;
    result: ExamSetResult;
  } => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);

    const score = computeScore(answers);
    const maxScore = questions.reduce((t, q) => t + q.points, 0);

    const attempt: ExamAttempt = {
      date: new Date().toISOString(),
      score,
      maxScore,
      answers,
      timeSpent: CTFL_EXAM_DURATION_SEC - timeLeft,
      set,
    };
    recordExamAttempt(attempt);

    const result: ExamSetResult = {
      set,
      score,
      total: maxScore,
      passed: score >= CTFL_PASS_THRESHOLD,
      completedAt: attempt.date,
    };
    saveExamSetResult(result);

    return { attempt, result };
  }, [answers, computeScore, questions, set, timeLeft]);

  const score = submitted ? computeScore(answers) : null;
  const maxScore = questions.reduce((t, q) => t + q.points, 0);

  return {
    answers,
    answer,
    submitted,
    submit,
    timeLeft,
    timerActive,
    score,
    maxScore,
  };
}
