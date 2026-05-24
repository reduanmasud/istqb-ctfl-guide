"use client";
import type { ExerciseData } from "@/lib/types";
import { ConfusionMatrixExercise } from "@/components/exercises/ConfusionMatrixExercise";
import { WorkflowSequencer } from "@/components/exercises/WorkflowSequencer";
import { RedTeamingPrompter } from "@/components/exercises/RedTeamingPrompter";
import { DatasetConstraintTester } from "@/components/exercises/DatasetConstraintTester";
import { MetamorphicWorkshop } from "@/components/exercises/MetamorphicWorkshop";
import { EdaExplorer } from "@/components/exercises/EdaExplorer";
import { EPTableExercise } from "@/components/exercises/EPTableExercise";
import { BVAExercise } from "@/components/exercises/BVAExercise";
import { DecisionTableExercise } from "@/components/exercises/DecisionTableExercise";

interface Props {
  exercise: ExerciseData;
  onComplete: () => void;
}

export function ExerciseShell({ exercise, onComplete }: Props) {
  const { type, ...rest } = exercise;

  switch (type) {
    case "confusion-matrix":
      return (
        <ConfusionMatrixExercise
          data={rest as { TP: number; TN: number; FP: number; FN: number }}
          onComplete={onComplete}
        />
      );
    case "workflow-sequencer":
      return (
        <WorkflowSequencer
          data={rest as { stages: string[] }}
          onComplete={onComplete}
        />
      );
    case "red-teaming":
      return (
        <RedTeamingPrompter
          data={
            rest as {
              scenarios: Array<{
                prompt: string;
                risk: string;
                category: string;
              }>;
            }
          }
          onComplete={onComplete}
        />
      );
    case "dataset-constraint":
      return (
        <DatasetConstraintTester
          data={rest as { [key: string]: unknown }}
          onComplete={onComplete}
        />
      );
    case "metamorphic":
      return (
        <MetamorphicWorkshop
          data={rest as { [key: string]: unknown }}
          onComplete={onComplete}
        />
      );
    case "eda-explorer":
      return (
        <EdaExplorer
          data={rest as { [key: string]: unknown }}
          onComplete={onComplete}
        />
      );
    case "ep-table":
      return (
        <EPTableExercise
          data={rest as never}
          onComplete={onComplete}
        />
      );
    case "bva":
      return (
        <BVAExercise
          data={rest as never}
          onComplete={onComplete}
        />
      );
    case "decision-table":
      return (
        <DecisionTableExercise
          data={rest as never}
          onComplete={onComplete}
        />
      );
    default:
      return null;
  }
}
