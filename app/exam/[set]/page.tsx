import { ExamRunnerClient } from "@/components/exam/ExamRunnerClient";

export function generateStaticParams() {
  return [{ set: "a" }, { set: "b" }, { set: "c" }, { set: "d" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  return <ExamRunnerClient set={set} />;
}
