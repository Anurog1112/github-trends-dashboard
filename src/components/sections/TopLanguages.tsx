import { useState } from "react";
import type { Repository, TopLanguage } from "../../types";
import { EmptyState } from "./ui";

export function calculateTopLanguages(repos: Repository[]): TopLanguage[] {
  const langCount: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  });
  const total = Object.values(langCount).reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];
  return Object.entries(langCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
      rank: 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((lang, index) => ({ ...lang, rank: index + 1 }));
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "from-blue-500 to-blue-600",
  JavaScript: "from-yellow-400 to-yellow-500",
  Python: "from-blue-400 to-blue-500",
  Java: "from-orange-500 to-orange-600",
  Go: "from-cyan-500 to-cyan-600",
  Rust: "from-orange-600 to-red-600",
  "C++": "from-pink-500 to-pink-600",
  "C#": "from-purple-500 to-purple-600",
  PHP: "from-purple-600 to-purple-700",
  Ruby: "from-red-500 to-red-600",
  Shell: "from-green-500 to-green-600",
  Markdown: "from-slate-500 to-slate-600",
};

function getLanguageColor(lang: string): string {
  return LANGUAGE_COLORS[lang] || "from-slate-400 to-slate-500";
}

type SortOrder = "desc" | "asc";

interface TopLanguagesProps {
  languages: TopLanguage[];
  loading: boolean;
}

export function TopLanguages({ languages, loading }: TopLanguagesProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sorted = [...languages]
    .sort((a, b) =>
      sortOrder === "desc"
        ? b.percentage - a.percentage
        : a.percentage - b.percentage
    )
    .map((lang, index) => ({ ...lang, rank: index + 1 }));

  const subtitleText =
    sortOrder === "desc"
      ? "Based on top 100 most starred · Most used first"
      : "Based on top 100 most starred · Least used first";

  return (
    <div className="card-elevated p-5 flex flex-col h-full">

      {/* Header */}
      <div className="shrink-0 mb-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-slate-900">Top Languages</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  sortOrder === "asc" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4h13M3 8h9M3 12h5m8 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {sortOrder === "desc" ? "Most Used" : "Least Used"}
            </button>

            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Global
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400">{subtitleText}</p>
      </div>

      {/* Content — ← แก้ตรงนี้ ใช้ overflow-y-auto แทน overflow-hidden */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-4 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-3 bg-slate-200 rounded w-24" />
                  <div className="h-3 bg-slate-100 rounded w-16" />
                </div>
                <div className="h-2 bg-slate-100 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : languages.length === 0 ? (
          <EmptyState title="No language data" message="Data unavailable" />
        ) : (
          <div className="flex flex-col gap-5 pt-1">
            {sorted.map((lang, idx) => (
              <div key={lang.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {/* Rank — ตอนนี้เริ่มจาก #1 เสมอ ไม่ถูกบัง */}
                    <span className="text-xs font-bold text-slate-300 w-5">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {lang.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">{lang.count} repos</span>
                    <span className="font-bold text-blue-600 w-8 text-right">
                      {lang.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getLanguageColor(lang.name)}`}
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
