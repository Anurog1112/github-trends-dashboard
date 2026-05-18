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

interface TopLanguagesProps {
  languages: TopLanguage[];
  loading: boolean;
}

export function TopLanguages({ languages, loading }: TopLanguagesProps) {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-gray-900">Top Languages</h2>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
          Global
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Based on top 100 most starred repositories
      </p>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : languages.length === 0 ? (
        <EmptyState title="No language data" message="Data unavailable" />
      ) : (
        <div className="flex flex-col gap-4">
          {languages.map((lang) => (
            <div key={lang.name}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-4">#{lang.rank}</span>
                  <span className="text-sm text-gray-700 font-medium">{lang.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{lang.count} repos</span>
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">
                    {lang.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${lang.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}