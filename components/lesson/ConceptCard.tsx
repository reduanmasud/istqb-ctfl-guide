import { Markdown } from "@/components/Markdown";

interface Props {
  concept: string;
  keyPoints: string[];
}

export function ConceptCard({ concept, keyPoints }: Props) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-5 w-1 rounded-full bg-blue-500 shrink-0" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Concept
        </h2>
      </div>
      <div className="text-slate-700 text-base mb-5">
        <Markdown>{concept}</Markdown>
      </div>
      <div className="border-t border-blue-50 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-5 w-1 rounded-full bg-green-500 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-green-700">
            Key Points
          </h3>
        </div>
        <ul className="space-y-2">
          {keyPoints.map((pt, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-base text-slate-700 leading-relaxed"
            >
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
              <span>
                <Markdown variant="inline">{pt}</Markdown>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
