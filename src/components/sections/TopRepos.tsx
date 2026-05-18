import type { Repository } from "../../types";
import { EmptyState } from "./ui";

interface TopReposProps {
  repos: Repository[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#DEA584",
  "C++": "#F34B7D",
  CSS: "#663399",
  Shell: "#89E051",
  Markdown: "#083FA1",
};

export function TopRepos({ repos }: TopReposProps) {
  const sorted = [...repos].sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  );

  if (sorted.length === 0) {
    return (
      <div className="card-elevated p-5 flex flex-col h-full">
        <h2 className="text-base font-bold text-slate-900 mb-4 shrink-0">
          Top Repositories
        </h2>
        <EmptyState
          title="No repositories found"
          message="Try searching for something else"
        />
      </div>
    );
  }

  return (
    <div className="card-elevated p-5 flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Top Repositories
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Most starred on GitHub</p>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
          {sorted.length} repos
        </span>
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-1" style={{ maxHeight: "410px" }}>
        {sorted.map((repo, idx) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 shrink-0"
          >
          
            <span className="text-xs font-bold text-slate-300 w-5 pt-1 shrink-0">
              {idx + 1}
            </span>

            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://github.com/ghost.png";
              }}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 truncate transition-colors">
                {repo.full_name}
              </p>
              {repo.description && (
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                  <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {formatNumber(repo.stargazers_count)}
                </span>
                <span className="text-xs text-slate-500">
                  🍴 {formatNumber(repo.forks_count)}
                </span>
                {repo.language && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: LANG_COLORS[repo.language] ?? "#94A3B8",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="text-xs text-slate-400 ml-auto shrink-0">
                  {formatDate(repo.updated_at)}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {sorted.length > 5 && (
        <p className="text-xs text-slate-400 text-center mt-2 shrink-0">
          ↕ Scroll to see all {sorted.length} repositories
        </p>
      )}

    </div>
  );
}