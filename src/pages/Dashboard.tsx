import { useState, useEffect } from "react";
import { Navbar } from "../components/layout";
import { TopRepos, TrendingRepos } from "../components/sections";
import {
  TopLanguages,
  calculateTopLanguages,
} from "../components/sections/TopLanguages";
import { EmptyState } from "../components/sections/ui";
import {
  searchRepositories,
  getUserRepos,
  getRepo,
  getTopRepositories,
} from "../services/github";
import type { Repository, TopLanguage } from "../types";
import type { SearchMode } from "../components/layout";

type AppState = "idle" | "loading" | "error" | "rate_limit" | "not_found";

export default function Dashboard() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [appState, setAppState] = useState<AppState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [languages, setLanguages] = useState<TopLanguage[]>([]);
  const [languagesLoading, setLanguagesLoading] = useState<boolean>(true);


  useEffect(() => {
    async function fetchLanguages() {
      try {
        const data = await getTopRepositories();
        setLanguages(calculateTopLanguages(data));
      } catch {
        setLanguages([]);
      } finally {
        setLanguagesLoading(false);
      }
    }
    fetchLanguages();
  }, []);

  useEffect(() => {
    loadDefault();
  }, []);

  async function loadDefault() {
    setAppState("loading");
    setErrorMessage("");
    try {
      const data = await searchRepositories("stars:>100000");
      setRepos(data);
      setAppState("idle");
    } catch (err) {
      handleError(err);
    }
  }

  function handleError(err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes("403")) {
        setAppState("rate_limit");
      } else if (err.message.includes("404")) {
        setAppState("not_found");
        setErrorMessage("Not found");
      } else {
        setAppState("error");
        setErrorMessage(err.message);
      }
    }
  }

  async function handleSearch(mode: SearchMode) {
    if (mode.type === "invalid") {
      setAppState("error");
      setErrorMessage(mode.reason);
      return;
    }

    setAppState("loading");
    setErrorMessage("");

    try {
      if (mode.type === "fullRepo") {
        const repo = await getRepo(mode.owner, mode.repo);
        setRepos([repo]);
        setAppState("idle");
      } else {
        try {
          const data = await getUserRepos(mode.query);
          if (data.length > 0) {
            setRepos(data);
            setAppState("idle");
            return;
          }
        } catch {
          // 404 → fallback
        }

        const data = await searchRepositories(mode.query);
        if (data.length === 0) {
          setAppState("not_found");
          setErrorMessage(`No results for "${mode.query}"`);
          return;
        }
        setRepos(data);
        setAppState("idle");
      }
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar onSearch={handleSearch} onClear={loadDefault} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">

        {/* Loading */}
        {appState === "loading" && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
              <p className="text-sm text-slate-500 font-medium">
                Loading trending data...
              </p>
            </div>
          </div>
        )}

        {/* Rate Limit */}
        {appState === "rate_limit" && (
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0">⚠️</span>
              <div>
                <h3 className="font-bold text-amber-900 text-lg">
                  API Rate Limit Exceeded
                </h3>
                <p className="text-amber-800 text-sm mt-1 leading-relaxed">
                  Add a GitHub personal access token to your{" "}
                  <code className="bg-amber-100 px-2 py-0.5 rounded text-xs">
                    .env
                  </code>{" "}
                  file to get 5,000 requests/hour.
                </p>
                <a
                  href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-700 text-xs mt-2 inline-block hover:underline"
                >
                  📚 Learn how to create a token →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {appState === "error" && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0">❌</span>
              <div>
                <h3 className="font-bold text-red-900 text-lg">
                  Something went wrong
                </h3>
                <p className="text-red-800 text-sm mt-1">{errorMessage}</p>
                <button
                  onClick={loadDefault}
                  className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Not Found */}
        {appState === "not_found" && (
          <div className="card-elevated p-8 text-center">
            <EmptyState
              title="No results found"
              message={errorMessage || "Try adjusting your search terms"}
            />
            <button
              onClick={loadDefault}
              className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Trending
            </button>
          </div>
        )}

        {/* Content */}
        {appState === "idle" && (
          <div className="space-y-6">
            {/* Top Section — ไม่มี items-start scroll อยู่ในกล่อง */}
            <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-6">
              <TopLanguages
                languages={languages}
                loading={languagesLoading}
              />
              <TopRepos repos={repos} />
            </div>

            <TrendingRepos />
          </div>
        )}

      </main>
    </div>
  );
}