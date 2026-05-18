import { useState, useEffect } from "react";
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

export function TrendingRepos() {
  const [filter, setFilter] = useState<TrendingFilter>("week");
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      const data = await getTrendingRepositories(FILTER_DAYS[filter]);
      setRepos(data);
      setLoading(false);
    }

    fetchTrending();
  }, [filter]); // refetch when filter changes

  return (
    <div className="bg-white rounded-lg p-4">

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">Trending Repositories</h2>
        <div className="flex gap-1">
          {(Object.keys(FILTER_DAYS) as TrendingFilter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 text-xs rounded ${
                filter === key
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {FILTER_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
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
              className="border border-gray-200 rounded p-3 flex flex-col gap-2 hover:border-gray-400"
            >
              <span className="text-sm font-medium text-blue-600 line-clamp-1">
                {repo.name}
              </span>
              {repo.description && (
                <span className="text-xs text-gray-500 line-clamp-2">
                  {repo.description}
                </span>
              )}
              <div className="flex gap-2 text-xs text-gray-400 mt-auto">
                <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                {repo.language && <span>{repo.language}</span>}
              </div>
            </a>
          ))}
        </div>
      )}

    </div>
  );
}
