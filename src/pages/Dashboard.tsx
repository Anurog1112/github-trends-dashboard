import { useState, useEffect } from "react";
import { Navbar } from "../components/layout";
import { TopRepos, TrendingRepos } from "../components/sections";
import { TopLanguages, calculateTopLanguages } from "../components/sections/TopLanguages";
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
    <div className="min-h-screen bg-gray-100">
      <Navbar onSearch={handleSearch} onClear={loadDefault} />

      <main className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">

        {appState === "loading" && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Loading...
          </div>
        )}

        {appState === "rate_limit" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="font-bold text-yellow-800">⚠️ API Rate Limit Exceeded</p>
            <p className="text-sm text-yellow-700 mt-1">
              Add a GitHub Token to your .env to get 5,000 requests/hour
            </p>
          </div>
        )}

        {appState === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-semibold text-sm">⛔ {errorMessage}</p>
          </div>
        )}

        {appState === "not_found" && (
          <EmptyState title="No results found" message={errorMessage} />
        )}

        {appState === "idle" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[40%_1fr] gap-6">
              <TopLanguages
                languages={languages}
                loading={languagesLoading}
              />
              <TopRepos repos={repos} />
            </div>
            <TrendingRepos />
          </>
        )}

      </main>
    </div>
  );
}
