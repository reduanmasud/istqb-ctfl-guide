// ── Core content types ────────────────────────────────────────────────────────

export type KLevel = "K1" | "K2" | "K3" | "K4";
export type HLevel = "H0" | "H1" | "H2";
export type ExerciseType =
  | "confusion-matrix"
  | "workflow-sequencer"
  | "red-teaming"
  | "dataset-constraint"
  | "metamorphic"
  | "eda-explorer"
  | "ep-table"
  | "bva"
  | "decision-table"
  | "none";

export interface QuizOption {
  text: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  multiSelect?: boolean;
  correctMulti?: number[];
}

export interface ExerciseData {
  type: ExerciseType;
  [key: string]: unknown;
}

export interface Lesson {
  id: string;
  chapter: number;
  section: string;
  kLevel: KLevel | HLevel;
  title: string;
  concept: string;
  keyPoints: string[];
  quiz: Quiz;
  exercise: ExerciseData;
}

export interface ChapterMeta {
  id: number;
  title: string;
  duration: number;
  color: string;
  description: string;
  loIds: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  chapter: number;
  relatedLo?: string;
}

// ── Exam types ────────────────────────────────────────────────────────────────

export interface ExamQuestion {
  id: number;
  points: number;
  loRef: string;
  chapter: number;
  stem: string;
  options: string[];
  correct: number | number[];
  multiSelect?: boolean;
  explanation: string;
}

export type ExamSet = "a" | "b" | "c" | "d" | "e" | "f";

export interface ExamSetResult {
  set: ExamSet;
  score: number;
  total: number;
  passed: boolean;
  completedAt: string;
}

// ── Progress types ────────────────────────────────────────────────────────────

export interface ExamAttempt {
  date: string;
  score: number;
  maxScore: number;
  answers: Record<number, number | number[]>;
  timeSpent: number;
  set?: ExamSet;
}

export interface Progress {
  completedLessons: string[];
  quizAnswers: Record<string, number | number[]>;
  quizCorrect: Record<string, boolean>;
  examAttempts: ExamAttempt[];
  examSetResults: Partial<Record<ExamSet, ExamSetResult>>;
  lastVisited: string;
}
