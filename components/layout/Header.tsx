"use client";
import Link from "next/link";
import { BookOpen, GraduationCap, BookMarked } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: BookOpen },
  { href: "/exam", label: "Mock Exam", icon: GraduationCap },
  { href: "/glossary", label: "Glossary", icon: BookMarked },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-slate-900"
        >
          <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold text-white tracking-wide">
            CTFL
          </span>
          <span className="hidden sm:inline text-slate-700">v4.0 Study Guide</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
