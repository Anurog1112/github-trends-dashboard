import { useState, useEffect, useRef } from "react";
import { getTrendingRepositories } from "../../services/github";
import type { Repository } from "../../types";
import { EmptyState } from "./ui";

type TrendingFilter = "today" | "week" | "month";

const FILTER_DAYS: Record<TrendingFilter, number> = {
  today: 1,
  week: 7,
  month: 30,
};

const FILTER_LABELS: Record<TrendingFilter, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#DEA584",
  "C++": "#F34B7D",
  CSS: "#663399",
  Shell: "#89E051",
};

export function TrendingRepos() {
  const [filter, setFilter] = useState<TrendingFilter>("week");
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError("");

      try {
        const data = await getTrendingRepositories(FILTER_DAYS[filter]);
        setRepos(data);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "AbortError") return;
          setError(err.message);
        }
        setRepos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, [filter]);

  return (
    <div className="card-elevated p-5 flex flex-col h-full overflow-hidden">

      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Trending Repositories
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            New repos with the fastest growing stars —{" "}
            {filter === "today"
              ? "last 24 hours"
              : filter === "week"
              ? "last 7 days"
              : "last 30 days"}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(Object.keys(FILTER_DAYS) as TrendingFilter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                filter === key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {FILTER_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 h-full">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-full min-h-24 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm font-medium">⛔ {error}</p>
          </div>
        ) : repos.length === 0 ? (
          <EmptyState
            title="No trending repositories"
            message="No new repositories found for this period"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-2 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
              >
                {/* Owner + Stars */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={repo.owner.avatar_url}
                      alt={repo.owner.login}
                      className="w-5 h-5 rounded-full shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://github.com/ghost.png";
                      }}
                    />
                    <span className="text-xs text-slate-500 truncate">
                      {repo.owner.login}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold shrink-0">
                    <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {repo.stargazers_count.toLocaleString()}
                  </span>
                </div>

                <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 line-clamp-1 transition-colors">
                  {repo.name}
                </p>

                {repo.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 flex-1 leading-relaxed">
                    {repo.description}
                  </p>
                )}

                {repo.language && (
                  <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-slate-100">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          LANG_COLORS[repo.language] ?? "#94A3B8",
                      }}
                    />
                    <span className="text-xs text-slate-500">
                      {repo.language}
                    </span>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}