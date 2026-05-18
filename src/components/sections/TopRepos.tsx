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
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function TopRepos({ repos }: TopReposProps) {
  const sorted = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);
    
  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4">
        <h2 className="font-bold text-gray-900 mb-4">Top Repositories</h2>
        <EmptyState
          title="No repositories found"
          message="Try searching for something else"
        />
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="font-bold text-gray-900 mb-4">Top Repositories</h2>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400">No data</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {sorted.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-1 py-3 hover:bg-gray-50 px-2 rounded"
            >
              <span className="text-sm font-medium text-blue-600">
                {repo.full_name}
              </span>

              {repo.description && (
                <span className="text-xs text-gray-500 line-clamp-2">
                  {repo.description}
                </span>
              )}

              <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">

                <span className="flex items-center gap-1">
                  ⭐ {formatNumber(repo.stargazers_count)}
                </span>

                <span className="flex items-center gap-1">
                  🍴 {formatNumber(repo.forks_count)}
                </span>

                {repo.language && (
                  <span className="flex items-center gap-1">
                    💻 {repo.language}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  🕒 {formatDate(repo.updated_at)}
                </span>

              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
