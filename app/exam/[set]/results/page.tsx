import { ExamResultsClient } from "@/components/exam/ExamResultsClient";

export function generateStaticParams() {
  return [{ set: "a" }, { set: "b" }, { set: "c" }, { set: "d" }, { set: "e" }, { set: "f" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  return <ExamResultsClient set={set} />;
}
