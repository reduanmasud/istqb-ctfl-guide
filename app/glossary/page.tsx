"use client";
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import glossaryData from "@/content/glossary.json";
import chaptersData from "@/content/chapters.json";
import type { GlossaryTerm, ChapterMeta } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Search, X } from "lucide-react";
import Link from "next/link";

const glossary = glossaryData as GlossaryTerm[];
const chapters = chaptersData as ChapterMeta[];

const CHAPTER_COLORS: Record<number, string> = {
  1: "bg-blue-100 text-blue-700",
  2: "bg-purple-100 text-purple-700",
  3: "bg-green-100 text-green-700",
  4: "bg-orange-100 text-orange-700",
  5: "bg-amber-100 text-amber-700",
  6: "bg-red-100 text-red-700",
  7: "bg-teal-100 text-teal-700",
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [filterChapter, setFilterChapter] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let terms = glossary;
    if (filterChapter !== null)
      terms = terms.filter((t) => t.chapter === filterChapter);
    if (search.trim()) {
      const q = search.toLowerCase();
      terms = terms.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      );
    }
    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [search, filterChapter]);

  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    filtered.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    });
    return map;
  }, [filtered]);

  const letters = Object.keys(grouped).sort();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Glossary</h1>
        <p className="text-slate-500 text-sm mb-6">
          {glossary.length} terms from the official ISTQB CTFL v4.0 syllabus
        </p>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms or definitions…"
              className="w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterChapter(null)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                filterChapter === null
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-blue-700 hover:bg-blue-50 border border-blue-100"
              )}
            >
              All
            </button>
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() =>
                  setFilterChapter(filterChapter === ch.id ? null : ch.id)
                }
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  filterChapter === ch.id
                    ? cn(CHAPTER_COLORS[ch.id], "ring-2 ring-offset-1 ring-current")
                    : "text-slate-500 hover:text-blue-700 hover:bg-blue-50 border border-blue-100"
                )}
              >
                Ch {ch.id}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            No terms match your search.
          </p>
        )}

        {/* Alphabetical groups */}
        <div className="flex flex-col gap-8">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 pb-2 border-b border-blue-100">
                {letter}
              </h2>
              <div className="flex flex-col gap-3">
                {grouped[letter].map((term) => (
                  <div
                    key={term.term}
                    className="rounded-xl border border-blue-100 bg-white shadow-sm p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {term.term}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-bold",
                            CHAPTER_COLORS[term.chapter] ??
                              "bg-slate-100 text-slate-600"
                          )}
                        >
                          Ch {term.chapter}
                        </span>
                        {term.relatedLo && (
                          <Link
                            href={`/chapter/${term.chapter}/lesson/${term.relatedLo}`}
                            className="text-[10px] font-mono text-blue-600 hover:underline"
                          >
                            {term.relatedLo.toUpperCase()}
                          </Link>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
