import { useState } from "react";
import GitHubLogo from "../../assets/GitHub_Invertocat_Logo.svg";

export type SearchMode =
  | { type: "fullRepo"; owner: string; repo: string }
  | { type: "smartSearch"; query: string }
  | { type: "invalid"; reason: string };

export function detectSearchMode(query: string): SearchMode {
  const trimmed = query.trim();

  if (!trimmed) {
    return { type: "invalid", reason: "Please enter a search term" };
  }

  const fullRepoPattern = /^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/;
  const fullRepoMatch = trimmed.match(fullRepoPattern);
  if (fullRepoMatch) {
    return {
      type: "fullRepo",
      owner: fullRepoMatch[1],
      repo: fullRepoMatch[2],
    };
  }

  if (trimmed.includes("/")) {
    return {
      type: "invalid",
      reason: 'Invalid format. Use "owner/repo" for full repository search',
    };
  }

  return { type: "smartSearch", query: trimmed };
}

interface NavbarProps {
  onSearch: (mode: SearchMode) => void;
  onClear: () => void;
}

export function Navbar({ onSearch, onClear }: NavbarProps) {
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    if (value === "") {
      onClear();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const mode = detectSearchMode(query);
    onSearch(mode);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 h-16">

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-sm">
              <img src={GitHubLogo} alt="GitHub" className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                GitHub Trends
              </h1>
              <p className="text-xs text-slate-400 leading-tight">
                Discover trending repositories
              </p>
            </div>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 items-center gap-2 max-w-2xl mx-auto"
          >
            <div
              className={`flex-1 relative rounded-xl transition-all duration-200 ${
                isFocused
                  ? "ring-2 ring-blue-500 ring-offset-1"
                  : "ring-1 ring-slate-200"
              }`}
            >
              {/* Search Icon */}
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search: vercel, react, facebook/react..."
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white focus:outline-none text-slate-900 placeholder-slate-400"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    onClear();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0"
            >
              Search
            </button>
          </form>

        </div>
      </div>
    </nav>
  );
}