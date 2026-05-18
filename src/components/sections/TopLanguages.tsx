import type { Repository, TopLanguage } from "../../types";
import { EmptyState } from "./ui";

interface TopLanguagesProps {
  repos: Repository[];
}

function calculateTopLanguages(repos: Repository[]): TopLanguage[] {
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

export function TopLanguages({ repos }: TopLanguagesProps) {
  const languages = calculateTopLanguages(repos);

  if (languages.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4">
        <h2 className="font-bold text-gray-900 mb-4">Top Languages</h2>
        <EmptyState
          title="No language data"
          message="Language info unavailable for these repositories"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="font-bold text-gray-900 mb-4">Top Languages</h2>

      {languages.length === 0 ? (
        <p className="text-sm text-gray-400">No data</p>
      ) : (
        <div className="flex flex-col gap-3">
          {languages.map((lang) => (
            <div key={lang.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{lang.name}</span>
                <span className="text-gray-500">{lang.percentage}%</span>
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
